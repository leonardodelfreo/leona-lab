const https = require("https");
const fs = require("fs");
const path = require("path");

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

async function probe(name) {
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=report_date_as_yyyy_mm_dd,open_interest_all" +
    `&$where=${encodeURIComponent(`market_and_exchange_names='${name}'`)}` +
    "&$order=report_date_as_yyyy_mm_dd DESC&$limit=1";
  const data = await fetchJson(url);
  if (!Array.isArray(data) || !data[0]) return { name, latest: null, oi: 0 };
  return {
    name,
    latest: String(data[0].report_date_as_yyyy_mm_dd || "").slice(0, 10),
    oi: Number(data[0].open_interest_all) || 0,
  };
}

function loadCatalog() {
  const src = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  const start = src.indexOf("const ASSET_CATALOG = [");
  const end = src.indexOf("];", start);
  const block = src.slice(start, end);
  const re =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?cotMarket:\s*(null|"[^"]+")/g;
  const out = [];
  let m;
  while ((m = re.exec(block))) {
    out.push({
      id: m[1],
      cotMarket: m[2] === "null" ? null : m[2].slice(1, -1),
    });
  }
  return out;
}

async function main() {
  const catalog = loadCatalog();
  for (const a of catalog) {
    if (!a.cotMarket) {
      console.log(`${a.id.padEnd(10)} NULL`);
      continue;
    }
    try {
      const r = await probe(a.cotMarket);
      const ageDays = r.latest ? Math.round((Date.now() - Date.parse(r.latest)) / 86400000) : null;
      const flag = !r.latest ? "EMPTY" : ageDays > 60 ? "STALE" : "OK";
      console.log(`${a.id.padEnd(10)} ${flag.padEnd(5)} latest=${r.latest || "--"} oi=${r.oi} | ${a.cotMarket}`);
    } catch (e) {
      console.log(`${a.id.padEnd(10)} ERR   ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
