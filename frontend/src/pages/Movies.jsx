import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Filter, Play } from 'lucide-react';
import api from '../services/api';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Animation'];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get('/movies');
        setMovies(response.data.movies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre ? movie.genre?.includes(selectedGenre) : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="flex flex-col gap-8 pb-20 pt-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-panel p-6 border-0 bg-primary/5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">All Movies</h1>
          <p className="text-gray-400 mt-1">Discover, search, and book tickets for your favorite movies.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="" className="bg-dark-900">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-dark-900">{genre}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="aspect-[2/3] bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <Link to={`/movie/${movie._id}`} key={movie._id} className="group relative rounded-xl overflow-hidden glass-panel border-0 hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col">
              <div className="aspect-[2/3] w-full relative">
                <img 
                  src={movie.poster || `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop&random=${movie._id}`} 
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold text-white flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-yellow-400" /> {movie.rating || 'N/A'}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white line-clamp-1" title={movie.title}>{movie.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{movie.genre || 'Various'}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 mt-3 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {movie.duration || '120'} mins</span>
                  <span className="text-gray-600">•</span>
                  <span>{movie.language || 'English'}</span>
                </div>
              </div>
              
              {/* Hover overlay button */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                 <div className="bg-white text-primary rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                    <Play className="w-6 h-6 fill-current" />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel border-0">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
             <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or checking back later.</p>
          {(searchTerm || selectedGenre) && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedGenre(''); }}
              className="mt-6 px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors border border-primary/30"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
