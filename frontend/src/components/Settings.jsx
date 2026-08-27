import React, { useState } from 'react';
import { Save, Shield, Bell, Terminal } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('threat');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl font-mono">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-100 tracking-tight flex items-center gap-3">
            <Terminal className="text-cyan-400" />
            SYS_CONFIG
          </h1>
          <p className="text-gray-400 mt-1 text-sm tracking-wide">Configure threat detection parameters and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('threat')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'threat' 
                ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                : 'text-gray-500 hover:bg-gray-800/50 hover:text-cyan-300 border border-transparent'
            }`}
          >
            <Shield size={16} /> ENGINE_CFG
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'alerts' 
                ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                : 'text-gray-500 hover:bg-gray-800/50 hover:text-cyan-300 border border-transparent'
            }`}
          >
            <Bell size={16} /> ALERTS_CFG
          </button>
        </div>

        {/* Settings Form area */}
        <div className="col-span-1 md:col-span-3">
          <form onSubmit={handleSave} className="bg-[#111827]/80 backdrop-blur-sm rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] p-8">
            
            {activeTab === 'threat' && (
              <>
                <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">Threat Detection Weights</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">
                      Velocity_Threshold_Weight
                    </label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                      <span className="text-sm font-bold text-cyan-400 w-8">0.3</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">
                      Unrecognized_Device_Weight
                    </label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                      <span className="text-sm font-bold text-cyan-400 w-8">0.2</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase">
                      Geolocation_Delta_Weight
                    </label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                      <span className="text-sm font-bold text-cyan-400 w-8">0.3</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-4">Machine Learning Subsystem</h3>
                    <div className="flex items-center justify-between bg-[#0d131f] p-4 rounded-xl border border-gray-800">
                      <div>
                        <p className="font-bold text-gray-200 uppercase text-xs tracking-wider">Isolation Forest Anomaly Detection</p>
                        <p className="text-xs text-gray-500 mt-1">Enable AI-based behavioral scoring.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-white peer-checked:shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'alerts' && (
              <>
                <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">Notification Protocols</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-200 uppercase text-xs tracking-wider">SMTP_Relay</p>
                      <p className="text-xs text-gray-500 mt-1">Send critical alerts instantly via email.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-white peer-checked:shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-200 uppercase text-xs tracking-wider">SMS_Gateway</p>
                      <p className="text-xs text-gray-500 mt-1">Receive text messages for High Severity incidents.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gray-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-white peer-checked:shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest text-gray-400 mb-2 uppercase mt-4">
                      DISTRIBUTION_LIST
                    </label>
                    <input type="email" defaultValue="security-team@campus.edu" className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-cyan-400 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-end gap-4">
              {saved && <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest animate-pulse">Changes_Committed</span>}
              <button type="submit" className="flex items-center gap-2 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-400 px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all">
                <Save size={16} /> WRITE_CFG
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
