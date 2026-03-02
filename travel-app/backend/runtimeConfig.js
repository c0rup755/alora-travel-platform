// Simple runtime configuration store (in-memory)
let useMocks = (process.env.USE_MOCKS || 'true').toLowerCase() === 'true';

function getUseMocks() {
  return useMocks;
}

function setUseMocks(val) {
  useMocks = !!val;
}

module.exports = { getUseMocks, setUseMocks };
