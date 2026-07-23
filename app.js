const MONTH_LABELS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
const TIMEFRAMES = {
  "3M": 90,
  "6M": 180,
  "1Y": 365,
  "3Y": 365 * 3,
  "5Y": 365 * 5,
  ALL: null,
};

const statusEl = document.getElementById("status");
const timeframeGroupEl = document.getElementById("timeframeGroup");
const refreshIntervalEl = document.getElementById("refreshInterval");
const userProfileEl = document.getElementById("userProfile");
const refreshNowBtn = document.getElementById("refreshNowBtn");
const resetZoomBtn = document.getElementById("resetZoomBtn");
const lastUpdatedEl = document.getElementById("lastUpdated");
const weeklyFlowRowsEl = document.getElementById("weeklyFlowRows");
const tabCotEl = document.getElementById("tabCot");
const tabSeasonalityEl = document.getElementById("tabSeasonality");
const tabSignalsEl = document.getElementById("tabSignals");
const tabMacroEl = document.getElementById("tabMacro");
const cotPageEl = document.getElementById("cotPage");
const seasonalityPageEl = document.getElementById("seasonalityPage");
const signalPageEl = document.getElementById("signalPage");
const macroPageEl = document.getElementById("macroPage");
const seasonalityYearsEl = document.getElementById("seasonalityYears");
const seasonalityModeEl = document.getElementById("seasonalityMode");
const seasonalityTraceModeEl = document.getElementById("seasonalityTraceMode");
const seasonalityStartMonthEl = document.getElementById("seasonalityStartMonth");
const seasonalityHorizonEl = document.getElementById("seasonalityHorizon");
const seasonalityWindowInfoEl = document.getElementById("seasonalityWindowInfo");
const seasonalityNumbersEl = document.getElementById("seasonalityNumbers");
const seasonalityInsightCardsEl = document.getElementById("seasonalityInsightCards");
const seasonalityRankRowsEl = document.getElementById("seasonalityRankRows");
const seasonalityDayTimingRowsEl = document.getElementById("seasonalityDayTimingRows");
const cotCategoryEl = document.getElementById("cotCategory");
const cotMetricEl = document.getElementById("cotMetric");
const cotLookbackEl = document.getElementById("cotLookback");
const cotChartHeightEl = document.getElementById("cotChartHeight");
const cotChartHeightValueEl = document.getElementById("cotChartHeightValue");
const panelCotFocusEl = document.getElementById("panelCotFocus");
const biasScoreEl = document.getElementById("biasScore");
const biasConfidenceEl = document.getElementById("biasConfidence");
const biasStateEl = document.getElementById("biasState");
const biasDriversEl = document.getElementById("biasDrivers");
const playbookTitleEl = document.getElementById("playbookTitle");
const playbookTextEl = document.getElementById("playbookText");
const alertFeedEl = document.getElementById("alertFeed");
const execSideEl = document.getElementById("execSide");
const execEntryEl = document.getElementById("execEntry");
const execInvalidationEl = document.getElementById("execInvalidation");
const execTargetsEl = document.getElementById("execTargets");
const execRiskSizeEl = document.getElementById("execRiskSize");
const execLeverageEl = document.getElementById("execLeverage");
const execNoteEl = document.getElementById("execNote");
const dataQualityScoreEl = document.getElementById("dataQualityScore");
const dataQualityTextEl = document.getElementById("dataQualityText");
const scenarioProbEl = document.getElementById("scenarioProb");
const scenarioProbTextEl = document.getElementById("scenarioProbText");
const biasContribMainEl = document.getElementById("biasContribMain");
const biasContribTextEl = document.getElementById("biasContribText");
const btSamplesEl = document.getElementById("btSamples");
const btHitRateEl = document.getElementById("btHitRate");
const btAvgEl = document.getElementById("btAvg");
const btMedianEl = document.getElementById("btMedian");
const btBestWorstEl = document.getElementById("btBestWorst");
const signalHistoryRowsEl = document.getElementById("signalHistoryRows");
const healthPriceEl = document.getElementById("healthPrice");
const healthCotEl = document.getElementById("healthCot");
const healthSeasonalityEl = document.getElementById("healthSeasonality");
const alertModeEl = document.getElementById("alertMode");
const replayModeEl = document.getElementById("replayMode");
const replayStepEl = document.getElementById("replayStep");
const replayStepLabelEl = document.getElementById("replayStepLabel");
const sessionNameEl = document.getElementById("sessionName");
const sessionBiasEl = document.getElementById("sessionBias");
const sessionVolEl = document.getElementById("sessionVol");
const sessionNextEl = document.getElementById("sessionNext");
const sessionClockEl = document.getElementById("sessionClock");
const riskAtrEl = document.getElementById("riskAtr");
const riskDailyMoveEl = document.getElementById("riskDailyMove");
const riskRegimeEl = document.getElementById("riskRegime");
const riskStopEl = document.getElementById("riskStop");
const riskSuggestionEl = document.getElementById("riskSuggestion");
const keyPivotEl = document.getElementById("keyPivot");
const keySupportsEl = document.getElementById("keySupports");
const keyResistancesEl = document.getElementById("keyResistances");
const keyTrendEl = document.getElementById("keyTrend");
const replayTsEl = document.getElementById("replayTs");
const replayBiasEl = document.getElementById("replayBias");
const replayScenarioEl = document.getElementById("replayScenario");
const replayQualityEl = document.getElementById("replayQuality");
const adaptiveModeEl = document.getElementById("adaptiveMode");
const adaptiveAlertCadenceEl = document.getElementById("adaptiveAlertCadence");
const adaptiveRiskScaleEl = document.getElementById("adaptiveRiskScale");
const adaptiveRiskCapEl = document.getElementById("adaptiveRiskCap");
const adaptiveStatusEl = document.getElementById("adaptiveStatus");
const scenarioBullTriggerEl = document.getElementById("scenarioBullTrigger");
const scenarioBullInvalidEl = document.getElementById("scenarioBullInvalid");
const scenarioBullProbEl = document.getElementById("scenarioBullProb");
const scenarioBaseTriggerEl = document.getElementById("scenarioBaseTrigger");
const scenarioBaseInvalidEl = document.getElementById("scenarioBaseInvalid");
const scenarioBaseProbEl = document.getElementById("scenarioBaseProb");
const scenarioBearTriggerEl = document.getElementById("scenarioBearTrigger");
const scenarioBearInvalidEl = document.getElementById("scenarioBearInvalid");
const scenarioBearProbEl = document.getElementById("scenarioBearProb");
const signalJournalRowsEl = document.getElementById("signalJournalRows");
const journalStatsEl = document.getElementById("journalStats");
const journalOutcomeFilterEl = document.getElementById("journalOutcomeFilter");
const journalEvalHorizonEl = document.getElementById("journalEvalHorizon");
const exportJournalCsvBtn = document.getElementById("exportJournalCsvBtn");
const layoutModeEl = document.getElementById("layoutMode");
const macroImpactFilterEl = document.getElementById("macroImpactFilter");
const macroCategoryFilterEl = document.getElementById("macroCategoryFilter");
const macroRefreshBtn = document.getElementById("macroRefreshBtn");
const macroSourceInfoEl = document.getElementById("macroSourceInfo");
const macroFeedStateBadgeEl = document.getElementById("macroFeedStateBadge");
const macroDaysContainerEl = document.getElementById("macroDaysContainer");
const notifyChannelEl = document.getElementById("notifyChannel");
const notifyWebhookUrlEl = document.getElementById("notifyWebhookUrl");
const telegramBotTokenEl = document.getElementById("telegramBotToken");
const telegramChatIdEl = document.getElementById("telegramChatId");
const notifyTestBtn = document.getElementById("notifyTestBtn");
const notifyStatusEl = document.getElementById("notifyStatus");
const assetGroupEl = document.getElementById("assetGroup");
const assetSearchEl = document.getElementById("assetSearch");
const assetListEl = document.getElementById("assetList");
const authUserEl = document.getElementById("authUser");
const authPassEl = document.getElementById("authPass");
const authLoginBtn = document.getElementById("authLoginBtn");
const authLogoutBtn = document.getElementById("authLogoutBtn");
const billingPortalBtn = document.getElementById("billingPortalBtn");
const authStatusEl = document.getElementById("authStatus");

const ASSET_CATALOG = [
  { id: "XAUUSD", label: "Gold Spot", group: "Metals", yahooSymbols: ["XAUUSD=X", "GC=F"], stooqSymbol: "xauusd", tvFeeds: [{ market: "cfd", ticker: "TVC:GOLD" }, { market: "forex", ticker: "OANDA:XAUUSD" }], cotMarket: "GOLD - COMMODITY EXCHANGE INC." },
  { id: "XAGUSD", label: "Silver Spot", group: "Metals", yahooSymbols: ["XAGUSD=X", "SI=F"], tvFeeds: [{ market: "cfd", ticker: "TVC:SILVER" }, { market: "forex", ticker: "OANDA:XAGUSD" }], cotMarket: "SILVER - COMMODITY EXCHANGE INC." },
  { id: "XPTUSD", label: "Platinum Spot", group: "Metals", yahooSymbols: ["PL=F"], tvFeeds: [{ market: "cfd", ticker: "TVC:PLATINUM" }], cotMarket: "PLATINUM - NEW YORK MERCANTILE EXCHANGE" },
  { id: "EURUSD", label: "Euro / US Dollar", group: "Forex", yahooSymbols: ["EURUSD=X", "6E=F"], tvFeeds: [{ market: "forex", ticker: "FX:EURUSD" }, { market: "forex", ticker: "OANDA:EURUSD" }], cotMarket: "EURO FX - CHICAGO MERCANTILE EXCHANGE" },
  { id: "GBPUSD", label: "British Pound / US Dollar", group: "Forex", yahooSymbols: ["GBPUSD=X", "6B=F"], tvFeeds: [{ market: "forex", ticker: "FX:GBPUSD" }, { market: "forex", ticker: "OANDA:GBPUSD" }], cotMarket: "BRITISH POUND STERLING - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDJPY", label: "US Dollar / Japanese Yen", group: "Forex", yahooSymbols: ["JPY=X", "6J=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDJPY" }, { market: "forex", ticker: "OANDA:USDJPY" }], cotMarket: "JAPANESE YEN - CHICAGO MERCANTILE EXCHANGE" },
  { id: "AUDUSD", label: "Australian Dollar / US Dollar", group: "Forex", yahooSymbols: ["AUDUSD=X", "6A=F"], tvFeeds: [{ market: "forex", ticker: "FX:AUDUSD" }, { market: "forex", ticker: "OANDA:AUDUSD" }], cotMarket: "AUSTRALIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDCAD", label: "US Dollar / Canadian Dollar", group: "Forex", yahooSymbols: ["CAD=X", "6C=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDCAD" }, { market: "forex", ticker: "OANDA:USDCAD" }], cotMarket: "CANADIAN DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDCHF", label: "US Dollar / Swiss Franc", group: "Forex", yahooSymbols: ["CHF=X", "6S=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDCHF" }, { market: "forex", ticker: "OANDA:USDCHF" }], cotMarket: "SWISS FRANC - CHICAGO MERCANTILE EXCHANGE" },
  { id: "NZDUSD", label: "New Zealand Dollar / US Dollar", group: "Forex", yahooSymbols: ["NZDUSD=X", "6N=F"], tvFeeds: [{ market: "forex", ticker: "FX:NZDUSD" }, { market: "forex", ticker: "OANDA:NZDUSD" }], cotMarket: "NEW ZEALAND DOLLAR - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDMXN", label: "US Dollar / Mexican Peso", group: "Forex", yahooSymbols: ["MXN=X", "6M=F"], tvFeeds: [{ market: "forex", ticker: "FX:USDMXN" }, { market: "forex", ticker: "OANDA:USDMXN" }], cotMarket: "MEXICAN PESO - CHICAGO MERCANTILE EXCHANGE" },
  { id: "USDNOK", label: "US Dollar / Norwegian Krone", group: "Forex", yahooSymbols: ["NOK=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDNOK" }, { market: "forex", ticker: "OANDA:USDNOK" }], cotMarket: null },
  { id: "USDSEK", label: "US Dollar / Swedish Krona", group: "Forex", yahooSymbols: ["SEK=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDSEK" }, { market: "forex", ticker: "OANDA:USDSEK" }], cotMarket: null },
  { id: "USDTRY", label: "US Dollar / Turkish Lira", group: "Forex", yahooSymbols: ["TRY=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDTRY" }, { market: "forex", ticker: "OANDA:USDTRY" }], cotMarket: null },
  { id: "USDZAR", label: "US Dollar / South African Rand", group: "Forex", yahooSymbols: ["ZAR=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDZAR" }, { market: "forex", ticker: "OANDA:USDZAR" }], cotMarket: null },
  { id: "USDCNH", label: "US Dollar / Offshore Chinese Yuan", group: "Forex", yahooSymbols: ["CNH=X"], tvFeeds: [{ market: "forex", ticker: "FX:USDCNH" }, { market: "forex", ticker: "OANDA:USDCNH" }], cotMarket: null },
  { id: "SPX500", label: "S&P 500", group: "Indices", yahooSymbols: ["^GSPC", "ES=F"], tvFeeds: [{ market: "indices", ticker: "SP:SPX" }, { market: "cfd", ticker: "OANDA:SPX500USD" }], cotMarket: "E-MINI S&P 500 STOCK INDEX - CHICAGO MERCANTILE EXCHANGE" },
  { id: "NAS100", label: "Nasdaq 100", group: "Indices", yahooSymbols: ["^NDX", "NQ=F"], tvFeeds: [{ market: "indices", ticker: "NASDAQ:NDX" }, { market: "cfd", ticker: "OANDA:NAS100USD" }], cotMarket: "E-MINI NASDAQ-100 STOCK INDEX - CHICAGO MERCANTILE EXCHANGE" },
  { id: "DOW30", label: "Dow Jones 30", group: "Indices", yahooSymbols: ["^DJI", "YM=F"], tvFeeds: [{ market: "indices", ticker: "DJ:DJI" }, { market: "cfd", ticker: "OANDA:US30USD" }], cotMarket: null },
  { id: "RUS2000", label: "Russell 2000", group: "Indices", yahooSymbols: ["^RUT", "RTY=F"], tvFeeds: [{ market: "indices", ticker: "RUSSELL:RUT" }], cotMarket: null },
  { id: "DAX40", label: "DAX 40", group: "Indices", yahooSymbols: ["^GDAXI"], tvFeeds: [{ market: "indices", ticker: "XETR:DAX" }], cotMarket: null },
  { id: "FTSE100", label: "FTSE 100", group: "Indices", yahooSymbols: ["^FTSE"], tvFeeds: [{ market: "indices", ticker: "TVC:UKX" }], cotMarket: null },
  { id: "NIKKEI225", label: "Nikkei 225", group: "Indices", yahooSymbols: ["^N225"], tvFeeds: [{ market: "indices", ticker: "TVC:NI225" }], cotMarket: null },
  { id: "HANGSENG", label: "Hang Seng", group: "Indices", yahooSymbols: ["^HSI"], tvFeeds: [{ market: "indices", ticker: "HSI:HSI" }], cotMarket: null },
  { id: "XPDUSD", label: "Palladium Spot", group: "Metals", yahooSymbols: ["PA=F"], tvFeeds: [{ market: "cfd", ticker: "TVC:PALLADIUM" }], cotMarket: null },
  { id: "COPPER", label: "Copper", group: "Metals", yahooSymbols: ["HG=F"], tvFeeds: [{ market: "futures", ticker: "COMEX:HG1!" }], cotMarket: "COPPER-GRADE #1 - COMMODITY EXCHANGE INC." },
  { id: "WHEAT", label: "Wheat", group: "Agriculture", yahooSymbols: ["ZW=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZW1!" }], cotMarket: "WHEAT-SRW - CHICAGO BOARD OF TRADE" },
  { id: "CORN", label: "Corn", group: "Agriculture", yahooSymbols: ["ZC=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZC1!" }], cotMarket: "CORN - CHICAGO BOARD OF TRADE" },
  { id: "SOYBEAN", label: "Soybeans", group: "Agriculture", yahooSymbols: ["ZS=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZS1!" }], cotMarket: "SOYBEANS - CHICAGO BOARD OF TRADE" },
  { id: "SOYMEAL", label: "Soybean Meal", group: "Agriculture", yahooSymbols: ["ZM=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZM1!" }], cotMarket: null },
  { id: "SOYOIL", label: "Soybean Oil", group: "Agriculture", yahooSymbols: ["ZL=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZL1!" }], cotMarket: null },
  { id: "COFFEE", label: "Coffee", group: "Agriculture", yahooSymbols: ["KC=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:KC1!" }], cotMarket: "COFFEE C - ICE FUTURES U.S." },
  { id: "SUGAR", label: "Sugar", group: "Agriculture", yahooSymbols: ["SB=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:SB1!" }], cotMarket: "SUGAR NO. 11 - ICE FUTURES U.S." },
  { id: "COTTON", label: "Cotton", group: "Agriculture", yahooSymbols: ["CT=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:CT1!" }], cotMarket: "COTTON NO. 2 - ICE FUTURES U.S." },
  { id: "COCOA", label: "Cocoa", group: "Agriculture", yahooSymbols: ["CC=F"], tvFeeds: [{ market: "futures", ticker: "ICEUS:CC1!" }], cotMarket: "COCOA - ICE FUTURES U.S." },
  { id: "OATS", label: "Oats", group: "Agriculture", yahooSymbols: ["ZO=F"], tvFeeds: [{ market: "futures", ticker: "CBOT:ZO1!" }], cotMarket: null },
];

const PRICE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const COT_CACHE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

const state = {
  selectedAssetId: "XAUUSD",
  selectedAssetGroup: "ALL",
  timeframe: "1Y",
  activePage: "cot",
  seasonalityYears: 10,
  seasonalityMode: "line",
  seasonalityTraceMode: "none",
  seasonalityStartMonth: new Date().getUTCMonth(),
  seasonalityHorizon: 3,
  refreshSeconds: 10,
  timerId: null,
  priceData: null,
  marketSnapshot: null,
  marketSymbol: null,
  cotData: null,
  cotSource: "",
  cotFocusedChart: null,
  cotChartCategory: "nonCommercial",
  cotMetric: "tvLegacyNet",
  cotLookback: 156,
  cotChartHeight: 540,
  seasonalityChart: null,
  resizeObserversReady: false,
  renderScheduled: false,
  isLoading: false,
  chartingAvailable: true,
  userProfile: "swing",
  latestSeasonalityPayload: null,
  alertMode: "balanced",
  replayMode: "off",
  replayStep: 0,
  alerts: [],
  snapshotHistory: [],
  signalJournal: [],
  journalOutcomeFilter: "ALL",
  journalEvalHorizonHours: 4,
  layoutMode: "desk",
  macroEvents: [],
  macroSource: "--",
  macroImpactFilter: "ALL",
  macroCategoryFilter: "ALL",
  macroPreferredSource: null,
  notifyChannel: "none",
  notifyWebhookUrl: "",
  telegramBotToken: "",
  telegramChatId: "",
  macroLastFetchAt: 0,
  macroLastLiveSuccessAt: 0,
  macroIsLoading: false,
  lastExternalNotifyAt: {},
  lastJournalKey: null,
  currentQualityScore: 70,
  lastSmartAlertAt: {},
  lastSignals: {
    biasState: null,
    cotRegime: null,
    execSide: null,
    dataQualityBucket: null,
    scenarioBucket: null,
    priceHealth: null,
    cotHealth: null,
    macroRiskOff: null,
  },
  latestSpot: null,
  latestVolPct: null,
  signalHistory: [],
  sourceHealth: {
    price: { status: "unknown", latencyMs: null, source: "--", lastSuccessAt: null, error: null },
    cot: { status: "unknown", latencyMs: null, source: "--", lastSuccessAt: null, error: null },
    seasonality: { status: "unknown", source: "--", lastSuccessAt: null, error: null },
  },
  auth: {
    token: null,
    user: null,
    expiresAt: null,
  },
};

const CACHE_KEYS = {
  PRICE: "xau_dashboard_price_v1",
  COT: "xau_dashboard_cot_v2",
  MACRO: "xau_dashboard_macro_v1",
};

const PREFS_KEY = "xau_dashboard_prefs_v1";
const APP_USER_ID_KEY = "leona_lab_user_id";
const DEFAULT_APP_USER_ID = "leona-default";
const AUTH_TOKEN_KEY = "leona_lab_auth_token";

function getAssetScopedCacheKey(baseKey) {
  return `${baseKey}_${state.selectedAssetId || "XAUUSD"}`;
}

function fmtNum(value, digits = 2) {
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

function fmtInt(value) {
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 }).format(value);
}

function setText(id, text, className = "") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.remove("up", "down");
  if (className) el.classList.add(className);
}

function saveCache(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
}

function loadCache(key, maxAgeMs = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Number.isFinite(maxAgeMs) && maxAgeMs > 0) {
      const stamp = parsed?.cachedAt || parsed?.fetchedAt || null;
      const ageMs = stamp ? Date.now() - new Date(stamp).getTime() : Number.POSITIVE_INFINITY;
      if (!Number.isFinite(ageMs) || ageMs > maxAgeMs) return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function buildPrefsSnapshot() {
  return {
    selectedAssetId: state.selectedAssetId,
    selectedAssetGroup: state.selectedAssetGroup,
    activePage: state.activePage,
    alertMode: state.alertMode,
    replayMode: state.replayMode,
    replayStep: state.replayStep,
    journalOutcomeFilter: state.journalOutcomeFilter,
    journalEvalHorizonHours: state.journalEvalHorizonHours,
    layoutMode: state.layoutMode,
    macroImpactFilter: state.macroImpactFilter,
    macroCategoryFilter: state.macroCategoryFilter,
    macroPreferredSource: state.macroPreferredSource,
    notifyChannel: state.notifyChannel,
    notifyWebhookUrl: state.notifyWebhookUrl,
    telegramBotToken: state.telegramBotToken,
    telegramChatId: state.telegramChatId,
    userProfile: state.userProfile,
    seasonalityTraceMode: state.seasonalityTraceMode,
    seasonalityYears: state.seasonalityYears,
    seasonalityMode: state.seasonalityMode,
    seasonalityStartMonth: state.seasonalityStartMonth,
    seasonalityHorizon: state.seasonalityHorizon,
    cotCategory: state.cotChartCategory,
    cotMetric: state.cotMetric,
    cotLookback: state.cotLookback,
    refreshSeconds: state.refreshSeconds,
  };
}

function getAppUserId() {
  try {
    const fromStore = localStorage.getItem(APP_USER_ID_KEY);
    if (fromStore && fromStore.trim()) return fromStore;
    localStorage.setItem(APP_USER_ID_KEY, DEFAULT_APP_USER_ID);
  } catch {
    // ignore
  }
  return DEFAULT_APP_USER_ID;
}

function getStoredAuthToken() {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token && token.trim() ? token : null;
  } catch {
    return null;
  }
}

function persistAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // ignore
  }
}

function applyAuthUi() {
  const isAuth = Boolean(state.auth?.token);
  if (authUserEl) authUserEl.disabled = isAuth;
  if (authPassEl) authPassEl.disabled = isAuth;
  if (authLoginBtn) authLoginBtn.disabled = isAuth;
  if (authLogoutBtn) authLogoutBtn.disabled = !isAuth;
  if (billingPortalBtn) billingPortalBtn.disabled = !isAuth;
  if (authStatusEl) {
    authStatusEl.textContent = isAuth
      ? `Sessione: ${state.auth?.user?.name || state.auth?.user?.id || "utente"}`
      : "Non autenticata";
  }
}

function clearAuthState() {
  state.auth.token = null;
  state.auth.user = null;
  state.auth.expiresAt = null;
  persistAuthToken(null);
  applyAuthUi();
}

async function fetchJsonWithAuth(url, { method = "GET", body = undefined, withAuth = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (withAuth && state.auth?.token) {
    headers.Authorization = `Bearer ${state.auth.token}`;
  }
  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // keep null
  }
  if (!response.ok) {
    throw new Error(payload?.error || `HTTP ${response.status}`);
  }
  return payload;
}

async function loginAppUser(username, password) {
  const base = getMacroBackendBaseUrl();
  const payload = await fetchJsonWithAuth(`${base}/api/auth/login`, {
    method: "POST",
    body: { username, password },
    withAuth: false,
  });
  if (!payload?.token) throw new Error("token mancante");
  state.auth.token = payload.token;
  state.auth.user = payload.user || { id: username, name: username };
  state.auth.expiresAt = payload.expiresAt || null;
  persistAuthToken(payload.token);
  applyAuthUi();
}

async function hydrateAuthFromStorage() {
  const token = getStoredAuthToken();
  if (!token) {
    clearAuthState();
    return false;
  }
  state.auth.token = token;
  try {
    const base = getMacroBackendBaseUrl();
    const payload = await fetchJsonWithAuth(`${base}/api/auth/me`);
    state.auth.user = payload?.user || null;
    state.auth.expiresAt = payload?.expiresAt || null;
    applyAuthUi();
    return true;
  } catch {
    clearAuthState();
    return false;
  }
}

async function logoutAppUser() {
  try {
    if (state.auth?.token) {
      const base = getMacroBackendBaseUrl();
      await fetchJsonWithAuth(`${base}/api/auth/logout`, { method: "POST" });
    }
  } catch {
    // ignore
  } finally {
    clearAuthState();
  }
}

let prefsSaveTimer = null;
let prefsSavePending = false;
let prefsLastPayload = null;

async function persistPrefsToBackend(prefs) {
  if (!state.auth?.token) return;
  const base = getMacroBackendBaseUrl();
  const url = `${base}/api/user/prefs`;
  await fetchJsonWithAuth(url, {
    method: "PUT",
    body: {
      userId: getAppUserId(),
      prefs,
    },
  });
}

function schedulePrefsBackendSave(prefs) {
  prefsLastPayload = prefs;
  prefsSavePending = true;
  if (prefsSaveTimer) clearTimeout(prefsSaveTimer);
  prefsSaveTimer = setTimeout(async () => {
    if (!prefsSavePending || !prefsLastPayload) return;
    prefsSavePending = false;
    try {
      await persistPrefsToBackend(prefsLastPayload);
    } catch {
      // keep local prefs as fallback
    }
  }, 450);
}

