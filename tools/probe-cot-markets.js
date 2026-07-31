const https = require("https");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(new Error(`parse fail ${res.statusCode}: ${d.slice(0, 400)}`));
          }
        });
      })
      .on("error", reject);
  });
}

const needles = [
  "PALLADIUM",
  "SOYBEAN MEAL",
  "SOYBEAN OIL",
  "OATS",
  "DJIA",
  "DOW JONES",
  "RUSSELL",
  "NIKKEI",
  "NORWEGIAN",
  "SWEDISH",
  "TURKISH",
  "SOUTH AFRICAN",
  "RENMINBI",
  "CHINESE",
  "FTSE",
  "DAX",
  "HANG SENG",
  "E-MINI DOW",
  "MICRO E-MINI",
];

async function main() {
  const where = needles.map((n) => `upper(market_and_exchange_names) like '%${n}%'`).join(" OR ");
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=market_and_exchange_names,count(*)" +
    "&$group=market_and_exchange_names" +
    `&$where=${encodeURIComponent(where)}` +
    "&$order=market_and_exchange_names" +
    "&$limit=500";
  const rows = await fetchJson(url);
  if (!Array.isArray(rows)) {
    console.log(rows);
    return;
  }
  rows
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
    .forEach((r) => console.log(`${String(r.count).padStart(6)}  ${r.market_and_exchange_names}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
