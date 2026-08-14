# Rehman Homoeopathic Clinic & Store — Next.js Version

This is the Next.js (App Router) conversion of the original PHP project.
Same design, same appointment-booking flow and notification logic — just
running on Node.js instead of PHP, with **zero native dependencies**, so
`npm install` never needs a C++ build toolchain — it installs cleanly on
GitHub Actions, Vercel, Railway, Render, a VPS, or plain `npm install`
on Windows.

## 0. Important — what could and couldn't be converted

Only these files existed in the source project handed to this conversion:
`index.html`, `README.md`, `.env`, `.env.example`, `.gitignore`, `.htaccess`.
The PHP backend files the README *describes* — `api/appointments.php`,
`api/cron/send-confirmations.php`, `api/webhooks/whatsapp.php`, and every
file under `includes/` — were never actually provided as source code, only
as a written specification.

So: **the frontend (`index.html`) is an exact conversion** of every section,
every style, and the original logo image. **The backend (`lib/` and
`app/api/`) is a faithful re-implementation of the behavior described in
this README** (same validation rules, same optional-email handling, same
2-minute delay, same "a notification failure must never lose the
appointment" rule) — not a line-by-line port of PHP source that was never
seen. If you find the original PHP `api/`/`includes/` files, they can be
matched up exactly on request.

## 1. What changed vs the PHP version

| PHP version | Next.js version |
|---|---|
| `index.html` (static HTML) | `app/page.js` + `app/components/*` (React) |
| `api/appointments.php` | `app/api/appointments/route.js` |
| `api/cron/send-confirmations.php` (CLI-only) | `app/api/cron/send-confirmations/route.js` (HTTP, secret-protected) **and** `scripts/send-confirmations.mjs` (CLI, for real cron/Task Scheduler) |
| `api/webhooks/whatsapp.php` | `app/api/webhooks/whatsapp/route.js` |
| `includes/*.php` | `lib/*.js` |
| SQLite via PDO | **Plain JSON files** in `data/` (no native module to compile — see below) |
| `.env` loaded by a tiny custom loader | `.env.local`, loaded natively by Next.js (and by `scripts/send-confirmations.mjs` for the CLI script) |
| Resend for email | **Brevo** — your `.env.local` already has your real Brevo credentials, since that's what you were actually using |

### Why JSON files instead of SQLite

The original spec asked for SQLite because it needs "nothing to install."
`better-sqlite3` (the usual SQLite driver for Node) is a **native module**
— it has to compile C++ code during `npm install`, which fails on some
hosts/CI runners without build tools and can make a fresh `git clone` +
`npm install` throw errors. Plain JSON files need nothing to compile, so
GitHub → clone → `npm install` → `npm run dev`/`npm run build` always
works the same way everywhere. `lib/db.js` is the only file that touches
storage directly, so it's a one-file swap if you later want a real
database (Postgres, MySQL, etc.) for higher traffic.

Everything else — validation rules, optional email, the 2-minute delay,
rate limiting/duplicate protection — works the same way as before.

## 2. Project structure

```
app/
  page.js                        Homepage (all sections from the original site)
  layout.js                      Root layout + <head> metadata
  globals.css                    All the original CSS (unchanged)
  components/
    AppointmentForm.js           The booking form (client component)
    ConditionsMarquee.js         Scrolling "Conditions We Treat" chips + modal
    Reveal.js                    Fade/slide-in-on-scroll wrapper
    conditions.js                Data for the 28 conditions/symptoms
  api/
    appointments/route.js        POST — validate, rate-limit, save, notify admin
    cron/send-confirmations/route.js   GET/POST — process due confirmations (secret-protected)
    webhooks/whatsapp/route.js   GET (verify) / POST (delivery-status events)
lib/
  db.js                          JSON-file storage (appointments, rate limits, sweep marker)
  validation.js                  Server-side validation/sanitization (email optional)
  rateLimit.js                   Duplicate-submission protection
  whatsapp.js                    Meta WhatsApp Cloud API
  email.js                       Brevo transactional email
  sms.js                         Twilio SMS fallback
  confirmationSender.js          Shared "send patient confirmation" logic (idempotent)
  sweep.js                       Opportunistic due-confirmation check (throttled)
scripts/
  send-confirmations.mjs         CLI script for real cron / Task Scheduler
data/                            appointments.json etc. live here (auto-created, gitignored)
public/
  logo.jpg                       Extracted from the original page (was inline base64)
```

## 3. Running it locally (Windows, no deployment)

**Step 1 — Install Node.js** if you don't have it: https://nodejs.org (LTS version).

**Step 2 — Install dependencies.** Open Command Prompt in the project folder:

```cmd
cd path\to\rehman-homoeopathic-clinic
npm install
```

**Step 3 — Start the dev server:**

```cmd
npm run dev
```

**Step 4 — Open the site:** go to **http://localhost:3000**

`.env.local` is already filled in — nothing to edit to start testing
(WhatsApp/SMS credentials are still placeholders; your real Brevo email
credentials are already in there).

## 4. Testing the appointment flow

**Test A — with email:** fill the whole form, submit. You should see the
success message, and a new entry in `data/appointments.json` with
`patientEmailStatus: "pending"`.

**Test B — without email:** leave Email blank, submit. `patientEmailStatus`
should be `"not_applicable"` from the moment the entry is created — never
`"pending"` — proving no email attempt will ever be made for it.

**To trigger the 2-minute confirmation manually** instead of waiting for a
second submission (which triggers it opportunistically via the sweep):

```cmd
npm run send-confirmations
```

You should see `Processed 1 due confirmation(s).` and the entry's
`confirmationSent`, `patientWhatsappStatus`, `patientSmsStatus`, and
`patientEmailStatus` (if an email was given) will update. With placeholder
WhatsApp/SMS credentials these report `"failed"` — that's expected and
confirms the code tried and failed gracefully.

Testing the raw JSON case with curl:

```cmd
curl -X POST http://localhost:3000/api/appointments ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Patient\",\"phone\":\"+923001234567\",\"email\":\"\",\"preferredDate\":\"2026-08-19\",\"healthConcern\":\"Testing appointment\"}"
```

## 5. Pushing to GitHub

```bash
git init
git add .
git commit -m "Rehman Homoeopathic Clinic - Next.js"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

`.env.local` and the `data/` folder's JSON files are already in
`.gitignore`, so no secrets or patient data get pushed by accident.

## 6. Deploying / hosting

Any Node.js host works (Railway, Render, a VPS, cPanel with Node.js apps
enabled, etc.):

```bash
npm install
npm run build
npm start
```

**About Vercel/Netlify specifically:** their serverless functions use a
read-only/ephemeral filesystem in production, so the JSON files in `data/`
won't persist between requests there. This app runs fine on Vercel/Netlify
for the *website*, but for the *appointment storage* to persist reliably
on those platforms, swap `lib/db.js` for a hosted database (Vercel
Postgres, Supabase, Turso, etc.) — every other file only calls the
functions exported from `lib/db.js`, so that's the only file to change.
On Railway, Render, a VPS, or cPanel Node hosting, the JSON files persist
normally and no such change is needed.

**Setting up the confirmation cron in production** — pick one:
- A real system cron / scheduled task running `npm run send-confirmations`
  every minute (needs filesystem + Node access to the project folder —
  works on Railway/Render/VPS, not on serverless).
- An external scheduler (e.g. [cron-job.org](https://cron-job.org)) hitting:
  ```
  https://yourdomain.com/api/cron/send-confirmations?secret=YOUR_CRON_SECRET
  ```
  every minute — works anywhere, including serverless (once storage is a
  real database there).

**WhatsApp webhook:** in the Meta App Dashboard → WhatsApp → Configuration,
set the webhook URL to `https://yourdomain.com/api/webhooks/whatsapp` with
your `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, subscribed to the `messages` field.

## 7. Security notes carried over from before

- No credentials appear in any client-facing file — everything sensitive
  is read server-side via `process.env` inside `lib/` and `app/api/`.
- All patient-supplied text is stripped of HTML tags before storage or
  use in any message (`lib/validation.js`).
- The cron route requires `CRON_SECRET` to run over HTTP, so it can't be
  triggered by an outside request without it.
- The WhatsApp webhook verifies Meta's signature before trusting any
  payload, once `WHATSAPP_APP_SECRET` is set.

## 8. About your Brevo API key

Your original `.env` file had a **real, live Brevo API key** in it (not a
placeholder). It's been carried over into `.env.local` so email sending
keeps working, but since it has passed through this conversation in plain
text, it's worth rotating/regenerating it from your Brevo dashboard once
you're ready to deploy — and always keep `.env.local` out of git (it's
already in `.gitignore`).