function savePrefs() {
  try {
    const prefs = buildPrefsSnapshot();
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    schedulePrefsBackendSave(prefs);
  } catch {
    // ignore
  }
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function loadPrefsFromBackend() {
  if (!state.auth?.token) return null;
  try {
    const base = getMacroBackendBaseUrl();
    const url = `${base}/api/user/prefs`;
    const payload = await fetchJsonWithAuth(url);
    if (!payload || !payload.prefs || typeof payload.prefs !== "object") return null;
    return payload.prefs;
  } catch {
    return null;
  }
}

function getAssetById(assetId) {
  const key = String(assetId || "").toUpperCase();
  return ASSET_CATALOG.find((a) => a.id === key) || ASSET_CATALOG[0];
}

function getAssetsByGroup(group = "ALL") {
  if (!group || group === "ALL") return ASSET_CATALOG.slice();
  return ASSET_CATALOG.filter((a) => a.group === group);
}

function getSelectedAsset() {
  return getAssetById(state.selectedAssetId);
}

function formatAssetSearchValue(asset) {
  return `${asset.id} | ${asset.label} (${asset.group})`;
}

function applySelectedAsset(assetId, { syncInput = true } = {}) {
  const asset = getAssetById(assetId);
  state.selectedAssetId = asset.id;
  if (state.selectedAssetGroup !== "ALL" && asset.group !== state.selectedAssetGroup) {
    state.selectedAssetGroup = asset.group;
  }
  if (assetGroupEl && assetGroupEl.value !== state.selectedAssetGroup) {
    assetGroupEl.value = state.selectedAssetGroup;
  }
  if (syncInput && assetSearchEl) {
    assetSearchEl.value = formatAssetSearchValue(asset);
  }
  return asset;
}

function resolveAssetIdFromInput(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const head = raw.split("|")[0]?.trim()?.toUpperCase();
  if (ASSET_CATALOG.some((a) => a.id === head)) return head;
  const upper = raw.toUpperCase();
  const exact = ASSET_CATALOG.find((a) => a.id === upper || a.label.toUpperCase() === upper);
  if (exact) return exact.id;
  const partial = ASSET_CATALOG.find((a) => a.id.includes(upper) || a.label.toUpperCase().includes(upper));
  return partial?.id || null;
}

function populateAssetList() {
  if (!assetListEl) return;
  const list = getAssetsByGroup(state.selectedAssetGroup);
  assetListEl.innerHTML = list.map((a) => `<option value="${formatAssetSearchValue(a)}"></option>`).join("");
}

function applyLayoutMode(mode) {
  const nextMode = mode === "focus" ? "focus" : "desk";
  state.layoutMode = nextMode;
  document.body.classList.remove("layout-desk", "layout-focus");
  document.body.classList.add(nextMode === "desk" ? "layout-desk" : "layout-focus");
  if (layoutModeEl && layoutModeEl.value !== nextMode) {
    layoutModeEl.value = nextMode;
  }
}

function getMacroEventDescription(eventName) {
  const e = String(eventName || "").toUpperCase();
  if (e.includes("CPI") || e.includes("INFLATION")) {
    return "Misura l'inflazione al consumo: impatta aspettative su tassi FED e USD, con alta volatilita sugli asset risk e metalli.";
  }
  if (e.includes("FOMC") || e.includes("FED")) {
    return "Decisione/linea guida della Federal Reserve: influenza direttamente rendimenti reali e direzione del gold.";
  }
  if (e.includes("NFP") || e.includes("NON-FARM")) {
    return "Dati occupazione USA: segnale chiave su forza economia e policy FED, evento ad alto impatto sul metallo.";
  }
  return "Dato macro rilevante per USD/tassi reali; puo alterare rapidamente sentiment e pricing multi-asset.";
}

function getMacroEventAudience(eventName, category) {
  const e = String(eventName || "").toUpperCase();
  if (category === "CPI" || e.includes("CPI") || e.includes("INFLATION")) {
    return "Riguarda FED, Treasury, USD, oro e asset sensibili ai tassi reali.";
  }
  if (category === "FOMC" || e.includes("FOMC") || e.includes("FED")) {
    return "Riguarda politica monetaria USA: banche, bond, USD, gold e indici globali.";
  }
  if (category === "NFP" || e.includes("NFP") || e.includes("NON-FARM")) {
    return "Riguarda mercato del lavoro USA: aspettative FED, dollaro, rendimenti e metalli.";
  }
  return "Riguarda principalmente USD, tassi USA e sentiment risk-on/risk-off.";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
  ) {
    return "FOMC";
  }
  if (
    e.includes("NFP") ||
    e.includes("NON-FARM") ||
    e.includes("NON FARM PAYROLL") ||
    e.includes("NON-FARM EMPLOYMENT") ||
    e.includes("PAYROLLS")
  ) {
    return "NFP";
  }
  if (e.includes("PCE")) return "PCE";
  if (e.includes("GDP") || e.includes("GROSS DOMESTIC PRODUCT")) return "GDP";
  if (e.includes("PMI") || e.includes("ISM")) return "PMI";
  if (e.includes("RETAIL SALES")) return "RETAIL";
  if (e.includes("UNEMPLOYMENT") || e.includes("JOBLESS")) return "LABOR";
  return "OTHER";
}

function normalizeMacroImpact(impactRaw) {
  const i = String(impactRaw || "").toLowerCase();
  if (i.includes("high") || i.includes("alto") || i === "3") return "high";
  if (i.includes("medium") || i.includes("medio") || i === "2") return "medium";
  return "low";
}

function formatMacroDayKey(dateObj) {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
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
  // UTC noon avoids date drift when rendered with toISOString across timezones.
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function formatRomeTime(dateObj) {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return "--";
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);
}

function formatRomeDayLabel(dateObj) {
  if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) return "--";
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

function withTimeout(promise, timeoutMs = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout ${timeoutMs}ms`)), timeoutMs)),
  ]);
}

async function fetchTextAnyRoute(url) {
  const stripped = url.replace(/^https?:\/\//i, "");
  const routes = [
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://cors.isomorphic-git.org/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://r.jina.ai/http://${stripped}`,
    `https://r.jina.ai/http://${stripped.replace(/^https?:\/\//i, "")}`,
  ];
  let lastErr = null;
  for (const route of routes) {
    try {
      const response = await withTimeout(fetch(route, { headers: { Accept: "application/json,text/plain,*/*" } }), 9000);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const txt = await response.text();
      if (txt && txt.trim().length > 0) return txt;
      throw new Error("risposta vuota");
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("nessuna route disponibile");
}

async function fetchJsonAnyRoute(url) {
  const txt = await fetchTextAnyRoute(url);
  try {
    return JSON.parse(txt);
  } catch {
    const startArr = txt.indexOf("[");
    const endArr = txt.lastIndexOf("]");
    if (startArr >= 0 && endArr > startArr) {
      try {
        return JSON.parse(txt.slice(startArr, endArr + 1));
      } catch {
        // keep trying object parse
      }
    }
    const startObj = txt.indexOf("{");
    const endObj = txt.lastIndexOf("}");
    if (startObj >= 0 && endObj > startObj) {
      try {
        return JSON.parse(txt.slice(startObj, endObj + 1));
      } catch {
        // no-op
      }
    }
    throw new Error("payload non JSON");
  }
}

const MACRO_REFRESH_MS_OK = 5 * 60 * 1000;
const MACRO_REFRESH_MS_DEGRADED = 60 * 1000;
const MACRO_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function isUsMacroCountry(value) {
  const countryNorm = String(value || "US").toUpperCase();
  return countryNorm === "US" || countryNorm === "USD" || countryNorm.includes("UNITED STATES") || countryNorm.includes("U.S.");
}

function normalizeMacroRows(rows, sourceName, sourceUrl) {
  return (Array.isArray(rows) ? rows : [])
    .map((r) => ({
      ...r,
      date: parseMacroDate(r?.date),
      event: String(r?.event || "").trim(),
      country: String(r?.country || "US"),
      category: String(r?.category || "OTHER").toUpperCase(),
      impact: normalizeMacroImpact(r?.impact || "low"),
      previous: String(r?.previous ?? "--"),
      forecast: String(r?.forecast ?? "--"),
      actual: String(r?.actual ?? "--"),
      source: r?.source || `${sourceName} | ${sourceUrl}`,
    }))
    .filter((r) => r.event && isUsMacroCountry(r.country) && r.date instanceof Date && !Number.isNaN(r.date.getTime()))
    .map((r) => ({ ...r, time: formatRomeTime(r.date) }));
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

function setMacroFeedBadge(mode = "unknown") {
  if (!macroFeedStateBadgeEl) return;
  const map = {
    live: { label: "LIVE", cls: "macro-feed-live" },
    failover: { label: "FAILOVER", cls: "macro-feed-failover" },
    cache: { label: "CACHE", cls: "macro-feed-cache" },
    down: { label: "DOWN", cls: "macro-feed-down" },
    unknown: { label: "UNKNOWN", cls: "macro-feed-unknown" },
  };
  const selected = map[mode] || map.unknown;
  macroFeedStateBadgeEl.textContent = selected.label;
  macroFeedStateBadgeEl.classList.remove("macro-feed-live", "macro-feed-failover", "macro-feed-cache", "macro-feed-down", "macro-feed-unknown");
  macroFeedStateBadgeEl.classList.add("macro-feed-badge", selected.cls);
}

function getMacroBackendBaseUrl() {
  if (typeof window === "undefined") return "";
  if (window.location?.protocol === "file:") {
    return "http://127.0.0.1:8787";
  }
  return "";
}

async function fetchMacroCalendarFromBackend() {
  const base = getMacroBackendBaseUrl();
  const url = `${base}/api/macro/events?t=${Date.now()}`;
  const payload = await fetchJson(url);
  if (!payload || !Array.isArray(payload.rows) || !payload.rows.length) {
    throw new Error(payload?.source || "backend macro vuoto");
  }
  const rows = payload.rows
    .map((r) => {
      const dateObj = parseMacroDate(r.date);
      if (!dateObj) return null;
      return {
        date: dateObj,
        time: formatRomeTime(dateObj),
        country: String(r.country || "US"),
        event: String(r.event || "").trim(),
        category: String(r.category || "OTHER"),
        impact: normalizeMacroImpact(r.impact || "low"),
        previous: String(r.previous ?? "--"),
        forecast: String(r.forecast ?? "--"),
        actual: String(r.actual ?? "--"),
        source: String(r.source || payload.source || "backend"),
      };
    })
    .filter(Boolean);
  if (!rows.length) {
    throw new Error("backend macro non valido");
  }
  return {
    rows: dedupeMacroRows(rows),
    source: `Backend ${payload.mode || "LIVE"} | ${payload.source || "feed macro"}`,
    mode: String(payload.mode || "LIVE").toUpperCase(),
    primarySource: payload.preferredSource || null,
  };
}

async function fetchBootstrapFromBackend(asset) {
  const base = getMacroBackendBaseUrl();
  const url = `${base}/api/bootstrap?asset=${encodeURIComponent(asset?.id || "XAUUSD")}&t=${Date.now()}`;
  const payload = await fetchJson(url);
  if (!payload || payload.ok === false) {
    throw new Error("bootstrap backend non disponibile");
  }
  const pricePayload = payload.price || {};
  const cotPayload = payload.cot || {};
  const macroPayload = payload.macro || {};

  const prices = (pricePayload.prices || [])
    .map((p) => ({
      date: parseMacroDate(p.date),
      close: Number(p.close),
    }))
    .filter((p) => p.date instanceof Date && !Number.isNaN(p.date.getTime()) && Number.isFinite(p.close))
    .sort((a, b) => a.date - b.date);

  const cotRows = (cotPayload.rows || [])
    .map((row) => {
      const date = parseCotReportDate(row.date);
      const oi = Number(row.oi);
      const commercialLong = Number(row.commercialLong);
      const commercialShort = Number(row.commercialShort);
      const nonCommercialLong = Number(row.nonCommercialLong);
      const nonCommercialShort = Number(row.nonCommercialShort);
      const retailLong = Number(row.retailLong);
      const retailShort = Number(row.retailShort);
      if (
        !(date instanceof Date) ||
        Number.isNaN(date.getTime()) ||
        ![
          oi,
          commercialLong,
          commercialShort,
          nonCommercialLong,
          nonCommercialShort,
          retailLong,
          retailShort,
        ].every(Number.isFinite)
      ) {
        return null;
      }
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

  const macroRows = (macroPayload.rows || [])
    .map((r) => {
      const dateObj = parseMacroDate(r.date);
      if (!dateObj) return null;
      return {
        date: dateObj,
        time: formatRomeTime(dateObj),
        country: String(r.country || "US"),
        event: String(r.event || "").trim(),
        category: String(r.category || "OTHER"),
        impact: normalizeMacroImpact(r.impact || "low"),
        previous: String(r.previous ?? "--"),
        forecast: String(r.forecast ?? "--"),
        actual: String(r.actual ?? "--"),
        source: String(r.source || macroPayload.source || "backend"),
      };
    })
    .filter(Boolean);

  return {
    priceData: prices.length ? {
      source: `Backend ${pricePayload.mode || "LIVE"} | ${pricePayload.source || "prezzi"}`,
      prices,
      snapshot: (() => {
        const snap = pricePayload.snapshot || null;
        if (!snap) return null;
        const px = Number(snap.price ?? snap.close);
        return {
          ...snap,
          price: Number.isFinite(px) && px > 0 ? px : null,
          high52w: Number(snap.high52w) > 0 ? Number(snap.high52w) : null,
          low52w: Number(snap.low52w) > 0 ? Number(snap.low52w) : null,
        };
      })(),
    } : null,
    cotData: cotRows.length ? {
      rows: cotRows,
      source: `Backend ${cotPayload.mode || "LIVE"} | ${cotPayload.source || "COT"}`,
    } : null,
    macroData: macroRows.length ? {
      rows: dedupeMacroRows(macroRows),
      source: `Backend ${macroPayload.mode || "LIVE"} | ${macroPayload.source || "feed macro"}`,
      mode: String(macroPayload.mode || "LIVE").toUpperCase(),
      primarySource: macroPayload.preferredSource || null,
    } : null,
  };
}

async function fetchPriceSeriesFromBackend(asset) {
  const base = getMacroBackendBaseUrl();
  const url = `${base}/api/price/series?asset=${encodeURIComponent(asset?.id || "XAUUSD")}&t=${Date.now()}`;
  const payload = await fetchJson(url);
  if (!payload || !Array.isArray(payload.prices) || !payload.prices.length) {
    throw new Error(payload?.source || "backend prezzi vuoto");
  }
  const prices = payload.prices
    .map((p) => ({
      date: parseMacroDate(p.date),
      close: Number(p.close),
    }))
    .filter((p) => p.date instanceof Date && !Number.isNaN(p.date.getTime()) && Number.isFinite(p.close))
    .sort((a, b) => a.date - b.date);
  if (prices.length < 200) throw new Error("backend storico insufficiente");
  return {
    source: `Backend ${payload.mode || "LIVE"} | ${payload.source || "prezzi"}`,
    prices,
    snapshot: (() => {
      const snap = payload.snapshot || null;
      if (!snap) return null;
      const px = Number(snap.price ?? snap.close);
      return {
        ...snap,
        price: Number.isFinite(px) && px > 0 ? px : null,
        high52w: Number(snap.high52w) > 0 ? Number(snap.high52w) : null,
        low52w: Number(snap.low52w) > 0 ? Number(snap.low52w) : null,
      };
    })(),
  };
}

async function fetchCotForAssetFromBackend(asset) {
  const base = getMacroBackendBaseUrl();
  const url = `${base}/api/cot/report?asset=${encodeURIComponent(asset?.id || "XAUUSD")}&t=${Date.now()}`;
  const payload = await fetchJson(url);
  if (!payload || !Array.isArray(payload.rows) || !payload.rows.length) {
    throw new Error(payload?.source || "backend COT vuoto");
  }
  const rows = payload.rows
    .map((row) => {
      const date = parseCotReportDate(row.date);
      const oi = Number(row.oi);
      const commercialLong = Number(row.commercialLong);
      const commercialShort = Number(row.commercialShort);
      const nonCommercialLong = Number(row.nonCommercialLong);
      const nonCommercialShort = Number(row.nonCommercialShort);
      const retailLong = Number(row.retailLong);
      const retailShort = Number(row.retailShort);
      if (
        !(date instanceof Date) ||
        Number.isNaN(date.getTime()) ||
        ![
          oi,
          commercialLong,
          commercialShort,
          nonCommercialLong,
          nonCommercialShort,
          retailLong,
          retailShort,
        ].every(Number.isFinite)
      ) {
        return null;
      }
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
  if (!rows.length) throw new Error("backend COT non valido");
  return {
    rows,
    source: `Backend ${payload.mode || "LIVE"} | ${payload.source || "COT"}`,
  };
}

async function fetchMacroCalendar() {
  try {
    return await fetchMacroCalendarFromBackend();
  } catch {
    // fallback client-side
  }
  const sources = [
    {
      name: "TradingEconomics-US",
      url: "https://api.tradingeconomics.com/calendar/country/united%20states?c=guest:guest&f=json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        const mapped = raw
          .map((r) => {
            const event = String(r.Event || r.event || r.Title || r.title || "").trim();
            const dateObj = parseMacroDate(r.Date || r.date || r.DateUtc || r.ReferenceDate);
            if (!event || !dateObj) return null;
            const country = String(r.Country || r.country || "US");
            if (!isUsMacroCountry(country)) return null;
            const category = normalizeMacroCategory(`${r.Category || ""} ${event}`);
            const impact = normalizeMacroImpact(r.Importance || r.importance || r.Priority || "");
            return {
              date: dateObj,
              country,
              event,
              category,
              impact,
              previous: String(r.Previous ?? r.previous ?? "--"),
              forecast: String(r.Forecast ?? r.forecast ?? "--"),
              actual: String(r.Actual ?? r.actual ?? "--"),
              source: `${url}`,
            };
          })
          .filter(Boolean);
        return normalizeMacroRows(mapped, "TradingEconomics-US", url);
      },
    },
    {
      name: "TradingEconomics-Calendar",
      url: "https://api.tradingeconomics.com/calendar?c=guest:guest&f=json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        const mapped = raw
          .map((r) => {
            const event = String(r.Event || r.event || r.Title || r.title || "").trim();
            const dateObj = parseMacroDate(r.Date || r.date || r.DateUtc || r.ReferenceDate);
            if (!event || !dateObj) return null;
            const country = String(r.Country || r.country || "US");
            if (!isUsMacroCountry(country)) return null;
            const category = normalizeMacroCategory(`${r.Category || ""} ${event}`);
            const impact = normalizeMacroImpact(r.Importance || r.importance || r.Priority || "");
            return {
              date: dateObj,
              country,
              event,
              category,
              impact,
              previous: String(r.Previous ?? r.previous ?? "--"),
              forecast: String(r.Forecast ?? r.forecast ?? "--"),
              actual: String(r.Actual ?? r.actual ?? "--"),
              source: `${url}`,
            };
          })
          .filter(Boolean);
        return normalizeMacroRows(mapped, "TradingEconomics-Calendar", url);
      },
    },
    {
      name: "FairEconomy-Week",
      url: "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        const mapped = raw
          .map((r) => {
            const event = String(r.title || r.event || r.name || "").trim();
            const dateObj = parseMacroDate(r.date || r.datetime);
            if (!event || !dateObj) return null;
            const category = normalizeMacroCategory(event);
            const country = String(r.country || "US");
            if (!isUsMacroCountry(country)) return null;
            const impact = normalizeMacroImpact(r.impact || r.importance || r.volatility || "");
            return {
              date: dateObj,
              country,
              event,
              category,
              impact,
              previous: String(r.previous || r.prev || "--"),
              forecast: String(r.forecast || r.consensus || "--"),
              actual: String(r.actual || "--"),
              source: `${url}`,
            };
          })
          .filter(Boolean);
        return normalizeMacroRows(mapped, "FairEconomy-Week", url);
      },
    },
    {
      name: "FairEconomy-Month",
      url: "https://nfs.faireconomy.media/ff_calendar_thismonth.json",
      parser: (raw, url) => {
        if (!Array.isArray(raw)) return [];
        const mapped = raw
          .map((r) => {
            const event = String(r.title || r.event || r.name || "").trim();
            const dateObj = parseMacroDate(r.date || r.datetime);
            if (!event || !dateObj) return null;
            const category = normalizeMacroCategory(event);
            const country = String(r.country || "US");
            if (!isUsMacroCountry(country)) return null;
            const impact = normalizeMacroImpact(r.impact || r.importance || r.volatility || "");
            return {
              date: dateObj,
              country,
              event,
              category,
              impact,
              previous: String(r.previous || r.prev || "--"),
              forecast: String(r.forecast || r.consensus || "--"),
              actual: String(r.actual || "--"),
              source: `${url}`,
            };
          })
          .filter(Boolean);
        return normalizeMacroRows(mapped, "FairEconomy-Month", url);
      },
    },
    {
      name: "AlphaVantage-Calendar",
      url: "https://www.alphavantage.co/query?function=ECONOMIC_CALENDAR&horizon=12month&apikey=demo",
      parser: (raw, url) => {
        const data = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        if (!data.length) return [];
        const mapped = data
          .map((r) => {
            const event = String(r.event || r.name || r.title || "").trim();
            const dateObj = parseMacroDate(r.date || r.datetime || r.time);
            if (!event || !dateObj) return null;
            const country = String(r.country || r.region || "US");
            if (!isUsMacroCountry(country)) return null;
            const category = normalizeMacroCategory(event);
            const impact = normalizeMacroImpact(r.impact || r.importance || r.volatility || "");
            return {
              date: dateObj,
              country,
              event,
              category,
              impact,
              previous: String(r.previous || r.prev || "--"),
              forecast: String(r.forecast || r.estimate || r.consensus || "--"),
              actual: String(r.actual || "--"),
              source: `${url}`,
            };
          })
          .filter(Boolean);
        return normalizeMacroRows(mapped, "AlphaVantage-Calendar", url);
      },
    },
  ];

  const preferred = state.macroPreferredSource;
  const orderedSources = preferred
    ? [...sources].sort((a, b) => (a.name === preferred ? -1 : b.name === preferred ? 1 : 0))
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
            rows: deduped,
            source: `Live merge ${usedSources.join(" + ")} (${deduped.length} eventi)`,
            primarySource: source.name,
          };
        }
      } else {
        errors.push(`${source.name}:0`);
      }
    } catch (error) {
      errors.push(`${source.name}:${error?.message || "errore"}`);
    }
  }
  const deduped = dedupeMacroRows(mergedRows);
  if (deduped.length) {
    return {
      rows: deduped,
      source: `Live partial ${usedSources.join(" + ")} (${deduped.length} eventi)`,
      primarySource: usedSources[0]?.split(":")[0] || null,
    };
  }
  return { rows: [], source: `Feed macro non disponibile (fonti reali KO: ${errors.join(" | ")})`, primarySource: null };
}

function renderMacroCalendar() {
  if (!macroDaysContainerEl) return;
  const impactFilter = state.macroImpactFilter;
  const categoryFilter = state.macroCategoryFilter;
  const now = Date.now();
  const minTs = now - 2 * 24 * 60 * 60 * 1000;
  const maxTs = now + 90 * 24 * 60 * 60 * 1000;
  const allValid = (state.macroEvents || [])
    .filter((e) => e?.date instanceof Date && !Number.isNaN(e.date.getTime()))
    .sort((a, b) => a.date - b.date);
  const eligible = allValid
    .filter((e) => {
      const ts = e?.date?.getTime?.();
      return Number.isFinite(ts) && ts >= minTs && ts <= maxTs;
    })
    .sort((a, b) => a.date - b.date);
  let filtered = eligible
    .filter((e) => (impactFilter === "ALL" ? true : e.impact === impactFilter))
    .filter((e) => {
      if (categoryFilter === "ALL") return true;
      return e.category === categoryFilter;
    })
    .filter((e) => e?.date instanceof Date && !Number.isNaN(e.date.getTime()));
  if (macroSourceInfoEl) {
    const lastSync = state.macroLastFetchAt ? new Date(state.macroLastFetchAt).toLocaleTimeString("it-IT") : "--";
    const liveSync = state.macroLastLiveSuccessAt ? new Date(state.macroLastLiveSuccessAt).toLocaleTimeString("it-IT") : "--";
    macroSourceInfoEl.textContent = `Fonte macro: ${state.macroSource || "--"} | Eventi: ${filtered.length} | validi: ${allValid.length} | sync: ${lastSync} | live: ${liveSync}`;
  }
  const src = String(state.macroSource || "").toLowerCase();
  if (src.includes("live merge")) {
    setMacroFeedBadge("live");
  } else if (src.includes("live partial")) {
    setMacroFeedBadge("failover");
  } else if (src.includes("cache")) {
    setMacroFeedBadge("cache");
  } else if (src.includes("non disponibile") || !allValid.length) {
    setMacroFeedBadge("down");
  } else {
    setMacroFeedBadge("unknown");
  }
  if (!filtered.length && eligible.length) {
    filtered = eligible;
    if (macroSourceInfoEl) {
      macroSourceInfoEl.textContent += " | filtro reset automatico (nessun match)";
    }
  }
  if (!filtered.length && allValid.length) {
    filtered = allValid;
    if (macroSourceInfoEl) {
      macroSourceInfoEl.textContent += " | fuori finestra 90g: mostro eventi disponibili";
    }
  }
  if (!filtered.length) {
    macroDaysContainerEl.innerHTML = `<article class="macro-day-card"><div class="muted">Nessun evento reale disponibile per i filtri selezionati. Aggiorna calendario o attendi il prossimo refresh automatico.</div></article>`;
    return;
  }
  const groups = new Map();
  filtered.forEach((event) => {
    const dayKey = formatMacroDayKey(event.date);
    if (!dayKey) return;
    if (!groups.has(dayKey)) groups.set(dayKey, []);
    groups.get(dayKey).push(event);
  });
  macroDaysContainerEl.innerHTML = Array.from(groups.entries())
    .map(([dayKey, dayEvents]) => {
      const dayLabel = formatRomeDayLabel(dayEvents[0]?.date);
      const content = dayEvents
        .map((e, idx) => {
          const impactLabel = e.impact === "high" ? "Alta" : e.impact === "medium" ? "Media" : "Bassa";
          const categoryLabel = e.category === "OTHER" ? "Macro" : e.category;
          const description = getMacroEventDescription(e.event);
          const audience = getMacroEventAudience(e.event, e.category);
          const eventTime = escapeHtml(e.time || "--");
          const country = escapeHtml(e.country || "--");
          const eventName = escapeHtml(e.event || "--");
          const previous = escapeHtml(e.previous || "--");
          const forecast = escapeHtml(e.forecast || "--");
          const actual = escapeHtml(e.actual || "--");
          const source = escapeHtml(e.source || state.macroSource || "--");
          const detailId = `macro-det-${dayKey}-${idx}`;
          return `<details class="macro-event-item macro-impact-${e.impact}">
            <summary class="macro-event-summary">
              <div class="macro-event-head">
                <strong>${eventTime} (ora IT) | ${escapeHtml(categoryLabel)} | ${country}</strong>
                <span class="macro-folder-tag">Cartellina dettaglio</span>
              </div>
              <div class="macro-event-title"><strong>${eventName}</strong></div>
            </summary>
            <div id="${detailId}" class="macro-event-details">
              <div class="muted"><strong>Cos'e:</strong> ${escapeHtml(description)}</div>
              <div class="muted"><strong>Chi riguarda:</strong> ${escapeHtml(audience)}</div>
              <div><strong>Importanza:</strong> ${impactLabel}</div>
              <div><strong>Dato precedente:</strong> ${previous}</div>
              <div><strong>Aspettativa:</strong> ${forecast}</div>
              <div><strong>Dato uscito:</strong> ${actual}</div>
              <div class="muted"><strong>Fonte:</strong> ${source}</div>
            </div>
          </details>`;
        })
        .join("");
      return `<article class="macro-day-card">
        <div class="macro-day-header">
          <h3>${dayLabel}</h3>
          <small class="muted">${dayEvents.length} eventi</small>
        </div>
        ${content}
      </article>`;
    })
    .join("");
}

async function loadMacroCalendar() {
  if (state.macroIsLoading) return;
  state.macroIsLoading = true;
  const task = await timedTask(() => fetchMacroCalendar());
  try {
    if (task.ok && Array.isArray(task.value?.rows) && task.value.rows.length) {
      state.macroEvents = task.value.rows;
      state.macroSource = task.value.source || "--";
      state.macroLastFetchAt = Date.now();
      if (/\bLIVE\b/i.test(String(task.value.source || "")) || String(task.value.mode || "").toUpperCase() === "LIVE") {
        state.macroLastLiveSuccessAt = Date.now();
      }
      if (task.value.primarySource) {
        state.macroPreferredSource = task.value.primarySource;
      }
      saveCache(CACHE_KEYS.MACRO, {
        rows: task.value.rows.map((r) => ({
          ...r,
          date: r.date?.toISOString?.() || null,
        })),
        source: state.macroSource,
        fetchedAt: new Date().toISOString(),
      });
    } else {
      const cachedMacro = loadCache(CACHE_KEYS.MACRO);
      const cacheFetchedAtMs = cachedMacro?.fetchedAt ? new Date(cachedMacro.fetchedAt).getTime() : 0;
      const cacheAgeMs = cacheFetchedAtMs ? Date.now() - cacheFetchedAtMs : Number.POSITIVE_INFINITY;
      if (cachedMacro?.rows?.length && cacheAgeMs <= MACRO_CACHE_MAX_AGE_MS) {
        state.macroEvents = cachedMacro.rows
          .map((r) => ({ ...r, date: parseMacroDate(r.date) }))
          .filter((r) => r.date instanceof Date && !Number.isNaN(r.date.getTime()));
        const ageH = Math.max(1, Math.round(cacheAgeMs / (60 * 60 * 1000)));
        state.macroSource = `${cachedMacro.source || "cache macro"} (cache reale temporanea ${ageH}h)`;
        state.macroLastFetchAt = Date.now();
      } else {
        state.macroEvents = [];
        state.macroSource = `Feed macro non disponibile${task.error ? ` (${task.error})` : ""}`;
        state.macroLastFetchAt = Date.now();
      }
    }
    renderMacroCalendar();
  } finally {
    state.macroIsLoading = false;
  }
}

