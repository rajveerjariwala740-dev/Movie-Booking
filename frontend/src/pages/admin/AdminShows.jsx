import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [form, setForm] = useState({
    movie: '', theater: '', screen: '', showDate: '', showTime: '', price: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatersRes, screensRes] = await Promise.all([
         api.get('/shows'),
         api.get('/movies'),
         api.get('/theatres'),
         api.get('/screens')
      ]);
      setShows(showsRes.data.shows || []);
      setMovies(moviesRes.data.movies || []);
      setTheaters(theatersRes.data.theatres || []);
      setScreens(screensRes.data.screens || []);
    } catch (err) {
      console.error("Failed fetching show deps", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setForm({ movie: '', theater: '', screen: '', showDate: '', showTime: '', price: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (show) => {
    setIsEditMode(true);
    setCurrentId(show._id);
    
    // Format date for inputs (YYYY-MM-DD)
    let formattedDate = '';
    if (show.showDate) {
      const d = new Date(show.showDate);
      formattedDate = d.toISOString().split('T')[0];
    }

    setForm({
      movie: show.movie?._id || '',
      theater: show.theater?._id || '',
      screen: show.screen?._id || '',
      showDate: formattedDate,
      showTime: show.showTime || '',
      price: show.price || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this showtime?")) return;
    try {
      await api.delete(`/shows/${id}`);
      fetchData();
    } catch (err) {
       alert(err.response?.data?.message || "Error deleting show");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/shows/${currentId}`, form);
      } else {
        await api.post('/shows', form);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving show");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter screens dynamically based on selected theater
  const availableScreens = screens.filter(s => s.theater?._id === form.theater || s.theater === form.theater);

  if (loading) return <div className="text-center py-12 text-gray-400 animate-pulse">Loading Shows...</div>;

  return (
    <div className="glass-panel p-8 border-0 min-h-[600px] relative">
       <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-accent" /> Shows Management
         </h2>
         <button onClick={openAddModal} className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]">
            <Plus className="w-4 h-4"/> Schedule Show
         </button>
       </div>

       <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
             <thead className="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                   <th className="px-4 py-3 rounded-tl-lg">Movie</th>
                   <th className="px-4 py-3">Theater & Screen</th>
                   <th className="px-4 py-3">Date & Time</th>
                   <th className="px-4 py-3">Price</th>
                   <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                </tr>
             </thead>
             <tbody>
               {shows.map((show) => (
                  <tr key={show._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td className="px-4 py-4 font-bold text-white max-w-[200px] truncate">{show.movie?.title || 'Unknown'}</td>
                     <td className="px-4 py-4">
                        <div className="text-gray-300">{show.theater?.name || 'Unknown'}</div>
                        <div className="text-[10px] text-accent uppercase font-semibold">{show.screen?.name || 'Screen'}</div>
                     </td>
                     <td className="px-4 py-4">
                        <div className="text-white">{new Date(show.showDate).toLocaleDateString()}</div>
                        <div className="text-gray-400 text-xs">{show.showTime}</div>
                     </td>
                     <td className="px-4 py-4 font-medium text-green-400">${show.price}</td>
                     <td className="px-4 py-4 flex gap-2">
                         <button onClick={() => openEditModal(show)} className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"><Edit2 className="w-4 h-4"/></button>
                         <button onClick={() => handleDelete(show._id)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"><Trash2 className="w-4 h-4"/></button>
                     </td>
                  </tr>
               ))}
               {shows.length === 0 && (
                 <tr>
                   <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No shows scheduled.</td>
                 </tr>
               )}
             </tbody>
          </table>
       </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-auto pt-20 pb-10">
          <div className="glass-panel w-full max-w-2xl p-8 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
             <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit' : 'Schedule'} Show</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 md:col-span-1">
                   <label className="text-sm text-gray-400 mb-1 block">Movie</label>
                   <select required value={form.movie} onChange={e => setForm({...form, movie: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white">
                      <option value="" disabled>Select Movie</option>
                      {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                   </select>
                 </div>
                 
                 <div className="col-span-2 md:col-span-1">
                   <label className="text-sm text-gray-400 mb-1 block">Theater</label>
                   <select required value={form.theater} onChange={e => { setForm({...form, theater: e.target.value, screen: ''}) }} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white">
                      <option value="" disabled>Select Theater</option>
                      {theaters.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                   </select>
                 </div>

                 <div className="col-span-2 md:col-span-1">
                   <label className="text-sm text-gray-400 mb-1 block">Screen</label>
                   <select required value={form.screen} onChange={e => setForm({...form, screen: e.target.value})} disabled={!form.theater} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white disabled:opacity-50">
                      <option value="" disabled>Select Screen</option>
                      {availableScreens.map(s => <option key={s._id} value={s._id}>{s.name} ({s.type})</option>)}
                   </select>
                 </div>

                 <div className="col-span-2 md:col-span-1">
                   <label className="text-sm text-gray-400 mb-1 block">Date</label>
                   <input required type="date" value={form.showDate} onChange={e => setForm({...form, showDate: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>

                 <div className="col-span-2 md:col-span-1">
                   <label className="text-sm text-gray-400 mb-1 block">Time</label>
                   <input required type="time" value={form.showTime} onChange={e => setForm({...form, showTime: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>

                 <div className="col-span-2 md:col-span-1">
                   <label className="text-sm text-gray-400 mb-1 block">Ticket Price ($)</label>
                   <input required type="number" step="0.5" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>
               </div>
               
               <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-white/10">Cancel</button>
                 <button type="submit" disabled={submitting} className="px-5 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Save Show'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShows;
