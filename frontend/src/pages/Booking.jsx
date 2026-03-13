import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Monitor } from 'lucide-react';
import api from '../services/api';

const Booking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await api.get(`/shows/${showId}`);
        setShow(res.data.show);
      } catch (err) {
        console.error("Error fetching show details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (showId) fetchShowDetails();
  }, [showId]);

  // Parse occupied seats from the backend
  const occupiedSeats = show?.bookedSeats || [];

  const totalSeats = show?.screen?.seats || 96;
  const columnsCount = 12;
  const rowsCount = Math.ceil(totalSeats / columnsCount);

  // Generate row letters ['A', 'B', ...]
  const rows = Array.from({ length: rowsCount }, (_, i) => String.fromCharCode(65 + i));
  const columns = Array.from({ length: columnsCount }, (_, i) => i + 1);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCheckout = async () => {
    try {
      // POST the booking to the backend
      await api.post('/bookings', {
        showId: showId,
        seats: selectedSeats
      });
      alert(`Booking Successful for seats: ${selectedSeats.join(', ')}`);
      navigate('/');
    } catch (error) {
       console.error("Booking error:", error);
       alert(error.response?.data?.message || "Failed to create booking");
    }
  };

  if (loading) return <div className="text-center mt-32 text-gray-400 animate-pulse">Loading seat map...</div>;
  if (!show) return <div className="text-center mt-32 text-red-400">Show data not found.</div>;

  const movie = show.movie;
  const theater = show.theater;

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6 pb-20">
      
      {/* Left Sidebar: Movie Info & Showtimes */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="glass-panel p-6 border-0 sticky top-28">
          <div className="flex gap-4 mb-6">
            <img src={movie.posterUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400"} alt={movie.title} className="w-24 h-36 rounded-lg object-cover shadow-lg" />
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
              <span className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded inline-block w-max mb-1">{show.screen?.name || 'Screen'} - {show.screen?.type || 'Standard'}</span>
              <p className="text-sm text-primary mt-2 flex items-center gap-1 font-medium">{theater?.name || 'Cinema'}</p>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(show.showDate).toLocaleDateString()}</p>
            </div>
          </div>

          <hr className="border-white/10 mb-6" />

          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Selected Time</h3>
          <div className="flex flex-wrap gap-3">
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-primary text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] cursor-default"
              >
                {show.showTime}
              </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Selected Seats:</span>
              <span className="font-bold text-white max-w-[150px] truncate" title={selectedSeats.join(', ')}>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total Price:</span>
              <span className="text-2xl font-bold primary-gradient-text">${(selectedSeats.length * show.price).toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={selectedSeats.length === 0}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>

      {/* Right Area: Seat Map */}
      <div className="w-full lg:w-2/3 glass-panel p-8 min-h-[600px] flex flex-col items-center">
        <h3 className="text-xl font-bold text-white w-full text-center tracking-widest uppercase mb-12 flex items-center justify-center gap-3">
           <Monitor className="w-6 h-6 text-gray-400" /> Screen
        </h3>
        
        {/* Screen curve */}
        <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full shadow-[0_10px_30px_rgba(236,72,153,0.5)] mb-16"></div>

        {/* Seat Layout */}
        <div className="flex flex-col gap-4 overflow-x-auto w-full max-w-2xl px-4">
          {rows.map(row => (
            <div key={row} className="flex items-center justify-center gap-2 md:gap-4">
              <span className="w-6 text-center text-sm text-gray-500 font-bold">{row}</span>
              <div className="flex gap-2">
                {columns.map(col => {
                  const seatIndex = (rows.indexOf(row) * columnsCount) + col;
                  if (seatIndex > totalSeats) return null;
                  
                  const seatId = seatIndex;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  // Create a gap for the aisle
                  const isAisle = col === 6;

                  return (
                    <React.Fragment key={col}>
                      <button 
                        onClick={() => toggleSeat(seatId)}
                        disabled={isOccupied}
                        className={`
                          w-6 h-6 md:w-8 md:h-8 rounded-t-lg rounded-b-sm transition-all duration-200 transform hover:scale-110
                          ${isOccupied ? 'bg-dark-700/50 cursor-not-allowed border-dark-600' : 
                            isSelected ? 'bg-primary shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 
                            'bg-white/10 border border-white/20 hover:bg-white/20 hover:border-primary/50 text-[10px] text-transparent hover:text-white/50 flex items-center justify-center'}
                        `}
                      >
                         {!isOccupied && !isSelected && col}
                      </button>
                      {isAisle && <div className="w-4 md:w-8" />}
                    </React.Fragment>
                  );
                })}
              </div>
              <span className="w-6 text-center text-sm text-gray-500 font-bold">{row}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-16 pt-8 border-t border-white/10 w-full justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/10 border border-white/20 rounded"></div>
            <span className="text-sm text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
            <span className="text-sm text-white font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-dark-700/50 rounded"></div>
            <span className="text-sm text-gray-500">Occupied</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Booking;