function refreshMacroIfStale({ force = false } = {}) {
  const now = Date.now();
  const sourceText = String(state.macroSource || "").toLowerCase();
  const degraded = !state.macroLastLiveSuccessAt || sourceText.includes("cache") || !state.macroEvents?.length;
  const staleMs = degraded ? MACRO_REFRESH_MS_DEGRADED : MACRO_REFRESH_MS_OK;
  if (!force && state.macroLastFetchAt && now - state.macroLastFetchAt < staleMs) return;
  loadMacroCalendar().catch(() => {
    state.macroSource = "Feed macro non disponibile (errore aggiornamento)";
    state.macroLastFetchAt = Date.now();
    renderMacroCalendar();
  });
}

function computeMacroRiskWindow(now = new Date()) {
  const macroCore = new Set(["CPI", "FOMC", "NFP"]);
  const highEvents = (state.macroEvents || []).filter((e) => e.impact === "high" && macroCore.has(e.category));
  if (!highEvents.length) {
    return { active: false, upcoming: false, label: "Nessun evento high imminente", nextEvent: null };
  }
  const nowMs = now.getTime();
  let nearest = null;
  let nearestDist = Number.POSITIVE_INFINITY;
  let active = false;
  let upcoming = false;
  highEvents.forEach((e) => {
    const eventMs = e.date.getTime();
    const diff = eventMs - nowMs;
    const abs = Math.abs(diff);
    if (abs < nearestDist) {
      nearestDist = abs;
      nearest = e;
    }
    if (diff >= -120 * 60 * 1000 && diff <= 90 * 60 * 1000) {
      active = true;
    }
    if (diff > 0 && diff <= 12 * 60 * 60 * 1000) {
      upcoming = true;
    }
  });
  const label = active
    ? `RISK-OFF attivo (${nearest?.category || "macro"} ${nearest?.time || ""})`
    : upcoming
      ? `Evento high in avvicinamento (${nearest?.category || "macro"})`
      : "Finestra macro neutra";
  return { active, upcoming, label, nextEvent: nearest };
}

function shouldSendExternalNotification(key) {
  const now = Date.now();
  const prev = state.lastExternalNotifyAt[key] || 0;
  const cooldown = Math.max(getAlertCooldownMs() * 2, 120 * 1000);
  if (now - prev < cooldown) return false;
  state.lastExternalNotifyAt[key] = now;
  return true;
}

async function sendExternalNotification(message, key = "generic") {
  if (!state.notifyChannel || state.notifyChannel === "none") return;
  if (!shouldSendExternalNotification(key)) return;
  try {
    if (state.notifyChannel === "discord") {
      if (!state.notifyWebhookUrl) throw new Error("Webhook Discord mancante");
      await fetch(state.notifyWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });
    } else if (state.notifyChannel === "webhook") {
      if (!state.notifyWebhookUrl) throw new Error("Webhook URL mancante");
      await fetch(state.notifyWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, source: "xau-dashboard" }),
      });
    } else if (state.notifyChannel === "telegram") {
      if (!state.telegramBotToken || !state.telegramChatId) throw new Error("Credenziali Telegram mancanti");
      const tgUrl = `https://api.telegram.org/bot${state.telegramBotToken}/sendMessage`;
      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: state.telegramChatId,
          text: message,
          disable_web_page_preview: true,
        }),
      });
    }
    if (notifyStatusEl) notifyStatusEl.textContent = `Notifica inviata (${state.notifyChannel})`;
  } catch (error) {
    if (notifyStatusEl) notifyStatusEl.textContent = `Errore notifica: ${error.message}`;
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} su ${url}`);
  }
  return response.json();
}

async function fetchJsonCorsAware(url) {
  try {
    return await fetchJson(url);
  } catch {
    // CORS proxy fallback
    const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    return fetchJson(proxied);
  }
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { Accept: "text/plain,*/*" } });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} su ${url}`);
  }
  return response.text();
}

async function fetchTextCorsAware(url) {
  try {
    return await fetchText(url);
  } catch {
    const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    return fetchText(proxied);
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
  });
  if (!response.ok) {
    throw new Error(`TV HTTP ${response.status}`);
  }
  const json = await response.json();
  const values = json?.data?.[0]?.d;
  if (!Array.isArray(values) || values.length < 8) {
    throw new Error("TV payload non valido");
  }
  const [close, changePct, changeAbs, high52w, low52w, open, high, low] = values.map((v) => Number(v));
  if (!Number.isFinite(close)) {
    throw new Error("TV close non disponibile");
  }
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
  const preferredFeeds = Array.isArray(asset?.tvFeeds) && asset.tvFeeds.length
    ? asset.tvFeeds
    : [];
  for (const feed of preferredFeeds) {
    try {
      const snap = await getTradingViewSnapshotForTicker(feed.market, feed.ticker);
      return snap;
    } catch {
      // tenta il prossimo ticker
    }
  }
  return null;
}

async function getYahooSnapshot(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
  const y = await fetchJsonCorsAware(url);
  const result = y?.chart?.result?.[0];
  const ts = result?.timestamp || [];
  const close = result?.indicators?.quote?.[0]?.close || [];
  const rows = ts
    .map((t, i) => ({ ts: Number(t), close: Number(close[i]) }))
    .filter((r) => Number.isFinite(r.ts) && Number.isFinite(r.close));
  if (rows.length < 1) throw new Error("Yahoo payload non valido");
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
  // 1) TradingView primaria per allineamento al mercato.
  const tv = await getTradingViewMarketSnapshot(asset);
  if (tv?.close) {
    return { price: tv.close, source: `${tv.source} (live)`, snapshot: tv };
  }

  // 2) Yahoo live-like snapshot per gli asset configurati.
  for (const symbol of asset?.yahooSymbols || []) {
    try {
      const snap = await getYahooSnapshot(symbol);
      return { price: snap.close, source: `${snap.source} (near-live)`, snapshot: snap };
    } catch {
      // try next symbol
    }
  }

  // 3) Fonte live secondaria XAU-only.
  if (asset?.id !== "XAUUSD") return null;
  try {
    const fxRates = await fetchJsonCorsAware("https://api.fxratesapi.com/latest?base=XAU&currencies=USD");
    const px = Number(fxRates?.rates?.USD);
    if (Number.isFinite(px) && px > 0) {
      return { price: px, source: "FXRatesAPI XAU/USD (live)", snapshot: null };
    }
  } catch {
    // no-op
  }

  // 4) Fallback reale secondario XAU-only
  try {
    const goldPrice = await fetchJsonCorsAware("https://data-asg.goldprice.org/dbXRates/USD");
    const px = Number(goldPrice?.items?.[0]?.xauPrice);
    if (Number.isFinite(px) && px > 0) {
      return { price: px, source: "GoldPrice.org XAU spot (live)", snapshot: null };
    }
  } catch {
    // no-op
  }

  return null;
}

function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function getFilteredPrices(prices, timeframe) {
  const days = TIMEFRAMES[timeframe];
  if (!days) return prices.slice();
  const lastDate = prices[prices.length - 1]?.date;
  if (!lastDate) return [];
  const cutoff = new Date(lastDate);
  cutoff.setDate(cutoff.getDate() - days);
  return prices.filter((p) => p.date >= cutoff);
}

function getPricesForSeasonalityYears(prices, years) {
  if (years === "ALL") return prices.slice();
  const yearsNum = Number(years);
  if (!Number.isFinite(yearsNum) || yearsNum <= 0) return prices.slice();
  const lastDate = prices[prices.length - 1]?.date;
  if (!lastDate) return [];
  const cutoff = new Date(lastDate);
  cutoff.setFullYear(cutoff.getFullYear() - yearsNum);
  return prices.filter((p) => p.date >= cutoff);
}

function getFilteredCot(cotData, timeframe) {
  const days = TIMEFRAMES[timeframe];
  if (!days) return cotData.slice();
  const lastDate = cotData[cotData.length - 1]?.date;
  if (!lastDate) return [];
  const cutoff = new Date(lastDate);
  cutoff.setDate(cutoff.getDate() - days);
  const filtered = cotData.filter((r) => r.date >= cutoff);
  return filtered.length >= 8 ? filtered : cotData.slice(-8);
}

