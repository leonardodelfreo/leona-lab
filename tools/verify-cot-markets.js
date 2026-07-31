const https = require("https");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Accept: "application/json" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(d) });
          } catch (e) {
            reject(new Error(`parse fail ${res.statusCode}: ${d.slice(0, 400)}`));
          }
        });
      })
      .on("error", reject);
  });
}

const candidates = {
  XPDUSD: ["PALLADIUM - NEW YORK MERCANTILE EXCHANGE"],
  SOYMEAL: ["SOYBEAN MEAL - CHICAGO BOARD OF TRADE"],
  SOYOIL: ["SOYBEAN OIL - CHICAGO BOARD OF TRADE"],
  OATS: ["OATS - CHICAGO BOARD OF TRADE"],
  DOW30: [
    "DJIA x $5 - CHICAGO BOARD OF TRADE",
    "DOW JONES INDUSTRIAL AVG- x $5 - CHICAGO BOARD OF TRADE",
    "DOW JONES INDUSTRIAL AVERAGE - CHICAGO BOARD OF TRADE",
  ],
  RUS2000: [
    "E-MINI RUSSELL 2000 INDEX - CHICAGO MERCANTILE EXCHANGE",
    "RUSSELL E-MINI - CHICAGO MERCANTILE EXCHANGE",
    "RUSSELL 2000 MINI INDEX FUTURE - ICE FUTURES U.S.",
  ],
  NIKKEI225: [
    "NIKKEI STOCK AVERAGE - CHICAGO MERCANTILE EXCHANGE",
    "NIKKEI STOCK AVERAGE YEN DENOM - CHICAGO MERCANTILE EXCHANGE",
  ],
  USDZAR: [
    "SOUTH AFRICAN RAND - CHICAGO MERCANTILE EXCHANGE",
    "SOUTH AFRICAN RAND - INTERNATIONAL MONETARY MARKET",
  ],
  USDCNH: [
    "USD/CHINESE RENMINBI-OFFSHORE - CHICAGO MERCANTILE EXCHANGE",
    "CHINESE RENMINBI-HK (CNH) - CHICAGO MERCANTILE EXCHANGE",
  ],
  USDTRY: ["TURKISH LIRA - CHICAGO MERCANTILE EXCHANGE", "TURKISH LIRA - INTERNATIONAL MONETARY MARKET"],
  USDNOK: ["NORWEGIAN KRONE - CHICAGO MERCANTILE EXCHANGE", "NORWEGIAN KRONE - INTERNATIONAL MONETARY MARKET"],
  USDSEK: ["SWEDISH KRONA - CHICAGO MERCANTILE EXCHANGE", "SWEDISH KRONA - INTERNATIONAL MONETARY MARKET"],
  DAX40: ["DAX INDEX FUTURE - EUREX", "GERMAN EURO STOXX 50", "EURO STOXX 50 - EUREX"],
  FTSE100: ["FTSE 100 INDEX - ICE FUTURES EUROPE", "FTSE 100 - ICE FUTURES EUROPE"],
  HANGSENG: ["HANG SENG INDEX - HONG KONG", "HANG SENG - HONG KONG FUTURES"],
};

async function probeMarket(name) {
  const whereExpr = `market_and_exchange_names='${name}'`;
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=report_date_as_yyyy_mm_dd,open_interest_all,noncomm_positions_long_all,noncomm_positions_short_all,comm_positions_long_all,comm_positions_short_all,nonrept_positions_long_all,nonrept_positions_short_all" +
    `&$where=${encodeURIComponent(whereExpr)}` +
    "&$order=report_date_as_yyyy_mm_dd DESC" +
    "&$limit=5";
  const { data } = await fetchJson(url);
  if (!Array.isArray(data) || !data.length) return { name, ok: false, rows: 0 };
  const latest = data[0];
  const oi = Number(latest.open_interest_all);
  return {
    name,
    ok: Number.isFinite(oi) && oi > 0,
    rows: data.length,
    latest: latest.report_date_as_yyyy_mm_dd,
    oi,
  };
}

async function searchLike(term) {
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=market_and_exchange_names,count(*)" +
    "&$group=market_and_exchange_names" +
    `&$where=${encodeURIComponent(`upper(market_and_exchange_names) like '%${term}%'`)}` +
    "&$order=count DESC" +
    "&$limit=20";
  const { data } = await fetchJson(url);
  return Array.isArray(data) ? data : [];
}

async function main() {
  for (const [asset, names] of Object.entries(candidates)) {
    console.log(`\n=== ${asset} ===`);
    let best = null;
    for (const name of names) {
      try {
        const r = await probeMarket(name);
        console.log(
          r.ok
            ? `  OK  ${r.rows} rows | latest ${r.latest} | OI ${r.oi} | ${r.name}`
            : `  --  ${r.rows} rows | ${r.name}`
        );
        if (r.ok && (!best || r.oi > best.oi)) best = r;
      } catch (e) {
        console.log(`  ERR ${name}: ${e.message}`);
      }
    }
    if (!best && ["USDTRY", "USDNOK", "USDSEK", "DAX40", "FTSE100", "HANGSENG"].includes(asset)) {
      const term =
        asset === "USDTRY"
          ? "TURKISH"
          : asset === "USDNOK"
            ? "NORWEGIAN"
            : asset === "USDSEK"
              ? "SWEDISH"
              : asset === "DAX40"
                ? "DAX"
                : asset === "FTSE100"
                  ? "FTSE"
                  : "HANG";
      const hits = await searchLike(term);
      hits.slice(0, 8).forEach((h) => console.log(`  hit ${h.count}  ${h.market_and_exchange_names}`));
    }
    if (best) console.log(`  BEST -> ${best.name}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
