import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './home.css';

function AuthPage({ setUser, api }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'error'|'success', text: '' }

  const showMsg = (type, text) => setMsg({ type, text });
  const clearMsg = () => setMsg(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMsg();
    if (!username.trim() || !password.trim()) {
      showMsg('error', 'Please fill in all fields.');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      showMsg('error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await api.post(endpoint, { username: username.trim(), password });
      if (res.data.status === 'ok') {
        setUser(res.data.message);
        toast.success(mode === 'login' ? 'Welcome back, Crafter!' : 'Account created! Welcome!');
      } else {
        showMsg('error', res.data.message || 'Something went wrong.');
      }
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    clearMsg();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/guest');
      if (res.data.status === 'ok') {
        setUser(res.data.message);
        toast.success('Joined as Guest Crafter!');
      } else {
        showMsg('error', res.data.message || 'Guest login failed.');
      }
    } catch (err) {
      showMsg('error', 'Could not start guest session. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141315] checkerboard-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 select-none">
          <h1 className="text-5xl font-black font-mono tracking-wider text-white">
            Craft<span className="text-[#5aa02c]">URL</span>
          </h1>
          <p className="text-xs font-mono text-[#A19FA3] mt-2 uppercase tracking-widest">
            Block &amp; Link — URL Shortener
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1c1b1e] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8">
          {/* Tab Toggle */}
          <div className="flex mb-6 border-2 border-black">
            <button
              onClick={() => { setMode('login'); clearMsg(); }}
              className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                mode === 'login'
                  ? 'bg-[#5aa02c] text-black'
                  : 'bg-[#0b0a0c] text-[#A19FA3] hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('register'); clearMsg(); }}
              className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all border-l-2 border-black ${
                mode === 'register'
                  ? 'bg-[#5aa02c] text-black'
                  : 'bg-[#0b0a0c] text-[#A19FA3] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Message Banner */}
          {msg && (
            <div className={`mb-4 p-3 border-2 flex items-start gap-2 font-mono text-xs ${
              msg.type === 'error'
                ? 'border-[#FF8A80] bg-[#FF8A80]/10 text-[#FF8A80]'
                : 'border-[#5aa02c] bg-[#5aa02c]/10 text-[#5aa02c]'
            }`}>
              <i className={`fa-solid mt-0.5 shrink-0 ${msg.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
              <span>{msg.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-[#A19FA3] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                id="auth-username"
                value={username}
                onChange={e => { setUsername(e.target.value); clearMsg(); }}
                placeholder="Enter your username..."
                autoComplete="username"
                className="w-full bg-[#0b0a0c] border-2 border-black p-3 text-white font-mono text-sm focus:outline-none focus:border-[#5aa02c] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)] placeholder-[#A19FA3] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[#A19FA3] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="auth-password"
                value={password}
                onChange={e => { setPassword(e.target.value); clearMsg(); }}
                placeholder="••••••••"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="w-full bg-[#0b0a0c] border-2 border-black p-3 text-white font-mono text-sm focus:outline-none focus:border-[#5aa02c] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)] placeholder-[#A19FA3] transition-colors"
              />
              {mode === 'register' && (
                <p className="text-[10px] text-[#A19FA3] font-mono mt-1">Minimum 6 characters.</p>
              )}
            </div>

            <button
              type="submit"
              id="auth-submit"
              disabled={loading}
              className="w-full bg-[#5aa02c] hover:bg-[#6cb835] text-black font-extrabold py-3.5 uppercase font-mono text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '...' : mode === 'login' ? '⚡ Login' : '🔨 Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 gap-3">
            <div className="flex-1 h-px bg-[#262428]"></div>
            <span className="text-[10px] font-mono text-[#A19FA3] uppercase">or</span>
            <div className="flex-1 h-px bg-[#262428]"></div>
          </div>

          {/* Guest Login */}
          <button
            id="guest-login-btn"
            onClick={handleGuest}
            disabled={loading}
            className="w-full bg-[#0b0a0c] hover:bg-[#262428] text-[#A19FA3] hover:text-white font-bold py-3 uppercase font-mono text-xs border-2 border-[#262428] hover:border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all disabled:opacity-60"
          >
            <i className="fa-solid fa-user-secret mr-2"></i>
            Continue as Guest
          </button>

          <p className="text-[10px] text-[#A19FA3]/60 font-mono text-center mt-4">
            Guest sessions expire after 24h. Create an account to save your links.
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] font-mono text-[#A19FA3]/40 mt-6 uppercase tracking-widest">
          CraftURL — Block &amp; Link v2.0
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
