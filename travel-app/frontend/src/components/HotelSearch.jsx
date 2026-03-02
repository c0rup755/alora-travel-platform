import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = (process.env.REACT_APP_API_BASE || 'http://localhost:5000/api').trim();

function HotelSearch({ addToPlanner }) {
  const [searchParams, setSearchParams] = useState({
    location: 'London',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE}/hotels`, {
        params: searchParams
      });

      if (response.data.success) {
        setResults(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSearch} style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>🏨 Find Your Hotel</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Location
            </label>
            <input
              type="text"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="London"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Check In
            </label>
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Check Out
            </label>
            <input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '🔍 Searching...' : '🔍 Search Hotels'}
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {results.map(hotel => (
            <div key={hotel.id} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '60px' }}>{hotel.image}</div>
              
              <div style={{ flex: '1', minWidth: '300px' }}>
                <h4 style={{ color: '#333', marginBottom: '5px' }}>
                  {hotel.name}
                </h4>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  📍 {hotel.address}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  {'⭐'.repeat(hotel.rating)}
                  <span style={{ color: '#666', marginLeft: '10px' }}>
                    {hotel.reviewScore}/10 ({hotel.reviewCount} reviews)
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '15px'
                }}>
                  {hotel.amenities.map((amenity, i) => (
                    <span key={i} style={{
                      background: '#f0f0f0',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {amenity}
                    </span>
                  ))}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  🛏️ {hotel.roomType}
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '200px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  ${hotel.pricePerNight} / night
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#667eea',
                  marginBottom: '15px'
                }}>
                  ${hotel.totalPrice}
                </div>

                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: '10px'
                  }}
                >
                  🔗 Book on {hotel.provider}
                </a>

                <button
                  onClick={() => addToPlanner({
                    type: 'hotel',
                    ...hotel,
                    icon: '🏨'
                  })}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'white',
                    color: '#667eea',
                    border: '2px solid #667eea',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  💾 Save to Planner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '60px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ fontSize: '18px' }}>🔍 Search for hotels to see results</p>
        </div>
      )}
    </div>
  );
}

export default HotelSearch;
