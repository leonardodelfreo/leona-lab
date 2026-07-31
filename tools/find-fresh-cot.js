const https = require("https");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Accept: "application/json" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(new Error(d.slice(0, 300)));
          }
        });
      })
      .on("error", reject);
  });
}

async function search(term) {
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=market_and_exchange_names,max(report_date_as_yyyy_mm_dd) as latest,count(*)" +
    "&$group=market_and_exchange_names" +
    `&$where=${encodeURIComponent(`upper(market_and_exchange_names) like '%${term}%'`)}` +
    "&$order=latest DESC" +
    "&$limit=40";
  return fetchJson(url);
}

async function main() {
  for (const term of [
    "DOLLAR INDEX",
    "U.S. DOLLAR",
    "BRITISH POUND",
    "NEW ZEALAND",
    "S&P 500",
    "NASDAQ",
    "COPPER",
    "DJIA",
    "RUSSELL",
    "PALLADIUM",
    "SOYBEAN MEAL",
    "SOYBEAN OIL",
    "OATS",
    "NIKKEI",
    "SO AFRICAN",
    "SOUTH AFRICAN",
  ]) {
    console.log(`\n### ${term}`);
    const rows = await search(term);
    (Array.isArray(rows) ? rows : [])
      .filter((r) => String(r.latest || "").startsWith("202") || String(r.latest || "").startsWith("2026") || String(r.latest || "").startsWith("2025") || String(r.latest || "").startsWith("2024"))
      .slice(0, 15)
      .forEach((r) => {
        console.log(`  ${String(r.latest).slice(0, 10)}  n=${String(r.count).padStart(4)}  ${r.market_and_exchange_names}`);
      });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
