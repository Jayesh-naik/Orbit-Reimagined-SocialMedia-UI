import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from '../components/Board';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import { socket } from '../services/socket';
import { Layout, Calendar as CalendarIcon, BarChart3, Users } from 'lucide-react';
import ProjectTeam from '../components/ProjectTeam';
import ProjectCalendar from '../components/ProjectCalendar';
import ProjectAnalytics from '../components/ProjectAnalytics';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'board';
  const setActiveTab = (tab) => setSearchParams({ tab });
  const [yourRole, setYourRole] = useState('member');

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.project);
      setTasks(data.tasks);
      setYourRole(data.yourRole);
    } catch (err) {
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Real-time sync: join the project's room and react to events from teammates
  useEffect(() => {
    socket.emit('joinProject', id);

    const onTaskCreated = (task) => setTasks((prev) => [...prev, task]);
    const onTaskUpdated = (task) => setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    const onTaskMoved = ({ taskId, status, order }) =>
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status, order } : t)));
    const onTaskDeleted = ({ taskId }) => setTasks((prev) => prev.filter((t) => t._id !== taskId));

    socket.on('taskCreated', onTaskCreated);
    socket.on('taskUpdated', onTaskUpdated);
    socket.on('taskMoved', onTaskMoved);
    socket.on('taskDeleted', onTaskDeleted);

    return () => {
      socket.emit('leaveProject', id);
      socket.off('taskCreated', onTaskCreated);
      socket.off('taskUpdated', onTaskUpdated);
      socket.off('taskMoved', onTaskMoved);
      socket.off('taskDeleted', onTaskDeleted);
    };
  }, [id]);

  const handleDropTask = async (taskId, newStatus) => {
    // optimistic update
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    await api.patch(`/tasks/${taskId}/move`, { status: newStatus });
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !project) return;
    await api.post(`/projects/${id}/tasks`, {
      title: newTaskTitle,
      status: project.columns[0],
    });
    setNewTaskTitle('');
  };

  const handleInlineQuickAdd = async (title, status) => {
    if (!title.trim() || !project) return;
    await api.post(`/projects/${id}/tasks`, {
      title: title.trim(),
      status: status || project.columns[0],
    });
  };

  if (loading || !project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const tabs = [
    { id: 'board', name: 'Board', icon: <Layout className="h-4 w-4" /> },
    { id: 'calendar', name: 'Calendar', icon: <CalendarIcon className="h-4 w-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'team', name: 'Team', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Project Header Info & Tab Navigation */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942]/60 dark:bg-[#12182b]/40 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{project.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{project.description || 'No description'}</p>
            </div>

            {activeTab === 'board' && (
              <form onSubmit={handleQuickAdd} className="flex gap-2">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Quick add a task…"
                  className="w-56 rounded-xl border border-slate-200 bg-slate-50 dark:border-[#1e2942]/60 dark:bg-[#0d1326] dark:text-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-[#101730]"
                />
                <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition shadow-sm">
                  Add Task
                </button>
              </form>
            )}
          </div>

          <div className="flex gap-1 border-t border-slate-100 dark:border-[#1e2942]/30 pt-4 overflow-x-auto">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${active
                      ? 'bg-brand-650/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-[#12182b]/30 dark:hover:text-slate-200'
                    }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="animate-in fade-in duration-200">
          {activeTab === 'board' && (
            <DndProvider backend={HTML5Backend}>
              <Board
                columns={project.columns}
                tasks={tasks}
                onDropTask={handleDropTask}
                onOpenTask={setActiveTask}
                onQuickAdd={handleInlineQuickAdd}
              />
            </DndProvider>
          )}

          {activeTab === 'calendar' && (
            <ProjectCalendar project={project} tasks={tasks} onOpenTask={setActiveTask} />
          )}

          {activeTab === 'analytics' && (
            <ProjectAnalytics project={project} tasks={tasks} />
          )}

          {activeTab === 'team' && (
            <ProjectTeam
              project={project}
              tasks={tasks}
              yourRole={yourRole}
              onUpdateProject={(updatedProject) => setProject(updatedProject)}
            />
          )}
        </div>
      <TaskModal task={activeTask} onClose={() => setActiveTask(null)} />
    </div>
  );
};

export default Project;
