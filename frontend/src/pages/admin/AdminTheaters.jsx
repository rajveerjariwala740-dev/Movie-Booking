import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';

const AdminTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTheaterId, setCurrentTheaterId] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', type: 'Standard' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const res = await api.get('/theatres');
      setTheaters(res.data.theatres || []);
    } catch (err) {
      console.error("Failed to fetch theaters", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setForm({ name: '', location: '', type: 'Standard' });
    setIsModalOpen(true);
  };

  const openEditModal = (theater) => {
    setIsEditMode(true);
    setCurrentTheaterId(theater._id);
    setForm({ name: theater.name, location: theater.location, type: theater.type });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theater?")) return;
    try {
      await api.delete(`/theatres/${id}`);
      fetchTheaters();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting theater");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/theatres/${currentTheaterId}`, form);
      } else {
        await api.post('/theatres', form);
      }
      setIsModalOpen(false);
      fetchTheaters();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving theater");
    } finally {
       setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400 animate-pulse">Loading Theaters...</div>;

  return (
    <div className="glass-panel p-8 border-0 min-h-[600px] relative">
       <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-secondary" /> Theaters Management
         </h2>
         <button onClick={openAddModal} className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg font-medium flex items-center gap-2 transition-all">
            <Plus className="w-4 h-4"/> Add Theater
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theaters.map(t => (
             <div key={t._id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all flex flex-col justify-between">
                <div>
                   <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                   <p className="text-sm text-gray-400">{t.location}</p>
                   <span className="inline-block mt-3 px-2 py-1 bg-black/30 rounded text-xs text-gray-300 font-mono uppercase border border-white/5">{t.type}</span>
                   <p className="text-xs text-secondary mt-3 font-medium bg-secondary/10 w-max px-2 py-0.5 rounded">Screens: {t.avilableScreens?.length || 0}</p>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
                   <button onClick={() => openEditModal(t)} className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"><Edit2 className="w-3 h-3"/> Edit</button>
                   <button onClick={() => handleDelete(t._id)} className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"><Trash2 className="w-3 h-3"/> Delete</button>
                </div>
             </div>
          ))}
          {theaters.length === 0 && <p className="text-gray-500 col-span-3">No theaters added yet.</p>}
       </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="glass-panel w-full max-w-lg p-8 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
             <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit' : 'Add'} Theater</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div>
                 <label className="text-sm text-gray-400 mb-1 block">Name</label>
                 <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
               </div>
               <div>
                 <label className="text-sm text-gray-400 mb-1 block">Location</label>
                 <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
               </div>
               <div>
                 <label className="text-sm text-gray-400 mb-1 block">Type</label>
                 <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white">
                    <option value="Standard">Standard</option>
                    <option value="Multiplex">Multiplex</option>
                    <option value="Open Air">Open Air</option>
                    <option value="Black Box">Black Box</option>
                 </select>
               </div>
               <div className="flex justify-end gap-3 mt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-white/10">Cancel</button>
                 <button type="submit" disabled={submitting} className="px-5 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-medium shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Save Theater'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTheaters;
