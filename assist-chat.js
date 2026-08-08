/**
 * Leona.Lab — assistente landing (FAQ conversazionale).
 * Nessuna API esterna: risponde solo su contenuti del prodotto.
 */
(function () {
  const SUPPORT_EMAIL = "supportleonalab@gmail.com";

  const QUICK = [
    { label: "Cos'è?", q: "cos'è leona.lab" },
    { label: "Prezzi", q: "quanto costa" },
    { label: "Cosa include", q: "cosa include" },
    { label: "Come iniziare", q: "come inizio" },
    { label: "Assistenza", q: "contatto assistenza" },
  ];

  const FAQS = [
    {
      id: "cosa",
      keys: [
        "cos'è",
        "cos e",
        "cosa è",
        "cosa e",
        "che cos",
        "leona",
        "prodotto",
        "piattaforma",
        "desk",
        "a cosa serve",
      ],
      answer:
        "Leona.Lab è un desk multi-asset per trader: COT, stagionalità, valuation, macro, news e segnali in un solo flusso.\n\nTi aiuta a costruire un bias LONG / SHORT / WAIT — senza sostituire la tua analisi. Non è consulenza finanziaria.",
    },
    {
      id: "prezzi",
      keys: [
        "prezz",
        "cost",
        "piano",
        "piani",
        "abbonament",
        "mensile",
        "annuale",
        "lifetime",
        "euro",
        "€",
        "pagare",
        "pagamento",
        "checkout",
        "stripe",
      ],
      answer:
        "Piani attuali (stesso accesso completo):\n• Mensile — 24,90 €/mese (disdici quando vuoi)\n• Annuale — 219,90 €/anno (~18,33 €/mese)\n• Lifetime — 2.999,90 € una tantum\n\nIl pagamento apre la registrazione. Dettagli e checkout: /prezzi",
    },
    {
      id: "include",
      keys: [
        "include",
        "funzional",
        "feature",
        "tool",
        "moduli",
        "cosa c'è",
        "cosa c e",
        "cot",
        "stagional",
        "valuation",
        "macro",
        "news",
        "segnal",
        "timing",
        "giorni del mese",
      ],
      answer:
        "Nel desk trovi:\n• Timing giorni del mese (esclusiva)\n• Signal Center (LONG / SHORT / WAIT)\n• COT Intelligence\n• Supreme Valuation (scala −100…+100)\n• Macro Calendar\n• Breaking News\n\nTutto nello stesso workflow, su Forex, Metalli, Indici e Agricoli.",
    },
    {
      id: "come",
      keys: [
        "come funziona",
        "come si usa",
        "workflow",
        "flusso",
        "passi",
        "routine",
      ],
      answer:
        "Flusso tipico in tre passi:\n1) Scegli mercato e timeframe\n2) Leggi contesto (prezzo, COT, valuation, stagionalità + timing giorno)\n3) Conferma direzione nel Signal Center\n\nPoi decidi tu. Non è un segnale automatico da seguire alla cieca.",
    },
    {
      id: "iniziare",
      keys: [
        "iniziare",
        "inizio",
        "registr",
        "iscriv",
        "account",
        "acced",
        "login",
        "provare",
        "prova",
        "entrare",
      ],
      answer:
        "Per iniziare:\n1) Vai su /prezzi e scegli un piano\n2) Completa il pagamento\n3) Registrati con l'email usata al checkout\n4) Accedi da /login e apri il desk\n\nHai già un account? → /login",
    },
    {
      id: "disdici",
      keys: [
        "disdic",
        "cancell",
        "annull",
        "rimbors",
        "gestisci abbonamento",
        "stripe portal",
        "smettere",
      ],
      answer:
        "Puoi gestire o disdire l'abbonamento dal desk (Gestisci abbonamento) o scrivendo a " +
        SUPPORT_EMAIL +
        ".\n\nIndica email account e piano (mensile / annuale / lifetime).",
    },
    {
      id: "assistenza",
      keys: [
        "assistenza",
        "supporto",
        "aiuto",
        "contatto",
        "email",
        "scrivere",
        "problema",
        "non riesco",
        "errore",
        "bug",
        "login non",
      ],
      answer:
        "Assistenza umana: " +
        SUPPORT_EMAIL +
        "\n\nPer velocizzare, indica:\n• email account\n• piano\n• breve descrizione del problema\n\nPagina: /assistenza\nAiutiamo su: accesso, registrazione post-pagamento, abbonamento, problemi tecnici, privacy.",
    },
    {
      id: "disclaimer",
      keys: [
        "consulenza",
        "garanzia",
        "guadagn",
        "rischio",
        "legale",
        "disclaimer",
        "responsabil",
      ],
      answer:
        "Leona.Lab fornisce strumenti informativi di analisi. Non è consulenza finanziaria personalizzata, non garantisce risultati di trading e non sostituisce il tuo giudizio.\n\nI mercati comportano rischio di perdita. Vedi anche /termini e /privacy.",
    },
    {
      id: "asset",
      keys: ["forex", "metalli", "oro", "indici", "agricol", "mercati", "asset", "xau", "gold"],
      answer:
        "Il desk copre Forex, Metalli, Indici e Materie agricole. Scegli tipologia e asset dai filtri in alto, poi leggi COT, stagionalità, valuation e segnali sullo stesso mercato.",
    },
  ];

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "'")
      .trim();
  }

  function scoreFaq(query, faq) {
    const q = normalize(query);
    if (!q) return 0;
    let score = 0;
    for (const key of faq.keys) {
      const k = normalize(key);
      if (!k) continue;
      if (q === k) score += 12;
      else if (q.includes(k)) score += 6;
      else if (k.length > 3 && k.includes(q)) score += 3;
    }
    return score;
  }

  function answerFor(query) {
    const q = normalize(query);
    if (!q) {
      return "Scrivi una domanda su Leona.Lab, oppure usa i pulsanti sotto.";
    }

    let best = null;
    let bestScore = 0;
    for (const faq of FAQS) {
      const s = scoreFaq(q, faq);
      if (s > bestScore) {
        bestScore = s;
        best = faq;
      }
    }

    if (best && bestScore >= 3) {
      return best.answer;
    }

    return (
      "Non ho una risposta precisa su questo.\n\nPosso aiutarti su: cos'è Leona.Lab, prezzi, cosa include, come iniziare, disdetta e assistenza.\n\nOppure scrivi a " +
      SUPPORT_EMAIL +
      " — oppure apri /assistenza."
    );
  }

  function el(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else node.setAttribute(k, v);
      });
    }
    return node;
  }

  function linkify(text) {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return escaped
      .replace(
        /(\/prezzi|\/login|\/assistenza|\/termini|\/privacy|\/app)/g,
        '<a href="$1">$1</a>'
      )
      .replace(
        /(supportleonalab@gmail\.com)/g,
        '<a href="mailto:$1">$1</a>'
      )
      .replace(/\n/g, "<br>");
  }

  function mount() {
    if (document.getElementById("llAssistRoot")) return;

    const root = el("div", "ll-assist", { id: "llAssistRoot" });

    const panel = el("section", "ll-assist-panel", {
      id: "llAssistPanel",
      role: "dialog",
      "aria-label": "Assistente Leona.Lab",
      "aria-hidden": "true",
    });

    const head = el("header", "ll-assist-head");
    const headText = el("div", "ll-assist-head-text");
    headText.appendChild(el("strong", "", { text: "Assistente Leona.Lab" }));
    headText.appendChild(
      el("span", "ll-assist-status", { text: "Risposte su prodotto e piani" })
    );
    const closeBtn = el("button", "ll-assist-close", {
      type: "button",
      "aria-label": "Chiudi chat",
      text: "×",
    });
    head.appendChild(headText);
    head.appendChild(closeBtn);

    const messages = el("div", "ll-assist-messages", {
      id: "llAssistMessages",
      role: "log",
      "aria-live": "polite",
    });

    const chips = el("div", "ll-assist-chips", { id: "llAssistChips" });
    QUICK.forEach((item) => {
      const chip = el("button", "ll-assist-chip", { type: "button", text: item.label });
      chip.addEventListener("click", () => ask(item.q, item.label));
      chips.appendChild(chip);
    });

    const form = el("form", "ll-assist-form", { id: "llAssistForm" });
    const input = el("input", "ll-assist-input", {
      id: "llAssistInput",
      type: "text",
      placeholder: "Scrivi una domanda…",
      autocomplete: "off",
      maxlength: "240",
      "aria-label": "Domanda",
    });
    const send = el("button", "ll-assist-send", {
      type: "submit",
      "aria-label": "Invia",
      text: "Invia",
    });
    form.appendChild(input);
    form.appendChild(send);

    const foot = el("p", "ll-assist-foot", {
      html:
        'Bot informativo · non è consulenza · <a href="/assistenza">Assistenza umana</a>',
    });

    panel.appendChild(head);
    panel.appendChild(messages);
    panel.appendChild(chips);
    panel.appendChild(form);
    panel.appendChild(foot);

    const fab = el("button", "ll-assist-fab", {
      id: "llAssistFab",
      type: "button",
      "aria-label": "Apri assistente",
      "aria-expanded": "false",
      "aria-controls": "llAssistPanel",
    });
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 4v2h12V8H6zm0 4v2h8v-2H6z"/></svg>';

    root.appendChild(panel);
    root.appendChild(fab);
    document.body.appendChild(root);

    function addMessage(role, text) {
      const bubble = el("div", `ll-assist-msg ll-assist-msg-${role}`);
      if (role === "bot") bubble.innerHTML = linkify(text);
      else bubble.textContent = text;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function setOpen(open) {
      root.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      fab.setAttribute("aria-label", open ? "Chiudi assistente" : "Apri assistente");
      if (open) {
        if (!messages.childElementCount) {
          addMessage(
            "bot",
            "Ciao — sono l'assistente Leona.Lab.\nPosso spiegarti cos'è il desk, i piani, cosa include e come iniziare.\n\nPer problemi account o pagamenti: " +
              SUPPORT_EMAIL
          );
        }
        setTimeout(() => input.focus(), 180);
      }
    }

    function ask(query, displayLabel) {
      const text = String(query || "").trim();
      if (!text) return;
      setOpen(true);
      addMessage("user", displayLabel || text);
      const typing = el("div", "ll-assist-msg ll-assist-msg-bot ll-assist-typing", {
        text: "…",
      });
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      window.setTimeout(() => {
        typing.remove();
        addMessage("bot", answerFor(text));
      }, 280 + Math.min(420, text.length * 8));
    }

    fab.addEventListener("click", () => setOpen(!root.classList.contains("is-open")));
    closeBtn.addEventListener("click", () => setOpen(false));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      input.value = "";
      ask(value);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && root.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
