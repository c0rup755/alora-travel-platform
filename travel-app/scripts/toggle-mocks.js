#!/usr/bin/env node
// Node helper to toggle the runtime USE_MOCKS flag via admin endpoint.
// Usage: ADMIN_TOKEN=xxx node scripts/toggle-mocks.js false

const fetch = require('node-fetch');

const base = process.env.BASE_URL || 'http://localhost:5000';
const adminToken = process.env.ADMIN_TOKEN;
const arg = process.argv[2] || 'false';
const useMocks = arg === 'true' || arg === '1';

if (!adminToken) {
  console.error('Missing ADMIN_TOKEN env var.');
  process.exit(1);
}

(async () => {
  const res = await fetch(`${base}/api/admin/toggle-mocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken
    },
    body: JSON.stringify({ useMocks })
  });

  const data = await res.json().catch(() => null);
  console.log('Response status:', res.status);
  console.log('Body:', data);
})();