async function getPriceSeries(asset) {
  try {
    return await fetchPriceSeriesFromBackend(asset);
  } catch {
    // fallback client-side if backend is offline
  }
  const historicalCandidates = [];

  // Fonte 1: CoinGecko PAXG storico (solo oro).
  if (asset?.id === "XAUUSD") {
    try {
      const cgUrl = "https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=3650&interval=daily";
      const data = await fetchJsonCorsAware(cgUrl);
      const prices = (data.prices || [])
        .map(([ts, px]) => ({ date: new Date(ts), close: Number(px) }))
        .filter((row) => Number.isFinite(row.close))
        .sort((a, b) => a.date - b.date);
      if (prices.length > 200) {
        historicalCandidates.push({ source: "CoinGecko PAXG/USD storico", prices });
      }
    } catch {
      // passa alla fonte successiva
    }
  }

  // Fonte 2: Stooq CSV (se configurato).
  if (asset?.stooqSymbol) {
    try {
      const csv = await fetchTextCorsAware(`https://stooq.com/q/d/l/?s=${encodeURIComponent(asset.stooqSymbol)}&i=d`);
      const lines = csv.split(/\r?\n/).filter(Boolean);
      const rows = lines
        .slice(1)
        .map((line) => line.split(","))
        .map((parts) => ({
          date: new Date(parts[0]),
          close: Number(parts[4]),
        }))
        .filter((row) => row.date instanceof Date && !Number.isNaN(row.date.getTime()) && Number.isFinite(row.close))
        .sort((a, b) => a.date - b.date);
      if (rows.length > 200) {
        historicalCandidates.push({ source: `Stooq ${asset.id} storico`, prices: rows });
      }
    } catch {
      // no-op
    }
  }

  // Fonte 3: Yahoo Finance storico.
  const yahooSymbols = asset?.yahooSymbols || [];
  for (const symbol of yahooSymbols) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=10y&interval=1d`;
      const y = await fetchJsonCorsAware(url);
      const result = y?.chart?.result?.[0];
      const ts = result?.timestamp || [];
      const close = result?.indicators?.quote?.[0]?.close || [];
      const rows = ts
        .map((t, i) => ({
          date: new Date(Number(t) * 1000),
          close: Number(close[i]),
        }))
        .filter((row) => row.date instanceof Date && !Number.isNaN(row.date.getTime()) && Number.isFinite(row.close))
        .sort((a, b) => a.date - b.date);
      if (rows.length > 200) {
        historicalCandidates.push({ source: `Yahoo ${symbol} storico`, prices: rows });
        break;
      }
    } catch {
      // prova simbolo successivo
    }
  }

  if (!historicalCandidates.length) {
    throw new Error(`storico reale non disponibile per ${asset?.id || "asset"}`);
  }

  const best = historicalCandidates.sort((a, b) => b.prices.length - a.prices.length)[0];
  const prices = best.prices.slice();
  const liveSpot = await getLiveSpotForAsset(asset);
  if (liveSpot) {
    // Spot solo nello snapshot: non alterare l'ultima barra storica
    const snapshot = {
      ...(liveSpot.snapshot || {}),
      price: liveSpot.price,
      ticker: liveSpot.snapshot?.ticker || liveSpot.source || null,
    };
    return { source: `${best.source} + ${liveSpot.source}`, prices, snapshot };
  }
  return { source: `${best.source} (senza spot live)`, prices, snapshot: null };
}

async function getCotForAsset(asset) {
  try {
    return await fetchCotForAssetFromBackend(asset);
  } catch {
    // fallback client-side if backend is offline
  }
  if (!asset?.cotMarket) {
    return { rows: [], source: `COT non disponibile per ${asset?.id || "asset"}` };
  }
  const whereExpr = `market_and_exchange_names='${asset.cotMarket}'`;
  const url =
    "https://publicreporting.cftc.gov/resource/6dca-aqww.json" +
    "?$select=report_date_as_yyyy_mm_dd,open_interest_all,noncomm_positions_long_all,noncomm_positions_short_all,comm_positions_long_all,comm_positions_short_all,nonrept_positions_long_all,nonrept_positions_short_all" +
    `&$where=${encodeURIComponent(whereExpr)}` +
    "&$order=report_date_as_yyyy_mm_dd%20DESC" +
    "&$limit=260";

  const parseRows = (raw) =>
    raw
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
          ![
            oi,
            commercialLong,
            commercialShort,
            nonCommercialLong,
            nonCommercialShort,
            retailLong,
            retailShort,
          ].every(Number.isFinite) ||
          oi <= 0
        ) {
          return null;
        }
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

  try {
    let raw = await fetchJsonCorsAware(url);
    if (!Array.isArray(raw) || !raw.length) {
      raw = await fetchJsonAnyRoute(url);
    }
    if (!Array.isArray(raw)) throw new Error("payload COT non valido");
    const rows = parseRows(raw);

    if (!rows.length) {
      throw new Error(`nessun record COT per ${asset.id}`);
    }
    return {
      rows,
      source: `CFTC Socrata 6dca-aqww (${asset.id})`,
    };
  } catch (error) {
    // Mai usare snapshot inventati: meglio vuoto + messaggio chiaro
    return {
      rows: [],
      source: `COT non disponibile ora (${error?.message || "feed CFTC irraggiungibile"})`,
    };
  }
}

function realizedVol(prices, windowDays = 30) {
  const recent = prices.slice(-windowDays - 1);
  const rets = [];
  for (let i = 1; i < recent.length; i += 1) {
    const r = Math.log(recent[i].close / recent[i - 1].close);
    if (Number.isFinite(r)) rets.push(r);
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((acc, r) => acc + (r - mean) ** 2, 0) / Math.max(rets.length - 1, 1);
  return Math.sqrt(variance) * Math.sqrt(252);
}

function buildMonthlySeasonality(prices) {
  // Usa close di fine mese e calcola il rendimento mensile medio per ciascun mese.
  const monthClose = new Map();
  prices.forEach((p) => {
    const y = p.date.getUTCFullYear();
    const m = p.date.getUTCMonth();
    monthClose.set(`${y}-${m}`, p.close);
  });

  const keys = [...monthClose.keys()].sort((a, b) => {
    const [ya, ma] = a.split("-").map(Number);
    const [yb, mb] = b.split("-").map(Number);
    return ya === yb ? ma - mb : ya - yb;
  });

  const monthlyReturnsByMonth = Array.from({ length: 12 }, () => []);
  for (let i = 1; i < keys.length; i += 1) {
    const prevKey = keys[i - 1];
    const curKey = keys[i];
    const prevClose = monthClose.get(prevKey);
    const curClose = monthClose.get(curKey);
    const [, curMonth] = curKey.split("-").map(Number);
    const r = curClose / prevClose - 1;
    if (Number.isFinite(r)) monthlyReturnsByMonth[curMonth].push(r);
  }

  return monthlyReturnsByMonth.map((arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0));
}

function buildMonthlyReturnsByMonth(prices) {
  const monthClose = new Map();
  prices.forEach((p) => {
    const y = p.date.getUTCFullYear();
    const m = p.date.getUTCMonth();
    monthClose.set(`${y}-${m}`, p.close);
  });

  const keys = [...monthClose.keys()].sort((a, b) => {
    const [ya, ma] = a.split("-").map(Number);
    const [yb, mb] = b.split("-").map(Number);
    return ya === yb ? ma - mb : ya - yb;
  });

  const monthlyReturnsByMonth = Array.from({ length: 12 }, () => []);
  for (let i = 1; i < keys.length; i += 1) {
    const prevKey = keys[i - 1];
    const curKey = keys[i];
    const prevClose = monthClose.get(prevKey);
    const curClose = monthClose.get(curKey);
    const [, curMonth] = curKey.split("-").map(Number);
    const r = curClose / prevClose - 1;
    if (Number.isFinite(r)) monthlyReturnsByMonth[curMonth].push(r);
  }
  return monthlyReturnsByMonth;
}

function buildYearMonthlyReturnMatrix(prices, yearsSetting) {
  const scoped = getPricesForSeasonalityYears(prices, yearsSetting);
  const monthClose = new Map();
  scoped.forEach((p) => {
    const y = p.date.getUTCFullYear();
    const m = p.date.getUTCMonth();
    monthClose.set(`${y}-${m}`, p.close);
  });

  const keys = [...monthClose.keys()].sort((a, b) => {
    const [ya, ma] = a.split("-").map(Number);
    const [yb, mb] = b.split("-").map(Number);
    return ya === yb ? ma - mb : ya - yb;
  });

  const perYear = new Map();
  for (let i = 1; i < keys.length; i += 1) {
    const prevKey = keys[i - 1];
    const curKey = keys[i];
    const [curYear, curMonth] = curKey.split("-").map(Number);
    const prevClose = monthClose.get(prevKey);
    const curClose = monthClose.get(curKey);
    const r = curClose / prevClose - 1;
    if (!Number.isFinite(r)) continue;
    if (!perYear.has(curYear)) perYear.set(curYear, Array.from({ length: 12 }, () => null));
    perYear.get(curYear)[curMonth] = r;
  }
  return perYear;
}

function computeSeasonalityForwardBacktest(perYearReturns, startMonth, horizon) {
  const h = Math.max(1, Number(horizon) || 1);
  const samples = [];
  for (const [, arr] of perYearReturns.entries()) {
    let compounded = 1;
    let ok = true;
    for (let i = 0; i < h; i += 1) {
      const m = (startMonth + i) % 12;
      const r = arr[m];
      if (!Number.isFinite(r)) {
        ok = false;
        break;
      }
      compounded *= 1 + r;
    }
    if (ok) samples.push((compounded - 1) * 100);
  }
  if (!samples.length) {
    return { count: 0, hitRate: 0, avg: 0, median: 0, best: 0, worst: 0 };
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const hitRate = (samples.filter((v) => v > 0).length / samples.length) * 100;
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  return {
    count: samples.length,
    hitRate,
    avg,
    median: quantile(sorted, 0.5),
    best: sorted[sorted.length - 1],
    worst: sorted[0],
  };
}

function renderBacktest(backtest) {
  if (!btSamplesEl) return;
  btSamplesEl.textContent = String(backtest.count || 0);
  btHitRateEl.textContent = `${fmtNum(backtest.hitRate || 0, 1)}%`;
  btHitRateEl.className = (backtest.hitRate || 0) >= 50 ? "up" : "down";
  btAvgEl.textContent = `${(backtest.avg || 0) >= 0 ? "+" : ""}${fmtNum(backtest.avg || 0, 2)}%`;
  btAvgEl.className = (backtest.avg || 0) >= 0 ? "up" : "down";
  btMedianEl.textContent = `${(backtest.median || 0) >= 0 ? "+" : ""}${fmtNum(backtest.median || 0, 2)}%`;
  btMedianEl.className = (backtest.median || 0) >= 0 ? "up" : "down";
  btBestWorstEl.textContent = `${fmtNum(backtest.best || 0, 2)}% / ${fmtNum(backtest.worst || 0, 2)}%`;
}

function clearBacktest() {
  if (!btSamplesEl) return;
  btSamplesEl.textContent = "--";
  btHitRateEl.textContent = "--";
  btAvgEl.textContent = "--";
  btMedianEl.textContent = "--";
  btBestWorstEl.textContent = "--";
}

function quantile(sortedArr, q) {
  if (!sortedArr.length) return 0;
  const pos = (sortedArr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedArr[base + 1] !== undefined) {
    return sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base]);
  }
  return sortedArr[base];
}

function buildSeasonalityPathSeries(prices, yearsSetting) {
  // Andamento stagionale realistico giornaliero:
  // per ogni anno normalizza a base 100, poi aggrega per giorno calendario (MM-DD)
  // e calcola media/bande statistiche sugli anni selezionati.
  const byYear = new Map();
  prices.forEach((p) => {
    const y = p.date.getUTCFullYear();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(p);
  });

  let years = [...byYear.keys()].sort((a, b) => a - b);
  const nowYear = new Date().getUTCFullYear();
  // Anni storici: almeno ~6 mesi di sedute; anno corrente: basta un campione minimo.
  years = years.filter((y) => {
    const n = byYear.get(y)?.length || 0;
    return y === nowYear ? n >= 20 : n >= 120;
  });
  if (!years.length) {
    return { labels: [], avgPath: [], medianPath: [], lowPath: [], highPath: [], q1Path: [], q3Path: [], yearTraces: [], currentYearTrace: null, usedYears: [] };
  }

  if (yearsSetting !== "ALL") {
    const n = Number(yearsSetting);
    if (Number.isFinite(n) && n > 0) {
      years = years.slice(-n);
    }
  }

  const normalizedEntries = years.map((y) => {
    const arr = [...byYear.get(y)].sort((a, b) => a.date - b.date);
    const base = arr[0]?.close;
    if (!Number.isFinite(base) || base <= 0) return null;
    const byDay = new Map();
    arr.forEach((p) => {
      const mm = String(p.date.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(p.date.getUTCDate()).padStart(2, "0");
      const key = `${mm}-${dd}`;
      byDay.set(key, (p.close / base) * 100);
    });
    return { year: y, byDay };
  }).filter(Boolean);

  if (!normalizedEntries.length) {
    return { labels: [], avgPath: [], medianPath: [], lowPath: [], highPath: [], q1Path: [], q3Path: [], yearTraces: [], currentYearTrace: null, usedYears: [] };
  }

  const dayKeySet = new Set();
  normalizedEntries.forEach((entry) => {
    entry.byDay.forEach((_, key) => dayKeySet.add(key));
  });
  const orderedDayKeys = [...dayKeySet].sort((a, b) => {
    const [ma, da] = a.split("-").map(Number);
    const [mb, db] = b.split("-").map(Number);
    return ma === mb ? da - db : ma - mb;
  });

  // Tieni giorni con copertura sufficiente sugli anni selezionati.
  const minCoverage = Math.min(normalizedEntries.length, Math.max(1, Math.ceil(normalizedEntries.length * 0.6)));
  const dayKeys = orderedDayKeys.filter((key) => {
    let count = 0;
    for (const entry of normalizedEntries) {
      if (entry.byDay.has(key)) count += 1;
    }
    return count >= minCoverage;
  });

  const avgPath = [];
  const medianPath = [];
  const lowPath = [];
  const highPath = [];
  const q1Path = [];
  const q3Path = [];
  dayKeys.forEach((key) => {
    const vals = normalizedEntries
      .map((entry) => entry.byDay.get(key))
      .filter((v) => Number.isFinite(v));
    if (!vals.length) return;
    const sorted = [...vals].sort((a, b) => a - b);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    avgPath.push(avg);
    medianPath.push(quantile(sorted, 0.5));
    lowPath.push(sorted[0]);
    highPath.push(sorted[sorted.length - 1]);
    q1Path.push(quantile(sorted, 0.25));
    q3Path.push(quantile(sorted, 0.75));
  });

  const coveragePct = normalizedEntries.length
    ? (dayKeys.length / orderedDayKeys.length) * 100
    : 0;

  const labels = dayKeys.map((key) => {
    const [m, d] = key.split("-").map(Number);
    return `${String(d).padStart(2, "0")} ${MONTH_LABELS[m - 1]}`;
  });

  const yearTraces = normalizedEntries.map((entry) => ({
    year: entry.year,
    values: dayKeys.map((key) => {
      const v = entry.byDay.get(key);
      return Number.isFinite(v) ? v : null;
    }),
  }));

  const currentYear = Math.max(...normalizedEntries.map((e) => e.year));
  const currentYearTrace = yearTraces.find((t) => t.year === currentYear) || null;

  return {
    labels,
    dayKeys,
    avgPath,
    medianPath,
    lowPath,
    highPath,
    q1Path,
    q3Path,
    yearTraces,
    currentYearTrace,
    coveragePct,
    usedYears: normalizedEntries.map((e) => e.year),
  };
}

/**
 * Picchi di rialzo/ribasso sulla media stagionale giornaliera reale.
 * Usa finestra locale + prominenza, con wrap-around sull'anno.
 */
function findSeasonalTurningPoints(avgPath, dayKeys, labels, options = {}) {
  const values = Array.isArray(avgPath) ? avgPath : [];
  const n = values.length;
  if (n < 15) return { peaks: [], troughs: [] };

  const window = Math.max(5, Number(options.window) || 8);
  const minSeparation = Math.max(8, Number(options.minSeparation) || 14);
  const maxEach = Math.max(3, Number(options.maxEach) || 6);

  const at = (i) => values[((i % n) + n) % n];
  const candidates = [];

  for (let i = 0; i < n; i += 1) {
    const v = values[i];
    if (!Number.isFinite(v)) continue;
    let isPeak = true;
    let isTrough = true;
    let neighborMin = v;
    let neighborMax = v;
    for (let d = 1; d <= window; d += 1) {
      const left = at(i - d);
      const right = at(i + d);
      if (left > v || right > v) isPeak = false;
      if (left < v || right < v) isTrough = false;
      neighborMin = Math.min(neighborMin, left, right);
      neighborMax = Math.max(neighborMax, left, right);
      if (!isPeak && !isTrough) break;
    }
    if (isPeak) {
      candidates.push({
        type: "peak",
        idx: i,
        value: v,
        prominence: v - neighborMin,
        key: dayKeys[i],
        label: labels[i],
      });
    } else if (isTrough) {
      candidates.push({
        type: "trough",
        idx: i,
        value: v,
        prominence: neighborMax - v,
        key: dayKeys[i],
        label: labels[i],
      });
    }
  }

  function pickBest(type) {
    const sorted = candidates
      .filter((c) => c.type === type && Number.isFinite(c.prominence) && c.prominence > 0.05)
      .sort((a, b) => b.prominence - a.prominence);
    const picked = [];
    for (const c of sorted) {
      const tooClose = picked.some((p) => {
        const dist = Math.min(Math.abs(p.idx - c.idx), n - Math.abs(p.idx - c.idx));
        return dist < minSeparation;
      });
      if (tooClose) continue;
      picked.push(c);
      if (picked.length >= maxEach) break;
    }
    return picked.sort((a, b) => a.idx - b.idx);
  }

  return { peaks: pickBest("peak"), troughs: pickBest("trough") };
}

function buildSeasonalityPayloadFromPrices(prices, yearsSetting) {
  const seasonalityBasePrices = getPricesForSeasonalityYears(prices, yearsSetting);
  const byMonthReturns = buildMonthlyReturnsByMonth(seasonalityBasePrices);
  const seasonality = byMonthReturns.map((arr) => {
    if (!arr.length) return 0;
    return (arr.reduce((a, b) => a + b, 0) / arr.length) * 100;
  });
  const seasonalityStats = byMonthReturns.map((arr) => {
    if (!arr.length) return { low: 0, high: 0, q1: 0, q3: 0, median: 0 };
    const sorted = [...arr].sort((a, b) => a - b).map((v) => v * 100);
    return {
      low: sorted[0],
      high: sorted[sorted.length - 1],
      q1: quantile(sorted, 0.25),
      q3: quantile(sorted, 0.75),
      median: quantile(sorted, 0.5),
    };
  });
  const seasonalityPath = buildSeasonalityPathSeries(seasonalityBasePrices, yearsSetting);
  const yearMonthlyMatrix = buildYearMonthlyReturnMatrix(prices, yearsSetting);
  const backtest = computeSeasonalityForwardBacktest(yearMonthlyMatrix, state.seasonalityStartMonth, state.seasonalityHorizon);
  const dayTiming = buildMonthDayEntryTiming(seasonalityBasePrices, seasonality);
  return { seasonalityBasePrices, seasonality, seasonalityStats, seasonalityPath, backtest, dayTiming };
}

/**
 * Per ogni mese calendario, trova il giorno del mese storicamente piu forte (long)
 * e piu debole (short) usando solo rendimenti giornalieri reali.
 * Preferisce giorni 1-28 con campione sufficiente; mai inventa dati.
 */
function buildMonthDayEntryTiming(prices, monthAvgPct = null) {
  const sorted = [...(Array.isArray(prices) ? prices : [])]
    .filter((p) => p?.date && Number.isFinite(p.close))
    .sort((a, b) => a.date - b.date);

  const buckets = Array.from({ length: 12 }, () => new Map());
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (!(prev.close > 0) || !(cur.close > 0)) continue;
    const ret = cur.close / prev.close - 1;
    if (!Number.isFinite(ret)) continue;
    const month = cur.date.getUTCMonth();
    const day = cur.date.getUTCDate();
    if (!buckets[month].has(day)) buckets[month].set(day, []);
    buckets[month].get(day).push(ret);
  }

  const rows = [];
  for (let month = 0; month < 12; month += 1) {
    const dayStats = [];
    buckets[month].forEach((rets, day) => {
      if (!Array.isArray(rets) || !rets.length) return;
      const avg = rets.reduce((a, b) => a + b, 0) / rets.length;
      const upRate = rets.filter((r) => r > 0).length / rets.length;
      const downRate = rets.filter((r) => r < 0).length / rets.length;
      dayStats.push({
        day: Number(day),
        avg,
        upRate,
        downRate,
        samples: rets.length,
      });
    });

    const maxSamples = dayStats.reduce((mx, s) => Math.max(mx, s.samples), 0);
    const minSamples = maxSamples > 0 ? Math.max(2, Math.min(6, Math.ceil(maxSamples * 0.35))) : 2;
    let pool = dayStats.filter((s) => s.samples >= minSamples && s.day >= 1 && s.day <= 28);
    if (!pool.length) {
      pool = dayStats.filter((s) => s.samples >= Math.max(1, Math.min(2, maxSamples)) && s.day <= 28);
    }
    if (!pool.length) {
      pool = [...dayStats].sort((a, b) => b.samples - a.samples);
    }

    let bestLong;
    let bestShort;
    let weak = false;
    if (!pool.length) {
      // Nessuna barra reale per quel mese nella finestra: slot pieno ma marcato weak (no fake stats)
      weak = true;
      bestLong = { day: 1, avg: 0, upRate: 0, downRate: 0, samples: 0, weak: true };
      bestShort = { day: 1, avg: 0, upRate: 0, downRate: 0, samples: 0, weak: true };
    } else {
      const longScore = (s) => (s.avg * 100) * 0.55 + (s.upRate * 100) * 0.45;
      const shortScore = (s) => (-s.avg * 100) * 0.55 + (s.downRate * 100) * 0.45;
      bestLong = [...pool].sort((a, b) => longScore(b) - longScore(a) || b.samples - a.samples)[0];
      bestShort = [...pool].sort((a, b) => shortScore(b) - shortScore(a) || b.samples - a.samples)[0];
      bestLong = { ...bestLong, weak: bestLong.samples < minSamples };
      bestShort = { ...bestShort, weak: bestShort.samples < minSamples };
    }

    const monthAvg = Array.isArray(monthAvgPct) && Number.isFinite(monthAvgPct[month]) ? monthAvgPct[month] : 0;
    let monthBias = "flat";
    if (monthAvg > 0.15) monthBias = "long";
    else if (monthAvg < -0.15) monthBias = "short";

    rows.push({
      month,
      monthLabel: MONTH_LABELS[month],
      monthAvg,
      monthBias,
      bestLong,
      bestShort,
      weak,
    });
  }
  return rows;
}

function renderSeasonalityDayTiming(dayTiming) {
  if (!seasonalityDayTimingRowsEl) return;
  const rows = Array.isArray(dayTiming) ? dayTiming : [];
  if (!rows.length) {
    seasonalityDayTimingRowsEl.innerHTML = `<tr><td colspan="6">Dati insufficienti nella finestra selezionata</td></tr>`;
    return;
  }

  seasonalityDayTimingRowsEl.innerHTML = rows
    .map((r) => {
      const biasLabel = r.monthBias === "long" ? "Long" : r.monthBias === "short" ? "Short" : "Flat";
      const biasCls = r.monthBias === "long" ? "up" : r.monthBias === "short" ? "down" : "";
      const long = r.bestLong || {};
      const short = r.bestShort || {};
      const longHighlight = r.monthBias === "long" ? "timing-focus-long" : "";
      const shortHighlight = r.monthBias === "short" ? "timing-focus-short" : "";
      const longNote = long.samples > 0
        ? `g.${long.day} · avg ${(long.avg >= 0 ? "+" : "")}${fmtNum((long.avg || 0) * 100, 2)}% · up ${fmtNum((long.upRate || 0) * 100, 0)}% · n=${long.samples}${long.weak ? " *" : ""}`
        : `g.1 · campione insufficiente`;
      const shortNote = short.samples > 0
        ? `g.${short.day} · avg ${(short.avg >= 0 ? "+" : "")}${fmtNum((short.avg || 0) * 100, 2)}% · down ${fmtNum((short.downRate || 0) * 100, 0)}% · n=${short.samples}${short.weak ? " *" : ""}`
        : `g.1 · campione insufficiente`;
      return `<tr>
        <td>${r.monthLabel}</td>
        <td class="${biasCls}">${biasLabel} (${(r.monthAvg >= 0 ? "+" : "")}${fmtNum(r.monthAvg || 0, 2)}%)</td>
        <td class="${longHighlight}">${longNote}</td>
        <td class="${shortHighlight}">${shortNote}</td>
      </tr>`;
    })
    .join("");
}

function clearSeasonalitySection(reason = "Dati prezzi insufficienti per la stagionalita") {
  state.latestSeasonalityPayload = null;
  if (seasonalityWindowInfoEl) {
    seasonalityWindowInfoEl.textContent = reason;
  }
  if (seasonalityInsightCardsEl) {
    seasonalityInsightCardsEl.innerHTML = `<div class="seasonality-insight-card"><div class="label">Stagionalita</div><div class="value">In attesa di dati reali</div><div class="note">${reason}</div></div>`;
  }
  if (seasonalityRankRowsEl) {
    seasonalityRankRowsEl.innerHTML = `<tr><td colspan="4">${reason}</td></tr>`;
  }
  if (seasonalityDayTimingRowsEl) {
    seasonalityDayTimingRowsEl.innerHTML = `<tr><td colspan="4">${reason}</td></tr>`;
  }
  if (seasonalityNumbersEl) {
    seasonalityNumbersEl.textContent = "";
  }
  clearBacktest();
  state.sourceHealth.seasonality = {
    status: "error",
    source: reason,
    lastSuccessAt: null,
    error: reason,
  };
}

function renderSeasonalitySection(payload, sourceLabel = "") {
  const { seasonalityBasePrices, seasonality, seasonalityStats, seasonalityPath, backtest, dayTiming } = payload;
  state.latestSeasonalityPayload = payload;
  updateSeasonalityChart(seasonality, seasonalityStats, seasonalityPath);
  renderSeasonalityInsights(
    seasonality,
    seasonalityStats,
    state.seasonalityStartMonth,
    state.seasonalityHorizon,
    seasonalityPath,
    dayTiming || buildMonthDayEntryTiming(seasonalityBasePrices, seasonality)
  );
  renderSeasonalityRanking(seasonality, seasonalityStats);
  renderSeasonalityDayTiming(dayTiming || buildMonthDayEntryTiming(seasonalityBasePrices, seasonality));
  renderBacktest(backtest || { count: 0, hitRate: 0, avg: 0, median: 0, best: 0, worst: 0 });
  if (seasonalityWindowInfoEl) {
    const y = state.seasonalityYears === "ALL" ? "All storico" : `${state.seasonalityYears} anni`;
    const yearsUsed = seasonalityPath.usedYears?.length || 0;
    const coverage = Number.isFinite(seasonalityPath.coveragePct) ? fmtNum(seasonalityPath.coveragePct, 1) : "--";
    const suffix = sourceLabel ? ` | fonte: ${sourceLabel}` : "";
    seasonalityWindowInfoEl.textContent = `Finestra: ${y} | media giornaliera MM-DD | copertura: ${coverage}% | punti: ${seasonalityBasePrices.length} | anni usati: ${yearsUsed}${suffix}`;
  }
  state.sourceHealth.seasonality = {
    status: /fallback|sintetic|degradato/i.test(sourceLabel) ? "degraded" : "ok",
    source: sourceLabel || "dataset prezzi corrente",
    lastSuccessAt: new Date().toISOString(),
    error: null,
  };
}

function computeWeeklyFlow(series) {
  return series.map((row, idx) => {
    if (idx === 0) {
      return { opened: 0, closed: 0, openedPctOi: 0, closedPctOi: 0 };
    }
    const prev = series[idx - 1];
    const dLong = row.long - prev.long;
    const dShort = row.short - prev.short;
    const opened = Math.max(dLong, 0) + Math.max(dShort, 0);
    const closed = Math.max(-dLong, 0) + Math.max(-dShort, 0);
    return {
      opened,
      closed,
      openedPctOi: row.oi > 0 ? (opened / row.oi) * 100 : 0,
      closedPctOi: row.oi > 0 ? (closed / row.oi) * 100 : 0,
    };
  });
}

function buildCategorySeries(filteredCot, category) {
  return filteredCot.map((r) => ({
    date: r.date,
    oi: r.oi,
    long: r[`${category}Long`],
    short: r[`${category}Short`],
    net: r[`${category}Net`],
  }));
}

function applyManualHorizontalPan(chart, canvas, dxPx) {
  if (!chart || !canvas || !Number.isFinite(dxPx) || dxPx === 0) return;
  const xScale = chart.scales?.x;
  if (!xScale) return;

  if (typeof chart.pan === "function") {
    // plugin zoom presente: pan nativo molto fluido.
    chart.pan({ x: dxPx, y: 0 }, undefined, "default");
    return;
  }

  // Fallback senza plugin: pan su indice categoria.
  const labelsCount = chart.data?.labels?.length || 0;
  const width = Math.max(canvas.clientWidth || 1, 1);
  const visibleMin = Number.isFinite(xScale.min) ? xScale.min : 0;
  const visibleMax = Number.isFinite(xScale.max) ? xScale.max : Math.max(labelsCount - 1, 0);
  const visibleRange = Math.max(visibleMax - visibleMin, 1);
  const shift = (dxPx / width) * visibleRange;
  let nextMin = visibleMin - shift;
  let nextMax = visibleMax - shift;
  const lower = 0;
  const upper = Math.max(labelsCount - 1, 1);
  if (nextMin < lower) {
    const off = lower - nextMin;
    nextMin += off;
    nextMax += off;
  }
  if (nextMax > upper) {
    const off = nextMax - upper;
    nextMin -= off;
    nextMax -= off;
  }
  xScale.options.min = nextMin;
  xScale.options.max = nextMax;
  chart.update("none");
}

function bindLeftMousePan(canvas, getChart) {
  if (!canvas || canvas.dataset.leftPanBound === "1") return;
  let dragging = false;
  let lastX = 0;

  const onMouseDown = (event) => {
    if (event.button !== 0) return;
    dragging = true;
    lastX = event.clientX;
    canvas.style.cursor = "grabbing";
    event.preventDefault();
  };

  const onMouseMove = (event) => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    lastX = event.clientX;
    const chart = getChart();
    applyManualHorizontalPan(chart, canvas, dx);
  };

  const onMouseUp = () => {
    dragging = false;
    canvas.style.cursor = "default";
  };

  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  canvas.dataset.leftPanBound = "1";
}

function buildCotIndexSeries(categorySeries, lookbackWeeks = 52) {
  const lb = Math.max(2, Number(lookbackWeeks) || 52);
  return categorySeries.map((row, idx) => {
    const start = Math.max(0, idx - lb + 1);
    const window = categorySeries.slice(start, idx + 1).map((x) => x.net).filter(Number.isFinite);
    const minNet = Math.min(...window);
    const maxNet = Math.max(...window);
    const range = maxNet - minNet;
    if (!Number.isFinite(range) || range <= 0) return 50;
    return ((row.net - minNet) / range) * 100;
  });
}

function buildSmaSeries(series, period = 4) {
  const p = Math.max(2, Number(period) || 4);
  return series.map((_, idx) => {
    const start = Math.max(0, idx - p + 1);
    const window = series.slice(start, idx + 1).filter(Number.isFinite);
    if (!window.length) return null;
    return window.reduce((acc, v) => acc + v, 0) / window.length;
  });
}

function getCotRegimeLabel(indexValue) {
  if (!Number.isFinite(indexValue)) return { label: "--", cls: "" };
  if (indexValue >= 80) return { label: "Extreme Bull", cls: "up" };
  if (indexValue >= 65) return { label: "Bullish", cls: "up" };
  if (indexValue <= 20) return { label: "Extreme Bear", cls: "down" };
  if (indexValue <= 35) return { label: "Bearish", cls: "down" };
  return { label: "Neutral", cls: "" };
}

function computeZScore(series) {
  if (!series.length) return 0;
  const mean = series.reduce((a, b) => a + b, 0) / series.length;
  const variance = series.reduce((acc, v) => acc + (v - mean) ** 2, 0) / Math.max(series.length - 1, 1);
  const std = Math.sqrt(variance);
  const last = series[series.length - 1];
  if (!Number.isFinite(std) || std <= 0) return 0;
  return (last - mean) / std;
}

function getCrowdingSignal(latestIndex, nonCommZ) {
  if (latestIndex >= 80 && nonCommZ >= 1.2) return { text: "Crowded Long", cls: "up" };
  if (latestIndex <= 20 && nonCommZ <= -1.2) return { text: "Crowded Short", cls: "down" };
  if (Math.abs(nonCommZ) >= 1.2) return { text: "Positioning stretched", cls: nonCommZ > 0 ? "up" : "down" };
  return { text: "Balanced positioning", cls: "" };
}

function getCotDivergenceSignal(cotIndex, priceMomentum20d) {
  const cotBull = cotIndex >= 55;
  const cotBear = cotIndex <= 45;
  const momBull = priceMomentum20d >= 0.5;
  const momBear = priceMomentum20d <= -0.5;
  if ((cotBull && momBull) || (cotBear && momBear)) {
    return {
      text: "Prezzo e COT allineati",
      cls: cotBull ? "up" : "down",
      align: 1,
    };
  }
  if ((cotBull && momBear) || (cotBear && momBull)) {
    return {
      text: "Divergenza prezzo vs positioning",
      cls: "down",
      align: 0,
    };
  }
  return { text: "Allineamento neutro", cls: "", align: 0.5 };
}

function computeForwardSeasonality(seasonality, startMonth, horizon) {
  const h = Math.max(1, Number(horizon) || 1);
  let compounded = 1;
  for (let i = 0; i < h; i += 1) {
    const m = (startMonth + i) % 12;
    compounded *= 1 + (seasonality[m] || 0) / 100;
  }
  return (compounded - 1) * 100;
}

function renderSeasonalityRanking(seasonality, seasonalityStats) {
  if (!seasonalityRankRowsEl) return;
  const rows = MONTH_LABELS.map((month, idx) => ({
    month,
    avg: seasonality[idx] || 0,
    median: seasonalityStats[idx]?.median || 0,
    low: seasonalityStats[idx]?.low || 0,
    high: seasonalityStats[idx]?.high || 0,
  })).sort((a, b) => b.avg - a.avg);

  seasonalityRankRowsEl.innerHTML = rows
    .map(
      (r) => `<tr>
      <td>${r.month}</td>
      <td class="${r.avg >= 0 ? "up" : "down"}">${r.avg >= 0 ? "+" : ""}${fmtNum(r.avg, 2)}%</td>
      <td class="${r.median >= 0 ? "up" : "down"}">${r.median >= 0 ? "+" : ""}${fmtNum(r.median, 2)}%</td>
      <td>${fmtNum(r.low, 2)}% / ${fmtNum(r.high, 2)}%</td>
    </tr>`
    )
    .join("");
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function driverSide(value01, bullTh = 0.58, bearTh = 0.42) {
  if (value01 >= bullTh) return 1;
  if (value01 <= bearTh) return -1;
  return 0;
}

function computeBiasEngine({
  cotIndex,
  nonCommZ,
  divergenceAlign = 0.5,
  crowdingText = "",
  seasonalityForward,
  priceMomentum20d,
  dataConfidence,
  profile,
  oiMomentum4w = 0,
  macroRisk = null,
}) {
  const profiles = {
    intraday: { cot: 0.25, seasonal: 0.25, momentum: 0.4, divergence: 0.1 },
    swing: { cot: 0.4, seasonal: 0.3, momentum: 0.2, divergence: 0.1 },
    position: { cot: 0.45, seasonal: 0.35, momentum: 0.1, divergence: 0.1 },
  };
  const w = profiles[profile] || profiles.swing;

  const cotDir = clamp01((cotIndex - 20) / 60);
  const zDir = clamp01((nonCommZ + 2) / 4);
  let cotBlend = (cotDir * 0.7) + (zDir * 0.3);

  // Crowding estremo: non conferma il trend, lo smussa
  if (String(crowdingText).includes("Crowded Long")) {
    cotBlend = clamp01(cotBlend - 0.25);
  } else if (String(crowdingText).includes("Crowded Short")) {
    cotBlend = clamp01(cotBlend + 0.25);
  }

  const seasonalDir = clamp01((seasonalityForward + 4) / 8);
  const momentumDir = clamp01((priceMomentum20d + 6) / 12);
  const align = clamp01(Number(divergenceAlign));
  const divergenceDir = 0.25 + (align * 0.5);

  const contributors = {
    cot: w.cot * cotBlend,
    seasonal: w.seasonal * seasonalDir,
    momentum: w.momentum * momentumDir,
    divergence: w.divergence * divergenceDir,
  };

  const raw01 =
    contributors.cot +
    contributors.seasonal +
    contributors.momentum +
    contributors.divergence;

  let score = Math.round(raw01 * 100);

  const pairAgree = (a, b) => (Math.abs(a - b) <= 0.2 ? 1 : Math.abs(a - b) <= 0.32 ? 0.45 : 0);
  const agreement =
    pairAgree(cotBlend, seasonalDir) * 0.28 +
    pairAgree(cotBlend, momentumDir) * 0.28 +
    pairAgree(seasonalDir, momentumDir) * 0.22 +
    align * 0.22;
  let confidence = Math.round(clamp01((clamp01(dataConfidence) * 0.35) + (agreement * 0.65)) * 100);

  const cotSide = driverSide(cotBlend);
  const seasSide = driverSide(seasonalDir);
  const momSide = driverSide(momentumDir);
  const bullVotes = [cotSide, seasSide, momSide].filter((s) => s === 1).length;
  const bearVotes = [cotSide, seasSide, momSide].filter((s) => s === -1).length;

  const gateReasons = [];
  let stateLabel = "Neutral";
  let stateClass = "";

  // Candidato grezzo solo se score chiaro
  let candidate = "Neutral";
  if (score >= 66 && bullVotes >= 2 && bearVotes === 0) candidate = "Bullish";
  if (score <= 34 && bearVotes >= 2 && bullVotes === 0) candidate = "Bearish";

  // Gate veridicita: niente segnale se i dati o il contesto non reggono
  if (Number(dataConfidence) < 0.72) {
    gateReasons.push("qualita feed insufficiente");
    candidate = "Neutral";
  }
  if (macroRisk?.active) {
    gateReasons.push("finestra macro ad alto impatto");
    candidate = "Neutral";
  }
  if (align < 0.5) {
    gateReasons.push("divergenza prezzo vs COT");
    candidate = "Neutral";
  }
  if (candidate !== "Neutral" && confidence < 65) {
    gateReasons.push("signal conf sotto soglia");
    candidate = "Neutral";
  }
  // Serve allineamento forte (prezzo+COT) oppure 3/3 driver
  if (candidate !== "Neutral" && align < 1 && ((candidate === "Bullish" ? bullVotes : bearVotes) < 3)) {
    gateReasons.push("accordo driver incompleto");
    candidate = "Neutral";
  }
  if (candidate === "Bullish" && String(crowdingText).includes("Crowded Long")) {
    gateReasons.push("crowding long estremo");
    candidate = "Neutral";
  }
  if (candidate === "Bearish" && String(crowdingText).includes("Crowded Short")) {
    gateReasons.push("crowding short estremo");
    candidate = "Neutral";
  }
  // OI in calo su spinta direzionale = segnale sospetto
  if (candidate === "Bullish" && Number(oiMomentum4w) <= -3.5 && momentumDir >= 0.62) {
    gateReasons.push("OI in calo su momentum rialzista");
    candidate = "Neutral";
  }
  if (candidate === "Bearish" && Number(oiMomentum4w) <= -3.5 && momentumDir <= 0.38) {
    gateReasons.push("OI in calo su momentum ribassista");
    candidate = "Neutral";
  }
  // Stagionalita non deve contraddire il segnale
  if (candidate === "Bullish" && seasSide === -1) {
    gateReasons.push("stagionalita contraria");
    candidate = "Neutral";
  }
  if (candidate === "Bearish" && seasSide === 1) {
    gateReasons.push("stagionalita contraria");
    candidate = "Neutral";
  }

  if (candidate === "Bullish") {
    stateLabel = "Bullish";
    stateClass = "up";
    score = Math.max(score, 66);
  } else if (candidate === "Bearish") {
    stateLabel = "Bearish";
    stateClass = "down";
    score = Math.min(score, 34);
  } else {
    // Neutral: tieni lo score vicino al centro se non c'e edge vero
    if (score > 58) score = 58;
    if (score < 42) score = 42;
    confidence = Math.min(confidence, 72);
  }

  return {
    score,
    confidence,
    stateLabel,
    stateClass,
    contributors,
    gateReason: gateReasons.length ? gateReasons.join(" · ") : "driver allineati",
    votes: { bull: bullVotes, bear: bearVotes, cot: cotSide, seasonal: seasSide, momentum: momSide },
  };
}

function buildPlaybook(biasState, score, seasonalityForward, cotRegimeLabel, signalConfidence, gateReason = "") {
  const conf = Math.max(0, Math.min(100, Math.round(Number(signalConfidence) || 0)));
  if (biasState === "Bullish") {
    return {
      title: "LONG setup",
      text: `Segnale verificato | Bias ${score}/100 | Signal Conf ${conf}% | Stag ${fmtNum(seasonalityForward, 2)}% | Regime ${cotRegimeLabel}. Cerca pullback su supporti, invalidazione sotto swing low.`,
      cls: "up",
    };
  }
  if (biasState === "Bearish") {
    return {
      title: "SHORT setup",
      text: `Segnale verificato | Bias ${score}/100 | Signal Conf ${conf}% | Stag ${fmtNum(seasonalityForward, 2)}% | Regime ${cotRegimeLabel}. Cerca rimbalzi su resistenze, invalidazione sopra swing high.`,
      cls: "down",
    };
  }
  const reason = gateReason && gateReason !== "driver allineati"
    ? `Motivo WAIT: ${gateReason}.`
    : "Nessun edge abbastanza solido.";
  return {
    title: "WAIT / RANGE",
    text: `Nessun segnale operativo | Bias ${score}/100 | Signal Conf ${conf}%. ${reason} Attendi allineamento COT + stagione + momentum.`,
    cls: "",
  };
}

function pushAlert(message, cls = "") {
  const now = new Date();
  state.alerts.unshift({ ts: now, message, cls });
  state.alerts = state.alerts.slice(0, 12);
}

function getAlertCooldownMs() {
  const quality = Number.isFinite(state.currentQualityScore) ? state.currentQualityScore : 70;
  let baseMs = 75 * 1000;
  if (state.alertMode === "aggressive") baseMs = 30 * 1000;
  if (state.alertMode === "conservative") baseMs = 3 * 60 * 1000;
  const qualityMultiplier = quality < 60 ? 1.7 : quality < 75 ? 1.2 : 0.9;
  return Math.round(baseMs * qualityMultiplier);
}

function smartAlert(key, message, cls = "") {
  const now = Date.now();
  const prev = state.lastSmartAlertAt[key] || 0;
  if (now - prev < getAlertCooldownMs()) return false;
  pushAlert(message, cls);
  state.lastSmartAlertAt[key] = now;
  const criticalKeys = new Set(["healthPrice", "healthCot", "riskHigh", "scenarioProbability", "biasState", "cotRegime", "macroRiskOff"]);
  if (criticalKeys.has(key)) {
    sendExternalNotification(`[XAU ALERT] ${message}`, key);
  }
  return true;
}

function safePct(v) {
  if (!Number.isFinite(v)) return "--";
  return `${v >= 0 ? "+" : ""}${fmtNum(v, 2)}%`;
}

function computeAdaptiveProfile(qualityScore, alertMode, macroRisk = { active: false, upcoming: false, label: "" }) {
  const q = Number.isFinite(qualityScore) ? Math.max(0, Math.min(100, qualityScore)) : 70;
  const modeRiskMult = alertMode === "aggressive" ? 1.1 : alertMode === "conservative" ? 0.88 : 1;
  const macroMult = macroRisk.active ? 0.6 : macroRisk.upcoming ? 0.82 : 1;
  const riskScale = Math.max(0.35, Math.min(1.15, (q / 100) * modeRiskMult * macroMult));
  const riskCap = Math.max(0.35, Math.min(1.1, riskScale * 0.95));
  const cadenceSec = Math.round(getAlertCooldownMs() / 1000);
  let status = "Stable";
  let cls = "";
  if (macroRisk.active) {
    status = "Risk-off macro attivo";
    cls = "down";
  } else if (macroRisk.upcoming) {
    status = "Pre risk-off macro";
    cls = "";
  } else if (q < 60) {
    status = "Quality guard attivo";
    cls = "down";
  } else if (q > 85) {
    status = "Alta affidabilita";
    cls = "up";
  }
  return { qualityScore: q, riskScale, riskCap, cadenceSec, status, cls, macroLabel: macroRisk.label || "" };
}

function renderAdaptiveProfile(adaptive) {
  if (!adaptive) return;
  const modeLabel = state.alertMode === "aggressive" ? "Aggressive" : state.alertMode === "conservative" ? "Conservative" : "Balanced";
  setText("adaptiveMode", modeLabel);
  setText("adaptiveAlertCadence", `${adaptive.cadenceSec}s`);
  setText("adaptiveRiskScale", `${fmtNum(adaptive.riskScale * 100, 0)}%`);
  setText("adaptiveRiskCap", `${fmtNum(adaptive.riskCap * 100, 0)}%`);
  const statusText = adaptive.macroLabel ? `${adaptive.status} | ${adaptive.macroLabel}` : adaptive.status;
  setText("adaptiveStatus", statusText, adaptive.cls);
}

function computeRiskOverlay(prices, spot, profile) {
  if (!Array.isArray(prices) || prices.length < 16 || !Number.isFinite(spot) || spot <= 0) {
    return null;
  }
  const dailyRanges = [];
  const returnsAbs = [];
  for (let i = 1; i < prices.length; i += 1) {
    const prev = prices[i - 1].close;
    const curr = prices[i].close;
    if (!Number.isFinite(prev) || !Number.isFinite(curr) || prev <= 0) continue;
    dailyRanges.push(Math.abs(curr - prev));
    returnsAbs.push(Math.abs(((curr / prev) - 1) * 100));
  }
  const atrWindow = dailyRanges.slice(-14);
  const atr = atrWindow.length ? atrWindow.reduce((a, b) => a + b, 0) / atrWindow.length : 0;
  const moveWindow = returnsAbs.slice(-20);
  const dailyMovePct = moveWindow.length ? moveWindow.reduce((a, b) => a + b, 0) / moveWindow.length : 0;

  let regime = "Normale";
  let cls = "";
  if (dailyMovePct >= 1.35) {
    regime = "Rischio Alto";
    cls = "down";
  } else if (dailyMovePct <= 0.65) {
    regime = "Rischio Basso";
    cls = "up";
  }

  const profileRisk = { intraday: 0.45, swing: 0.7, position: 1.0 };
  const base = profileRisk[profile] || 0.7;
  const sizePct = base * Math.max(0.45, Math.min(1.4, 0.95 / Math.max(dailyMovePct, 0.35)));
  return {
    atr,
    dailyMovePct,
    regime,
    cls,
    stopDist: atr * 1.15,
    sizePct,
  };
}

function avgClose(prices) {
  if (!prices.length) return null;
  return prices.reduce((a, p) => a + p.close, 0) / prices.length;
}

function computeKeyLevels(prices, spot) {
  if (!Array.isArray(prices) || prices.length < 25 || !Number.isFinite(spot) || spot <= 0) return null;
  const recent = prices.slice(-21).map((p) => p.close).filter(Number.isFinite);
  const daySlice = prices.slice(-2).map((p) => p.close).filter(Number.isFinite);
  if (recent.length < 5 || daySlice.length < 2) return null;
  const high20 = Math.max(...recent);
  const low20 = Math.min(...recent);
  const prevClose = daySlice[0];
  const lastClose = daySlice[1];
  const pivot = (high20 + low20 + prevClose) / 3;
  const r1 = (2 * pivot) - low20;
  const s1 = (2 * pivot) - high20;
  const r2 = pivot + (high20 - low20);
  const s2 = pivot - (high20 - low20);
  const ma50 = avgClose(prices.slice(-50));
  const ma200 = avgClose(prices.slice(-200));
  let trend = "Range";
  let trendCls = "";
  if (Number.isFinite(ma50) && Number.isFinite(ma200)) {
    if (ma50 > ma200 && lastClose >= ma50) {
      trend = "Bull trend";
      trendCls = "up";
    } else if (ma50 < ma200 && lastClose <= ma50) {
      trend = "Bear trend";
      trendCls = "down";
    }
  }
  return { pivot, s1, s2, r1, r2, trend, trendCls };
}

function computeScenarioTree({ spot, stopDist, scenarioProb }) {
  if (!Number.isFinite(spot) || !Number.isFinite(stopDist) || stopDist <= 0) return null;
  const p = Math.max(0, Math.min(100, Number(scenarioProb) || 50));
  const bullProb = Math.max(5, Math.min(90, p + 10));
  const bearProb = Math.max(5, Math.min(90, 100 - p + 10));
  const baseProb = Math.max(5, 100 - Math.round((bullProb + bearProb) * 0.6));
  return {
    bull: {
      trigger: spot + stopDist * 0.35,
      invalid: spot - stopDist * 0.85,
      prob: bullProb,
    },
    base: {
      trigger: `${fmtNum(spot - stopDist * 0.2, 2)} - ${fmtNum(spot + stopDist * 0.2, 2)}`,
      invalid: `${fmtNum(spot - stopDist * 0.9, 2)} / ${fmtNum(spot + stopDist * 0.9, 2)}`,
      prob: baseProb,
    },
    bear: {
      trigger: spot - stopDist * 0.35,
      invalid: spot + stopDist * 0.85,
      prob: bearProb,
    },
  };
}

function renderScenarioTree(tree) {
  if (!tree) {
    setText("scenarioBullTrigger", "--");
    setText("scenarioBullInvalid", "--");
    setText("scenarioBullProb", "--");
    setText("scenarioBaseTrigger", "--");
    setText("scenarioBaseInvalid", "--");
    setText("scenarioBaseProb", "--");
    setText("scenarioBearTrigger", "--");
    setText("scenarioBearInvalid", "--");
    setText("scenarioBearProb", "--");
    return;
  }
  setText("scenarioBullTrigger", `$ ${fmtNum(tree.bull.trigger, 2)}`, "up");
  setText("scenarioBullInvalid", `$ ${fmtNum(tree.bull.invalid, 2)}`, "down");
  setText("scenarioBullProb", `${tree.bull.prob}%`, tree.bull.prob >= 60 ? "up" : "");
  setText("scenarioBaseTrigger", tree.base.trigger);
  setText("scenarioBaseInvalid", tree.base.invalid);
  setText("scenarioBaseProb", `${tree.base.prob}%`);
  setText("scenarioBearTrigger", `$ ${fmtNum(tree.bear.trigger, 2)}`, "down");
  setText("scenarioBearInvalid", `$ ${fmtNum(tree.bear.invalid, 2)}`, "up");
  setText("scenarioBearProb", `${tree.bear.prob}%`, tree.bear.prob >= 60 ? "down" : "");
}

function updateSignalJournal({ biasState, spot, qualityScore, scenarioProb, signalConfidence }) {
  if (!Number.isFinite(spot) || !biasState || biasState === "Neutral") return;
  if ((Number(signalConfidence) || 0) < 65 || (Number(qualityScore) || 0) < 70) return;
  const now = new Date();
  const qualityBucket = qualityScore >= 80 ? "high" : qualityScore >= 60 ? "mid" : "low";
  const key = `${biasState}|${Math.round(scenarioProb / 10)}|${qualityBucket}`;
  if (state.lastJournalKey === key) return;
  state.lastJournalKey = key;
  state.signalJournal.unshift({
    ts: now,
    biasState,
    entryPrice: spot,
    currentPrice: spot,
    qualityScore,
    scenarioProb,
    returnPct: 0,
    outcome: "OPEN",
  });
  state.signalJournal = state.signalJournal.slice(0, 120);
}

function evaluateSignalJournal(latestSpot) {
  if (!Number.isFinite(latestSpot)) return;
  const now = Date.now();
  const evalMs = Math.max(1, Number(state.journalEvalHorizonHours) || 4) * 60 * 60 * 1000;
  state.signalJournal.forEach((row) => {
    row.currentPrice = latestSpot;
    const ret = row.entryPrice > 0 ? ((latestSpot / row.entryPrice) - 1) * 100 : 0;
    row.returnPct = ret;
    if (row.outcome !== "OPEN") return;
    const ageMs = now - new Date(row.ts).getTime();
    const hit = 0.35;
    if (row.biasState === "Bullish") {
      if (ret >= hit) row.outcome = "WIN";
      else if (ret <= -hit) row.outcome = "LOSS";
    } else if (row.biasState === "Bearish") {
      if (ret <= -hit) row.outcome = "WIN";
      else if (ret >= hit) row.outcome = "LOSS";
    }
    if (row.outcome === "OPEN" && ageMs > evalMs) {
      if (Math.abs(ret) < 0.2) {
        row.outcome = "FLAT";
      } else if (row.biasState === "Bullish") {
        row.outcome = ret > 0 ? "WIN" : "LOSS";
      } else if (row.biasState === "Bearish") {
        row.outcome = ret < 0 ? "WIN" : "LOSS";
      } else {
        row.outcome = "FLAT";
      }
    }
  });
}

function renderSignalJournal() {
  if (!signalJournalRowsEl) return;
  const filteredRows = state.journalOutcomeFilter === "ALL"
    ? state.signalJournal
    : state.signalJournal.filter((r) => r.outcome === state.journalOutcomeFilter);
  if (!filteredRows.length) {
    signalJournalRowsEl.innerHTML = `<tr><td colspan="7">--</td></tr>`;
    if (journalStatsEl) journalStatsEl.textContent = "Campioni -- | WinRate -- | Expectancy --";
    return;
  }
  signalJournalRowsEl.innerHTML = filteredRows
    .slice(0, 40)
    .map((r) => {
      const cls = r.outcome === "WIN" ? "up" : r.outcome === "LOSS" ? "down" : "";
      return `<tr>
      <td>${r.ts.toLocaleTimeString("it-IT")}</td>
      <td class="${r.biasState === "Bullish" ? "up" : "down"}">${r.biasState}</td>
      <td>$ ${fmtNum(r.entryPrice, 2)}</td>
      <td>$ ${fmtNum(r.currentPrice, 2)}</td>
      <td class="${r.returnPct >= 0 ? "up" : "down"}">${safePct(r.returnPct)}</td>
      <td class="${cls}">${r.outcome}</td>
      <td class="${r.qualityScore >= 80 ? "up" : r.qualityScore < 60 ? "down" : ""}">${r.qualityScore}%</td>
    </tr>`;
    })
    .join("");
  const closed = filteredRows.filter((r) => r.outcome !== "OPEN");
  const wins = closed.filter((r) => r.outcome === "WIN").length;
  const avg = closed.length ? closed.reduce((a, b) => a + b.returnPct, 0) / closed.length : 0;
  const winRate = closed.length ? (wins / closed.length) * 100 : 0;
  if (journalStatsEl) {
    journalStatsEl.textContent = `Campioni ${closed.length} | WinRate ${fmtNum(winRate, 1)}% | Expectancy ${safePct(avg)}`;
  }
}

function exportSignalJournalCsv() {
  const rows = state.signalJournal;
  if (!rows.length) {
    smartAlert("journalExport", "Journal vuoto: nessun dato da esportare", "");
    return;
  }
  const header = ["timestamp", "bias", "entry_price", "current_price", "return_pct", "outcome", "quality_score", "scenario_prob"];
  const body = rows.map((r) => [
    r.ts.toISOString(),
    r.biasState,
    Number(r.entryPrice).toFixed(2),
    Number(r.currentPrice).toFixed(2),
    Number(r.returnPct).toFixed(4),
    r.outcome,
    String(r.qualityScore),
    String(r.scenarioProb),
  ]);
  const csv = [header, ...body].map((line) => line.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `xau_signal_journal_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  smartAlert("journalExport", "Export journal CSV completato", "up");
}

