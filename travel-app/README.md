# Travel App (prototype)

[![CI](https://github.com/c0rup755/alora-travel-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/c0rup755/alora-travel-platform/actions/workflows/ci.yml)

This badge points to the `c0rup755/alora-travel-platform` repository workflow.

This repo contains a minimal full-stack scaffold for a travel app prototype.

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
