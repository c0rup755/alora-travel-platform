const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { searchHotels } = require('./services/hotelService');
const plannerRoutes = require('./routes/plannerRoutes');
const flightRoutes = require('./routes/flightRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Production CORS config - whitelist Vercel + localhost
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://alora-travel-platform.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ Routes mounted at /api/*
app.use('/api/planner', plannerRoutes);
app.use('/api/flights', flightRoutes);

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
// HEALTH CHECK ENDPOINT (for Railway)
// ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Travel API Server running on port ${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   GET  /api/flights?origin=JFK&destination=LHR&date=2024-12-25`);
  console.log(`   GET  /api/hotels?location=London&checkIn=2024-12-25&checkOut=2024-12-30`);
  console.log(`   GET  /api/planner`);
  console.log(`   POST /api/planner/add`);
  console.log(`   DELETE /api/planner/:id`);
  console.log(`   PUT    /api/planner/clear`);
  console.log(`   GET  /health`);
});