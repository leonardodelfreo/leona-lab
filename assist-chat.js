/**
 * Leona.Lab — assistente landing (FAQ conversazionale).
 * Matching per intent + parole chiave pesate (niente API esterne).
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

  /**
   * Ogni intent ha:
   * - any: frase/parola che alza lo score se presente nella domanda
   * - all: se presenti insieme, boost forte (es. "quanto"+"costa")
   * - exclude: se presenti, abbassa lo score (evita risposte sbagliate)
   * - priority: tie-break (più alto = preferito a parità)
   */
  const INTENTS = [
    {
      id: "saluto",
      priority: 1,
      any: ["ciao", "salve", "buongiorno", "buonasera", "hey", "hola", "hello", "hi"],
      answer:
        "Ciao! Dimmi pure cosa ti serve su Leona.Lab.\n\nEsempi: «quanto costa?», «cosa include?», «come funziona COT?», «come inizio?»",
    },
    {
      id: "prezzi",
      priority: 20,
      any: [
        "prezzo",
        "prezzi",
        "costo",
        "costa",
        "costano",
        "costi",
        "abbonamento",
        "abbonamenti",
        "piano",
        "piani",
        "mensile",
        "annuale",
        "lifetime",
        "tariffa",
        "tariffe",
        "pagamento",
        "pagare",
        "checkout",
        "stripe",
        "euro",
        "€",
        "sconto",
        "offerta",
      ],
      all: [
        ["quanto", "costa"],
        ["quanto", "costano"],
        ["che", "prezzo"],
        ["quale", "piano"],
      ],
      answer:
        "Piani attuali (stesso accesso completo al desk):\n\n• Mensile — 24,90 €/mese (disdici quando vuoi)\n• Annuale — 219,90 €/anno (~18,33 €/mese equivalenti)\n• Lifetime — 2.999,90 € una tantum\n\nIl pagamento apre la registrazione. Dettagli e checkout: /prezzi",
    },
    {
      id: "cot",
      priority: 22,
      any: [
        "cot",
        "commitment of traders",
        "positioning",
        "commerciali",
        "non-commercial",
        "crowded",
        "come funziona cot",
        "cos'e cot",
        "cos'è cot",
      ],
      all: [
        ["come", "cot"],
        ["funziona", "cot"],
        ["spiega", "cot"],
      ],
      answer:
        "COT Intelligence mostra il positioning (Commercial / Non-Commercial / Retail): chi è crowded, chi fa hedging e dove il prezzo diverge dal flusso.\n\nLa trovi nel tab COT del desk, dopo login. Si usa insieme a stagionalità, valuation e segnali — non da sola.",
    },
    {
      id: "stagionalita",
      priority: 22,
      any: [
        "stagionalita",
        "stagionalità",
        "stagione",
        "seasonality",
        "timing",
        "giorno del mese",
        "giorni del mese",
        "long day",
        "short day",
      ],
      all: [
        ["come", "stagion"],
        ["funziona", "stagion"],
        ["come", "timing"],
      ],
      answer:
        "Nella Stagionalità trovi la curva Supreme Seasonality e l’esclusiva Timing giorni del mese: per ogni mese, il giorno storicamente più favorevole al long e allo short + bias del mese.\n\nDati su storico reale dell’asset. Da usare con COT, Valuation e Signal Center.",
    },
    {
      id: "valuation",
      priority: 22,
      any: [
        "valuation",
        "valutazione",
        "overvalued",
        "undervalued",
        "over/under",
        "supreme valuation",
      ],
      all: [
        ["come", "valuation"],
        ["funziona", "valuation"],
        ["come", "valutazione"],
      ],
      answer:
        "Supreme Valuation confronta l’asset vs DXY, oro (GC=F) e bonds su scala −100…+100 (stile TradingView).\n\nSoglie indicative ±75 (over / under). Tab Valuation nel desk. Nota: su Gold Spot la serie chart usa GC=F.",
    },
    {
      id: "macro",
      priority: 21,
      any: ["macro", "calendario", "calendar", "fomc", "nfp", "cpi"],
      all: [
        ["come", "macro"],
        ["calendario", "macro"],
      ],
      answer:
        "Il Macro Calendar elenca gli eventi che muovono i mercati, con stato feed chiaro (LIVE / CACHE).\n\nLo usi per il contesto prima di decidere: non è un segnale operativo da solo.",
    },
    {
      id: "news",
      priority: 21,
      any: ["news", "notizie", "breaking", "geopolitic"],
      answer:
        "Breaking News porta contesto geopolitico e eventi globali in tempo reale nel desk.\n\nÈ informazione di contesto, non un segnale di trading automatico.",
    },
    {
      id: "segnali",
      priority: 21,
      any: ["segnale", "segnali", "signal center", "playbook"],
      all: [
        ["bias", "long"],
        ["bias", "short"],
        ["long", "short", "wait"],
      ],
      exclude: ["giorno", "giorni", "timing", "stagion"],
      answer:
        "Signal Center propone un bias LONG / SHORT / WAIT con confidenza e playbook leggibile.\n\nÈ una checklist finale sul contesto (COT, stagione, valuation…), non un ordine automatico da seguire alla cieca.",
    },
    {
      id: "include",
      priority: 14,
      any: [
        "include",
        "inclusi",
        "funzionalita",
        "funzionalità",
        "funzioni",
        "feature",
        "moduli",
        "tool",
        "strumenti",
        "cosa offre",
        "cosa c'e",
        "cosa c'è",
        "che include",
        "contenuto",
      ],
      all: [
        ["cosa", "include"],
        ["cosa", "c'e"],
        ["cosa", "c'è"],
      ],
      answer:
        "Nel desk trovi:\n\n• Timing giorni del mese (esclusiva)\n• Signal Center (LONG / SHORT / WAIT)\n• COT Intelligence\n• Supreme Valuation (−100…+100)\n• Macro Calendar\n• Breaking News\n\nMercati: Forex, Metalli, Indici e Agricoli. Stesso accesso su tutti i piani.",
    },
    {
      id: "come",
      priority: 9,
      any: ["workflow", "flusso", "routine", "passi", "come leggere"],
      all: [
        ["come", "funziona"],
        ["come", "si", "usa"],
        ["come", "uso"],
      ],
      // se chiede un modulo specifico, vince l'intent del modulo
      exclude: [
        "cot",
        "valuation",
        "valutazione",
        "stagion",
        "timing",
        "macro",
        "news",
        "breaking",
        "segnale",
        "segnali",
        "prezz",
        "cost",
      ],
      answer:
        "Flusso tipico in 3 passi:\n\n1) Scegli mercato e timeframe\n2) Leggi il contesto (prezzo, COT, valuation, stagionalità + timing giorno)\n3) Conferma la direzione nel Signal Center\n\nPoi decidi tu. Non sostituisce la tua analisi.",
    },
    {
      id: "iniziare",
      priority: 16,
      any: [
        "iniziare",
        "inizio",
        "iscrivermi",
        "iscrizione",
        "registrarmi",
        "registrazione",
        "provare",
        "prova",
        "entrare",
        "attivare",
        "comprare",
        "acquistare",
      ],
      all: [
        ["come", "inizio"],
        ["come", "iniziare"],
        ["come", "mi", "registro"],
        ["come", "accedo"],
        ["dove", "pago"],
      ],
      answer:
        "Per iniziare:\n\n1) Vai su /prezzi e scegli un piano\n2) Completa il pagamento (Stripe)\n3) Registrati con la stessa email del checkout\n4) Accedi da /login e apri il desk (/app)\n\nHai già un account? → /login",
    },
    {
      id: "login",
      priority: 19,
      any: [
        "login",
        "accedi",
        "accesso",
        "password",
        "non entro",
        "non riesco ad accedere",
        "credenziali",
        "problema di login",
        "problemi di login",
      ],
      all: [
        ["non", "riesco", "entrare"],
        ["non", "riesco", "acced"],
        ["problema", "login"],
        ["problemi", "login"],
        ["ho", "dimenticato"],
        ["problemi", "accesso"],
      ],
      answer:
        "Login: /login\n\nSe hai pagato ma non hai ancora l’account, registrati da /registrati con l’email del checkout.\n\nSe non entri comunque, scrivi a " +
        SUPPORT_EMAIL +
        " indicando email e piano.",
    },
    {
      id: "disdici",
      priority: 19,
      any: [
        "disdici",
        "disdire",
        "disdetta",
        "cancellare",
        "cancello",
        "annullare",
        "rimborso",
        "rimbors",
        "smettere",
        "chiudere abbonamento",
        "gestisci abbonamento",
      ],
      answer:
        "Puoi gestire o disdire l’abbonamento dal desk → «Gestisci abbonamento», oppure scrivendo a " +
        SUPPORT_EMAIL +
        ".\n\nIndica: email account + piano (mensile / annuale / lifetime).",
    },
    {
      id: "asset",
      priority: 12,
      any: [
        "forex",
        "metalli",
        "metallo",
        "oro",
        "gold",
        "xau",
        "xauusd",
        "indici",
        "agricoli",
        "mercati",
        "quali asset",
        "quali mercati",
      ],
      answer:
        "Il desk copre Forex, Metalli, Indici e Materie agricole.\n\nDai filtri in alto scegli Tipologia + Asset, poi leggi COT, stagionalità, valuation e segnali sullo stesso mercato.",
    },
    {
      id: "disclaimer",
      priority: 11,
      any: [
        "consulenza",
        "garanzia",
        "garantite",
        "guadagno",
        "guadagni",
        "rischio",
        "perdita",
        "legale",
        "disclaimer",
        "responsabilita",
        "responsabilità",
      ],
      answer:
        "Leona.Lab fornisce strumenti informativi di analisi.\n\nNon è consulenza finanziaria personalizzata, non garantisce risultati di trading e non sostituisce il tuo giudizio. I mercati comportano rischio di perdita.\n\nVedi /termini e /privacy.",
    },
    {
      id: "assistenza",
      priority: 10,
      any: [
        "assistenza",
        "supporto",
        "contatto",
        "contattare",
        "email supporto",
        "scrivere a",
        "problema tecnico",
        "bug",
        "errore",
        "non funziona",
        "help desk",
      ],
      all: [
        ["mi", "aiuti"],
        ["ho", "un", "problema"],
        ["serve", "aiuto"],
      ],
      exclude: ["login", "password", "acced"],
      answer:
        "Assistenza umana: " +
        SUPPORT_EMAIL +
        "\n\nPer una risposta veloce indica:\n• email account\n• piano\n• breve descrizione del problema\n\nPagina: /assistenza\nAiutiamo su: accesso, registrazione post-pagamento, abbonamento, problemi tecnici, privacy.",
    },
    {
      id: "cosa",
      priority: 8,
      any: [
        "cos'e",
        "cos'è",
        "cose leona",
        "che cos'e",
        "che cos'è",
        "a cosa serve",
        "che prodotto",
        "che piattaforma",
        "spiegami leona",
        "cos e leona",
      ],
      all: [
        ["cos", "e"],
        ["cosa", "e"],
        ["che", "cose"],
        ["a", "cosa", "serve"],
      ],
      answer:
        "Leona.Lab è un desk multi-asset per trader: COT, stagionalità, valuation, macro, news e segnali in un solo flusso.\n\nTi aiuta a costruire un bias LONG / SHORT / WAIT — senza sostituire la tua analisi. Non è consulenza finanziaria.",
    },
  ];

  const STOP = new Set([
    "il",
    "lo",
    "la",
    "i",
    "gli",
    "le",
    "un",
    "uno",
    "una",
    "di",
    "da",
    "in",
    "su",
    "per",
    "con",
    "a",
    "e",
    "o",
    "ma",
    "mi",
    "ti",
    "si",
    "ci",
    "vi",
    "che",
    "dei",
    "del",
    "della",
    "delle",
    "degli",
    "al",
    "alla",
    "ai",
    "alle",
    "nel",
    "nella",
    "nei",
    "nelle",
    "the",
    "and",
    "or",
    "of",
    "to",
    "is",
    "are",
    "please",
    "vorrei",
    "volevo",
    "sapere",
    "dimmi",
    "parlami",
    "spiega",
    "spiegami",
    "info",
    "informazioni",
    "domanda",
  ]);

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’`´]/g, "'")
      .replace(/€/g, " euro ")
      .replace(/[^a-z0-9€'\s./+-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(q) {
    return normalize(q)
      .split(" ")
      .map((w) => w.replace(/^'+|'+$/g, ""))
      .filter((w) => w && w.length > 1 && !STOP.has(w));
  }

  function hasPhrase(q, phrase) {
    const p = normalize(phrase);
    if (!p) return false;
    if (q.includes(p)) return true;
    // token subsequence for multi-word
    const pt = p.split(" ").filter(Boolean);
    if (pt.length < 2) {
      const tokens = new Set(tokenize(q));
      return tokens.has(p);
    }
    const qt = normalize(q).split(" ").filter(Boolean);
    for (let i = 0; i <= qt.length - pt.length; i++) {
      let ok = true;
      for (let j = 0; j < pt.length; j++) {
        if (qt[i + j] !== pt[j]) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  }

  function scoreIntent(query, intent) {
    const q = normalize(query);
    if (!q) return 0;
    const tokens = tokenize(query);
    let score = 0;

    for (const phrase of intent.any || []) {
      const p = normalize(phrase);
      if (!p) continue;
      if (q === p) score += 24;
      else if (p.includes(" ") && q.includes(p)) score += 16;
      else if (!p.includes(" ") && tokens.includes(p)) score += 12;
      else if (p.length >= 5 && q.includes(p)) score += 8;
      else if (p.length >= 6) {
        // soft stem: token starts with key or key starts with token
        for (const t of tokens) {
          if (t.length < 4) continue;
          if (t.startsWith(p.slice(0, Math.min(5, p.length))) || p.startsWith(t.slice(0, Math.min(5, t.length)))) {
            score += 5;
            break;
          }
        }
      }
    }

    for (const group of intent.all || []) {
      const parts = group.map(normalize).filter(Boolean);
      if (parts.length && parts.every((p) => hasPhrase(q, p) || tokens.includes(p) || q.includes(p))) {
        score += 18 + parts.length * 2;
      }
    }

    for (const ex of intent.exclude || []) {
      if (hasPhrase(q, ex) || q.includes(normalize(ex))) score -= 14;
    }

    // generic "aiuto" alone shouldn't win assistenza over a clear topic
    if (intent.id === "assistenza" && /\b(aiuto|aiutami)\b/.test(q) && score < 20) {
      score += 4;
    }

    // "leona" alone → product overview, but don't steal specific intents
    if (intent.id === "cosa" && /\bleona\b/.test(q) && score > 0) {
      score += 3;
    }

    if (score > 0) score += (intent.priority || 0) * 0.01;
    return score;
  }

  function rankIntents(query) {
    return INTENTS.map((intent) => ({ intent, score: scoreIntent(query, intent) }))
      .filter((x) => x.score >= 8)
      .sort((a, b) => b.score - a.score || (b.intent.priority || 0) - (a.intent.priority || 0));
  }

  function answerFor(query) {
    const raw = String(query || "").trim();
    const q = normalize(raw);
    if (!q) {
      return "Scrivi una domanda su Leona.Lab, oppure usa i pulsanti sotto.";
    }

    // short greeting-only
    if (/^(ciao|salve|buongiorno|buonasera|hey|hola|hello|hi)[!?. ]*$/i.test(raw.trim())) {
      return INTENTS.find((i) => i.id === "saluto").answer;
    }

    const ranked = rankIntents(raw);
    if (!ranked.length) {
      return (
        "Non ho capito bene la domanda.\n\nProva a essere più specifico, ad esempio:\n• «Quanto costa il piano annuale?»\n• «Cosa include il desk?»\n• «Come funziona la Valuation?»\n• «Come inizio?»\n\nOppure scrivi a " +
        SUPPORT_EMAIL +
        " · /assistenza"
      );
    }

    const top = ranked[0];
    const second = ranked[1];

    // multi-intent: es. "prezzi e cosa include"
    const multiIds = new Set([
      "prezzi",
      "include",
      "come",
      "iniziare",
      "cot",
      "stagionalita",
      "valuation",
      "segnali",
      "macro",
      "news",
    ]);
    const joined = [];
    const seen = new Set();
    for (const row of ranked.slice(0, 3)) {
      if (row.score < 10) break;
      if (!multiIds.has(row.intent.id)) continue;
      if (seen.has(row.intent.id)) continue;
      // primo sempre; successivi solo se competitivi o domanda composta
      if (
        joined.length === 0 ||
        (/\b(e|anche|piu|più|,|\/)\b/.test(normalize(raw)) && row.score >= 10) ||
        top.score - row.score < 8
      ) {
        joined.push(row.intent.answer);
        seen.add(row.intent.id);
      }
      if (joined.length >= 2) break;
    }
    if (joined.length >= 2) return joined.join("\n\n—\n\n");

    return top.intent.answer;
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
        /(\/prezzi|\/login|\/assistenza|\/termini|\/privacy|\/app|\/registrati)/g,
        '<a href="$1">$1</a>'
      )
      .replace(/(supportleonalab@gmail\.com)/g, '<a href="mailto:$1">$1</a>')
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
      placeholder: "Es. quanto costa? come funziona COT?",
      autocomplete: "off",
      maxlength: "280",
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
            "Ciao — sono l’assistente Leona.Lab.\nChiedimi pure prezzi, moduli (COT, Valuation, Timing…), come iniziare o assistenza.\n\nEmail umana: " +
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
      }, 220 + Math.min(380, text.length * 6));
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

    // expose for quick manual tests in console
    window.__llAssistAnswer = answerFor;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
