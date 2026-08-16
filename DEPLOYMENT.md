# Deployment Guide

How this project is hosted, piece by piece, and exactly what to do to get
the backend live. Written for whoever's doing the deploy, not just as a
reference — follow it top to bottom.

## Architecture

Three separate pieces, each hosted somewhere different:

```
Browser  →  Frontend (Vercel, Next.js)  →  Backend (Render, Express)  →  Database (MongoDB Atlas)
```

- **Frontend** — this repo's root (`app/`, `components/`, etc.), a Next.js
  app. Already deployed on Vercel, connected to this GitHub repo.
- **Backend** — the `backend/` folder, a plain Express API. **Not hosted
  anywhere yet as of this writing** — this is the missing piece.
- **Database** — MongoDB Atlas. Already set up and seeded with real data
  (products, categories, directory companies, news articles, admin user).

The frontend talks to the backend over plain HTTPS (`NEXT_PUBLIC_API_URL`),
and the backend talks to Atlas over the MongoDB protocol (`MONGO_URI`).
Atlas has no way to serve the frontend directly — the Express layer has to
exist and be reachable for anything on the live site to work.

## Step 1 — Host the backend on Render

1. Go to [render.com](https://render.com) and sign up (GitHub sign-in is
   fastest — it also makes connecting the repo below a one-click step).
2. Click **New +** → **Web Service**.
3. Connect the `techprivacy/Xceed` GitHub repo (authorize Render to access
   it if prompted).
4. Fill in the service settings:

   | Field | Value |
   |---|---|
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free (or paid, to skip the cold-start sleep) |

5. Add these environment variables (Render's dashboard → your service →
   **Environment**):

   | Variable | Where to get it |
   |---|---|
   | `MONGO_URI` | Your MongoDB Atlas connection string (Atlas dashboard → Connect → Drivers). Must include the real password, not the `<db_password>` placeholder Atlas shows by default. |
   | `JWT_SECRET` | Generate your own: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` — run that locally and paste the output. Never reuse a JWT secret across environments. |
   | `JWT_EXPIRES_IN` | `7d` |
   | `PORT` | `5000` |
   | `ADMIN_USERNAME` | Your choice, e.g. `admin` |
   | `ADMIN_PASSWORD` | A strong password — generate one: `node -e "console.log(require('crypto').randomBytes(9).toString('base64url'))"` |
   | `ADMIN_EMAIL` | Your admin contact email |
   | `CLIENT_URL` | Your live frontend URL, e.g. `https://www.xceedindia.com` (used for CORS) |
   | `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Your email provider's SMTP credentials. Optional at launch — the site works without these, it just won't send verification/reset/quote emails until they're set. |

   `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_EMAIL` only matter the very
   first time the backend starts against an empty `User` collection — if
   an admin already exists in your Atlas database (it does), these are
   ignored and the existing admin login still applies.

6. Click **Create Web Service**. Render will build and deploy — this
   takes a few minutes on the first run.
7. Once live, Render shows a URL like `https://xceed-backend-xxxx.onrender.com`.
   Test it: `https://<that-url>/api/health` should return
   `{"success":true,"message":"XCEED API is running"}`.

## Step 2 — Point the frontend at it

1. Go to your Vercel project → **Settings** → **Environment Variables**.
2. Set `NEXT_PUBLIC_API_URL` to `https://<your-render-url>/api` (include
   the `/api` suffix).
3. Redeploy the frontend (Vercel → Deployments → Redeploy on the latest
   commit) — `NEXT_PUBLIC_API_URL` is a build-time value, so an existing
   deployment won't pick up the change without a rebuild.

## Step 3 — Verify end to end

- Visit the live site and check the homepage loads real product data
  (not empty/broken sections).
- Visit `/directory` — should show real companies, not "No approved
  members yet."
- Log into `/login` with the admin credentials from Step 1.
- Submit the contact form and confirm it appears in Admin → Contact
  Enquiries.

If any of these fail, check the Render service's **Logs** tab first —
most failures at this stage are a missing/wrong environment variable.

## Notes

- **Free tier cold starts**: Render's free tier spins the service down
  after 15 minutes of no traffic. The next request then takes ~30-50s
  while it wakes back up. Fine for moderate traffic; upgrade to a paid
  instance ($7/mo as of writing) if that becomes a problem.
- **SMTP / Mandrill**: if using Mailchimp Transactional (Mandrill),
  `SMTP_HOST` is `smtp.mandrillapp.com`, `SMTP_PORT` is `587`, `SMTP_USER`
  is your Mandrill account username, `SMTP_PASS` is your Mandrill API
  key. The sending domain (`SMTP_FROM`'s domain) needs to be verified in
  your Mailchimp/Mandrill account (SPF/DKIM) or mail may not deliver.
- **Never commit real secrets** (`.env`, API keys, passwords) to this
  repo — `.env` is already gitignored. Environment variables belong in
  Render's/Vercel's dashboards, not in git history.
