// ─────────────────────────────────────────────────────────────
// ADAPTER: Kiwi.com (Tequila)
// ─────────────────────────────────────────────────────────────
function normalizeKiwiResponse(flightData, affiliateId) {
  return {
    id: `kiwi_${flightData.id || Math.random().toString(36).substr(2, 9)}`,
    provider: 'Kiwi.com',
    providerCode: 'kiwi',
    price: parseFloat(flightData.price?.total || flightData.price || 0),
    currency: flightData.price?.currency || 'USD',
    airline: flightData.airlines?.[0]?.name || flightData.airline || 'Unknown Airline',
    flightNumber: flightData.flight_no || flightData.flightNumber || 'N/A',
    departureTime: flightData.departure?.utc || flightData.departureTime,
    arrivalTime: flightData.arrival?.utc || flightData.arrivalTime,
    origin: flightData.departure?.iata || flightData.origin || 'JFK',
    destination: flightData.arrival?.iata || flightData.destination || 'LHR',
    duration: flightData.duration || '7h 30m',
    stops: flightData.stops || 0,
    bookingUrl: `${flightData.deep_link || '#'}?affiliate_id=${affiliateId}`,
    logo: '🟢'
  };
}

// ─────────────────────────────────────────────────────────────
// ADAPTER: Skyscanner
// ─────────────────────────────────────────────────────────────
function normalizeSkyscannerResponse(flightData, affiliateId) {
  return {
    id: `sky_${flightData.QuoteId || Math.random().toString(36).substr(2, 9)}`,
    provider: 'Skyscanner',
    providerCode: 'skyscanner',
    price: parseFloat(flightData.MinPrice || flightData.price || 0),
    currency: 'USD',
    airline: flightData.CarrierName || flightData.airline || 'Unknown Airline',
    flightNumber: flightData.FlightNumber || flightData.flightNumber || 'N/A',
    departureTime: flightData.OutboundLeg?.DepartureDate || flightData.departureTime,
    arrivalTime: flightData.OutboundLeg?.ArrivalDate || flightData.arrivalTime,
    origin: flightData.OutboundLeg?.OriginId || flightData.origin || 'JFK',
    destination: flightData.OutboundLeg?.DestinationId || flightData.destination || 'LHR',
    duration: flightData.duration || '7h 15m',
    stops: flightData.stops || 0,
    bookingUrl: `${flightData.DeepLink || '#'}&aid=${affiliateId}`,
    logo: '🔵'
  };
}

// ─────────────────────────────────────────────────────────────
// ADAPTER: Expedia (Mock)
// ─────────────────────────────────────────────────────────────
function normalizeExpediaResponse(flightData, affiliateId) {
  return {
    id: `exp_${flightData.id || Math.random().toString(36).substr(2, 9)}`,
    provider: 'Expedia',
    providerCode: 'expedia',
    price: parseFloat(flightData.price || 0),
    currency: 'USD',
    airline: flightData.airline || 'Unknown Airline',
    flightNumber: flightData.flightNumber || 'N/A',
    departureTime: flightData.departureTime,
    arrivalTime: flightData.arrivalTime,
    origin: flightData.origin || 'JFK',
    destination: flightData.destination || 'LHR',
    duration: flightData.duration || '9h 45m',
    stops: flightData.stops || 1,
    bookingUrl: `${flightData.bookingUrl || '#'}?cid=${affiliateId}`,
    logo: '🟡'
  };
}

module.exports = { 
  normalizeKiwiResponse, 
  normalizeSkyscannerResponse, 
  normalizeExpediaResponse 
};
