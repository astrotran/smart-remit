// ✅ SMART REMIT - MULTI PAGE REFACTOR PLAN

// === LandingPage.jsx ===
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import translations from '../translations';

const mockRateHistory = [
  { date: 'Mon', rate: 24700 },
  { date: 'Tue', rate: 24800 },
  { date: 'Wed', rate: 24650 },
  { date: 'Thu', rate: 24900 },
  { date: 'Fri', rate: 25000 },
  { date: 'Sat', rate: 24850 },
  { date: 'Sun', rate: 24750 },
];

const LandingPage = ({ lang, toggleLang }) => {
  const t = translations[lang];

  return (
    <div className="LandingPage">
      <h1>{t.welcome}</h1>

      <div style={{
        backgroundColor: '#f0f4f8',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '2rem',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'left'
      }}>
        <h2 style={{ marginTop: 0 }}>{t.marketUpdates}</h2>

        <div style={{ marginBottom: '1rem' }}>
          <strong>{t.rate}:</strong> 1 USD ≈ <span style={{ color: 'green', fontWeight: 'bold' }}>24,700 ₫</span><br />
          <small>Last updated: {new Date().toLocaleString()}</small>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          maxHeight: '120px',
          overflowY: 'scroll',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ marginTop: '0.5rem' }}>{t.headlines}</h4>
          <ul style={{ paddingLeft: '1rem' }}>
            <li>💸 Remittances to Vietnam top $19 billion in 2024</li>
            <li>🏦 State Bank launches e-wallet integration guidelines</li>
            <li>📈 VND gains strength amid regional growth forecasts</li>
            <li>📉 U.S. inflation dips, improving transfer rates</li>
            <li>💼 World Bank: Southeast Asia poised for fintech expansion</li>
          </ul>
        </div>
      </div>

      <div style={{ margin: '2rem auto', maxWidth: '700px' }}>
        <h3>📊 {t.exchangeRate}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mockRateHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="green" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <h4>{t.bestTime}</h4>
        <p>
          Based on recent trends, rates usually drop mid-week.
          Our model predicts the next <strong>optimal day</strong> to transfer is: <span style={{ fontWeight: 'bold', color: 'green' }}>{t.optimalDay}</span>.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
