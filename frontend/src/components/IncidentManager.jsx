import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Filter, Terminal, Activity, ArrowRight, ActivityIcon, Eye } from 'lucide-react';
import api from '../services/api';

export default function IncidentManager() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = () => {
    setLoading(true);
    api.get('/incidents/')
      .then(res => {
        setIncidents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-rose-950/50 text-rose-400 border-rose-900 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
      case 'investigating': return 'bg-amber-950/50 text-amber-400 border-amber-900 shadow-[0_0_8px_rgba(251,191,36,0.3)]';
      case 'resolved': return 'bg-emerald-950/50 text-emerald-400 border-emerald-900 shadow-[0_0_8px_rgba(52,211,153,0.3)]';
      default: return 'bg-gray-900 text-gray-400 border-gray-700';
    }
  };

  const getSeverityBadge = (severity) => {
    if (severity.toLowerCase() === 'critical') return 'bg-purple-950/80 text-purple-400 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.4)] animate-pulse';
    if (severity.toLowerCase() === 'high') return 'bg-rose-950/80 text-rose-400 border border-rose-500/50';
    if (severity.toLowerCase() === 'medium') return 'bg-amber-950/80 text-amber-400 border border-amber-500/50';
    return 'bg-blue-950/80 text-blue-400 border border-blue-500/50';
  };

  const updateStatus = (id, newStatus) => {
    api.patch(`/incidents/${id}/status`, { status: newStatus })
      .then(() => fetchIncidents())
      .catch(err => console.error(err));
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Target User ID', 'Severity', 'Status', 'Time', 'Correlation ID'];
    const csvRows = [
      headers.join(','),
      ...incidents.map(inc => `${inc.id},${inc.type},${inc.user_id},${inc.severity},${inc.status},${inc.created_at},${inc.correlation_id}`)
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

  const viewDetails = (id) => {
    api.get(`/incidents/${id}`)
      .then(res => setSelectedIncident(res.data))
      .catch(err => console.error(err));
  };

  if (loading) return <div className="text-cyan-500 font-mono">LOADING_INCIDENTS...</div>;

  return (
    <div className="font-mono space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500 tracking-tight flex items-center gap-3">
            INCIDENT_RESPONSE
          </h1>
          <p className="text-gray-400 mt-1 text-sm tracking-wide">Review correlated alerts and investigate timelines</p>
        </div>
      </div>
      
      {/* Modal for details */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0d131f] border border-gray-700 p-6 rounded-xl w-full max-w-3xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <h2 className="text-xl text-rose-500 font-bold mb-4">INCIDENT_INVESTIGATION_VIEW</h2>
            <p className="text-gray-400 mb-2">Target User ID: {selectedIncident.user_id}</p>
            <p className="text-gray-400 mb-6">Status: <span className="text-white">{selectedIncident.incident.status}</span></p>
            
            <h3 className="text-sm text-cyan-500 mb-2">ALERTS INCLUDED IN CORRELATION</h3>
            <div className="space-y-2 mb-6">
              {selectedIncident.alerts.map(a => (
                <div key={a.id} className="p-3 bg-gray-900 border border-gray-800 rounded">
                  <p className="text-xs text-rose-400 font-bold">{a.type} <span className="text-gray-500 font-normal">- {new Date(a.timestamp).toLocaleString()}</span></p>
                  <p className="text-sm text-gray-300 mt-1">{a.description}</p>
                </div>
              ))}
            </div>
            
            <h3 className="text-sm text-amber-500 mb-2">INVESTIGATION TIMELINE</h3>
            <div className="space-y-2 mb-6">
              {selectedIncident.incident.timeline.map((t, i) => (
                <div key={i} className="flex gap-4 items-start text-sm">
                  <span className="text-gray-500 w-32">{new Date(t.time).toLocaleTimeString()}</span>
                  <span className="text-gray-300">{t.action} ({t.actor})</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-800">
              <button onClick={() => setSelectedIncident(null)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}

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
                <th className="px-6 py-4">PRIMARY_ALERT</th>
                <th className="px-6 py-4">CORRELATION_ID</th>
                <th className="px-6 py-4">SEVERITY</th>
                <th className="px-6 py-4">TIMESTAMP</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {incidents.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">NO INCIDENTS FOUND</td></tr>
              ) : incidents.map((incident) => (
                <tr key={incident.id} className="bg-transparent hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${
                        incident.severity.toLowerCase() === 'critical' ? 'bg-purple-950/30 text-purple-500 border-purple-900/50' :
                        incident.severity.toLowerCase() === 'high' ? 'bg-rose-950/30 text-rose-500 border-rose-900/50' :
                        incident.severity.toLowerCase() === 'medium' ? 'bg-amber-950/30 text-amber-500 border-amber-900/50' :
                        'bg-blue-950/30 text-blue-500 border-blue-900/50'
                      }`}>
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-200 block">{incident.type}</span>
                        <span className="text-xs text-gray-500">User ID: {incident.user_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-mono">{incident.correlation_id.substring(0,8)}...</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest ${getSeverityBadge(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{new Date(incident.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-widest border ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                    <button onClick={() => viewDetails(incident.id)} className="text-cyan-500 hover:text-cyan-300 p-2">
                        <Eye size={16} />
                    </button>
                    <select 
                      className="text-xs border border-gray-700 rounded bg-gray-900 p-1.5 text-gray-300 hover:border-cyan-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
                      value={incident.status}
                      onChange={(e) => updateStatus(incident.id, e.target.value)}
                    >
                      <option value="open">Set Open</option>
                      <option value="investigating">Set Investigating</option>
                      <option value="resolved">Set Resolved</option>
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
