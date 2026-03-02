const express = require('express');
const router = express.Router();

// GET /api/flights
router.get('/', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    // Mock flight data (replace with real Kiwi.com API after TravelPayouts approval)
    const mockFlights = [
      {
        id: `flight_${Date.now()}_1`,
        airline: 'American Airlines',
        flightNumber: 'AA100',
        price: 450 + Math.floor(Math.random() * 200),
        currency: 'USD',
        departureTime: `${date}T08:00:00`,
        arrivalTime: `${date}T16:30:00`,
        duration: '8h 30m',
        origin: origin || 'JFK',
        destination: destination || 'LHR',
        stops: 0,
        cabin: 'Economy'
      },
      {
        id: `flight_${Date.now()}_2`,
        airline: 'Delta',
        flightNumber: 'DL200',
        price: 520 + Math.floor(Math.random() * 150),
        currency: 'USD',
        departureTime: `${date}T10:15:00`,
        arrivalTime: `${date}T19:00:00`,
        duration: '8h 45m',
        origin: origin || 'JFK',
        destination: destination || 'LHR',
        stops: 1,
        cabin: 'Economy'
      }
    ];
    
    res.json({ success: true, data: mockFlights, count: mockFlights.length });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅✅✅ THIS LINE GOES HERE - AT THE VERY END ✅✅✅
module.exports = router;