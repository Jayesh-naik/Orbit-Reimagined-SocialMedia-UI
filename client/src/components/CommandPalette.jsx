import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, Kanban, Sparkles, Folder, CheckCircle, Calendar, X } from 'lucide-react';
import { mockStorage } from '../services/mockStorage';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent state or keyboard event
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const projects = mockStorage.getProjects();
  const tasks = mockStorage.getTasks();

  const filteredProjects = projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredTasks = tasks.filter(
    (t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.labels?.some((l) => l.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelectProject = (projId) => {
    navigate(`/projects/${projId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white dark:border-[#1e2942] dark:bg-[#0c101d] shadow-2xl overflow-hidden">
        
        {/* Search Input Field */}
        <div className="relative flex items-center border-b border-slate-100 dark:border-[#1e2942]/60 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, projects..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4">
          
          {/* Quick Actions */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
              Quick Navigation
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  navigate('/dashboard');
                  onClose();
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c33] transition"
              >
                <LayoutGrid className="h-4 w-4 text-brand-500" />
                <span>Go to Workspace Dashboard</span>
              </button>
              <button
                onClick={() => {
                  navigate('/projects/proj-1?tab=analytics');
                  onClose();
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c33] transition"
              >
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Open FlowBoard AI Analytics</span>
              </button>
            </div>
          </div>

          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
                Projects ({filteredProjects.length})
              </span>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => handleSelectProject(p._id)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c33] transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Folder className="h-4 w-4 text-brand-500" />
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{p.columns?.length || 4} Columns</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-1.5">
                Tasks ({filteredTasks.length})
              </span>
              <div className="space-y-1">
                {filteredTasks.slice(0, 5).map((t) => (
                  <button
                    key={t._id}
                    onClick={() => handleSelectProject(t.project)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151c33] transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="truncate max-w-[280px]">{t.title}</span>
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-[#19223c] px-2 py-0.5 text-[9px] font-bold text-brand-400 uppercase">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="border-t border-slate-100 dark:border-[#1e2942]/60 px-4 py-2 text-[10px] text-slate-400 dark:text-slate-500 flex justify-between bg-slate-50/50 dark:bg-[#080b14]">
          <span>Tip: Use ↑ ↓ to navigate</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
