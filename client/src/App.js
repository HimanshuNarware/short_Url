import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Home from './pages/Home';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
  withCredentials: true,
});

function App() {
  const [user, setUser] = useState(null);

  // Silently try to restore session — never blocks the UI
  useEffect(() => {
    API.get('/api/auth/me')
      .then(res => {
        if (res.data.status === 'ok') setUser(res.data.message);
      })
      .catch(() => {}); // Not logged in — that's fine
  }, []);

  return (
    <div className="min-h-screen bg-[#141315] text-white">
      <Home user={user} setUser={setUser} api={API} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1c1b1e',
            color: '#ffffff',
            border: '2px solid #000',
            boxShadow: '4px 4px 0px rgba(0,0,0,1)',
            fontFamily: 'monospace',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#5aa02c', secondary: '#000' } },
          error: { iconTheme: { primary: '#FF8A80', secondary: '#000' } },
        }}
      />
    </div>
  );
}

export default App;
