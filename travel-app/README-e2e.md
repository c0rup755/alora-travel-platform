# End-to-end Test Guide

This document explains how to run the automated end-to-end checks for the Alora project.

1) API E2E script (no extra packages)

From the `travel-app` folder run:

```bash
node scripts/e2e-api.js
```

You can set `API_BASE` to point to a different backend host if needed:

```bash
API_BASE=https://alora-backend-production.up.railway.app/api node scripts/e2e-api.js
```

2) UI integration test (Playwright)

Requirements:
- Node.js (>=14)
- Playwright installed in the `travel-app` folder

Install Playwright and run the test:

```bash
cd travel-app
npm i -D @playwright/test
npx playwright install
npx playwright test tests/ui/e2e.spec.js
```

The Playwright test is a hybrid: it loads the UI and uses Playwright's API fixture to call backend endpoints to verify behavior.

Notes
- Start backend: `cd backend && npm start`
- Start frontend: `cd frontend && npm start`

Runtime toggle (mock vs. real providers)
----------------------------------------

If you configured `ADMIN_TOKEN` in your backend environment, you can toggle the `USE_MOCKS` runtime flag without redeploying.

Using the bash helper (requires `jq` to pretty-print):

```bash
# turn mocks OFF (use real providers)
ADMIN_TOKEN=your_admin_token BASE_URL=http://localhost:5000 ./scripts/toggle-mocks.sh false

# turn mocks ON
ADMIN_TOKEN=your_admin_token BASE_URL=http://localhost:5000 ./scripts/toggle-mocks.sh true
```

Or use the Node helper:

```bash
ADMIN_TOKEN=your_admin_token node scripts/toggle-mocks.js false
```

Check status:

```bash
curl -H "x-admin-token: your_admin_token" http://localhost:5000/api/admin/status
```
