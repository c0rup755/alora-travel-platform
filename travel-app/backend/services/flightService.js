const { 
  normalizeKiwiResponse, 
  normalizeSkyscannerResponse, 
  normalizeExpediaResponse 
} = require('../adapters/thirdPartyAdapters');

const AFFILIATE_ID = process.env.AFFILIATE_ID || 'YOUR_AFFILIATE_ID';

// ─────────────────────────────────────────────────────────────
// MOCK DATA (Replace with real API calls when ready)
// ─────────────────────────────────────────────────────────────
function getMockFlights({ origin, destination, date }) {
  return [
    // Kiwi-style results
    {
      id: 'kiwi_001',
      price: { total: 450, currency: 'USD' },
      airlines: [{ name: 'American Airlines' }],
      flight_no: 'AA100',
      departure: { utc: `${date}T18:00:00`, iata: origin },
      arrival: { utc: `${date}T06:30:00`, iata: destination },
      duration: '7h 30m',
      stops: 0,
      deep_link: 'https://www.kiwi.com/deeplink/flight/001'
    },
    {
      id: 'kiwi_002',
      price: { total: 520, currency: 'USD' },
      airlines: [{ name: 'United Airlines' }],
      flight_no: 'UA456',
      departure: { utc: `${date}T14:00:00`, iata: origin },
      arrival: { utc: `${date}T02:30:00`, iata: destination },
      duration: '7h 30m',
      stops: 0,
      deep_link: 'https://www.kiwi.com/deeplink/flight/002'
    },
    // Skyscanner-style results
    {
      QuoteId: 'sky_001',
      MinPrice: 485,
      CarrierName: 'British Airways',
      FlightNumber: 'BA112',
      OutboundLeg: {
        DepartureDate: `${date}T20:00:00`,
        ArrivalDate: `${date}T08:15:00`,
        OriginId: origin,
        DestinationId: destination
      },
      duration: '7h 15m',
      stops: 0,
      DeepLink: 'https://www.skyscanner.com/deeplink/flight/001'
    },
    // Expedia-style results
    {
      id: 'exp_001',
      price: 398,
      airline: 'Delta + Virgin Atlantic',
      flightNumber: 'DL400',
      departureTime: `${date}T10:00:00`,
      arrivalTime: `${date}T19:45:00`,
      origin: origin,
      destination: destination,
      duration: '9h 45m',
      stops: 1,
      bookingUrl: 'https://www.expedia.com/deeplink/flight/001'
    }
  ];
}

// ─────────────────────────────────────────────────────────────
// MAIN SEARCH FUNCTION
// ─────────────────────────────────────────────────────────────
async function searchFlights({ origin, destination, date }) {
  const results = [];

  try {
    // Get mock data (replace with real API calls later)
    const mockData = getMockFlights({ origin, destination, date });

    // Process each result through appropriate adapter
    mockData.forEach(flight => {
      let normalized;
      
      if (flight.id?.startsWith('kiwi')) {
        normalized = normalizeKiwiResponse(flight, AFFILIATE_ID);
      } else if (flight.QuoteId) {
        normalized = normalizeSkyscannerResponse(flight, AFFILIATE_ID);
      } else if (flight.id?.startsWith('exp')) {
        normalized = normalizeExpediaResponse(flight, AFFILIATE_ID);
      }

      if (normalized) {
        results.push(normalized);
      }
    });

    // Remove duplicates (same flight number + date)
    const uniqueResults = results.filter((flight, index, self) =>
      index === self.findIndex(f => 
        f.flightNumber === flight.flightNumber && 
        f.departureTime === flight.departureTime
      )
    );

    // Sort by price (low to high)
    return uniqueResults.sort((a, b) => a.price - b.price);

  } catch (error) {
    console.error('Flight search error:', error);
    return [];
  }
}

module.exports = { searchFlights };
