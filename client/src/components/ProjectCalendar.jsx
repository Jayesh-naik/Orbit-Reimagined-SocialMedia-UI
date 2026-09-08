import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const ProjectCalendar = ({ project, tasks = [], onOpenTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Start date and count of days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(year, month - 1, prevMonthTotalDays - i),
      currentMonth: false,
    });
  }

  // Active month days
  for (let i = 1; i <= totalDays; i++) {
    calendarCells.push({
      date: new Date(year, month, i),
      currentMonth: true,
    });
  }

  // Next month padding
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      date: new Date(year, month + 1, i),
      currentMonth: false,
    });
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getTaskColorClass = (task) => {
    const completedCol = project?.columns?.[project?.columns?.length - 1];
    if (task.status === completedCol) {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
    if (task.priority === 'urgent') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (task.priority === 'high') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (task.priority === 'medium') return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-250">
      {/* Calendar Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-brand-500" /> Calendar
          </h2>
          <p className="text-xs text-slate-550 mt-0.5">Track milestones and task schedules</p>
        </div>

        <div className="flex items-center gap-4 bg-[#0d1326]/50 px-3.5 py-1.5 rounded-xl border border-[#1e2942]/60 shadow-sm">
          <button
            onClick={prevMonth}
            className="rounded-lg p-1 text-slate-450 hover:bg-[#12182b] hover:text-white transition"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <span className="text-xs font-bold text-slate-200 min-w-28 text-center select-none uppercase tracking-wider">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="rounded-lg p-1 text-slate-455 hover:bg-[#12182b] hover:text-white transition"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2942]/60 bg-[#090d16] shadow-sm">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-[#1e2942]/60 bg-[#0d1326]/30 text-center">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#1e2942]/40 bg-[#1e2942]/20">
          {calendarCells.map(({ date, currentMonth }, index) => {
            const dayTasks = getTasksForDate(date);
            const activeDay = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-[110px] p-2 bg-[#090d16] flex flex-col justify-between transition-all ${
                  !currentMonth ? 'opacity-30' : ''
                }`}
              >
                {/* Date Label */}
                <div className="flex justify-between items-center mb-1.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center text-xs font-bold rounded-full ${
                      activeDay
                        ? 'bg-brand-650 text-white shadow-sm shadow-brand-500/35 border border-brand-500/20'
                        : 'text-slate-400'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[9px] font-bold text-slate-550 uppercase">
                      {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Tasks List inside calendar cell */}
                <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[80px]">
                  {dayTasks.map((task) => (
                    <button
                      key={task._id}
                      onClick={() => onOpenTask(task)}
                      className={`w-full text-left truncate text-[9px] font-bold rounded-lg px-2 py-1 border transition-all hover:scale-[1.02] ${
                        getTaskColorClass(task)
                      }`}
                      title={`${task.title} (${task.priority})`}
                    >
                      {task.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Priorities:</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500/10 border border-emerald-500/35" /> Completed</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-red-500/10 border border-red-500/35" /> Urgent</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500/10 border border-amber-500/35" /> High</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-indigo-500/10 border border-indigo-500/35" /> Medium</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-slate-500/10 border border-slate-500/35" /> Low</span>
      </div>
    </div>
  );
};

export default ProjectCalendar;
