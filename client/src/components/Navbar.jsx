import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Settings, LogOut, LayoutGrid } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-800">
      <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white shadow-sm shadow-brand-500/30">
          F
        </div>
        <span className="text-lg font-semibold text-slate-800 dark:text-white">FlowBoard AI</span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Real-time Notification Bell */}
        <NotificationBell />

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 mb-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50 transition"
              >
                <LayoutGrid className="h-4 w-4 text-slate-400" />
                Dashboard
              </Link>

              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50 transition"
              >
                <User className="h-4 w-4 text-slate-400" />
                My Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50 transition"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                Settings
              </Link>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700/50" />

              <button
                onClick={() => {
                  setProfileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
