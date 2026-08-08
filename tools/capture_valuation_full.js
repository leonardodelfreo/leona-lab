/**
 * Capture the full Valuation desk page without empty flex/grid gaps.
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.LEONA_BASE || "http://127.0.0.1:8787";
const OUT = path.join(__dirname, "..", "assets", "screenshots", "pages");
const ART = "/opt/cursor/artifacts/app-screens";

const VIEW_W = 1600;
const SCALE = 2;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ART, { recursive: true });

  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: "leona", password: "leona123" }),
  }).then((r) => r.json());
  if (!login?.token) throw new Error("login failed: " + JSON.stringify(login));

  await fetch(`${BASE}/api/bootstrap?asset=XAUUSD`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).catch(() => null);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VIEW_W, height: 1000 },
    deviceScaleFactor: SCALE,
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => localStorage.setItem("leona_lab_auth_token", token), login.token);
  await page.goto(`${BASE}/app`, { waitUntil: "networkidle", timeout: 90000 });
  await sleep(2500);

  await page.locator("#tabValuation").click();
  await sleep(3500);

  // Wait until KPIs / chart have real data
  await page.waitForFunction(() => {
    const k1 = document.getElementById("valuationKpi1")?.textContent?.trim();
    const bias = document.getElementById("valuationBias")?.textContent?.trim();
    return k1 && k1 !== "--" && bias && bias !== "--";
  }, { timeout: 45000 }).catch(() => null);
  await sleep(1500);

  const metrics = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const shell = document.querySelector(".app-shell");
    const valPage = document.getElementById("valuationPage");
    const chartWrap = document.querySelector(".valuation-chart-wrap");
    const chartPanel = document.querySelector(".valuation-chart-panel");
    const kpi = document.querySelector(".valuation-kpi-grid");
    const status = document.querySelector(".status-card");

    html.style.setProperty("height", "auto", "important");
    html.style.setProperty("overflow", "visible", "important");
    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("min-height", "0", "important");
    body.style.setProperty("overflow", "visible", "important");
    body.style.setProperty("background", "#000", "important");

    if (shell) {
      // Kill the 1fr row that creates a black void when height grows
      shell.style.setProperty("height", "auto", "important");
      shell.style.setProperty("min-height", "0", "important");
      shell.style.setProperty("max-height", "none", "important");
      shell.style.setProperty("overflow", "visible", "important");
      shell.style.setProperty("display", "grid", "important");
      shell.style.setProperty("grid-template-rows", "auto auto auto auto", "important");
      shell.style.setProperty("align-content", "start", "important");
    }

    if (valPage) {
      valPage.style.setProperty("display", "flex", "important");
      valPage.style.setProperty("flex-direction", "column", "important");
      valPage.style.setProperty("height", "auto", "important");
      valPage.style.setProperty("min-height", "0", "important");
      valPage.style.setProperty("max-height", "none", "important");
      valPage.style.setProperty("overflow", "visible", "important");
      valPage.style.setProperty("flex", "0 0 auto", "important");
      valPage.style.setProperty("gap", "10px", "important");
    }

    // Keep natural card/grid layout — only size the chart cleanly
    if (kpi) {
      kpi.style.setProperty("display", "grid", "important");
      kpi.style.setProperty("grid-template-columns", "repeat(4, minmax(0, 1fr))", "important");
      kpi.style.setProperty("flex", "0 0 auto", "important");
      kpi.style.setProperty("height", "auto", "important");
    }

    if (chartPanel) {
      chartPanel.style.setProperty("flex", "0 0 auto", "important");
      chartPanel.style.setProperty("height", "auto", "important");
      chartPanel.style.setProperty("overflow", "visible", "important");
    }

    if (chartWrap) {
      chartWrap.style.setProperty("height", "560px", "important");
      chartWrap.style.setProperty("max-height", "none", "important");
      chartWrap.style.setProperty("flex", "0 0 auto", "important");
      chartWrap.style.setProperty("overflow", "hidden", "important");
    }

    if (status) {
      status.style.setProperty("flex", "0 0 auto", "important");
      status.style.setProperty("height", "auto", "important");
    }

    // Hide inactive pages so they don't contribute height
    document.querySelectorAll(".page-view:not(.active)").forEach((el) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("overflow", "hidden", "important");
    });

    // Resize Chart.js after layout change
    try {
      window.state?.valuationChart?.resize?.();
    } catch (_) {}

    const shellRect = shell?.getBoundingClientRect();
    return {
      scrollH: Math.max(html.scrollHeight, body.scrollHeight, shell?.scrollHeight || 0),
      shellH: shellRect?.height || 0,
      pageH: valPage?.getBoundingClientRect().height || 0,
      chartH: chartWrap?.getBoundingClientRect().height || 0,
      kpiH: kpi?.getBoundingClientRect().height || 0,
    };
  });

  console.log("layout metrics", metrics);

  // Grow viewport to content height so fullPage isn't needed / no letterbox
  const targetH = Math.min(Math.ceil(metrics.scrollH) + 24, 3200);
  await page.setViewportSize({ width: VIEW_W, height: Math.max(targetH, 900) });
  await sleep(600);
  await page.evaluate(() => {
    try {
      window.state?.valuationChart?.resize?.();
    } catch (_) {}
    window.scrollTo(0, 0);
  });
  await sleep(900);

  const finalMetrics = await page.evaluate(() => {
    const shell = document.querySelector(".app-shell");
    const valPage = document.getElementById("valuationPage");
    const kids = [...(valPage?.children || [])].map((el) => ({
      tag: el.tagName + "." + (el.className || "").toString().split(" ")[0],
      h: Math.round(el.getBoundingClientRect().height),
      top: Math.round(el.getBoundingClientRect().top),
    }));
    return {
      docH: document.documentElement.scrollHeight,
      shellH: Math.round(shell?.getBoundingClientRect().height || 0),
      pageH: Math.round(valPage?.getBoundingClientRect().height || 0),
      kids,
      bias: document.getElementById("valuationBias")?.textContent,
      k1: document.getElementById("valuationKpi1")?.textContent,
    };
  });
  console.log("final", JSON.stringify(finalMetrics, null, 2));

  // One more viewport fit to exact content
  const fitH = Math.min(Math.ceil(finalMetrics.docH) + 8, 3200);
  await page.setViewportSize({ width: VIEW_W, height: Math.max(fitH, 900) });
  await sleep(500);
  await page.evaluate(() => {
    try {
      window.state?.valuationChart?.resize?.();
    } catch (_) {}
    window.scrollTo(0, 0);
  });
  await sleep(700);

  const names = ["12-app-valuation-completa", "12-app-valuation"];
  for (const name of names) {
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({
      path: file,
      type: "png",
      fullPage: true,
      animations: "disabled",
    });
    fs.copyFileSync(file, path.join(ART, `${name}.png`));
    const st = fs.statSync(file);
    console.log(`saved ${name}.png ${Math.round(st.size / 1024)}KB`);
  }

  // Also clip just the shell for a tight "page" export
  const shellBox = await page.locator(".app-shell").boundingBox();
  if (shellBox) {
    const file = path.join(OUT, "12-app-valuation-pagina.png");
    await page.screenshot({
      path: file,
      type: "png",
      animations: "disabled",
      clip: {
        x: Math.max(0, shellBox.x - 8),
        y: Math.max(0, shellBox.y - 8),
        width: Math.min(VIEW_W, shellBox.width + 16),
        height: shellBox.height + 16,
      },
    });
    fs.copyFileSync(file, path.join(ART, "12-app-valuation-pagina.png"));
    console.log("saved 12-app-valuation-pagina.png");
  }

  await browser.close();
  console.log("DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
