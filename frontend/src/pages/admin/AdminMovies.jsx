import React, { useState, useEffect } from 'react';
import { Film, Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [form, setForm] = useState({
    title: '', description: '', rating: '', language: '', genre: '', duration: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/movies');
      setMovies(res.data.movies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setForm({ title: '', description: '', rating: '', language: '', genre: '', duration: '' });
    setPosterFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (movie) => {
    setIsEditMode(true);
    setCurrentId(movie._id);
    setForm({
      title: movie.title,
      description: movie.description,
      rating: movie.rating,
      language: movie.language,
      genre: movie.genre[0] || movie.genre, // Simple array to string handling if populated as array
      duration: movie.duration
    });
    setPosterFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await api.delete(`/movies/${id}`);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (posterFile) {
        formData.append('poster', posterFile);
      }

      if (isEditMode) {
        await api.put(`/movies/${currentId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      } else {
        await api.post('/movies', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving movie");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400 animate-pulse">Loading Movies...</div>;

  return (
    <div className="glass-panel p-8 border-0 min-h-[600px] relative">
       <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Film className="w-6 h-6 text-primary" /> Movies Management
         </h2>
         <button onClick={openAddModal} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(236,72,153,0.39)]">
            <Plus className="w-4 h-4"/> Add Movie
         </button>
       </div>

       <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map(m => (
             <div key={m._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all flex flex-col">
                <div className="h-48 w-full bg-dark-800 relative">
                   {m.poster ? (
                      <img src={m.poster} alt={m.title} className="w-full h-full object-cover opacity-80" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600"><Film className="w-8 h-8"/></div>
                   )}
                   <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-400">⭐ {m.rating}</div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                   <div>
                       <h3 className="font-bold text-white mb-1 truncate" title={m.title}>{m.title}</h3>
                       <p className="text-xs text-gray-400">{m.language} • {m.genre} • {m.duration}m</p>
                   </div>
                   <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                       <button onClick={() => openEditModal(m)} className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"><Edit2 className="w-3 h-3"/> Edit</button>
                       <button onClick={() => handleDelete(m._id)} className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"><Trash2 className="w-3 h-3"/> Delete</button>
                   </div>
                </div>
             </div>
          ))}
          {movies.length === 0 && <p className="text-gray-500 col-span-4">No movies available.</p>}
       </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex justify-center items-center overflow-y-auto pt-20 pb-10">
          <div className="glass-panel w-full max-w-2xl p-8 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
             <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit' : 'Add'} Movie</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm text-gray-400 mb-1 block">Title</label>
                   <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                   <label className="text-sm text-gray-400 mb-1 block">Genre</label>
                   <input required type="text" value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                   <label className="text-sm text-gray-400 mb-1 block">Language</label>
                   <input required type="text" value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                   <label className="text-sm text-gray-400 mb-1 block">Duration (mins)</label>
                   <input required type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                   <label className="text-sm text-gray-400 mb-1 block">Rating</label>
                   <input required type="number" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                 </div>
                 <div>
                   <label className="text-sm text-gray-400 mb-1 block">Poster Image (Leave empty to keep current)</label>
                   <input type="file" onChange={e => setPosterFile(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                 </div>
               </div>
               <div>
                 <label className="text-sm text-gray-400 mb-1 block">Description</label>
                 <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full h-24 bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white resize-none" />
               </div>
               <div className="flex justify-end gap-3 mt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">Cancel</button>
                 <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Save Movie'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
