const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { searchHotels } = require('./services/hotelService');
const plannerRoutes = require('./routes/plannerRoutes');
const flightRoutes = require('./routes/flightRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ CORRECT: Routes mounted at /api/*
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
