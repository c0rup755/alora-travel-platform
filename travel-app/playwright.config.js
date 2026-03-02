const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/ui',
  timeout: 30 * 1000,
  use: {
    baseURL: process.env.APP_URL || 'https://alora-travel-platform.vercel.app',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
});
