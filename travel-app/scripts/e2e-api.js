#!/usr/bin/env node
// Simple API-level E2E test script (no external deps)
const API_BASE = (process.env.API_BASE || 'http://localhost:5000/api').trim();

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, json };
}

async function main(){
  console.log('API_BASE:', API_BASE);

  console.log('1) Searching flights...');
  const searchUrl = `${API_BASE}/flights?origin=JFK&destination=LHR&date=2024-12-25`;
  const search = await fetchJson(searchUrl);
  if(!search.ok) {
    console.error('Flight search failed', search.status, search.json);
    process.exit(2);
  }
  console.log('Flights found:', (search.json && search.json.count) || 0);
  const flight = search.json && search.json.data && search.json.data[0];
  if(!flight){
    console.error('No flight data returned');
    process.exit(3);
  }

  console.log('2) Adding flight to planner...');
  const addResp = await fetchJson(`${API_BASE}/planner/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: `E2E ${flight.id}`, flightId: flight.id, airline: flight.airline, price: flight.price, origin: flight.origin, destination: flight.destination })
  });
  if(!addResp.ok){
    console.error('Failed to add to planner', addResp.status, addResp.json);
    process.exit(4);
  }
  console.log('Added planner item id:', addResp.json && addResp.json.data && addResp.json.data.id);

  console.log('3) Fetching planner to verify...');
  const planner = await fetchJson(`${API_BASE}/planner`);
  if(!planner.ok){
    console.error('Failed to fetch planner', planner.status, planner.json);
    process.exit(5);
  }
  const items = planner.json && planner.json.plannerItems || planner.json.data || [];
  console.log('Planner count:', items.length);
  const found = items.find(i => i.flightId === flight.id || i.title === `E2E ${flight.id}`);
  if(!found){
    console.error('Added flight not found in planner');
    process.exit(6);
  }

  console.log('E2E API test succeeded');
  process.exit(0);
}

main().catch(err => {
  console.error('E2E script error', err);
  process.exit(1);
});
