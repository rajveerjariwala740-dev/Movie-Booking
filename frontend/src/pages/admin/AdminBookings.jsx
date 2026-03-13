import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock } from 'lucide-react';
import api from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/all-bookings');
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch all bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400 animate-pulse">Loading Bookings...</div>;

  return (
    <div className="glass-panel p-8 border-0 min-h-[600px]">
       <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
         <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Ticket className="w-6 h-6 text-primary" /> All Platform Bookings</h2>
         <div className="px-3 py-1 bg-primary/20 text-primary border border-primary/50 text-sm font-semibold rounded-full">{bookings.length} Total</div>
       </div>

       <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
             <thead className="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                   <th className="px-4 py-3 rounded-tl-lg">ID / Date</th>
                   <th className="px-4 py-3">User</th>
                   <th className="px-4 py-3">Movie & Time</th>
                   <th className="px-4 py-3">Theater</th>
                   <th className="px-4 py-3">Seats</th>
                   <th className="px-4 py-3">Total Amount</th>
                   <th className="px-4 py-3 rounded-tr-lg">Status</th>
                </tr>
             </thead>
             <tbody>
               {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="px-4 py-4">
                        <div className="font-mono text-xs text-gray-500 mb-1" title={booking._id}>{booking._id.substring(0,8)}...</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                     </td>
                     <td className="px-4 py-4 font-medium text-white">
                        {/* If user population existed, we'd show name. For now, show ID safely. */}
                        {booking.user?.name || booking.user || 'Unknown User'}
                     </td>
                     <td className="px-4 py-4">
                        <div className="font-semibold text-white">{booking.show?.movie?.title || 'Unknown Movie'}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3 text-primary"/> {new Date(booking.show?.showDate).toLocaleDateString()} at {booking.show?.showTime}</div>
                     </td>
                     <td className="px-4 py-4">
                        <div className="text-gray-300">{booking.show?.theater?.name || 'Unknown Theater'}</div>
                        <div className="text-[10px] text-gray-500 uppercase">{booking.show?.screen?.name || 'Screen'}</div>
                     </td>
                     <td className="px-4 py-4">
                        <span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/20">{booking.seats.join(', ')}</span>
                     </td>
                     <td className="px-4 py-4 font-bold text-green-400">
                        ${booking.totalAmount.toFixed(2)}
                     </td>
                     <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                           booking.status === 'booked' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                           booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                           'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                           {booking.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                     </td>
                  </tr>
               ))}
               
               {bookings.length === 0 && (
                 <tr>
                   <td colSpan="7" className="px-4 py-12 text-center text-gray-500">No bookings found on the platform.</td>
                 </tr>
               )}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default AdminBookings;
