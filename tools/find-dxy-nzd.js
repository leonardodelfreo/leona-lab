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
            reject(new Error(d.slice(0, 400)));
          }
        });
      })
      .on("error", reject);
  });
}

async function search(where) {
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=market_and_exchange_names,max(report_date_as_yyyy_mm_dd) as latest,count(*)" +
    "&$group=market_and_exchange_names" +
    `&$where=${encodeURIComponent(where)}` +
    "&$order=latest DESC&$limit=50";
  return fetchJson(url);
}

async function main() {
  const queries = [
    "upper(market_and_exchange_names) like '%DOLLAR%INDEX%'",
    "upper(market_and_exchange_names) like '%USD INDEX%'",
    "upper(market_and_exchange_names) like '%USDX%'",
    "upper(market_and_exchange_names) like '%NEW ZEALAND%'",
    "upper(market_and_exchange_names) like '%NZ DOLLAR%'",
    "upper(market_and_exchange_names) like '%NZD%'",
    "upper(market_and_exchange_names) like '%KIWI%'",
  ];
  for (const q of queries) {
    console.log(`\n### ${q}`);
    const rows = await search(q);
    (Array.isArray(rows) ? rows : []).slice(0, 20).forEach((r) => {
      console.log(`  ${String(r.latest).slice(0, 10)}  n=${String(r.count).padStart(4)}  ${r.market_and_exchange_names}`);
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
