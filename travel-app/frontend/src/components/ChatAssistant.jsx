import React, { useState } from 'react';

function ChatAssistant({ activeTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Hi! I'm your Travel Assistant. I see you're on the ${activeTab} page. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      let aiText = '';
      
      if (input.toLowerCase().includes('flight')) {
        aiText = 'I can help you find flights! Try searching with different dates for better prices. Would you like me to suggest alternative airports?';
      } else if (input.toLowerCase().includes('hotel')) {
        aiText = 'Looking for hotels? I recommend booking early for better rates. Want me to find hotels near your flight arrival?';
      } else if (input.toLowerCase().includes('price') || input.toLowerCase().includes('cheap')) {
        aiText = 'For the best prices, try being flexible with your dates. Mid-week flights are often 20-30% cheaper!';
      } else if (input.toLowerCase().includes('planner')) {
        aiText = 'Your Planner is where you can organize your entire trip! Save flights, hotels, and activities, then book them all when ready.';
      } else {
        aiText = 'I\'m here to help with your travel plans! Ask me about flights, hotels, cruises, or your planner.';
      }

      setMessages(prev => [...prev, { from: 'ai', text: aiText }]);
    }, 1000);

    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          fontSize: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          maxHeight: '500px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 20px',
            fontWeight: '600'
          }}>
            💬 Travel Assistant
          </div>

          <div style={{
            flex: '1',
            padding: '15px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.from === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#f0f0f0',
                  color: msg.from === 'user' ? 'white' : '#333',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  maxWidth: '80%',
                  fontSize: '14px'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div style={{
            padding: '15px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex: '1',
                padding: '10px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatAssistant;
