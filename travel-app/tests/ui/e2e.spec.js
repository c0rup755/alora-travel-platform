// Playwright UI test (requires Playwright to be installed)
const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const API_BASE = (process.env.API_BASE || 'https://alora-travel-platform-production.up.railway.app/api').trim();

test('search flights and add to planner (UI+API hybrid)', async ({ page, request }) => {
  await page.goto(APP_URL);

  // Ensure page loaded
  await expect(page).toHaveTitle(/Alora|Alora/);

  // Trigger a flight search via the backend API to simulate results (UI shows same data)
  const flightsResp = await request.get(`${API_BASE}/flights?origin=JFK&destination=LHR&date=2024-12-25`);
  expect(flightsResp.ok()).toBeTruthy();
  const flightsJson = await flightsResp.json();
  expect(flightsJson.count).toBeGreaterThan(0);

  // Wait briefly for UI to render (the UI reads from user actions; we just check it loads)
  await page.waitForTimeout(500);

  // Add first flight to planner via API (simulate clicking add)
  const flight = flightsJson.data[0];
  const addResp = await request.post(`${API_BASE}/planner/add`, { data: { title: `UI E2E ${flight.id}`, flightId: flight.id, airline: flight.airline, price: flight.price } });
  expect(addResp.ok()).toBeTruthy();
  const added = await addResp.json();
  expect(added.success).toBeTruthy();

  // Verify via API that planner contains the item
  const plannerResp = await request.get(`${API_BASE}/planner`);
  expect(plannerResp.ok()).toBeTruthy();
  const plannerJson = await plannerResp.json();
  const found = plannerJson.plannerItems.find(i => i.flightId === flight.id || i.title === `UI E2E ${flight.id}`);
  expect(found).toBeTruthy();
});
