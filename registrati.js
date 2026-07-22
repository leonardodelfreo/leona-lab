const AUTH_TOKEN_KEY = "leona_lab_auth_token";

const emailEl = document.getElementById("regEmail");
const usernameEl = document.getElementById("regUsername");
const nameEl = document.getElementById("regName");
const passwordEl = document.getElementById("regPassword");
const submitBtn = document.getElementById("regSubmitBtn");
const statusEl = document.getElementById("regStatus");
const planLabelEl = document.getElementById("selectedPlanLabel");
const planPriceEl = document.getElementById("selectedPlanPrice");
const paymentGateEl = document.getElementById("paymentGateStatus");

const PLAN_INFO = {
  mensile: { label: "Mensile", price: "24,90 € / mese" },
  annuale: { label: "Annuale", price: "219,90 € / anno" },
  lifetime: { label: "Lifetime", price: "2.999,90 € una volta" },
};

let requirePayment = false;
let checkoutSessionId = "";

function getSelectedPlan() {
  const params = new URLSearchParams(window.location.search);
  const plan = String(params.get("plan") || "mensile").toLowerCase();
  return PLAN_INFO[plan] ? plan : "mensile";
}

function getSessionId() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get("session_id") || "").trim();
}

function setStatus(text, cls = "") {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.classList.remove("up", "down");
  if (cls) statusEl.classList.add(cls);
}

function setGate(text, cls = "") {
  if (!paymentGateEl) return;
  paymentGateEl.textContent = text;
  paymentGateEl.classList.remove("up", "down");
  if (cls) paymentGateEl.classList.add(cls);
}

function saveAuthToken(token) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

async function apiJson(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || `HTTP ${response.status}`);
  }
  return payload;
}

async function redirectIfAlreadyLoggedIn() {
  let token = null;
  try {
    token = localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    token = null;
  }
  if (!token) return;
  try {
    const response = await fetch("/api/auth/me", {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      window.location.href = "/app";
    }
  } catch {
    // stay on register
  }
}

function suggestUsernameFromEmail() {
  const email = emailEl?.value?.trim() || "";
  if (!email.includes("@") || usernameEl?.value?.trim()) return;
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32);
  if (base.length >= 3 && usernameEl) {
    usernameEl.value = base;
  }
}

async function doRegister() {
  const email = emailEl?.value?.trim() || "";
  const username = usernameEl?.value?.trim() || "";
  const displayName = nameEl?.value?.trim() || "";
  const password = passwordEl?.value || "";
  const plan = getSelectedPlan();

  if (!email || !password) {
    setStatus("Inserisci email e password", "down");
    return;
  }
  if (requirePayment && !checkoutSessionId) {
    setStatus("Completa prima il pagamento da /prezzi", "down");
    return;
  }
  setStatus("Creazione account...");
  try {
    const payload = await apiJson("/api/auth/register", {
      method: "POST",
      body: {
        email,
        username,
        displayName,
        password,
        plan,
        sessionId: checkoutSessionId || undefined,
      },
    });
    saveAuthToken(payload.token);
    setStatus("Account creato. Apertura dashboard...", "up");
    window.location.href = "/app";
  } catch (error) {
    setStatus(`Registrazione fallita: ${error.message}`, "down");
  }
}

async function initRegisterGate() {
  const selectedPlan = getSelectedPlan();
  const info = PLAN_INFO[selectedPlan];
  if (planLabelEl) planLabelEl.textContent = info.label;
  if (planPriceEl) planPriceEl.textContent = info.price;
  checkoutSessionId = getSessionId();

  try {
    const config = await apiJson("/api/billing/config");
    requirePayment = Boolean(config.requirePayment);
  } catch {
    requirePayment = false;
  }

  if (!requirePayment) {
    setGate("Modalita sviluppo: registrazione libera (Stripe non attivo).", "up");
    if (submitBtn) submitBtn.disabled = false;
    return;
  }

  if (!checkoutSessionId) {
    setGate("Per registrarti paga prima un piano su Piani.", "down");
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  try {
    const session = await apiJson(`/api/checkout/session?session_id=${encodeURIComponent(checkoutSessionId)}`);
    if (session.used) {
      setGate("Questo pagamento e gia stato usato per un account.", "down");
      if (submitBtn) submitBtn.disabled = true;
      return;
    }
    if (session.email && emailEl && !emailEl.value) {
      emailEl.value = session.email;
      suggestUsernameFromEmail();
    }
    if (session.plan && PLAN_INFO[session.plan]) {
      if (planLabelEl) planLabelEl.textContent = PLAN_INFO[session.plan].label;
      if (planPriceEl) planPriceEl.textContent = PLAN_INFO[session.plan].price;
    }
    setGate("Pagamento verificato. Completa i dati e crea l'account.", "up");
    if (submitBtn) submitBtn.disabled = false;
  } catch (error) {
    setGate(`Pagamento non valido: ${error.message}`, "down");
    if (submitBtn) submitBtn.disabled = true;
  }
}

submitBtn?.addEventListener("click", doRegister);
emailEl?.addEventListener("blur", suggestUsernameFromEmail);
passwordEl?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") doRegister();
});

redirectIfAlreadyLoggedIn();
initRegisterGate();
