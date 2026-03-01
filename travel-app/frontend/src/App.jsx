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

      <header className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 rounded-b-3xl shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">✈️ Alora</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Plan your perfect trip. Compare flights, hotels, and cruises — all in one place.
          </p>
          <div className="mt-8">
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md">
              🔍 Search Flights
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow max-w-4xl mx-auto">
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
        </div>
      </main>

      {/* Chat Assistant */}
      <ChatAssistant activeTab={activeTab} />
    </div>
  );
}

export default App;
