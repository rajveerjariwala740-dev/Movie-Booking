import React from 'react';
import { LayoutDashboard, Film, Settings, Monitor, Calendar, Users } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'movies', label: 'Movies', icon: <Film className="w-5 h-5" /> },
    { id: 'theaters', label: 'Theaters', icon: <Settings className="w-5 h-5" /> },
    { id: 'screens', label: 'Screens', icon: <Monitor className="w-5 h-5" /> },
    { id: 'shows', label: 'Shows', icon: <Calendar className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 flex-shrink-0 flex flex-col gap-2">
       <div className="glass-panel p-4 mb-4 border-0">
         <h2 className="text-lg font-bold text-white tracking-tight uppercase">Admin Panel</h2>
       </div>
       <nav className="glass-panel p-4 flex flex-col gap-2 h-full border-0">
          {tabs.map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                 activeTab === tab.id 
                   ? 'bg-primary text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                   : 'text-gray-400 hover:text-white hover:bg-white/5'
               }`}
            >
               {tab.icon}
               {tab.label}
            </button>
          ))}
       </nav>
    </div>
  );
};

export default AdminSidebar;
