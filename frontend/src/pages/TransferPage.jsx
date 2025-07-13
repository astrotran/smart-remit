// === TransferPage.jsx ===
import React, { useState } from 'react';
import translations from '../translations'; 

const feeTable = {
  "Atlanta, GA→TPHCM": { flat: 5, percent: 0.02 },
  "Houston, TX→Hà Nội": { flat: 3, percent: 0.015 },
  "Orange County, CA→Huế": { flat: 4, percent: 0.025 },
  "Atlanta, GA→Nha Trang": { flat: 6, percent: 0.01 },
  "default": { flat: 5, percent: 0.02 }
};

const TransferPage = ({ lang, toggleLang }) => {
  const t = translations[lang];
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

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [lastFeeMessage, setLastFeeMessage] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

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
        adjustedFlat += 1;
        adjustedPercent += 0.005;
      } else if (deliveryType === 'Cash Pickup') {
        adjustedFlat += 2;
        adjustedPercent += 0.01;
      }

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

      const result = netUsd * rate;
      
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

  const handleChat = async () => {
    setIsChatLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput })
      });
      const data = await res.json();
      setChatResponse(data.response || "Sorry, something went wrong.");
    } catch (error) {
      setChatResponse("Error reaching assistant.");
    }
    setIsChatLoading(false);
  };

  return (
    <div className="TransferPage" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>{t.sendMoney}</h2>

      <label> {t.fromCity} </label>
      <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="">{t.select}</option>
        {locations.us.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      
      {' '}

      <label>{t.toCity} </label>
      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="">{t.select}</option>
        {locations.vn.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <br /><br />

      <label>{t.deliveryMethod}</label>
      <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
        <option value="">{t.select}</option>
        {deliveryOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <br /><br />

      <h3>{t.recipientInfo}</h3>
      <label>{t.fullName}</label>
      <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />

      {' '}

      <label>{t.phoneNumber}</label>
      <input type="text" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} />

      <br /><br />

      {deliveryType === 'Bank Transfer' && (
        <>
          <label>Bank Name:</label>
          <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} />

          <br /><br />

          <label>Account Number:</label>
          <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />

          <br /><br />
        </>
      )}

      <label>{t.deliveryAdd}</label>
      <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />

      <br /><br />

      <label>{t.amount}</label>
      <input type="number" value={usd} onChange={(e) => setUsd(e.target.value)} />

      <button onClick={convertCurrency}>
        {loading ? 'Converting...' : 'Convert'}
      </button>

      {vnd && (
        <div style={{ marginTop: '1rem' }}>
          <h3>{t.transferSummmary}</h3>
          <p><strong>{t.from}</strong> {from}</p>
          <p><strong>{t.to}</strong> {to}</p>
          <p><strong>{t.deliveryMethod}</strong> {deliveryType}</p>
          <p><strong>{t.recipient}</strong> {recipientName}</p>
          <p><strong>{t.phoneNumber}</strong> {recipientPhone}</p>
          {deliveryType === 'Bank Transfer' && (
            <>
              <p><strong>Bank:</strong> {bankName}</p>
              <p><strong>Acct #:</strong> {bankAccount}</p>
            </>
          )}
          {deliveryAddress && (
            <p><strong>{t.deliveryAdd}:</strong> {deliveryAddress}</p>
          )}
          <p><strong>{t.amount}</strong> ${usd}</p>
          <p><strong>{t.fee}</strong> ${feeInfo?.totalFee}</p>
          <p><strong>{t.netUSD}</strong> ${feeInfo?.netUsd}</p>
          <p><strong>{t.netVND}</strong> {vnd}</p>

          <button
            onClick={() => alert("🚀 Transfer request submitted! (Mocked)")}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#00796b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Send Transfer
          </button>
        </div>
      )}

      <hr style={{ margin: '3rem 0' }} />

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

        {chatResponse && (
        <div style={{ marginTop: '1rem', background: '#f1f1f1', padding: '1rem', borderRadius: '8px' }}>
            <strong>AI Explanation:</strong>
            <p>{chatResponse}</p>
        </div>
        )}


    </div>
  );
};

export default TransferPage;
