# Travel App (prototype)

[![CI](https://github.com/c0rup755/alora-travel-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/c0rup755/alora-travel-platform/actions/workflows/ci.yml)

This badge points to the `c0rup755/alora-travel-platform` repository workflow.

This repo contains a minimal full-stack scaffold for a travel app prototype.

[![CI/CD Pipeline](https://github.com/c0rup755/alora-travel-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/c0rup755/alora-travel-platform/actions/workflows/ci.yml)

Structure:
- backend: Express server + adapters + services
- frontend: React + Vite app (placeholder components)

To run backend:

```bash
cd travel-app/backend
npm install
npm start
```

To run frontend (separate terminal):

```bash
cd travel-app/frontend
npm install
npm run dev
```

The frontend expects the backend to be available at `/api` (same origin). For local development you may need to proxy or run both services and configure CORS.

Deployment & production checklist
-------------------------------

1) Railway (Backend)
- Create a Railway project and connect the `travel-app/backend` folder.
- Add the environment variables (Railway UI -> Variables):
	- `AFFILIATE_ID` (your TravelPayouts affiliate id)
	- `KIWI_API_KEY` (Kiwi/Tequila API key)
	- `SKY_API_KEY` (Skyscanner API key, if used)
	- `BOOKING_API_KEY` (Booking/Expedia key, if used)
- Ensure `PORT` is set (Railway provides it automatically). Restart the service after adding variables.

2) Vercel (Frontend)
- Connect the `travel-app/frontend` project to Vercel (link to GitHub repo).
- Add an Environment Variable in Vercel settings:
	- `REACT_APP_TP_SCRIPT_URL` = full TravelPayouts script URL (example: `https://tp-em.com/NTAzNDU0.js?t=503454`)
- Deploy — Vercel will rebuild the frontend using the configured environment variables.

3) GitHub Actions (CI)
- If you want CI to test against real providers, add the same keys to GitHub repository Secrets:
	- `AFFILIATE_ID`, `KIWI_API_KEY`, `SKY_API_KEY`, `BOOKING_API_KEY`
- The CI workflow (`.github/workflows/ci.yml`) reads these secrets and exposes them to the test job.

4) GitHub repository secrets (quick guide)
- Install GitHub CLI (`gh`) and authenticate: `gh auth login`.
- To upload secrets quickly from your terminal (replace REPO):

```bash
export GITHUB_REPO=c0rup755/alora-travel-platform
export AFFILIATE_ID=your_affiliate_id
export KIWI_API_KEY=your_kiwi_key
# ... other secrets as needed
./scripts/set-github-secrets.sh
```

The helper will call `gh secret set` for the recommended secret names. You can also add secrets via the GitHub UI.

4) Local preflight
- Before pushing production keys, verify locally:

```bash
cd travel-app/backend
cp .env.example .env
# edit .env and add real values
node check-config.js # ensures required env vars are present
npm start
```

Security notes
- Never commit `.env` or secret keys to the repo. Use platform secrets (Railway / Vercel / GitHub). 
- Keep provider API calls server-side (they already live in `backend/services`).

