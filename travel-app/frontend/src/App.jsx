import React, { useState } from 'react';
import FlightSearch from './components/FlightSearch';
import HotelSearch from './components/HotelSearch';
import Planner from './components/Planner';
import ChatAssistant from './components/ChatAssistant';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('flights');
  const [plannerItems, setPlannerItems] = useState([]);

  // Load planner items on mount
  React.useEffect(() => {
    fetch(`${API_BASE}/planner`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlannerItems(data.data);
        }
      })
      .catch(err => console.error('Failed to load planner:', err));
  }, []);

  // Add item to planner
  const addToPlanner = async (item) => {
    try {
      const response = await fetch(`${API_BASE}/planner/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await response.json();
      if (data.success) {
        setPlannerItems(prev => [...prev, data.data]);
        alert('✅ Added to Planner!');
      }
    } catch (error) {
      console.error('Failed to add to planner:', error);
      alert('❌ Failed to add to planner');
    }
  };

  // Remove item from planner
  const removeFromPlanner = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/planner/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setPlannerItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Failed to remove from planner:', error);
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* ✅ Tailwind Test Banner - Remove after testing */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl shadow-lg mb-6 mx-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold">🎨 Tailwind v3 is Working!</h2>
          <p className="text-sm opacity-90 mt-1">
            If you see this purple gradient box, your UI upgrade is ready.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        background: 'white',
        padding: '15px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '24px', color: '#667eea' }}>
            🌍 Travel Planner
          </h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['flights', 'hotels', 'cruises', 'planner'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: activeTab === tab 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#f0f0f0',
                  color: activeTab === tab ? 'white' : '#333',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab === 'flights' && '✈️ '}
                {tab === 'hotels' && '🏨 '}
                {tab === 'cruises' && '🚢 '}
                {tab === 'planner' && '📅 '}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'planner' && plannerItems.length > 0 && (
                  <span style={{
                    background: 'white',
                    color: '#667eea',
                    borderRadius: '50%',
                    padding: '2px 8px',
                    fontSize: '12px',
                    marginLeft: '5px'
                  }}>
                    {plannerItems.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {activeTab === 'flights' && (
          <FlightSearch addToPlanner={addToPlanner} />
        )}
        {activeTab === 'hotels' && (
          <HotelSearch addToPlanner={addToPlanner} />
        )}
        {activeTab === 'cruises' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <h2>🚢 Cruise Search</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Coming soon! Same affiliate integration as flights & hotels.
            </p>
          </div>
        )}
        {activeTab === 'planner' && (
          <Planner 
            items={plannerItems} 
            removeFromPlanner={removeFromPlanner} 
          />
        )}
      </main>

      {/* Chat Assistant */}
      <ChatAssistant activeTab={activeTab} />
    </div>
  );
}

export default App;
