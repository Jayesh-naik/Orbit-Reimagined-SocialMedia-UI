import { useState } from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { Plus, X } from 'lucide-react';

const Column = ({ column, tasks, onDropTask, onOpenTask, onQuickAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => {
      if (item.status !== column) {
        onDropTask(item.id, column);
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onQuickAdd(title.trim(), column);
    setTitle('');
    setIsAdding(false);
  };

  return (
    <div
      ref={dropRef}
      className={`flex w-80 shrink-0 flex-col rounded-2xl bg-[#090d16]/80 border border-[#1e2942]/40 p-4 transition-all ${
        isOver ? 'ring-2 ring-brand-500 bg-[#10172e]/60' : ''
      }`}
    >
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-550" />
          <h3 className="text-sm font-bold text-slate-200">{column}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#182035] text-[10px] font-bold text-slate-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-lg p-1 text-slate-500 hover:bg-[#12182b] hover:text-white transition"
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      {/* Task List container */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
        {/* Inline Task Form */}
        {isAdding && (
          <form onSubmit={handleQuickAddSubmit} className="rounded-xl border border-brand-500/50 bg-[#0d1326] p-3 shadow-md animate-in slide-in-from-top-1 duration-150">
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder-slate-500"
            />
            <div className="mt-2 flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded px-2 py-1 text-[10px] font-bold text-slate-400 hover:bg-[#12182b] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-brand-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-brand-700 transition"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onOpen={onOpenTask} />
        ))}
      </div>
    </div>
  );
};

const Board = ({ columns, tasks, onDropTask, onOpenTask, onQuickAdd }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
      {columns.map((col) => (
        <Column
          key={col}
          column={col}
          tasks={tasks.filter((t) => t.status === col)}
          onDropTask={onDropTask}
          onOpenTask={onOpenTask}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
};

export default Board;
