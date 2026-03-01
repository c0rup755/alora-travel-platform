// Simple mock adapter — replace with real API adapters
async function fetchFlightsMock(query) {
  return [
    { id: 1, airline: 'Delta', from: 'JFK', to: 'FCO', price: 612 },
    { id: 2, airline: 'ITA Airways', from: 'JFK', to: 'FCO', price: 487 }
  ];
}

module.exports = { fetchFlightsMock };
