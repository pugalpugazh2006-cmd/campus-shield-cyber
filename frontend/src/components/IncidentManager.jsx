import React, { useState } from 'react';
import { Search, Filter, ShieldAlert } from 'lucide-react';

const initialIncidents = [
  { id: 1, type: 'Brute Force', user: 'jane.smith@campus.edu', severity: 'High', status: 'Open', time: '10:45 AM' },
  { id: 2, type: 'High Risk Login', user: 'john.doe@campus.edu', severity: 'Critical', status: 'Investigating', time: '09:12 AM' },
  { id: 3, type: 'New Device', user: 'admin@campus.edu', severity: 'Medium', status: 'Resolved', time: 'Yesterday' },
];

export default function IncidentManager() {
  const [incidents, setIncidents] = useState(initialIncidents);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-700 border-red-200';
      case 'Investigating': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'Critical') return 'bg-red-50 text-red-700 border border-red-200';
    if (severity === 'High') return 'bg-orange-50 text-orange-700 border border-orange-200';
    return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
  };

  const updateStatus = (id, newStatus) => {
    setIncidents(incidents.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Incident Management</h1>
          <p className="text-gray-500 mt-1">Review and resolve security alerts</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search incidents or users..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto">
               Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Alert Type</th>
                <th className="px-6 py-4">User / Target</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Detected At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incidents.map((incident) => (
                <tr key={incident.id} className="bg-white hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${incident.severity === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        <ShieldAlert size={18} />
                      </div>
                      <span className="font-bold text-gray-900">{incident.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{incident.user}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getSeverityBadge(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm font-medium">{incident.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="text-sm border border-gray-200 rounded-lg p-2 font-medium text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer"
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
