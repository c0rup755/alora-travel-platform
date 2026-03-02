// Simple runtime config checker for deployment sanity
const required = [
  'AFFILIATE_ID',
  'KIWI_API_KEY',
  'SKY_API_KEY',
  'BOOKING_API_KEY'
];

const missing = required.filter(k => !process.env[k] || process.env[k].startsWith('YOUR') || process.env[k].toLowerCase().includes('your_'));

if (missing.length) {
  console.error('❗ Missing or placeholder environment variables detected:');
  missing.forEach(k => console.error(` - ${k}`));
  console.error('\nPlease set these in your Railway / hosting environment before starting the server.');
  process.exit(1);
}

console.log('✅ All required environment variables appear to be set.');
