const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const HOST = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
const PORT = Number(process.env.PORT || 8787);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT_DIR, "data");
const MACRO_CACHE_FILE = path.join(DATA_DIR, "macro-cache.json");
const PRICE_CACHE_PREFIX = path.join(DATA_DIR, "price-");
const COT_CACHE_PREFIX = path.join(DATA_DIR, "cot-");
const USER_PREFS_DIR = path.join(DATA_DIR, "user-prefs");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PAID_SESSIONS_FILE = path.join(DATA_DIR, "paid-sessions.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY || "").trim();
const STRIPE_WEBHOOK_SECRET = String(process.env.STRIPE_WEBHOOK_SECRET || "").trim();
const APP_BASE_URL = String(process.env.APP_BASE_URL || "").trim().replace(/\/$/, "");
const REQUIRE_PAYMENT = Boolean(STRIPE_SECRET_KEY) && String(process.env.ALLOW_FREE_REGISTER || "").toLowerCase() !== "true";
const ALLOW_SEED_USER = String(process.env.ALLOW_SEED_USER || "").toLowerCase() === "true";
const IS_PRODUCTION = String(process.env.NODE_ENV || "").toLowerCase() === "production";
const ADMIN_BOOTSTRAP_PASSWORD = String(process.env.ADMIN_BOOTSTRAP_PASSWORD || "").trim();
const ADMIN_FIXED_PASSWORDS = new Map(
  String(process.env.ADMIN_FIXED_PASSWORDS || "")
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const idx = pair.indexOf(":");
      if (idx <= 0) return null;
      const email = pair.slice(0, idx).trim().toLowerCase();
      const password = pair.slice(idx + 1).trim();
      if (!email || !password || password.length < 6) return null;
      return [email, password];
    })
    .filter(Boolean)
);
const ADMIN_EMAILS = new Set(
  String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

function isAdminEmail(email) {
  const normalized = normalizeEmail(email);
  return ADMIN_EMAILS.has(normalized) || ADMIN_FIXED_PASSWORDS.has(normalized);
}

const PLAN_CATALOG = {
  mensile: {
    id: "mensile",
    label: "Mensile",
    mode: "subscription",
    amountCents: 2490,
    interval: "month",
    description: "Leona.Lab — accesso completo mensile",
  },
  annuale: {
    id: "annuale",
    label: "Annuale",
    mode: "subscription",
    amountCents: 21990,
    interval: "year",
    description: "Leona.Lab — accesso completo annuale",
  },
  lifetime: {
    id: "lifetime",
    label: "Lifetime",
    mode: "payment",
    amountCents: 299990,
    interval: null,
    description: "Leona.Lab — accesso lifetime una tantum",
  },
};

const MACRO_REFRESH_MS_OK = 5 * 60 * 1000;
const MACRO_REFRESH_MS_DEGRADED = 60 * 1000;
const MACRO_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PRICE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const COT_CACHE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

const ASSET_CATALOG = [
  { id: "XAUUSD", yahooSymbols: ["XAUUSD=X", "GC=F"], stooqSymbol: "xauusd", tvFeeds: [{ market: "cfd", ticker: "TVC:GOLD" }, { market: "forex", ticker: "OANDA:XAUUSD" }], cotMarket: "GOLD - COMMODITY EXCHANGE INC." },
  { id: "XAGUSD", yahooSymbols: ["XAGUSD=X", "SI=F"], tvFeeds: [{ market: "cfd", ticker: "TVC:SILVER" }, { market: "forex", ticker: "OANDA:XAGUSD" }], cotMarket: "SILVER - COMMODITY EXCHANGE INC." },
  { id: "XPTUSD", yahooSymbols: ["PL=F"], tvFeeds: [{ market: "cfd", ticker: "TVC:PLATINUM" }], cotMarket: "PLATINUM - NEW YORK MERCANTILE EXCHANGE" },
  { id: "EURUSD", yahooSymbols: ["EURUSD=X", "6E=F"], tvFeeds: [{ market: "forex", ticker: "FX:EURUSD" }, { market: "forex", ticker: "OANDA:EURUSD" }], cotMarket: "EURO FX - CHICAGO MERCANTILE EXCHANGE" },
  { id: "GBPUSD", yahooSymbols: ["GBPUSD=X", "6B=F"], tvFeeds: [{ market: "forex", ticker: "FX:GBPUSD" }, { market: "forex", ticker: "OANDA:GBPUSD" }], cotMarket: "BRITISH POUND STERLING - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDJPY", yahooSymbols: ["JPY=X", "6J=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDJPY" }, { market: "forex", ticker: "OANDA:USDJPY" }], cotMarket: "JAPANESE YEN - CHICAGO MERCANTILE EXCHANGE" },
  { id: "AUDUSD", yahooSymbols: ["AUDUSD=X", "6A=F"], tvFeeds: [{ market: "forex", ticker: "FX:AUDUSD" }, { market: "forex", ticker: "OANDA:AUDUSD" }], cotMarket: "AUSTRALIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDCAD", yahooSymbols: ["CAD=X", "6C=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDCAD" }, { market: "forex", ticker: "OANDA:USDCAD" }], cotMarket: "CANADIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDCHF", yahooSymbols: ["CHF=X", "6S=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDCHF" }, { market: "forex", ticker: "OANDA:USDCHF" }], cotMarket: "SWISS FRANC - CHICAGO MERCANTILE EXCHANGE" },
  { id: "NZDUSD", yahooSymbols: ["NZDUSD=X", "6N=F"], tvFeeds: [{ market: "forex", ticker: "FX:NZDUSD" }, { market: "forex", ticker: "OANDA:NZDUSD" }], cotMarket: "NEW ZEALAND DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDMXN", yahooSymbols: ["MXN=X", "6M=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDMXN" }, { market: "forex", ticker: "OANDA:USDMXN" }], cotMarket: "MEXICAN PESO - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDNOK", yahooSymbols: ["NOK=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDNOK" }, { market: "forex", ticker: "OANDA:USDNOK" }], cotMarket: null },
  { id: "USDSEK", yahooSymbols: ["SEK=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDSEK" }, { market: "forex", ticker: "OANDA:USDSEK" }], cotMarket: null },
  { id: "USDTRY", yahooSymbols: ["TRY=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDTRY" }, { market: "forex", ticker: "OANDA:USDTRY" }], cotMarket: null },
  { id: "USDZAR", yahooSymbols: ["ZAR=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDZAR" }, { market: "forex", ticker: "OANDA:USDZAR" }], cotMarket: null },
  { id: "USDCNH", yahooSymbols: ["CNH=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDCNH" }, { market: "forex", ticker: "OANDA:USDCNH" }], cotMarket: null },
  { id: "SPX500", yahooSymbols: ["^GSPC", "ES=F"], tvFeeds: [{ market: "indices", ticker: "SP:SPX" }, { market: "cfd", ticker: "OANDA:SPX500USD" }], cotMarket: "E-MINI S&P 500 STOCK INDEX - CHICAGO MERCANTILE EXCHANGE" },
  { id: "NAS100", yahooSymbols: ["^NDX", "NQ=F"], tvFeeds: [{ market: "indices", ticker: "NASDAQ:NDX" }, { market: "cfd", ticker: "OANDA:NAS100USD" }], cotMarket: "E-MINI NASDAQ-100 STOCK INDEX - CHICAGO MERCANTILE EXCHANGE" },
  { id: "DOW30", yahooSymbols: ["^DJI", "YM=F"], tvFeeds: [{ market: "indices", ticker: "DJ:DJI" }, { market: "cfd", ticker: "OANDA:US30USD" }], cotMarket: null },
  { id: "RUS2000", yahooSymbols: ["^RUT", "RTY=F"], tvFeeds: [{ market: "indices", ticker: "RUSSELL:RUT" }], cotMarket: null },
  { id: "DAX40", yahooSymbols: ["^GDAXI"], tvFeeds: [{ market: "indices", ticker: "XETR:DAX" }], cotMarket: null },
  { id: "FTSE100", yahooSymbols: ["^FTSE"], tvFeeds: [{ market: "indices", ticker: "TVC:UKX" }], cotMarket: null },
  { id: "NIKKEI225", yahooSymbols: ["^N225"], tvFeeds: [{ market: "indices", ticker: "TVC:NI225" }], cotMarket: null },
  { id: "HANGSENG", yahooSymbols: ["^HSI"], tvFeeds: [{ market: "indices", ticker: "HSI:HSI" }], cotMarket: null },
  { id: "XPDUSD", yahooSymbols: ["PA=F"], tvFeeds: [{ market: "cfd", ticker: "TVC:PALLADIUM" }], cotMarket: null },
  { id: "COPPER", yahooSymbols: ["HG=F"], tvFeeds: [{ market: "futures", ticker: "COMEX:HG1!" }], cotMarket: "COPPER-GRADE #1 - COMMODITY EXCHANGE INC." },
  { id: "WHEAT", yahooSymbols: ["ZW=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZW1!" }], cotMarket: "WHEAT-SRW - CHICAGO BOARD OF TRADE" },
  { id: "CORN", yahooSymbols: ["ZC=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZC1!" }], cotMarket: "CORN - CHICAGO BOARD OF TRADE" },
  { id: "SOYBEAN", yahooSymbols: ["ZS=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZS1!" }], cotMarket: "SOYBEANS - CHICAGO BOARD OF TRADE" },
  { id: "SOYMEAL", yahooSymbols: ["ZM=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZM1!" }], cotMarket: null },
  { id: "SOYOIL", yahooSymbols: ["ZL=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZL1!" }], cotMarket: null },
  { id: "COFFEE", yahooSymbols: ["KC=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:KC1!" }], cotMarket: "COFFEE C - ICE FUTURES U.S." },
  { id: "SUGAR", yahooSymbols: ["SB=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:SB1!" }], cotMarket: "SUGAR NO. 11 - ICE FUTURES U.S." },
  { id: "COTTON", yahooSymbols: ["CT=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:CT1!" }], cotMarket: "COTTON NO. 2 - ICE FUTURES U.S." },
  { id: "COCOA", yahooSymbols: ["CC=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:CC1!" }], cotMarket: "COCOA - ICE FUTURES U.S." },
  { id: "OATS", yahooSymbols: ["ZO=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZO1!" }], cotMarket: null },
];

