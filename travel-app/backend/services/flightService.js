const { 
  normalizeKiwiResponse, 
  normalizeSkyscannerResponse, 
  normalizeExpediaResponse 
} = require('../adapters/thirdPartyAdapters');

const axios = require('axios');
const runtimeConfig = require('../runtimeConfig');

const AFFILIATE_ID = process.env.AFFILIATE_ID || 'YOUR_AFFILIATE_ID';

if (!process.env.AFFILIATE_ID || AFFILIATE_ID.startsWith('YOUR')) {
  console.warn('⚠️  AFFILIATE_ID not set (using placeholder). Affiliate booking links will contain a placeholder affiliate id. Set AFFILIATE_ID in your environment.');
}
if (!process.env.KIWI_API_KEY || process.env.KIWI_API_KEY.startsWith('your')) {
  console.warn('⚠️  KIWI_API_KEY not set. Flight search will fall back to mock data unless a Kiwi/Tequila API key is configured.');
}

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
    const useMocks = runtimeConfig.getUseMocks();

    // If a real Kiwi API key is present and USE_MOCKS is not true, attempt real provider call
    if (!useMocks && process.env.KIWI_API_KEY) {
      try {
        const kiwi = await fetchKiwiFlights({ origin, destination, date });
        kiwi.forEach(f => results.push(f));
      } catch (err) {
        console.warn('⚠️ Kiwi fetch failed, falling back to mocks:', err.message || err);
      }
    }

    // If still no results, use mock data
    if (results.length === 0) {
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
    }

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

// Fetch from Kiwi (Tequila) API and normalize results
async function fetchKiwiFlights({ origin, destination, date }) {
  const apiKey = process.env.KIWI_API_KEY;
  if (!apiKey) throw new Error('KIWI_API_KEY not configured');

  const url = 'https://api.tequila.kiwi.com/v2/search';
  const params = {
    fly_from: origin,
    fly_to: destination,
    date_from: date,
    date_to: date,
    curr: 'USD',
    limit: 8
  };

  const resp = await axios.get(url, { headers: { apikey: apiKey }, params, timeout: 10000 });
  const data = resp.data?.data || [];

  // Map Kiwi response objects to normalized format using adapter
  return data.map(d => normalizeKiwiResponse({
    id: d.id || d.route?.[0]?.flight_no || `kiwi_${Math.random().toString(36).slice(2,9)}`,
    price: { total: d.price, currency: d.currency || 'USD' },
    airlines: [{ name: d.airlines?.[0] || '' }],
    flight_no: d.route?.[0]?.flight_no || '',
    departure: { utc: d.utc_departure || d.dTimeUTC || `${date}T00:00:00`, iata: d.flyFrom || origin },
    arrival: { utc: d.utc_arrival || d.aTimeUTC || `${date}T00:00:00`, iata: d.flyTo || destination },
    duration: d.fly_duration || '',
    stops: d.route?.length ? d.route.length - 1 : 0,
    deep_link: d.deep_link || d.booking_token || ''
  }, AFFILIATE_ID));
}

module.exports = { searchFlights };
