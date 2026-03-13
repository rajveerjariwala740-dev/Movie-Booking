import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { Film, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'

// Guards
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Base Layout
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isFullScreenPage = location.pathname.startsWith('/movie/');
  
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 80) { 
          // Hide when scrolling down past 80px
          setIsNavVisible(false);
        } else {
          // Show when scrolling up or at top
          setIsNavVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-hidden">
      {/* Decorative background blurs for glassmorphism effect */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse pointer-events-none z-0"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      <header className={`glass-panel mx-4 mt-4 p-4 fixed top-0 left-0 right-0 z-[60] flex justify-between items-center transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <Film className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold primary-gradient-text tracking-tight">CineVault</h1>
        </Link>
        <nav className="flex gap-6 items-center">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/movies" className="text-sm font-medium hover:text-primary transition-colors">Movies</Link>
          <Link to="/theaters" className="text-sm font-medium hover:text-primary transition-colors">Theaters</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1">
              <ShieldAlert className="w-4 h-4"/> Admin
            </Link>
          )}
          {user ? (
             <div className="flex items-center gap-4 ml-4">
               <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-300 px-3 py-1.5 glass-panel border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                 <UserIcon className="w-4 h-4 text-primary" />
                 <span>{user.name || 'User'}</span>
               </Link>
               <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Log Out">
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
          ) : (
             <Link to="/login" className="px-5 py-2 glass-button text-sm">Sign In</Link>
          )}
        </nav>
      </header>

      {/* Global spacer so the fixed header doesn't overlap the top of pages */}
      <div className="w-full h-[88px] flex-shrink-0 z-0"></div>

      <main className={`flex-1 w-full z-10 relative ${isFullScreenPage ? '' : 'max-w-7xl mx-auto px-4 pb-4'}`}>
        {children}
      </main>
      <footer className="mt-20 py-8 border-t border-white/10 text-center text-sm text-gray-500 z-10 relative">
        <p>&copy; {new Date().getFullYear()} CineVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

import Home from './pages/Home'
import Booking from './pages/Booking'
import MovieDetails from './pages/MovieDetails'
import Movies from './pages/Movies'
import Theaters from './pages/Theaters'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:showId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/theaters" element={<Theaters />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

