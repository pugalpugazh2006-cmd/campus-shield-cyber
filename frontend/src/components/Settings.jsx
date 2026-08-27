import React, { useState } from 'react';
import { Save, Shield, Bell } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('threat');

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
          <button 
            onClick={() => setActiveTab('threat')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-lg transition-colors ${
              activeTab === 'threat' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield size={18} /> Threat Detection
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold rounded-lg transition-colors ${
              activeTab === 'alerts' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell size={18} /> Alerts & Notifications
          </button>
        </div>

        {/* Settings Form area */}
        <div className="col-span-1 md:col-span-3">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            
            {activeTab === 'threat' && (
              <>
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
              </>
            )}

            {activeTab === 'alerts' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Alert Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Send critical alerts instantly via email.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-500">Receive text messages for High Severity incidents.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">
                      Alert Distribution Email Address
                    </label>
                    <input type="email" defaultValue="security-team@campus.edu" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </>
            )}

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