function computeSessionContext(prices) {
  const now = new Date();
  const utcHour = now.getUTCHours();
  let sessionName = "Asia";
  let nextSession = "Europa";
  if (utcHour >= 7 && utcHour < 13) {
    sessionName = "Europa";
    nextSession = "US";
  } else if (utcHour >= 13 && utcHour < 21) {
    sessionName = "US";
    nextSession = "Asia";
  }

  const rows = [];
  for (let i = 1; i < prices.length; i += 1) {
    const prev = prices[i - 1];
    const curr = prices[i];
    if (!Number.isFinite(prev.close) || !Number.isFinite(curr.close) || prev.close <= 0) continue;
    const ret = ((curr.close / prev.close) - 1) * 100;
    rows.push({ hour: curr.date.getUTCHours(), ret });
  }
  const bucket = rows.filter((r) => {
    if (sessionName === "Asia") return r.hour >= 21 || r.hour < 7;
    if (sessionName === "Europa") return r.hour >= 7 && r.hour < 13;
    return r.hour >= 13 && r.hour < 21;
  });
  const mean = bucket.length ? bucket.reduce((a, b) => a + b.ret, 0) / bucket.length : 0;
  const meanAbs = bucket.length ? bucket.reduce((a, b) => a + Math.abs(b.ret), 0) / bucket.length : 0;
  const bias = mean > 0.03 ? "Long tilt" : mean < -0.03 ? "Short tilt" : "Neutral";
  const cls = mean > 0.03 ? "up" : mean < -0.03 ? "down" : "";
  return {
    sessionName,
    nextSession,
    meanRet: mean,
    meanAbs,
    bias,
    cls,
    clock: now.toISOString().slice(11, 19),
  };
}

function pushSnapshot(snapshot) {
  const prev = state.snapshotHistory[0];
  if (prev && prev.bucketTs === snapshot.bucketTs && prev.biasState === snapshot.biasState && prev.scenarioProb === snapshot.scenarioProb) {
    return;
  }
  state.snapshotHistory.unshift(snapshot);
  state.snapshotHistory = state.snapshotHistory.slice(0, 180);
}

function renderReplaySnapshot() {
  const hasHistory = state.snapshotHistory.length > 0;
  if (!replayStepEl || !replayStepLabelEl) return;
  replayStepEl.max = hasHistory ? String(Math.max(0, state.snapshotHistory.length - 1)) : "0";
  if (!hasHistory) {
    replayStepEl.value = "0";
    replayStepLabelEl.textContent = "Storico non disponibile";
    setText("replayTs", "--");
    setText("replayBias", "--");
    setText("replayScenario", "--");
    setText("replayQuality", "--");
    setText("adaptiveMode", "--");
    setText("adaptiveAlertCadence", "--");
    setText("adaptiveRiskScale", "--");
    setText("adaptiveRiskCap", "--");
    setText("adaptiveStatus", "--");
    setText("scenarioBullTrigger", "--");
    setText("scenarioBullInvalid", "--");
    setText("scenarioBullProb", "--");
    setText("scenarioBaseTrigger", "--");
    setText("scenarioBaseInvalid", "--");
    setText("scenarioBaseProb", "--");
    setText("scenarioBearTrigger", "--");
    setText("scenarioBearInvalid", "--");
    setText("scenarioBearProb", "--");
    return;
  }
  const clampedStep = Math.max(0, Math.min(state.replayStep, state.snapshotHistory.length - 1));
  if (clampedStep !== state.replayStep) {
    state.replayStep = clampedStep;
  }
  replayStepEl.value = String(clampedStep);
  const active = state.replayMode === "on" ? state.snapshotHistory[clampedStep] : state.snapshotHistory[0];
  const modeLabel = state.replayMode === "on" ? `Replay -${clampedStep}` : "Live";
  replayStepLabelEl.textContent = `${modeLabel} | snapshots: ${state.snapshotHistory.length}`;
  setText("replayTs", active.ts.toLocaleString("it-IT"));
  setText("replayBias", `${active.biasScore}/100 (${active.biasState})`, active.biasState === "Bullish" ? "up" : active.biasState === "Bearish" ? "down" : "");
  setText("replayScenario", `${active.scenarioProb}% | ${active.executionSide}`);
  setText("replayQuality", `${active.qualityScore}%`, active.qualityScore >= 80 ? "up" : active.qualityScore < 60 ? "down" : "");
}

function renderAlertFeed() {
  if (!alertFeedEl) return;
  if (!state.alerts.length) {
    alertFeedEl.innerHTML = `<div class="alert-item"><span class="time">--</span> Nessun alert recente</div>`;
    return;
  }
  alertFeedEl.innerHTML = state.alerts
    .map((a) => `<div class="alert-item"><span class="time">${a.ts.toLocaleTimeString("it-IT")}</span><span class="${a.cls}">${a.message}</span></div>`)
    .join("");
}

function computeScenarioProbability({ biasScore, biasConfidence, hitRate, avgReturn }) {
  const bias01 = clamp01((biasScore - 30) / 40);
  const conf01 = clamp01(biasConfidence / 100);
  const hit01 = clamp01((hitRate || 0) / 100);
  const avg01 = clamp01(((avgReturn || 0) + 4) / 8);
  const p = (bias01 * 0.35) + (conf01 * 0.25) + (hit01 * 0.25) + (avg01 * 0.15);
  return Math.round(p * 100);
}

function updateSignalHistory({ biasScore, biasState, qualityScore }) {
  const now = new Date();
  const currentBucketTs = `${now.getHours()}:${now.getMinutes()}:${Math.floor(now.getSeconds() / 10)}`;
  const prev = state.signalHistory[0];
  if (
    prev &&
    prev.bucketTs === currentBucketTs &&
    prev.biasScore === biasScore &&
    prev.biasState === biasState &&
    prev.qualityScore === qualityScore
  ) {
    return;
  }
  state.signalHistory.unshift({
    ts: now,
    bucketTs: currentBucketTs,
    biasScore,
    biasState,
    qualityScore,
  });
  state.signalHistory = state.signalHistory.slice(0, 24);
}

function renderSignalHistory() {
  if (!signalHistoryRowsEl) return;
  if (!state.signalHistory.length) {
    signalHistoryRowsEl.innerHTML = `<tr><td colspan="4">--</td></tr>`;
    return;
  }
  signalHistoryRowsEl.innerHTML = state.signalHistory
    .map((r) => `<tr>
      <td>${r.ts.toLocaleTimeString("it-IT")}</td>
      <td>${r.biasScore}</td>
      <td class="${r.biasState === "Bullish" ? "up" : r.biasState === "Bearish" ? "down" : ""}">${r.biasState}</td>
      <td class="${r.qualityScore >= 80 ? "up" : r.qualityScore < 60 ? "down" : ""}">${r.qualityScore}%</td>
    </tr>`)
    .join("");
}

function timedTask(taskFn) {
  const started = performance.now();
  return taskFn()
    .then((value) => ({
      ok: true,
      value,
      latencyMs: Math.round(performance.now() - started),
      error: null,
    }))
    .catch((error) => ({
      ok: false,
      value: null,
      latencyMs: Math.round(performance.now() - started),
      error: String(error?.message || error || "errore sconosciuto"),
    }));
}

function fmtHealthTime(date) {
  if (!date) return "--";
  try {
    return new Date(date).toLocaleTimeString("it-IT");
  } catch {
    return "--";
  }
}

function renderSourceHealth() {
  const p = state.sourceHealth.price;
  const c = state.sourceHealth.cot;
  const s = state.sourceHealth.seasonality;
  if (healthPriceEl) {
    const cls = p.status === "ok" ? "up" : p.status === "error" ? "down" : "";
    healthPriceEl.className = cls;
    healthPriceEl.textContent = `${p.status.toUpperCase()} | ${p.source} | ${p.latencyMs ?? "--"}ms | ok ${fmtHealthTime(p.lastSuccessAt)}`;
  }
  if (healthCotEl) {
    const cls = c.status === "ok" ? "up" : c.status === "error" ? "down" : "";
    healthCotEl.className = cls;
    healthCotEl.textContent = `${c.status.toUpperCase()} | ${c.source} | ${c.latencyMs ?? "--"}ms | ok ${fmtHealthTime(c.lastSuccessAt)}`;
  }
  if (healthSeasonalityEl) {
    const cls = s.status === "ok" ? "up" : s.status === "error" ? "down" : "";
    healthSeasonalityEl.className = cls;
    healthSeasonalityEl.textContent = `${s.status.toUpperCase()} | ${s.source} | ok ${fmtHealthTime(s.lastSuccessAt)}`;
  }
}

function renderBiasContributors(contributors) {
  if (!biasContribMainEl || !biasContribTextEl || !contributors) return;
  const sorted = Object.entries(contributors).sort((a, b) => b[1] - a[1]);
  const [topKey, topVal] = sorted[0] || ["--", 0];
  const labels = {
    cot: "COT",
    seasonal: "Stagionalita",
    momentum: "Momentum",
    divergence: "Divergenza",
  };
  biasContribMainEl.textContent = `${labels[topKey] || topKey} ${fmtNum((topVal || 0) * 100, 1)}%`;
  biasContribTextEl.textContent = sorted
    .map(([k, v]) => `${labels[k] || k}: ${fmtNum(v * 100, 1)}%`)
    .join(" | ");
}

function buildExecutionBoard({ biasState, spot, volPct, seasonalForward, adaptiveRiskScale = 1, adaptiveRiskCap = 1 }) {
  if (!Number.isFinite(spot) || spot <= 0) {
    return {
      side: "--",
      entry: "--",
      invalidation: "--",
      targets: "--",
      note: "Prezzo non disponibile",
      cls: "",
    };
  }
  const dayRiskPct = Math.max(0.25, Math.min(1.8, (Number(volPct) || 12) / 22));
  const stopDist = spot * (dayRiskPct / 100);
  const tp1Dist = stopDist * 1.6;
  const tp2Dist = stopDist * 2.6;

  const riskByProfile = {
    intraday: 0.45,
    swing: 0.7,
    position: 1.0,
  };
  const baseRisk = riskByProfile[state.userProfile] || 0.7;
  const volScale = Math.max(0.45, Math.min(1.35, 14 / Math.max(volPct || 14, 7)));
  const rawRiskPct = baseRisk * volScale * adaptiveRiskScale;
  const riskPct = Math.max(0.2, Math.min(rawRiskPct, baseRisk * adaptiveRiskCap * 1.1));
  const levHint = Math.max(1, Math.min(8, Math.round((2.2 / Math.max(dayRiskPct, 0.3)) * 10) / 10));

  if (biasState === "Bullish") {
    return {
      side: "Long",
      entry: `$ ${fmtNum(spot - stopDist * 0.35, 2)} - $ ${fmtNum(spot + stopDist * 0.15, 2)}`,
      invalidation: `$ ${fmtNum(spot - stopDist, 2)}`,
      targets: `$ ${fmtNum(spot + tp1Dist, 2)} / $ ${fmtNum(spot + tp2Dist, 2)}`,
      riskSize: `${fmtNum(riskPct, 2)}% capitale`,
      leverage: `${fmtNum(levHint, 1)}x max`,
      note: `Edge stagionale ${fmtNum(seasonalForward, 2)}% | RR progressivo | risk adj x${fmtNum(adaptiveRiskScale, 2)}`,
      cls: "up",
      stopDist,
      riskPct,
    };
  }
  if (biasState === "Bearish") {
    return {
      side: "Short",
      entry: `$ ${fmtNum(spot - stopDist * 0.15, 2)} - $ ${fmtNum(spot + stopDist * 0.35, 2)}`,
      invalidation: `$ ${fmtNum(spot + stopDist, 2)}`,
      targets: `$ ${fmtNum(spot - tp1Dist, 2)} / $ ${fmtNum(spot - tp2Dist, 2)}`,
      riskSize: `${fmtNum(riskPct, 2)}% capitale`,
      leverage: `${fmtNum(levHint, 1)}x max`,
      note: `Edge stagionale ${fmtNum(seasonalForward, 2)}% | RR progressivo | risk adj x${fmtNum(adaptiveRiskScale, 2)}`,
      cls: "down",
      stopDist,
      riskPct,
    };
  }
  return {
    side: "Neutral / Wait",
    entry: `$ ${fmtNum(spot - stopDist * 0.4, 2)} - $ ${fmtNum(spot + stopDist * 0.4, 2)}`,
    invalidation: "--",
    targets: "--",
    riskSize: `${fmtNum(riskPct * 0.6, 2)}% capitale`,
    leverage: `${fmtNum(Math.max(1, levHint * 0.6), 1)}x max`,
    note: `Attendi conferma direzionale del Bias Engine | risk adj x${fmtNum(adaptiveRiskScale, 2)}`,
    cls: "",
    stopDist,
    riskPct,
  };
}

