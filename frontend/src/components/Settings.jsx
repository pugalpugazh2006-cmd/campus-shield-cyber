import React, { useState } from 'react';
import { Save, Shield, Bell, Key, Database } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure threat detection parameters and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg transition-colors">
            <Shield size={18} /> Threat Detection
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={18} /> Alerts & Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
            <Key size={18} /> API Keys
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
            <Database size={18} /> Database Backup
          </button>
        </div>

        {/* Settings Form area */}
        <div className="col-span-1 md:col-span-3">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Threat Detection Weights</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Failed Login Attempts Weight
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <span className="text-sm font-bold text-gray-900 w-8">0.3</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Weight applied when a user triggers the brute-force velocity threshold.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Device Flag Weight
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <span className="text-sm font-bold text-gray-900 w-8">0.2</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Weight applied when the IP or User-Agent does not match historical records.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Geolocation Distance Weight
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <span className="text-sm font-bold text-gray-900 w-8">0.3</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Machine Learning Engine</h3>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">Isolation Forest Anomaly Detection</p>
                    <p className="text-sm text-gray-500">Enable AI-based behavioral scoring.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
              {saved && <span className="text-sm font-semibold text-green-600">Settings saved successfully!</span>}
              <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-colors">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
