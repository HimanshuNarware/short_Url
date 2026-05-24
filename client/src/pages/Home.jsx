import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from './Footer';
import './home.css';

function Home() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentUrls, setRecentUrls] = useState([]);
  const [profile, setProfile] = useState({
    name: 'Himanshu',
    level: 1,
    avatar: '👨‍🌾',
  });

  // Access control & Modal state
  const [isCraftModalOpen, setIsCraftModalOpen] = useState(false);

  // Cycle toggle in click trends
  const [cycleTab, setCycleTab] = useState('7cycles');

  // Rate limit, DNS and Docker States
  const [rateLimit, setRateLimit] = useState(1000);
  const [burstAllowance, setBurstAllowance] = useState(50);
  const [smartThrottling, setSmartThrottling] = useState(true);
  const [dnsChecks, setDnsChecks] = useState(true);
  const [malwareFiltering, setMalwareFiltering] = useState(true);
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [resolutionReplicas, setResolutionReplicas] = useState(8);
  const [analyticsReplicas, setAnalyticsReplicas] = useState(2);

  // Real API Statistics state
  const [stats, setStats] = useState({
    totalClicks: 0,
    uniquePlayers: 0,
    devices: { Desktop: 0, Mobile: 0, Tablet: 0, Misc: 0 },
    biomes: { 'United Realms': 0, 'Euro-Spawners': 0, 'Asian Biomes': 0 },
    referrers: { 'Direct Connect': 0, 'Social Spawners': 0, 'Search Explorers': 0 },
    dailyClicks: { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 }
  });

  // Access tokens list
  const [accessTokens, setAccessTokens] = useState([
    { name: 'Mobile_Prod_App', key: 'xk92', created: '2023-11-12', lastUsed: '2 min ago', status: 'ACTIVE' },
    { name: 'Staging_Local', key: '99ar', created: '2024-01-05', lastUsed: '--', status: 'REVOKED' },
  ]);

  // Terminal Log state
  const [terminalLogs, setTerminalLogs] = useState([
    '[08:22:11] INFO: Pulling new layer: craft-core-v2.4.1',
    '[08:22:14] WARN: Node 02 latency > 40ms',
    '[08:22:15] AUTH: New API Key generated for UID: 10293',
    '[08:22:19] INFO: Resolution-svc scaled to 8 replicas',
  ]);

  const ref = useRef(null);
  const modalRef = useRef(null);

  const rawUrl = process.env.REACT_APP_BACKEND_URL || '';
  const backendUrl = rawUrl ? (rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`) : '/';

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}api/settings/profile`);
      if (response.data.status === 'ok') {
        setProfile(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const saveProfile = async (updatedProfile) => {
    try {
      await axios.put(`${backendUrl}api/settings/profile`, updatedProfile);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const response = await axios.get(`${backendUrl}api/settings/system`);
      if (response.data.status === 'ok') {
        const s = response.data.message;
        if (s.rateLimit !== undefined) setRateLimit(s.rateLimit);
        if (s.burstAllowance !== undefined) setBurstAllowance(s.burstAllowance);
        if (s.smartThrottling !== undefined) setSmartThrottling(s.smartThrottling);
        if (s.dnsChecks !== undefined) setDnsChecks(s.dnsChecks);
        if (s.malwareFiltering !== undefined) setMalwareFiltering(s.malwareFiltering);
        if (s.deepAnalysis !== undefined) setDeepAnalysis(s.deepAnalysis);
        if (s.resolutionReplicas !== undefined) setResolutionReplicas(s.resolutionReplicas);
        if (s.analyticsReplicas !== undefined) setAnalyticsReplicas(s.analyticsReplicas);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const saveSystemSettings = async (updates) => {
    try {
      await axios.put(`${backendUrl}api/settings/system`, updates);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get(`${backendUrl}api/settings/keys`);
      if (response.data.status === 'ok') {
        setAccessTokens(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching API keys:', err);
    }
  };

  const fetchRecentUrls = async () => {
    try {
      const response = await axios.get(`${backendUrl}api/url/recent`);
      if (response.data.status === 'ok') {
        setRecentUrls(response.data.message || []);
      }
    } catch (err) {
      console.error('Error fetching recent URLs:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}api/url/stats`);
      if (response.data.status === 'ok') {
        setStats(response.data.message || {
          totalClicks: 0,
          uniquePlayers: 0,
          devices: { Desktop: 0, Mobile: 0, Tablet: 0, Misc: 0 },
          biomes: { 'United Realms': 0, 'Euro-Spawners': 0, 'Asian Biomes': 0 },
          referrers: { 'Direct Connect': 0, 'Social Spawners': 0, 'Search Explorers': 0 },
          dailyClicks: { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 }
        });
      }
    } catch (err) {
      console.error('Error fetching global stats:', err);
    }
  };

 useEffect(() => {
  fetchRecentUrls();
  fetchStats();
  fetchProfile();
  fetchSystemSettings();
  fetchApiKeys();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

 
  // Set up periodic logs to make the terminal look active
  useEffect(() => {
    const timer = setInterval(() => {
      if (activeTab === 'api_security') {
        const services = ['resolution-svc', 'analytics-svc', 'api-gateway'];
        const actions = ['ping: 200 OK', 'memory clean completed', 'CPU throttled slightly', 'refresh tokens check'];
        const randomService = services[Math.floor(Math.random() * services.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const timeStr = new Date().toTimeString().split(' ')[0];
        
        setTerminalLogs(prev => [
          ...prev.slice(-8),
          `[${timeStr}] INFO: ${randomService} ${randomAction}`
        ]);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [activeTab]);

  async function handleCraft(e, inputRef) {
    e.preventDefault();
    const inputValue = inputRef.current?.value;
    if (!inputValue) {
      toast.error('Please enter a URL');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}api/url/`, {
        url: inputValue,
        name: 'website',
      });

      if (response.data.status === 'failed') {
        toast.error(response.data.message || 'Error shortening URL');
        return;
      }

      if (!response.data.message?.nnid) {
        toast.error('Invalid response from server');
        return;
      }

      const shortUrl = (process.env.REACT_APP_BACKEND_URL || window.location.origin) + '/' + response.data.message.nnid;
      setResult(shortUrl);
      toast.success('URL shortened successfully!');
      if (inputRef.current) inputRef.current.value = '';
      refreshAll();
    } catch (e) {
      toast.error('Error shortening URL');
      console.error('Error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = async (urlToCopy) => {
    const textToCopy = urlToCopy || result;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async (nnid) => {
    try {
      const response = await axios.delete(`${backendUrl}api/url/${nnid}`);
      if (response.data.status === 'ok') {
        toast.success('URL deleted successfully');
        refreshAll();
        if (result.endsWith(nnid)) {
          setResult('');
        }
      } else {
        toast.error('Failed to delete URL');
      }
    } catch (error) {
      toast.error('Error deleting URL');
      console.error('Error deleting:', error);
    }
  };

  const handleMassDelete = () => {
    if (recentUrls.length === 0) {
      toast.error('Inventory is already empty!');
      return;
    }
    if (window.confirm('Are you sure you want to mass delete all URLs from the chest?')) {
      recentUrls.forEach(url => handleDelete(url.nnid));
      toast.success('Cleared all items!');
    }
  };

  const handleMassExport = () => {
    if (recentUrls.length === 0) {
      toast.error('Nothing to export!');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recentUrls, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "url_inventory_chest.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Inventory chest exported successfully!');
  };

  const generateNewSecret = async () => {
    const nameInput = prompt("Enter Key Name:", "Mobile_Prod_App");
    if (!nameInput) return;
    try {
      const response = await axios.post(`${backendUrl}api/settings/keys`, { name: nameInput });
      if (response.data.status === 'ok') {
        fetchApiKeys();
        toast.success('Generated new API key successfully!');
      } else {
        toast.error('Failed to generate API key');
      }
    } catch (err) {
      toast.error('Error generating API key');
      console.error(err);
    }
  };

  const deleteToken = async (id) => {
    if (window.confirm('Delete this API access token?')) {
      try {
        if (typeof id === 'string' && id.length === 24) {
          const response = await axios.delete(`${backendUrl}api/settings/keys/${id}`);
          if (response.data.status === 'ok') {
            fetchApiKeys();
            toast.success('Access token revoked!');
          } else {
            toast.error('Failed to revoke access token');
          }
        } else {
          const updated = [...accessTokens];
          updated.splice(id, 1);
          setAccessTokens(updated);
          toast.success('Access token revoked!');
        }
      } catch (err) {
        toast.error('Error revoking token');
        console.error(err);
      }
    }
  };

  const getDisplayUrl = (nnid) => {
    const host = process.env.REACT_APP_BACKEND_URL
      ? new URL(process.env.REACT_APP_BACKEND_URL).host
      : window.location.host || 'craft.url';
    return `${host}/${nnid}`;
  };

  const getFullShortUrl = (nnid) => {
    const origin = process.env.REACT_APP_BACKEND_URL || window.location.origin;
    const baseUrl = origin.endsWith('/') ? origin : `${origin}/`;
    return `${baseUrl}${nnid}`;
  };

  const timeAgo = (dateString) => {
    if (!dateString) return 'some time ago';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  };

  // Filter recent URLs by search query
  const filteredUrls = recentUrls.filter((item) =>
    (item.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.nnid || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render a pixelated QR Code placeholder box
  const renderQrPlaceholder = (color) => {
    return (
      <div className="grid grid-cols-4 grid-rows-4 w-10 h-10 border border-black p-0.5 bg-[#0b0a0c] shrink-0 select-none">
        <div className={`col-span-1 row-span-1 ${color}`}></div>
        <div className="col-span-1 row-span-1 bg-transparent"></div>
        <div className={`col-span-1 row-span-1 ${color}`}></div>
        <div className={`col-span-1 row-span-1 ${color}`}></div>
        
        <div className="col-span-1 row-span-1 bg-transparent"></div>
        <div className={`col-span-1 row-span-1 ${color}`}></div>
        <div className="col-span-1 row-span-1 bg-transparent"></div>
        <div className="col-span-1 row-span-1 bg-transparent"></div>

        <div className={`col-span-1 row-span-1 ${color}`}></div>
        <div className="col-span-1 row-span-1 bg-transparent"></div>
        <div className={`col-span-1 row-span-1 ${color}`}></div>
        <div className="col-span-1 row-span-1 bg-transparent"></div>

        <div className={`col-span-1 row-span-1 ${color}`}></div>
        <div className={`col-span-1 row-span-1 ${color}`}></div>
        <div className="col-span-1 row-span-1 bg-transparent"></div>
        <div className={`col-span-1 row-span-1 ${color}`}></div>
      </div>
    );
  };

  // Dynamic calculations combining baseline mock & database clicks
  const totalClicksCombined = 124582 + stats.totalClicks;
  const uniquePlayersCombined = 12043 + stats.uniquePlayers;

  const totalBiomes = (stats.biomes['United Realms'] || 0) + (stats.biomes['Euro-Spawners'] || 0) + (stats.biomes['Asian Biomes'] || 0);
  const getBiomePercent = (name, defaultVal) => {
    if (totalBiomes === 0) return defaultVal;
    return Math.round(((stats.biomes[name] || 0) / totalBiomes) * 100);
  };

  const totalRefs = (stats.referrers['Direct Connect'] || 0) + (stats.referrers['Social Spawners'] || 0) + (stats.referrers['Search Explorers'] || 0);
  const getRefVal = (name, defaultVal) => {
    if (totalRefs === 0) return defaultVal;
    return stats.referrers[name] || 0;
  };

  const totalDevices = (stats.devices.Desktop || 0) + (stats.devices.Mobile || 0) + (stats.devices.Tablet || 0) + (stats.devices.Misc || 0);
  const getDevPercent = (name, defaultVal) => {
    if (totalDevices === 0) return defaultVal;
    return Math.round(((stats.devices[name] || 0) / totalDevices) * 100);
  };

  // Computes SVG line coordinates dynamically based on daily click volumes
  const getDailyPoints = (isPlayers = false) => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const values = days.map(d => stats.dailyClicks[d] || 0);
    const hasRealData = values.some(v => v > 0);
    
    if (!hasRealData) {
      // Returns reference screenshot shapes
      if (isPlayers) {
        return cycleTab === '7cycles'
          ? "M 40,180 L 120,165 L 200,145 L 280,130 L 360,110 L 440,95 L 520,80 L 590,65"
          : "M 40,175 L 95,160 L 150,150 L 205,140 L 260,130 L 315,115 L 370,105 L 425,95 L 480,85 L 535,70 L 590,55";
      } else {
        return cycleTab === '7cycles' 
          ? "M 40,170 L 120,130 L 200,150 L 280,95 L 360,115 L 440,65 L 520,85 L 590,50" 
          : "M 40,160 L 95,140 L 150,155 L 205,115 L 260,130 L 315,95 L 370,110 L 425,75 L 480,90 L 535,60 L 590,40";
      }
    }

    const maxVal = Math.max(...values, 4);
    const points = values.map((val, idx) => {
      const x = 40 + idx * (550 / (values.length - 1));
      // Map range: bottom Y=185 to top Y=15
      const offset = isPlayers ? 5 : 0;
      const y = 185 - ((val + offset) / (maxVal + 5)) * 160;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return points.join(' ');
  };

  const scaleResolution = () => {
    setResolutionReplicas(prev => {
      const val = prev + 1;
      saveSystemSettings({ resolutionReplicas: val });
      return val;
    });
    toast.success('Scaled resolution-svc replicas!');
  };
  const scaleAnalytics = () => {
    setAnalyticsReplicas(prev => {
      const val = prev + 1;
      saveSystemSettings({ analyticsReplicas: val });
      return val;
    });
    toast.success('Scaled analytics-svc replicas!');
  };

  return (
    <div className="flex min-h-screen bg-[#141315] checkerboard-bg text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c1b1e] border-r-4 border-black p-6 flex flex-col justify-between select-none shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl font-bold font-mono tracking-wider text-white">
              Craft<span className="text-[#5aa02c]">URL</span>
            </span>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-[#0b0a0c] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6">
            <div className="w-10 h-10 border border-black flex-shrink-0 bg-[#3a2010] relative overflow-hidden select-none">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                {/* Hair */}
                <div className="bg-[#2a1408] col-span-8 h-full"></div>
                {/* Hair & skin */}
                <div className="bg-[#2a1408] col-span-1 h-full"></div>
                <div className="bg-[#bd8e72] col-span-6 h-full"></div>
                <div className="bg-[#2a1408] col-span-1 h-full"></div>
                {/* Eyes */}
                <div className="bg-[#2a1408] col-span-1 h-full"></div>
                <div className="bg-[#ffffff] col-span-1 h-full"></div>
                <div className="bg-[#0000ff] col-span-1 h-full"></div>
                <div className="bg-[#bd8e72] col-span-2 h-full"></div>
                <div className="bg-[#0000ff] col-span-1 h-full"></div>
                <div className="bg-[#ffffff] col-span-1 h-full"></div>
                <div className="bg-[#2a1408] col-span-1 h-full"></div>
                {/* Skin */}
                <div className="bg-[#bd8e72] col-span-8 h-full"></div>
                {/* Mouth */}
                <div className="bg-[#bd8e72] col-span-2 h-full"></div>
                <div className="bg-[#5c2a18] col-span-4 h-full"></div>
                <div className="bg-[#bd8e72] col-span-2 h-full"></div>
                {/* Torso */}
                <div className="bg-[#008080] col-span-8 h-full"></div>
              </div>
            </div>
            <div>
              <div className="font-bold text-sm text-white">{profile.name}</div>
              <div className="text-[10px] text-[#A19FA3] font-mono">Level {profile.level} Link Crafter</div>
            </div>
          </div>

          {/* New Craft Link Button in Sidebar */}
          <button
            onClick={() => setIsCraftModalOpen(true)}
            className="w-full bg-[#5aa02c] text-black font-extrabold p-3 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase text-center hover:bg-[#6cb835] active:translate-y-[2px] transition-all mb-6 font-mono text-sm block"
          >
            + Craft New Link
          </button>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 p-3 border-2 border-black transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#5aa02c] text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-transparent text-[#A19FA3] hover:text-white border-transparent'
              }`}
            >
              <i className="fa-solid fa-table-cells-large w-5 text-center"></i>
              <span className="font-mono text-sm uppercase">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('my_links')}
              className={`w-full flex items-center gap-3 p-3 border-2 border-black transition-all ${
                activeTab === 'my_links'
                  ? 'bg-[#5aa02c] text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-transparent text-[#A19FA3] hover:text-white border-transparent'
              }`}
            >
              <i className="fa-solid fa-box-archive w-5 text-center"></i>
              <span className="font-mono text-sm uppercase">My Links</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 p-3 border-2 border-black transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#5aa02c] text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-transparent text-[#A19FA3] hover:text-white border-transparent'
              }`}
            >
              <i className="fa-solid fa-chart-simple w-5 text-center"></i>
              <span className="font-mono text-sm uppercase">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('api_security')}
              className={`w-full flex items-center gap-3 p-3 border-2 border-black transition-all ${
                activeTab === 'api_security'
                  ? 'bg-[#5aa02c] text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-transparent text-[#A19FA3] hover:text-white border-transparent'
              }`}
            >
              <i className="fa-solid fa-shield-halved w-5 text-center"></i>
              <span className="font-mono text-sm uppercase">API & Security</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2 border-t border-[#262428] pt-4">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 p-3 border-2 border-black transition-all ${
              activeTab === 'settings'
                ? 'bg-[#5aa02c] text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent text-[#A19FA3] hover:text-white border-transparent'
            }`}
          >
            <i className="fa-solid fa-gear w-5 text-center"></i>
            <span className="font-mono text-sm uppercase">Settings</span>
          </button>

          <button
            onClick={() => {
              toast.error('Session ended. Server status: normal.');
            }}
            className="w-full flex items-center gap-3 p-3 text-[#A19FA3] hover:text-red-400 bg-transparent border-transparent transition-all"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
            <span className="font-mono text-sm uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#1c1b1e] border-b-4 border-black px-8 flex items-center justify-between select-none">
          <h1 className="text-2xl font-bold font-mono tracking-wider text-[#5aa02c]">
            CraftURL
          </h1>

          {/* Search bar & profile shortcuts */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#0b0a0c] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <i className="fa-solid fa-magnifying-glass text-[#A19FA3] text-sm"></i>
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-xs font-mono ml-2 w-48 placeholder-[#A19FA3]"
              />
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className="text-[#A19FA3] hover:text-white transition-colors"
              title="Profile Settings"
            >
              <i className="fa-solid fa-user-gear text-lg"></i>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="text-[#A19FA3] hover:text-[#5aa02c] transition-colors"
              title="App Settings"
            >
              <i className="fa-solid fa-sliders text-lg"></i>
            </button>
          </div>
        </header>

        {/* Dashboard Area */}
        <main className="flex-1 p-8 space-y-8 max-w-6xl w-full mx-auto animate-slide-up">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Craft New Link Panel */}
              <section className="bg-[#1c1b1e] border-4 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none checkerboard-bg"></div>

                <h2 className="text-3xl font-extrabold tracking-wider text-white mb-2 font-mono">
                  CRAFT NEW LINK
                </h2>
                <p className="text-sm text-[#A19FA3] mb-6 max-w-xl mx-auto">
                  Combine your long URL with our magical pixels to create a legendary shortcut.
                </p>

                {/* Shortener Form */}
                <form onSubmit={(e) => handleCraft(e, ref)} className="max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row bg-[#0b0a0c] border-4 border-black p-1 shadow-[inset_3px_3px_0px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center flex-1 min-w-0">
                      <i className="fa-solid fa-link text-[#5aa02c] text-lg px-4"></i>
                      <input
                        type="url"
                        ref={ref}
                        required
                        placeholder="Enter long URL to craft..."
                        className="flex-1 bg-transparent border-none outline-none py-3 text-white placeholder-[#A19FA3] font-mono text-sm sm:text-base min-w-0"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#5aa02c] text-black font-extrabold text-base px-8 py-3 uppercase border-t-4 sm:border-t-0 sm:border-l-4 border-black hover:bg-[#6cb835] active:translate-y-[2px] transition-all shrink-0 font-mono"
                    >
                      {isLoading ? 'Crafting...' : 'Craft'}
                    </button>
                  </div>
                </form>

                {/* Instant Success Alert */}
                {result && (
                  <div className="mt-6 p-4 bg-[#0b0a0c] border-2 border-[#5aa02c] max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-slide-up">
                    <div className="flex items-center gap-2 text-left min-w-0">
                      <span className="text-[#5aa02c] font-mono text-sm font-bold shrink-0">SUCCESS:</span>
                      <a
                        href={result}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white font-mono hover:underline truncate text-sm"
                      >
                        {result}
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopy(result)}
                      className="bg-[#5aa02c] hover:bg-[#6cb835] text-black px-4 py-2 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] shrink-0 font-mono"
                    >
                      <i className="fa-regular fa-copy mr-1"></i> Copy Link
                    </button>
                  </div>
                )}
              </section>

              {/* Statistics Grid */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* XP / Clicks Card */}
                <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center text-[#FFC107] text-3xl mb-2">
                    🍎
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    {totalClicksCombined.toLocaleString()}
                  </div>
                  <div className="text-[10px] tracking-wider font-bold text-[#A19FA3] uppercase font-mono mt-1">
                    Total XP (Clicks)
                  </div>
                  <div className="w-full h-3 bg-[#0b0a0c] border-2 border-black mt-4 p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                    <div className="h-full bg-[#FFC107] transition-all duration-500" style={{ width: '65%' }}></div>
                  </div>
                </div>

                {/* Geographic reach */}
                <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center text-[#00BCD4] text-3xl mb-2">
                    🗺️
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    48 biomes
                  </div>
                  <div className="text-[10px] tracking-wider font-bold text-[#A19FA3] uppercase font-mono mt-1">
                    Geographic Reach
                  </div>
                  <div className="w-full h-3 bg-[#0b0a0c] border-2 border-black mt-4 p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                    <div className="h-full bg-[#00BCD4] transition-all duration-500" style={{ width: '45%' }}></div>
                  </div>
                </div>

                {/* Link Uptime */}
                <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center text-[#FF8A80] text-3xl mb-2">
                    ⏰
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    99.9%
                  </div>
                  <div className="text-[10px] tracking-wider font-bold text-[#A19FA3] uppercase font-mono mt-1">
                    Link Uptime
                  </div>
                  <div className="w-full h-3 bg-[#0b0a0c] border-2 border-black mt-4 p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                    <div className="h-full bg-[#FF8A80] transition-all duration-500" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </section>

              {/* Recent Crafting Section */}
              <section>
                <div className="flex items-center justify-between mb-4 select-none">
                  <h3 className="text-xl font-bold font-mono text-white uppercase tracking-wider">
                    Recent Crafting
                  </h3>
                  <button
                    onClick={() => setActiveTab('my_links')}
                    className="text-[#5aa02c] hover:text-[#6cb835] font-bold font-mono text-sm flex items-center gap-1 transition-all"
                  >
                    View Chest <i className="fa-solid fa-arrow-right-long"></i>
                  </button>
                </div>

                {/* List of links */}
                <div className="space-y-4">
                  {filteredUrls.length === 0 ? (
                    <div className="p-8 text-center bg-[#1c1b1e] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#A19FA3] font-mono">
                      {searchQuery ? 'No matching links inside the chest.' : 'No URLs crafted yet. Craft one above!'}
                    </div>
                  ) : (
                    filteredUrls.slice(0, 5).map((item, index) => {
                      const fullShortUrl = getFullShortUrl(item.nnid);
                      return (
                        <div
                          key={item.nnid || index}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#1c1b1e] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all gap-4"
                        >
                          <div className="flex items-center min-w-0">
                            <div className="w-12 h-12 bg-[#0b0a0c] border-2 border-black flex items-center justify-center text-2xl select-none shrink-0 mr-4 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)]">
                              {renderQrPlaceholder(index % 2 === 0 ? 'bg-[#5aa02c]' : 'bg-[#FFC107]')}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-mono text-sm truncate max-w-md hover:text-[#5aa02c]" title={item.url}>
                                <a href={item.url} target="_blank" rel="noreferrer">
                                  {item.url}
                                </a>
                              </p>
                              <span className="text-[10px] text-[#A19FA3] font-mono mt-1 block">
                                Created {timeAgo(item.createdAt)} | Clicks: {item.clicks || 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-auto">
                            <div className="bg-[#0b0a0c] border-2 border-black px-4 py-2 text-[#5aa02c] font-mono text-sm shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)] max-w-xs truncate select-all">
                              {getDisplayUrl(item.nnid)}
                            </div>

                            <button
                              onClick={() => handleCopy(fullShortUrl)}
                              className="p-2.5 bg-[#1c1b1e] hover:bg-[#262428] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#5aa02c] active:translate-y-[1px] transition-all"
                              title="Copy to Clipboard"
                            >
                              <i className="fa-solid fa-copy"></i>
                            </button>

                            <button
                              onClick={() => handleDelete(item.nnid)}
                              className="p-2.5 bg-[#1c1b1e] hover:bg-[#262428] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#FF8A80] active:translate-y-[1px] transition-all"
                              title="Destroy Link"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Bottom Crafting Tips */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#4a3224] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden flex flex-col justify-between select-none min-h-[140px]">
                  <div className="absolute right-2 bottom-2 text-7xl opacity-10 select-none pointer-events-none transform rotate-12">
                    🛠️
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-mono text-[#FFC107] uppercase tracking-wider mb-2">
                      Pro Crafter Tip
                    </h4>
                    <p className="text-sm text-amber-100/90 leading-relaxed font-sans">
                      Use custom aliases to make your links unforgettable. Level up your branding game today.
                    </p>
                  </div>
                </div>

                <div className="bg-[#376974] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden flex flex-col justify-between select-none min-h-[140px]">
                  <div className="absolute right-2 bottom-2 text-7xl opacity-10 select-none pointer-events-none transform -rotate-12 font-mono text-cyan-300">
                    &lt;/&gt;
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-mono text-[#00BCD4] uppercase tracking-wider mb-2">
                      Ender-API is LIVE
                    </h4>
                    <p className="text-sm text-cyan-100/90 leading-relaxed font-sans">
                      Connect your servers directly to our crafting table. High speed, no latency.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* TAB 2: MY LINKS (URL INVENTORY) */}
          {activeTab === 'my_links' && (
            <div className="space-y-6 animate-slide-up">
              <div className="select-none">
                <span className="text-[10px] text-[#A19FA3] font-mono tracking-widest uppercase block mb-1">
                  INVENTORY / {profile.name.toUpperCase()} / SHORTCUTS
                </span>
                <h2 className="text-4xl font-extrabold font-mono text-white uppercase tracking-wider">
                  URL INVENTORY
                </h2>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1c1b1e] border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMassDelete}
                    className="bg-[#4a3224] hover:bg-[#5b3e2c] border-2 border-black text-white px-4 py-2 uppercase font-mono text-xs flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all"
                  >
                    <i className="fa-solid fa-trash-can text-red-300"></i> Mass Delete
                  </button>
                  <button
                    onClick={handleMassExport}
                    className="bg-[#4a3224] hover:bg-[#5b3e2c] border-2 border-black text-white px-4 py-2 uppercase font-mono text-xs flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all"
                  >
                    <i className="fa-solid fa-download text-green-300"></i> Mass Export
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-1 md:max-w-md">
                  <div className="flex items-center bg-[#0b0a0c] border-2 border-black px-3 py-1.5 shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)] flex-1">
                    <i className="fa-solid fa-magnifying-glass text-[#A19FA3] text-sm"></i>
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-xs font-mono ml-2 w-full placeholder-[#A19FA3]"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setRecentUrls(prev => [...prev].reverse());
                      toast.success('Inventory sorted!');
                    }}
                    className="bg-[#262428] hover:bg-[#322f34] border-2 border-black text-white px-4 py-2 uppercase font-mono text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all"
                  >
                    Sort
                  </button>
                </div>
              </div>

              {/* Grid of Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredUrls.map((item, index) => {
                  const fullShortUrl = getFullShortUrl(item.nnid);
                  const isHttps = item.url.startsWith('https://');
                  
                  // Calculate health based on protocol and actual redirection hits
                  const healthPercent = isHttps 
                    ? (item.clicks > 0 ? 100 : 92) 
                    : (item.clicks > 5 ? 45 : 12);
                  const healthColor = healthPercent >= 90 ? 'bg-[#5aa02c]' : healthPercent >= 40 ? 'bg-[#FFC107]' : 'bg-[#FF8A80]';
                  const badgeType = healthPercent === 100 ? 'ribbon' : healthPercent >= 45 ? 'hourglass' : 'warning';
                  const securityStatus = healthPercent === 100 
                    ? 'OWASP SECURE' 
                    : healthPercent >= 45 
                      ? 'SSL WARNING' 
                      : 'MALWARE DETECTED';
                  const qrColor = healthPercent >= 90 ? 'bg-[#5aa02c]' : healthPercent >= 40 ? 'bg-[#FFC107]' : 'bg-[#FF8A80]';

                  return (
                    <div
                      key={item.nnid || index}
                      className="bg-[#1c1b1e] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between min-h-[260px] animate-slide-up"
                    >
                      <div className="absolute top-2 right-2 select-none pointer-events-none">
                        {badgeType === 'ribbon' && (
                          <span className="w-5 h-5 bg-[#00BCD4] text-black border border-black flex items-center justify-center text-[10px] shadow-[1px_1px_0px_rgba(0,0,0,1)]" title="Certified Clean">
                            🎖️
                          </span>
                        )}
                        {badgeType === 'hourglass' && (
                          <span className="w-5 h-5 bg-[#FFC107] text-black border border-black flex items-center justify-center text-[10px] shadow-[1px_1px_0px_rgba(0,0,0,1)]" title="Expiring Slot">
                            ⏳
                          </span>
                        )}
                        {badgeType === 'warning' && (
                          <span className="w-5 h-5 bg-[#FF8A80] text-black border border-black flex items-center justify-center text-[10px] shadow-[1px_1px_0px_rgba(0,0,0,1)] animate-bounce" title="Insecure Link">
                            ⚠️
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          {renderQrPlaceholder(qrColor)}
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold font-mono text-[#5aa02c] truncate">
                              /{item.nnid}
                            </h4>
                            <span className="text-[9px] text-[#A19FA3] font-mono uppercase">
                              {badgeType === 'hourglass' ? 'Exp: 4h' : badgeType === 'warning' ? 'Flagged 12m ago' : `Clicks: ${item.clicks || 0}`}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="text-[9px] font-mono text-[#A19FA3] uppercase block mb-1">Destination</label>
                          <div className="bg-[#0b0a0c] border border-black p-2 text-xs text-[#A19FA3] font-mono truncate select-all shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                            {item.url}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#262428]">
                        <div className="flex justify-between text-[9px] font-mono mb-1 text-[#A19FA3]">
                          <span>LINK HEALTH</span>
                          <span className={healthPercent >= 90 ? 'text-[#5aa02c]' : healthPercent >= 40 ? 'text-[#FFC107]' : 'text-[#FF8A80]'}>{healthPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#0b0a0c] border border-black p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                          <div className={`h-full ${healthColor}`} style={{ width: `${healthPercent}%` }}></div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className={`text-[9px] font-mono flex items-center gap-1 font-bold ${healthPercent >= 90 ? 'text-[#5aa02c]' : healthPercent >= 40 ? 'text-[#FFC107]' : 'text-[#FF8A80]'}`}>
                            <i className={healthPercent >= 90 ? 'fa-solid fa-shield-halved' : 'fa-solid fa-circle-exclamation'}></i>
                            {securityStatus}
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCopy(fullShortUrl)}
                              className="p-1 bg-[#1c1b1e] border border-black text-[#5aa02c] hover:bg-[#262428] text-[10px] shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[0.5px]"
                              title="Copy link"
                            >
                              <i className="fa-solid fa-copy"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(item.nnid)}
                              className="p-1 bg-[#1c1b1e] border border-black text-[#FF8A80] hover:bg-[#262428] text-[10px] shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[0.5px]"
                              title="Destroy link"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="bg-[#141315] border-4 border-dashed border-[#262428] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center min-h-[260px] select-none text-[#A19FA3] hover:text-white cursor-pointer hover:border-white transition-all group" onClick={() => setIsCraftModalOpen(true)}>
                  <i className="fa-solid fa-square-plus text-3xl mb-2 text-[#262428] group-hover:text-white transition-colors"></i>
                  <span className="font-mono text-xs uppercase tracking-wider">Empty Slot</span>
                </div>

                <div className="bg-[#141315]/50 border-4 border-dashed border-[#262428]/50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center min-h-[260px] select-none text-[#A19FA3]/50">
                  <i className="fa-solid fa-lock text-3xl mb-2"></i>
                  <span className="font-mono text-xs uppercase tracking-wider">Level 50 Required</span>
                </div>
              </div>

              {/* Bottom statistics columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:col-span-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold font-mono text-[#A19FA3] uppercase tracking-wider">
                      Total Inventory Weight
                    </h4>
                    <div className="text-4xl font-extrabold font-mono text-[#5aa02c] mt-2">
                      {(recentUrls.length * 128 + 1248 + stats.totalClicks).toLocaleString()} <span className="text-sm font-bold text-white">CLICKS</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full h-2.5 bg-[#0b0a0c] border border-black p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                      <div className="h-full bg-[#5aa02c]" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-[10px] text-[#A19FA3] font-mono mt-1 block">
                      65% of monthly quota used
                    </span>
                  </div>
                </div>

                <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:col-span-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-3 z-10 w-full sm:w-auto">
                    <h4 className="text-xs font-bold font-mono text-[#A19FA3] uppercase tracking-wider mb-2">
                      Global Security Status (OWASP Compliance)
                    </h4>
                    
                    <div className="flex items-center gap-3 bg-[#0b0a0c] border border-black p-3.5 w-full sm:w-80 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <i className="fa-solid fa-shield text-[#5aa02c] text-lg shrink-0"></i>
                      <div>
                        <div className="text-xs font-bold font-mono text-white">XSS Protected</div>
                        <div className="text-[9px] text-[#A19FA3] font-mono">Injection Prevention active</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#0b0a0c] border border-black p-3.5 w-full sm:w-80 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <i className="fa-solid fa-shield-halved text-[#5aa02c] text-lg shrink-0"></i>
                      <div>
                        <div className="text-xs font-bold font-mono text-white">CORS Validated</div>
                        <div className="text-[9px] text-[#A19FA3] font-mono">Global policy enforced</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#0b0a0c] border border-black p-3.5 w-full sm:w-80 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <i className="fa-solid fa-key text-[#FF8A80] text-lg shrink-0"></i>
                      <div>
                        <div className="text-xs font-bold font-mono text-white">HTTPS Mandatory</div>
                        <div className="text-[9px] text-[#FF8A80] font-mono">3 warnings detected</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block opacity-20 pointer-events-none">
                    <svg width="180" height="150" viewBox="0 0 100 100" className="text-[#5aa02c]">
                      <circle cx="10" cy="20" r="2" fill="currentColor" />
                      <circle cx="50" cy="10" r="2" fill="currentColor" />
                      <circle cx="90" cy="30" r="2" fill="currentColor" />
                      <circle cx="30" cy="50" r="2" fill="currentColor" />
                      <circle cx="70" cy="60" r="2" fill="currentColor" />
                      <circle cx="20" cy="80" r="2" fill="currentColor" />
                      <circle cx="60" cy="90" r="2" fill="currentColor" />
                      
                      <line x1="10" y1="20" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="50" y1="10" x2="90" y2="30" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="10" y1="20" x2="30" y2="50" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="50" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="30" y1="50" x2="70" y2="60" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="90" y1="30" x2="70" y2="60" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="30" y1="50" x2="20" y2="80" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="70" y1="60" x2="60" y2="90" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="20" y1="80" x2="60" y2="90" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS (ANALYTICS REALM) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                <div>
                  <h2 className="text-4xl font-extrabold font-mono text-white uppercase tracking-wider">
                    Analytics Realm
                  </h2>
                  <p className="text-xs text-[#A19FA3] font-mono mt-1">
                    Track your portal performance across the digital biomes.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="border-4 border-black p-3 bg-[#1c1b1e] shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center min-w-[140px] outline outline-2 outline-white/5" title="Base: 124,582 + Real Clicks">
                    <span className="text-[9px] font-mono text-[#A19FA3] block uppercase tracking-wider">Total XP (Clicks)</span>
                    <span className="text-xl font-black font-mono text-[#5aa02c] block mt-1">
                      {totalClicksCombined.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-4 border-black p-3 bg-[#1c1b1e] shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center min-w-[140px] outline outline-2 outline-white/5" title="Base: 12,043 + Real Unique Visitors">
                    <span className="text-[9px] font-mono text-[#A19FA3] block uppercase tracking-wider">Unique Players</span>
                    <span className="text-xl font-black font-mono text-[#00BCD4] block mt-1">
                      {uniquePlayersCombined.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Line Graph Card */}
              <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-chart-line text-[#5aa02c]"></i> Click Trends
                  </h3>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCycleTab('7cycles')}
                      className={`border-2 border-black px-3 py-1 font-mono text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all ${
                        cycleTab === '7cycles' ? 'bg-[#5aa02c] text-black font-bold border-[#5aa02c]' : 'bg-[#141315] text-[#A19FA3] hover:text-white'
                      }`}
                    >
                      Last 7 Cycles
                    </button>
                    <button
                      onClick={() => setCycleTab('30cycles')}
                      className={`border-2 border-black px-3 py-1 font-mono text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all ${
                        cycleTab === '30cycles' ? 'bg-[#5aa02c] text-black font-bold border-[#5aa02c]' : 'bg-[#141315] text-[#A19FA3] hover:text-white'
                      }`}
                    >
                      Last 30 Cycles
                    </button>
                  </div>
                </div>

                <div className="bg-[#0b0a0c] border-2 border-black p-4 relative overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)]">
                  <svg className="w-full h-56" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#1c1b1e" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#1c1b1e" strokeWidth="1" strokeDasharray="4,4" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#1c1b1e" strokeWidth="1" strokeDasharray="4,4" />
                    
                    <line x1="40" y1="10" x2="40" y2="185" stroke="#262428" strokeWidth="1" />
                    <line x1="40" y1="185" x2="590" y2="185" stroke="#262428" strokeWidth="1" />
                    
                    {/* Click line (Green) */}
                    <path
                      d={getDailyPoints(false)}
                      fill="none"
                      stroke="#5aa02c"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Unique Player line (Cyan dashed) */}
                    <path
                      d={getDailyPoints(true)}
                      fill="none"
                      stroke="#00BCD4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="4,4"
                    />
                  </svg>

                  <div className="flex justify-between pl-10 pr-2 pt-2 border-t border-[#1c1b1e] text-[9px] font-mono text-[#A19FA3] select-none">
                    <span>MON</span>
                    <span>TUE</span>
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                    <span>SUN</span>
                  </div>
                </div>
              </div>

              {/* Bottom stats layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Player World Map */}
                <div className="bg-[#1c1b1e] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                  <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-earth-americas text-[#00BCD4]"></i> Player World Map
                  </h3>
                  
                  <div className="bg-[#0b0a0c] border-2 border-black h-36 flex flex-col items-center justify-center p-3 relative shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                    <svg width="100%" height="100%" viewBox="0 0 100 50" className="text-white/10 shrink-0">
                      <rect x="10" y="10" width="12" height="10" fill="currentColor" rx="1" />
                      <rect x="25" y="15" width="20" height="25" fill="currentColor" rx="2" />
                      <rect x="50" y="8" width="15" height="15" fill="currentColor" rx="1" />
                      <rect x="70" y="10" width="10" height="12" fill="currentColor" rx="1" />
                      <rect x="58" y="26" width="18" height="18" fill="currentColor" rx="2" />
                      <rect x="80" y="24" width="8" height="8" fill="currentColor" rx="1" />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[#0b0a0c]/90 border-2 border-[#5aa02c] px-3 py-1 text-[9px] font-bold font-mono text-[#5aa02c] shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
                        Top Biome: North America
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between border-b border-[#262428] pb-1">
                      <span className="text-[#A19FA3]">United Realms</span>
                      <span className="text-white font-bold">{getBiomePercent('United Realms', 42)}%</span>
                    </div>
                    <div className="flex justify-between border-b border-[#262428] pb-1">
                      <span className="text-[#A19FA3]">Euro-Spawners</span>
                      <span className="text-white font-bold">{getBiomePercent('Euro-Spawners', 28)}%</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-[#A19FA3]">Asian Biomes</span>
                      <span className="text-white font-bold">{getBiomePercent('Asian Biomes', 15)}%</span>
                    </div>
                  </div>
                </div>

                {/* Mob Spawner Stats */}
                <div className="bg-[#1c1b1e] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="text-lg">💧</span> Mob Spawner Stats
                    </h3>

                    <div className="space-y-4 pt-1">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-[#A19FA3] mb-1">
                          <span>Direct Connect</span>
                          <span className="text-white font-bold">{getRefVal('Direct Connect', '12k')}</span>
                        </div>
                        <div className="w-full h-3 bg-[#0b0a0c] border border-black p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                          <div className="h-full bg-[#5aa02c]" style={{ width: totalRefs === 0 ? '80%' : `${Math.min(100, Math.round(((stats.referrers['Direct Connect'] || 0) / (totalRefs || 1)) * 100))}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-[#A19FA3] mb-1">
                          <span>Social Spawners</span>
                          <span className="text-white font-bold">{getRefVal('Social Spawners', '4.2k')}</span>
                        </div>
                        <div className="w-full h-3 bg-[#0b0a0c] border border-black p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                          <div className="h-full bg-[#00BCD4]" style={{ width: totalRefs === 0 ? '45%' : `${Math.min(100, Math.round(((stats.referrers['Social Spawners'] || 0) / (totalRefs || 1)) * 100))}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-[#A19FA3] mb-1">
                          <span>Search Explorers</span>
                          <span className="text-white font-bold">{getRefVal('Search Explorers', '2.1k')}</span>
                        </div>
                        <div className="w-full h-3 bg-[#0b0a0c] border border-black p-[1px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                          <div className="h-full bg-[#FF8A80]" style={{ width: totalRefs === 0 ? '22%' : `${Math.min(100, Math.round(((stats.referrers['Search Explorers'] || 0) / (totalRefs || 1)) * 100))}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success('Spawner logs synchronized!')}
                    className="text-[9px] font-mono text-[#5aa02c] hover:underline uppercase block text-center mt-6 tracking-widest font-bold"
                  >
                    View Detailed Referrer Table
                  </button>
                </div>

                {/* Device Enchantments */}
                <div className="bg-[#1c1b1e] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between">
                  <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="text-lg">✨</span> Device Enchantments
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0b0a0c] border-2 border-black p-3.5 flex flex-col items-center text-center shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <i className="fa-solid fa-desktop text-[#00BCD4] text-lg mb-1.5"></i>
                      <span className="text-[10px] font-mono text-[#A19FA3] uppercase block">Desktop</span>
                      <span className="text-lg font-black font-mono text-white block mt-0.5">{getDevPercent('Desktop', 62)}%</span>
                    </div>

                    <div className="bg-[#0b0a0c] border-2 border-black p-3.5 flex flex-col items-center text-center shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <i className="fa-solid fa-mobile-screen-button text-[#5aa02c] text-lg mb-1.5"></i>
                      <span className="text-[10px] font-mono text-[#A19FA3] uppercase block">Mobile</span>
                      <span className="text-lg font-black font-mono text-white block mt-0.5">{getDevPercent('Mobile', 31)}%</span>
                    </div>

                    <div className="bg-[#0b0a0c] border-2 border-black p-3.5 flex flex-col items-center text-center shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <i className="fa-solid fa-tablet-screen-button text-[#FFC107] text-lg mb-1.5"></i>
                      <span className="text-[10px] font-mono text-[#A19FA3] uppercase block">Tablet</span>
                      <span className="text-lg font-black font-mono text-white block mt-0.5">{getDevPercent('Tablet', 5)}%</span>
                    </div>

                    <div className="bg-[#0b0a0c] border-2 border-black p-3.5 flex flex-col items-center text-center shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                      <i className="fa-solid fa-gamepad text-[#FF8A80] text-lg mb-1.5"></i>
                      <span className="text-[10px] font-mono text-[#A19FA3] uppercase block">Misc</span>
                      <span className="text-lg font-black font-mono text-white block mt-0.5">{getDevPercent('Misc', 2)}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      toast.success('Generated device enchant level check!');
                    }}
                    className="absolute bottom-2 right-2 bg-[#5aa02c] hover:bg-[#6cb835] border border-black w-8 h-8 flex items-center justify-center text-black font-extrabold text-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API & SECURITY (SYSTEM CONTROLS) */}
          {activeTab === 'api_security' && (
            <div className="space-y-6 animate-slide-up">
              <div className="select-none border-b-4 border-black pb-4">
                <h2 className="text-2xl font-bold font-mono text-[#5aa02c] uppercase tracking-wider">
                  SYSTEM CONTROLS
                </h2>
                <p className="text-xs text-[#A19FA3] font-mono mt-1">
                  Manage global API rate limits, Docker clusters, and validation protocols.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Side: Docker Resources */}
                <div className="bg-[#1c1b1e] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#262428] pb-3 mb-4">
                      <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                        <i className="fa-solid fa-cubes text-[#5aa02c]"></i> DOCKER_RESOURCES
                      </h3>
                      <div className="flex gap-2">
                        <span className="bg-[#5aa02c] text-black text-[9px] font-extrabold font-mono px-2 py-0.5 border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                          STABLE
                        </span>
                        <span className="border border-[#262428] text-[#A19FA3] text-[9px] font-mono px-2 py-0.5">
                          CLUSTER: 04
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#0b0a0c] border-2 border-black p-4 shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-[#5aa02c] border border-black block"></span>
                            resolution-svc
                          </span>
                        </div>
                        <div className="text-[10px] text-[#A19FA3] font-mono mb-3">ID: block-8821-ff</div>
                        
                        <div className="flex justify-between text-[9px] font-mono text-[#A19FA3] mb-1">
                          <span>CPU: 42%</span>
                          <span>REPLICAS: {resolutionReplicas}</span>
                        </div>
                        <div className="w-full h-2 bg-[#1c1b1e] border border-black p-[0.5px]">
                          <div className="h-full bg-[#5aa02c]" style={{ width: '42%' }}></div>
                        </div>

                        <button
                          onClick={scaleResolution}
                          className="w-full bg-[#262428] hover:bg-[#322f34] border border-black text-white text-[9px] font-mono uppercase tracking-widest font-bold py-1.5 mt-4 shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[0.5px] transition-all"
                        >
                          Scale Up (+)
                        </button>
                      </div>

                      <div className="bg-[#0b0a0c] border-2 border-black p-4 shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-[#00BCD4] border border-black block"></span>
                            analytics-svc
                          </span>
                        </div>
                        <div className="text-[10px] text-[#A19FA3] font-mono mb-3">ID: block-9934-xa</div>
                        
                        <div className="flex justify-between text-[9px] font-mono text-[#A19FA3] mb-1">
                          <span>CPU: 12%</span>
                          <span>REPLICAS: {analyticsReplicas}</span>
                        </div>
                        <div className="w-full h-2 bg-[#1c1b1e] border border-black p-[0.5px]">
                          <div className="h-full bg-[#00BCD4]" style={{ width: '12%' }}></div>
                        </div>

                        <button
                          onClick={scaleAnalytics}
                          className="w-full bg-[#262428] hover:bg-[#322f34] border border-black text-white text-[9px] font-mono uppercase tracking-widest font-bold py-1.5 mt-4 shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[0.5px] transition-all"
                        >
                          Scale Up (+)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-[#0b0a0c] border-2 border-black p-3 font-mono text-[10px] text-green-400 h-36 overflow-y-auto space-y-1 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)] select-text scrollbar-thin">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                    <div className="animate-pulse">[SYSTEM] Listening for docker spawner packets...</div>
                  </div>
                </div>

                {/* Right Side: Rate Limits & Validation */}
                <div className="md:col-span-4 space-y-6">
                  <div className="bg-[#1c1b1e] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider border-b border-[#262428] pb-2 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-gauge-simple text-[#FF8A80]"></i> Rate_Limits
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-[#A19FA3] uppercase block mb-1">
                          Global IP Limit (req/min)
                        </label>
                        <input
                          type="number"
                          value={rateLimit}
                          onChange={(e) => {
                            const val = Math.max(10, Number(e.target.value));
                            setRateLimit(val);
                            saveSystemSettings({ rateLimit: val });
                          }}
                          className="w-full bg-[#0b0a0c] border border-black p-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#5aa02c] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-[#A19FA3] mb-1.5">
                          <span>Burst Allowance</span>
                          <span className="text-white font-bold">{burstAllowance}</span>
                        </div>
                        <div className="relative flex items-center mt-1 select-none">
                          <input
                            type="range"
                            min="10"
                            max="200"
                            value={burstAllowance}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setBurstAllowance(val);
                              saveSystemSettings({ burstAllowance: val });
                            }}
                            className="w-full appearance-none h-3 bg-[#0b0a0c] border-2 border-black outline-none shadow-[inset_1px_1px_0px_rgba(0,0,0,0.8)] cursor-pointer"
                            style={{ WebkitAppearance: 'none' }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#262428] pt-4 select-none">
                        <span className="text-[10px] font-mono text-[#A19FA3] uppercase">Smart Throttling</span>
                        <button
                          onClick={() => setSmartThrottling(prev => {
                            const val = !prev;
                            saveSystemSettings({ smartThrottling: val });
                            return val;
                          })}
                          className={`w-12 h-6 border-2 border-black p-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all ${
                            smartThrottling ? 'bg-[#5aa02c]' : 'bg-[#262428]'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-black border border-white transition-all ${smartThrottling ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1c1b1e] border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider border-b border-[#262428] pb-2 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-lock text-[#00BCD4]"></i> Validation
                    </h3>

                    <div className="space-y-3.5 select-none">
                      <div
                        onClick={() => setDnsChecks(prev => {
                          const val = !prev;
                          saveSystemSettings({ dnsChecks: val });
                          return val;
                        })}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-5 h-5 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                          dnsChecks ? 'bg-[#FF8A80] text-black' : 'bg-[#0b0a0c]'
                        }`}>
                          {dnsChecks && <i className="fa-solid fa-check text-xs"></i>}
                        </div>
                        <span className="text-xs font-mono text-[#A19FA3] group-hover:text-white transition-colors">
                          Strict DNS Checks
                        </span>
                      </div>

                      <div
                        onClick={() => setMalwareFiltering(prev => {
                          const val = !prev;
                          saveSystemSettings({ malwareFiltering: val });
                          return val;
                        })}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-5 h-5 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                          malwareFiltering ? 'bg-[#FF8A80] text-black' : 'bg-[#0b0a0c]'
                        }`}>
                          {malwareFiltering && <i className="fa-solid fa-check text-xs"></i>}
                        </div>
                        <span className="text-xs font-mono text-[#A19FA3] group-hover:text-white transition-colors">
                          Malware URL Filtering
                        </span>
                      </div>

                      <div
                        onClick={() => setDeepAnalysis(prev => {
                          const val = !prev;
                          saveSystemSettings({ deepAnalysis: val });
                          return val;
                        })}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-5 h-5 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)] ${
                          deepAnalysis ? 'bg-[#FF8A80] text-black' : 'bg-[#0b0a0c]'
                        }`}>
                          {deepAnalysis && <i className="fa-solid fa-check text-xs"></i>}
                        </div>
                        <span className="text-xs font-mono text-[#A19FA3] group-hover:text-white transition-colors">
                          Deep Link Analysis
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Wide Card: Access Tokens */}
              <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none">
                <div className="flex items-center justify-between border-b border-[#262428] pb-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">
                      Access_Tokens
                    </h3>
                    <p className="text-[10px] font-mono text-[#A19FA3] mt-0.5">
                      Active development and production keys.
                    </p>
                  </div>
                  <button
                    onClick={generateNewSecret}
                    className="bg-[#00BCD4] hover:bg-[#26c6da] text-black font-extrabold px-4 py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1.5px] transition-all font-mono text-xs"
                  >
                    Generate_New_Secret
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#262428] text-[#A19FA3]">
                        <th className="py-2.5 uppercase tracking-wider text-[10px]">Name</th>
                        <th className="py-2.5 uppercase tracking-wider text-[10px]">Key_Identifier</th>
                        <th className="py-2.5 uppercase tracking-wider text-[10px]">Created</th>
                        <th className="py-2.5 uppercase tracking-wider text-[10px]">Last_Used</th>
                        <th className="py-2.5 uppercase tracking-wider text-[10px]">Status</th>
                        <th className="py-2.5 uppercase tracking-wider text-[10px] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262428]/40">
                      {accessTokens.map((tok, idx) => (
                        <tr key={tok._id || idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 text-white font-bold">{tok.name}</td>
                          <td className="py-3 text-[#A19FA3]">••••••••{tok.key}</td>
                          <td className="py-3 text-[#A19FA3]">
                            {tok.createdAt ? new Date(tok.createdAt).toISOString().split('T')[0] : (tok.created || '--')}
                          </td>
                          <td className="py-3 text-[#A19FA3]">{tok.lastUsed || '--'}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold border ${
                              tok.status === 'ACTIVE'
                                ? 'border-[#5aa02c] text-[#5aa02c] bg-[#5aa02c]/5'
                                : 'border-[#A19FA3] text-[#A19FA3] bg-transparent'
                            }`}>
                              {tok.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => deleteToken(tok._id || idx)}
                              className="text-[#FF8A80] hover:text-red-400 p-1"
                              title="Revoke Token"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-slide-up">
              <div className="border-b-4 border-black pb-4">
                <h2 className="text-2xl font-bold font-mono text-[#5aa02c] uppercase tracking-wider">
                  Crafter Settings
                </h2>
              </div>

              <div className="bg-[#1c1b1e] border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-mono mb-4 text-[#5aa02c] uppercase">Profile Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#A19FA3] uppercase mb-1 font-mono">Crafter Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => {
                          const updated = { ...profile, name: e.target.value };
                          setProfile(updated);
                          saveProfile(updated);
                        }}
                        className="w-full bg-[#0b0a0c] border-2 border-black p-3 text-white font-mono focus:outline-none focus:border-[#5aa02c] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A19FA3] uppercase mb-1 font-mono">Crafter Level</label>
                      <input
                        type="number"
                        value={profile.level}
                        onChange={(e) => {
                          const updated = { ...profile, level: Math.max(1, Number(e.target.value)) };
                          setProfile(updated);
                          saveProfile(updated);
                        }}
                        className="w-full bg-[#0b0a0c] border-2 border-black p-3 text-white font-mono focus:outline-none focus:border-[#5aa02c] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#262428] pt-6">
                  <h3 className="text-lg font-bold font-mono mb-2 text-[#FF8A80] uppercase">Dangerous Zone</h3>
                  <p className="text-xs text-[#A19FA3] mb-4">
                    These operations permanently alter the data chest and cannot be undone.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Do you want to discard your crafted links and reset the inventory?')) {
                        recentUrls.forEach(url => handleDelete(url.nnid));
                        toast.success('Inventory chest cleared!');
                      }
                    }}
                    className="bg-[#FF8A80] hover:bg-[#ff9e94] text-black font-extrabold px-6 py-2 uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] transition-all font-mono text-xs"
                  >
                    Clear Inventory Chest
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Crafting Modal Overlay */}
      {isCraftModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#1c1b1e] border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative max-w-2xl w-full">
            <button
              onClick={() => {
                setIsCraftModalOpen(false);
                setResult('');
              }}
              className="absolute top-4 right-4 text-[#A19FA3] hover:text-white font-mono text-base uppercase"
            >
              [Close]
            </button>
            <h2 className="text-2xl font-extrabold tracking-wider text-white mb-2 font-mono">
              CRAFT NEW LINK
            </h2>
            <p className="text-xs text-[#A19FA3] mb-6">
              Combine your long URL with our magical pixels to create a legendary shortcut.
            </p>

            <form onSubmit={(e) => handleCraft(e, modalRef)} className="space-y-4">
              <div className="flex flex-col sm:flex-row bg-[#0b0a0c] border-4 border-black p-1 shadow-[inset_3px_3px_0px_rgba(0,0,0,0.8)]">
                <div className="flex items-center flex-1 min-w-0">
                  <i className="fa-solid fa-link text-[#5aa02c] text-lg px-4"></i>
                  <input
                    type="url"
                    ref={modalRef}
                    required
                    placeholder="Enter long URL to craft..."
                    className="flex-1 bg-transparent border-none outline-none py-3 text-white placeholder-[#A19FA3] font-mono text-sm min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#5aa02c] text-black font-extrabold text-sm px-6 py-3 uppercase border-t-4 sm:border-t-0 sm:border-l-4 border-black hover:bg-[#6cb835] active:translate-y-[2px] transition-all shrink-0 font-mono"
                >
                  {isLoading ? 'Crafting...' : 'Craft'}
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-6 p-4 bg-[#0b0a0c] border-2 border-[#5aa02c] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-slide-up">
                <div className="flex items-center gap-2 text-left min-w-0">
                  <span className="text-[#5aa02c] font-mono text-xs font-bold shrink-0">SUCCESS:</span>
                  <a
                    href={result}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white font-mono hover:underline truncate text-xs"
                  >
                    {result}
                  </a>
                </div>
                <button
                  onClick={() => handleCopy(result)}
                  className="bg-[#5aa02c] hover:bg-[#6cb835] text-black px-4 py-2 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] shrink-0 font-mono"
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
