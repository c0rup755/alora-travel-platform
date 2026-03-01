import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function FlightSearch({ addToPlanner }) {
  const [searchParams, setSearchParams] = useState({
    origin: 'JFK',
    destination: 'LHR',
    date: new Date().toISOString().split('T')[0]
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/flights`, {
        params: searchParams
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Failed to fetch flights. Is the backend running?');
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
        <h2 style={{ marginBottom: '20px', color: '#333' }}>✈️ Find Your Flight</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              From
            </label>
            <input
              type="text"
              value={searchParams.origin}
              onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="JFK"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              To
            </label>
            <input
              type="text"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              placeholder="LHR"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              Date
            </label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '🔍 Searching...' : '🔍 Search Flights'}
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          color: '#c00',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#333' }}>
              📊 {results.length} flights found
            </h3>
            <select style={{
              padding: '8px 15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <option>💰 Sort by: Price (Low to High)</option>
              <option>⏱ Sort by: Duration</option>
              <option>⭐ Sort by: Rating</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.map(flight => (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                addToPlanner={addToPlanner} 
              />
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '60px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ fontSize: '18px' }}>🔍 Search for flights to see results</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Flight Card Component
// ─────────────────────────────────────────────────────────────
function FlightCard({ flight, addToPlanner }) {
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Flight Info */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '24px' }}>{flight.logo}</span>
            <div>
              <h4 style={{ color: '#333', marginBottom: '3px' }}>
                {flight.airline}
              </h4>
              <span style={{
                background: '#f0f0f0',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#666'
              }}>
                {flight.flightNumber}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '15px'
          }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>
                {formatTime(flight.departureTime)}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>{flight.origin}</div>
            </div>

            <div style={{
              flex: '1',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                borderTop: '2px solid #667eea',
                position: 'relative',
                top: '10px'
              }} />
              <div style={{
                background: '#667eea',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                display: 'inline-block',
                position: 'relative',
                top: '-5px'
              }}>
                {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>
                {formatTime(flight.arrivalTime)}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>{flight.destination}</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: '#e8f4fd',
              color: '#1976d2',
              padding: '5px 12px',
              borderRadius: '15px',
              fontSize: '13px'
            }}>
              👤 Economy
            </span>
            <span style={{
              background: '#e8f5e9',
              color: '#388e3c',
              padding: '5px 12px',
              borderRadius: '15px',
              fontSize: '13px'
            }}>
              💺 12 seats left
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div style={{
          textAlign: 'right',
          minWidth: '200px'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#667eea',
            marginBottom: '15px'
          }}>
            ${flight.price}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={flight.bookingUrl}
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
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              🔗 Book on {flight.provider}
            </a>

            <button
              onClick={() => addToPlanner({
                type: 'flight',
                ...flight,
                icon: '✈️'
              })}
              style={{
                padding: '12px 20px',
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#667eea';
              }}
            >
              💾 Save to Planner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightSearch;
