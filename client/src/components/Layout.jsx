import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import CommandPalette from './CommandPalette';
import AiAssistantModal from './AiAssistantModal';
import api from '../services/api';
import {
  LayoutGrid,
  Kanban,
  Users,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { mockStorage } from '../services/mockStorage';

const BULLET_COLORS = ['bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-violet-500'];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'board';

  const [projects, setProjects] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Modals
  const [showCmdK, setShowCmdK] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching sidebar projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Helper to determine if a route is active
  const isRouteActive = (path, tab = null) => {
    if (tab) {
      return location.pathname.startsWith(path) && activeTab === tab;
    }
    return location.pathname === path;
  };

  // Get active project ID or fallback to first project for quick-links
  const currentProjId = projectId || (projects.length > 0 ? projects[0]._id : 'proj-1');

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LayoutGrid className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      name: 'Board',
      icon: <Kanban className="h-5 w-5" />,
      path: currentProjId ? `/projects/${currentProjId}` : '/dashboard',
      tab: 'board',
      disabled: !currentProjId,
    },
    {
      name: 'Team',
      icon: <Users className="h-5 w-5" />,
      path: currentProjId ? `/projects/${currentProjId}` : '/dashboard',
      tab: 'team',
      disabled: !currentProjId,
    },
    {
      name: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      path: currentProjId ? `/projects/${currentProjId}` : '/dashboard',
      tab: 'analytics',
      disabled: !currentProjId,
    },
    {
      name: 'Calendar',
      icon: <Calendar className="h-5 w-5" />,
      path: currentProjId ? `/projects/${currentProjId}` : '/dashboard',
      tab: 'calendar',
      disabled: !currentProjId,
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings',
    },
  ];

  const currentTasks = mockStorage.getTasksForProject(currentProjId);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 font-sans transition-colors duration-200">
      {/* 1. Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#090d16] transition-all duration-300 md:static ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-[#1e2942]/40">
          {!sidebarCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg shadow-brand-500/25">
                <Sparkles className="h-4.5 w-4.5 text-white fill-white/10" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                FlowBoard AI
              </span>
            </Link>
          )}

          {sidebarCollapsed && (
            <Link to="/dashboard" className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-lg">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </Link>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden rounded-lg p-1 text-slate-450 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#12182b] dark:hover:text-white md:block"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isRouteActive(item.path, item.tab);
            const targetUrl = item.tab ? `${item.path}?tab=${item.tab}` : item.path;

            return (
              <Link
                key={item.name}
                to={item.disabled ? '#' : targetUrl}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                  item.disabled ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  active
                    ? 'bg-gradient-to-r from-brand-600/20 to-indigo-500/10 text-brand-650 dark:text-brand-400 border-l-2 border-brand-500 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#12182b]/50 dark:hover:text-slate-200'
                }`}
              >
                <div className={`transition-transform duration-200 ${active ? 'scale-105' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </div>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}

          {/* Projects Sub-section */}
          {!sidebarCollapsed && (
            <div className="pt-6">
              <div className="mb-2 flex items-center justify-between px-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Projects
                </span>
                <Link
                  to="/dashboard"
                  title="New Project"
                  className="rounded p-0.5 text-slate-450 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#12182b] dark:hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-1.5">
                {projects.map((proj, idx) => {
                  const isActive = projectId === proj._id;
                  const bulletColor = BULLET_COLORS[idx % BULLET_COLORS.length];

                  return (
                    <Link
                      key={proj._id}
                      to={`/projects/${proj._id}?tab=board`}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 border-l-2 border-brand-500 dark:bg-[#12182b] dark:text-white'
                          : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#12182b]/30 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${bulletColor}`} />
                      <span className="truncate">{proj.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer User Box */}
        <div className="border-t border-slate-200 bg-slate-50/50 dark:border-[#1e2942]/40 p-4 dark:bg-[#070a11]">
          <div className="flex items-center justify-between">
            <Link to="/profile" className="flex items-center gap-3 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-[#1e2942]"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-xs font-bold text-brand-400">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold truncate">Workspace Owner</p>
                </div>
              )}
            </Link>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* 2. Main Content Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 dark:border-[#1e2942]/60 dark:bg-[#090d16]/80 backdrop-blur-md px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#12182b] dark:hover:text-white md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Interactive Search Command Trigger */}
            <button
              onClick={() => setShowCmdK(true)}
              className="relative hidden w-72 sm:flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 dark:border-[#1e2942]/60 dark:bg-[#0d1326] py-1.5 px-3 text-xs text-slate-400 hover:border-brand-500 dark:hover:border-brand-500 transition"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span>Search tasks, commands...</span>
              </div>
              <span className="rounded bg-slate-200 dark:bg-[#161e38] px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                ⌘K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#151c33] transition"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-indigo-600" />}
            </button>

            {/* AI Assistant Action Modal Trigger */}
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-650/10 via-indigo-600/10 to-brand-600/20 border border-brand-500/30 px-3 py-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:brightness-110 shadow-sm transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Assistant</span>
            </button>

            {/* Notification Center */}
            <NotificationBell />

            <div className="h-6 w-px bg-slate-200 dark:bg-[#1e2942]/60" />

            {/* User Avatar */}
            <Link to="/profile" className="flex items-center gap-1.5 group">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-[#1e2942] group-hover:border-brand-500 transition"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/10 text-xs font-bold text-brand-400 border border-brand-550/20">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Interactive Command Palette Shortcut */}
      <CommandPalette isOpen={showCmdK} onClose={() => setShowCmdK(false)} />

      {/* AI Assistant Generator & Risk Analyzer Modal */}
      <AiAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        projectId={currentProjId}
        tasks={currentTasks}
        onTasksUpdated={fetchProjects}
      />
    </div>
  );
};

export default Layout;
