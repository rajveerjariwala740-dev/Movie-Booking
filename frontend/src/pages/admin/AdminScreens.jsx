import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';

const AdminScreens = () => {
  const [screens, setScreens] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({ name: '', seats: '', type: '3D', theater: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [screensRes, theatersRes] = await Promise.all([
         api.get('/screens'),
         api.get('/theatres')
      ]);
      setScreens(screensRes.data.screens || []);
      setTheaters(theatersRes.data.theatres || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setForm({ name: '', seats: '', type: '3D', theater: theaters[0]?._id || '' });
    setIsModalOpen(true);
  };

  const openEditModal = (screen) => {     
    setIsEditMode(true);
    setCurrentId(screen._id);
    setForm({ name: screen.name, seats: screen.seats, type: screen.type, theater: screen.theater._id });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this screen?")) return;
    try {
      await api.delete(`/screens/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting screen");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/screens/${currentId}`, form);
      } else {
        await api.post('/screens', form);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400 animate-pulse">Loading Screens...</div>;

  return (
    <div className="glass-panel p-8 border-0 min-h-[600px] relative">
       <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Monitor className="w-6 h-6 text-blue-400" /> Screens Management
         </h2>
         <button onClick={openAddModal} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(59,130,246,0.39)]">
            <Plus className="w-4 h-4"/> Add Screen
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map(s => (
             <div key={s._id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all flex flex-col justify-between">
                <div>
                   <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">{s.name} <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded text-blue-400 font-bold uppercase">{s.type}</span></h3>
                   <p className="text-sm text-gray-400 mb-2">{s.theater?.name || 'Unknown Theater'}</p>
                   <p className="text-sm font-semibold text-gray-300">🪑 {s.seats} Seats capacity</p>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
                   <button onClick={() => openEditModal(s)} className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"><Edit2 className="w-3 h-3"/> Edit</button>
                   <button onClick={() => handleDelete(s._id)} className="flex-1 py-1.5 flex justify-center items-center gap-1 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"><Trash2 className="w-3 h-3"/> Delete</button>
                </div>
             </div>
          ))}
          {screens.length === 0 && <p className="text-gray-500 col-span-3">No screens available.</p>}
       </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="glass-panel w-full max-w-lg p-8 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
             <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit' : 'Add'} Screen</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div>
                 <label className="text-sm text-gray-400 mb-1 block">Theater</label>
                 <select required value={form.theater} onChange={e => setForm({...form, theater: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white">
                    <option value="" disabled>Select a Theater</option>
                    {theaters.map(t => (
                       <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Screen Name</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Screen 1" className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Type</label>
                    <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white">
                        <option value="3D">3D</option>
                        <option value="IMAX">IMAX</option>
                        <option value="Dolby Cinema">Dolby Cinema</option>
                    </select>
                  </div>
               </div>
               <div>
                 <label className="text-sm text-gray-400 mb-1 block">Total Seats Capacity</label>
                 <input required type="number" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})} className="w-full bg-dark-800/50 border border-white/10 rounded px-3 py-2 text-white" />
               </div>
               
               <div className="flex justify-end gap-3 mt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-white/10">Cancel</button>
                 <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] disabled:opacity-50">
                    {submitting ? 'Saving...' : 'Save Screen'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScreens;
