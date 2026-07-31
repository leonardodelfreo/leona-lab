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
    "&$order=count DESC" +
    "&$limit=30";
  return fetchJson(url);
}

async function main() {
  for (const term of ["STOXX", "MSCI", "EURO FX", "BRITISH", "TURK", "KRONE", "KRONA", "RAND", "RENMINBI", "CNH"]) {
    console.log(`\n### ${term}`);
    const rows = await search(term);
    (Array.isArray(rows) ? rows : []).slice(0, 12).forEach((r) => {
      console.log(`  ${String(r.count).padStart(5)}  ${String(r.latest).slice(0, 10)}  ${r.market_and_exchange_names}`);
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
