import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

import './App.css';

const feeTable = {
  "Atlanta, GA→TPHCM": { flat: 5, percent: 0.02 },  // $5 + 2%
  "Houston, TX→Hà Nội": { flat: 3, percent: 0.015 },
  "Orange County, CA→Huế": { flat: 4, percent: 0.025 },
  "Atlanta, GA→Nha Trang": { flat: 6, percent: 0.01 },
  "default": { flat: 5, percent: 0.02 }
};

const mockRateHistory = [
  { date: 'Mon', rate: 24700 },
  { date: 'Tue', rate: 24800 },
  { date: 'Wed', rate: 24650 },
  { date: 'Thu', rate: 24900 },
  { date: 'Fri', rate: 25000 },
  { date: 'Sat', rate: 24850 },
  { date: 'Sun', rate: 24750 },
];


// We will use more realistic fees based on locations in a future version. This is just a placeholder.

function App() {
  const [usd, setUsd] = useState('');
  const [vnd, setVnd] = useState(null);
  const [feeInfo, setFeeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [locations] = useState({
    us: ['Atlanta, GA', 'Houston, TX', 'Orange County, CA'],
    vn: ['TPHCM', 'Hà Nội', 'Huế', 'Nha Trang']
  });
  const [deliveryType, setDeliveryType] = useState('');
  const deliveryOptions = ['Bank Transfer', 'MoMo Wallet', 'Cash Pickup'];
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [lastFeeMessage, setLastFeeMessage] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [lang, setLang] = useState("en");

  const toggleLang = () => {
    setLang(lang === "en" ? "vi" : "en");
  };




  const convertCurrency = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/exchange-rate');
      const data = await res.json();
      const rate = data.rate;

      const usdAmount = parseFloat(usd);
      const route = `${from}→${to}`;
      const feeConfig = feeTable[route] || feeTable["default"];

      let adjustedFlat = feeConfig.flat;
      let adjustedPercent = feeConfig.percent;

      if (deliveryType === 'MoMo Wallet') {
        adjustedFlat += 1;     // MoMo has small wallet fee
        adjustedPercent += 0.005;  // Slightly higher % fee
      } else if (deliveryType === 'Cash Pickup') {
        adjustedFlat += 2;     // Cash pickup has higher processing
        adjustedPercent += 0.01;
      }
      // Bank Transfer stays as-is


      //const flatFee = feeConfig.flat;
      const percentFee = adjustedPercent * usdAmount;
      const totalFee = adjustedFlat + percentFee;
      const netUsd = usdAmount - totalFee;


      setFeeInfo({
        flatFee: adjustedFlat.toFixed(2),
        percentFee: percentFee.toFixed(2),
        totalFee: totalFee.toFixed(2),
        netUsd: netUsd.toFixed(2),
        rate: rate.toFixed(2),
      });
      
      const result = parseFloat(usd) * rate;
      
      const summary = `I sent $${usdAmount} from ${from} to ${to} using ${deliveryType}. 
      Flat fee was $${adjustedFlat.toFixed(2)}, percent fee was $${percentFee.toFixed(2)}, 
      total fee = $${totalFee.toFixed(2)}. Net USD sent: $${netUsd.toFixed(2)} → ${result.toLocaleString('vi-VN')} VND.`;

      setLastFeeMessage(summary);
      
      setVnd(result.toLocaleString('vi-VN') + ' ₫');
    } catch (err) {
      setVnd('Error fetching exchange rate');
    }
    setLoading(false);
  };

  return (


    <div className="App">
        <h1>{lang === "en" ? "💸 Smart Remit" : "💸 Chuyển tiền thông minh"}</h1>

        <button onClick={toggleLang} style={{ position: 'absolute', right: 20, top: 20 }}>
          {lang === "en" ? "🇻🇳 Chuyển sang Tiếng Việt" : "🇺🇸 Switch to English"}
        </button>

        {/* === Exchange Rate and News Section === */}
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
          <h2 style={{ marginTop: 0 }}>{lang === "en" ? "🌐 Market Updates" : "🌐 Cập Nhật Thị Trường"}</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>💱 USD → VND Rate:</strong> 1 USD ≈ <span style={{ color: '#007bff', fontWeight: 'bold' }}>24,700 ₫</span><br />
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
            <h4 style={{ marginTop: '0.5rem' }}>📰 Economic Headlines</h4>
            <ul style={{ paddingLeft: '1rem' }}>
              <li>💸 Remittances to Vietnam top $19 billion in 2024</li>
              <li>🏦 State Bank launches e-wallet integration guidelines</li>
              <li>📈 VND gains strength amid regional growth forecasts</li>
              <li>📉 U.S. inflation dips, improving transfer rates</li>
              <li>💼 World Bank: Southeast Asia poised for fintech expansion</li>
            </ul>
          </div>
        </div>
        {/* === End Exchange Rate and News Section === */}

        <div style={{ margin: '2rem auto', maxWidth: '700px' }}>
          <h3>📊 Exchange Rate Trend (This Week)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockRateHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#007bff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
          <h4>📅 Best Time to Send</h4>
          <p>
            Based on recent trends, rates usually drop mid-week.
            Our model predicts the next <strong>optimal day</strong> to transfer is: <span style={{ fontWeight: 'bold', color: 'green' }}>Wednesday</span>.
          </p>
        </div>




        <label>From (U.S. city): </label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="">Select</option>
          {locations.us.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <br /><br />

        <label>To (Vietnam city): </label>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">Select</option>
          {locations.vn.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <br /><br />

        <label>Delivery Method: </label>
        <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
          <option value="">Select</option>
          {deliveryOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <br /><br />

        <br /><br />

        <h3>📥 Recipient Information</h3>
        <label>Full Name: </label>
        <input
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />

        <br /><br />

        <label>Phone Number: </label>
        <input
          type="text"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
        />

        <br /><br />

        {deliveryType === 'Bank Transfer' && (
          <>
            <label>Bank Name: </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />

            <br /><br />

            <label>Account Number: </label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />

            <br /><br />
          </>
        )}

        <label>Delivery Address (optional): </label>
        <input
          type="text"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
        />



        <input
          type="number"
          placeholder="Enter amount in USD"
          value={usd}
          onChange={(e) => setUsd(e.target.value)}
        />

        <button onClick={convertCurrency}>
          {loading ? 'Converting...' : 'Convert'}
        </button>

        {vnd && (
          <h2>
            You’ll receive: {vnd}<br />
            From: {from} → {to}<br />
            Method: {deliveryType}
          </h2>

        )}

        {feeInfo && (
          <div style={{ marginTop: '1rem' }}>
            <p>Exchange rate: 1 USD = {feeInfo.rate} VND</p>
            <p>Fees: ${feeInfo.flatFee} + ${feeInfo.percentFee} = ${feeInfo.totalFee}</p>
            <p>Net USD sent: ${feeInfo.netUsd}</p>
          </div>
          
        )}

        {feeInfo && (
          <button
            style={{ marginTop: '1rem' }}
            onClick={async () => {
              const res = await fetch('http://127.0.0.1:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `Can you explain this fee result? ${lastFeeMessage}` })
              });
              const data = await res.json();
              setChatResponse(data.response || "Sorry, something went wrong.");
            }}
          >
            🤖 Explain this fee
          </button>
        )}

        {feeInfo && usd && recipientName && to && from && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#e0f7fa', 
            borderRadius: '8px', 
            maxWidth: '400px', 
            marginLeft: 'auto', 
            marginRight: 'auto',
            textAlign: 'left'
          }}>
            <h3>🧾 Review Transfer Details</h3>
            <p><strong>From:</strong> {from}</p>
            <p><strong>To:</strong> {to}</p>
            <p><strong>Delivery Method:</strong> {deliveryType}</p>
            <p><strong>Recipient:</strong> {recipientName}</p>
            <p><strong>Phone:</strong> {recipientPhone}</p>
            {deliveryType === 'Bank Transfer' && (
              <>
                <p><strong>Bank:</strong> {bankName}</p>
                <p><strong>Acct #:</strong> {bankAccount}</p>
              </>
            )}
            {deliveryAddress && (
              <p><strong>Address:</strong> {deliveryAddress}</p>
            )}
            <p><strong>Amount Sent:</strong> ${usd}</p>
            <p><strong>Fees:</strong> ${feeInfo.totalFee}</p>
            <p><strong>Net USD:</strong> ${feeInfo.netUsd}</p>
            <p><strong>Estimated VND received:</strong> {vnd}</p>

            <button 
              onClick={() => {
                alert("🚀 Transfer request submitted! (Mocked for now)");
                // Here’s where a real API call would happen later
              }}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#00796b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send Transfer
            </button>
          </div>
        )}



        <hr style={{ margin: '3rem 0' }} />

        <h3>💬 Ask Smart Remit Assistant</h3>
        <textarea
          rows="3"
          style={{ width: '300px' }}
          placeholder="Ask a question in English or Vietnamese"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        ></textarea>

        <br />
        <button onClick={async () => {
          const res = await fetch('http://127.0.0.1:8000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: chatInput })
          });
          const data = await res.json();
          setChatResponse(data.response || "Sorry, something went wrong.");
        }}>
          Ask
        </button>

        {chatResponse && (
          <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px', width: '300px', textAlign: 'left' }}>
            <strong>Assistant:</strong><br />
            {chatResponse}
          </div>
        )}



    </div>
  );
}

export default App;
