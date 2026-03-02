const AFFILIATE_ID = process.env.AFFILIATE_ID || 'YOUR_AFFILIATE_ID';

if (!process.env.AFFILIATE_ID || AFFILIATE_ID.startsWith('YOUR')) {
  console.warn('⚠️  AFFILIATE_ID not set (using placeholder). Hotel booking links will contain a placeholder affiliate id. Set AFFILIATE_ID in your environment.');
}

function getMockHotels({ location, checkIn, checkOut }) {
  const nights = 5; // Simplified calculation
  
  return [
    {
      id: `booking_${location}_001`,
      provider: 'Booking.com',
      providerCode: 'booking',
      name: 'The Savoy London',
      rating: 5,
      reviewScore: 9.2,
      reviewCount: 3421,
      address: 'Strand, Westminster, London',
      roomType: 'Deluxe Room',
      amenities: ['Free WiFi', 'Breakfast included', 'Spa', 'Gym'],
      pricePerNight: 320,
      totalPrice: 320 * nights,
      currency: 'USD',
      image: '🏨',
      bookingUrl: `https://www.booking.com/hotel/gb/savoy.html?aid=${AFFILIATE_ID}`,
      logo: '🔵'
    },
    {
      id: `expedia_${location}_001`,
      provider: 'Expedia',
      providerCode: 'expedia',
      name: 'Hilton London Metropole',
      rating: 4,
      reviewScore: 8.5,
      reviewCount: 5672,
      address: 'Edgware Road, London',
      roomType: 'Standard Room',
      amenities: ['Pool', 'Gym', 'Restaurant', 'WiFi'],
      pricePerNight: 185,
      totalPrice: 185 * nights,
      currency: 'USD',
      image: '🏨',
      bookingUrl: `https://www.expedia.com/hotel/hilton-london?cid=${AFFILIATE_ID}`,
      logo: '🟡'
    },
    {
      id: `booking_${location}_002`,
      provider: 'Booking.com',
      providerCode: 'booking',
      name: 'Premier Inn London County Hall',
      rating: 4,
      reviewScore: 8.8,
      reviewCount: 4123,
      address: 'Belvedere Road, London',
      roomType: 'Double Room',
      amenities: ['Free WiFi', 'Restaurant', 'Bar'],
      pricePerNight: 145,
      totalPrice: 145 * nights,
      currency: 'USD',
      image: '🏨',
      bookingUrl: `https://www.booking.com/hotel/gb/premier-inn.html?aid=${AFFILIATE_ID}`,
      logo: '🔵'
    }
  ];
}

async function searchHotels({ location, checkIn, checkOut }) {
  try {
    const hotels = getMockHotels({ location, checkIn, checkOut });
    return hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } catch (error) {
    console.error('Hotel search error:', error);
    return [];
  }
}

module.exports = { searchHotels };
