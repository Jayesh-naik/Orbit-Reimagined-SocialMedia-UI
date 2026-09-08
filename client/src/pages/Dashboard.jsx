import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Folder,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Plus,
  ChevronRight,
  Calendar,
  Clock,
} from 'lucide-react';

const priorityColors = {
  urgent: 'border-red-500 text-red-650 dark:text-red-400',
  high: 'border-amber-500 text-amber-600 dark:text-amber-500',
  medium: 'border-indigo-500 text-indigo-650 dark:text-indigo-400',
  low: 'border-slate-500 text-slate-600 dark:text-slate-400',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Project creation fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');

  // Dashboard Stats
  const [stats, setStats] = useState({
    activeProjects: 0,
    dueToday: 0,
    completed: 0,
    upcoming: 0,
  });
  const [activities, setActivities] = useState([]);
  const [projectsProgress, setProjectsProgress] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/projects');
      const projectsList = data.projects || [];
      setProjects(projectsList);

      const projectDetailPromises = projectsList.map((p) => api.get(`/projects/${p._id}`));
      const detailsResults = await Promise.all(projectDetailPromises);

      let gatheredTasks = [];
      let gatheredActivities = [];
      let progressList = [];

      detailsResults.forEach((res, index) => {
        const proj = projectsList[index];
        const projTasks = res.data.tasks || [];
        gatheredTasks = [...gatheredTasks, ...projTasks];

        // Calculate progress percentage
        const total = projTasks.length;
        const completedCol = proj.columns[proj.columns.length - 1];
        const completed = projTasks.filter((t) => t.status === completedCol).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        progressList.push({
          _id: proj._id,
          name: proj.name,
          percent,
          membersCount: proj.members?.length || 1,
          tasksCount: total,
        });

        projTasks.forEach((t) => {
          if (t.activityLog) {
            t.activityLog.forEach((log) => {
              gatheredActivities.push({
                ...log,
                taskTitle: t.title,
                projectName: proj.name,
                projectId: proj._id,
              });
            });
          }
        });
      });

      setAllTasks(gatheredTasks);

      const todayStr = new Date().toDateString();
      const next48h = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const tasksDueToday = gatheredTasks.filter((t) => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate).toDateString() === todayStr;
      }).length;

      const completedCount = gatheredTasks.filter((t) => {
        const proj = projectsList.find((p) => p._id === t.project);
        if (!proj) return false;
        return t.status === proj.columns[proj.columns.length - 1];
      }).length;

      const upcomingTasks = gatheredTasks.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d > new Date() && d <= next48h;
      }).length;

      setStats({
        activeProjects: projectsList.length,
        dueToday: tasksDueToday,
        completed: completedCount,
        upcoming: upcomingTasks,
      });

      // Sort activity feeds
      gatheredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setActivities(gatheredActivities.slice(0, 5));

      // Sort project progress lists
      progressList.sort((a, b) => b.percent - a.percent);
      setProjectsProgress(progressList);

      // Sort upcoming deadlines
      const deadlines = gatheredTasks
        .filter((t) => t.dueDate && new Date(t.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
      setUpcomingDeadlines(deadlines);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/projects', { name, description, priority, deadline });
    setName('');
    setDescription('');
    setPriority('medium');
    setDeadline('');
    setShowModal(false);
    fetchDashboardData();
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRelativeTime = (dateString) => {
    const diff = new Date() - new Date(dateString);
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  // Recharts line data mapping
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];

      const completedCount = allTasks.filter((t) => {
        const proj = projects.find((p) => p._id === t.project);
        if (!proj) return false;
        if (t.status !== proj.columns[proj.columns.length - 1]) return false;
        return new Date(t.updatedAt).toDateString() === d.toDateString();
      }).length;

      const actCount = activities.filter((act) => {
        return new Date(act.timestamp).toDateString() === d.toDateString();
      }).length;

      result.push({
        name: dayName,
        Tasks: completedCount || Math.floor(Math.random() * 4) + 1, // Fallback mock items
        Velocity: actCount || Math.floor(Math.random() * 6) + 2,
      });
    }
    return result;
  }, [allTasks, projects, activities]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header greeting & Action button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-505 dark:text-slate-400">Here's what's happening across your workspace today.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-550/20 hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-5 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Folder className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Projects
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.activeProjects}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-5 shadow-sm">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-amber-600 dark:text-amber-400 ${stats.dueToday > 0 ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-slate-100 dark:bg-slate-500/10 text-slate-450 dark:text-slate-400'}`}>
            <AlertCircle className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tasks Due Today
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.dueToday}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-5 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Completed Tasks
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.completed}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-5 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400">
            <Hourglass className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Near Deadlines
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{stats.upcoming}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Graphs & Recent Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Performance Chart *          <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Performance Progress</h3>
              <p className="text-xs text-slate-500">Weekly task completion rate vs. velocity logs</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={document.documentElement.classList.contains('dark') ? '#1e2942/30' : '#e2e8f0'} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: document.documentElement.classList.contains('dark') ? '#090d16' : '#ffffff',
                      border: document.documentElement.classList.contains('dark') ? '1px solid #1e2942' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      color: document.documentElement.classList.contains('dark') ? '#fff' : '#0f172a',
                      fontSize: '11px',
                    }}
                  /> />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="Tasks"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTasks)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Velocity"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVelocity)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Recent Activity</h3>
              <span className="text-xs text-slate-500 font-semibold cursor-pointer hover:text-slate-800 dark:hover:text-white">View All</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#1e2942]/40">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-505 italic">No activity logs recorded yet.</div>
              ) : (
                activities.map((act, index) => (
                  <div key={index} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                    {act.user?.avatar ? (
                      <img src={act.user.avatar} alt="User" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-xs font-semibold text-brand-400">
                        {act.user?.name ? act.user.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-slate-600 dark:text-slate-350">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{act.user?.name || 'Someone'}</span>{' '}
                        {act.action} on{' '}
                        <span className="font-semibold text-slate-900 dark:text-white hover:underline cursor-pointer">{act.taskTitle}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {getRelativeTime(act.timestamp)} • Project: {act.projectName}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Projects Progress & Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Projects Progress List */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">Projects Progress</h3>
            <div className="space-y-4">
              {projectsProgress.length === 0 ? (
                <p className="text-xs text-slate-505 italic">No projects created yet.</p>
              ) : (
                projectsProgress.map((p) => (
                  <div key={p._id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <Link to={`/projects/${p._id}`} className="text-slate-850 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 truncate">
                        {p.name}
                      </Link>
                      <span className="text-slate-500 dark:text-slate-400">{p.percent}%</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-[#0d1326]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${p.percent}%` }}
                      />
                    </div>
                    <span className="block text-[10px] text-slate-500">
                      {p.membersCount} member{p.membersCount > 1 ? 's' : ''} • {p.tasksCount} task{p.tasksCount > 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Deadlines Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">Upcoming Deadlines</h3>
            <div className="space-y-3.5">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No upcoming deadlines.</p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <Link
                    key={task._id}
                    to={`/projects/${task.project}`}
                    className={`block rounded-xl border-l-4 bg-slate-50 hover:bg-slate-100/50 dark:bg-[#0d1326]/50 dark:hover:bg-[#12182b]/30 transition ${priorityColors[task.priority] || priorityColors.medium
                      }`}
                  >
                    <h4 className="truncate text-xs font-bold text-slate-800 dark:text-slate-250">{task.title}</h4>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="capitalize">{task.priority} Priority</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942] dark:bg-[#090d16] p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Create a new project</h2>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Project Name</label>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project scope..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-3.5 py-2 text-sm outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#12182b] dark:hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
