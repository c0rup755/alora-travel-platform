const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { searchFlights } = require('./services/flightService');
const { searchHotels } = require('./services/hotelService');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory "database" for planner (replace with MongoDB/PostgreSQL later)
let userPlanner = [];

// ─────────────────────────────────────────────────────────────
// FLIGHT SEARCH ENDPOINT
// ─────────────────────────────────────────────────────────────
app.get('/api/flights', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    if (!origin || !destination || !date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const flights = await searchFlights({ origin, destination, date });
    res.json({ success: true, data: flights, count: flights.length });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// HOTEL SEARCH ENDPOINT
// ─────────────────────────────────────────────────────────────
app.get('/api/hotels', async (req, res) => {
  try {
    const { location, checkIn, checkOut } = req.query;
    
    if (!location || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const hotels = await searchHotels({ location, checkIn, checkOut });
    res.json({ success: true, data: hotels, count: hotels.length });
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PLANNER ENDPOINTS
// ─────────────────────────────────────────────────────────────
app.get('/api/planner', (req, res) => {
  res.json({ success: true, data: userPlanner });
});

app.post('/api/planner/add', (req, res) => {
  const item = {
    id: Date.now().toString(),
    ...req.body,
    addedAt: new Date().toISOString()
  };
  userPlanner.push(item);
  res.json({ success: true, data: item });
});

app.delete('/api/planner/:id', (req, res) => {
  userPlanner = userPlanner.filter(item => item.id !== req.params.id);
  res.json({ success: true, message: 'Item removed' });
});

app.put('/api/planner/clear', (req, res) => {
  userPlanner = [];
  res.json({ success: true, message: 'Planner cleared' });
});

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Travel API Server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   GET  /api/flights?origin=JFK&destination=LHR&date=2024-12-25`);
  console.log(`   GET  /api/hotels?location=London&checkIn=2024-12-25&checkOut=2024-12-30`);
  console.log(`   GET  /api/planner`);
  console.log(`   POST /api/planner/add`);
  console.log(`   DELETE /api/planner/:id`);
  console.log(`   PUT    /api/planner/clear`);
});
