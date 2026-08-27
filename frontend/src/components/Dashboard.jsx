import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, UserCheck, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Security Overview</h1>
          <p className="text-gray-500 mt-1">Monitor campus network activity and threats</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"><ArrowUpRight size={16} /> 12%</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Logins (24h)</p>
            <p className="text-3xl font-black text-gray-900">1,248</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <ShieldAlert size={24} />
            </div>
            <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full"><ArrowUpRight size={16} /> 2</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Alerts</p>
            <p className="text-3xl font-black text-gray-900">12</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"><ArrowDownRight size={16} /> 1</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">High Risk Users</p>
            <p className="text-3xl font-black text-gray-900">3</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck size={24} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Trusted Devices</p>
            <p className="text-3xl font-black text-gray-900">892</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Average Risk Score Over Time</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" stroke="#9ca3af" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#9ca3af" domain={[0, 1]} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="riskScore" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alert Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Live Alert Feed</h2>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="p-4 border border-red-100 bg-red-50/50 rounded-xl">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-red-700">High Risk Login</p>
                <span className="text-xs font-medium text-red-500">Just now</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">john.doe@campus.edu</p>
              <p className="text-xs text-gray-500 mt-2">Hybrid Score: 0.85</p>
            </div>
            
            <div className="p-4 border border-orange-100 bg-orange-50/50 rounded-xl">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-orange-700">Unrecognized Device</p>
                <span className="text-xs font-medium text-orange-500">5m ago</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">admin@campus.edu</p>
              <p className="text-xs text-gray-500 mt-2">IP: 198.51.100.23</p>
            </div>
            
            <div className="p-4 border border-red-100 bg-red-50/50 rounded-xl">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-red-700">Brute Force</p>
                <span className="text-xs font-medium text-red-500">12m ago</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">victim_402@campus.edu</p>
              <p className="text-xs text-gray-500 mt-2">6 failed attempts in 10m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
