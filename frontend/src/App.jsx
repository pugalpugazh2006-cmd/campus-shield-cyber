import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import IncidentManager from './components/IncidentManager';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { Shield, AlertTriangle, FileText, LayoutDashboard, Settings as SettingsIcon, Terminal } from 'lucide-react';
import './index.css';

function App() {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 font-mono tracking-wide ${
      isActive 
        ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
        : 'text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300 border border-transparent'
    }`;

  return (
    <Router>
      <div className="flex h-screen bg-[#0a0e17] font-sans text-gray-200 selection:bg-cyan-900 selection:text-cyan-100">
        {/* Sidebar */}
        <div className="w-64 bg-[#0d131f] border-r border-gray-800 flex flex-col z-10">
          <div className="p-6 flex items-center gap-3 text-xl font-black tracking-widest uppercase border-b border-gray-800">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-md opacity-50"></div>
              <Shield className="text-cyan-400 relative z-10" size={28} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              CampusShield
            </span>
          </div>
          
          <div className="p-4">
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4 px-2">SYS.MAIN_MENU</p>
            <nav className="flex flex-col space-y-2">
              <NavLink to="/" className={navLinkClasses}>
                <LayoutDashboard size={18} /> <span className="text-sm">Dashboard</span>
              </NavLink>
              <NavLink to="/incidents" className={navLinkClasses}>
                <AlertTriangle size={18} /> <span className="text-sm">Incidents</span>
              </NavLink>
              <NavLink to="/reports" className={navLinkClasses}>
                <Terminal size={18} /> <span className="text-sm">Audit Logs</span>
              </NavLink>
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-gray-800">
             <nav className="flex flex-col space-y-2">
              <NavLink to="/settings" className={navLinkClasses}>
                <SettingsIcon size={18} /> <span className="text-sm">Settings</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none z-0"></div>

          {/* Top Header */}
          <header className="h-16 bg-[#0d131f]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 z-10">
            <div className="text-xs font-mono text-cyan-500/70 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SYS.ACTIVE :: Real-time Threat Detection
            </div>
            <div className="flex items-center gap-4">
               <span className="flex items-center justify-center w-8 h-8 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded font-mono text-xs shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                 ROOT
               </span>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-8 z-10">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/incidents" element={<IncidentManager />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
