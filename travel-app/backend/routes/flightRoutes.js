const express = require('express');
const { searchFlights } = require('../services/flightService');

const router = express.Router();

router.get('/', async (req, res) => {
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

module.exports = router;