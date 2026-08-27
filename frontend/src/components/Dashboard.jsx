import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, UserCheck, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight, Terminal } from 'lucide-react';

const mockData = [
  { time: '10:00', riskScore: 0.1 },
  { time: '11:00', riskScore: 0.2 },
  { time: '12:00', riskScore: 0.15 },
  { time: '13:00', riskScore: 0.8 },
  { time: '14:00', riskScore: 0.3 },
  { time: '15:00', riskScore: 0.2 },
];

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-100 tracking-tight flex items-center gap-3">
            <Terminal className="text-cyan-400" />
            SECURITY_OVERVIEW
          </h1>
          <p className="text-gray-400 mt-1 font-mono text-sm uppercase tracking-wide">Monitor campus network activity and threats</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-mono">
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-cyan-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -z-10 group-hover:bg-cyan-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-950/50 border border-cyan-900 text-cyan-400 rounded-xl shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <Activity size={20} />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-2 py-1 rounded"><ArrowUpRight size={14} className="mr-1" /> 12%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Logins (24h)</p>
            <p className="text-3xl font-black text-gray-100">1,248</p>
          </div>
        </div>
        
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-rose-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full -z-10 group-hover:bg-rose-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-950/50 border border-rose-900 text-rose-400 rounded-xl shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse">
              <ShieldAlert size={20} />
            </div>
            <span className="flex items-center text-xs font-medium text-rose-400 bg-rose-950/50 border border-rose-900 px-2 py-1 rounded"><ArrowUpRight size={14} className="mr-1" /> 2</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Alerts</p>
            <p className="text-3xl font-black text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">12</p>
          </div>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-amber-800/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full -z-10 group-hover:bg-amber-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-950/50 border border-amber-900 text-amber-400 rounded-xl shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <AlertCircle size={20} />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-2 py-1 rounded"><ArrowDownRight size={14} className="mr-1" /> 1</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">High Risk Users</p>
            <p className="text-3xl font-black text-gray-100">3</p>
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
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Trusted Devices</p>
            <p className="text-3xl font-black text-gray-100">892</p>
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
              <LineChart data={mockData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#4b5563" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                <YAxis stroke="#4b5563" domain={[0, 1]} axisLine={false} tickLine={false} fontSize={12} />
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
            <div className="p-4 border-l-2 border-rose-500 bg-rose-950/30 rounded-r-lg">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold text-rose-400">HIGH_RISK_LOGIN</p>
                <span className="text-[10px] text-gray-500">T-00:00:05</span>
              </div>
              <p className="text-xs text-gray-300">john.doe@campus.edu</p>
              <p className="text-xs text-rose-500/70 mt-2">HYBRID_SCORE: 0.85</p>
            </div>
            
            <div className="p-4 border-l-2 border-amber-500 bg-amber-950/30 rounded-r-lg">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold text-amber-400">UNRECOGNIZED_DEVICE</p>
                <span className="text-[10px] text-gray-500">T-00:05:23</span>
              </div>
              <p className="text-xs text-gray-300">admin@campus.edu</p>
              <p className="text-xs text-amber-500/70 mt-2">IP: 198.51.100.23</p>
            </div>
            
            <div className="p-4 border-l-2 border-rose-500 bg-rose-950/30 rounded-r-lg">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold text-rose-400">BRUTE_FORCE_DETECTED</p>
                <span className="text-[10px] text-gray-500">T-00:12:45</span>
              </div>
              <p className="text-xs text-gray-300">victim_402@campus.edu</p>
              <p className="text-xs text-rose-500/70 mt-2">ERR_COUNT: 6/10m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
