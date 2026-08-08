/**
 * Capture crisp full-page screenshots of every Leona.Lab page.
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.LEONA_BASE || "http://127.0.0.1:8787";
const OUT = path.join(__dirname, "..", "assets", "screenshots", "pages");
const ART = "/opt/cursor/artifacts/app-screens";

const VIEW_W = 1600;
const VIEW_H = 1000;
const SCALE = 2; // crisp text

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name, { fullPage = true } = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({
    path: file,
    type: "png",
    fullPage,
    animations: "disabled",
  });
  fs.copyFileSync(file, path.join(ART, `${name}.png`));
  const st = fs.statSync(file);
  console.log(`saved ${name}.png (${Math.round(st.size / 1024)}KB) fullPage=${fullPage}`);
  return file;
}

async function waitSettled(page, ms = 1200) {
  await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => null);
  await sleep(ms);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });

  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: "leona", password: "leona123" }),
  }).then((r) => r.json());
  if (!login?.token) throw new Error("login failed: " + JSON.stringify(login));

  // Warm data so desk pages look filled
  await fetch(`${BASE}/api/bootstrap?asset=XAUUSD`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).catch(() => null);
  await fetch(`${BASE}/api/news/breaking`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).catch(() => null);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VIEW_W, height: VIEW_H },
    deviceScaleFactor: SCALE,
  });
  const page = await context.newPage();

  // ---- Public pages ----
  const publicPages = [
    ["01-landing", "/"],
    ["02-login", "/login"],
    ["03-prezzi", "/prezzi"],
    ["04-registrati", "/registrati"],
    ["05-assistenza", "/assistenza"],
    ["06-privacy", "/privacy"],
    ["07-termini", "/termini"],
  ];

  for (const [name, url] of publicPages) {
    await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await waitSettled(page, 1500);
    // dismiss cookie-ish banners if any
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(300);
    await shot(page, name, { fullPage: true });
  }

  // ---- Authenticated desk ----
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => localStorage.setItem("leona_lab_auth_token", token), login.token);
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle", timeout: 90000 });
  await sleep(3000);

  const tabs = [
    ["10-app-cot", "#tabCot"],
    ["11-app-stagionalita", "#tabSeasonality"],
    ["12-app-valuation", "#tabValuation"],
    ["13-app-macro", "#tabMacro"],
    ["14-app-news", "#tabNews"],
    ["15-app-segnali", "#tabSignals"],
  ];

  for (const [name, sel] of tabs) {
    await page.locator(sel).click();
    await sleep(2800);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(800);
    // full page so entire tab content is visible
    await shot(page, name, { fullPage: true });
  }

  // Also a "viewport" hero frame of each tab (top of page, well framed desk)
  for (const [name, sel] of tabs) {
    await page.locator(sel).click();
    await sleep(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(600);
    await shot(page, name.replace("app-", "app-viewport-"), { fullPage: false });
  }

  await browser.close();
  console.log("DONE", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
