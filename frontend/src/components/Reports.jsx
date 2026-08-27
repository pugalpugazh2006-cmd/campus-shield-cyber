import React from 'react';

const mockLogs = [
  { id: 101, action: 'login_success', user: 'admin@campus.edu', ip: '192.168.1.50', time: '2026-08-27 10:45:12' },
  { id: 102, action: 'login_failed', user: 'jane.smith@campus.edu', ip: '203.0.113.42', time: '2026-08-27 10:42:05' },
  { id: 103, action: 'user_registered', user: 'new.student@campus.edu', ip: '198.51.100.12', time: '2026-08-27 09:15:33' },
];

export default function Reports() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports & Audit Logs</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 flex justify-between">
          <span>System Audit Log</span>
          <input type="text" placeholder="Search logs..." className="text-sm px-3 py-1 border rounded" />
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600">Timestamp</th>
              <th className="p-4 font-semibold text-gray-600">Action</th>
              <th className="p-4 font-semibold text-gray-600">User</th>
              <th className="p-4 font-semibold text-gray-600">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 font-mono text-sm">
                <td className="p-4 text-gray-500">{log.time}</td>
                <td className="p-4 text-blue-600">{log.action}</td>
                <td className="p-4 text-gray-700">{log.user}</td>
                <td className="p-4 text-gray-500">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
