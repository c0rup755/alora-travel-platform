// Simple mock adapter for hotels — replace with real API adapters
async function fetchHotelsMock(query) {
  return [
    { id: 'h1', name: 'Hotel Roma', location: 'Rome', pricePerNight: 220 },
    { id: 'h2', name: 'Trastevere Suites', location: 'Rome', pricePerNight: 165 }
  ];
}

module.exports = { fetchHotelsMock };
