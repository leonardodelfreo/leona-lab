const https = require("https");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

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

function loadCatalog() {
  const src = fs.readFileSync(path.join(__dirname, "..", "backend", "server.js"), "utf8");
  const start = src.indexOf("const ASSET_CATALOG = [");
  const end = src.indexOf("\n];", start) + 3;
  const block = src.slice(start, end);
  const sandbox = { ASSET_CATALOG: null };
  vm.runInNewContext(block + "\nthis.ASSET_CATALOG = ASSET_CATALOG;", sandbox);
  return sandbox.ASSET_CATALOG;
}

function getNames(asset) {
  const names = [];
  if (Array.isArray(asset?.cotMarkets)) names.push(...asset.cotMarkets);
  if (asset?.cotMarket) names.push(asset.cotMarket);
  return [...new Set(names.filter(Boolean))];
}

async function probe(name) {
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=report_date_as_yyyy_mm_dd,open_interest_all" +
    `&$where=${encodeURIComponent(`market_and_exchange_names='${name}'`)}` +
    "&$order=report_date_as_yyyy_mm_dd DESC&$limit=1";
  const data = await fetchJson(url);
  if (!Array.isArray(data) || !data[0]) return null;
  return {
    latest: String(data[0].report_date_as_yyyy_mm_dd || "").slice(0, 10),
    oi: Number(data[0].open_interest_all) || 0,
  };
}

async function main() {
  const catalog = loadCatalog();
  for (const asset of catalog) {
    const names = getNames(asset);
    if (!names.length) {
      console.log(`${asset.id.padEnd(10)} SKIP  (no CFTC market)`);
      continue;
    }
    let best = null;
    for (const name of names) {
      const r = await probe(name);
      if (!r) continue;
      if (!best || r.latest > best.latest) best = { ...r, name };
      if (r.latest >= "2026-06-01") break;
    }
    if (!best) {
      console.log(`${asset.id.padEnd(10)} FAIL  names tried: ${names.join(" | ")}`);
      continue;
    }
    const age = Math.round((Date.now() - Date.parse(best.latest)) / 86400000);
    const flag = age <= 45 ? "OK" : "STALE";
    console.log(`${asset.id.padEnd(10)} ${flag.padEnd(5)} d=${age} latest=${best.latest} oi=${best.oi} | ${best.name}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
