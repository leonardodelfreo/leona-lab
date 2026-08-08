/**
 * Capture dashboard stills for pitch reel crops.
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.LEONA_BASE || "http://127.0.0.1:8787";
const OUT = "/tmp/reel-assets";
const VIEW_W = 1440;
const VIEW_H = 900;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: "leona", password: "leona123" }),
  }).then((r) => r.json());
  if (!login?.token) throw new Error("login failed");

  await fetch(`${BASE}/api/bootstrap?asset=XAUUSD`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).catch(() => null);
  await fetch(`${BASE}/api/news/breaking`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).catch(() => null);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: VIEW_W, height: VIEW_H } });
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => localStorage.setItem("leona_lab_auth_token", token), login.token);
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle", timeout: 90000 });
  await sleep(2500);

  // COT
  await page.locator("#tabCot").click();
  await sleep(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  await page.screenshot({ path: path.join(OUT, "dash-cot.png"), type: "png" });
  console.log("dash-cot");

  // Seasonality chart (top)
  await page.locator("#tabSeasonality").click();
  await sleep(2800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  await page.screenshot({ path: path.join(OUT, "dash-seasonality.png"), type: "png" });
  console.log("dash-seasonality");

  // Timing table
  const dayTiming = page.locator(".seasonality-day-timing");
  if ((await dayTiming.count()) > 0) {
    await dayTiming.first().scrollIntoViewIfNeeded();
    await sleep(1200);
  } else {
    await page.evaluate(() => window.scrollBy(0, 700));
    await sleep(1000);
  }
  await page.screenshot({ path: path.join(OUT, "dash-timing.png"), type: "png" });
  console.log("dash-timing");

  // News
  await page.locator("#tabNews").click();
  await sleep(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  await page.screenshot({ path: path.join(OUT, "dash-news.png"), type: "png" });
  console.log("dash-news");

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
