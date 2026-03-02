import React from 'react';

const AFFILIATE_URL = (process.env.REACT_APP_AFFILIATE_URL || 'https://www.travelpayouts.com/?marker=alora_demo').trim();

export default function AffiliateFallback() {
  return (
    <div className="mt-4">
      <a
        href={AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full text-center py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
        aria-label="Book with our partner"
      >
        🔗 Book with our partner
      </a>
      <p className="text-gray-400 text-xs mt-2">If the affiliate widget is blocked, use this link.</p>
    </div>
  );
}
