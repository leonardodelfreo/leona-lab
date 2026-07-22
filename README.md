# Leona.Lab

Desk multi-asset: COT, stagionalita, segnali e calendario macro.

## Avvio locale

```bash
npm start
```

Apri [http://127.0.0.1:8787](http://127.0.0.1:8787)

| Route | Descrizione |
| --- | --- |
| `/` | Landing |
| `/login` | Login |
| `/prezzi` | Scelta piano |
| `/registrati` | Creazione account |
| `/app` | Dashboard (auth) |

### Login default

- email/username: `leona@leonalab.com` oppure `leona`
- password: `leona123`

## Deploy

File pronti: `Procfile`, `render.yaml`, `railway.json`, `.env.example`.

Variabili:

- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT` (assegnato dal provider)

### Render

1. Crea un Web Service da questa cartella (o repo Git)
2. Start command: `node backend/server.js`
3. Aggiungi disco persistente montato su `/opt/render/project/src/data` (o path del servizio) per non perdere utenti/cache

### Railway

1. New Project → Deploy from folder/repo
2. Start command gia in `railway.json`
3. Abilita volume su `./data` se disponibile

> Le sessioni sono in memoria: usa **una sola istanza**. Gli utenti restano in `data/users.json`.

## Account flow

1. `/prezzi` → scegli Mensile / Annuale / Lifetime  
2. Checkout Stripe sicuro  
3. `/registrati?plan=...&session_id=...` → crea account  
4. login automatico → `/app`

### Stripe (obbligatorio in produzione)

Su Railway (Variables) imposta:

- `STRIPE_SECRET_KEY` = chiave segreta (`sk_test_...` o `sk_live_...`)
- `APP_BASE_URL` = `https://leona-lab-production.up.railway.app`

Opzionale:

- `ALLOW_FREE_REGISTER=true` per test senza pagamento
- `DATA_DIR=/data` se monti un volume persistente

Senza `STRIPE_SECRET_KEY` i piani si vedono, ma il bottone pagamento risponde che Stripe non e configurato.