function renderSeasonalityInsights(seasonality, seasonalityStats, startMonth, horizon, seasonalityPath = null, dayTiming = null) {
  if (!seasonalityInsightCardsEl) return;
  if (!Array.isArray(seasonality) || !seasonality.length) {
    seasonalityInsightCardsEl.innerHTML = "";
    return;
  }

  const bestIdx = seasonality.reduce((best, value, idx, arr) => (value > arr[best] ? idx : best), 0);
  const worstIdx = seasonality.reduce((worst, value, idx, arr) => (value < arr[worst] ? idx : worst), 0);
  const posCount = seasonality.filter((v) => Number.isFinite(v) && v > 0).length;
  const hitRatio = (posCount / seasonality.length) * 100;
  const currentMonth = new Date().getUTCMonth();
  const currentEdge = seasonality[currentMonth] || 0;
  const currentStats = seasonalityStats?.[currentMonth];
  const currentRange = currentStats ? `${fmtNum(currentStats.low, 2)}% / ${fmtNum(currentStats.high, 2)}%` : "--";
  const next3 = [1, 2, 3].map((step) => seasonality[(currentMonth + step) % 12] || 0);
  const next3Avg = next3.reduce((a, b) => a + b, 0) / next3.length;
  const forward = computeForwardSeasonality(seasonality, startMonth, horizon);
  const today = new Date();
  const todayKey = `${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
  const todayIdx = seasonalityPath?.dayKeys?.indexOf(todayKey) ?? -1;
  const todaySeasonal = todayIdx >= 0 ? seasonalityPath?.avgPath?.[todayIdx] : null;
  const todayCurrentYear = todayIdx >= 0 ? seasonalityPath?.currentYearTrace?.values?.[todayIdx] : null;
  const todayDiff = Number.isFinite(todaySeasonal) && Number.isFinite(todayCurrentYear) ? todayCurrentYear - todaySeasonal : null;
  const currentTiming = Array.isArray(dayTiming) ? dayTiming[currentMonth] : null;
  const focusLong = currentTiming?.bestLong;
  const focusShort = currentTiming?.bestShort;
  const turningHigh = seasonalityPath?.highPath?.length
    ? findSeasonalTurningPoints(seasonalityPath.highPath, seasonalityPath.dayKeys || [], seasonalityPath.labels || [], {
        window: 8,
        minSeparation: 14,
        maxEach: 7,
      })
    : { peaks: [], troughs: [] };
  const turningLow = seasonalityPath?.lowPath?.length
    ? findSeasonalTurningPoints(seasonalityPath.lowPath, seasonalityPath.dayKeys || [], seasonalityPath.labels || [], {
        window: 8,
        minSeparation: 14,
        maxEach: 7,
      })
    : { peaks: [], troughs: [] };
  const peaks = turningHigh.peaks;
  const troughs = turningLow.troughs;

  function nextTurning(list) {
    if (!list.length || todayIdx < 0) return list[0] || null;
    const n = seasonalityPath.avgPath.length;
    let best = null;
    let bestDist = Infinity;
    list.forEach((item) => {
      const dist = (item.idx - todayIdx + n) % n;
      if (dist < bestDist) {
        bestDist = dist;
        best = { ...item, daysAhead: dist };
      }
    });
    return best;
  }

  const nextPeak = nextTurning(peaks);
  const nextTrough = nextTurning(troughs);

  const cards = [
    {
      label: "Prossimo massimo (Max)",
      value: nextPeak?.label || "--",
      note: nextPeak
        ? `Tra ~${nextPeak.daysAhead} gg · Max storico ${fmtNum(nextPeak.value, 2)}`
        : "Picchi non rilevati sulla curva Max",
      cls: "up",
    },
    {
      label: "Prossimo minimo (Min)",
      value: nextTrough?.label || "--",
      note: nextTrough
        ? `Tra ~${nextTrough.daysAhead} gg · Min storico ${fmtNum(nextTrough.value, 2)}`
        : "Fondi non rilevati sulla curva Min",
      cls: "down",
    },
    {
      label: "Best month",
      value: `${MONTH_LABELS[bestIdx]} ${seasonality[bestIdx] >= 0 ? "+" : ""}${fmtNum(seasonality[bestIdx], 2)}%`,
      note: "Rendimento medio storico",
      cls: seasonality[bestIdx] >= 0 ? "up" : "down",
    },
    {
      label: "Worst month",
      value: `${MONTH_LABELS[worstIdx]} ${seasonality[worstIdx] >= 0 ? "+" : ""}${fmtNum(seasonality[worstIdx], 2)}%`,
      note: "Rendimento medio storico",
      cls: seasonality[worstIdx] >= 0 ? "up" : "down",
    },
    {
      label: "Positive months ratio",
      value: `${fmtNum(hitRatio, 1)}%`,
      note: `${posCount}/${seasonality.length} mesi con media > 0`,
      cls: hitRatio >= 50 ? "up" : "down",
    },
    {
      label: "Current month edge",
      value: `${MONTH_LABELS[currentMonth]} ${currentEdge >= 0 ? "+" : ""}${fmtNum(currentEdge, 2)}%`,
      note: `Range storico: ${currentRange}`,
      cls: currentEdge >= 0 ? "up" : "down",
    },
    {
      label: `Forward ${horizon}M`,
      value: `${forward >= 0 ? "+" : ""}${fmtNum(forward, 2)}%`,
      note: `Ingresso ${MONTH_LABELS[startMonth]}`,
      cls: forward >= 0 ? "up" : "down",
    },
    {
      label: "Next 3M edge",
      value: `${next3Avg >= 0 ? "+" : ""}${fmtNum(next3Avg, 2)}%`,
      note: "Media stagionale prossimi 3 mesi",
      cls: next3Avg >= 0 ? "up" : "down",
    },
    {
      label: "Oggi vs media stag.",
      value: Number.isFinite(todayDiff) ? `${todayDiff >= 0 ? "+" : ""}${fmtNum(todayDiff, 2)}` : "--",
      note: Number.isFinite(todaySeasonal)
        ? `Media ${fmtNum(todaySeasonal, 2)} | Anno corr. ${fmtNum(todayCurrentYear, 2)}`
        : "Giorno non disponibile nel campione",
      cls: Number.isFinite(todayDiff) ? (todayDiff >= 0 ? "up" : "down") : "",
    },
    {
      label: `Long day ${MONTH_LABELS[currentMonth]}`,
      value: focusLong?.samples > 0 ? `Giorno ${focusLong.day}` : "Campione insufficiente",
      note: focusLong?.samples > 0
        ? `Avg ${(focusLong.avg >= 0 ? "+" : "")}${fmtNum(focusLong.avg * 100, 2)}% | Up ${fmtNum(focusLong.upRate * 100, 0)}% | n=${focusLong.samples}`
        : "Serve piu storico prezzi nella finestra",
      cls: "up",
    },
    {
      label: `Short day ${MONTH_LABELS[currentMonth]}`,
      value: focusShort?.samples > 0 ? `Giorno ${focusShort.day}` : "Campione insufficiente",
      note: focusShort?.samples > 0
        ? `Avg ${(focusShort.avg >= 0 ? "+" : "")}${fmtNum(focusShort.avg * 100, 2)}% | Down ${fmtNum(focusShort.downRate * 100, 0)}% | n=${focusShort.samples}`
        : "Serve piu storico prezzi nella finestra",
      cls: "down",
    },
  ];

  seasonalityInsightCardsEl.innerHTML = cards
    .map(
      (card) => `<div class="seasonality-insight-card">
      <div class="label">${card.label}</div>
      <div class="value ${card.cls}">${card.value}</div>
      <div class="note">${card.note}</div>
    </div>`
    )
    .join("");
}

function upsertCategoryChart(stateKey, canvasId, label, color, categorySeries, metric = "netPctOi", lookback = 52) {
  if (!state.chartingAvailable || typeof Chart === "undefined") return;
  const labels = categorySeries.map((r) => r.date.toISOString().slice(5, 10));
  const netPctSeries = categorySeries.map((r) => (r.net / r.oi) * 100);
  const cotIndexSeries = buildCotIndexSeries(categorySeries, lookback);
  const metricSeries = metric === "cotIndex" ? cotIndexSeries : netPctSeries;
  const metricLabel = metric === "cotIndex" ? `${label} COT Index (${lookback}w)` : `${label} Net %OI`;
  const yTickFormatter = metric === "cotIndex" ? (v) => `${fmtNum(v, 0)}` : (v) => `${v}%`;

  const datasets = [
    {
      type: "line",
      label: metricLabel,
      data: metricSeries,
      borderColor: color,
      backgroundColor:
        color === "#3d7cff"
          ? "rgba(61,124,255,0.14)"
          : color === "#ff4f64"
            ? "rgba(255,79,100,0.14)"
            : color === "#4bc87a"
              ? "rgba(75,200,122,0.14)"
              : "rgba(49,167,176,0.12)",
      borderWidth: metric === "cotIndex" ? 2.5 : 2.2,
      tension: metric === "cotIndex" ? 0.24 : 0.2,
      pointRadius: metric === "cotIndex" ? 0 : 1.8,
      pointBackgroundColor: color,
      fill: true,
    },
  ];

  if (metric === "cotIndex") {
    const fastMa = buildSmaSeries(metricSeries, 4);
    const slowMa = buildSmaSeries(metricSeries, 12);
    datasets.push(
      {
        type: "line",
        label: "MA Fast (4w)",
        data: fastMa,
        borderColor: "rgba(121, 200, 160, 0.95)",
        pointRadius: 0,
        borderWidth: 1.6,
        tension: 0.22,
      },
      {
        type: "line",
        label: "MA Slow (12w)",
        data: slowMa,
        borderColor: "rgba(95, 156, 224, 0.9)",
        pointRadius: 0,
        borderWidth: 1.6,
        tension: 0.22,
      },
      {
        type: "line",
        label: "Midline (50)",
        data: metricSeries.map(() => 50),
        borderColor: "rgba(196, 205, 217, 0.45)",
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1.1,
      },
      {
        type: "line",
        label: "Overbought (80)",
        data: metricSeries.map(() => 80),
        borderColor: "rgba(211, 134, 86, 0.7)",
        borderDash: [5, 4],
        pointRadius: 0,
        borderWidth: 1.2,
      },
      {
        type: "line",
        label: "Oversold (20)",
        data: metricSeries.map(() => 20),
        borderColor: "rgba(121, 200, 160, 0.7)",
        borderDash: [5, 4],
        pointRadius: 0,
        borderWidth: 1.2,
      }
    );
  }

  if (state[stateKey]) state[stateKey].destroy();
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  state[stateKey] = new Chart(canvas, {
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#ecf5ff", boxWidth: 10 } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const row = categorySeries[ctx.dataIndex];
              if (!row) return `${ctx.dataset.label}: ${fmtNum(ctx.raw, 2)}`;
              const side = row.long >= row.short ? "Long dominante" : "Short dominante";
              const netPct = row.oi > 0 ? (row.net / row.oi) * 100 : 0;
              if (
                ctx.dataset.label.includes("(80)") ||
                ctx.dataset.label.includes("(20)") ||
                ctx.dataset.label.includes("(50)")
              ) {
                return `${ctx.dataset.label}`;
              }
              return `${ctx.dataset.label}: ${fmtNum(ctx.raw, 2)}${metric === "cotIndex" ? "" : "%"} | Net%OI: ${fmtNum(netPct, 2)}% | ${side} | L:${fmtInt(row.long)} S:${fmtInt(row.short)} N:${fmtInt(row.net)}`;
            },
          },
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
            modifierKey: null,
          },
        },
      },
      scales: {
        x: { ticks: { color: "#9fb8cc" }, grid: { color: "rgba(61,102,139,0.32)" } },
        y: {
          ticks: { color: "#9fb8cc", callback: yTickFormatter },
          grid: { color: "rgba(61,102,139,0.32)" },
          min: metric === "cotIndex" ? 0 : undefined,
          max: metric === "cotIndex" ? 100 : undefined,
        },
      },
    },
  });
  canvas?.addEventListener("dblclick", () => state[stateKey]?.resetZoom?.());
  bindLeftMousePan(canvas, () => state[stateKey]);
}

function upsertSupremeCotChart(filteredCot, selectedCategory = "nonCommercial") {
  if (!state.chartingAvailable || typeof Chart === "undefined") return;
  const canvas = document.getElementById("cotFocusChart");
  if (!canvas) return;
  const labels = filteredCot.map((r) => r.date.toISOString().slice(0, 10));
  const map = {
    commercial: { label: "Commercials", color: "#3d7cff", getter: (r) => r.commercialNet },
    nonCommercial: { label: "Non-Commercials", color: "#ff4f64", getter: (r) => r.nonCommercialNet },
    retail: { label: "Retail Traders", color: "#4bc87a", getter: (r) => r.retailNet },
  };
  const selected = map[selectedCategory] || map.nonCommercial;
  const series = filteredCot.map((r) => selected.getter(r));
  const zeroLine = series.map(() => 0);
  const rightSideLabelPlugin = {
    id: "supremeRightSideLabelSingle",
    afterDatasetsDraw(chart) {
      const { ctx, chartArea } = chart;
      const last = series[series.length - 1];
      if (!Number.isFinite(last)) return;
      const yScale = chart.scales?.y;
      if (!yScale) return;
      const yRaw = yScale.getPixelForValue(last);
      const y = Math.max(chartArea.top + 10, Math.min(chartArea.bottom - 10, yRaw));
      const x = chartArea.right + 8;
      const txt = `${selected.label}: ${last >= 0 ? "+" : ""}${fmtInt(last)}`;
      ctx.save();
      ctx.font = "12px Inter, Segoe UI, Arial";
      ctx.textBaseline = "middle";
      const w = ctx.measureText(txt).width + 10;
      ctx.fillStyle = "rgba(9,12,16,0.92)";
      ctx.strokeStyle = selected.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 8, w, 16, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = selected.color;
      ctx.fillText(txt, x + 1, y);
      ctx.restore();
    },
  };

  if (state.cotFocusedChart) state.cotFocusedChart.destroy();
  state.cotFocusedChart = new Chart(canvas, {
    plugins: [rightSideLabelPlugin],
    data: {
      labels,
      datasets: [
        {
          type: "line",
          label: selected.label,
          data: series,
          borderColor: selected.color,
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0,
          stepped: true,
          clip: false,
        },
        {
          type: "line",
          label: "Zero",
          data: zeroLine,
          borderColor: "rgba(20,20,20,0.85)",
          borderWidth: 1.2,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
          tension: 0,
          clip: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: "#ecf5ff", boxWidth: 10 } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.dataset.label === "Zero") return `${ctx.dataset.label}: ${fmtInt(ctx.raw)}`;
              const row = filteredCot[ctx.dataIndex];
              if (!row) return `${ctx.dataset.label}: ${fmtInt(ctx.raw)}`;
              return `${ctx.dataset.label}: ${fmtInt(ctx.raw)} | OI: ${fmtInt(row.oi)} | ${row.date.toISOString().slice(0, 10)}`;
            },
          },
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
            modifierKey: null,
          },
        },
      },
      scales: {
        x: { ticks: { color: "#9fb8cc" }, grid: { color: "rgba(61,102,139,0.28)" } },
        y: {
          ticks: { color: "#9fb8cc", callback: (v) => fmtInt(v) },
          grid: { color: "rgba(61,102,139,0.28)" },
        },
      },
    },
  });
  canvas?.addEventListener("dblclick", () => state.cotFocusedChart?.resetZoom?.());
  bindLeftMousePan(canvas, () => state.cotFocusedChart);
}

function updateFocusedCotChart(filteredCot) {
  if (state.cotMetric === "tvLegacyNet") {
    const fullCot = Array.isArray(state.cotData) && state.cotData.length ? state.cotData : filteredCot;
    upsertSupremeCotChart(fullCot, state.cotChartCategory);
    return;
  }
  const map = {
    commercial: { label: "Commercial", color: "#3d7cff", category: "commercial" },
    nonCommercial: { label: "Non-Commercial", color: "#ff4f64", category: "nonCommercial" },
    retail: { label: "Retail", color: "#4bc87a", category: "retail" },
  };
  const selected = map[state.cotChartCategory] || map.nonCommercial;
  upsertCategoryChart(
    "cotFocusedChart",
    "cotFocusChart",
    selected.label,
    selected.color,
    buildCategorySeries(filteredCot, selected.category),
    state.cotMetric,
    state.cotLookback
  );
}

function updateSeasonalityChart(seasonality, seasonalityStats, seasonalityPath) {
  if (state.seasonalityChart) state.seasonalityChart.destroy();
  const canvas = document.getElementById("seasonalityChart");
  if (!canvas) return;
  const chartTitleEl = document.getElementById("seasonalityChartTitle");

  if (!state.chartingAvailable || typeof Chart === "undefined") {
    canvas.style.display = "none";
    if (chartTitleEl) chartTitleEl.textContent = "Stagionalita media mensile";
    if (seasonalityNumbersEl) {
      seasonalityNumbersEl.style.display = "grid";
      seasonalityNumbersEl.innerHTML = MONTH_LABELS.map((month, idx) => {
        const avg = seasonality[idx] || 0;
        const st = seasonalityStats[idx];
        const cls = avg >= 0 ? "up" : "down";
        const min = st ? fmtNum(st.low, 2) : "--";
        const max = st ? fmtNum(st.high, 2) : "--";
        return `<div class="seasonality-number-card">
          <div class="month">${month}</div>
          <div class="value ${cls}">${avg >= 0 ? "+" : ""}${fmtNum(avg, 2)}%</div>
          <div class="range">min/max: ${min}% / ${max}%</div>
        </div>`;
      }).join("");
    }
    return;
  }

  if (state.seasonalityMode === "numbers") {
    canvas.style.display = "none";
    if (chartTitleEl) chartTitleEl.textContent = "Stagionalita media mensile";
    if (seasonalityNumbersEl) {
      seasonalityNumbersEl.style.display = "grid";
      seasonalityNumbersEl.innerHTML = MONTH_LABELS.map((month, idx) => {
        const avg = seasonality[idx] || 0;
        const st = seasonalityStats[idx];
        const cls = avg >= 0 ? "up" : "down";
        const min = st ? fmtNum(st.low, 2) : "--";
        const max = st ? fmtNum(st.high, 2) : "--";
        return `<div class="seasonality-number-card">
          <div class="month">${month}</div>
          <div class="value ${cls}">${avg >= 0 ? "+" : ""}${fmtNum(avg, 2)}%</div>
          <div class="range">min/max: ${min}% / ${max}%</div>
        </div>`;
      }).join("");
    }
    return;
  }

  canvas.style.display = "block";
  if (seasonalityNumbersEl) {
    seasonalityNumbersEl.style.display = "none";
    seasonalityNumbersEl.innerHTML = "";
  }

  if (state.seasonalityMode === "line") {
    // Price action stagionale: Max sopra media, Min sotto media (dati reali MM-DD).
    const usePath = (seasonalityPath?.avgPath?.length || 0) >= 2;
    const lineLabels = usePath ? seasonalityPath.labels : [];
    const avgPath = usePath ? seasonalityPath.avgPath || [] : [];
    const highPath = usePath ? seasonalityPath.highPath || [] : [];
    const lowPath = usePath ? seasonalityPath.lowPath || [] : [];
    const yIsIndex = usePath;
    const dayKeys = usePath ? seasonalityPath.dayKeys || [] : [];
    const currentYearTrace = usePath ? seasonalityPath.currentYearTrace : null;

    const peakTurning = usePath && highPath.length
      ? findSeasonalTurningPoints(highPath, dayKeys, lineLabels, { window: 8, minSeparation: 14, maxEach: 7 })
      : { peaks: [], troughs: [] };
    const troughTurning = usePath && lowPath.length
      ? findSeasonalTurningPoints(lowPath, dayKeys, lineLabels, { window: 8, minSeparation: 14, maxEach: 7 })
      : { peaks: [], troughs: [] };

    // Massimi = picchi della curva MAX (sopra la media); minimi = fondi della curva MIN (sotto la media).
    const peaks = peakTurning.peaks
      .map((p) => ({
        ...p,
        avg: avgPath[p.idx],
        stretch: Number.isFinite(avgPath[p.idx]) ? p.value - avgPath[p.idx] : 0,
      }))
      .filter((p) => !Number.isFinite(p.avg) || p.value >= p.avg);
    const troughs = troughTurning.troughs
      .map((t) => ({
        ...t,
        avg: avgPath[t.idx],
        stretch: Number.isFinite(avgPath[t.idx]) ? avgPath[t.idx] - t.value : 0,
      }))
      .filter((t) => !Number.isFinite(t.avg) || t.value <= t.avg);

    if (chartTitleEl) {
      chartTitleEl.textContent = usePath
        ? `Price action stagionale · Max/Media/Min giornalieri`
        : "Stagionalita giornaliera";
    }

    const peakSeries = Array.from({ length: lineLabels.length }, () => null);
    const troughSeries = Array.from({ length: lineLabels.length }, () => null);
    peaks.forEach((p) => {
      peakSeries[p.idx] = p.value;
    });
    troughs.forEach((t) => {
      troughSeries[t.idx] = t.value;
    });

    const datasets = [];

    if (usePath && highPath.length && lowPath.length) {
      datasets.push(
        {
          label: "Max storico",
          data: highPath,
          borderColor: "rgba(61, 214, 140, 0.95)",
          backgroundColor: "rgba(61, 214, 140, 0.0)",
          borderWidth: 1.8,
          pointRadius: 0,
          fill: false,
          tension: 0.05,
          order: 4,
        },
        {
          label: "Range Max-Min",
          data: lowPath,
          borderColor: "rgba(227, 138, 90, 0.0)",
          backgroundColor: "rgba(95, 140, 175, 0.14)",
          borderWidth: 0,
          pointRadius: 0,
          fill: "-1",
          tension: 0.05,
          order: 5,
        },
        {
          label: "Min storico",
          data: lowPath,
          borderColor: "rgba(227, 138, 90, 0.95)",
          backgroundColor: "rgba(227, 138, 90, 0.0)",
          borderWidth: 1.8,
          pointRadius: 0,
          fill: false,
          tension: 0.05,
          order: 4,
        }
      );
    }

    if (usePath) {
      datasets.push({
        label: "Media",
        data: avgPath,
        borderColor: "#dceaf7",
        backgroundColor: "rgba(220,234,247,0.08)",
        borderWidth: 2.2,
        pointRadius: 0,
        fill: false,
        tension: 0.05,
        order: 3,
      });
    }

    if (usePath && currentYearTrace?.values?.length && state.seasonalityTraceMode !== "none") {
      datasets.push({
        label: `Anno corrente ${currentYearTrace.year}`,
        data: currentYearTrace.values,
        borderColor: "rgba(247, 211, 139, 0.9)",
        pointRadius: 0,
        borderWidth: 1.6,
        borderDash: [5, 4],
        fill: false,
        tension: 0.05,
        order: 2,
      });
    }

    if (usePath && peaks.length) {
      datasets.push({
        label: "Picchi di rialzo (Max > Media)",
        data: peakSeries,
        borderColor: "rgba(0,0,0,0)",
        backgroundColor: "#3dd68c",
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: "triangle",
        pointRotation: 0,
        borderWidth: 0,
        showLine: false,
        order: 1,
      });
    }

    if (usePath && troughs.length) {
      datasets.push({
        label: "Fondi di ribasso (Min < Media)",
        data: troughSeries,
        borderColor: "rgba(0,0,0,0)",
        backgroundColor: "#e38a5a",
        pointRadius: 6,
        pointHoverRadius: 8,
        pointStyle: "triangle",
        pointRotation: 180,
        borderWidth: 0,
        showLine: false,
        order: 1,
      });
    }

    if (usePath && dayKeys.length) {
      const today = new Date();
      const todayKey = `${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
      const todayIdx = dayKeys.indexOf(todayKey);
      if (todayIdx >= 0 && Number.isFinite(avgPath[todayIdx])) {
        const markerToday = Array.from({ length: lineLabels.length }, (_, idx) => (idx === todayIdx ? avgPath[todayIdx] : null));
        datasets.push({
          label: "Oggi",
          data: markerToday,
          borderColor: "rgba(0,0,0,0)",
          backgroundColor: "#f7d38b",
          pointRadius: 5,
          pointHoverRadius: 6.5,
          borderWidth: 0,
          showLine: false,
          order: 0,
        });
      }
    }

    const peakByIdx = new Map(peaks.map((p) => [p.idx, p]));
    const troughByIdx = new Map(troughs.map((t) => [t.idx, t]));

    state.seasonalityChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: lineLabels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            labels: {
              color: "#ecf5ff",
              usePointStyle: true,
              filter: (item) => item.text !== "Range Max-Min",
            },
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const idx = items?.[0]?.dataIndex;
                const label = lineLabels[idx];
                return typeof label === "string" ? label : "";
              },
              label: (ctx) => {
                const i = ctx.dataIndex;
                const name = ctx.dataset.label;
                if (name === "Range Max-Min") return null;
                if (name === "Picchi di rialzo (Max > Media)") {
                  const peak = peakByIdx.get(i);
                  if (!peak) return null;
                  return `Picco Max ${fmtNum(peak.value, 2)} (+${fmtNum(peak.stretch, 2)} sopra media)`;
                }
                if (name === "Fondi di ribasso (Min < Media)") {
                  const trough = troughByIdx.get(i);
                  if (!trough) return null;
                  return `Fondo Min ${fmtNum(trough.value, 2)} (-${fmtNum(trough.stretch, 2)} sotto media)`;
                }
                if (name === "Max storico") return `Max storico: ${fmtNum(ctx.raw, 2)}`;
                if (name === "Min storico") return `Min storico: ${fmtNum(ctx.raw, 2)}`;
                if (name === "Media") {
                  const hi = highPath[i];
                  const lo = lowPath[i];
                  const up = Number.isFinite(hi) ? hi - ctx.raw : null;
                  const down = Number.isFinite(lo) ? ctx.raw - lo : null;
                  return `Media ${fmtNum(ctx.raw, 2)} | range +${fmtNum(up, 2)} / -${fmtNum(down, 2)}`;
                }
                if (name === "Oggi") return `Oggi (media): ${fmtNum(ctx.raw, 2)}`;
                return `${name}: ${fmtNum(ctx.raw, 2)}`;
              },
              afterBody: (items) => {
                const i = items?.[0]?.dataIndex;
                if (!Number.isFinite(i)) return [];
                if (peakByIdx.has(i)) return ["Zona di estensione rialzista storica (Max sopra Media)"];
                if (troughByIdx.has(i)) return ["Zona di estensione ribassista storica (Min sotto Media)"];
                const a = avgPath[i];
                const h = highPath[i];
                const l = lowPath[i];
                if (Number.isFinite(a) && Number.isFinite(h) && Number.isFinite(l)) {
                  if (h - a > a - l) return ["Bias range: estensione verso l'alto"];
                  if (a - l > h - a) return ["Bias range: estensione verso il basso"];
                }
                return [];
              },
            },
          },
          zoom: {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "x",
            },
            pan: {
              enabled: true,
              mode: "x",
              modifierKey: null,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#9fb8cc",
              autoSkip: true,
              maxTicksLimit: usePath ? 72 : 12,
              maxRotation: 0,
              minRotation: 0,
              callback: (value, idx) => {
                const label = lineLabels[idx];
                if (!usePath || typeof label !== "string") return label;
                const [dayRaw, monthRaw] = label.split(" ");
                const day = Number(dayRaw);
                if (day === 1) return monthRaw;
                return dayRaw;
              },
            },
            grid: {
              color: (ctx) => {
                if (!usePath) return "rgba(61,102,139,0.32)";
                const label = lineLabels[ctx.index];
                if (typeof label !== "string") return "rgba(61,102,139,0.32)";
                const [dayRaw] = label.split(" ");
                return Number(dayRaw) === 1 ? "rgba(122,163,201,0.48)" : "rgba(61,102,139,0.18)";
              },
            },
          },
          y: {
            ticks: {
              color: "#9fb8cc",
              callback: (v) => (yIsIndex ? `${fmtNum(v, 1)}` : `${v}%`),
            },
            grid: { color: "rgba(61,102,139,0.32)" },
          },
        },
      },
    });
    canvas?.addEventListener("dblclick", () => state.seasonalityChart?.resetZoom?.());
    return;
  }

  if (chartTitleEl) chartTitleEl.textContent = "Stagionalita media mensile";

  // Modalita candlestick sintetica (range min/max + body Q1/Q3 + mediana).
  state.seasonalityChart = new Chart(canvas, {
    data: {
      labels: MONTH_LABELS,
      datasets: [
        {
          type: "bar",
          label: "Range Min/Max %",
          data: seasonalityStats.map((s) => [s.low, s.high]),
          backgroundColor: "rgba(156,179,201,0.25)",
          borderColor: "rgba(156,179,201,0.55)",
          borderWidth: 1,
          barThickness: 8,
        },
        {
          type: "bar",
          label: "Body Q1/Q3 %",
          data: seasonalityStats.map((s) => [s.q1, s.q3]),
          backgroundColor: seasonalityStats.map((s) => (s.median >= 0 ? "rgba(47,182,178,0.6)" : "rgba(227,138,90,0.6)")),
          borderColor: seasonalityStats.map((s) => (s.median >= 0 ? "#2fb6b2" : "#e38a5a")),
          borderWidth: 1.3,
          barThickness: 18,
        },
        {
          type: "line",
          label: "Mediana %",
          data: seasonalityStats.map((s) => s.median),
          borderColor: "#d3ad67",
          backgroundColor: "#d3ad67",
          borderWidth: 2,
          pointRadius: 2,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#ecf5ff" } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (Array.isArray(ctx.raw) && ctx.raw.length === 2) {
                return `${ctx.dataset.label}: ${fmtNum(ctx.raw[0], 2)}% -> ${fmtNum(ctx.raw[1], 2)}%`;
              }
              return `${ctx.dataset.label}: ${fmtNum(ctx.raw, 2)}%`;
            },
          },
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
            modifierKey: null,
          },
        },
      },
      scales: {
        x: { ticks: { color: "#9fb8cc" }, grid: { color: "rgba(61,102,139,0.32)" } },
        y: {
          ticks: { color: "#9fb8cc", callback: (v) => `${v}%` },
          grid: { color: "rgba(61,102,139,0.32)" },
        },
      },
    },
  });
  canvas?.addEventListener("dblclick", () => state.seasonalityChart?.resetZoom?.());
}

function renderWeeklyFlowsTable(filteredCot) {
  const commercialSeries = buildCategorySeries(filteredCot, "commercial");
  const nonCommercialSeries = buildCategorySeries(filteredCot, "nonCommercial");
  const retailSeries = buildCategorySeries(filteredCot, "retail");
  const commercialFlows = computeWeeklyFlow(commercialSeries);
  const nonCommercialFlows = computeWeeklyFlow(nonCommercialSeries);
  const retailFlows = computeWeeklyFlow(retailSeries);

  const rows = filteredCot.slice(-12).map((row, idx, arr) => {
    const absoluteIndex = filteredCot.length - arr.length + idx;
    const c = commercialFlows[absoluteIndex];
    const nc = nonCommercialFlows[absoluteIndex];
    const rt = retailFlows[absoluteIndex];
    const dateLabel = row.date.toISOString().slice(0, 10);

    return `<tr>
      <td>${dateLabel}</td>
      <td>${fmtInt(c.opened)} / ${fmtInt(c.closed)}</td>
      <td>${fmtNum(c.openedPctOi, 2)}% / ${fmtNum(c.closedPctOi, 2)}%</td>
      <td>${fmtInt(nc.opened)} / ${fmtInt(nc.closed)}</td>
      <td>${fmtNum(nc.openedPctOi, 2)}% / ${fmtNum(nc.closedPctOi, 2)}%</td>
      <td>${fmtInt(rt.opened)} / ${fmtInt(rt.closed)}</td>
      <td>${fmtNum(rt.openedPctOi, 2)}% / ${fmtNum(rt.closedPctOi, 2)}%</td>
    </tr>`;
  });

  weeklyFlowRowsEl.innerHTML = rows.join("");
}

function ensureResizeObservers() {
  if (state.resizeObserversReady || typeof ResizeObserver === "undefined") return;

  const mappings = [
    ["panelCotFocus", () => state.cotFocusedChart],
    ["panelSeasonality", () => state.seasonalityChart],
  ];

  mappings.forEach(([panelId, getChart]) => {
    const el = document.getElementById(panelId);
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const chart = getChart();
      if (chart) chart.resize();
    });
    ro.observe(el);
  });

  state.resizeObserversReady = true;
}

