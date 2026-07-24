const AUTH_TOKEN_KEY = "leona_lab_auth_token";

const emailEl = document.getElementById("loginEmail");
const passwordEl = document.getElementById("loginPassword");
const submitBtn = document.getElementById("loginSubmitBtn");
const statusEl = document.getElementById("loginStatus");

function setStatus(text, cls = "") {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.classList.remove("up", "down");
  if (cls) statusEl.classList.add(cls);
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
      const payload = await response.json().catch(() => ({}));
      if (payload.accessAllowed === false || payload.user?.accessAllowed === false) {
        window.location.href = "/prezzi";
        return;
      }
      window.location.href = "/app";
    }
  } catch {
    // stay on login
  }
}

async function doLogin() {
  const email = emailEl?.value?.trim() || "";
  const password = passwordEl?.value || "";
  if (!email || !password) {
    setStatus("Inserisci email e password", "down");
    return;
  }
  setStatus("Login in corso...");
  try {
    const payload = await apiJson("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    saveAuthToken(payload.token);
    if (payload.accessAllowed === false || payload.user?.accessAllowed === false) {
      setStatus("Account senza abbonamento attivo. Reindirizzo ai piani...", "down");
      window.location.href = "/prezzi";
      return;
    }
    setStatus("Login riuscito. Apertura dashboard...", "up");
    window.location.href = "/app";
  } catch (error) {
    const msg = String(error.message || "");
    if (/credenziali|non valide|401/i.test(msg)) {
      setStatus("Credenziali non valide. Se sei admin e non hai ancora un account: vai su Registrati (senza pagare).", "down");
    } else {
      setStatus(`Login fallito: ${error.message}`, "down");
    }
  }
}

submitBtn?.addEventListener("click", doLogin);

passwordEl?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") doLogin();
});

emailEl?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") passwordEl?.focus();
});

redirectIfAlreadyLoggedIn();
