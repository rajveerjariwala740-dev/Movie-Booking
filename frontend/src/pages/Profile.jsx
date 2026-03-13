import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Ticket, Clock, Calendar, MapPin, User as UserIcon, LogOut, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { Navigate, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                setLoading(true);
                const res = await api.get('/bookings/my-bookings');
                setBookings(res.data.bookings || []);
            } catch (err) {
                console.error("Error fetching my bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            // Refresh bookings
            const res = await api.get('/bookings/my-bookings');
            setBookings(res.data.bookings || []);
        } catch (err) {
            alert(err.response?.data?.message || "Error cancelling booking");
        }
    };

    // Sort bookings: upcoming first, then past
    const now = new Date();
    const sortedBookings = [...bookings].sort((a, b) => {
        // Handle cancelled bookings implicitly by potentially pushing them down 
        // Or strictly by date:
        const dateA = new Date(a.show?.showDate);
        const dateB = new Date(b.show?.showDate);
        return dateB - dateA; // Newest first
    });

    return (
        <div className="flex flex-col gap-8 mt-6 max-w-7xl mx-auto px-4 pb-20">
            {/* Header Area */}
            <div className="glass-panel p-8 border-0 bg-primary/5 border-l-4 border-l-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                        <UserIcon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{user.name || 'User'}</h1>
                        <p className="text-gray-400 mt-1">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                           <span className="text-xs px-2 py-1 bg-white/10 rounded uppercase font-bold tracking-wider text-primary border border-white/5">
                               {user.role || 'Member'}
                           </span>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/10 hover:border-red-500/50 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>

            {/* Bookings Section */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Ticket className="w-6 h-6 text-primary" /> My Tickets
                </h2>
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-dark-800 rounded-xl animate-pulse" />)}
                    </div>
                ) : sortedBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedBookings.map(booking => {
                           const isCancelled = booking.status === 'cancelled';
                           const showDate = new Date(booking.show?.showDate);
                           const isUpcoming = showDate >= now && !isCancelled;
                           
                           return (
                            <div key={booking._id} className={`glass-panel p-6 border-0 flex flex-col relative overflow-hidden transition-all duration-300 ${isCancelled ? 'opacity-60 grayscale-[50%]' : 'hover:-translate-y-1'}`}>
                                
                                {/* Status Ribbon */}
                                <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border flex items-center gap-1.5
                                    ${isCancelled ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                      isUpcoming ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 
                                      'bg-white/5 text-gray-400 border-white/10'}
                                `}>
                                    {isCancelled ? <XCircle className="w-3.5 h-3.5" /> : 
                                     isUpcoming ? <CheckCircle className="w-3.5 h-3.5" /> : 
                                     <Clock className="w-3.5 h-3.5" />}
                                    {isCancelled ? 'Cancelled' : isUpcoming ? 'Upcoming' : 'Completed'}
                                </div>

                                <div className="flex justify-between items-start mb-6 pt-2">
                                    <div className="w-3/4">
                                        <h3 className="text-xl font-bold text-white mb-1 truncate" title={booking.show?.movie?.title}>{booking.show?.movie?.title || 'Unknown Movie'}</h3>
                                        <p className="text-sm text-gray-400 font-medium">Booking ID: <span className="font-mono text-xs">{booking._id.substring(0,8)}...</span></p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-gray-300 mb-6 bg-dark-900/50 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Date</p>
                                            <p className="font-medium">{showDate.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Time</p>
                                            <p className="font-medium">{booking.show?.showTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 col-span-2 mt-2">
                                        <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Venue</p>
                                            <p className="font-medium">{booking.show?.theater?.name || 'Unknown Theater'}</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Screen {booking.show?.screen?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Seats ({booking.seats.length})</p>
                                        <div className="flex flex-wrap gap-1">
                                            {booking.seats.map(seat => (
                                                <span key={seat} className="bg-white/10 text-white text-xs px-2 py-0.5 rounded border border-white/20">
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-end h-full">
                                        <p className="text-2xl font-bold primary-gradient-text">${booking.totalAmount?.toFixed(2)}</p>
                                    </div>
                                </div>
                                
                                {isUpcoming && (
                                    <button 
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="mt-6 w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20 hover:border-red-500/50 rounded-lg text-sm font-semibold"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                           )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 glass-panel border-0 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Ticket className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No tickets yet</h3>
                        <p className="text-gray-400 max-w-sm mb-8">You haven't booked any movies yet. Your history will appear here once you make a purchase.</p>
                        <button 
                            onClick={() => navigate('/movies')}
                            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] transition-all"
                        >
                            Browse Movies
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
