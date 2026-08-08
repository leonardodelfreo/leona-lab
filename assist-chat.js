/**
 * Leona.Lab — assistente landing (tono umano + 138+ Q&A).
 */
(function () {
  const SUPPORT_EMAIL = "supportleonalab@gmail.com";
  const QUICK = [
    { label: "PayPal?", q: "si puo pagare con paypal?" },
    { label: "Lifetime", q: "quanto dura il lifetime?" },
    { label: "Perché abbonarsi?", q: "perche dovrei abbonarmi?" },
    { label: "Come leggere COT", q: "come si legge il cot?" },
    { label: "Come iscriversi", q: "come mi iscrivo?" },
  ];
  const QA = [
  {
    "id": "ciao",
    "q": [
      "ciao",
      "eila",
      "hey",
      "hola",
      "hello",
      "salve"
    ],
    "keys": [
      "ciao",
      "hey",
      "salve"
    ],
    "answers": [
      "Ciao! Dimmi pure cosa ti serve — piani, pagamenti, COT, iscrizione… vado sul punto.",
      "Ciao, sono l'assistente di Leona.Lab. Fammi una domanda concreta e ti rispondo chiaro.",
      "Ehi, dimmi pure. Più sei specifico, più ti do la risposta giusta."
    ]
  },
  {
    "id": "buongiorno",
    "q": [
      "buongiorno",
      "buona giornata"
    ],
    "keys": [
      "buongiorno"
    ],
    "answers": [
      "Buongiorno! Come posso aiutarti su Leona.Lab oggi?",
      "Buongiorno — piani, desk o iscrizione? Dimmi pure."
    ]
  },
  {
    "id": "buonasera",
    "q": [
      "buonasera",
      "buona sera"
    ],
    "keys": [
      "buonasera"
    ],
    "answers": [
      "Buonasera! Dimmi pure la tua domanda su Leona.Lab."
    ]
  },
  {
    "id": "grazie",
    "q": [
      "grazie",
      "thanks",
      "ti ringrazio",
      "ok grazie"
    ],
    "keys": [
      "grazie",
      "thanks"
    ],
    "answers": [
      "Prego! Se ti viene un altro dubbio, chiedi pure.",
      "Figurati. Se serve approfondire COT, piani o iscrizione, sono qui."
    ]
  },
  {
    "id": "chi_sei",
    "q": [
      "chi sei",
      "sei un bot",
      "sei una persona",
      "sei un assistente"
    ],
    "keys": [
      "chi sei",
      "sei un bot"
    ],
    "answers": [
      "Sono l'assistente di Leona.Lab: ti spiego prodotto, piani e come leggere il desk. Per problemi account reali ti passo a supportleonalab@gmail.com.",
      "Assistente automatico del sito — non un trader umano. Per cose delicate (pagamenti/accesso) meglio supportleonalab@gmail.com."
    ]
  },
  {
    "id": "paypal",
    "q": [
      "si puo pagare con paypal",
      "accettate paypal",
      "posso usare paypal",
      "avete paypal",
      "pagamento con paypal",
      "checkout paypal",
      "pay pal funziona",
      "paypal disponibile"
    ],
    "keys": [
      "paypal",
      "pay pal"
    ],
    "answers": [
      "No, PayPal adesso non c'è. Il pagamento passa da Stripe su /prezzi (carte e metodi Stripe). Se ti serve proprio PayPal, scrivi a supportleonalab@gmail.com.",
      "PayPal non è attivo. Flusso attuale: scegli piano su /prezzi → paghi con Stripe → ti registri con la stessa email → /login.",
      "Capito, domanda sul PayPal: al momento no. Solo checkout Stripe. Per eccezioni: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "carta",
    "q": [
      "posso pagare con la carta",
      "accettate carta di credito",
      "si paga con carta",
      "carta di debito"
    ],
    "keys": [
      "carta",
      "credito",
      "debito"
    ],
    "answers": [
      "Sì, il checkout Stripe accetta le carte (e gli altri metodi che Stripe abilita nella tua zona). Non vediamo noi i dati della carta.",
      "Paghi con carta via Stripe su /prezzi: è fuori dal sito, canale sicuro."
    ]
  },
  {
    "id": "stripe",
    "q": [
      "cos e stripe",
      "perche stripe",
      "stripe e sicuro"
    ],
    "keys": [
      "stripe"
    ],
    "answers": [
      "Stripe è il gestore pagamenti: gestisce checkout e abbonamenti in modo sicuro. Noi non salviamo il numero della carta.",
      "Usiamo Stripe perché è lo standard per abbonamenti online. Dal desk puoi anche gestire/disdire l'abbonamento."
    ]
  },
  {
    "id": "come_si_paga",
    "q": [
      "come si paga",
      "dove pago",
      "come funziona il pagamento"
    ],
    "keys": [
      "come si paga",
      "dove pago"
    ],
    "answers": [
      "Vai su /prezzi, scegli Mensile / Annuale / Lifetime e clicca «Paga e continua». Si apre Stripe. Dopo, registri l'account.",
      "Pagamento → /prezzi. Poi account con la stessa email del checkout, poi accesso da /login."
    ]
  },
  {
    "id": "sicurezza_pagamento",
    "q": [
      "il pagamento e sicuro",
      "posso fidarmi a pagare",
      "dati carta sicuri"
    ],
    "keys": [
      "sicuro",
      "fidarmi"
    ],
    "answers": [
      "Il pagamento avviene su Stripe, non inserisci la carta dentro Leona.Lab. È lo stesso tipo di flusso usato da tantissimi servizi online."
    ]
  },
  {
    "id": "fattura",
    "q": [
      "fate fattura",
      "ricevo ricevuta",
      "scontrino pagamento"
    ],
    "keys": [
      "fattura",
      "ricevuta",
      "scontrino"
    ],
    "answers": [
      "La ricevuta arriva da Stripe all'email usata in checkout. Per dubbi su ricevuta/fattura scrivi a supportleonalab@gmail.com con l'email del pagamento."
    ]
  },
  {
    "id": "rimborso",
    "q": [
      "posso avere un rimborso",
      "policy rimborso",
      "soldi indietro"
    ],
    "keys": [
      "rimborso"
    ],
    "answers": [
      "Per rimborsi o casi particolari scrivi a supportleonalab@gmail.com con email account e dettaglio del pagamento: valutiamo caso per caso."
    ]
  },
  {
    "id": "lifetime_durata",
    "q": [
      "quanto dura l abbonamento lifetime",
      "quanto dura il lifetime",
      "lifetime scade",
      "lifetime a vita",
      "lifetime per sempre",
      "cosa significa lifetime",
      "lifetime una tantum quanto dura"
    ],
    "keys": [
      "lifetime",
      "a vita",
      "una tantum"
    ],
    "answers": [
      "Lifetime = paghi una volta (2.999,90 €) e l'accesso al desk resta a vita, senza rinnovo mensile/annuale.",
      "Durata Lifetime: illimitata. Non è un abbonamento che scade a fine mese: è accesso permanente al prodotto.",
      "In pratica: una tantum e resti dentro. Stesso desk dei piani ricorrenti. Dettagli su /prezzi."
    ]
  },
  {
    "id": "lifetime_prezzo",
    "q": [
      "quanto costa il lifetime",
      "prezzo lifetime",
      "lifetime prezzo"
    ],
    "keys": [
      "prezzo lifetime",
      "costa lifetime"
    ],
    "answers": [
      "Lifetime costa 2.999,90 € una tantum. Checkout su /prezzi.",
      "Listino Lifetime: 2.999,90 € (pagamento unico). /prezzi"
    ]
  },
  {
    "id": "lifetime_vs_mensile",
    "q": [
      "meglio lifetime o mensile",
      "lifetime o mensile",
      "conviene lifetime"
    ],
    "keys": [
      "meglio lifetime",
      "conviene lifetime"
    ],
    "answers": [
      "Mensile (24,90 €) se vuoi flessibilità e disdire quando vuoi. Lifetime se pensi di usarlo a lungo e non vuoi rinnovi. Le funzioni sono le stesse.",
      "Se sei incerto parti dal mensile. Se sei convinto sul lungo periodo, Lifetime evita i canoni. /prezzi"
    ]
  },
  {
    "id": "lifetime_vs_annuale",
    "q": [
      "lifetime o annuale",
      "meglio lifetime o annuale",
      "differenza lifetime annuale"
    ],
    "keys": [
      "lifetime o annuale"
    ],
    "answers": [
      "Annuale 219,90 €/anno (~18,33 €/mese). Lifetime 2.999,90 € una volta. Stesso accesso: cambia solo come paghi nel tempo."
    ]
  },
  {
    "id": "lifetime_rinnovo",
    "q": [
      "il lifetime si rinnova",
      "lifetime ha rinnovo",
      "lifetime abbonamento ricorrente"
    ],
    "keys": [
      "rinnovo lifetime"
    ],
    "answers": [
      "No: Lifetime non ha rinnovo ricorrente. Paghi una volta sola."
    ]
  },
  {
    "id": "lifetime_disdici",
    "q": [
      "come disdire lifetime",
      "disdire lifetime"
    ],
    "keys": [
      "disdire lifetime"
    ],
    "answers": [
      "Il Lifetime non è un canone da disdire. Per account/accesso dopo l'acquisto, scrivi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "perche_abbonarsi",
    "q": [
      "perche dovrei fare l abbonamento",
      "perche abbonarsi",
      "perche pagare",
      "perche iscrivermi",
      "vantaggi abbonamento",
      "perche scegliere leona",
      "perche usare leona lab",
      "cosa ci guadagno",
      "perche dovrei abbonarmi"
    ],
    "keys": [
      "perche abbon",
      "perche pagare",
      "vantaggi",
      "perche scegliere",
      "perche usare",
      "perche dovrei"
    ],
    "answers": [
      "Perché metti nello stesso posto COT, stagionalità (con timing giorni del mese), Valuation, macro, news e Signal Center. Meno tab, più contesto — poi decidi tu.",
      "Se già guardi positioning e stagione da fonti sparse, qui le hai nel flusso operativo insieme. Non è magia e non è consulenza: è ordine mentale.",
      "Te lo dico semplice: serve a costruire un bias LONG/SHORT/WAIT più pulito, crociando pezzi che di solito tieni aperti in 5 schermate."
    ]
  },
  {
    "id": "cosa_include",
    "q": [
      "cosa include",
      "cosa c e dentro",
      "che funzioni avete",
      "cosa offre",
      "moduli inclusi"
    ],
    "keys": [
      "include",
      "funzioni",
      "moduli",
      "offre",
      "dentro"
    ],
    "answers": [
      "Dentro trovi: Timing giorni del mese, Signal Center, COT, Supreme Valuation, Macro Calendar e Breaking News. Stesso pacchetto su tutti i piani.",
      "Il desk completo: positioning COT, stagione/timing, valuation −100…+100, macro, news e sintesi segnali. /prezzi"
    ]
  },
  {
    "id": "esclusiva",
    "q": [
      "cosa ha di esclusivo",
      "timing esclusiva",
      "solo su leona"
    ],
    "keys": [
      "esclusiv",
      "solo su leona"
    ],
    "answers": [
      "L'esclusiva è il Timing giorni del mese: per ogni mese, giorno long e short storicamente più favorevoli su dati reali, accanto a stagione e ranking."
    ]
  },
  {
    "id": "iscrizione",
    "q": [
      "come iscriversi",
      "come mi iscrivo",
      "come registrarsi",
      "come mi registro",
      "come creare account",
      "come iniziare",
      "come inizio",
      "dove mi iscrivo",
      "voglio iscrivermi",
      "come fare labbonamento"
    ],
    "keys": [
      "iscriv",
      "registr",
      "creare account",
      "come inizio",
      "come iniziare"
    ],
    "answers": [
      "Così: 1) /prezzi e scegli il piano 2) paghi con Stripe 3) ti registri con la stessa email del checkout 4) entri da /login. Se hai già pagato, vai diretto a /registrati.",
      "Prima si paga, poi si crea l'account (stessa email del pagamento). Poi login e desk. Ti blocco? Scrivi a supportleonalab@gmail.com.",
      "Iscrizione = piano su /prezzi → checkout → registrazione → accesso. Niente account «a vuoto» prima del pagamento."
    ]
  },
  {
    "id": "dopo_pagamento",
    "q": [
      "ho pagato e ora",
      "dopo il pagamento cosa fare",
      "pagato ma non posso entrare",
      "ho fatto il checkout"
    ],
    "keys": [
      "ho pagato",
      "dopo il pagamento",
      "checkout"
    ],
    "answers": [
      "Dopo il pagamento apri /registrati con l'email usata su Stripe, crea la password e poi /login. Se non apre, scrivi a supportleonalab@gmail.com con orario e email.",
      "Pagato ok → registrazione con stessa email → login. Se il sistema non riconosce il pagamento, assistenza umana: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "email_diversa",
    "q": [
      "posso usare un email diversa",
      "email diversa dal pagamento"
    ],
    "keys": [
      "email diversa"
    ],
    "answers": [
      "Meglio usare la stessa email del checkout: è quella collegata al pagamento. Se ti serve cambiarla, scrivi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "tempo_attivazione",
    "q": [
      "quanto ci mette ad attivarsi",
      "quando si attiva l account"
    ],
    "keys": [
      "attiv"
    ],
    "answers": [
      "Di solito subito dopo registrazione post-pagamento. Se dopo qualche minuto non entri, contatta supportleonalab@gmail.com."
    ]
  },
  {
    "id": "cot_leggere",
    "q": [
      "come si legge il cot",
      "come leggere cot",
      "come funziona cot",
      "spiegami il cot",
      "come usare cot",
      "cot come si interpreta",
      "cosa guarda il cot",
      "aiuto col cot"
    ],
    "keys": [
      "cot",
      "commitment",
      "positioning"
    ],
    "answers": [
      "Ti spiego COT come lo usiamo noi: regola base → contrario dei Retail, segui i Non-Commercial. Long tipico: Retail estremi short + Non-Commercial che aumentano. Short tipico: Retail estremi long + Non-Commercial che tolgono. Poi crocia con prezzo e Valuation.",
      "COT = chi è posizionato. In desk vedi Commercial / Non-Commercial / Retail. Gli estremi Retail spesso segnalano crowding; i Non-Commercial raccontano il flusso. Non è un ordine automatico.",
      "Aprendo il tab COT hai KPI + grafico Focus. Leggi gli estremi e la direzione del flusso, poi conferma con stagione e Signal Center. C'è anche la guida «i» sulla tab."
    ]
  },
  {
    "id": "cot_retail",
    "q": [
      "cosa sono i retail nel cot",
      "retail cot",
      "contrario dei retail"
    ],
    "keys": [
      "retail"
    ],
    "answers": [
      "Nel COT, Retail sono i piccoli speculatori. In Leona.Lab la lettura tipica è: agli estremi spesso conviene fare il contrario del loro crowding — sempre con conferma di prezzo/Valuation."
    ]
  },
  {
    "id": "cot_noncomm",
    "q": [
      "non commercial cosa sono",
      "cosa sono i non commercial"
    ],
    "keys": [
      "non-commercial",
      "non commercial"
    ],
    "answers": [
      "I Non-Commercial sono i grandi speculatori (fondi ecc.). Di solito li seguiamo come flusso dominante, soprattutto quando si allineano al setup e i Retail sono dall'altra parte."
    ]
  },
  {
    "id": "cot_commercial",
    "q": [
      "commercial cot",
      "cosa sono i commercial"
    ],
    "keys": [
      "commercial"
    ],
    "answers": [
      "Sulle materie, i Commercial (hedger) agli estremi alti possono essere zone da comprare; estremi bassi da vendere — lettura tipica del desk, da contestualizzare."
    ]
  },
  {
    "id": "cot_solo",
    "q": [
      "posso usare solo il cot",
      "basta il cot"
    ],
    "keys": [
      "solo cot",
      "basta il cot"
    ],
    "answers": [
      "Sconsigliato. COT è un pezzo: meglio crociarlo con stagione/timing, Valuation e macro prima di decidere size."
    ]
  },
  {
    "id": "stagione_leggere",
    "q": [
      "come si legge la stagionalita",
      "come funziona la stagionalita",
      "come usare stagionalita",
      "spiegami la stagionalita"
    ],
    "keys": [
      "stagional",
      "seasonality"
    ],
    "answers": [
      "Stagionalità = comportamento medio dell'asset nei mesi. Supreme Seasonality è la curva cumulata. Timing giorni del mese (esclusiva) ti dà giorno long/short per ogni mese su dati reali. Serve al «quando», non da sola.",
      "In tab Stagionalità: curva, ranking mensile e tabella timing. Usa 10Y come default e allinea mese/orizzonte al trade che stai guardando."
    ]
  },
  {
    "id": "timing_giorni",
    "q": [
      "timing giorni del mese",
      "giorno long e short",
      "come leggere i giorni del mese",
      "cosa e il timing giorni",
      "giorni del mese come funziona"
    ],
    "keys": [
      "timing",
      "giorni del mese",
      "giorno long",
      "giorno short"
    ],
    "answers": [
      "Timing giorni: per Gen–Dic vedi bias del mese + giorno long + giorno short più favorevoli, calcolati su rendimenti reali (media/hit-rate). Allinea il giorno al bias mese, poi conferma con COT e Valuation.",
      "Non è un calendario magico: è statistica storica. Utile per il timing, pericoloso se lo usi da solo."
    ]
  },
  {
    "id": "stagione_anni",
    "q": [
      "quanti anni stagionalita",
      "finestra 10 anni",
      "all o 10y"
    ],
    "keys": [
      "10y",
      "10 anni",
      "finestra"
    ],
    "answers": [
      "10Y è un buon default. ALL aumenta i campioni ma può mescolare regimi diversi: occhio al contesto."
    ]
  },
  {
    "id": "valuation_leggere",
    "q": [
      "come si legge la valuation",
      "come funziona valuation",
      "come usare valuation",
      "spiegami valuation",
      "supreme valuation"
    ],
    "keys": [
      "valuation",
      "valutazione"
    ],
    "answers": [
      "Valuation: asset vs DXY / oro (GC=F) / bonds su scala −100…+100. Sopra +75 → stirato up (bias short da contestualizzare). Sotto −75 → stirato down (bias long). Tre linee sotto = più forza long; tre sopra = più forza short.",
      "Comparabili tipici: Forex→DXY, metalli/agricole→oro, indici→bonds. Period spesso 10 (30 sugli indici). Puoi spegnere le linee con «Mostra linea»."
    ]
  },
  {
    "id": "valuation_over",
    "q": [
      "cosa significa overvalued",
      "overvalued cosa vuol dire",
      "sopra 75"
    ],
    "keys": [
      "overvalued"
    ],
    "answers": [
      "Overvalued (in desk) indica lettura stretch al rialzo rispetto ai comparabili (zona alta della scala). Non è «vendi subito»: è un alert da crociare con COT e struttura prezzo."
    ]
  },
  {
    "id": "valuation_under",
    "q": [
      "cosa significa undervalued",
      "undervalued",
      "sotto meno 75"
    ],
    "keys": [
      "undervalued"
    ],
    "answers": [
      "Undervalued = stretch al ribasso vs comparabili (zona bassa). Possibile bias long da contestualizzare, non un ingresso cieco."
    ]
  },
  {
    "id": "valuation_tv",
    "q": [
      "e uguale a tradingview",
      "come tradingview"
    ],
    "keys": [
      "tradingview"
    ],
    "answers": [
      "È pensata stile TradingView (formula/comparabili futures), ma non è identica al millimetro. È l'equivalente più vicino via feed Yahoo futures."
    ]
  },
  {
    "id": "segnali_leggere",
    "q": [
      "come si leggono i segnali",
      "come funziona signal center",
      "come usare i segnali",
      "cosa significa long short wait",
      "bias cosa significa"
    ],
    "keys": [
      "segnale",
      "segnali",
      "signal",
      "playbook"
    ],
    "answers": [
      "Signal Center riassume il desk in un bias. Circa: >63 Bullish, <37 Bearish, in mezzo WAIT. Playbook in LONG/SHORT/WAIT. Se qualità dati è bassa, riduci size. Usalo come checklist finale, non unico filtro.",
      "I segnali non sparano ordini al posto tuo. Ti dicono direzione e playbook dopo aver pesato COT/stagione/momentum. Prima contesto, poi segnale."
    ]
  },
  {
    "id": "segnali_wait",
    "q": [
      "cosa vuol dire wait",
      "bias wait",
      "stato wait"
    ],
    "keys": [
      "wait"
    ],
    "answers": [
      "WAIT = non c'è un edge chiaro abbastanza: meglio stare fuori o ridurre, invece di forzare."
    ]
  },
  {
    "id": "macro_leggere",
    "q": [
      "come si legge il macro",
      "come usare il calendario",
      "calendario macro",
      "come funziona macro"
    ],
    "keys": [
      "macro",
      "calendario"
    ],
    "answers": [
      "Macro Calendar = eventi (CPI, FOMC, NFP…). Bordo rosso alta importanza, oro media, verde bassa. Badge LIVE/FAILOVER/CACHE. Sulle rosse: più cautela su size/entry.",
      "Filtra per valuta/importanza e usalo per sapere quando il contesto può cambiare in fretta."
    ]
  },
  {
    "id": "news_leggere",
    "q": [
      "come funzionano le news",
      "breaking news",
      "come usare le news",
      "a cosa servono le news"
    ],
    "keys": [
      "breaking",
      "news",
      "notizie"
    ],
    "answers": [
      "Breaking News porta geopolitica/eventi globali nel desk (RSS aggregati). È contesto, non segnale: crocia con Macro e il resto prima di cambiare idea."
    ]
  },
  {
    "id": "leggere_tutto",
    "q": [
      "come si leggono le varie cose",
      "come si leggono cot ecc",
      "come leggere tutto",
      "come si usano i moduli",
      "spiegami come leggere il desk",
      "ordine di lettura"
    ],
    "keys": [
      "varie cose",
      "come si leggono",
      "ordine di lettura",
      "moduli"
    ],
    "answers": [
      "Ordine che consiglio: 1) asset/timeframe 2) COT 3) stagione + timing giorno 4) Valuation 5) macro/news 6) Signal Center come checklist. Dimmi quale pezzo vuoi nel dettaglio.",
      "In una frase: COT=chi · Timing=quando · Valuation=quanto è stirato · Macro/News=cosa può scuotere · Segnali=sintesi. Su quale andiamo?"
    ]
  },
  {
    "id": "prezzi",
    "q": [
      "quanto costa",
      "quanto costano i piani",
      "prezzi",
      "listino",
      "prezzo abbonamento"
    ],
    "keys": [
      "prezz",
      "cost",
      "listino",
      "euro"
    ],
    "answers": [
      "Mensile 24,90 € · Annuale 219,90 € · Lifetime 2.999,90 €. Stesso desk. /prezzi",
      "Tre prezzi: 24,90/mese, 219,90/anno, 2.999,90 lifetime. Li vedi tutti su /prezzi."
    ]
  },
  {
    "id": "prezzo_mensile",
    "q": [
      "quanto costa il mensile",
      "prezzo mensile"
    ],
    "keys": [
      "mensile"
    ],
    "answers": [
      "Mensile: 24,90 €/mese, disdici quando vuoi. Accesso completo. /prezzi"
    ]
  },
  {
    "id": "prezzo_annuale",
    "q": [
      "quanto costa l annuale",
      "prezzo annuale",
      "annuale quanto"
    ],
    "keys": [
      "annuale"
    ],
    "answers": [
      "Annuale: 219,90 €/anno (circa 18,33 €/mese). Stesso accesso del mensile. /prezzi"
    ]
  },
  {
    "id": "sconto",
    "q": [
      "avete sconti",
      "codice sconto",
      "promo"
    ],
    "keys": [
      "sconto",
      "promo",
      "codice"
    ],
    "answers": [
      "Sul sito vedi i prezzi pieni su /prezzi. Per promo particolari scrivi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "disdici",
    "q": [
      "come disdire",
      "posso disdire",
      "cancellare abbonamento",
      "disdetta",
      "smettere di pagare"
    ],
    "keys": [
      "disdic",
      "disdetta",
      "cancellare abbonamento"
    ],
    "answers": [
      "Sì: dal desk → Gestisci abbonamento (portale Stripe), oppure supportleonalab@gmail.com. Lifetime non ha canone ricorrente."
    ]
  },
  {
    "id": "login",
    "q": [
      "come faccio login",
      "dove accedo",
      "non riesco ad accedere",
      "problemi di login",
      "password non va"
    ],
    "keys": [
      "login",
      "acced",
      "password",
      "non entro"
    ],
    "answers": [
      "Login su /login. Se hai pagato ma non hai account: /registrati con email checkout. Se resta bloccato → supportleonalab@gmail.com.",
      "Prova /login; se è il primo accesso post-pagamento passa da /registrati. Aiuto umano: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "password_dimenticata",
    "q": [
      "ho dimenticato la password",
      "reset password"
    ],
    "keys": [
      "dimenticato",
      "reset password"
    ],
    "answers": [
      "Scrivi a supportleonalab@gmail.com dall'email dell'account: ti aiutiamo a sbloccare l'accesso."
    ]
  },
  {
    "id": "assistenza",
    "q": [
      "contatto assistenza",
      "email supporto",
      "dove vi scrivo",
      "ho un problema tecnico",
      "supporto"
    ],
    "keys": [
      "assistenza",
      "supporto",
      "contatto",
      "supportleonalab"
    ],
    "answers": [
      "Assistenza umana: supportleonalab@gmail.com. Metti email, piano e 3 righe sul problema. Pagina /assistenza.",
      "Per account/pagamenti meglio una mail a supportleonalab@gmail.com — qui ti spiego soprattutto il prodotto."
    ]
  },
  {
    "id": "cosa_e",
    "q": [
      "cos e leona lab",
      "cos'e leona",
      "cosa e leona lab",
      "a cosa serve leona",
      "che cos e questo sito",
      "mi spieghi leona lab"
    ],
    "keys": [
      "a cosa serve",
      "che prodotto",
      "questo sito",
      "leona lab"
    ],
    "answers": [
      "Leona.Lab è un desk multi-asset: COT, stagione/timing, valuation, macro, news e segnali in un flusso solo. Ti aiuta a uscire con un bias — non fa trading al posto tuo.",
      "In pratica: contesto e timing sullo stesso schermo, pensato da trader. Info operativa, non consulenza."
    ]
  },
  {
    "id": "asset",
    "q": [
      "quali mercati",
      "quali asset",
      "avete oro",
      "c e forex",
      "indici disponibili"
    ],
    "keys": [
      "forex",
      "metalli",
      "oro",
      "indici",
      "agricol",
      "mercati",
      "asset",
      "xau",
      "gold"
    ],
    "answers": [
      "Forex, Metalli, Indici e Agricoli. Scegli Tipologia + Asset dai filtri in alto e leggi tutto sullo stesso mercato.",
      "Sì, c'è anche gold/XAUUSD e tanti altri. Il catalogo è nel desk dopo il login."
    ]
  },
  {
    "id": "disclaimer",
    "q": [
      "e consulenza finanziaria",
      "garantite i guadagni",
      "e un segnale automatico",
      "rischio"
    ],
    "keys": [
      "consulenza",
      "garanzia",
      "guadagn",
      "rischio",
      "automatico"
    ],
    "answers": [
      "No consulenza personalizzata e nessuna garanzia di risultato. Strumenti informativi: i mercati possono far perdere. /termini"
    ]
  },
  {
    "id": "mobile",
    "q": [
      "funziona su telefono",
      "c e app mobile",
      "uso da iphone"
    ],
    "keys": [
      "telefono",
      "mobile",
      "iphone",
      "android",
      "app"
    ],
    "answers": [
      "Si usa dal browser anche dal telefono. Non c'è un'app store dedicata: apri leona-lab.com e fai login."
    ]
  },
  {
    "id": "prova",
    "q": [
      "c e una prova gratis",
      "trial",
      "posso provare gratis"
    ],
    "keys": [
      "prova gratis",
      "trial",
      "free"
    ],
    "answers": [
      "Al momento l'accesso al desk passa dai piani a pagamento su /prezzi. Per esigenze particolari: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "differenza_piani",
    "q": [
      "che differenza c e tra i piani",
      "i piani sono diversi come funzioni"
    ],
    "keys": [
      "differenza piani",
      "piani diversi"
    ],
    "answers": [
      "Le funzioni del desk sono le stesse: cambia solo come paghi (mese / anno / lifetime)."
    ]
  },
  {
    "id": "cache_live",
    "q": [
      "cosa significa cache",
      "cosa significa live",
      "badge cache"
    ],
    "keys": [
      "cache",
      "live",
      "failover"
    ],
    "answers": [
      "LIVE = feed fresco, CACHE = dato salvato (più cautela), FAILOVER = fonte alternativa. Ti dice quanto fidarti della freschezza."
    ]
  },
  {
    "id": "timeframe",
    "q": [
      "che timeframe usare",
      "timeframe consigliato"
    ],
    "keys": [
      "timeframe"
    ],
    "answers": [
      "Dipende dal tuo setup. In alto scegli 3M/6M/1Y/… e allinea la lettura a quell'orizzonte. Molti partono da 1Y per contesto."
    ]
  },
  {
    "id": "bias_long_short",
    "q": [
      "cosa significa bias long",
      "bias short cosa vuol dire"
    ],
    "keys": [
      "bias long",
      "bias short"
    ],
    "answers": [
      "LONG = lettura a favore di rialzo/acquisto, SHORT ribasso/vendita, WAIT resta fuori. È una sintesi, non un ordine."
    ]
  },
  {
    "id": "non_capisco",
    "q": [
      "non ho capito",
      "spiega meglio",
      "puoi ripetere"
    ],
    "keys": [
      "non ho capito",
      "spiega meglio",
      "ripeti"
    ],
    "answers": [
      "Certo — dimmi solo il pezzo: PayPal, Lifetime, iscrizione, COT, Valuation o Timing. Lo rifaccio più semplice."
    ]
  },
  {
    "id": "orari_supporto",
    "q": [
      "che orari avete",
      "quando rispondete"
    ],
    "keys": [
      "orari"
    ],
    "answers": [
      "L'assistente qui è sempre disponibile. L'email umana supportleonalab@gmail.com risponde il prima possibile in fascia lavorativa."
    ]
  },
  {
    "id": "lingua",
    "q": [
      "parli inglese",
      "english",
      "solo italiano"
    ],
    "keys": [
      "inglese",
      "english"
    ],
    "answers": [
      "Qui ti rispondo in italiano. Se preferisci assistenza in altra lingua, scrivi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "privacy",
    "q": [
      "dove vedo la privacy",
      "gdpr",
      "dati personali"
    ],
    "keys": [
      "privacy",
      "gdpr",
      "dati"
    ],
    "answers": [
      "Privacy su /privacy e termini su /termini. Domande sui dati account: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "termini",
    "q": [
      "termini di servizio",
      "condizioni"
    ],
    "keys": [
      "termini",
      "condizioni"
    ],
    "answers": [
      "I termini sono su /termini. Pagando accetti termini e privacy."
    ]
  },
  {
    "id": "paypal_alternativa",
    "q": [
      "alternativa a paypal",
      "solo paypal posso"
    ],
    "keys": [
      "solo paypal"
    ],
    "answers": [
      "Al momento l'alternativa è Stripe (carta). Se sei bloccato senza altre opzioni, scrivi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "bonifico",
    "q": [
      "posso pagare con bonifico",
      "bonifico bancario"
    ],
    "keys": [
      "bonifico"
    ],
    "answers": [
      "Il checkout standard è Stripe. Per bonifico/casi speciali chiedi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "iva",
    "q": [
      "i prezzi sono iva inclusa",
      "iva"
    ],
    "keys": [
      "iva"
    ],
    "answers": [
      "I prezzi li vedi su /prezzi come indicati in pagina. Dubbi fiscali/ricevuta: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "valuta_pagamento",
    "q": [
      "pago in euro",
      "dollari o euro"
    ],
    "keys": [
      "pago in euro"
    ],
    "answers": [
      "I piani sul sito sono in euro (€) su /prezzi."
    ]
  },
  {
    "id": "mensile_flessibile",
    "q": [
      "il mensile posso disdirlo",
      "mensile senza vincoli"
    ],
    "keys": [
      "senza vincoli"
    ],
    "answers": [
      "Sì, il mensile è pensato flessibile: disdici quando vuoi dal portale abbonamento."
    ]
  },
  {
    "id": "annuale_risparmio",
    "q": [
      "quanto risparmio con l annuale",
      "convenienza annuale"
    ],
    "keys": [
      "risparmio"
    ],
    "answers": [
      "L'annuale a 219,90 € equivale a circa 18,33 €/mese rispetto ai 24,90 del mensile."
    ]
  },
  {
    "id": "stesso_accesso",
    "q": [
      "tutti i piani hanno le stesse cose",
      "lifetime ha piu funzioni"
    ],
    "keys": [
      "stesse cose",
      "stesso accesso"
    ],
    "answers": [
      "Sì: stesso desk completo. Cambia solo il modo di pagamento."
    ]
  },
  {
    "id": "dopo_lifetime",
    "q": [
      "dopo lifetime cosa succede",
      "lifetime aggiornamenti futuri"
    ],
    "keys": [
      "aggiornamenti"
    ],
    "answers": [
      "Con Lifetime resti dentro al prodotto; gli aggiornamenti del desk restano nel flusso normale dell'app."
    ]
  },
  {
    "id": "cot_settimanale",
    "q": [
      "il cot ogni quanto si aggiorna",
      "cot quanto spesso"
    ],
    "keys": [
      "ogni quanto"
    ],
    "answers": [
      "Il COT è tipicamente settimanale (report CFTC). In desk vedi anche lo stato feed/cache."
    ]
  },
  {
    "id": "cot_oro",
    "q": [
      "cot sull oro",
      "cot gold",
      "cot xau"
    ],
    "keys": [
      "cot oro",
      "cot gold",
      "cot xau"
    ],
    "answers": [
      "Sì, su XAUUSD/gold hai la vista COT dedicata. Scegli l'asset e apri tab COT."
    ]
  },
  {
    "id": "valuation_oro",
    "q": [
      "valuation sull oro",
      "valuation gold"
    ],
    "keys": [
      "valuation oro",
      "valuation gold"
    ],
    "answers": [
      "Su gold/spot la valuation usa serie tipo GC=F e comparabili DXY/bonds/oro. Tab Valuation."
    ]
  },
  {
    "id": "segnali_qualita",
    "q": [
      "qualita dati bassa cosa faccio",
      "qualita bassa"
    ],
    "keys": [
      "qualita"
    ],
    "answers": [
      "Se la qualità dati è bassa: riduci size e fiducia sul bias, aspetta feed più pulito o crocia più fonti del desk."
    ]
  },
  {
    "id": "macro_alta",
    "q": [
      "evento rosso cosa faccio",
      "importanza alta"
    ],
    "keys": [
      "importanza alta",
      "bordo rosso"
    ],
    "answers": [
      "Su eventi ad alta importanza di solito si riduce size o si evita di forzare l'ingresso proprio in faccia alla news."
    ]
  },
  {
    "id": "news_fonte",
    "q": [
      "da dove arrivano le news",
      "fonti news"
    ],
    "keys": [
      "fonti news",
      "fonti"
    ],
    "answers": [
      "Breaking News aggrega RSS (BBC World, Google News World, Al Jazeera) via backend. Apri il link per la fonte originale."
    ]
  },
  {
    "id": "registrati_link",
    "q": [
      "link registrazione",
      "pagina registrati"
    ],
    "keys": [
      "registrati"
    ],
    "answers": [
      "Pagina registrazione: /registrati (dopo il pagamento). Login: /login. Piani: /prezzi."
    ]
  },
  {
    "id": "desk_dove",
    "q": [
      "dove e il desk",
      "come apro il desk",
      "dashboard dove"
    ],
    "keys": [
      "desk",
      "dashboard"
    ],
    "answers": [
      "Dopo il login apri il desk su /app."
    ]
  },
  {
    "id": "filtri_asset",
    "q": [
      "come cambio asset",
      "dove seleziono il mercato"
    ],
    "keys": [
      "cambio asset",
      "seleziono"
    ],
    "answers": [
      "In alto: Tipologia + campo Asset + timeframe. Cambia lì e tutto il desk si riallinea."
    ]
  },
  {
    "id": "reset_zoom",
    "q": [
      "a cosa serve reset zoom",
      "reset zoom"
    ],
    "keys": [
      "reset zoom"
    ],
    "answers": [
      "Reset Zoom riporta i grafici alla vista base se hai zoommato/panato."
    ]
  },
  {
    "id": "refresh",
    "q": [
      "cosa fa aggiorna ora",
      "refresh ogni quanto"
    ],
    "keys": [
      "aggiorna ora",
      "refresh"
    ],
    "answers": [
      "«Aggiorna ora» forza un refresh. C'è anche l'intervallo refresh impostabile nella barra controlli."
    ]
  },
  {
    "id": "vista_desk_focus",
    "q": [
      "differenza desk view e focus",
      "focus view"
    ],
    "keys": [
      "desk view",
      "focus view"
    ],
    "answers": [
      "Desk View è la vista operativa standard; Focus allarga un po' il layout. Le scegli dal menu Vista."
    ]
  },
  {
    "id": "segnali_non_ordine",
    "q": [
      "il segnale mi apre operazioni",
      "trade automatici"
    ],
    "keys": [
      "trade automatici"
    ],
    "answers": [
      "No, non apre trade da sola. È una lettura/playbook: la decisione resta tua."
    ]
  },
  {
    "id": "cot_e_valuation",
    "q": [
      "prima cot o valuation",
      "ordine cot valuation"
    ],
    "keys": [
      "prima cot"
    ],
    "answers": [
      "Spesso parto da COT (flusso) e Valuation (stretch), poi stagione/timing, poi segnale. Adatta al tuo stile."
    ]
  },
  {
    "id": "wait_o_out",
    "q": [
      "se e wait resto fuori",
      "wait significa uscire"
    ],
    "keys": [
      "resto fuori"
    ],
    "answers": [
      "WAIT = non forzare. Puoi restare flat o tenere size minima."
    ]
  },
  {
    "id": "supporto_veloce",
    "q": [
      "rispondete subito",
      "urgente assistenza"
    ],
    "keys": [
      "urgente"
    ],
    "answers": [
      "Qui rispondo subito sulle FAQ prodotto. Per urgenze account/pagamento manda mail a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "cambio_piano",
    "q": [
      "posso cambiare piano",
      "passare da mensile ad annuale"
    ],
    "keys": [
      "cambiare piano",
      "passare da"
    ],
    "answers": [
      "Per upgrade/cambio piano usa Gestisci abbonamento nel desk o scrivi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "piu_account",
    "q": [
      "posso condividere account",
      "due persone stesso account"
    ],
    "keys": [
      "condivid",
      "stesso account"
    ],
    "answers": [
      "L'account è personale. Per dubbi su accessi multipli chiedi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "dati_storici",
    "q": [
      "i dati sono reali",
      "numeri inventati"
    ],
    "keys": [
      "dati reali",
      "inventati"
    ],
    "answers": [
      "Timing e stagione lavorano su storico reale dell'asset (media/hit-rate), non su numeri a caso. Resta statistica, non profezia."
    ]
  },
  {
    "id": "no_broker",
    "q": [
      "siete un broker",
      "posso tradare qui dentro"
    ],
    "keys": [
      "broker",
      "tradare qui"
    ],
    "answers": [
      "No, non siamo un broker: niente esecuzione ordini. Solo analisi/contesto."
    ]
  },
  {
    "id": "come_mai_prezzo",
    "q": [
      "perche costa cosi",
      "perche questi prezzi"
    ],
    "keys": [
      "perche costa"
    ],
    "answers": [
      "Il prezzo apre il desk multi-modulo. Se vuoi flessibilità c'è il mensile; se vuoi impegno lungo, annuale/lifetime. /prezzi"
    ]
  },
  {
    "id": "ok",
    "q": [
      "ok",
      "va bene",
      "perfetto",
      "capito"
    ],
    "keys": [
      "ok",
      "va bene",
      "perfetto",
      "capito"
    ],
    "answers": [
      "Perfetto. Se ti serve il pezzo dopo (COT, iscrizione, Lifetime…) dimmi pure."
    ]
  },
  {
    "id": "altro",
    "q": [
      "altro",
      "cos altro puoi dirmi",
      "che domande posso fare"
    ],
    "keys": [
      "altro",
      "che domande"
    ],
    "answers": [
      "Puoi chiedermi PayPal, prezzi, Lifetime, perché abbonarsi, iscrizione, e come leggere COT/stagione/Valuation/segnali/macro/news."
    ]
  },
  {
    "id": "mensile_include",
    "q": [
      "il mensile cosa include"
    ],
    "keys": [
      "mensile include"
    ],
    "answers": [
      "Il mensile include tutto il desk, come annuale e lifetime. Cambia solo il pagamento."
    ]
  },
  {
    "id": "annuale_include",
    "q": [
      "l annuale cosa include"
    ],
    "keys": [
      "annuale include"
    ],
    "answers": [
      "L'annuale ha lo stesso desk del mensile, paghi l'anno anticipato a 219,90 €."
    ]
  },
  {
    "id": "lifetime_include",
    "q": [
      "il lifetime cosa include"
    ],
    "keys": [
      "lifetime include"
    ],
    "answers": [
      "Lifetime = stesso desk completo, pagamento unico a vita."
    ]
  },
  {
    "id": "dove_prezzi",
    "q": [
      "dove vedo i prezzi",
      "link prezzi"
    ],
    "keys": [
      "dove vedo i prezzi"
    ],
    "answers": [
      "Qui: /prezzi"
    ]
  },
  {
    "id": "dove_login",
    "q": [
      "dove faccio il login",
      "link login"
    ],
    "keys": [
      "dove login"
    ],
    "answers": [
      "Login: /login"
    ]
  },
  {
    "id": "dove_assistenza",
    "q": [
      "dove e assistenza",
      "pagina assistenza"
    ],
    "keys": [
      "dove assistenza"
    ],
    "answers": [
      "Assistenza: /assistenza — email supportleonalab@gmail.com"
    ]
  },
  {
    "id": "cot_tab",
    "q": [
      "dove trovo il cot",
      "tab cot"
    ],
    "keys": [
      "tab cot",
      "trovo il cot"
    ],
    "answers": [
      "Dopo il login, tab COT nella barra Analisi del desk (/app)."
    ]
  },
  {
    "id": "tab_valuation",
    "q": [
      "dove trovo valuation",
      "tab valuation"
    ],
    "keys": [
      "tab valuation"
    ],
    "answers": [
      "Nel desk, tab Valuation (serve login)."
    ]
  },
  {
    "id": "tab_stagione",
    "q": [
      "dove trovo stagionalita",
      "tab stagionalita"
    ],
    "keys": [
      "tab stagional"
    ],
    "answers": [
      "Tab Stagionalità nel desk, con timing giorni del mese."
    ]
  },
  {
    "id": "tab_segnali",
    "q": [
      "dove trovo i segnali",
      "tab segnali"
    ],
    "keys": [
      "tab segnal"
    ],
    "answers": [
      "Tab Segnali / Signal Center nel desk."
    ]
  },
  {
    "id": "tab_macro",
    "q": [
      "dove trovo macro",
      "tab macro"
    ],
    "keys": [
      "tab macro"
    ],
    "answers": [
      "Tab Macro nel desk: calendario eventi."
    ]
  },
  {
    "id": "tab_news",
    "q": [
      "dove trovo news",
      "tab news"
    ],
    "keys": [
      "tab news"
    ],
    "answers": [
      "Tab News nel desk: Breaking News mondiali."
    ]
  },
  {
    "id": "long_day_def",
    "q": [
      "cosa e giorno long",
      "long day significato"
    ],
    "keys": [
      "giorno long"
    ],
    "answers": [
      "Giorno long = giorno del mese storicamente più favorevole ai rialzi medi, nel timing Leona.Lab."
    ]
  },
  {
    "id": "short_day_def",
    "q": [
      "cosa e giorno short",
      "short day significato"
    ],
    "keys": [
      "giorno short"
    ],
    "answers": [
      "Giorno short = giorno del mese storicamente più favorevole ai ribassi medi, nel timing."
    ]
  },
  {
    "id": "bias_mese",
    "q": [
      "cosa e bias del mese",
      "bias mese"
    ],
    "keys": [
      "bias del mese",
      "bias mese"
    ],
    "answers": [
      "Bias del mese = tendenza media di quel mese nella stagione, da leggere insieme ai giorni timing."
    ]
  },
  {
    "id": "oi",
    "q": [
      "cosa e open interest",
      "oi momentum"
    ],
    "keys": [
      "open interest"
    ],
    "answers": [
      "Open interest è l'interesse aperto sui futures; in COT/KPI vedi anche momentum OI come contesto."
    ]
  },
  {
    "id": "dxy",
    "q": [
      "perche dxy",
      "a cosa serve dxy in valuation"
    ],
    "keys": [
      "dxy"
    ],
    "answers": [
      "In Valuation il DXY è il comparabile tipico sul Forex: misura stretch vs dollaro."
    ]
  },
  {
    "id": "bonds_val",
    "q": [
      "perche bonds in valuation",
      "zb valuation"
    ],
    "keys": [
      "bonds",
      "zb"
    ],
    "answers": [
      "Sui indici i bonds (ZB=F) sono il comparabile tipico in Valuation."
    ]
  },
  {
    "id": "gc_val",
    "q": [
      "perche gc in valuation"
    ],
    "keys": [
      "gc=f"
    ],
    "answers": [
      "GC=F è il future oro usato in Valuation stile TV, soprattutto su metalli."
    ]
  },
  {
    "id": "non_consulenza2",
    "q": [
      "mi date consigli operativi personalizzati"
    ],
    "keys": [
      "personalizz"
    ],
    "answers": [
      "No: niente consulenza personalizzata. Ti diamo strumenti e letture; la decisione resta tua."
    ]
  },
  {
    "id": "backtest",
    "q": [
      "avete backtest",
      "posso backtestare"
    ],
    "keys": [
      "backtest"
    ],
    "answers": [
      "Ci sono letture storiche (stagione/timing). Non è un strategy builder completo tipo TradingView."
    ]
  },
  {
    "id": "alert",
    "q": [
      "ci sono alert",
      "notifiche"
    ],
    "keys": [
      "alert",
      "notifiche"
    ],
    "answers": [
      "In desk ci sono feed/alert interni a seconda del modulo. Per canali esterni chiedi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "comunita",
    "q": [
      "c e una community",
      "gruppo telegram",
      "discord"
    ],
    "keys": [
      "community",
      "telegram",
      "discord"
    ],
    "answers": [
      "Il prodotto è il desk web. Per community/canali ufficiali chiedi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "chi_ha_fatto",
    "q": [
      "chi ha creato leona",
      "chi siete"
    ],
    "keys": [
      "chi ha creato",
      "chi siete"
    ],
    "answers": [
      "È un desk nato da trader: idea «contesto chiaro, poi decidi tu»."
    ]
  },
  {
    "id": "roadmap",
    "q": [
      "uscirete nuove funzioni",
      "roadmap"
    ],
    "keys": [
      "roadmap",
      "nuove funzioni"
    ],
    "answers": [
      "Il desk evolve. Idee/richieste: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "errore_sito",
    "q": [
      "il sito non carica",
      "errore 500",
      "bug pagina"
    ],
    "keys": [
      "non carica",
      "bug",
      "errore"
    ],
    "answers": [
      "Prova refresh/altra rete. Se persiste, scrivi a supportleonalab@gmail.com con browser, orario e screenshot."
    ]
  },
  {
    "id": "lento",
    "q": [
      "il desk e lento",
      "ci mette tanto"
    ],
    "keys": [
      "lento"
    ],
    "answers": [
      "Dipende da rete/feed. Prova refresh; se è sistematico segnala a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "piu_asset",
    "q": [
      "posso seguire piu asset",
      "cambio spesso mercato"
    ],
    "keys": [
      "piu asset",
      "più asset"
    ],
    "answers": [
      "Sì, cambi asset dai filtri quando vuoi: il desk si riallinea."
    ]
  },
  {
    "id": "export",
    "q": [
      "posso esportare i dati",
      "download csv"
    ],
    "keys": [
      "esport",
      "csv"
    ],
    "answers": [
      "Oggi il focus è la lettura in desk. Se ti serve export, chiedi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "api_pubblica",
    "q": [
      "avete api",
      "api pubblica"
    ],
    "keys": [
      "api"
    ],
    "answers": [
      "Il sito espone API interne all'app. API pubblica per terzi non è il focus; domande a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "student",
    "q": [
      "sconto studenti"
    ],
    "keys": [
      "studenti"
    ],
    "answers": [
      "Non c'è sconto studenti automatico. Scrivi a supportleonalab@gmail.com per casi particolari."
    ]
  },
  {
    "id": "azienda",
    "q": [
      "licenza team",
      "piu utenti azienda"
    ],
    "keys": [
      "team",
      "azienda",
      "licenza"
    ],
    "answers": [
      "Per accessi team/aziendali scrivi a supportleonalab@gmail.com."
    ]
  },
  {
    "id": "crypto",
    "q": [
      "avete crypto",
      "bitcoin"
    ],
    "keys": [
      "crypto",
      "bitcoin",
      "btc"
    ],
    "answers": [
      "Il focus è forex/metalli/indici/agricoli del catalogo desk. Guarda il selettore dopo il login."
    ]
  },
  {
    "id": "broker_libero",
    "q": [
      "funziona con il mio broker"
    ],
    "keys": [
      "broker"
    ],
    "answers": [
      "Non siamo legati a un broker: analizzi qui e operi dove vuoi tu."
    ]
  },
  {
    "id": "entry",
    "q": [
      "mi date entry precise",
      "prezzo di ingresso"
    ],
    "keys": [
      "entry",
      "ingresso"
    ],
    "answers": [
      "Non forniamo entry automatiche garantite. Hai contesto e playbook: l'ingresso lo costruisci tu."
    ]
  },
  {
    "id": "sl_tp",
    "q": [
      "mi date stop loss",
      "tp e sl"
    ],
    "keys": [
      "stop loss",
      "take profit"
    ],
    "answers": [
      "Ci sono hint/risk dove previsti, ma non sostituiscono il tuo risk management."
    ]
  },
  {
    "id": "corsi",
    "q": [
      "fate corsi",
      "academy"
    ],
    "keys": [
      "corso",
      "academy"
    ],
    "answers": [
      "Il prodotto è il desk operativo. Per formazione dedicata: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "tutorial",
    "q": [
      "avete video guide",
      "tutorial video"
    ],
    "keys": [
      "video",
      "tutorial"
    ],
    "answers": [
      "In app trovi le guide «i» sui tab. Per altro: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "social",
    "q": [
      "siete su instagram",
      "social"
    ],
    "keys": [
      "instagram",
      "social"
    ],
    "answers": [
      "I canali ufficiali portano aggiornamenti; il prodotto resta su leona-lab.com."
    ]
  },
  {
    "id": "pagamento_fallito",
    "q": [
      "pagamento fallito",
      "carta rifiutata"
    ],
    "keys": [
      "fallito",
      "rifiutata"
    ],
    "answers": [
      "Se Stripe rifiuta la carta, prova altro metodo o banca. Se hai addebiti strani: supportleonalab@gmail.com."
    ]
  },
  {
    "id": "doppio_addebito",
    "q": [
      "doppio addebito",
      "pagato due volte"
    ],
    "keys": [
      "doppio",
      "due volte"
    ],
    "answers": [
      "Scrivi subito a supportleonalab@gmail.com con email e ricevute Stripe: verifichiamo."
    ]
  },
  {
    "id": "email_non_arriva",
    "q": [
      "non mi arriva email",
      "email non ricevuta"
    ],
    "keys": [
      "non mi arriva",
      "email non"
    ],
    "answers": [
      "Controlla spam. Se dopo il checkout non arriva nulla, scrivi a supportleonalab@gmail.com con orario pagamento."
    ]
  },
  {
    "id": "posso_chiedere_qualsiasi",
    "q": [
      "posso chiederti qualsiasi cosa",
      "di cosa parli"
    ],
    "keys": [
      "qualsiasi"
    ],
    "answers": [
      "Posso aiutarti su Leona.Lab: piani, pagamenti, iscrizione e come leggere i moduli del desk. Fuori da questo ti mando a supportleonalab@gmail.com o ti dico che non lo so."
    ]
  }
];

  const STOP = new Set("il lo la i gli le un uno una di da in su per con a e o ma mi ti si ci vi che dei del della delle degli al alla ai alle nel nella the and or of to is are vorrei volevo sapere dimmi parlami info boh eh".split(" "));
  let lastTopicId = null;

  function normalize(text) {
    return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’`´]/g, "'").replace(/€/g, " euro ").replace(/[^a-z0-9'\s.+-]/g, " ").replace(/\s+/g, " ").trim();
  }
  function tokens(text) {
    return normalize(text).split(" ").map((w) => w.replace(/^'+|'+$/g, "")).filter((w) => w && w.length > 1 && !STOP.has(w));
  }
  function jaccard(a, b) {
    const A = new Set(a), B = new Set(b);
    let inter = 0; A.forEach((x) => { if (B.has(x)) inter++; });
    const uni = A.size + B.size - inter; return uni ? inter / uni : 0;
  }
  function scoreEntry(query, entry) {
    const q = normalize(query); const qt = tokens(query); if (!q) return 0;
    let score = 0;
    for (const sample of entry.q || []) {
      const s = normalize(sample); const st = tokens(sample); if (!s) continue;
      if (q === s) score += 120;
      else if (q.includes(s) || (s.length > 12 && s.includes(q))) score += 52;
      else {
        const jac = jaccard(qt, st);
        if (jac >= 0.55) score += 34 + jac * 50;
        else if (jac >= 0.35) score += 16 + jac * 24;
        let hit = 0; for (const t of st) if (qt.includes(t) || q.includes(t)) hit++;
        if (st.length) score += (hit / st.length) * 20;
      }
    }
    for (const key of entry.keys || []) {
      const k = normalize(key); if (!k) continue;
      if (k.includes(" ")) { if (q.includes(k)) score += 40; }
      else if (qt.includes(k)) score += 30;
      else if (k.length >= 4 && q.includes(k)) score += 16;
    }
    if (lastTopicId && entry.id === lastTopicId && qt.length <= 4) score += 12;
    return score;
  }
  function pickAnswer(entry, query) {
    const list = entry.answers || []; if (!list.length) return "";
    let h = 0; const s = normalize(query) + "|" + entry.id;
    for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
    h = (h + ((Date.now() / 45000) | 0)) >>> 0;
    return list[h % list.length];
  }
  function answerFor(query) {
    const raw = String(query || "").trim();
    if (!raw) return "Dimmi pure la domanda — anche in una riga sola.";
    const qn = normalize(raw);
    if (lastTopicId && /^(e |anche |dimmi di piu|di piu|altro|ok e)\b/.test(qn + " ")) {
      const prev = QA.find((x) => x.id === lastTopicId);
      if (prev) return pickAnswer(prev, raw + "|follow");
    }
    let best = null, bestScore = 0, second = null, secondScore = 0;
    for (const entry of QA) {
      const sc = scoreEntry(raw, entry);
      if (sc > bestScore) { second = best; secondScore = bestScore; best = entry; bestScore = sc; }
      else if (sc > secondScore) { second = entry; secondScore = sc; }
    }
    if (!best || bestScore < 18) {
      return "Non voglio risponderti a caso. Prova così:\n• «Si può pagare con PayPal?»\n• «Quanto dura il Lifetime?»\n• «Come si legge il COT?»\n• «Come mi iscrivo?»\n\nOppure " + SUPPORT_EMAIL;
    }
    lastTopicId = best.id;
    let text = pickAnswer(best, raw);
    if (second && secondScore >= 24 && bestScore - secondScore < 14 && best.id !== second.id && /\b(e|anche|,|\/)\b/.test(qn)) {
      text += "\n\n—\n\n" + pickAnswer(second, raw + "|2");
    }
    return text;
  }
  function el(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => { if (k === "text") node.textContent = v; else if (k === "html") node.innerHTML = v; else node.setAttribute(k, v); });
    return node;
  }
  function linkify(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/(\/prezzi|\/login|\/assistenza|\/termini|\/privacy|\/app|\/registrati)/g, '<a href="$1">$1</a>')
      .replace(/(supportleonalab@gmail\.com)/g, '<a href="mailto:$1">$1</a>')
      .replace(/\n/g, "<br>");
  }
  function mount() {
    if (document.getElementById("llAssistRoot")) return;
    const root = el("div", "ll-assist", { id: "llAssistRoot" });
    const panel = el("section", "ll-assist-panel", { id: "llAssistPanel", role: "dialog", "aria-label": "Assistente Leona.Lab", "aria-hidden": "true" });
    const head = el("header", "ll-assist-head");
    const headText = el("div", "ll-assist-head-text");
    headText.appendChild(el("strong", "", { text: "Assistente Leona.Lab" }));
    headText.appendChild(el("span", "ll-assist-status", { text: QA.length + " risposte · tono conversazione" }));
    const closeBtn = el("button", "ll-assist-close", { type: "button", "aria-label": "Chiudi", text: "×" });
    head.appendChild(headText); head.appendChild(closeBtn);
    const messages = el("div", "ll-assist-messages", { id: "llAssistMessages", role: "log", "aria-live": "polite" });
    const chips = el("div", "ll-assist-chips");
    QUICK.forEach((item) => { const chip = el("button", "ll-assist-chip", { type: "button", text: item.label }); chip.addEventListener("click", () => ask(item.q, item.label)); chips.appendChild(chip); });
    const form = el("form", "ll-assist-form");
    const input = el("input", "ll-assist-input", { id: "llAssistInput", type: "text", placeholder: "Scrivi come a una persona…", autocomplete: "off", maxlength: "300", "aria-label": "Domanda" });
    const send = el("button", "ll-assist-send", { type: "submit", text: "Invia" });
    form.appendChild(input); form.appendChild(send);
    const foot = el("p", "ll-assist-foot", { html: 'Assistente prodotto · non è consulenza · <a href="/assistenza">Assistenza umana</a>' });
    panel.appendChild(head); panel.appendChild(messages); panel.appendChild(chips); panel.appendChild(form); panel.appendChild(foot);
    const fab = el("button", "ll-assist-fab", { id: "llAssistFab", type: "button", "aria-label": "Apri assistente", "aria-expanded": "false", "aria-controls": "llAssistPanel" });
    fab.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 4v2h12V8H6zm0 4v2h8v-2H6z"/></svg>';
    root.appendChild(panel); root.appendChild(fab); document.body.appendChild(root);
    function addMessage(role, text) { const bubble = el("div", `ll-assist-msg ll-assist-msg-${role}`); if (role === "bot") bubble.innerHTML = linkify(text); else bubble.textContent = text; messages.appendChild(bubble); messages.scrollTop = messages.scrollHeight; }
    function setOpen(open) {
      root.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        if (!messages.childElementCount) addMessage("bot", "Ciao — parla pure normale: PayPal, Lifetime, perché abbonarti, come leggere COT/Valuation, come iscriverti…\n\nProblemi account: " + SUPPORT_EMAIL);
        setTimeout(() => input.focus(), 150);
      }
    }
    function ask(query, displayLabel) {
      const text = String(query || "").trim(); if (!text) return;
      setOpen(true); addMessage("user", displayLabel || text);
      const typing = el("div", "ll-assist-msg ll-assist-msg-bot ll-assist-typing", { text: "…" });
      messages.appendChild(typing); messages.scrollTop = messages.scrollHeight;
      const delay = 420 + Math.min(1000, 50 + text.length * 14) + Math.floor(Math.random() * 280);
      window.setTimeout(() => { typing.remove(); addMessage("bot", answerFor(text)); }, delay);
    }
    fab.addEventListener("click", () => setOpen(!root.classList.contains("is-open")));
    closeBtn.addEventListener("click", () => setOpen(false));
    form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; input.value = ""; ask(v); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && root.classList.contains("is-open")) setOpen(false); });
    window.__llAssistAnswer = answerFor;
    window.__llAssistCount = QA.length;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
