import { useDrag } from 'react-dnd';
import { MessageSquare, Paperclip, Calendar, CheckSquare } from 'lucide-react';

const priorityBorders = {
  urgent: 'border-l-red-500 border-l-[3.5px]',
  high: 'border-l-amber-500 border-l-[3.5px]',
  medium: 'border-l-indigo-500 border-l-[3.5px]',
  low: 'border-l-slate-500 border-l-[3.5px]',
};

const priorityLabels = {
  urgent: 'bg-red-500/10 text-red-400 border border-red-550/20',
  high: 'bg-amber-500/10 text-amber-400 border border-amber-550/20',
  medium: 'bg-indigo-500/10 text-indigo-400 border border-indigo-550/20',
  low: 'bg-slate-500/10 text-slate-400 border border-slate-550/20',
};

const TaskCard = ({ task, onOpen }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const totalChecklist = task.checklist?.length || 0;
  const completedChecklist = task.checklist?.filter((item) => item.done).length || 0;
  const progressPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;
  const hasChecklist = totalChecklist > 0;

  const mockCommentsCount = Math.abs(task._id?.charCodeAt(task._id.length - 1) % 5) || 1;

  return (
    <div
      ref={dragRef}
      onClick={() => onOpen(task)}
      className={`cursor-pointer rounded-xl border border-[#1e2942]/60 bg-[#0d1326]/60 p-4 shadow-sm transition hover:shadow-md hover:brightness-110 ${
        priorityBorders[task.priority] || priorityBorders.medium
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
          priorityLabels[task.priority] || priorityLabels.medium
        }`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      <p className="mb-2 text-sm font-semibold text-slate-200 line-clamp-2">{task.title}</p>

      {task.labels?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.labels.map((l) => (
            <span key={l} className="rounded bg-[#1c243a] px-1.5 py-0.5 text-[9px] font-semibold text-slate-400">
              #{l}
            </span>
          ))}
        </div>
      )}

      {/* Checklist Progress Meter */}
      {hasChecklist && (
        <div className="mb-3 space-y-1">
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase">
            <span className="flex items-center gap-1"><CheckSquare className="h-3 w-3" /> Checklist</span>
            <span>{completedChecklist}/{totalChecklist}</span>
          </div>
          <div className="h-1 w-full bg-[#182035] rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-[#1e2942]/30 pt-3">
        {/* Footers Stats - Comments & Attachments */}
        <div className="flex items-center gap-2.5 text-slate-500">
          <span className="flex items-center gap-1 text-[10px] font-semibold">
            <MessageSquare className="h-3.5 w-3.5" />
            {mockCommentsCount}
          </span>
          {task.attachments?.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold">
              <Paperclip className="h-3.5 w-3.5" />
              {task.attachments.length}
            </span>
          )}
        </div>

        {/* Assignee initials list */}
        <div className="flex -space-x-1.5">
          {task.assignedTo?.slice(0, 3).map((u) => (
            <div
              key={u._id}
              title={u.name}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0d1326] bg-brand-600/10 text-[9px] font-bold text-brand-400"
            >
              {u.name?.[0]?.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
