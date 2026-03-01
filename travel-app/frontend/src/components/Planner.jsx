import React from 'react';

function Planner({ items, removeFromPlanner }) {
  const totalCost = items.reduce((sum, item) => {
    return sum + (item.price || item.totalPrice || 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '60px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>📅</div>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Your Planner is Empty</h2>
        <p style={{ color: '#666' }}>
          Search for flights, hotels, or cruises and click "Save to Planner" to build your trip!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h2 style={{ color: '#333', marginBottom: '5px' }}>📅 My Trip Plan</h2>
            <p style={{ color: '#666' }}>{items.length} items saved</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              Total Estimated Cost
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#667eea'
            }}>
              ${totalCost.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {items.map((item, index) => (
          <div key={item.id} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              {index + 1}
            </div>

            <div style={{ fontSize: '40px' }}>{item.icon}</div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <h4 style={{ color: '#333', marginBottom: '5px' }}>
                {item.name || item.airline} {item.flightNumber && `(${item.flightNumber})`}
              </h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {item.type === 'flight' 
                  ? `${item.origin} → ${item.destination}`
                  : item.address || `${item.origin} → ${item.destination}`
                }
              </p>
              <p style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
                Via {item.provider}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '10px'
              }}>
                ${item.price || item.totalPrice}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={item.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 15px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  🔗 Book Now
                </a>

                <button
                  onClick={() => removeFromPlanner(item.id)}
                  style={{
                    padding: '8px 15px',
                    background: '#fee',
                    color: '#c00',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <button style={{
          padding: '15px 40px',
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(56, 239, 125, 0.4)'
        }}>
          🎫 Book All Items
        </button>
      </div>
    </div>
  );
}

export default Planner;