const macroState = {
  rows: [],
  source: "DOWN",
  preferredSource: null,
  mode: "DOWN",
  lastAttemptAt: 0,
  lastLiveSuccessAt: 0,
  lastRefreshAt: 0,
  errors: [],
};

const sessions = new Map();
let sessionsDirty = false;
let sessionsSaveTimer = null;
let sessionsBootstrapped = false;

const rateLimitBuckets = new Map();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USER_PREFS_DIR)) {
    fs.mkdirSync(USER_PREFS_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    // In produzione non creare account seed deboli, salvo opt-in esplicito.
    if (!IS_PRODUCTION || ALLOW_SEED_USER) {
      const payload = {
        users: [
          {
            username: "leona",
            email: "leona@leonalab.com",
            passwordHash: hashPassword("leona123"),
            displayName: "Leona",
            plan: "lifetime",
            role: "user",
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ],
      };
      fs.writeFileSync(USERS_FILE, JSON.stringify(payload, null, 2), "utf8");
    } else {
      fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
    }
  } else {
    migrateUsersEmailField();
  }
}

function bootstrapAuthStore() {
  ensureDataDir();
  // Carica sessioni UNA sola volta all'avvio. Ricaricarle ad ogni ensureDataDir
  // cancellava i login appena creati (Map clear + file disco ancora vecchio).
  if (!sessionsBootstrapped) {
    loadSessionsFromDisk();
    sessionsBootstrapped = true;
  }
  reconcileAdminUsers();
}

function getAssetById(assetId) {
  const key = String(assetId || "XAUUSD").toUpperCase();
  return ASSET_CATALOG.find((a) => a.id === key) || ASSET_CATALOG[0];
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password, storedHash) {
  const hash = String(storedHash || "");
  const plain = String(password || "");
  if (hash.startsWith("scrypt$")) {
    const parts = hash.split("$");
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const expected = parts[2];
    const actual = crypto.scryptSync(plain, salt, 64).toString("hex");
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
    } catch {
      return false;
    }
  }
  // Legacy SHA-256 (migrazione trasparente al prossimo login ok).
  const legacy = crypto.createHash("sha256").update(plain).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(legacy, "hex"));
  } catch {
    return hash === legacy;
  }
}

function isLegacyPasswordHash(storedHash) {
  const hash = String(storedHash || "");
  return Boolean(hash) && !hash.startsWith("scrypt$");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function migrateUsersEmailField() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.users)) return;
    let changed = false;
    const users = parsed.users.map((u) => {
      const username = String(u.username || "").trim().toLowerCase();
      let email = normalizeEmail(u.email);
      if (!email && username) {
        email = username.includes("@") ? username : `${username}@leonalab.com`;
        changed = true;
      }
      if (email !== normalizeEmail(u.email)) changed = true;
      return {
        ...u,
        username,
        email,
        passwordHash: String(u.passwordHash || ""),
        displayName: String(u.displayName || username || ""),
      };
    });
    if (changed) {
      writeUsers(users);
    }
  } catch {
    // ignore migration errors
  }
}

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.users)) return [];
    return parsed.users
      .map((u) => {
        const email =
          normalizeEmail(u.email) ||
          (String(u.username || "").includes("@") ? String(u.username || "").toLowerCase() : "");
        const role = String(u.role || (isAdminEmail(email) ? "admin" : "user"));
        return {
          username: String(u.username || "").toLowerCase(),
          email,
          passwordHash: String(u.passwordHash || ""),
          displayName: String(u.displayName || u.username || ""),
          plan: String(u.plan || (role === "admin" ? "lifetime" : "mensile")),
          role,
          stripeSessionId: u.stripeSessionId || null,
          stripeCustomerId: u.stripeCustomerId || null,
          paidAt: u.paidAt || null,
          createdAt: u.createdAt || null,
        };
      })
      .filter((u) => u.username && u.passwordHash);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  const payload = {
    users: (Array.isArray(users) ? users : [])
      .map((u) => {
        const email = normalizeEmail(u.email) || "";
        const role = String(u.role || (isAdminEmail(email) ? "admin" : "user"));
        return {
          username: String(u.username || "").trim().toLowerCase(),
          email,
          passwordHash: String(u.passwordHash || ""),
          displayName: String(u.displayName || u.username || "").trim(),
          plan: String(u.plan || (role === "admin" ? "lifetime" : "mensile")),
          role,
          stripeSessionId: u.stripeSessionId || null,
          stripeCustomerId: u.stripeCustomerId || null,
          paidAt: u.paidAt || null,
          createdAt: u.createdAt || null,
        };
      })
      .filter((u) => u.username && u.passwordHash),
  };
  fs.writeFileSync(USERS_FILE, JSON.stringify(payload, null, 2), "utf8");
}

function ensureAdminPrivileges(user) {
  if (!user || !isAdminEmail(user.email)) return false;
  let changed = false;
  if (user.role !== "admin") {
    user.role = "admin";
    changed = true;
  }
  if (user.plan !== "lifetime") {
    user.plan = "lifetime";
    changed = true;
  }
  if (!user.paidAt) {
    user.paidAt = new Date().toISOString();
    changed = true;
  }
  return changed;
}

