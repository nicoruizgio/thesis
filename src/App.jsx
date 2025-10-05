import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { isAuthenticated, getParticipant, logout } from './utils/auth';
import { logParticipant } from './utils/supabaseLogger';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import ArticlesList from './pages/ArticlesList';
import ArticlePage from './pages/ArticlePage';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setParticipant(getParticipant());
    }
  }, []);

  const handleLogin = async (participantData) => {
    setIsLoggedIn(true);
    setParticipant(participantData);

    // Log participant in Supabase
    await logParticipant();

    // Always redirect to home after login
    navigate('/');
  };

  const handleLogout = () => {
    // Clear all session storage
    sessionStorage.clear();
    localStorage.clear();
    console.log("Session and local storage cleared. Study ended.");
    setIsLoggedIn(false);
    setParticipant(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="app-header" style={{
        padding: '1rem 2rem',
        background: '#fff',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Participant: {participant?.participant_id}</span>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid #ddd',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          End Study
        </button>
      </div>

      <Routes>
        <Route path="/" element={<ArticlesList />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;