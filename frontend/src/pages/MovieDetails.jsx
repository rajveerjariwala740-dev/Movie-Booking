import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, Calendar, MapPin, Film, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const MovieDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [movie, setMovie] = useState(null);
   const [shows, setShows] = useState([]);
   const [groupedShows, setGroupedShows] = useState({});
   const [selectedTheaterId, setSelectedTheaterId] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const fetchMovie = async () => {
       try {
         const res = await api.get(`/movies/${id}`);
         setMovie(res.data.movie);
       } catch (err) {
         console.error("Error fetching movie:", err);
         setMovie(null);
       } finally {
         setLoading(false);
       }
     };
     fetchMovie();
   }, [id]);

   useEffect(() => {
     const fetchShows = async () => {
       try {
         const res = await api.get(`/shows?movie=${id}`);
         const fetchedShows = res.data.shows || [];
         setShows(fetchedShows);

         const grouped = fetchedShows.reduce((acc, show) => {
            const tId = show.theater?._id;
            if (!tId) return acc;
            if (!acc[tId]) {
               acc[tId] = {
                  theater: show.theater,
                  shows: []
               };
            }
            acc[tId].shows.push(show);
            return acc;
         }, {});
         
         setGroupedShows(grouped);
         
         const theaterIds = Object.keys(grouped);
         if (theaterIds.length > 0) {
            setSelectedTheaterId(theaterIds[0]);
         }
       } catch (err) {
         console.error("Error fetching shows:", err);
       }
     };
     if (id) fetchShows();
   }, [id]);

   if (loading) {
       return (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
               <div className="text-primary animate-pulse flex flex-col items-center gap-4">
                  <Film className="w-12 h-12" />
                  <span className="text-xl font-bold tracking-[0.3em] uppercase">Loading...</span>
               </div>
           </div>
       );
   }

   if (!movie) return <div className="text-center mt-32 text-red-500 font-bold text-2xl relative z-10">Movie not found in the database.</div>;

   return (
      <div className="flex flex-col lg:flex-row bg-[#050505] overflow-visible font-sans min-h-screen">
          
          {/* LEFT PANE: Framed Massive Poster (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen bg-[#050505] items-center justify-center p-12 xl:p-24 overflow-hidden group">
              {/* Blurred background projection */}
              <div 
                 className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-3xl transform scale-110 pointer-events-none" 
                 style={{ backgroundImage: `url(${movie.poster})` }}
              />
              {/* Gradient mask to blend into right pane */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#050505] z-10 pointer-events-none" />
              
              {/* Constrained Framed Poster - Fixed Height Bounds */}
              <div className="relative z-20 h-[65vh] max-h-[700px] aspect-[2/3] transform transition-transform duration-[10s] ease-out group-hover:scale-105">
                 <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-full object-cover rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] ring-2 ring-white/10" 
                 />
              </div>
              
              {/* Back Button Overlay - Moved down to prevent conflicts */}
              <button 
                onClick={() => navigate(-1)} 
                className="absolute top-12 left-12 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-white hover:bg-primary hover:border-primary transition-all cursor-pointer shadow-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
          </div>

          {/* RIGHT PANE: Scrollable Content & Data */}
          <div className="w-full lg:w-1/2 min-h-screen relative bg-[#050505]">
              
              {/* MOBILE: Hero Poster Header */}
              <div className="lg:hidden w-full h-[60vh] relative bg-[#050505] flex items-end justify-center pb-8 overflow-hidden z-20">
                  {/* Blurred backdrop */}
                  <div 
                     className="absolute inset-0 bg-cover bg-top opacity-40 filter blur-xl transform scale-110" 
                     style={{ backgroundImage: `url(${movie.poster})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
                  
                  {/* Constrained Poster */}
                  <img 
                     src={movie.poster} 
                     alt={movie.title} 
                     className="relative z-20 w-3/5 max-w-[250px] aspect-[2/3] object-cover rounded-xl shadow-2xl ring-1 ring-white/10 mt-16" 
                  />

                  <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-6 left-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-xl"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
              </div>

              {/* Main Scrolling Container */}
              <div className="px-8 pb-16 md:px-12 lg:px-16 relative z-20 flex flex-col gap-10 lg:max-w-3xl pt-8 lg:pt-16">
                 
                 {/* Title & Metadata */}
                 <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.05]">
                       {movie.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase mt-8">
                       <span className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400/[0.08] text-yellow-500 rounded-full border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                          <Star className="w-4 h-4"/> {movie.rating} / 5.0
                       </span>
                       <span className="flex items-center gap-1.5 px-4 py-2 bg-primary/[0.08] text-primary rounded-full border border-primary/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                          <Clock className="w-4 h-4"/> {movie.duration} min
                       </span>
                       <span className="flex items-center gap-1.5 px-4 py-2 bg-white/5 text-gray-300 rounded-full border border-white/10">
                          {movie.genre}
                       </span>
                    </div>
                 </div>

                 {/* Synopsis Card */}
                 <div className="bg-white/[0.02] border border-white/[0.05] p-6 lg:p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-4">The Plot</h3>
                    <p className="text-lg text-gray-300 leading-relaxed font-light">
                       {movie.description}
                    </p>
                 </div>

                 {/* Theaters Selection Section */}
                 <div className="flex flex-col gap-6 mt-4">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">Select Theater & Time</h3>
                    
                    {Object.keys(groupedShows).length > 0 ? (
                       <div className="flex flex-col gap-5">
                          {Object.values(groupedShows).map((group) => {
                             const t = group.theater;
                             const isSelected = selectedTheaterId === t._id;
                             
                             return (
                                <div key={t._id} className={`rounded-3xl border transition-all duration-300 overflow-hidden ${isSelected ? 'border-primary/40 bg-primary/[0.03] shadow-[0_0_30px_rgba(236,72,153,0.08)]' : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03]'}`}>
                                   
                                   {/* Theater Header Accordion toggle */}
                                   <button 
                                      onClick={() => setSelectedTheaterId(isSelected ? null : t._id)}
                                      className="w-full p-6 lg:p-8 text-left flex justify-between items-center group cursor-pointer"
                                   >
                                      <div>
                                         <h4 className={`text-xl lg:text-2xl font-bold tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{t.name}</h4>
                                         <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 font-medium">
                                            <MapPin className="w-4 h-4" /> <span className="capitalize">{t.location}</span> • {t.type}
                                         </div>
                                      </div>
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'border border-white/10 text-gray-500 group-hover:border-white/30 group-hover:text-white'}`}>
                                         {isSelected ? '−' : '+'}
                                      </div>
                                   </button>

                                   {/* Expandable Showtimes Drawer */}
                                   <div className={`transition-all duration-500 ease-in-out px-6 lg:px-8 ${isSelected ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                      <div className="pt-6 border-t border-white/5">
                                         <h5 className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" /> Book Your Slot
                                         </h5>
                                         <div className="flex flex-wrap gap-3 lg:gap-4">
                                            {group.shows.map((show) => (
                                               <Link 
                                                  key={show._id} 
                                                  to={`/book/${show._id}`} 
                                                  className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-white/[0.08] hover:border-primary/50 transition-all p-4 lg:p-5 min-w-[130px] flex flex-col items-center gap-2 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(236,72,153,0.3)]"
                                               >
                                                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                  <span className="text-2xl font-black text-white relative z-10 tracking-tight">{show.showTime}</span>
                                                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary tracking-widest uppercase relative z-10 transition-colors">{show.screen?.type || 'Standard'}</span>
                                               </Link>
                                            ))}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    ) : (
                       <div className="py-16 px-6 rounded-3xl border border-white/5 bg-white/[0.01] text-center flex flex-col items-center gap-4">
                          <Ticket className="w-12 h-12 text-gray-600/50" />
                          <p className="text-gray-400 font-medium">No showtimes currently scheduled.</p>
                       </div>
                    )}
                 </div>

                 {/* Bottom spacing */}
                 <div className="h-16 w-full" />
              </div>
          </div>
      </div>
   );
};

export default MovieDetails;