/** Allinea tutti gli account in whitelist admin (paidAt/role/plan). */
function reconcileAdminUsers() {
  try {
    if (!ADMIN_EMAILS.size && !ADMIN_FIXED_PASSWORDS.size) return;
    const users = readUsers();
    let changed = false;
    users.forEach((user) => {
      if (ensureAdminPrivileges(user)) changed = true;
    });
    if (ADMIN_BOOTSTRAP_PASSWORD && ADMIN_BOOTSTRAP_PASSWORD.length >= 6) {
      users.forEach((user) => {
        if (!isAdminEmail(user.email)) return;
        if (ADMIN_FIXED_PASSWORDS.has(normalizeEmail(user.email))) return;
        user.passwordHash = hashPassword(ADMIN_BOOTSTRAP_PASSWORD);
        user.role = "admin";
        user.plan = "lifetime";
        if (!user.paidAt) user.paidAt = new Date().toISOString();
        changed = true;
      });
      ADMIN_EMAILS.forEach((email) => {
        if (users.some((u) => normalizeEmail(u.email) === email)) return;
        if (ADMIN_FIXED_PASSWORDS.has(email)) return;
        const usernameBase = email.split("@")[0].replace(/[^a-z0-9._-]/gi, "").slice(0, 24) || "admin";
        let username = usernameBase;
        let i = 1;
        while (users.some((u) => u.username === username)) {
          username = `${usernameBase}${i}`.slice(0, 32);
          i += 1;
        }
        users.push({
          username,
          email,
          passwordHash: hashPassword(ADMIN_BOOTSTRAP_PASSWORD),
          displayName: usernameBase,
          plan: "lifetime",
          role: "admin",
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
        changed = true;
      });
    }

    ADMIN_FIXED_PASSWORDS.forEach((password, email) => {
      const existing = users.find((u) => normalizeEmail(u.email) === email);
      if (existing) {
        existing.passwordHash = hashPassword(password);
        existing.role = "admin";
        existing.plan = "lifetime";
        if (!existing.paidAt) existing.paidAt = new Date().toISOString();
        changed = true;
        return;
      }
      const usernameBase = email.split("@")[0].replace(/[^a-z0-9._-]/gi, "").slice(0, 24) || "admin";
      let username = usernameBase;
      let i = 1;
      while (users.some((u) => u.username === username)) {
        username = `${usernameBase}${i}`.slice(0, 32);
        i += 1;
      }
      users.push({
        username,
        email,
        passwordHash: hashPassword(password),
        displayName: usernameBase,
        plan: "lifetime",
        role: "admin",
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      changed = true;
    });

    if (changed) writeUsers(users);
  } catch {
    // ignore
  }
}

function evaluateUserAccess(user) {
  if (!user) {
    return { accessAllowed: false, reason: "utente non trovato", plan: null, role: null };
  }
  const role = String(user.role || (isAdminEmail(user.email) ? "admin" : "user"));
  const plan = String(user.plan || "").toLowerCase() || null;

  if (role === "admin" || isAdminEmail(user.email)) {
    return {
      accessAllowed: true,
      reason: "admin",
      plan: plan || "lifetime",
      role: "admin",
    };
  }

  if (!REQUIRE_PAYMENT) {
    return {
      accessAllowed: true,
      reason: "pagamento non richiesto",
      plan: plan || "mensile",
      role,
    };
  }

  if (!plan || !PLAN_CATALOG[plan]) {
    return { accessAllowed: false, reason: "piano non valido", plan, role };
  }

  // Accesso desk: serve evidenza di pagamento (paidAt / Stripe ids).
  const hasPaymentProof = Boolean(user.paidAt || user.stripeCustomerId || user.stripeSessionId);
  if (hasPaymentProof) {
    return {
      accessAllowed: true,
      reason: "abbonamento attivo",
      plan,
      role,
    };
  }

  return {
    accessAllowed: false,
    reason: "pagamento richiesto per accedere al desk",
    plan,
    role,
  };
}

function getUserFromSession(session) {
  if (!session?.userId) return null;
  const users = readUsers();
  const user = users.find((u) => u.username === session.userId) || null;
  if (user && ensureAdminPrivileges(user)) {
    writeUsers(users);
  }
  return user;
}

/** Richiede login + accesso desk. Scrive la risposta di errore e ritorna null. */
function requireAppAccess(req, res) {
  const session = getSessionFromRequest(req);
  if (!session) {
    json(res, 401, { ok: false, error: "login richiesto", accessAllowed: false });
    return null;
  }
  const user = getUserFromSession(session);
  const access = evaluateUserAccess(user);
  if (!access.accessAllowed) {
    json(res, 403, {
      ok: false,
      error: access.reason || "accesso non autorizzato",
      accessAllowed: false,
      plan: access.plan,
      role: access.role,
    });
    return null;
  }
  return { session, user, access };
}

function publicUserPayload(user, access = null) {
  const evaluated = access || evaluateUserAccess(user);
  return {
    id: user?.username || null,
    email: user?.email || null,
    name: user?.displayName || user?.username || null,
    plan: evaluated.plan,
    role: evaluated.role,
    accessAllowed: evaluated.accessAllowed,
    accessReason: evaluated.reason,
  };
}

function readPaidSessions() {
  try {
    if (!fs.existsSync(PAID_SESSIONS_FILE)) return {};
    const parsed = JSON.parse(fs.readFileSync(PAID_SESSIONS_FILE, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePaidSessions(map) {
  ensureDataDir();
  fs.writeFileSync(PAID_SESSIONS_FILE, JSON.stringify(map || {}, null, 2), "utf8");
}

function getStripe() {
  if (!STRIPE_SECRET_KEY) return null;
  // Lazy require so the server still boots without the package in pure-local no-pay mode.
  // eslint-disable-next-line global-require
  const Stripe = require("stripe");
  return new Stripe(STRIPE_SECRET_KEY);
}

function resolveAppBaseUrl(req) {
  if (APP_BASE_URL) return APP_BASE_URL;
  const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim();
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || `${HOST}:${PORT}`).split(",")[0].trim();
  return `${proto}://${host}`;
}

async function verifyCheckoutSession(sessionId) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe non configurato");
  const session = await stripe.checkout.sessions.retrieve(String(sessionId || ""));
  const paid =
    session.payment_status === "paid" ||
    session.status === "complete" ||
    (session.mode === "subscription" && ["paid", "no_payment_required"].includes(session.payment_status));
  if (!paid) {
    throw new Error("pagamento non completato");
  }
  const plan = String(session.metadata?.plan || "").toLowerCase();
  if (!PLAN_CATALOG[plan]) throw new Error("piano non valido nella sessione");
  return {
    id: session.id,
    email: normalizeEmail(session.customer_details?.email || session.customer_email || ""),
    plan,
    customerId: session.customer || null,
    mode: session.mode,
    paymentStatus: session.payment_status,
  };
}

function getPriceCacheFile(assetId) {
  return `${PRICE_CACHE_PREFIX}${assetId}.json`;
}

function getCotCacheFile(assetId) {
  return `${COT_CACHE_PREFIX}${assetId}.json`;
}

function writeJsonCache(filePath, payload) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
}

function readJsonCache(filePath, maxAgeMs) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const fetchedAtMs = parsed?.fetchedAt ? Date.parse(parsed.fetchedAt) || 0 : 0;
    if (!fetchedAtMs) return null;
    if (Date.now() - fetchedAtMs > maxAgeMs) return null;
    return parsed;
  } catch {
    return null;
  }
}

function sanitizeUserId(rawUserId) {
  const id = String(rawUserId || "default").trim().toLowerCase();
  const safe = id.replace(/[^a-z0-9_-]/g, "-").slice(0, 64);
  return safe || "default";
}

function getUserPrefsFile(userId) {
  return path.join(USER_PREFS_DIR, `${sanitizeUserId(userId)}.json`);
}

function readUserPrefs(userId) {
  try {
    const filePath = getUserPrefsFile(userId);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || typeof parsed.prefs !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeUserPrefs(userId, prefs) {
  const filePath = getUserPrefsFile(userId);
  const payload = {
    userId: sanitizeUserId(userId),
    savedAt: new Date().toISOString(),
    prefs: prefs && typeof prefs === "object" ? prefs : {},
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error("payload troppo grande"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("json body non valido"));
      }
    });
    req.on("error", (error) => reject(error));
  });
}

function parseBearerToken(req) {
  const header = String(req.headers?.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return match[1].trim();
}

function loadSessionsFromDisk() {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
    const entries = parsed?.sessions && typeof parsed.sessions === "object" ? parsed.sessions : {};
    const now = Date.now();
    sessions.clear();
    Object.entries(entries).forEach(([token, session]) => {
      if (!token || !session?.userId || !session?.expiresAt) return;
      if (Number(session.expiresAt) <= now) return;
      sessions.set(token, {
        userId: String(session.userId),
        displayName: String(session.displayName || session.userId),
        expiresAt: Number(session.expiresAt),
      });
    });
  } catch {
    // ignore corrupt session file
  }
}

function persistSessionsNow() {
  try {
    ensureDataDir();
    const payload = { sessions: {} };
    const now = Date.now();
    for (const [token, session] of sessions.entries()) {
      if (!session?.expiresAt || session.expiresAt <= now) continue;
      payload.sessions[token] = {
        userId: session.userId,
        displayName: session.displayName || session.userId,
        expiresAt: session.expiresAt,
      };
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(payload, null, 2), "utf8");
    sessionsDirty = false;
  } catch {
    // keep in-memory sessions even if disk write fails
  }
}

function scheduleSessionsSave() {
  sessionsDirty = true;
  if (sessionsSaveTimer) return;
  sessionsSaveTimer = setTimeout(() => {
    sessionsSaveTimer = null;
    if (sessionsDirty) persistSessionsNow();
  }, 400);
}

function setSession(token, session) {
  sessions.set(token, session);
  // Persist subito: evita che un restart/reload perda il token prima del debounce.
  persistSessionsNow();
}

function deleteSession(token) {
  if (!token) return;
  sessions.delete(token);
  persistSessionsNow();
}

function cleanupExpiredSessions() {
  const now = Date.now();
  let changed = false;
  for (const [token, session] of sessions.entries()) {
    if (!session?.expiresAt || session.expiresAt <= now) {
      sessions.delete(token);
      changed = true;
    }
  }
  if (changed) scheduleSessionsSave();
}

function getSessionFromRequest(req) {
  cleanupExpiredSessions();
  const token = parseBearerToken(req);
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  return { token, ...session };
}

function getClientIp(req) {
  const xf = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return xf || req.socket?.remoteAddress || "unknown";
}

/** Rate limit semplice in-memory. Ritorna true se bloccato. */
function isRateLimited(key, limit = 20, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }
  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);
  return bucket.count > limit;
}

function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (IS_PRODUCTION) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
}

function parseMacroDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const raw = String(value).trim();
  const teMatch = raw.match(/\/Date\((\d+)\)\//);
  if (teMatch) {
    const d = new Date(Number(teMatch[1]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const dmy = raw.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})(?:[ T](\d{1,2})(?::(\d{1,2}))?)?$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);
    const hour = Number(dmy[4] || 0);
    const minute = Number(dmy[5] || 0);
    const d = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const ymd = raw.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})(?:[ T](\d{1,2})(?::(\d{1,2}))?)?$/);
  if (ymd) {
    const year = Number(ymd[1]);
    const month = Number(ymd[2]);
    const day = Number(ymd[3]);
    const hour = Number(ymd[4] || 0);
    const minute = Number(ymd[5] || 0);
    const d = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseCotReportDate(value) {
  const raw = String(value || "").slice(0, 10);
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function normalizeMacroImpact(impactRaw) {
  const i = String(impactRaw || "").toLowerCase();
  if (i.includes("high") || i.includes("alto") || i === "3") return "high";
  if (i.includes("medium") || i.includes("medio") || i === "2") return "medium";
  return "low";
}

function normalizeMacroCategory(eventName) {
  const e = String(eventName || "").toUpperCase();
  if (e.includes("CPI") || e.includes("INFLATION") || e.includes("CONSUMER PRICE INDEX")) return "CPI";
  if (
    e.includes("FOMC") ||
    e.includes("FED") ||
    e.includes("FEDERAL RESERVE") ||
    e.includes("FED FUNDS") ||
    e.includes("INTEREST RATE DECISION") ||
    e.includes("PRESS CONFERENCE")
  ) return "FOMC";
  if (
    e.includes("NFP") ||
    e.includes("NON-FARM") ||
    e.includes("NON FARM PAYROLL") ||
    e.includes("NON-FARM EMPLOYMENT") ||
    e.includes("PAYROLLS")
  ) return "NFP";
  if (e.includes("PCE")) return "PCE";
  if (e.includes("GDP") || e.includes("GROSS DOMESTIC PRODUCT")) return "GDP";
  if (e.includes("PMI") || e.includes("ISM")) return "PMI";
  if (e.includes("RETAIL SALES")) return "RETAIL";
  if (e.includes("UNEMPLOYMENT") || e.includes("JOBLESS")) return "LABOR";
  return "OTHER";
}

function isUsMacroCountry(value) {
  const countryNorm = String(value || "US").toUpperCase();
  return countryNorm === "US" || countryNorm === "USD" || countryNorm.includes("UNITED STATES") || countryNorm.includes("U.S.");
}

function normalizeMacroRows(rows, sourceName, sourceUrl) {
  return (Array.isArray(rows) ? rows : [])
    .map((r) => ({
      date: parseMacroDate(r?.date),
      country: String(r?.country || "US"),
      event: String(r?.event || "").trim(),
      category: String(r?.category || "OTHER").toUpperCase(),
      impact: normalizeMacroImpact(r?.impact || "low"),
      previous: String(r?.previous ?? "--"),
      forecast: String(r?.forecast ?? "--"),
      actual: String(r?.actual ?? "--"),
      source: r?.source || `${sourceName} | ${sourceUrl}`,
    }))
    .filter((r) => r.event && isUsMacroCountry(r.country) && r.date instanceof Date && !Number.isNaN(r.date.getTime()));
}

function dedupeMacroRows(rows) {
  const seen = new Set();
  const out = [];
  rows.forEach((r) => {
    const ts = r?.date?.getTime?.();
    if (!Number.isFinite(ts)) return;
    const key = `${ts}|${String(r.country || "").toUpperCase()}|${String(r.category || "").toUpperCase()}|${String(r.event || "").toUpperCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(r);
  });
  return out.sort((a, b) => a.date - b.date);
}

function hasFreshMacroWindow(rows) {
  const now = Date.now();
  const pastCut = now - 7 * 24 * 60 * 60 * 1000;
  const futureCut = now + 120 * 24 * 60 * 60 * 1000;
  const inWindow = rows.filter((r) => {
    const ts = r?.date?.getTime?.();
    return Number.isFinite(ts) && ts >= pastCut && ts <= futureCut;
  });
  const hasFuture = inWindow.some((r) => r.date.getTime() >= now - 24 * 60 * 60 * 1000);
  return inWindow.length >= 3 && hasFuture;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { Accept: "text/plain,*/*" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function fetchTextAnyRoute(url) {
  const stripped = url.replace(/^https?:\/\//i, "");
  const routes = [
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://cors.isomorphic-git.org/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://r.jina.ai/http://${stripped}`,
  ];
  let lastErr = null;
  for (const route of routes) {
    try {
      const response = await fetch(route, {
        headers: { Accept: "application/json,text/plain,*/*" },
        signal: AbortSignal.timeout(9500),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const txt = await response.text();
      if (txt && txt.trim().length > 0) return txt;
      throw new Error("empty response");
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("no route available");
}

async function fetchJsonAnyRoute(url) {
  const txt = await fetchTextAnyRoute(url);
  try {
    return JSON.parse(txt);
  } catch {
    const startArr = txt.indexOf("[");
    const endArr = txt.lastIndexOf("]");
    if (startArr >= 0 && endArr > startArr) {
      return JSON.parse(txt.slice(startArr, endArr + 1));
    }
    const startObj = txt.indexOf("{");
    const endObj = txt.lastIndexOf("}");
    if (startObj >= 0 && endObj > startObj) {
      return JSON.parse(txt.slice(startObj, endObj + 1));
    }
    throw new Error("invalid json payload");
  }
}

async function getTradingViewSnapshotForTicker(market, ticker) {
  const response = await fetch(`https://scanner.tradingview.com/${market}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      symbols: { tickers: [ticker], query: { types: [] } },
      columns: ["close", "change", "change_abs", "high.52W", "low.52W", "open", "high", "low"],
    }),
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`TV HTTP ${response.status}`);
  const json = await response.json();
  const values = json?.data?.[0]?.d;
  if (!Array.isArray(values) || values.length < 8) throw new Error("TV payload non valido");
  const [close, changePct, changeAbs, high52w, low52w, open, high, low] = values.map((v) => Number(v));
  if (!Number.isFinite(close)) throw new Error("TV close non disponibile");
  return {
    source: `TradingView ${ticker}`,
    ticker,
    close,
    changePct: Number.isFinite(changePct) ? changePct : null,
    changeAbs: Number.isFinite(changeAbs) ? changeAbs : null,
    high52w: Number.isFinite(high52w) && high52w > 0 ? high52w : null,
    low52w: Number.isFinite(low52w) && low52w > 0 ? low52w : null,
    open: Number.isFinite(open) ? open : null,
    high: Number.isFinite(high) ? high : null,
    low: Number.isFinite(low) ? low : null,
  };
}

async function getTradingViewMarketSnapshot(asset) {
  for (const feed of asset?.tvFeeds || []) {
    try {
      return await getTradingViewSnapshotForTicker(feed.market, feed.ticker);
    } catch {
      // try next
    }
  }
  return null;
}

async function getYahooSnapshot(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
  const y = await fetchJsonAnyRoute(url);
  const result = y?.chart?.result?.[0];
  const ts = result?.timestamp || [];
  const close = result?.indicators?.quote?.[0]?.close || [];
  const rows = ts
    .map((t, i) => ({ ts: Number(t), close: Number(close[i]) }))
    .filter((r) => Number.isFinite(r.ts) && Number.isFinite(r.close));
  if (!rows.length) throw new Error("Yahoo payload non valido");
  const last = rows[rows.length - 1].close;
  const prev = rows[Math.max(0, rows.length - 2)].close;
  const changeAbs = Number.isFinite(prev) ? last - prev : null;
  const changePct = Number.isFinite(prev) && prev !== 0 ? ((last / prev) - 1) * 100 : null;
  return {
    source: `Yahoo ${symbol}`,
    ticker: symbol,
    close: last,
    changePct,
    changeAbs,
    high52w: null,
    low52w: null,
    open: null,
    high: null,
    low: null,
  };
}

async function getLiveSpotForAsset(asset) {
  const tv = await getTradingViewMarketSnapshot(asset);
  if (tv?.close) {
    return { price: tv.close, source: `${tv.source} (live)`, snapshot: tv };
  }
  for (const symbol of asset?.yahooSymbols || []) {
    try {
      const snap = await getYahooSnapshot(symbol);
      return { price: snap.close, source: `${snap.source} (near-live)`, snapshot: snap };
    } catch {
      // next symbol
    }
  }
  if (asset?.id === "XAUUSD") {
    try {
      const fxRates = await fetchJsonAnyRoute("https://api.fxratesapi.com/latest?base=XAU&currencies=USD");
      const px = Number(fxRates?.rates?.USD);
      if (Number.isFinite(px) && px > 0) return { price: px, source: "FXRatesAPI XAU/USD (live)", snapshot: null };
    } catch {
      // noop
    }
    try {
      const goldPrice = await fetchJsonAnyRoute("https://data-asg.goldprice.org/dbXRates/USD");
      const px = Number(goldPrice?.items?.[0]?.xauPrice);
      if (Number.isFinite(px) && px > 0) return { price: px, source: "GoldPrice.org XAU/USD (live fallback)", snapshot: null };
    } catch {
      // noop
    }
  }
  return null;
}

function parseCsvDailyPrices(csv) {
  const lines = String(csv || "").split(/\r?\n/).filter(Boolean);
  return lines
    .slice(1)
    .map((line) => line.split(","))
    .map((parts) => ({
      date: parseMacroDate(parts[0]),
      close: Number(parts[4]),
    }))
    .filter((row) => row.date instanceof Date && !Number.isNaN(row.date.getTime()) && Number.isFinite(row.close))
    .sort((a, b) => a.date - b.date);
}

async function fetchPriceSeriesReal(asset) {
  const historicalCandidates = [];
  if (asset?.id === "XAUUSD") {
    try {
      const cgUrl = "https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=3650&interval=daily";
      const data = await fetchJsonAnyRoute(cgUrl);
      const prices = (data?.prices || [])
        .map(([ts, px]) => ({ date: new Date(Number(ts)), close: Number(px) }))
        .filter((row) => row.date instanceof Date && !Number.isNaN(row.date.getTime()) && Number.isFinite(row.close))
        .sort((a, b) => a.date - b.date);
      if (prices.length > 200) historicalCandidates.push({ source: "CoinGecko PAXG/USD storico", prices });
    } catch {
      // noop
    }
  }

  if (asset?.stooqSymbol) {
    try {
      const csv = await fetchTextAnyRoute(`https://stooq.com/q/d/l/?s=${encodeURIComponent(asset.stooqSymbol)}&i=d`);
      const rows = parseCsvDailyPrices(csv);
      if (rows.length > 200) historicalCandidates.push({ source: `Stooq ${asset.id} storico`, prices: rows });
    } catch {
      // noop
    }
  }

  for (const symbol of asset?.yahooSymbols || []) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=10y&interval=1d`;
      const y = await fetchJsonAnyRoute(url);
      const result = y?.chart?.result?.[0];
      const ts = result?.timestamp || [];
      const close = result?.indicators?.quote?.[0]?.close || [];
      const rows = ts
        .map((t, i) => ({ date: new Date(Number(t) * 1000), close: Number(close[i]) }))
        .filter((row) => row.date instanceof Date && !Number.isNaN(row.date.getTime()) && Number.isFinite(row.close))
        .sort((a, b) => a.date - b.date);
      if (rows.length > 200) {
        historicalCandidates.push({ source: `Yahoo ${symbol} storico`, prices: rows });
        break;
      }
    } catch {
      // try next
    }
  }

  if (!historicalCandidates.length) {
    throw new Error(`storico reale non disponibile per ${asset.id}`);
  }

  const best = historicalCandidates.sort((a, b) => b.prices.length - a.prices.length)[0];
  const prices = best.prices.slice();
  const liveSpot = await getLiveSpotForAsset(asset);
  if (liveSpot) {
    // Non sovrascrivere l'ultima barra storica: lo spot resta nel snapshot
    const snapshot = {
      ...(liveSpot.snapshot || {}),
      price: liveSpot.price,
      ticker: liveSpot.snapshot?.ticker || liveSpot.source || null,
    };
    return {
      source: `${best.source} + ${liveSpot.source}`,
      prices,
      snapshot,
      mode: "LIVE",
    };
  }
  return { source: `${best.source} (senza spot live)`, prices, snapshot: null, mode: "FAILOVER" };
}

function normalizeMarketSnapshot(snap) {
  if (!snap || typeof snap !== "object") return null;
  const px = Number(snap.price ?? snap.close);
  return {
    ...snap,
    price: Number.isFinite(px) && px > 0 ? px : null,
    close: Number.isFinite(Number(snap.close)) ? Number(snap.close) : null,
    high52w: Number(snap.high52w) > 0 ? Number(snap.high52w) : null,
    low52w: Number(snap.low52w) > 0 ? Number(snap.low52w) : null,
  };
}

async function getPriceSeriesForAsset(assetId) {
  const asset = getAssetById(assetId);
  try {
    const data = await fetchPriceSeriesReal(asset);
    const snapshot = normalizeMarketSnapshot(data.snapshot);
    writeJsonCache(getPriceCacheFile(asset.id), {
      fetchedAt: new Date().toISOString(),
      source: data.source,
      mode: data.mode,
      snapshot,
      prices: data.prices.map((p) => ({ date: p.date.toISOString(), close: p.close })),
    });
    return { ok: true, ...data, snapshot, assetId: asset.id };
  } catch (error) {
    const cached = readJsonCache(getPriceCacheFile(asset.id), PRICE_CACHE_MAX_AGE_MS);
    if (cached?.prices?.length) {
      return {
        ok: true,
        mode: "CACHE",
        source: `${cached.source || "price cache"} (cache reale temporanea)`,
        snapshot: normalizeMarketSnapshot(cached.snapshot),
        prices: cached.prices
          .map((p) => ({ date: parseMacroDate(p.date), close: Number(p.close) }))
          .filter((p) => p.date instanceof Date && !Number.isNaN(p.date.getTime()) && Number.isFinite(p.close)),
        assetId: asset.id,
      };
    }
    return { ok: false, mode: "DOWN", source: `feed prezzi non disponibile: ${error.message}`, prices: [], snapshot: null, assetId: asset.id };
  }
}

async function fetchCotRowsReal(asset) {
  if (!asset?.cotMarket) throw new Error(`COT non disponibile per ${asset?.id || "asset"}`);
  const whereExpr = `market_and_exchange_names='${asset.cotMarket}'`;
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=report_date_as_yyyy_mm_dd,open_interest_all,noncomm_positions_long_all,noncomm_positions_short_all,comm_positions_long_all,comm_positions_short_all,nonrept_positions_long_all,nonrept_positions_short_all" +
    `&$where=${encodeURIComponent(whereExpr)}` +
    "&$order=report_date_as_yyyy_mm_dd%20DESC" +
    "&$limit=260";

  let raw = await fetchJsonAnyRoute(url);
  if (!Array.isArray(raw)) throw new Error("payload COT non valido");
  const rows = raw
    .map((row) => {
      const date = parseCotReportDate(row.report_date_as_yyyy_mm_dd);
      const oi = Number(row.open_interest_all);
      const commercialLong = Number(row.comm_positions_long_all);
      const commercialShort = Number(row.comm_positions_short_all);
      const nonCommercialLong = Number(row.noncomm_positions_long_all);
      const nonCommercialShort = Number(row.noncomm_positions_short_all);
      const retailLong = Number(row.nonrept_positions_long_all);
      const retailShort = Number(row.nonrept_positions_short_all);
      if (
        !(date instanceof Date) ||
        Number.isNaN(date.getTime()) ||
        ![oi, commercialLong, commercialShort, nonCommercialLong, nonCommercialShort, retailLong, retailShort].every(Number.isFinite) ||
        oi <= 0
      ) return null;
      return {
        date,
        oi,
        commercialLong,
        commercialShort,
        nonCommercialLong,
        nonCommercialShort,
        retailLong,
        retailShort,
        commercialNet: commercialLong - commercialShort,
        nonCommercialNet: nonCommercialLong - nonCommercialShort,
        retailNet: retailLong - retailShort,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);
  if (!rows.length) throw new Error(`nessun record COT per ${asset.id}`);
  return rows;
}

async function getCotRowsForAsset(assetId) {
  const asset = getAssetById(assetId);
  try {
    const rows = await fetchCotRowsReal(asset);
    writeJsonCache(getCotCacheFile(asset.id), {
      fetchedAt: new Date().toISOString(),
      source: `CFTC Socrata 6dca-aqww (${asset.id})`,
      mode: "LIVE",
      rows: rows.map((r) => ({ ...r, date: r.date.toISOString() })),
    });
    return { ok: true, mode: "LIVE", source: `CFTC Socrata 6dca-aqww (${asset.id})`, rows, assetId: asset.id };
  } catch (error) {
    const cached = readJsonCache(getCotCacheFile(asset.id), COT_CACHE_MAX_AGE_MS);
    if (cached?.rows?.length) {
      return {
        ok: true,
        mode: "CACHE",
        source: `${cached.source || "cot cache"} (cache reale temporanea)`,
        rows: cached.rows
          .map((r) => ({ ...r, date: parseMacroDate(r.date) }))
          .filter((r) => r.date instanceof Date && !Number.isNaN(r.date.getTime())),
        assetId: asset.id,
      };
    }
    return { ok: false, mode: "DOWN", source: `feed COT non disponibile: ${error.message}`, rows: [], assetId: asset.id };
  }
}

async function fetchMacroFromSources(preferredSource) {
  const sources = [
    {
      name: "TradingEconomics-US",
      url: "https://api.tradingeconomics.com/calendar/country/united%20states?c=guest:guest&f=json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        return normalizeMacroRows(raw.map((r) => ({
          date: r.Date || r.date || r.DateUtc || r.ReferenceDate,
          country: r.Country || r.country || "US",
          event: r.Event || r.event || r.Title || r.title || "",
          category: normalizeMacroCategory(`${r.Category || ""} ${r.Event || r.event || r.Title || r.title || ""}`),
          impact: normalizeMacroImpact(r.Importance || r.importance || r.Priority || ""),
          previous: r.Previous ?? r.previous ?? "--",
          forecast: r.Forecast ?? r.forecast ?? "--",
          actual: r.Actual ?? r.actual ?? "--",
          source: url,
        })), "TradingEconomics-US", url);
      },
    },
    {
      name: "TradingEconomics-Calendar",
      url: "https://api.tradingeconomics.com/calendar?c=guest:guest&f=json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        return normalizeMacroRows(raw.map((r) => ({
          date: r.Date || r.date || r.DateUtc || r.ReferenceDate,
          country: r.Country || r.country || "US",
          event: r.Event || r.event || r.Title || r.title || "",
          category: normalizeMacroCategory(`${r.Category || ""} ${r.Event || r.event || r.Title || r.title || ""}`),
          impact: normalizeMacroImpact(r.Importance || r.importance || r.Priority || ""),
          previous: r.Previous ?? r.previous ?? "--",
          forecast: r.Forecast ?? r.forecast ?? "--",
          actual: r.Actual ?? r.actual ?? "--",
          source: url,
        })), "TradingEconomics-Calendar", url);
      },
    },
    {
      name: "FairEconomy-Week",
      url: "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        return normalizeMacroRows(raw.map((r) => ({
          date: r.date || r.datetime,
          country: r.country || "US",
          event: r.title || r.event || r.name || "",
          category: normalizeMacroCategory(r.title || r.event || r.name || ""),
          impact: normalizeMacroImpact(r.impact || r.importance || r.volatility || ""),
          previous: r.previous || r.prev || "--",
          forecast: r.forecast || r.consensus || "--",
          actual: r.actual || "--",
          source: url,
        })), "FairEconomy-Week", url);
      },
    },
    {
      name: "FairEconomy-Month",
      url: "https://nfs.faireconomy.media/ff_calendar_thismonth.json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        return normalizeMacroRows(raw.map((r) => ({
          date: r.date || r.datetime,
          country: r.country || "US",
          event: r.title || r.event || r.name || "",
          category: normalizeMacroCategory(r.title || r.event || r.name || ""),
          impact: normalizeMacroImpact(r.impact || r.importance || r.volatility || ""),
          previous: r.previous || r.prev || "--",
          forecast: r.forecast || r.consensus || "--",
          actual: r.actual || "--",
          source: url,
        })), "FairEconomy-Month", url);
      },
    },
    {
      name: "AlphaVantage-Calendar",
      url: "https://www.alphavantage.co/query?function=ECONOMIC_CALENDAR&horizon=12month&apikey=demo",
      parser: (raw, url) => {
        const data = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        if (!data.length) return [];
        return normalizeMacroRows(data.map((r) => ({
          date: r.date || r.datetime || r.time,
          country: r.country || r.region || "US",
          event: r.event || r.name || r.title || "",
          category: normalizeMacroCategory(r.event || r.name || r.title || ""),
          impact: normalizeMacroImpact(r.impact || r.importance || r.volatility || ""),
          previous: r.previous || r.prev || "--",
          forecast: r.forecast || r.estimate || r.consensus || "--",
          actual: r.actual || "--",
          source: url,
        })), "AlphaVantage-Calendar", url);
      },
    },
  ];

  const orderedSources = preferredSource
    ? [...sources].sort((a, b) => (a.name === preferredSource ? -1 : b.name === preferredSource ? 1 : 0))
    : sources;
  const mergedRows = [];
  const usedSources = [];
  const errors = [];

  for (const source of orderedSources) {
    try {
      const payload = await fetchJsonAnyRoute(source.url);
      const rows = source.parser(payload, source.url);
      if (rows.length) {
        mergedRows.push(...rows);
        usedSources.push(`${source.name}:${rows.length}`);
        const deduped = dedupeMacroRows(mergedRows);
        if (hasFreshMacroWindow(deduped) && deduped.length >= 8) {
          return {
            ok: true,
            rows: deduped,
            source: `Live merge ${usedSources.join(" + ")} (${deduped.length} eventi)`,
            primarySource: source.name,
            mode: "LIVE",
            errors,
          };
        }
      } else {
        errors.push(`${source.name}:0`);
      }
    } catch (error) {
      errors.push(`${source.name}:${error?.message || "error"}`);
    }
  }

  const deduped = dedupeMacroRows(mergedRows);
  if (deduped.length) {
    return {
      ok: true,
      rows: deduped,
      source: `Live partial ${usedSources.join(" + ")} (${deduped.length} eventi)`,
      primarySource: usedSources[0]?.split(":")[0] || null,
      mode: "FAILOVER",
      errors,
    };
  }

  return {
    ok: false,
    rows: [],
    source: `Feed macro non disponibile (fonti reali KO: ${errors.join(" | ")})`,
    primarySource: null,
    mode: "DOWN",
    errors,
  };
}

function writeMacroCache(rows, source, mode) {
  ensureDataDir();
  const payload = {
    fetchedAt: new Date().toISOString(),
    source,
    mode,
    rows: rows.map((r) => ({
      ...r,
      date: r.date.toISOString(),
    })),
  };
  fs.writeFileSync(MACRO_CACHE_FILE, JSON.stringify(payload, null, 2), "utf8");
}

function readMacroCache() {
  try {
    if (!fs.existsSync(MACRO_CACHE_FILE)) return null;
    const raw = fs.readFileSync(MACRO_CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const fetchedAtMs = parsed?.fetchedAt ? Date.parse(parsed.fetchedAt) || 0 : 0;
    if (!parsed?.rows?.length || !fetchedAtMs) return null;
    const ageMs = Date.now() - fetchedAtMs;
    if (ageMs > MACRO_CACHE_MAX_AGE_MS) return null;
    const rows = parsed.rows
      .map((r) => ({ ...r, date: parseMacroDate(r.date) }))
      .filter((r) => r.date instanceof Date && !Number.isNaN(r.date.getTime()));
    return {
      rows,
      source: `${parsed.source || "macro cache"} (cache reale temporanea)`,
      mode: "CACHE",
      fetchedAtMs,
    };
  } catch {
    return null;
  }
}

async function refreshMacroData() {
  macroState.lastAttemptAt = Date.now();
  const result = await fetchMacroFromSources(macroState.preferredSource);
  if (result.ok && result.rows.length) {
    macroState.rows = result.rows;
    macroState.source = result.source;
    macroState.mode = result.mode;
    macroState.preferredSource = result.primarySource || macroState.preferredSource;
    macroState.lastRefreshAt = Date.now();
    macroState.lastLiveSuccessAt = Date.now();
    macroState.errors = result.errors || [];
    writeMacroCache(result.rows, result.source, result.mode);
    return;
  }

  const cached = readMacroCache();
  if (cached?.rows?.length) {
    macroState.rows = cached.rows;
    macroState.source = cached.source;
    macroState.mode = "CACHE";
    macroState.lastRefreshAt = Date.now();
    macroState.errors = result.errors || [];
    return;
  }

  macroState.rows = [];
  macroState.source = result.source;
  macroState.mode = "DOWN";
  macroState.lastRefreshAt = Date.now();
  macroState.errors = result.errors || [];
}

function startMacroScheduler() {
  const loop = async () => {
    try {
      await refreshMacroData();
    } catch (error) {
      macroState.source = `Feed macro non disponibile (${error.message})`;
      macroState.mode = "DOWN";
      macroState.lastRefreshAt = Date.now();
    } finally {
      const nextDelay = macroState.mode === "LIVE" ? MACRO_REFRESH_MS_OK : MACRO_REFRESH_MS_DEGRADED;
      setTimeout(loop, nextDelay);
    }
  };
  loop();
}

function json(res, statusCode, data) {
  const payload = JSON.stringify(data);
  applySecurityHeaders(res);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

function serveStatic(req, res, pathname) {
  const normalized = pathname === "/" ? "/index.html" : pathname;
  const relative = String(normalized).replace(/^[/\\]+/, "").replace(/\\/g, "/");
  if (!relative || relative.split("/").includes("..")) {
    applySecurityHeaders(res);
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  const rootResolved = path.resolve(ROOT_DIR);
  const filePath = path.resolve(rootResolved, ...relative.split("/"));
  if (filePath !== rootResolved && !filePath.startsWith(rootResolved + path.sep)) {
    applySecurityHeaders(res);
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      applySecurityHeaders(res);
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".html" ? "text/html; charset=utf-8"
      : ext === ".js" ? "application/javascript; charset=utf-8"
      : ext === ".css" ? "text/css; charset=utf-8"
      : ext === ".json" ? "application/json; charset=utf-8"
      : ext === ".xml" ? "application/xml; charset=utf-8"
      : ext === ".txt" ? "text/plain; charset=utf-8"
      : ext === ".svg" ? "image/svg+xml; charset=utf-8"
      : ext === ".png" ? "image/png"
      : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
      : ext === ".webp" ? "image/webp"
      : "application/octet-stream";
    const cacheControl =
      ext === ".html" || ext === ".xml" || ext === ".txt" ? "public, max-age=300"
      : "public, max-age=86400";
    applySecurityHeaders(res);
    res.writeHead(200, { "Content-Type": mime, "Cache-Control": cacheControl });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);
  const requestUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  const pathname = requestUrl.pathname;

  if (pathname === "/") {
    return serveStatic(req, res, "/landing.html");
  }
  if (pathname === "/login" || pathname === "/login/") {
    return serveStatic(req, res, "/login.html");
  }
  if (pathname === "/prezzi" || pathname === "/prezzi/" || pathname === "/pricing" || pathname === "/pricing/") {
    return serveStatic(req, res, "/prezzi.html");
  }
  if (pathname === "/registrati" || pathname === "/registrati/" || pathname === "/register" || pathname === "/register/") {
    return serveStatic(req, res, "/registrati.html");
  }
  if (pathname === "/privacy" || pathname === "/privacy/") {
    return serveStatic(req, res, "/privacy.html");
  }
  if (pathname === "/termini" || pathname === "/termini/" || pathname === "/terms" || pathname === "/terms/") {
    return serveStatic(req, res, "/termini.html");
  }
  if (pathname === "/app" || pathname === "/app/") {
    return serveStatic(req, res, "/index.html");
  }

  if (pathname === "/api/health") {
    const assetId = requestUrl.searchParams.get("asset") || "XAUUSD";
    const priceCache = readJsonCache(getPriceCacheFile(String(assetId).toUpperCase()), PRICE_CACHE_MAX_AGE_MS);
    const cotCache = readJsonCache(getCotCacheFile(String(assetId).toUpperCase()), COT_CACHE_MAX_AGE_MS);
    let userCount = 0;
    try {
      userCount = readUsers().length;
    } catch {
      userCount = -1;
    }
    return json(res, 200, {
      ok: true,
      assetId: String(assetId).toUpperCase(),
      billing: {
        stripeConfigured: Boolean(STRIPE_SECRET_KEY),
        requirePayment: REQUIRE_PAYMENT,
      },
      auth: {
        userCount,
        adminEmailsConfigured: ADMIN_EMAILS.size,
        sessionsActive: sessions.size,
      },
      dataDir: DATA_DIR,
      macro: {
        mode: macroState.mode,
        source: macroState.source,
        rows: macroState.rows.length,
        preferredSource: macroState.preferredSource,
        lastAttemptAt: macroState.lastAttemptAt || null,
        lastRefreshAt: macroState.lastRefreshAt || null,
        lastLiveSuccessAt: macroState.lastLiveSuccessAt || null,
      },
      price: {
        cache: Boolean(priceCache?.prices?.length),
        source: priceCache?.source || "--",
        fetchedAt: priceCache?.fetchedAt || null,
      },
      cot: {
        cache: Boolean(cotCache?.rows?.length),
        source: cotCache?.source || "--",
        fetchedAt: cotCache?.fetchedAt || null,
      },
    });
  }

  if (pathname === "/api/checkout" && req.method === "POST") {
    try {
      if (isRateLimited(`checkout:${getClientIp(req)}`, 10, 15 * 60 * 1000)) {
        return json(res, 429, { ok: false, error: "troppe richieste di checkout, riprova tra poco" });
      }
      const stripe = getStripe();
      if (!stripe) {
        return json(res, 503, {
          ok: false,
          error: "Pagamenti non ancora configurati. Aggiungi STRIPE_SECRET_KEY.",
          requirePayment: REQUIRE_PAYMENT,
        });
      }
      const body = await readJsonBody(req);
      const planId = String(body?.plan || "").trim().toLowerCase();
      const plan = PLAN_CATALOG[planId];
      if (!plan) return json(res, 400, { ok: false, error: "piano non valido" });
      const base = resolveAppBaseUrl(req);
      const priceData = {
        currency: "eur",
        product_data: {
          name: `Leona.Lab ${plan.label}`,
          description: plan.description,
        },
        unit_amount: plan.amountCents,
      };
      if (plan.mode === "subscription") {
        priceData.recurring = { interval: plan.interval };
      }
      const sessionParams = {
        mode: plan.mode,
        line_items: [{ price_data: priceData, quantity: 1 }],
        success_url: `${base}/registrati?plan=${encodeURIComponent(plan.id)}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/prezzi?canceled=1`,
        metadata: { plan: plan.id },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
      };
      if (plan.mode === "payment") {
        sessionParams.customer_creation = "always";
      }
      const session = await stripe.checkout.sessions.create(sessionParams);
      return json(res, 200, { ok: true, url: session.url, sessionId: session.id, plan: plan.id });
    } catch (error) {
      return json(res, 400, { ok: false, error: error?.message || "checkout fallito" });
    }
  }

  if (pathname === "/api/checkout/session" && req.method === "GET") {
    try {
      const sessionId = requestUrl.searchParams.get("session_id") || "";
      if (!sessionId) return json(res, 400, { ok: false, error: "session_id mancante" });
      const verified = await verifyCheckoutSession(sessionId);
      const used = readPaidSessions()[sessionId];
      return json(res, 200, {
        ok: true,
        paid: true,
        used: Boolean(used?.usedAt),
        email: verified.email || null,
        plan: verified.plan,
        sessionId: verified.id,
      });
    } catch (error) {
      return json(res, 400, { ok: false, error: error?.message || "sessione non valida" });
    }
  }

  if (pathname === "/api/billing/portal" && req.method === "POST") {
    try {
      const stripe = getStripe();
      if (!stripe) return json(res, 503, { ok: false, error: "Stripe non configurato" });
      const session = getSessionFromRequest(req);
      if (!session) return json(res, 401, { ok: false, error: "login richiesto" });
      const users = readUsers();
      const user = users.find((u) => u.username === session.userId);
      if (!user) return json(res, 404, { ok: false, error: "utente non trovato" });
      let customerId = user.stripeCustomerId || null;
      if (!customerId && user.email) {
        const existing = await stripe.customers.list({ email: normalizeEmail(user.email), limit: 1 });
        customerId = existing.data?.[0]?.id || null;
      }
      if (!customerId) {
        return json(res, 400, {
          ok: false,
          error: "Nessun cliente Stripe collegato a questo account. Contatta assistenza.",
        });
      }
      const base = resolveAppBaseUrl(req);
      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${base}/app`,
      });
      return json(res, 200, { ok: true, url: portal.url });
    } catch (error) {
      return json(res, 400, { ok: false, error: error?.message || "portale billing non disponibile" });
    }
  }

  if (pathname === "/api/billing/config" && req.method === "GET") {
    return json(res, 200, {
      ok: true,
      stripeEnabled: Boolean(STRIPE_SECRET_KEY),
      requirePayment: REQUIRE_PAYMENT,
      plans: Object.values(PLAN_CATALOG).map((p) => ({
        id: p.id,
        label: p.label,
        amountCents: p.amountCents,
        mode: p.mode,
      })),
    });
  }

  if (pathname === "/api/auth/admin-check" && req.method === "GET") {
    const email = normalizeEmail(requestUrl.searchParams.get("email") || "");
    return json(res, 200, {
      ok: true,
      admin: Boolean(email && isAdminEmail(email)),
    });
  }

  if (pathname === "/api/auth/login" && req.method === "POST") {
    try {
      if (isRateLimited(`login:${getClientIp(req)}`, 30, 15 * 60 * 1000)) {
        return json(res, 429, { ok: false, error: "troppi tentativi di login, riprova tra poco" });
      }
      const body = await readJsonBody(req);
      const loginId = normalizeEmail(body?.email || body?.username || "");
      const password = String(body?.password || "");
      if (!loginId || !password) {
        return json(res, 400, { ok: false, error: "email e password obbligatori" });
      }
      const users = readUsers();
      const found = users.find((u) => u.email === loginId || u.username === loginId);
      if (!found || !verifyPassword(password, found.passwordHash)) {
        return json(res, 401, { ok: false, error: "credenziali non valide" });
      }
      // Se l'utente entra con email admin whitelist, forza privilegi anche se il record e incompleto.
      if (isAdminEmail(loginId) || isAdminEmail(found.email)) {
        found.email = found.email || loginId;
        found.role = "admin";
        found.plan = "lifetime";
        if (!found.paidAt) found.paidAt = new Date().toISOString();
      }
      let usersChanged = ensureAdminPrivileges(found);
      if (isLegacyPasswordHash(found.passwordHash)) {
        found.passwordHash = hashPassword(password);
        usersChanged = true;
      }
      if (usersChanged || isAdminEmail(loginId) || isAdminEmail(found.email)) {
        writeUsers(users);
      }
      const access = evaluateUserAccess(found);
      const token = crypto.randomBytes(24).toString("hex");
      const expiresAt = Date.now() + SESSION_TTL_MS;
      setSession(token, {
        userId: found.username,
        displayName: found.displayName || found.username,
        expiresAt,
      });
      return json(res, 200, {
        ok: true,
        token,
        expiresAt: new Date(expiresAt).toISOString(),
        accessAllowed: access.accessAllowed,
        user: publicUserPayload(found, access),
      });
    } catch (error) {
      return json(res, 400, { ok: false, error: error?.message || "login fallito" });
    }
  }

  if (pathname === "/api/auth/register" && req.method === "POST") {
    try {
      if (isRateLimited(`register:${getClientIp(req)}`, 15, 60 * 60 * 1000)) {
        return json(res, 429, { ok: false, error: "troppe registrazioni da questo IP, riprova piu tardi" });
      }
      const body = await readJsonBody(req);
      const email = normalizeEmail(body?.email || "");
      const usernameRaw = String(body?.username || "").trim().toLowerCase();
      const username = usernameRaw || (email.includes("@") ? email.split("@")[0].replace(/[^a-z0-9._-]/gi, "") : "");
      const password = String(body?.password || "");
      const displayName = String(body?.displayName || username || email).trim();
      const plan = String(body?.plan || "mensile").trim().toLowerCase();
      const sessionId = String(body?.sessionId || body?.session_id || "").trim();
      const allowedPlans = Object.keys(PLAN_CATALOG);
      let normalizedPlan = allowedPlans.includes(plan) ? plan : "mensile";
      let stripeCustomerId = null;
      let paidAt = null;
      let stripeSessionId = null;
      let role = "user";

      if (!email || !email.includes("@")) {
        return json(res, 400, { ok: false, error: "email obbligatoria" });
      }

      const adminFree = isAdminEmail(email);
      if (adminFree) {
        normalizedPlan = "lifetime";
        role = "admin";
        paidAt = new Date().toISOString();
      } else if (REQUIRE_PAYMENT) {
        if (!sessionId) {
          return json(res, 402, { ok: false, error: "pagamento richiesto: completa il checkout prima della registrazione" });
        }
        const paidMap = readPaidSessions();
        if (paidMap[sessionId]?.usedAt) {
          return json(res, 409, { ok: false, error: "questa sessione di pagamento e gia stata usata" });
        }
        const verified = await verifyCheckoutSession(sessionId);
        if (verified.email && email && verified.email !== email) {
          return json(res, 400, { ok: false, error: "usa la stessa email del pagamento Stripe" });
        }
        normalizedPlan = verified.plan;
        stripeCustomerId = verified.customerId;
        paidAt = new Date().toISOString();
        stripeSessionId = verified.id;
      }

      if (!username || !password) {
        return json(res, 400, { ok: false, error: "username e password obbligatori" });
      }
      if (!/^[a-z0-9._-]{3,32}$/i.test(username)) {
        return json(res, 400, { ok: false, error: "username non valido (3-32, lettere/numeri/._-)" });
      }
      if (password.length < 6) {
        return json(res, 400, { ok: false, error: "password troppo corta (min 6)" });
      }
      const users = readUsers();
      if (users.some((u) => u.username === username)) {
        return json(res, 409, { ok: false, error: "username gia registrato" });
      }
      if (users.some((u) => normalizeEmail(u.email) === email)) {
        return json(res, 409, { ok: false, error: "email gia registrata" });
      }
      users.push({
        username,
        email,
        passwordHash: hashPassword(password),
        displayName: displayName || username,
        plan: normalizedPlan,
        role,
        stripeSessionId,
        stripeCustomerId,
        paidAt,
        createdAt: new Date().toISOString(),
      });
      writeUsers(users);

      if (REQUIRE_PAYMENT && stripeSessionId) {
        const paidMap = readPaidSessions();
        paidMap[stripeSessionId] = {
          usedAt: new Date().toISOString(),
          username,
          email,
          plan: normalizedPlan,
        };
        writePaidSessions(paidMap);
      }

      const token = crypto.randomBytes(24).toString("hex");
      const expiresAt = Date.now() + SESSION_TTL_MS;
      setSession(token, {
        userId: username,
        displayName: displayName || username,
        expiresAt,
      });
      const createdUser = {
        username,
        email,
        displayName: displayName || username,
        plan: normalizedPlan,
        role,
        paidAt,
        stripeSessionId,
        stripeCustomerId,
      };
      const access = evaluateUserAccess(createdUser);
      return json(res, 201, {
        ok: true,
        token,
        expiresAt: new Date(expiresAt).toISOString(),
        accessAllowed: access.accessAllowed,
        user: publicUserPayload(createdUser, access),
      });
    } catch (error) {
      return json(res, 400, { ok: false, error: error?.message || "registrazione fallita" });
    }
  }

  if (pathname === "/api/auth/me" && req.method === "GET") {
    const session = getSessionFromRequest(req);
    if (!session) {
      return json(res, 401, { ok: false, error: "sessione non valida", accessAllowed: false });
    }
    const user = getUserFromSession(session);
    const access = evaluateUserAccess(user);
    return json(res, 200, {
      ok: true,
      accessAllowed: access.accessAllowed,
      user: publicUserPayload(user || { username: session.userId, displayName: session.displayName }, access),
      expiresAt: new Date(session.expiresAt).toISOString(),
    });
  }

  if (pathname === "/api/auth/logout" && req.method === "POST") {
    const token = parseBearerToken(req);
    if (token) deleteSession(token);
    return json(res, 200, { ok: true });
  }

  if (pathname === "/api/user/prefs" && req.method === "GET") {
    const session = getSessionFromRequest(req);
    if (!session) {
      return json(res, 401, { ok: false, error: "login richiesto" });
    }
    const userId = session.userId;
    const stored = readUserPrefs(userId);
    return json(res, 200, {
      ok: true,
      userId: sanitizeUserId(userId),
      savedAt: stored?.savedAt || null,
      prefs: stored?.prefs || null,
    });
  }

  if (pathname === "/api/user/prefs" && (req.method === "POST" || req.method === "PUT")) {
    try {
      const session = getSessionFromRequest(req);
      if (!session) {
        return json(res, 401, { ok: false, error: "login richiesto" });
      }
      const body = await readJsonBody(req);
      const userId = sanitizeUserId(session.userId);
      const saved = writeUserPrefs(userId, body?.prefs || {});
      return json(res, 200, {
        ok: true,
        userId: saved.userId,
        savedAt: saved.savedAt,
      });
    } catch (error) {
      return json(res, 400, {
        ok: false,
        error: error?.message || "impossibile salvare preferenze",
      });
    }
  }

  if (pathname === "/api/price/series") {
    if (!requireAppAccess(req, res)) return;
    const assetId = requestUrl.searchParams.get("asset") || "XAUUSD";
    const result = await getPriceSeriesForAsset(assetId);
    return json(res, 200, {
      ok: result.ok,
      mode: result.mode,
      source: result.source,
      assetId: result.assetId,
      snapshot: result.snapshot || null,
      prices: (result.prices || []).map((p) => ({
        date: p.date?.toISOString?.() || null,
        close: p.close,
      })),
    });
  }

  if (pathname === "/api/cot/report") {
    if (!requireAppAccess(req, res)) return;
    const assetId = requestUrl.searchParams.get("asset") || "XAUUSD";
    const result = await getCotRowsForAsset(assetId);
    return json(res, 200, {
      ok: result.ok,
      mode: result.mode,
      source: result.source,
      assetId: result.assetId,
      rows: (result.rows || []).map((r) => ({
        ...r,
        date: r.date?.toISOString?.() || null,
      })),
    });
  }

  if (pathname === "/api/bootstrap") {
    if (!requireAppAccess(req, res)) return;
    const assetId = requestUrl.searchParams.get("asset") || "XAUUSD";
    if (requestUrl.searchParams.get("forceMacro") === "1") {
      await refreshMacroData();
    }
    const [priceResult, cotResult] = await Promise.all([
      getPriceSeriesForAsset(assetId),
      getCotRowsForAsset(assetId),
    ]);
    return json(res, 200, {
      ok: Boolean(priceResult.ok || cotResult.ok || macroState.rows.length),
      assetId: String(assetId).toUpperCase(),
      price: {
        ok: priceResult.ok,
        mode: priceResult.mode,
        source: priceResult.source,
        snapshot: priceResult.snapshot || null,
        prices: (priceResult.prices || []).map((p) => ({
          date: p.date?.toISOString?.() || null,
          close: p.close,
        })),
      },
      cot: {
        ok: cotResult.ok,
        mode: cotResult.mode,
        source: cotResult.source,
        rows: (cotResult.rows || []).map((r) => ({
          ...r,
          date: r.date?.toISOString?.() || null,
        })),
      },
      macro: {
        ok: macroState.rows.length > 0,
        mode: macroState.mode,
        source: macroState.source,
        preferredSource: macroState.preferredSource,
        lastLiveSuccessAt: macroState.lastLiveSuccessAt || null,
        lastRefreshAt: macroState.lastRefreshAt || null,
        rows: macroState.rows.map((r) => ({
          ...r,
          date: r.date?.toISOString?.() || null,
        })),
        errors: macroState.errors,
      },
    });
  }

  if (pathname === "/api/macro/events") {
    if (!requireAppAccess(req, res)) return;
    if (requestUrl.searchParams.get("force") === "1") {
      await refreshMacroData();
    }
    return json(res, 200, {
      ok: macroState.rows.length > 0,
      mode: macroState.mode,
      source: macroState.source,
      preferredSource: macroState.preferredSource,
      lastLiveSuccessAt: macroState.lastLiveSuccessAt || null,
      lastRefreshAt: macroState.lastRefreshAt || null,
      rows: macroState.rows.map((r) => ({
        ...r,
        date: r.date.toISOString(),
      })),
      errors: macroState.errors,
    });
  }

  return serveStatic(req, res, pathname);
});

bootstrapAuthStore();
startMacroScheduler();
server.listen(PORT, HOST, () => {
  console.log(`[server] running on http://${HOST}:${PORT}`);
});

process.on("SIGTERM", () => {
  persistSessionsNow();
  process.exit(0);
});
process.on("SIGINT", () => {
  persistSessionsNow();
  process.exit(0);
});
