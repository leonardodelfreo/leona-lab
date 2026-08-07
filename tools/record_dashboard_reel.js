/**
 * Record Leona.Lab dashboard tour reel — COT → Stagionalità, paced for IG.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { chromium } = require("playwright");

const BASE = process.env.LEONA_BASE || "http://127.0.0.1:8787";
const OUT_DIR = path.join(__dirname, "..", "assets", "instagram", "reels");
const ARTIFACT_DIR = "/opt/cursor/artifacts/reels";
const VIEW_W = 1440;
const VIEW_H = 900;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function smoothScroll(page, totalY, steps = 10, stepDelay = 140) {
  const per = totalY / steps;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((dy) => window.scrollBy({ top: dy, behavior: "smooth" }), per);
    await sleep(stepDelay);
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email: "leona", password: "leona123" }),
  }).then((r) => r.json());
  if (!login?.token) throw new Error("login failed");

  await fetch(`${BASE}/api/bootstrap?asset=XAUUSD`, {
    headers: { Authorization: `Bearer ${login.token}` },
  }).catch(() => null);

  const videoDir = path.join(OUT_DIR, "_raw");
  fs.mkdirSync(videoDir, { recursive: true });
  for (const f of fs.readdirSync(videoDir)) {
    fs.unlinkSync(path.join(videoDir, f));
  }

  const browser = await chromium.launch({
    headless: true,
    args: [`--window-size=${VIEW_W},${VIEW_H}`],
  });

  const context = await browser.newContext({
    viewport: { width: VIEW_W, height: VIEW_H },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: VIEW_W, height: VIEW_H } },
  });

  const page = await context.newPage();

  // Auth + preload app off-video as much as possible, then hard navigate
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.evaluate((token) => {
    localStorage.setItem("leona_lab_auth_token", token);
  }, login.token);

  await page.goto(`${BASE}/app`, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator("#tabCot").click();
  await sleep(3000);
  // Wait until COT page looks populated
  await page.waitForSelector("#cotPage", { timeout: 20000 }).catch(() => null);
  await sleep(1500);

  // --- COT tour ---
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(900);
  await smoothScroll(page, 380, 10, 130);
  await sleep(700);
  await smoothScroll(page, 420, 10, 130);
  await sleep(800);
  await smoothScroll(page, 360, 9, 130);
  await sleep(900);

  // Back to tabs
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await sleep(1100);

  // --- Switch to Stagionalità ---
  await page.locator("#tabSeasonality").click();
  await sleep(2200);
  await page.waitForSelector("#seasonalityPage", { timeout: 15000 }).catch(() => null);
  await sleep(1200);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await sleep(800);
  await smoothScroll(page, 360, 10, 130);
  await sleep(700);

  const dayTiming = page.locator(".seasonality-day-timing");
  if ((await dayTiming.count()) > 0) {
    await dayTiming.first().scrollIntoViewIfNeeded().catch(() => null);
    await sleep(1800);
    await smoothScroll(page, 160, 6, 120);
    await sleep(1000);
  } else {
    await smoothScroll(page, 520, 12, 130);
    await sleep(1000);
  }

  // Closing frame: seasonality chart
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await sleep(1600);

  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  const rawWebm = path.join(OUT_DIR, "dashboard-tour-raw.webm");
  fs.copyFileSync(videoPath, rawWebm);

  // Probe duration and trim leading white if any (~ skip first 0.3s only; load already waited)
  const landscapeMp4 = path.join(OUT_DIR, "leona-lab-dashboard-tour-landscape.mp4");
  const reelMp4 = path.join(OUT_DIR, "leona-lab-dashboard-reel.mp4");

  // Landscape master
  let ff = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-ss",
      "0.4",
      "-i",
      rawWebm,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-crf",
      "19",
      "-movflags",
      "+faststart",
      "-an",
      landscapeMp4,
    ],
    { encoding: "utf8" }
  );
  if (ff.status !== 0) throw new Error(ff.stderr);

  // 9:16: fill height so UI is ~2x larger than letterbox, crop width, gentle pan
  const vf = [
    "scale=-2:1920",
    "crop=1080:1920:'(iw-1080)/2+80*sin(2*PI*t/12)':0",
    "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:text='Leona.Lab':fontcolor=0xD4AF37:fontsize=34:x=(w-text_w)/2:y=36",
    "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:text='leona-lab.com':fontcolor=0xD4AF37:fontsize=22:x=(w-text_w)/2:y=h-48",
  ].join(",");

  ff = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      landscapeMp4,
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-profile:v",
      "high",
      "-crf",
      "19",
      "-movflags",
      "+faststart",
      "-an",
      reelMp4,
    ],
    { encoding: "utf8" }
  );
  if (ff.status !== 0) throw new Error(ff.stderr);

  fs.copyFileSync(reelMp4, path.join(ARTIFACT_DIR, "leona-lab-dashboard-reel.mp4"));
  fs.copyFileSync(landscapeMp4, path.join(ARTIFACT_DIR, "leona-lab-dashboard-tour-landscape.mp4"));

  // Preview poster frame
  const poster = path.join(ARTIFACT_DIR, "leona-lab-dashboard-reel-poster.png");
  spawnSync(
    "ffmpeg",
    ["-y", "-ss", "3", "-i", reelMp4, "-frames:v", "1", poster],
    { encoding: "utf8" }
  );

  console.log("REEL", reelMp4, Math.round(fs.statSync(reelMp4).size / 1024), "KB");
  console.log("LANDSCAPE", landscapeMp4, Math.round(fs.statSync(landscapeMp4).size / 1024), "KB");
  console.log("POSTER", poster);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
