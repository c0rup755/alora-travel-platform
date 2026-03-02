import React, { useState } from 'react';
import FlightSearch from './components/FlightSearch';
import HotelSearch from './components/HotelSearch';
import Planner from './components/Planner';
import ChatAssistant from './components/ChatAssistant';

// ✅ Production backend URL - .trim() removes ANY invisible spaces
const API_BASE = (process.env.REACT_APP_API_BASE || 'http://localhost:5000/api').trim();

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
    <div className="pb-20">
      {/* ✅ Step 1: Polished Hero Section */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 rounded-b-3xl shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            ✈️ Alora
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            Plan your perfect trip. Compare flights, hotels, and cruises — all in one place.
          </p>
        </div>
      </header>

      {/* ✅ Step 2: Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">🌍 Alora</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('flights')}
                className={`font-medium transition-colors ${
                  activeTab === 'flights' 
                    ? 'text-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                ✈️ Flights
              </button>
              <button 
                onClick={() => setActiveTab('hotels')}
                className={`font-medium transition-colors ${
                  activeTab === 'hotels' 
                    ? 'text-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                🏨 Hotels
              </button>
              <button 
                onClick={() => setActiveTab('cruises')}
                className={`font-medium transition-colors ${
                  activeTab === 'cruises' 
                    ? 'text-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                🚢 Cruises
              </button>
              <button 
                onClick={() => setActiveTab('planner')}
                className={`font-medium transition-colors ${
                  activeTab === 'planner' 
                    ? 'text-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                📋 Planner
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-primary p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow max-w-4xl mx-auto">

          {activeTab === 'flights' && (
            <FlightSearch addToPlanner={addToPlanner} apiBase={API_BASE} />
          )}

          {activeTab === 'hotels' && (
            <HotelSearch addToPlanner={addToPlanner} apiBase={API_BASE} />
          )}

          {activeTab === 'cruises' && (
            <div className="bg-white rounded-2xl p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-800">🚢 Cruise Search</h2>
              <p className="text-gray-600 mt-3">
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

      {/* ✅ Step 5: Professional Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Brand Column */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">🌍</span> Alora
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Plan your perfect trip. Compare flights, hotels, and cruises — all in one place with smart AI assistance.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button 
                    onClick={() => { setActiveTab('flights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">✈️</span> Flights
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('hotels'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">🏨</span> Hotels
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('cruises'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">🚢</span> Cruises
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">📋</span> Trip Planner
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact/Info Column */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">📧</span> support@alora.travel
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔗</span> Affiliate Partners
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔒</span> Privacy Policy
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⚖️</span> Terms of Service
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Alora. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Powered by TravelPayouts • Flight data via Kiwi.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;