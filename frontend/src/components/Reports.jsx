import React from 'react';
import { Terminal } from 'lucide-react';

const mockLogs = [
  { id: 101, action: 'LOGIN_SUCCESS', user: 'admin@campus.edu', ip: '192.168.1.50', time: '2026-08-27 10:45:12' },
  { id: 102, action: 'LOGIN_FAILED', user: 'jane.smith@campus.edu', ip: '203.0.113.42', time: '2026-08-27 10:42:05' },
  { id: 103, action: 'USER_REGISTERED', user: 'new.student@campus.edu', ip: '198.51.100.12', time: '2026-08-27 09:15:33' },
  { id: 104, action: 'LOGIN_FAILED', user: 'freshman_24@campus.edu', ip: '198.51.100.44', time: '2026-08-27 08:30:11' },
  { id: 105, action: 'PASSWORD_RESET', user: 'faculty_math@campus.edu', ip: '192.168.1.15', time: '2026-08-26 14:22:19' },
  { id: 106, action: 'VPN_CONNECTED', user: 'research_lead@campus.edu', ip: '203.0.113.99', time: '2026-08-26 11:05:44' },
  { id: 107, action: 'SESSION_EXPIRED', user: 'guest_user_99@campus.edu', ip: '198.51.100.12', time: '2026-08-25 18:45:00' },
  { id: 108, action: 'LOGIN_SUCCESS', user: 'admin@campus.edu', ip: '192.168.1.50', time: '2026-08-25 09:00:00' },
];

export default function Reports() {
  const handleExportCSV = () => {
    // Convert array of objects to CSV string
    const headers = ['ID', 'Action', 'User', 'IP Address', 'Timestamp'];
    const csvRows = [
      headers.join(','),
      ...mockLogs.map(log => `${log.id},${log.action},${log.user},${log.ip},${log.time}`)
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    
    // Create a downloadable link and click it programmatically
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "campus_shield_audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="font-mono">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-100 tracking-tight flex items-center gap-3">
            <Terminal className="text-emerald-500" />
            SYS_AUDIT_LOGS
          </h1>
          <p className="text-gray-400 mt-1 text-sm tracking-wide">Raw system event stream</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-400 font-bold py-2 px-4 rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-[#111827]/80 backdrop-blur-sm rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="p-4 bg-[#0d131f] border-b border-gray-800 flex justify-between items-center">
          <span className="text-cyan-500/70 text-xs tracking-widest uppercase">/var/log/syslog</span>
          <input type="text" placeholder="Grep logs..." className="text-sm px-3 py-1 bg-gray-900 border border-gray-700 text-gray-300 rounded focus:outline-none focus:border-cyan-500" />
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-xs tracking-widest text-cyan-500/70 bg-[#0d131f]">
              <th className="p-4">TIMESTAMP</th>
              <th className="p-4">ACTION</th>
              <th className="p-4">USER</th>
              <th className="p-4">IP_ADDRESS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-800/30 transition-colors text-sm">
                <td className="p-4 text-emerald-500/80">{log.time}</td>
                <td className={`p-4 font-bold ${log.action.includes('FAILED') ? 'text-rose-500' : 'text-cyan-400'}`}>{log.action}</td>
                <td className="p-4 text-gray-300">{log.user}</td>
                <td className="p-4 text-amber-500/80">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
