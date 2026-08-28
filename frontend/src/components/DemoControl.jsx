import React, { useState } from 'react';
import { Play, ShieldAlert, Target, Shield, ServerCrash, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function DemoControl() {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState('');

  const triggerScenario = async (scenario) => {
    setLoading(scenario);
    setMessage('');
    try {
      const res = await api.post(`/security/demo/${scenario}`);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error triggering scenario.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-mono">
      <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight flex items-center gap-3">
            HACKATHON_DEMO_CONTROL
          </h1>
          <p className="text-gray-400 mt-1 text-sm tracking-wide">Trigger live scenarios to demonstrate CampusShield 2.0 capabilities</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-900 text-emerald-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario 1: Normal Login */}
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-emerald-800/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4 text-emerald-500">
              <Shield size={24} />
              <h2 className="text-xl font-bold">1. Normal Activity Baseline</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Simulates a trusted user logging in from their usual device, city, and at a normal time.
              This establishes the <strong className="text-gray-200">UBA (User Behavior Analytics)</strong> baseline.
              Expect: Low risk score, no alerts.
            </p>
          </div>
          <button 
            onClick={() => triggerScenario('normal_login')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-emerald-950 border border-emerald-900 text-emerald-400 py-3 rounded-lg hover:bg-emerald-900 transition-colors font-bold disabled:opacity-50"
          >
            {loading === 'normal_login' ? 'Simulating...' : <><Play size={16} /> Execute Scenario 1</>}
          </button>
        </div>

        {/* Scenario 2: Brute Force */}
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-amber-800/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4 text-amber-500">
              <ServerCrash size={24} />
              <h2 className="text-xl font-bold">2. Brute Force Attack</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Simulates a bot making 6 rapid failed login attempts from a Moscow IP address.
              Expect: High risk score, rule-based brute force alert triggered immediately on Live Feed.
            </p>
          </div>
          <button 
            onClick={() => triggerScenario('brute_force')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-amber-950 border border-amber-900 text-amber-400 py-3 rounded-lg hover:bg-amber-900 transition-colors font-bold disabled:opacity-50"
          >
            {loading === 'brute_force' ? 'Simulating...' : <><Play size={16} /> Execute Scenario 2</>}
          </button>
        </div>

        {/* Scenario 3: UBA Anomaly */}
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-orange-800/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4 text-orange-500">
              <Target size={24} />
              <h2 className="text-xl font-bold">3. Impossible Travel (UBA Anomaly)</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Simulates a successful login from Beijing immediately after a normal login in India.
              The ML Isolation Forest model and UBA engine will detect the location and device deviation.
              Expect: High risk score, UBA deviation alert.
            </p>
          </div>
          <button 
            onClick={() => triggerScenario('unusual_location')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-orange-950 border border-orange-900 text-orange-400 py-3 rounded-lg hover:bg-orange-900 transition-colors font-bold disabled:opacity-50"
          >
            {loading === 'unusual_location' ? 'Simulating...' : <><Play size={16} /> Execute Scenario 3</>}
          </button>
        </div>

        {/* Scenario 4: Correlated APT */}
        <div className="bg-[#111827]/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-purple-800/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4 text-purple-500">
              <ShieldAlert size={24} />
              <h2 className="text-xl font-bold">4. Correlated APT Attack</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Simulates a sophisticated attack: 1. Phishing link click 2. Brute force attempts 3. Successful anomalous login.
              Demonstrates our <strong className="text-white">Event Correlation Engine</strong> linking multiple events into one Incident.
              Expect: Critical Incident created, auto-grouped under one Correlation ID.
            </p>
          </div>
          <button 
            onClick={() => triggerScenario('correlated_attack')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-2 bg-purple-950 border border-purple-900 text-purple-400 py-3 rounded-lg hover:bg-purple-900 transition-colors font-bold disabled:opacity-50"
          >
            {loading === 'correlated_attack' ? 'Simulating...' : <><Play size={16} /> Execute Scenario 4</>}
          </button>
        </div>

      </div>
    </div>
  );
}
