import React, { useState, useEffect } from 'react';
import { MapPin, Film, Info, Search } from 'lucide-react';
import api from '../services/api';

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const response = await api.get('/theatres');
        // Theatres returns { success, count, theatres: [...] }
        setTheaters(response.data.theatres || []);
      } catch (error) {
        console.error("Error fetching theaters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  const filteredTheaters = theaters.filter(theater => 
    theater.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    theater.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pb-20 pt-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-panel p-6 border-0 bg-secondary/5 border-l-4 border-l-secondary">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Our Theaters</h1>
          <p className="text-gray-400 mt-1">Find a CineVault theater near you for the ultimate movie experience.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary/50 transition-colors"
          />
        </div>
      </div>

      {/* Theaters List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredTheaters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheaters.map((theater) => (
            <div key={theater._id} className="glass-panel p-6 border-0 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors">{theater.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-2">
                    <MapPin className="w-4 h-4 text-secondary/70" />
                    <span>{theater.location}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Film className="w-5 h-5 text-secondary" />
                </div>
              </div>
              
              <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                 <div className="bg-dark-900/50 rounded-lg p-3 text-center border border-white/5">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Screens</p>
                    <p className="text-lg font-bold text-white">{theater.avilableScreens?.length || 0}</p>
                 </div>
                 <div className="bg-dark-900/50 rounded-lg p-3 text-center border border-white/5">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Type</p>
                    <p className="text-sm font-semibold text-white uppercase mt-1">{theater.type || 'Standard'}</p>
                 </div>
              </div>
              
              <button className="mt-4 w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium border border-white/5">
                 <Info className="w-4 h-4" /> View Screenings
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel border-0">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
             <MapPin className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No theaters found</h3>
          <p className="text-gray-400">We couldn't find any theaters matching your search.</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 px-6 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-lg transition-colors border border-secondary/30"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Theaters;
