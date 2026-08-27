import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import IncidentManager from './components/IncidentManager';
import Reports from './components/Reports';
import { Shield, AlertTriangle, FileText, LayoutDashboard, Settings, UserCircle } from 'lucide-react';
import './index.css';

function App() {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
        {/* Sidebar */}
        <div className="w-64 bg-gray-950 text-white flex flex-col shadow-2xl z-10">
          <div className="p-6 flex items-center gap-3 text-2xl font-black tracking-tight border-b border-gray-800/50">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <Shield className="text-white" size={24} />
            </div>
            CampusShield
          </div>
          
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
            <nav className="flex flex-col space-y-1">
              <NavLink to="/" className={navLinkClasses}>
                <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
              </NavLink>
              <NavLink to="/incidents" className={navLinkClasses}>
                <AlertTriangle size={20} /> <span className="font-medium">Incidents</span>
              </NavLink>
              <NavLink to="/reports" className={navLinkClasses}>
                <FileText size={20} /> <span className="font-medium">Audit Logs</span>
              </NavLink>
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-gray-800/50">
             <nav className="flex flex-col space-y-1">
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
                <Settings size={20} /> <span className="font-medium">Settings</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-0">
            <div className="text-sm text-gray-500 font-medium">
              Real-time Threat Detection System
            </div>
            <div className="flex items-center gap-4">
               <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold">
                 AD
               </span>
               <span className="text-sm font-semibold text-gray-700">Admin User</span>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/incidents" element={<IncidentManager />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
