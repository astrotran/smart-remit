import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TransferPage from './pages/TransferPage';
import AboutPage from './pages/AboutPage';
import ChatAssistant from './components/ChatAssistant'; 

import './App.css';

function App() {
  const [lang, setLang] = useState('en');

  const toggleLang = () => {
    setLang((prevLang) => (prevLang === 'en' ? 'vi' : 'en'));
  };

  return (
    <Router>
      <div className="App">
        {/* === Navbar === */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: 'lightgreen',
          color: 'white'
        }}>
          <div>
            <Link to="/" style={{ color: 'black', marginRight: '1rem', textDecoration: 'none', fontWeight: 'bold' }}>
              {lang === 'en' ? '🏠 Home' : '🏠 Trang chủ'}
            </Link>
            <Link to="/transfer" style={{ color: 'black', marginRight: '1rem', textDecoration: 'none' }}>
              {lang === 'en' ? '💸 Transfer' : '💸 Chuyển tiền'}
            </Link>
            <Link to="/about" style={{ color: 'black', textDecoration: 'none' }}>
              {lang === 'en' ? '📖 About' : '📖 Giới thiệu'}
            </Link>
          </div>
          <button onClick={toggleLang} style={{
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            {lang === 'en' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
          </button>
        </nav>

        {/* === Page Routes === */}
        <Routes>
          <Route path="/" element={<LandingPage lang={lang} toggleLang={toggleLang} />} />
          <Route path="/transfer" element={<TransferPage lang={lang} />} />
          <Route path="/about" element={<AboutPage lang={lang} />} />
        </Routes>

        {/* === AI Chat Widget (Sticky) === */}
        <ChatAssistant lang={lang} />
      </div>
    </Router>
  );
}

export default App;
