function getFfWeekParam(d = new Date()) {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = Object.fromEntries(
    fmt
      .formatToParts(d)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  );
  const y = +parts.year;
  const m = +parts.month;
  const day = +parts.day;
  const utcNoon = Date.UTC(y, m - 1, day, 12);
  const dow = new Date(utcNoon).getUTCDay();
  const sun = new Date(Date.UTC(y, m - 1, day - dow, 12));
  return `${months[sun.getUTCMonth()]}${sun.getUTCDate()}.${sun.getUTCFullYear()}`;
}

function cleanCell(s) {
  return String(s || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function parseFfMarkdown(md, yearHint = new Date().getFullYear()) {
  const lines = String(md || "").split(/\n/);
  let currentDay = null;
  let year = yearHint;
  const ym = String(md || "").match(/week=([a-z]+)(\d+)\.(\d{4})/i);
  if (ym) year = +ym[3];
  const out = [];
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  for (const line of lines) {
    if (!line.includes("|")) continue;
    if (/Date\s*\|/.test(line) || /^\|\s*-+/.test(line)) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 8) continue;

    let dayCell = cleanCell(cells[1]);
    let time = cleanCell(cells[2]);
    let ccy = cleanCell(cells[3]).toUpperCase();
    let titleIdx = 5;
    let actualIdx = 8;
    let forecastIdx = 9;
    let prevIdx = 10;

    const dayMatch = dayCell.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)?\s*([A-Za-z]{3})\s+(\d{1,2})/i);
    if (dayMatch) {
      currentDay = { m: monthMap[dayMatch[1].toLowerCase()], d: +dayMatch[2] };
    }

    if (/^\d{1,2}:\d{2}(am|pm)$/i.test(dayCell) || /^All Day$/i.test(dayCell)) {
      time = dayCell;
      ccy = cleanCell(cells[2]).toUpperCase();
      titleIdx = 4;
      actualIdx = 7;
      forecastIdx = 8;
      prevIdx = 9;
    } else if (dayCell === "" && (/^\d{1,2}:\d{2}(am|pm)$/i.test(time) || /^All Day$/i.test(time))) {
      // standard continuation row
    }

    const title = cleanCell(cells[titleIdx]);
    if (!title || !/^(USD|EUR|GBP|JPY|AUD|CAD|CHF|NZD)$/.test(ccy)) continue;
    if (!currentDay) continue;

    const actual = cleanCell(cells[actualIdx]);
    const forecast = cleanCell(cells[forecastIdx]);
    const previous = cleanCell(cells[prevIdx]);

    let hours = 12;
    let minutes = 0;
    const tm = String(time || "").match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
    if (tm) {
      hours = (+tm[1]) % 12;
      if (tm[3].toLowerCase() === "pm") hours += 12;
      minutes = +tm[2];
    }
    const iso = `${year}-${String(currentDay.m + 1).padStart(2, "0")}-${String(currentDay.d).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00-04:00`;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) continue;
    out.push({
      country: ccy,
      event: title,
      date,
      previous: previous || "--",
      forecast: forecast || "--",
      actual: actual || "--",
    });
  }
  return out;
}

(async () => {
  const week = getFfWeekParam(new Date());
  console.log("week", week);
  const url = `https://r.jina.ai/http://www.forexfactory.com/calendar?week=${week}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(45000) });
  const md = await r.text();
  const rows = parseFfMarkdown(md);
  console.log("parsed", rows.length);
  const withA = rows.filter((x) => x.actual && x.actual !== "--");
  console.log("withActual", withA.length);
  console.log(withA.slice(0, 10));
  console.log(
    "retail",
    rows.find((x) => /German Retail/i.test(x.event))
  );
})();
