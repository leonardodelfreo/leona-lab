const AUTH_TOKEN_KEY = "leona_lab_auth_token";

const previewLightboxEl = document.getElementById("previewLightbox");
const previewLightboxImageEl = document.getElementById("previewLightboxImage");
const previewLightboxCloseEl = document.getElementById("previewLightboxClose");
const navToggleEl = document.getElementById("navToggle");
const landingNavEl = document.getElementById("landingNav");

async function showDashboardShortcutIfLoggedIn() {
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
    if (!response.ok) return;
    const accessSection = document.getElementById("accesso");
    if (!accessSection) return;
    let tip = accessSection.querySelector(".logged-in-tip");
    if (!tip) {
      tip = document.createElement("p");
      tip.className = "muted logged-in-tip";
      tip.innerHTML = 'Sei gia autenticato. <a href="/app">Apri la dashboard</a>';
      accessSection.appendChild(tip);
    }
  } catch {
    // stay on landing
  }
}

function closePreviewLightbox() {
  if (!previewLightboxEl) return;
  previewLightboxEl.classList.remove("open");
  previewLightboxEl.setAttribute("aria-hidden", "true");
  if (previewLightboxImageEl) {
    previewLightboxImageEl.src = "";
  }
}

function setNavOpen(open) {
  if (!landingNavEl || !navToggleEl) return;
  landingNavEl.classList.toggle("is-open", open);
  navToggleEl.setAttribute("aria-expanded", open ? "true" : "false");
  navToggleEl.textContent = open ? "Chiudi" : "Menu";
}

document.querySelectorAll(".preview-clickable").forEach((imgEl) => {
  imgEl.addEventListener("click", () => {
    if (!previewLightboxEl || !previewLightboxImageEl) return;
    previewLightboxImageEl.src = imgEl.getAttribute("src") || "";
    previewLightboxImageEl.alt = imgEl.getAttribute("alt") || "Anteprima";
    previewLightboxEl.classList.add("open");
    previewLightboxEl.setAttribute("aria-hidden", "false");
  });
});

previewLightboxCloseEl?.addEventListener("click", closePreviewLightbox);

previewLightboxEl?.addEventListener("click", (event) => {
  if (event.target === previewLightboxEl) {
    closePreviewLightbox();
  }
});

navToggleEl?.addEventListener("click", () => {
  const open = !landingNavEl?.classList.contains("is-open");
  setNavOpen(open);
});

landingNavEl?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePreviewLightbox();
    setNavOpen(false);
  }
});

showDashboardShortcutIfLoggedIn();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const heroVisual = document.querySelector(".landing-hero-visual img");
  if (heroVisual) {
    heroVisual.classList.add("hero-float");
  }
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}