function renderDashboard() {
  const hasPrice = Array.isArray(state.priceData?.prices) && state.priceData.prices.length > 0;
  const hasCot = Array.isArray(state.cotData) && state.cotData.length > 0;
  if (!hasPrice && !hasCot) {
    setText("spotPrice", "--");
    setText("spotChange", "--");
    setText("vol30", "--");
    setText("range52", "--");
    setText("cotNonCommNet", "--");
    setText("cotNonCommPct", "Net: --");
    setText("cotCommercialNet", "--");
    setText("cotCommercialPct", "Net: --");
    setText("cotRetailNet", "--");
    setText("cotRetailPct", "Net: --");
    setText("cotDate", "--");
    setText("cotOi", "--");
    setText("cotCommercialTriplet", "--");
    setText("cotNonCommTriplet", "--");
    setText("cotRetailTriplet", "--");
    setText("cotAdded1w", "--");
    setText("cotRemoved1w", "--");
    setText("cotNetAbs", "--");
    setText("cotDelta4", "--");
    setText("cotRegimeValue", "--");
    setText("cotRegimeHint", "--");
    setText("cotIndexValue", "--");
    setText("cotIndexHint", "--");
    setText("oiMomentum4w", "--");
    setText("oiMomentumHint", "Variazione open interest");
    setText("cotCrowdingSignal", "--");
    setText("cotDivergenceSignal", "--");
    setText("biasScore", "--");
    setText("biasConfidence", "Confidence --");
    setText("biasState", "--");
    setText("biasDrivers", "Driver: --");
    setText("playbookTitle", "--");
    setText("playbookText", "--");
    setText("dataQualityScore", "--");
    setText("dataQualityText", "--");
    setText("scenarioProb", "--");
    setText("scenarioProbText", "--");
    setText("biasContribMain", "--");
    setText("biasContribText", "--");
    setText("execSide", "--");
    setText("execEntry", "--");
    setText("execInvalidation", "--");
    setText("execTargets", "--");
    setText("execRiskSize", "--");
    setText("execLeverage", "--");
    setText("execNote", "--");
    setText("sessionName", "--");
    setText("sessionBias", "--");
    setText("sessionVol", "--");
    setText("sessionNext", "--");
    setText("sessionClock", "--");
    setText("riskAtr", "--");
    setText("riskDailyMove", "--");
    setText("riskRegime", "--");
    setText("riskStop", "--");
    setText("riskSuggestion", "--");
    setText("keyPivot", "--");
    setText("keySupports", "--");
    setText("keyResistances", "--");
    setText("keyTrend", "--");
    setText("replayTs", "--");
    setText("replayBias", "--");
    setText("replayScenario", "--");
    setText("replayQuality", "--");
    if (seasonalityWindowInfoEl) seasonalityWindowInfoEl.textContent = "In attesa di dati reali dai feed...";
    if (weeklyFlowRowsEl) weeklyFlowRowsEl.innerHTML = "";
    if (seasonalityInsightCardsEl) seasonalityInsightCardsEl.innerHTML = "";
    if (seasonalityRankRowsEl) seasonalityRankRowsEl.innerHTML = "";
    clearBacktest();
    renderAlertFeed();
    renderSignalHistory();
    renderSourceHealth();
    renderReplaySnapshot();
    renderSignalJournal();
    renderMacroCalendar();
    statusEl.textContent = "In attesa di dati live reali...";
    return;
  }

  const filteredPrices = hasPrice ? getFilteredPrices(state.priceData.prices, state.timeframe) : [];
  const filteredCot = hasCot ? getFilteredCot(state.cotData, state.timeframe) : [];
  const pricesForAnalytics = filteredPrices.length >= 3 ? filteredPrices : (hasPrice ? state.priceData.prices : []);
  const enoughPrice = pricesForAnalytics.length >= 3;
  const enoughCot = filteredCot.length >= 2;

  if (enoughPrice) {
    const last = pricesForAnalytics[pricesForAnalytics.length - 1].close;
    const prev = pricesForAnalytics[pricesForAnalytics.length - 2].close;
    const tvSnap = state.marketSnapshot;
    const spotLive = Number(tvSnap?.price ?? tvSnap?.close);
    const spot = Number.isFinite(spotLive) && spotLive > 0 ? spotLive : last;
    const computedChange = ((last / prev) - 1) * 100;
    const chg = Number.isFinite(tvSnap?.changePct) ? tvSnap.changePct : computedChange;
    const chgClass = chg >= 0 ? "up" : "down";
    const rangeWindow = pricesForAnalytics.map((p) => p.close);
    const hiTv = Number(tvSnap?.high52w);
    const loTv = Number(tvSnap?.low52w);
    const hi = Number.isFinite(hiTv) && hiTv > 0 ? hiTv : Math.max(...rangeWindow);
    const lo = Number.isFinite(loTv) && loTv > 0 ? loTv : Math.min(...rangeWindow);
    const vol = realizedVol(pricesForAnalytics, Math.min(30, pricesForAnalytics.length - 1)) * 100;
    state.latestSpot = spot;
    state.latestVolPct = vol;

    setText("spotPrice", `$ ${fmtNum(spot, 2)}`);
    const changeText = Number.isFinite(tvSnap?.changeAbs)
      ? `${chg >= 0 ? "+" : ""}${fmtNum(chg, 2)}% (${tvSnap.changeAbs >= 0 ? "+" : ""}${fmtNum(tvSnap.changeAbs, 2)})`
      : `${chg >= 0 ? "+" : ""}${fmtNum(chg, 2)}% (ultima sessione)`;
    setText("spotChange", changeText, chgClass);
    setText("vol30", `${fmtNum(vol, 2)}%`);
    setText("range52", `$ ${fmtNum(hi, 2)} / $ ${fmtNum(lo, 2)}`);

    try {
      const payload = buildSeasonalityPayloadFromPrices(state.priceData.prices, state.seasonalityYears);
      renderSeasonalitySection(payload, state.priceData?.source || "");
    } catch {
      clearSeasonalitySection("Stagionalita non calcolabile: attendi prezzi storici reali");
    }
  } else {
    setText("spotPrice", "--");
    setText("spotChange", "--");
    setText("vol30", "--");
    setText("range52", "--");
    clearSeasonalitySection("In attesa di prezzi reali per calcolare stagionalita e timing giorni");
  }

  if (enoughPrice) {
    const sessionCtx = computeSessionContext(pricesForAnalytics);
    setText("sessionName", sessionCtx.sessionName);
    setText("sessionBias", `${sessionCtx.bias} (${safePct(sessionCtx.meanRet)})`, sessionCtx.cls);
    setText("sessionVol", safePct(sessionCtx.meanAbs));
    setText("sessionNext", sessionCtx.nextSession);
    setText("sessionClock", sessionCtx.clock);

    const risk = computeRiskOverlay(pricesForAnalytics, state.latestSpot, state.userProfile);
    if (risk) {
      setText("riskAtr", `$ ${fmtNum(risk.atr, 2)}`);
      setText("riskDailyMove", safePct(risk.dailyMovePct));
      setText("riskRegime", risk.regime, risk.cls);
      setText("riskStop", `$ ${fmtNum(risk.stopDist, 2)} (~1.15x ATR)`);
      setText("riskSuggestion", `${fmtNum(risk.sizePct, 2)}% capitale`, risk.cls);
    } else {
      setText("riskAtr", "--");
      setText("riskDailyMove", "--");
      setText("riskRegime", "--");
      setText("riskStop", "--");
      setText("riskSuggestion", "--");
    }

    const levels = computeKeyLevels(pricesForAnalytics, state.latestSpot);
    if (levels) {
      setText("keyPivot", `$ ${fmtNum(levels.pivot, 2)}`);
      setText("keySupports", `S1 $${fmtNum(levels.s1, 2)} | S2 $${fmtNum(levels.s2, 2)}`);
      setText("keyResistances", `R1 $${fmtNum(levels.r1, 2)} | R2 $${fmtNum(levels.r2, 2)}`);
      setText("keyTrend", levels.trend, levels.trendCls);
    } else {
      setText("keyPivot", "--");
      setText("keySupports", "--");
      setText("keyResistances", "--");
      setText("keyTrend", "--");
    }
  } else {
    setText("sessionName", "--");
    setText("sessionBias", "--");
    setText("sessionVol", "--");
    setText("sessionNext", "--");
    setText("sessionClock", "--");
    setText("riskAtr", "--");
    setText("riskDailyMove", "--");
    setText("riskRegime", "--");
    setText("riskStop", "--");
    setText("riskSuggestion", "--");
    setText("keyPivot", "--");
    setText("keySupports", "--");
    setText("keyResistances", "--");
    setText("keyTrend", "--");
  }

  if (enoughCot) {
    const latestCot = state.cotData[state.cotData.length - 1];
    const fourWeeksAgo = state.cotData[state.cotData.length - 5] || state.cotData[0];
    const nonCommercialPctOi = (latestCot.nonCommercialNet / latestCot.oi) * 100;
    const commercialPctOi = (latestCot.commercialNet / latestCot.oi) * 100;
    const retailPctOi = (latestCot.retailNet / latestCot.oi) * 100;
    const delta4 = latestCot.nonCommercialNet - fourWeeksAgo.nonCommercialNet;
    const delta4Pct = ((latestCot.nonCommercialNet / latestCot.oi) - (fourWeeksAgo.nonCommercialNet / fourWeeksAgo.oi)) * 100;

    setText("cotNonCommNet", `${nonCommercialPctOi >= 0 ? "+" : ""}${fmtNum(nonCommercialPctOi, 2)}%`, nonCommercialPctOi >= 0 ? "up" : "down");
    setText("cotNonCommPct", `Net: ${fmtInt(latestCot.nonCommercialNet)} contratti`, latestCot.nonCommercialNet >= 0 ? "up" : "down");
    setText("cotCommercialNet", `${commercialPctOi >= 0 ? "+" : ""}${fmtNum(commercialPctOi, 2)}%`, commercialPctOi >= 0 ? "up" : "down");
    setText("cotCommercialPct", `Net: ${fmtInt(latestCot.commercialNet)} contratti`, latestCot.commercialNet >= 0 ? "up" : "down");
    setText("cotRetailNet", `${retailPctOi >= 0 ? "+" : ""}${fmtNum(retailPctOi, 2)}%`, retailPctOi >= 0 ? "up" : "down");
    setText("cotRetailPct", `Net: ${fmtInt(latestCot.retailNet)} contratti`, latestCot.retailNet >= 0 ? "up" : "down");
    setText("cotDate", latestCot.date.toISOString().slice(0, 10));
    setText("cotOi", fmtInt(latestCot.oi));
    setText("cotCommercialTriplet", `${fmtInt(latestCot.commercialLong)} / ${fmtInt(latestCot.commercialShort)} / ${fmtInt(latestCot.commercialNet)}`, latestCot.commercialNet >= 0 ? "up" : "down");
    setText("cotNonCommTriplet", `${fmtInt(latestCot.nonCommercialLong)} / ${fmtInt(latestCot.nonCommercialShort)} / ${fmtInt(latestCot.nonCommercialNet)}`, latestCot.nonCommercialNet >= 0 ? "up" : "down");
    setText("cotRetailTriplet", `${fmtInt(latestCot.retailLong)} / ${fmtInt(latestCot.retailShort)} / ${fmtInt(latestCot.retailNet)}`, latestCot.retailNet >= 0 ? "up" : "down");
    const prevCot = state.cotData[state.cotData.length - 2] || state.cotData[0];
    const catMap = {
      commercial: { longKey: "commercialLong", shortKey: "commercialShort", netKey: "commercialNet" },
      nonCommercial: { longKey: "nonCommercialLong", shortKey: "nonCommercialShort", netKey: "nonCommercialNet" },
      retail: { longKey: "retailLong", shortKey: "retailShort", netKey: "retailNet" },
    };
    const selectedCat = catMap[state.cotChartCategory] || catMap.nonCommercial;
    const latestLongSel = Number(latestCot[selectedCat.longKey]) || 0;
    const latestShortSel = Number(latestCot[selectedCat.shortKey]) || 0;
    const prevLongSel = Number(prevCot?.[selectedCat.longKey]) || 0;
    const prevShortSel = Number(prevCot?.[selectedCat.shortKey]) || 0;
    const deltaLongSel = latestLongSel - prevLongSel;
    const deltaShortSel = latestShortSel - prevShortSel;
    const openedSel = Math.max(deltaLongSel, 0) + Math.max(deltaShortSel, 0);
    const closedSel = Math.max(-deltaLongSel, 0) + Math.max(-deltaShortSel, 0);
    const netAbsSel = Math.abs(Number(latestCot[selectedCat.netKey]) || 0);
    const netSelSign = Number(latestCot[selectedCat.netKey]) || 0;
    setText("cotAdded1w", fmtInt(openedSel), openedSel > 0 ? "up" : "");
    setText("cotRemoved1w", fmtInt(closedSel), closedSel > 0 ? "down" : "");
    setText("cotNetAbs", fmtInt(netAbsSel), netSelSign >= 0 ? "up" : "down");
    setText("cotDelta4", `${delta4 >= 0 ? "+" : ""}${fmtInt(delta4)} (${delta4Pct >= 0 ? "+" : ""}${fmtNum(delta4Pct, 2)}pp)`, delta4 >= 0 ? "up" : "down");

    const nonCommercialSeries = buildCategorySeries(filteredCot, "nonCommercial");
    const cotIndexSeries = buildCotIndexSeries(nonCommercialSeries, state.cotLookback);
    const latestCotIndex = cotIndexSeries[cotIndexSeries.length - 1];
    const regime = getCotRegimeLabel(latestCotIndex);
    const oiMomentum4w = fourWeeksAgo.oi > 0 ? ((latestCot.oi / fourWeeksAgo.oi) - 1) * 100 : 0;

    setText("cotRegimeValue", regime.label, regime.cls);
    setText("cotRegimeHint", `Index ${fmtNum(latestCotIndex, 1)} su ${state.cotLookback} settimane`, regime.cls);
    setText("cotIndexValue", fmtNum(latestCotIndex, 1), latestCotIndex >= 50 ? "up" : "down");
    setText("cotIndexHint", `Non-Comm range normalizzato ${state.cotLookback}w`, "muted");
    setText("oiMomentum4w", `${oiMomentum4w >= 0 ? "+" : ""}${fmtNum(oiMomentum4w, 2)}%`, oiMomentum4w >= 0 ? "up" : "down");
    setText("oiMomentumHint", "Open interest vs 4 settimane", "muted");
    const nonCommNetPctSeries = nonCommercialSeries.map((r) => (r.oi > 0 ? (r.net / r.oi) * 100 : 0));
    const nonCommZ = computeZScore(nonCommNetPctSeries.slice(-state.cotLookback));
    const crowding = getCrowdingSignal(latestCotIndex, nonCommZ);
    const recent20 = pricesForAnalytics.slice(-21);
    const pStart = recent20[0]?.close;
    const pEnd = recent20[recent20.length - 1]?.close;
    const momentum20d = Number.isFinite(pStart) && pStart > 0 && Number.isFinite(pEnd) ? ((pEnd / pStart) - 1) * 100 : 0;
    const divergence = getCotDivergenceSignal(latestCotIndex, momentum20d);
    setText("cotCrowdingSignal", `${crowding.text} (z=${fmtNum(nonCommZ, 2)})`, crowding.cls);
    setText("cotDivergenceSignal", divergence.text, divergence.cls);

    const seasonalForward = computeForwardSeasonality(
      state.latestSeasonalityPayload?.seasonality || Array.from({ length: 12 }, () => 0),
      state.seasonalityStartMonth,
      state.seasonalityHorizon
    );
    const priceSrc = String(state.priceData?.source || "");
    const cotSrc = String(state.cotSource || "");
    const priceConf = /degradato|ricostruito|fallback|proxy|cache/i.test(priceSrc) ? 0.55 : 0.95;
    const cotConf = /degradato|fallback|proxy|cache|snapshot/i.test(cotSrc) ? 0.6 : 0.95;
    const dataConfidence = (priceConf + cotConf) / 2;
    const macroRisk = computeMacroRiskWindow(new Date());
    const bias = computeBiasEngine({
      cotIndex: latestCotIndex,
      nonCommZ,
      divergenceAlign: divergence.align,
      crowdingText: crowding.text,
      seasonalityForward: seasonalForward,
      priceMomentum20d: momentum20d,
      dataConfidence,
      profile: state.userProfile,
      oiMomentum4w,
      macroRisk,
    });
    const playbook = buildPlaybook(
      bias.stateLabel,
      bias.score,
      seasonalForward,
      regime.label,
      bias.confidence,
      bias.gateReason
    );
    const qualityScore = Math.round(dataConfidence * 100);
    state.currentQualityScore = qualityScore;
    const adaptive = computeAdaptiveProfile(qualityScore, state.alertMode, macroRisk);
    const bt = state.latestSeasonalityPayload?.backtest || { hitRate: 0, avg: 0 };
    let scenarioProb = computeScenarioProbability({
      biasScore: bias.score,
      biasConfidence: bias.confidence,
      hitRate: bt.hitRate,
      avgReturn: bt.avg,
    });
    // Su WAIT non gonfiare una probabilita direzionale
    if (bias.stateLabel === "Neutral") {
      scenarioProb = Math.min(scenarioProb, 52);
    }

    setText("biasScore", `${bias.score}/100`, bias.stateClass);
    setText(
      "biasConfidence",
      `Signal Conf ${bias.confidence}% | Data Quality ${qualityScore}% | ${bias.gateReason} | profilo ${state.userProfile}`,
      "muted"
    );
    setText("biasState", bias.stateLabel, bias.stateClass);
    setText(
      "biasDrivers",
      `Driver: COT ${fmtNum(latestCotIndex, 1)} | Stag ${fmtNum(seasonalForward, 2)}% | Mom20d ${fmtNum(momentum20d, 2)}% | Voti ${bias.votes?.bull || 0}B/${bias.votes?.bear || 0}S`
    );
    setText("playbookTitle", playbook.title, playbook.cls);
    setText("playbookText", playbook.text, "muted");
    setText("dataQualityScore", `${qualityScore}%`, qualityScore >= 80 ? "up" : qualityScore >= 60 ? "" : "down");
    setText("dataQualityText", `Prezzi: ${Math.round(priceConf * 100)}% | COT: ${Math.round(cotConf * 100)}%`, "muted");
    setText("scenarioProb", `${scenarioProb}%`, scenarioProb >= 60 ? "up" : scenarioProb <= 40 ? "down" : "");
    setText("scenarioProbText", `HitRate ${fmtNum(bt.hitRate || 0, 1)}% | Avg ${fmtNum(bt.avg || 0, 2)}%`);
    renderAdaptiveProfile(adaptive);
    renderBiasContributors(bias.contributors);
    const execution = buildExecutionBoard({
      biasState: bias.stateLabel,
      spot: state.latestSpot,
      volPct: state.latestVolPct,
      seasonalForward,
      adaptiveRiskScale: adaptive.riskScale,
      adaptiveRiskCap: adaptive.riskCap,
    });
    const scenarioTree = computeScenarioTree({
      spot: state.latestSpot,
      stopDist: execution.stopDist || 0,
      scenarioProb,
    });
    renderScenarioTree(scenarioTree);
    setText("execSide", execution.side, execution.cls);
    setText("execEntry", execution.entry);
    setText("execInvalidation", execution.invalidation, execution.cls);
    setText("execTargets", execution.targets, execution.cls);
    setText("execRiskSize", execution.riskSize || "--");
    setText("execLeverage", execution.leverage || "--");
    setText("execNote", execution.note);

    if (state.lastSignals.biasState !== bias.stateLabel) {
      // Alert solo su segnali veri o chiusura di un segnale
      const wasDirectional = state.lastSignals.biasState === "Bullish" || state.lastSignals.biasState === "Bearish";
      const isDirectional = bias.stateLabel === "Bullish" || bias.stateLabel === "Bearish";
      if (wasDirectional || isDirectional) {
        smartAlert(
          "biasState",
          isDirectional
            ? `Segnale verificato: ${bias.stateLabel} (${bias.score}/100, conf ${bias.confidence}%)`
            : `Segnale chiuso -> WAIT (${bias.gateReason || "no edge"})`,
          bias.stateClass
        );
      }
      state.lastSignals.biasState = bias.stateLabel;
    }
    if (state.lastSignals.cotRegime !== regime.label) {
      smartAlert("cotRegime", `Regime COT: ${state.lastSignals.cotRegime || "N/A"} -> ${regime.label}`, regime.cls);
      state.lastSignals.cotRegime = regime.label;
    }
    if (state.lastSignals.execSide !== execution.side) {
      smartAlert("execSide", `Execution side: ${state.lastSignals.execSide || "N/A"} -> ${execution.side}`, execution.cls);
      state.lastSignals.execSide = execution.side;
    }
    const qualityBucket = qualityScore >= 80 ? "high" : qualityScore >= 60 ? "mid" : "low";
    if (state.lastSignals.dataQualityBucket !== qualityBucket) {
      const cls = qualityBucket === "low" ? "down" : qualityBucket === "high" ? "up" : "";
      smartAlert("dataQuality", `Data quality: ${qualityBucket.toUpperCase()} (${qualityScore}%)`, cls);
      state.lastSignals.dataQualityBucket = qualityBucket;
    }
    const scenarioBucket = scenarioProb >= 60 ? "bull" : scenarioProb <= 40 ? "bear" : "neutral";
    if (state.lastSignals.scenarioBucket !== scenarioBucket) {
      const cls = scenarioBucket === "bull" ? "up" : scenarioBucket === "bear" ? "down" : "";
      smartAlert("scenarioProbability", `Scenario probability: ${scenarioProb}% (${scenarioBucket})`, cls);
      state.lastSignals.scenarioBucket = scenarioBucket;
    }
    const macroRiskState = macroRisk.active ? "active" : macroRisk.upcoming ? "upcoming" : "off";
    if (state.lastSignals.macroRiskOff !== macroRiskState) {
      const cls = macroRisk.active ? "down" : macroRisk.upcoming ? "" : "up";
      smartAlert("macroRiskOff", `Macro window: ${macroRisk.label}`, cls);
      state.lastSignals.macroRiskOff = macroRiskState;
    }
    const riskNow = computeRiskOverlay(pricesForAnalytics, state.latestSpot, state.userProfile);
    if (riskNow?.regime === "Rischio Alto") {
      smartAlert("riskHigh", `Risk Overlay: ${riskNow.regime} (${safePct(riskNow.dailyMovePct)})`, "down");
    }
    const levelsNow = computeKeyLevels(pricesForAnalytics, state.latestSpot);
    if (levelsNow) {
      if (state.latestSpot >= levelsNow.r1) {
        smartAlert("levelBreakR1", `Prezzo sopra R1 (${fmtNum(levelsNow.r1, 2)})`, "up");
      } else if (state.latestSpot <= levelsNow.s1) {
        smartAlert("levelBreakS1", `Prezzo sotto S1 (${fmtNum(levelsNow.s1, 2)})`, "down");
      }
    }
    updateSignalHistory({
      biasScore: bias.score,
      biasState: bias.stateLabel,
      qualityScore,
    });
    updateSignalJournal({
      biasState: bias.stateLabel,
      spot: state.latestSpot,
      qualityScore,
      scenarioProb,
      signalConfidence: bias.confidence,
    });
    evaluateSignalJournal(state.latestSpot);
    pushSnapshot({
      ts: new Date(),
      bucketTs: `${new Date().getHours()}:${new Date().getMinutes()}:${Math.floor(new Date().getSeconds() / 10)}`,
      biasScore: bias.score,
      biasState: bias.stateLabel,
      scenarioProb,
      qualityScore,
      executionSide: execution.side,
    });

    updateFocusedCotChart(filteredCot);
    renderWeeklyFlowsTable(filteredCot);
  } else {
    setText("cotNonCommNet", "--");
    setText("cotNonCommPct", "Net: --");
    setText("cotCommercialNet", "--");
    setText("cotCommercialPct", "Net: --");
    setText("cotRetailNet", "--");
    setText("cotRetailPct", "Net: --");
    setText("cotDate", "--");
    setText("cotOi", "--");
    setText("cotCommercialTriplet", "--");
    setText("cotNonCommTriplet", "--");
    setText("cotRetailTriplet", "--");
    setText("cotAdded1w", "--");
    setText("cotRemoved1w", "--");
    setText("cotNetAbs", "--");
    setText("cotDelta4", "--");
    setText("cotRegimeValue", "--");
    setText("cotRegimeHint", "--");
    setText("cotIndexValue", "--");
    setText("cotIndexHint", "--");
    setText("oiMomentum4w", "--");
    setText("oiMomentumHint", "Variazione open interest");
    setText("cotCrowdingSignal", "--");
    setText("cotDivergenceSignal", "--");
    setText("biasScore", "--");
    setText("biasConfidence", "Confidence --");
    setText("biasState", "--");
    setText("biasDrivers", "Driver: --");
    setText("playbookTitle", "--");
    setText("playbookText", "--");
    setText("dataQualityScore", "--");
    setText("dataQualityText", "--");
    setText("scenarioProb", "--");
    setText("scenarioProbText", "--");
    setText("biasContribMain", "--");
    setText("biasContribText", "--");
    setText("execSide", "--");
    setText("execEntry", "--");
    setText("execInvalidation", "--");
    setText("execTargets", "--");
    setText("execRiskSize", "--");
    setText("execLeverage", "--");
    setText("execNote", "--");
    setText("replayTs", "--");
    setText("replayBias", "--");
    setText("replayScenario", "--");
    setText("replayQuality", "--");
    setText("adaptiveMode", "--");
    setText("adaptiveAlertCadence", "--");
    setText("adaptiveRiskScale", "--");
    setText("adaptiveRiskCap", "--");
    setText("adaptiveStatus", "--");
    renderScenarioTree(null);
    if (state.cotFocusedChart) {
      state.cotFocusedChart.destroy();
      state.cotFocusedChart = null;
    }
    if (weeklyFlowRowsEl) weeklyFlowRowsEl.innerHTML = "";
  }

  const symbolSuffix = state.marketSymbol ? ` [${state.marketSymbol}]` : "";
  const selectedAsset = getSelectedAsset();
  const priceSource = state.priceData?.source || "non disponibile";
  const cotSource = state.cotSource || "non disponibile";
  const degraded =
    !enoughPrice ||
    !enoughCot ||
    priceSource.includes("fallback") ||
    priceSource.includes("degradato") ||
    priceSource.includes("proxy") ||
    priceSource.includes("cache");
  statusEl.textContent = degraded
    ? `Lettura cauta: alcuni feed non sono freschi. Asset ${selectedAsset.id} · refresh ${state.refreshSeconds}s · Prezzi: ${priceSource}${symbolSuffix} · COT: ${cotSource}`
    : `Tutto aggiornato · Asset ${selectedAsset.id} · refresh ${state.refreshSeconds}s · TF ${state.timeframe} · Prezzi: ${priceSource}${symbolSuffix} · COT: ${cotSource}`;
  updateFeedStatusBadge();
  renderAlertFeed();
  renderSignalHistory();
  renderSignalJournal();
  renderSourceHealth();
  renderReplaySnapshot();
  renderMacroCalendar();
}

function scheduleRender() {
  if (state.renderScheduled) return;
  state.renderScheduled = true;
  requestAnimationFrame(() => {
    state.renderScheduled = false;
    renderDashboard();
  });
}

