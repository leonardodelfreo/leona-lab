/**
 * Leona.Lab — assistente landing.
 * Banca Q&A: tante domande tipiche + risposte variabili, matching sulla domanda giusta.
 */
(function () {
  const SUPPORT_EMAIL = "supportleonalab@gmail.com";

  const QUICK = [
    { label: "PayPal?", q: "si puo pagare con paypal?" },
    { label: "Lifetime", q: "quanto dura il lifetime?" },
    { label: "Perché abbonarsi?", q: "perche dovrei fare labbonamento?" },
    { label: "Come leggere COT", q: "come si legge il cot?" },
    { label: "Come iscriversi", q: "come mi iscrivo?" },
  ];

  /**
   * Ogni voce: domande tipiche + keywords forti + 2–4 risposte (varianti).
   * Il motore sceglie la VOCE giusta, poi una risposta a rotazione.
   */
  const QA = [
    // ——— PAGAMENTI / PAYPAL ———
    {
      id: "paypal",
      q: [
        "si puo pagare con paypal",
        "accettate paypal",
        "posso usare paypal",
        "pagamento paypal",
        "avete paypal",
        "checkout paypal",
        "pay pal",
      ],
      keys: ["paypal", "pay pal"],
      answers: [
        "Al momento il checkout è con Stripe (carte e metodi supportati da Stripe). PayPal non è attivo.\n\nSe ti serve un metodo specifico, scrivi a " +
          SUPPORT_EMAIL +
          ". Piani: /prezzi",
        "No, oggi non c’è PayPal: si paga via Stripe sul checkout di /prezzi.\n\nDopo il pagamento ti registri con la stessa email. Dubbi? " +
          SUPPORT_EMAIL,
        "PayPal non è disponibile adesso. Il flusso è: /prezzi → paga con Stripe → registrati → /login.\n\nPer richieste particolari: " +
          SUPPORT_EMAIL,
      ],
    },
    {
      id: "pagamenti_metodi",
      q: [
        "come si paga",
        "quali metodi di pagamento",
        "posso pagare con la carta",
        "accettate carta di credito",
        "stripe",
        "pagamento sicuro",
      ],
      keys: ["stripe", "carta", "credito", "debito", "metodi di pagamento", "come si paga"],
      answers: [
        "Il pagamento è gestito da Stripe sul checkout di /prezzi (sicuro, fuori dal sito).\n\nPiani: Mensile 24,90 € · Annuale 219,90 € · Lifetime 2.999,90 €.",
        "Sì: paghi con i metodi accettati da Stripe. Non gestiamo noi i dati della carta.\n\nVai su /prezzi, scegli il piano e completa il checkout.",
      ],
    },

    // ——— LIFETIME ———
    {
      id: "lifetime_durata",
      q: [
        "quanto dura l abbonamento lifetime",
        "quanto dura il lifetime",
        "lifetime quanto dura",
        "il lifetime scade",
        "lifetime a vita",
        "lifetime per sempre",
        "cosa significa lifetime",
        "lifetime una tantum",
      ],
      keys: ["lifetime", "a vita", "una tantum", "per sempre"],
      answers: [
        "Il Lifetime è un pagamento unico (2.999,90 €): accesso a vita al desk, senza rinnovo mensile/annuale.\n\nNon è un abbonamento che scade a fine mese — resti dentro. Checkout: /prezzi",
        "«Lifetime» = paghi una volta e l’accesso resta attivo (niente canone ricorrente).\n\nPrezzo: 2.999,90 € una tantum. Stesso desk dei piani mensile/annuale. /prezzi",
        "Durata Lifetime: illimitata (accesso a vita al prodotto Leona.Lab), pagamento una tantum.\n\nSe hai già pagato e non entri, scrivi a " +
          SUPPORT_EMAIL +
          " con l’email del checkout.",
      ],
    },
    {
      id: "lifetime_vs_altro",
      q: [
        "conviene il lifetime",
        "differenza lifetime e annuale",
        "meglio lifetime o mensile",
        "lifetime vale la pena",
      ],
      keys: ["conviene lifetime", "meglio lifetime", "differenza lifetime"],
      answers: [
        "Mensile/Annuale = canone ricorrente (disdici quando vuoi). Lifetime = una tantum, accesso a vita.\n\nLo stesso desk in tutti i piani. Se pensi di usarlo a lungo, Lifetime evita i rinnovi. /prezzi",
        "Lifetime ha senso se vuoi impegno definitivo senza rinnovi. Se preferisci flessibilità: Mensile 24,90 € o Annuale 219,90 €.\n\nFunzioni identiche. /prezzi",
      ],
    },

    // ——— PERCHÉ ABBONARSI ———
    {
      id: "perche_abbonarsi",
      q: [
        "perche dovrei fare l abbonamento",
        "perche abbonarsi",
        "perche dovrei iscrivermi",
        "perche pagare",
        "cosa ci guadagno",
        "perche scegliere leona",
        "vantaggi abbonamento",
        "perche usare leona lab",
      ],
      keys: ["perche", "perché", "vantaggi", "conviene abbon", "perche pagare", "perche iscriv"],
      answers: [
        "Perché unisce in un solo desk ciò che di solito è sparso: COT, stagionalità (+ timing giorni del mese), Valuation, macro, news e Signal Center.\n\nEsci con un bias LONG / SHORT / WAIT più chiaro — poi decidi tu. Non è consulenza. /prezzi",
        "L’abbonamento apre il desk completo: positioning COT, quando il mese ha storicamente premiato long/short, valuation vs DXY/oro/bonds, calendario macro e breaking news.\n\nMeno tab, più contesto. Piani: /prezzi",
        "Se già guardi COT, stagione e macro da fonti diverse, Leona.Lab le mette nello stesso flusso operativo (incluso timing giorni del mese, esclusiva).\n\nProvalo dal piano che preferisci: /prezzi",
      ],
    },

    // ——— ISCRIZIONE ———
    {
      id: "iscrizione",
      q: [
        "come iscriversi",
        "come mi iscrivo",
        "come registrarsi",
        "come mi registro",
        "come creare account",
        "come iniziare",
        "come inizio",
        "come fare labbonamento",
        "dove mi iscrivo",
        "voglio iscrivermi",
      ],
      keys: ["iscriv", "registr", "creare account", "come inizio", "come iniziare", "sign up"],
      answers: [
        "Iscrizione in 4 passi:\n1) Vai su /prezzi e scegli Mensile / Annuale / Lifetime\n2) Paga con Stripe\n3) Registrati su /registrati con la stessa email del checkout\n4) Entra da /login e apri il desk\n\nHai già pagato? Parti da /registrati.",
        "Non si crea l’account prima del pagamento: prima /prezzi → checkout, poi registrazione con l’email usata per pagare, poi /login.\n\nServe una mano? " +
          SUPPORT_EMAIL,
        "Per entrare nel desk: scegli un piano su /prezzi, completa il pagamento, crea l’account e accedi.\n\nAccount già attivo? → /login",
      ],
    },
    {
      id: "dopo_pagamento",
      q: [
        "ho pagato e ora",
        "pagato ma non posso entrare",
        "dopo il pagamento cosa fare",
        "non mi fa registrare",
        "ho fatto il checkout",
      ],
      keys: ["ho pagato", "dopo il pagamento", "checkout fatto", "pagato ma"],
      answers: [
        "Dopo il pagamento: apri /registrati (idealmente dal link post-checkout), usa la stessa email dello Stripe checkout, crea password e accedi.\n\nSe blocca, scrivi a " +
          SUPPORT_EMAIL +
          " con email + piano + orario pagamento.",
        "Se hai già pagato ma non vedi l’accesso: registra l’account con l’email del pagamento su /registrati, poi /login.\n\nProblemi? " + SUPPORT_EMAIL,
      ],
    },

    // ——— COME LEGGERE COT ———
    {
      id: "leggere_cot",
      q: [
        "come si legge il cot",
        "come leggere cot",
        "come si legge cot",
        "come funziona cot",
        "spiegami il cot",
        "cosa guarda il cot",
        "come usare cot",
        "cot come si interpreta",
      ],
      keys: ["cot", "commitment of traders", "positioning", "non-commercial", "retail cot"],
      answers: [
        "Come leggere COT (regola base in Leona.Lab):\n• Fai il contrario dei Retail e segui i Non-Commercial.\n• Setup long: Retail estremi short + Non-Commercial che aumentano posizioni.\n• Setup short: Retail estremi long + Non-Commercial che tolgono posizioni.\n• Commercial (materie): estremi alti ≈ zona long; estremi bassi ≈ zona short.\n\nSempre incrocia con prezzo, Valuation, stagione e macro.",
        "Il tab COT mostra chi è crowded (Commercial / Non-Commercial / Retail).\n\nOperativamente: Retail agli estremi spesso “sbagliati” di sentiment; i Non-Commercial danno la direzione del flusso. Non è un ordine automatico — conferma con Valuation e Timing.",
        "COT = positioning settimanale. In desk: grafico Focus + KPI (regime, index, OI…).\n\nLettura pratica: estremi Retail vs flusso Non-Commercial. Poi checklist in Signal Center. Guida anche dal pallino «i» sulla tab COT.",
      ],
    },

    // ——— STAGIONALITÀ / TIMING ———
    {
      id: "leggere_stagione",
      q: [
        "come si legge la stagionalita",
        "come funziona la stagionalita",
        "come usare stagionalita",
        "timing giorni del mese come si legge",
        "cosa e il timing giorni",
        "giorno long e short",
        "come leggere i giorni del mese",
      ],
      keys: ["stagional", "seasonality", "timing", "giorni del mese", "giorno long", "giorno short"],
      answers: [
        "Stagionalità: vedi come l’asset si comporta mediamente nei mesi.\n• Supreme Seasonality = curva cumulata di forza/debolezza.\n• Timing giorni del mese (esclusiva): per ogni mese, giorno long e short storicamente più favorevoli + bias mese.\n\nServe per il «quando». Conferma con COT, Valuation e segnali.",
        "Timing giorni: media e hit-rate su rendimenti giornalieri reali (niente numeri inventati).\n\nUso: allinea il giorno al bias del mese, poi crocia con COT e Valuation. Tab Stagionalità nel desk.",
        "Finestra anni: 10Y è un buon default. Mese ingresso / orizzonte allineali al trade che stai valutando.\n\nStagione ≠ segnale da sola.",
      ],
    },

    // ——— VALUATION ———
    {
      id: "leggere_valuation",
      q: [
        "come si legge la valuation",
        "come funziona valuation",
        "come usare valuation",
        "spiegami valuation",
        "cosa significa overvalued",
        "soglie valuation",
      ],
      keys: ["valuation", "valutazione", "overvalued", "undervalued", "over/under"],
      answers: [
        "Valuation (scala −100…+100 vs comparabili):\n• Forex → DXY · Metalli/agricole → oro (GC=F) · Indici → bonds (ZB=F)\n• Sopra +75: stirato al rialzo → bias short (da contestualizzare)\n• Sotto −75: stirato al ribasso → bias long\n• Tre linee sotto → più forza long; tre sopra → più forza short\n\nPeriod tipico: Forex/Metalli 10, Indici 30. Conferma con COT e stagione.",
        "Supreme Valuation confronta l’asset vs DXY / GC=F / ZB=F. Puoi spegnere le linee con «Mostra linea».\n\nNon è TradingView al millimetro, è l’equivalente più vicino via futures Yahoo. Tab Valuation nel desk.",
      ],
    },

    // ——— SEGNALI ———
    {
      id: "leggere_segnali",
      q: [
        "come si leggono i segnali",
        "come funziona signal center",
        "cosa significa long short wait",
        "come usare i segnali",
        "bias cosa significa",
      ],
      keys: ["segnale", "segnali", "signal", "playbook", "long short wait"],
      answers: [
        "Signal Center = riassunto del desk (COT + stagione + momentum) in un bias unico.\n• Bias 0–100: ~sopra 63 Bullish, ~sotto 37 Bearish, in mezzo WAIT\n• Playbook: LONG / SHORT / WAIT-RANGE\n• Qualità dati bassa → riduci size\n\nRegola: prima contesto (COT, Valuation, stagione), poi il segnale come checklist finale — non unico filtro.",
        "I segnali non sono ordini automatici. Ti dicono direzione e playbook dopo aver pesato i pezzi del desk.\n\nUsali per confermare, non per entrare alla cieca.",
      ],
    },

    // ——— MACRO / NEWS ———
    {
      id: "leggere_macro",
      q: [
        "come si legge il macro",
        "come usare il calendario",
        "calendario macro come funziona",
      ],
      keys: ["macro", "calendario", "fomc", "nfp", "cpi"],
      answers: [
        "Macro Calendar: eventi che possono muovere il mercato.\n• Bordo rosso = importanza alta · oro = media · verde = bassa\n• Badge feed: LIVE / FAILOVER / CACHE\n\nSu news ad alta importanza: riduci size o evita entry forzate.",
      ],
    },
    {
      id: "leggere_news",
      q: [
        "come funzionano le news",
        "breaking news a cosa serve",
        "come usare le news",
      ],
      keys: ["breaking", "news", "notizie"],
      answers: [
        "Breaking News = contesto geopolitico/globale (RSS aggregati) dentro il desk.\n\nÈ informazione, non segnale. Incrocia con Macro, COT e Valuation prima di cambiare size/direzione.",
      ],
    },

    // ——— COME SI LEGGONO LE VARIE COSE (generico moduli) ———
    {
      id: "leggere_tutto",
      q: [
        "come si leggono le varie cose",
        "come si leggono cot ecc",
        "come leggere tutto",
        "come si usano i moduli",
        "spiegami come leggere il desk",
        "come si interpretano i dati",
      ],
      keys: ["come si leggono", "varie cose", "moduli", "interpretare", "come leggere il desk"],
      answers: [
        "Ordine di lettura consigliato:\n1) Asset + timeframe\n2) COT (flusso / estremi)\n3) Stagionalità + timing giorno del mese\n4) Valuation (stiramento vs DXY/oro/bonds)\n5) Macro/News per il contesto del giorno\n6) Signal Center come checklist LONG/SHORT/WAIT\n\nChiedimi pure «come si legge il COT?» o «come si legge la Valuation?» per il dettaglio.",
        "In sintesi: COT = chi è posizionato · Stagione/Timing = quando · Valuation = quanto è stirato · Macro/News = cosa può scuotere · Segnali = sintesi.\n\nDimmi quale pezzo vuoi approfondire (COT, stagione, valuation, segnali…).",
      ],
    },

    // ——— PREZZI ———
    {
      id: "prezzi",
      q: [
        "quanto costa",
        "quanto costano i piani",
        "prezzi",
        "listino",
        "prezzo mensile",
        "prezzo annuale",
        "prezzo lifetime",
      ],
      keys: ["prezz", "cost", "euro", "24,90", "219", "2999", "listino"],
      answers: [
        "Piani (stesso desk completo):\n• Mensile — 24,90 €/mese\n• Annuale — 219,90 €/anno (~18,33 €/mese)\n• Lifetime — 2.999,90 € una tantum\n\nCheckout: /prezzi",
        "Mensile 24,90 € (flessibile), Annuale 219,90 € (risparmio), Lifetime 2.999,90 € (una volta).\n\nDettagli: /prezzi",
      ],
    },
    {
      id: "disdici",
      q: [
        "come disdire",
        "posso disdire",
        "cancellare abbonamento",
        "disdetta",
      ],
      keys: ["disdic", "disdetta", "cancellare abbonamento", "annullare abbonamento"],
      answers: [
        "Sì: dal desk → Gestisci abbonamento (portale Stripe), oppure scrivi a " +
          SUPPORT_EMAIL +
          " con email e piano.\n\nIl Lifetime non ha rinnovo ricorrente da disdire.",
      ],
    },

    // ——— COS’È / GENERALE ———
    {
      id: "cosa_e",
      q: [
        "cos e leona lab",
        "cos'e leona",
        "cosa e leona lab",
        "a cosa serve leona",
        "che cos e questo sito",
      ],
      keys: ["cos'e leona", "cosa e leona", "a cosa serve", "che prodotto"],
      answers: [
        "Leona.Lab è un desk multi-asset: COT, stagionalità, valuation, macro, news e segnali in un flusso unico per costruire un bias LONG/SHORT/WAIT.\n\nInformazione operativa, non consulenza. /prezzi",
        "È lo strumento che unisce positioning, timing e contesto macro nello stesso posto — pensato da trader per la routine quotidiana.\n\nPiani: /prezzi",
      ],
    },
    {
      id: "login",
      q: [
        "come faccio login",
        "dove accedo",
        "non riesco ad accedere",
        "problemi di login",
      ],
      keys: ["login", "acced", "password", "non entro"],
      answers: [
        "Login: /login\n\nSe hai pagato ma non hai account: /registrati con l’email del checkout.\n\nBlocco persistente → " + SUPPORT_EMAIL,
      ],
    },
    {
      id: "assistenza",
      q: [
        "contatto assistenza",
        "email supporto",
        "dove vi scrivo",
        "ho un problema tecnico",
      ],
      keys: ["assistenza", "supporto", "contatto", "supportleonalab"],
      answers: [
        "Assistenza: " +
          SUPPORT_EMAIL +
          "\n\nIndica email account, piano e problema. Pagina: /assistenza",
        "Scrivici a " +
          SUPPORT_EMAIL +
          " (account, pagamento, accesso, privacy). /assistenza",
      ],
    },
    {
      id: "disclaimer",
      q: [
        "e consulenza finanziaria",
        "garantite i guadagni",
        "e un segnale automatico",
      ],
      keys: ["consulenza", "garanzia", "guadagn", "segnale automatico"],
      answers: [
        "No: Leona.Lab fornisce strumenti informativi. Non è consulenza personalizzata e non garantisce risultati. I mercati hanno rischio di perdita. /termini",
      ],
    },
    {
      id: "saluto",
      q: ["ciao", "salve", "buongiorno", "buonasera", "hey", "hello"],
      keys: ["ciao", "salve", "buongiorno", "buonasera"],
      answers: [
        "Ciao! Chiedimi pure cose concrete, ad esempio:\n• «Si può pagare con PayPal?»\n• «Quanto dura il Lifetime?»\n• «Come si legge il COT?»\n• «Come mi iscrivo?»",
        "Ciao — dimmi la domanda precisa (pagamenti, piani, COT, iscrizione…) e ti rispondo su quello.",
      ],
    },
  ];

  const STOP = new Set(
    "il lo la i gli le un uno una di da in su per con a e o ma mi ti si ci vi che dei del della delle degli al alla ai alle nel nella the and or of to is are vorrei volevo sapere dimmi parlami info".split(
      " "
    )
  );

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’`´]/g, "'")
      .replace(/€/g, " euro ")
      .replace(/[^a-z0-9'\s.+-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(text) {
    return normalize(text)
      .split(" ")
      .map((w) => w.replace(/^'+|'+$/g, ""))
      .filter((w) => w && w.length > 1 && !STOP.has(w));
  }

  function jaccard(a, b) {
    const A = new Set(a);
    const B = new Set(b);
    let inter = 0;
    A.forEach((x) => {
      if (B.has(x)) inter++;
    });
    const uni = A.size + B.size - inter;
    return uni ? inter / uni : 0;
  }

  function scoreEntry(query, entry) {
    const q = normalize(query);
    const qt = tokens(query);
    if (!q) return 0;
    let score = 0;

    // 1) match vs domande tipiche (priorità alta)
    for (const sample of entry.q || []) {
      const s = normalize(sample);
      const st = tokens(sample);
      if (!s) continue;
      if (q === s) score += 100;
      else if (q.includes(s) || s.includes(q)) score += 48;
      else {
        const jac = jaccard(qt, st);
        if (jac >= 0.5) score += 28 + jac * 40;
        else if (jac >= 0.35) score += 14 + jac * 20;
        // overlap conteggio
        let hit = 0;
        for (const t of st) if (qt.includes(t) || q.includes(t)) hit++;
        if (st.length) score += (hit / st.length) * 18;
      }
    }

    // 2) keywords forti della voce
    for (const key of entry.keys || []) {
      const k = normalize(key);
      if (!k) continue;
      if (k.includes(" ")) {
        if (q.includes(k)) score += 36;
      } else if (qt.includes(k)) score += 26;
      else if (k.length >= 4 && q.includes(k)) score += 14;
    }

    return score;
  }

  function pickAnswer(entry, query) {
    const list = entry.answers || [];
    if (!list.length) return "";
    // varianti stabili per domanda (non sempre la prima)
    let h = 0;
    const s = normalize(query);
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    // piccola rotazione anche nel tempo (resta sempre indice >= 0)
    h = (h + ((Date.now() / 60000) | 0)) >>> 0;
    return list[h % list.length];
  }

  function answerFor(query) {
    const raw = String(query || "").trim();
    if (!raw) {
      return "Scrivi una domanda (es. «Si può pagare con PayPal?», «Come si legge il COT?»).";
    }

    let best = null;
    let bestScore = 0;
    let second = null;
    let secondScore = 0;

    for (const entry of QA) {
      const sc = scoreEntry(raw, entry);
      if (sc > bestScore) {
        second = best;
        secondScore = bestScore;
        best = entry;
        bestScore = sc;
      } else if (sc > secondScore) {
        second = entry;
        secondScore = sc;
      }
    }

    // soglia: evita risposte a caso
    if (!best || bestScore < 16) {
      return (
        "Non ho collegato bene la domanda a una risposta precisa.\n\nProva così:\n• «Si può pagare con PayPal?»\n• «Quanto dura il Lifetime?»\n• «Perché dovrei abbonarmi?»\n• «Come si legge il COT?»\n• «Come mi iscrivo?»\n\nOppure " +
        SUPPORT_EMAIL
      );
    }

    // se due voci vicine e la domanda le menziona entrambe, unisci
    let text = pickAnswer(best, raw);
    if (
      second &&
      secondScore >= 22 &&
      bestScore - secondScore < 12 &&
      best.id !== second.id &&
      /\b(e|anche|,|\/)\b/.test(normalize(raw))
    ) {
      text += "\n\n—\n\n" + pickAnswer(second, raw + "|b");
    }

    return text;
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
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
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
    headText.appendChild(el("span", "ll-assist-status", { text: "Domande su piani, pagamenti e desk" }));
    const closeBtn = el("button", "ll-assist-close", { type: "button", "aria-label": "Chiudi chat", text: "×" });
    head.appendChild(headText);
    head.appendChild(closeBtn);

    const messages = el("div", "ll-assist-messages", {
      id: "llAssistMessages",
      role: "log",
      "aria-live": "polite",
    });

    const chips = el("div", "ll-assist-chips");
    QUICK.forEach((item) => {
      const chip = el("button", "ll-assist-chip", { type: "button", text: item.label });
      chip.addEventListener("click", () => ask(item.q, item.label));
      chips.appendChild(chip);
    });

    const form = el("form", "ll-assist-form");
    const input = el("input", "ll-assist-input", {
      id: "llAssistInput",
      type: "text",
      placeholder: "Es. si può pagare con PayPal?",
      autocomplete: "off",
      maxlength: "280",
      "aria-label": "Domanda",
    });
    const send = el("button", "ll-assist-send", { type: "submit", text: "Invia" });
    form.appendChild(input);
    form.appendChild(send);

    const foot = el("p", "ll-assist-foot", {
      html: 'Bot informativo · non è consulenza · <a href="/assistenza">Assistenza umana</a>',
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
      if (open) {
        if (!messages.childElementCount) {
          addMessage(
            "bot",
            "Ciao — chiedimi cose precise: PayPal, Lifetime, perché abbonarsi, come leggere COT / Valuation, come iscriversi.\n\nEmail: " +
              SUPPORT_EMAIL
          );
        }
        setTimeout(() => input.focus(), 160);
      }
    }

    function ask(query, displayLabel) {
      const text = String(query || "").trim();
      if (!text) return;
      setOpen(true);
      addMessage("user", displayLabel || text);
      const typing = el("div", "ll-assist-msg ll-assist-msg-bot ll-assist-typing", { text: "…" });
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      window.setTimeout(() => {
        typing.remove();
        addMessage("bot", answerFor(text));
      }, 200 + Math.min(360, text.length * 5));
    }

    fab.addEventListener("click", () => setOpen(!root.classList.contains("is-open")));
    closeBtn.addEventListener("click", () => setOpen(false));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) return;
      input.value = "";
      ask(v);
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && root.classList.contains("is-open")) setOpen(false);
    });

    window.__llAssistAnswer = answerFor;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
