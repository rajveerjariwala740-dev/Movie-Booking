import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-16 pb-20">
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full filter blur-2xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
        
        <h2 className="text-3xl font-bold mb-2 primary-gradient-text text-center text-white">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Sign in to your CineVault account to book your tickets.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-dark-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-dark-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? <Link to="/register" className="text-primary hover:text-white transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
