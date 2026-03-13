import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Film, Users, Calendar, Settings } from 'lucide-react';

// Import Admin Sub-Components
import AdminSidebar from './admin/AdminSidebar';
import AdminMovies from './admin/AdminMovies';
import AdminTheaters from './admin/AdminTheaters';
import AdminScreens from './admin/AdminScreens';
import AdminShows from './admin/AdminShows';
import AdminBookings from './admin/AdminBookings';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Overview Stats
  const [stats, setStats] = useState({
    movies: 0,
    theaters: 0,
    shows: 0,
    bookings: 0
  });

  useEffect(() => {
    if (activeTab === 'overview') {
      const fetchStats = async () => {
        try {
          const [moviesRes, theatersRes, showsRes, bookingsRes] = await Promise.all([
             api.get('/movies'),
             api.get('/theatres'),
             api.get('/shows'),
             api.get('/bookings/all-bookings')
          ]);
          setStats({
            movies: moviesRes.data.movies?.length || 0,
            theaters: theatersRes.data.theatres?.length || 0,
            shows: showsRes.data.shows?.length || 0,
            bookings: bookingsRes.data.bookings?.length || 0
          });
        } catch (err) {
          console.error("Failed to fetch admin stats", err);
        }
      };
      fetchStats();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Movies" value={stats.movies} icon={<Film className="w-6 h-6 text-primary" />} />
              <StatCard title="Theaters" value={stats.theaters} icon={<Settings className="w-6 h-6 text-secondary" />} />
              <StatCard title="Active Shows" value={stats.shows} icon={<Calendar className="w-6 h-6 text-accent" />} />
              <StatCard title="Total Bookings" value={stats.bookings} icon={<Users className="w-6 h-6 text-blue-400" />} />
            </div>
            
            <div className="mt-8 glass-panel p-8 border-0 bg-primary/5 border-l-4 border-l-primary">
               <h2 className="text-2xl font-bold text-white mb-2">Welcome to CineVault Admin</h2>
               <p className="text-gray-400">Use the sidebar to navigate and manage your entire cinema ecosystem. Ensure that you have Theaters and Screens created before attempting to schedule Shows.</p>
            </div>
          </div>
        );
      case 'movies': return <AdminMovies />;
      case 'theaters': return <AdminTheaters />;
      case 'screens': return <AdminScreens />;
      case 'shows': return <AdminShows />;
      case 'bookings': return <AdminBookings />;
      default: return <div>Select a valid tab</div>;
    }
  };

  return (
    <div className="flex gap-6 mt-6 max-w-7xl mx-auto pb-20 px-4">
       {/* Sidebar Navigation */}
       <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-6">
             <div>
               <h1 className="text-3xl font-bold text-white tracking-tight capitalize">{activeTab}</h1>
               <p className="text-gray-400 mt-2">Manage settings and content for {activeTab}.</p>
             </div>
             <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm font-medium text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Logged in as Admin ({user?.email})
             </div>
          </div>
          
          <div className="flex-1">
             {renderContent()}
          </div>
       </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="glass-panel p-6 border-0 flex items-center justify-between hover:translate-y-[-4px] transition-transform duration-300">
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
