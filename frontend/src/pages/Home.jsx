import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        // The backend `getMovies` returns { success, count, movies: [...] }
        setMovies(response.data.movies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="flex flex-col gap-12 pb-20">
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[500px] rounded-3xl overflow-hidden mt-6 shadow-2xl glass-panel border-0">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent z-10" />
        
        {loading ? (
           <div className="w-full h-full bg-dark-800 animate-pulse" />
        ) : featuredMovie ? (
           <img 
             src={featuredMovie.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop"} 
             alt={featuredMovie.title}
             className="w-full h-full object-cover opacity-60"
           />
        ) : (
           <div className="w-full h-full bg-dark-800 flex items-center justify-center text-gray-500">No featured movies</div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-10 z-20 flex flex-col items-start gap-4">
          {featuredMovie && (
            <>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-primary border border-white/10">
                  Now Showing
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" /> {featuredMovie.rating || '4.8'}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
                {featuredMovie.title}
              </h2>
              <p className="text-gray-300 max-w-2xl line-clamp-2 md:line-clamp-3">
                {featuredMovie.description || "Experience the most anticipated movie of the year. Book your tickets now and enjoy the show in our premium theaters."}
              </p>
              <div className="flex gap-4 mt-4">
                <Link to={`/movie/${featuredMovie._id}`} className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" /> Book Tickets
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-bold text-white">Trending Now</h3>
            <p className="text-gray-400 mt-2">Discover the most popular movies</p>
          </div>
          <Link to="/movies" className="text-secondary hover:text-white transition-colors text-sm font-medium">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[2/3] bg-dark-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link to={`/movie/${movie._id}`} key={movie._id} className="group relative rounded-xl overflow-hidden glass-panel border-0 hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
                <div className="aspect-[2/3] w-full">
                  <img 
                    src={movie.poster || `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop&random=${movie._id}`} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h4 className="font-bold text-white drop-shadow-md truncate">{movie.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {movie.rating || 'N/A'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {movie.duration || '120'}m</span>
                  </div>
                  <button className="mt-4 w-full py-2 bg-primary/90 text-white rounded-lg text-sm font-medium">
                    Get Tickets
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
