const statusEl = document.getElementById("pricingStatus");

function setStatus(text, cls = "") {
  if (!statusEl) return;
  statusEl.textContent = text || "";
  statusEl.classList.remove("up", "down");
  if (cls) statusEl.classList.add(cls);
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

async function startCheckout(plan) {
  setStatus("Apertura pagamento sicuro Stripe...");
  try {
    const payload = await apiJson("/api/checkout", {
      method: "POST",
      body: { plan },
    });
    if (!payload?.url) throw new Error("URL checkout mancante");
    window.location.href = payload.url;
  } catch (error) {
    setStatus(`Pagamento non disponibile: ${error.message}`, "down");
  }
}

async function initPricing() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("canceled") === "1") {
    setStatus("Pagamento annullato. Puoi riprovare quando vuoi.", "down");
  }

  try {
    const config = await apiJson("/api/billing/config");
    if (!config.stripeEnabled) {
      setStatus(
        "Pagamenti in configurazione: manca la chiave Stripe sul server. Nel frattempo i piani sono visibili.",
        "down"
      );
    } else {
      setStatus("Pagamento sicuro con Stripe. Dopo il pagamento crei l'account.", "up");
    }
  } catch {
    // ignore config errors
  }

  document.querySelectorAll(".checkout-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.getAttribute("data-plan");
      if (!plan) return;
      btn.disabled = true;
      startCheckout(plan).finally(() => {
        btn.disabled = false;
      });
    });
  });
}

initPricing();
