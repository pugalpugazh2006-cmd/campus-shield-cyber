import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Terminal } from 'lucide-react';

const initialIncidents = [
  { id: 1, type: 'Brute Force', user: 'jane.smith@campus.edu', severity: 'High', status: 'Open', time: '10:45 AM' },
  { id: 2, type: 'High Risk Login', user: 'john.doe@campus.edu', severity: 'Critical', status: 'Investigating', time: '09:12 AM' },
  { id: 3, type: 'New Device', user: 'admin@campus.edu', severity: 'Medium', status: 'Resolved', time: 'Yesterday' },
];

export default function IncidentManager() {
  const [incidents, setIncidents] = useState(initialIncidents);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-rose-950/50 text-rose-400 border-rose-900 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
      case 'Investigating': return 'bg-amber-950/50 text-amber-400 border-amber-900 shadow-[0_0_8px_rgba(251,191,36,0.3)]';
      case 'Resolved': return 'bg-emerald-950/50 text-emerald-400 border-emerald-900 shadow-[0_0_8px_rgba(52,211,153,0.3)]';
      default: return 'bg-gray-900 text-gray-400 border-gray-700';
    }
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'Critical') return 'bg-rose-950/80 text-rose-400 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse';
    if (severity === 'High') return 'bg-orange-950/80 text-orange-400 border border-orange-500/50';
    return 'bg-amber-950/80 text-amber-400 border border-amber-500/50';
  };

  const updateStatus = (id, newStatus) => {
    setIncidents(incidents.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'User/Target', 'Severity', 'Status', 'Time'];
    const csvRows = [
      headers.join(','),
      ...incidents.map(inc => `${inc.id},${inc.type},${inc.user},${inc.severity},${inc.status},${inc.time}`)
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "campus_shield_incidents.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="font-mono">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-100 tracking-tight flex items-center gap-3">
            <Terminal className="text-rose-500" />
            INCIDENT_RESPONSE
          </h1>
          <p className="text-gray-400 mt-1 text-sm tracking-wide">Review and resolve security alerts</p>
        </div>
      </div>
      
      <div className="bg-[#111827]/80 backdrop-blur-sm rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-800 bg-[#0d131f] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50" size={18} />
            <input 
              type="text" 
              placeholder="Search incidents or users..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-shadow"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 hover:text-cyan-400 hover:border-cyan-900 transition-colors w-full sm:w-auto">
              <Filter size={16} /> Filter
            </button>
            <button 
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded-lg text-sm font-bold hover:bg-cyan-900 hover:text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all w-full sm:w-auto"
            >
               Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#0d131f] border-b border-gray-800 text-xs tracking-widest text-cyan-500/70">
                <th className="px-6 py-4">ALERT_TYPE</th>
                <th className="px-6 py-4">TARGET_USER</th>
                <th className="px-6 py-4">SEVERITY</th>
                <th className="px-6 py-4">TIMESTAMP</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {incidents.map((incident) => (
                <tr key={incident.id} className="bg-transparent hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${incident.severity === 'Critical' ? 'bg-rose-950/30 text-rose-500 border-rose-900/50' : 'bg-orange-950/30 text-orange-500 border-orange-900/50'}`}>
                        <ShieldAlert size={18} />
                      </div>
                      <span className="font-bold text-gray-200">{incident.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{incident.user}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest ${getSeverityBadge(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{incident.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest border ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="text-xs border border-gray-700 rounded bg-gray-900 p-1.5 text-gray-300 hover:border-cyan-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
                      value={incident.status}
                      onChange={(e) => updateStatus(incident.id, e.target.value)}
                    >
                      <option value="Open">Set Open</option>
                      <option value="Investigating">Set Investigating</option>
                      <option value="Resolved">Set Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
