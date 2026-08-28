import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, UserCheck, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight, Terminal } from 'lucide-react';

const mockData = [
  { time: '10:00', riskScore: 0.1 },
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [liveFeed, setLiveFeed] = useState([]);
  const [chartData, setChartData] = useState([
    { time: '08:00', riskScore: 20 },
    { time: '09:00', riskScore: 25 },
    { time: '10:00', riskScore: 15 },
    { time: '11:00', riskScore: 40 },
    { time: '12:00', riskScore: 30 },
    { time: '13:00', riskScore: 65 },
    { time: '14:00', riskScore: 85 },
  ]);

  useEffect(() => {
    // Fetch initial stats
    api.get('/analytics/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

    api.get('/analytics/live-feed?limit=5')
      .then(res => setLiveFeed(res.data))
      .catch(err => console.error(err));

    // WebSocket connection
    const token = localStorage.getItem('token');
    // For local dev, hardcode ws://localhost:8000. In production, determine dynamically.
    const ws = new WebSocket(`ws://localhost:8000/api/websockets/ws?token=${token}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ALERT') {
        setLiveFeed(prev => [data, ...prev].slice(0, 10));
        // You could also update stats dynamically here
      }
    };

    return () => ws.close();
  }, []);

  if (!stats) return <div className="text-cyan-500 font-mono">LOADING_SOC_DASHBOARD...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono tracking-tight">
            SOC_OVERVIEW
          </h1>
          <p className="text-gray-400 font-mono text-sm mt-1 flex items-center">
            <Activity size={14} className="mr-2 text-cyan-500" />
            SYSTEM_STATUS: <span className="text-emerald-400 ml-1">ONLINE</span>
          </p>
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-cyan-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -z-10 group-hover:bg-cyan-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-950/50 border border-cyan-900 text-cyan-400 rounded-xl shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <Activity size={20} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Events</p>
            <p className="text-3xl font-black text-gray-100">{stats.stats.total_events}</p>
          </div>
        </div>
        
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-rose-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full -z-10 group-hover:bg-rose-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-950/50 border border-rose-900 text-rose-400 rounded-xl shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Incidents</p>
            <p className="text-3xl font-black text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">{stats.stats.open_incidents}</p>
          </div>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-amber-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full -z-10 group-hover:bg-amber-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-950/50 border border-amber-900 text-amber-400 rounded-xl shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <AlertCircle size={20} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Critical/High Alerts</p>
            <p className="text-3xl font-black text-gray-100">{stats.severity.critical + stats.severity.high}</p>
          </div>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-emerald-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-950/50 border border-emerald-900 text-emerald-400 rounded-xl shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              <UserCheck size={20} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Resolved</p>
            <p className="text-3xl font-black text-gray-100">{stats.stats.resolved_incidents}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="xl:col-span-2 bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <h2 className="text-sm font-mono text-cyan-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity size={16} /> Avg_Risk_Score_History
          </h2>
          <div className="h-80 w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#4b5563" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                <YAxis stroke="#4b5563" domain={[0, 100]} axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d131f', border: '1px solid #1f2937', borderRadius: '8px', color: '#e5e7eb', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Line type="stepAfter" dataKey="riskScore" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4, fill: '#0a0e17', stroke: '#22d3ee', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#22d3ee' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alert Feed */}
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col font-mono">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={16} /> LIVE_ALERTS
            </h2>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {liveFeed.length === 0 ? (
                <p className="text-xs text-gray-500">NO_ACTIVE_ALERTS</p>
            ) : (
                liveFeed.map((alert, i) => (
                    <div key={i} className={`p-4 border-l-2 ${alert.severity === 'critical' ? 'border-purple-500 bg-purple-950/30' : alert.severity === 'high' ? 'border-rose-500 bg-rose-950/30' : 'border-amber-500 bg-amber-950/30'} rounded-r-lg`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-xs font-bold ${alert.severity === 'critical' ? 'text-purple-400' : alert.severity === 'high' ? 'text-rose-400' : 'text-amber-400'}`}>{alert.type || alert.alert_type}</p>
                        <span className="text-[10px] text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-gray-300 truncate">{alert.description}</p>
                      <p className="text-xs text-cyan-500/70 mt-2">CORRELATION_ID: {alert.correlation_id?.substring(0, 8)}</p>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