async function loadDataAndRender(options = {}) {
  const { force = false } = options;
  if (state.isLoading && !force) return;
  state.isLoading = true;
  try {
    const selectedAsset = getSelectedAsset();
    let priceTask;
    let cotTask;
    try {
      const bootstrapTask = await timedTask(() => fetchBootstrapFromBackend(selectedAsset));
      if (bootstrapTask.ok) {
        const bootstrap = bootstrapTask.value;
        priceTask = bootstrap.priceData
          ? { ok: true, value: bootstrap.priceData, latencyMs: bootstrapTask.latencyMs, error: "" }
          : { ok: false, value: null, latencyMs: bootstrapTask.latencyMs, error: "bootstrap price vuoto" };
        cotTask = bootstrap.cotData
          ? { ok: true, value: bootstrap.cotData, latencyMs: bootstrapTask.latencyMs, error: "" }
          : { ok: false, value: null, latencyMs: bootstrapTask.latencyMs, error: "bootstrap cot vuoto" };
        if (bootstrap.macroData?.rows?.length) {
          state.macroEvents = bootstrap.macroData.rows;
          state.macroSource = bootstrap.macroData.source;
          state.macroLastFetchAt = Date.now();
          if (
            /\bLIVE\b/i.test(String(bootstrap.macroData.source || "")) ||
            String(bootstrap.macroData.mode || "").toUpperCase() === "LIVE"
          ) {
            state.macroLastLiveSuccessAt = Date.now();
          }
          if (bootstrap.macroData.primarySource) {
            state.macroPreferredSource = bootstrap.macroData.primarySource;
          }
          saveCache(CACHE_KEYS.MACRO, {
            rows: bootstrap.macroData.rows.map((r) => ({
              ...r,
              date: r.date?.toISOString?.() || null,
            })),
            source: state.macroSource,
            fetchedAt: new Date().toISOString(),
          });
        }
      } else {
        throw new Error(bootstrapTask.error || "bootstrap backend non disponibile");
      }
    } catch {
      [priceTask, cotTask] = await Promise.all([
        timedTask(() => getPriceSeries(selectedAsset)),
        timedTask(() => getCotForAsset(selectedAsset)),
      ]);
    }
    const priceErrorMsg = priceTask.ok ? "" : priceTask.error;
    const cotErrorMsg = cotTask.ok ? "" : cotTask.error;

    if (priceTask.ok) {
      state.priceData = priceTask.value;
      state.marketSnapshot = priceTask.value.snapshot || null;
      state.marketSymbol = priceTask.value.snapshot?.ticker || null;
      saveCache(getAssetScopedCacheKey(CACHE_KEYS.PRICE), {
        ...priceTask.value,
        prices: priceTask.value.prices.map((p) => ({ date: p.date.toISOString(), close: p.close })),
        cachedAt: new Date().toISOString(),
      });
      state.sourceHealth.price = {
        status: state.priceData.source?.includes("degradato") || state.priceData.source?.includes("ricostruito") ? "degraded" : "ok",
        latencyMs: priceTask.latencyMs,
        source: state.priceData.source,
        lastSuccessAt: new Date().toISOString(),
        error: null,
      };
    } else {
      state.sourceHealth.price = {
        ...state.sourceHealth.price,
        status: "error",
        latencyMs: priceTask.latencyMs,
        error: priceTask.error,
      };
    }

    if (cotTask.ok) {
      state.cotData = cotTask.value.rows;
      state.cotSource = cotTask.value.source;
      saveCache(getAssetScopedCacheKey(CACHE_KEYS.COT), {
        rows: cotTask.value.rows.map((r) => ({ ...r, date: r.date.toISOString() })),
        source: cotTask.value.source,
        cachedAt: new Date().toISOString(),
      });
      state.sourceHealth.cot = {
        status: !state.cotData?.length || state.cotSource?.includes("degradato") ? "degraded" : "ok",
        latencyMs: cotTask.latencyMs,
        source: state.cotSource,
        lastSuccessAt: new Date().toISOString(),
        error: null,
      };
    } else {
      state.sourceHealth.cot = {
        ...state.sourceHealth.cot,
        status: "error",
        latencyMs: cotTask.latencyMs,
        error: cotTask.error,
      };
    }
    if (!state.priceData) {
      const cachedPrice = loadCache(getAssetScopedCacheKey(CACHE_KEYS.PRICE), PRICE_CACHE_MAX_AGE_MS);
      if (cachedPrice?.prices?.length) {
        state.priceData = {
          source: `${cachedPrice.source} (cache ultimo dato valido)`,
          snapshot: cachedPrice.snapshot || null,
          prices: cachedPrice.prices.map((p) => ({ date: new Date(p.date), close: Number(p.close) })),
        };
        state.marketSnapshot = cachedPrice.snapshot || null;
        state.marketSymbol = cachedPrice.snapshot?.ticker || null;
      }
    }

    if (!state.cotData) {
      const cachedCot = loadCache(getAssetScopedCacheKey(CACHE_KEYS.COT), COT_CACHE_MAX_AGE_MS);
      if (cachedCot?.rows?.length) {
        state.cotData = cachedCot.rows.map((r) => ({ ...r, date: new Date(r.date) }));
        state.cotSource = `${cachedCot.source} (cache ultimo dato valido)`;
      }
    }

    if (!state.priceData && !state.cotData) {
      throw new Error("Impossibile aggiornare i feed e nessuna cache valida disponibile.");
    }

    if (state.lastSignals.priceHealth !== state.sourceHealth.price.status) {
      const cls = state.sourceHealth.price.status === "ok" ? "up" : state.sourceHealth.price.status === "error" ? "down" : "";
      smartAlert("healthPrice", `Health Prezzi: ${state.sourceHealth.price.status.toUpperCase()}`, cls);
      state.lastSignals.priceHealth = state.sourceHealth.price.status;
    }
    if (state.lastSignals.cotHealth !== state.sourceHealth.cot.status) {
      const cls = state.sourceHealth.cot.status === "ok" ? "up" : state.sourceHealth.cot.status === "error" ? "down" : "";
      smartAlert("healthCot", `Health COT: ${state.sourceHealth.cot.status.toUpperCase()}`, cls);
      state.lastSignals.cotHealth = state.sourceHealth.cot.status;
    }

    renderDashboard();
    refreshMacroIfStale();
    if (priceErrorMsg || cotErrorMsg) {
      const parts = [];
      if (priceErrorMsg) parts.push(`Prezzi: ${priceErrorMsg}`);
      if (cotErrorMsg) parts.push(`COT: ${cotErrorMsg}`);
      statusEl.textContent = `Aggiornamento parziale — ${parts.join(" · ")}. Mostriamo solo dati reali disponibili.`;
    }
    // render immediato su nuovo payload
    lastUpdatedEl.textContent = `Ultimo aggiornamento: ${formatDateTime(new Date())}`;
    updateFeedStatusBadge();
  } catch (error) {
    console.error(error);
    renderDashboard();
    statusEl.textContent = `Non riesco ad aggiornare i feed: ${error.message}`;
    updateFeedStatusBadge();
  } finally {
    state.isLoading = false;
  }
}

function setActiveTimeframe(tf) {
  state.timeframe = tf;
  const buttons = timeframeGroupEl.querySelectorAll(".tf-btn");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tf === tf);
  });
  scheduleRender();
}

function setActivePage(page) {
  state.activePage = page;
  const isCot = page === "cot";
  const isSeasonality = page === "seasonality";
  const isSignals = page === "signals";
  const isMacro = page === "macro";
  cotPageEl?.classList.toggle("active", isCot);
  seasonalityPageEl?.classList.toggle("active", isSeasonality);
  signalPageEl?.classList.toggle("active", isSignals);
  macroPageEl?.classList.toggle("active", isMacro);
  tabCotEl?.classList.toggle("active", isCot);
  tabSeasonalityEl?.classList.toggle("active", isSeasonality);
  tabSignalsEl?.classList.toggle("active", isSignals);
  tabMacroEl?.classList.toggle("active", isMacro);
  setTimeout(() => {
    if (isCot) {
      applyCotPanelHeight();
      state.cotFocusedChart?.resize();
    } else if (isSeasonality) {
      state.seasonalityChart?.resize();
    } else if (isMacro) {
      renderMacroCalendar();
    }
  }, 40);
  scheduleRender();
}

function applyCotPanelHeight() {
  if (!panelCotFocusEl) return;
  const maxAllowed = Math.max(420, Math.floor(window.innerHeight * 0.68));
  const clamped = Math.min(state.cotChartHeight, maxAllowed);
  panelCotFocusEl.style.height = `${clamped}px`;
  if (cotChartHeightValueEl) {
    cotChartHeightValueEl.textContent = `${clamped}px`;
  }
  if (cotChartHeightEl && Number(cotChartHeightEl.value) !== clamped) {
    cotChartHeightEl.value = String(clamped);
  }
  state.cotFocusedChart?.resize();
}

function updateFeedStatusBadge() {
  const badge = document.getElementById("liveBadge");
  if (!badge) return;
  const priceSrc = String(state.priceData?.source || "");
  const cotSrc = String(state.cotSource || "");
  const macroSrc = String(state.macroSource || "");
  const joined = `${priceSrc} | ${cotSrc} | ${macroSrc}`.toLowerCase();
  let mode = "LIVE";
  let title = "Feed aggiornati";
  if (!state.priceData?.prices?.length && !state.cotData?.length) {
    mode = "DOWN";
    title = "Nessun dato disponibile";
  } else if (joined.includes("cache")) {
    mode = "CACHE";
    title = "Stai vedendo dati da cache locale";
  } else if (joined.includes("failover") || joined.includes("degradato") || joined.includes("non disponibile")) {
    mode = "FAILOVER";
    title = "Fonte alternativa o feed parziale";
  }
  badge.textContent = mode;
  badge.title = title;
  badge.classList.remove("badge-live", "badge-cache", "badge-failover", "badge-down");
  badge.classList.add(
    mode === "LIVE" ? "badge-live" : mode === "CACHE" ? "badge-cache" : mode === "DOWN" ? "badge-down" : "badge-failover"
  );
}

function restartAutoRefresh() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    loadDataAndRender({ force: true });
  }, state.refreshSeconds * 1000);
}

function wireRealtimeLifecycleRefresh() {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) loadDataAndRender({ force: true });
  });
  window.addEventListener("focus", () => loadDataAndRender({ force: true }));
  window.addEventListener("online", () => loadDataAndRender({ force: true }));
  window.addEventListener("resize", () => applyCotPanelHeight());
}

function resetAllZoom() {
  state.cotFocusedChart?.resetZoom?.();
  state.seasonalityChart?.resetZoom?.();
}

function wireEvents() {
  authLoginBtn?.addEventListener("click", async () => {
    const username = authUserEl?.value?.trim() || "";
    const password = authPassEl?.value || "";
    if (!username || !password) {
      if (authStatusEl) authStatusEl.textContent = "Inserisci username e password";
      return;
    }
    if (authStatusEl) authStatusEl.textContent = "Login in corso...";
    try {
      await loginAppUser(username, password);
      if (authPassEl) authPassEl.value = "";
      const backendPrefs = await loadPrefsFromBackend();
      if (backendPrefs && typeof backendPrefs === "object") {
        try {
          localStorage.setItem(PREFS_KEY, JSON.stringify(backendPrefs));
        } catch {
          // ignore storage failures
        }
      } else {
        savePrefs();
      }
      if (authStatusEl) authStatusEl.textContent = `Sessione attiva: ${state.auth?.user?.name || state.auth?.user?.id || "utente"}`;
    } catch (error) {
      if (authStatusEl) authStatusEl.textContent = `Login fallito: ${error.message}`;
      clearAuthState();
    }
  });

  authLogoutBtn?.addEventListener("click", async () => {
    await logoutAppUser();
    if (authStatusEl) authStatusEl.textContent = "Sessione chiusa";
    window.location.href = "/";
  });

  billingPortalBtn?.addEventListener("click", async () => {
    const token = getStoredAuthToken() || state.auth?.token;
    if (!token) {
      window.location.href = "/login";
      return;
    }
    billingPortalBtn.disabled = true;
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || `HTTP ${response.status}`);
      if (!payload?.url) throw new Error("URL portale mancante");
      window.location.href = payload.url;
    } catch (error) {
      if (authStatusEl) authStatusEl.textContent = `Billing: ${error.message}`;
      else statusEl.textContent = `Billing: ${error.message}`;
      billingPortalBtn.disabled = false;
    }
  });

  assetGroupEl?.addEventListener("change", () => {
    state.selectedAssetGroup = assetGroupEl.value || "ALL";
    populateAssetList();
    const current = getSelectedAsset();
    if (state.selectedAssetGroup !== "ALL" && current.group !== state.selectedAssetGroup) {
      const firstInGroup = getAssetsByGroup(state.selectedAssetGroup)[0];
      if (firstInGroup) {
        applySelectedAsset(firstInGroup.id, { syncInput: true });
        state.priceData = null;
        state.marketSnapshot = null;
        state.marketSymbol = null;
        state.cotData = null;
        state.cotSource = "";
        loadDataAndRender({ force: true });
      }
    } else if (assetSearchEl) {
      assetSearchEl.value = formatAssetSearchValue(current);
    }
    savePrefs();
  });

  assetSearchEl?.addEventListener("change", () => {
    const nextId = resolveAssetIdFromInput(assetSearchEl.value);
    if (!nextId) {
      applySelectedAsset(state.selectedAssetId, { syncInput: true });
      return;
    }
    const prevId = state.selectedAssetId;
    applySelectedAsset(nextId, { syncInput: true });
    if (prevId !== state.selectedAssetId) {
      state.priceData = null;
      state.marketSnapshot = null;
      state.marketSymbol = null;
      state.cotData = null;
      state.cotSource = "";
      loadDataAndRender({ force: true });
    }
    savePrefs();
  });
  assetSearchEl?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      assetSearchEl.dispatchEvent(new Event("change"));
    }
  });

  timeframeGroupEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".tf-btn");
    if (!btn) return;
    setActiveTimeframe(btn.dataset.tf);
  });

  refreshIntervalEl.addEventListener("change", () => {
    state.refreshSeconds = Number(refreshIntervalEl.value) || 10;
    restartAutoRefresh();
    savePrefs();
  });

  userProfileEl?.addEventListener("change", () => {
    state.userProfile = userProfileEl.value || "swing";
    scheduleRender();
    savePrefs();
  });

  refreshNowBtn.addEventListener("click", () => {
    loadDataAndRender();
  });

  resetZoomBtn?.addEventListener("click", () => {
    resetAllZoom();
  });

  cotCategoryEl?.addEventListener("change", () => {
    state.cotChartCategory = cotCategoryEl.value;
    scheduleRender();
    savePrefs();
  });

  cotMetricEl?.addEventListener("change", () => {
    state.cotMetric = cotMetricEl.value;
    scheduleRender();
    savePrefs();
  });

  cotLookbackEl?.addEventListener("change", () => {
    state.cotLookback = Number(cotLookbackEl.value) || 52;
    scheduleRender();
    savePrefs();
  });

  cotChartHeightEl?.addEventListener("input", () => {
    state.cotChartHeight = Number(cotChartHeightEl.value) || 540;
    applyCotPanelHeight();
  });

  tabCotEl?.addEventListener("click", () => {
    setActivePage("cot");
    savePrefs();
  });
  tabSeasonalityEl?.addEventListener("click", () => {
    setActivePage("seasonality");
    savePrefs();
  });
  tabSignalsEl?.addEventListener("click", () => {
    setActivePage("signals");
    savePrefs();
  });
  tabMacroEl?.addEventListener("click", () => {
    setActivePage("macro");
    savePrefs();
  });

  seasonalityYearsEl?.addEventListener("change", () => {
    const val = seasonalityYearsEl.value;
    state.seasonalityYears = val === "ALL" ? "ALL" : Number(val);
    scheduleRender();
    savePrefs();
  });

  seasonalityModeEl?.addEventListener("change", () => {
    state.seasonalityMode = seasonalityModeEl.value;
    scheduleRender();
    savePrefs();
  });

  seasonalityTraceModeEl?.addEventListener("change", () => {
    state.seasonalityTraceMode = seasonalityTraceModeEl.value || "current";
    scheduleRender();
    savePrefs();
  });

  seasonalityStartMonthEl?.addEventListener("change", () => {
    state.seasonalityStartMonth = Number(seasonalityStartMonthEl.value) || 0;
    scheduleRender();
    savePrefs();
  });

  seasonalityHorizonEl?.addEventListener("change", () => {
    state.seasonalityHorizon = Number(seasonalityHorizonEl.value) || 3;
    scheduleRender();
    savePrefs();
  });

  alertModeEl?.addEventListener("change", () => {
    state.alertMode = alertModeEl.value || "balanced";
    savePrefs();
  });

  replayModeEl?.addEventListener("change", () => {
    state.replayMode = replayModeEl.value || "off";
    if (state.replayMode === "on") {
      smartAlert("replayMode", "Replay storico attivato", "");
    }
    scheduleRender();
    savePrefs();
  });

  replayStepEl?.addEventListener("input", () => {
    state.replayStep = Math.max(0, Number(replayStepEl.value) || 0);
    scheduleRender();
    savePrefs();
  });

  journalOutcomeFilterEl?.addEventListener("change", () => {
    state.journalOutcomeFilter = journalOutcomeFilterEl.value || "ALL";
    scheduleRender();
    savePrefs();
  });

  journalEvalHorizonEl?.addEventListener("change", () => {
    state.journalEvalHorizonHours = Math.max(1, Number(journalEvalHorizonEl.value) || 4);
    scheduleRender();
    savePrefs();
  });

  exportJournalCsvBtn?.addEventListener("click", () => {
    exportSignalJournalCsv();
  });

  layoutModeEl?.addEventListener("change", () => {
    applyLayoutMode(layoutModeEl.value || "desk");
    scheduleRender();
    savePrefs();
  });

  macroImpactFilterEl?.addEventListener("change", () => {
    state.macroImpactFilter = macroImpactFilterEl.value || "ALL";
    renderMacroCalendar();
    savePrefs();
  });

  macroCategoryFilterEl?.addEventListener("change", () => {
    state.macroCategoryFilter = macroCategoryFilterEl.value || "ALL";
    renderMacroCalendar();
    savePrefs();
  });

  macroRefreshBtn?.addEventListener("click", async () => {
    macroSourceInfoEl && (macroSourceInfoEl.textContent = "Fonte macro: aggiornamento...");
    setMacroFeedBadge("unknown");
    await loadMacroCalendar().catch(() => null);
    savePrefs();
  });

  notifyChannelEl?.addEventListener("change", () => {
    state.notifyChannel = notifyChannelEl.value || "none";
    if (notifyStatusEl) notifyStatusEl.textContent = state.notifyChannel === "none" ? "Notifiche esterne disattivate" : `Canale attivo: ${state.notifyChannel}`;
    savePrefs();
  });

  notifyWebhookUrlEl?.addEventListener("change", () => {
    state.notifyWebhookUrl = notifyWebhookUrlEl.value.trim();
    savePrefs();
  });

  telegramBotTokenEl?.addEventListener("change", () => {
    state.telegramBotToken = telegramBotTokenEl.value.trim();
    savePrefs();
  });

  telegramChatIdEl?.addEventListener("change", () => {
    state.telegramChatId = telegramChatIdEl.value.trim();
    savePrefs();
  });

  notifyTestBtn?.addEventListener("click", async () => {
    if (state.notifyChannel === "none") {
      if (notifyStatusEl) notifyStatusEl.textContent = "Seleziona un canale prima del test";
      return;
    }
    await sendExternalNotification(`[XAU ALERT TEST] ${new Date().toLocaleString("it-IT")}`, "manualTest");
  });
}

async function init() {
  const hasValidSession = await hydrateAuthFromStorage();
  if (!hasValidSession) {
    window.location.href = "/";
    return;
  }
  const backendPrefs = await loadPrefsFromBackend();
  const localPrefs = loadPrefs();
  const prefs = backendPrefs || localPrefs;
  if (backendPrefs) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(backendPrefs));
    } catch {
      // ignore local storage failures
    }
  }
  if (prefs) {
    if (prefs.selectedAssetId) {
      state.selectedAssetId = String(prefs.selectedAssetId).toUpperCase();
    }
    if (prefs.selectedAssetGroup) {
      state.selectedAssetGroup = String(prefs.selectedAssetGroup);
    }
    if (prefs.activePage && ["cot", "seasonality", "signals", "macro"].includes(prefs.activePage)) {
      state.activePage = prefs.activePage;
    }
    if (prefs.alertMode && ["balanced", "aggressive", "conservative"].includes(prefs.alertMode)) {
      state.alertMode = prefs.alertMode;
    }
    if (prefs.replayMode && ["off", "on"].includes(prefs.replayMode)) {
      state.replayMode = prefs.replayMode;
    }
    if (prefs.replayStep !== undefined) {
      state.replayStep = Math.max(0, Number(prefs.replayStep) || 0);
    }
    if (prefs.journalOutcomeFilter) {
      state.journalOutcomeFilter = prefs.journalOutcomeFilter;
    }
    if (prefs.journalEvalHorizonHours !== undefined) {
      state.journalEvalHorizonHours = Math.max(1, Number(prefs.journalEvalHorizonHours) || 4);
    }
    if (prefs.layoutMode && ["desk", "focus"].includes(prefs.layoutMode)) {
      state.layoutMode = prefs.layoutMode;
    }
    if (prefs.macroImpactFilter) {
      state.macroImpactFilter = prefs.macroImpactFilter;
    }
    if (prefs.macroCategoryFilter) {
      state.macroCategoryFilter = prefs.macroCategoryFilter;
    }
    if (prefs.macroPreferredSource) {
      state.macroPreferredSource = String(prefs.macroPreferredSource);
    }
    if (prefs.notifyChannel) {
      state.notifyChannel = prefs.notifyChannel;
    }
    if (prefs.notifyWebhookUrl) {
      state.notifyWebhookUrl = prefs.notifyWebhookUrl;
    }
    if (prefs.telegramBotToken) {
      state.telegramBotToken = prefs.telegramBotToken;
    }
    if (prefs.telegramChatId) {
      state.telegramChatId = prefs.telegramChatId;
    }
    if (prefs.userProfile) state.userProfile = prefs.userProfile;
    if (prefs.seasonalityTraceMode) state.seasonalityTraceMode = prefs.seasonalityTraceMode;
    if (prefs.seasonalityYears !== undefined) state.seasonalityYears = prefs.seasonalityYears;
    if (prefs.seasonalityMode) state.seasonalityMode = prefs.seasonalityMode;
    if (prefs.seasonalityStartMonth !== undefined) state.seasonalityStartMonth = Number(prefs.seasonalityStartMonth) || 0;
    if (prefs.seasonalityHorizon !== undefined) state.seasonalityHorizon = Number(prefs.seasonalityHorizon) || 3;
    if (prefs.cotCategory) state.cotChartCategory = prefs.cotCategory;
    if (prefs.cotMetric) state.cotMetric = prefs.cotMetric;
    if (prefs.cotLookback !== undefined) state.cotLookback = Number(prefs.cotLookback) || 52;
    if (prefs.refreshSeconds !== undefined) state.refreshSeconds = Number(prefs.refreshSeconds) || 10;
  }
  applySelectedAsset(state.selectedAssetId, { syncInput: false });
  populateAssetList();

  state.chartingAvailable = typeof Chart !== "undefined";
  if (state.chartingAvailable && window.ChartZoom) {
    try {
      Chart.register(window.ChartZoom);
    } catch {
      // plugin gia registrato
    }
  }
  if (!state.chartingAvailable) {
    statusEl.textContent = "Chart.js non disponibile: modalità tabellare attiva, dati in aggiornamento.";
    if (seasonalityModeEl) {
      seasonalityModeEl.value = "numbers";
      state.seasonalityMode = "numbers";
    }
  }
  if (seasonalityYearsEl) {
    seasonalityYearsEl.value = state.seasonalityYears === "ALL" ? "ALL" : String(state.seasonalityYears);
    state.seasonalityYears = seasonalityYearsEl.value === "ALL" ? "ALL" : Number(seasonalityYearsEl.value);
  }
  if (seasonalityModeEl) {
    seasonalityModeEl.value = state.seasonalityMode;
    state.seasonalityMode = seasonalityModeEl.value;
  }
  if (seasonalityTraceModeEl) {
    seasonalityTraceModeEl.value = state.seasonalityTraceMode;
    state.seasonalityTraceMode = seasonalityTraceModeEl.value || "current";
  }
  if (seasonalityStartMonthEl) {
    seasonalityStartMonthEl.value = String(state.seasonalityStartMonth);
    state.seasonalityStartMonth = Number(seasonalityStartMonthEl.value) || 0;
  }
  if (seasonalityHorizonEl) {
    seasonalityHorizonEl.value = String(state.seasonalityHorizon);
    state.seasonalityHorizon = Number(seasonalityHorizonEl.value) || 3;
  }
  if (userProfileEl) {
    userProfileEl.value = state.userProfile;
    state.userProfile = userProfileEl.value || "swing";
  }
  if (refreshIntervalEl) {
    refreshIntervalEl.value = String(state.refreshSeconds);
    state.refreshSeconds = Number(refreshIntervalEl.value) || 10;
  }
  if (assetSearchEl) {
    assetSearchEl.value = formatAssetSearchValue(getSelectedAsset());
  }
  if (assetGroupEl) {
    assetGroupEl.value = state.selectedAssetGroup || "ALL";
  }
  if (alertModeEl) {
    alertModeEl.value = state.alertMode;
    state.alertMode = alertModeEl.value || "balanced";
  }
  if (replayModeEl) {
    replayModeEl.value = state.replayMode;
    state.replayMode = replayModeEl.value || "off";
  }
  if (replayStepEl) {
    replayStepEl.value = String(state.replayStep);
    state.replayStep = Math.max(0, Number(replayStepEl.value) || 0);
  }
  if (journalOutcomeFilterEl) {
    journalOutcomeFilterEl.value = state.journalOutcomeFilter;
    state.journalOutcomeFilter = journalOutcomeFilterEl.value || "ALL";
  }
  if (journalEvalHorizonEl) {
    journalEvalHorizonEl.value = String(state.journalEvalHorizonHours);
    state.journalEvalHorizonHours = Math.max(1, Number(journalEvalHorizonEl.value) || 4);
  }
  if (layoutModeEl) {
    layoutModeEl.value = state.layoutMode;
  }
  applyLayoutMode(state.layoutMode);
  if (macroImpactFilterEl) {
    macroImpactFilterEl.value = state.macroImpactFilter;
    state.macroImpactFilter = macroImpactFilterEl.value || "ALL";
  }
  if (macroCategoryFilterEl) {
    macroCategoryFilterEl.value = state.macroCategoryFilter;
    state.macroCategoryFilter = macroCategoryFilterEl.value || "ALL";
  }
  if (notifyChannelEl) {
    notifyChannelEl.value = state.notifyChannel;
    state.notifyChannel = notifyChannelEl.value || "none";
  }
  if (notifyWebhookUrlEl) {
    notifyWebhookUrlEl.value = state.notifyWebhookUrl || "";
    state.notifyWebhookUrl = notifyWebhookUrlEl.value.trim();
  }
  if (telegramBotTokenEl) {
    telegramBotTokenEl.value = state.telegramBotToken || "";
    state.telegramBotToken = telegramBotTokenEl.value.trim();
  }
  if (telegramChatIdEl) {
    telegramChatIdEl.value = state.telegramChatId || "";
    state.telegramChatId = telegramChatIdEl.value.trim();
  }
  if (notifyStatusEl) {
    notifyStatusEl.textContent = state.notifyChannel === "none" ? "Notifiche esterne disattivate" : `Canale attivo: ${state.notifyChannel}`;
  }
  applyAuthUi();
  if (cotCategoryEl) {
    cotCategoryEl.value = state.cotChartCategory;
    state.cotChartCategory = cotCategoryEl.value;
  }
  if (cotMetricEl) {
    cotMetricEl.value = state.cotMetric;
    state.cotMetric = cotMetricEl.value;
  }
  if (cotLookbackEl) {
    cotLookbackEl.value = String(state.cotLookback || 52);
    state.cotLookback = Number(cotLookbackEl.value) || 52;
  }
  if (cotChartHeightEl) {
    state.cotChartHeight = Number(cotChartHeightEl.value) || 540;
    applyCotPanelHeight();
  }

  const cachedPrice = loadCache(getAssetScopedCacheKey(CACHE_KEYS.PRICE), PRICE_CACHE_MAX_AGE_MS);
  if (cachedPrice?.prices?.length) {
    state.priceData = {
      source: `${cachedPrice.source} (cache avvio)`,
      snapshot: cachedPrice.snapshot || null,
      prices: cachedPrice.prices.map((p) => ({ date: new Date(p.date), close: Number(p.close) })),
    };
    state.marketSnapshot = cachedPrice.snapshot || null;
    state.marketSymbol = cachedPrice.snapshot?.ticker || null;
  }

  const cachedCot = loadCache(getAssetScopedCacheKey(CACHE_KEYS.COT), COT_CACHE_MAX_AGE_MS);
  if (cachedCot?.rows?.length) {
    state.cotData = cachedCot.rows.map((r) => ({ ...r, date: new Date(r.date) }));
    state.cotSource = `${cachedCot.source} (cache avvio)`;
  }
  const cachedMacro = loadCache(CACHE_KEYS.MACRO, MACRO_CACHE_MAX_AGE_MS);
  if (cachedMacro?.rows?.length) {
    state.macroEvents = cachedMacro.rows
      .map((r) => ({ ...r, date: parseMacroDate(r.date) }))
      .filter((r) => r.date instanceof Date && !Number.isNaN(r.date.getTime()));
    state.macroSource = `${cachedMacro.source || "cache macro"} (cache avvio)`;
    state.macroLastFetchAt = cachedMacro.fetchedAt ? Date.parse(cachedMacro.fetchedAt) || 0 : 0;
  }

  ensureResizeObservers();
  wireEvents();
  wireRealtimeLifecycleRefresh();
  refreshMacroIfStale({ force: true });
  setActivePage(state.activePage || "cot");
  if (state.priceData || state.cotData) {
    renderDashboard();
    lastUpdatedEl.textContent = `Ultimo aggiornamento: ${formatDateTime(new Date())} (cache avvio)`;
  }
  await loadDataAndRender();
  restartAutoRefresh();
}

init();
