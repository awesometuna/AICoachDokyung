import React, { useEffect, useState } from 'react';
import FileDropZone from '../Upload/FileDropZone';
import { useAppStore } from '../../store/useAppStore';
import { type Task } from '../../services/api';
import TaskDetailModal from './TaskDetailModal';

const CalendarView: React.FC = () => {
  const { tasks, loadTasks, currentDate, changeWeek, updateTaskStatus } = useAppStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle Save from Modal
  const handleTaskSave = (id: number, status: 'todo' | 'in_progress' | 'done') => {
    updateTaskStatus(id, status);
    // Optimistic update logic is in store, just close modal
    // Ideally wait for store but MVP fine
  };

  // Helper for status styles
  const getTaskStyles = (status: string) => {
    switch (status) {
      case 'in_progress': return 'border-l-blue-500 bg-blue-50 ring-1 ring-blue-200';
      case 'done': return 'border-l-green-500 bg-green-50 opacity-60 grayscale-[0.5] decoration-slate-400';
      default: return 'border-l-sunset-coral bg-white hover:bg-orange-50'; // Todo
    }
  };

  // Calculate start of the week (Monday)
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    start.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const monthYear = weekDays[0].toLocaleString('default', { month: 'long', year: 'numeric' });

  // Helper: Checks if a task falls on a specific date string (YYYY-MM-DD)
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];

    return tasks.filter(t => {
      if (!t.due_date) return false;
      return t.due_date.startsWith(dateStr);
    });
  };

  // Undated tasks fallback (e.g. show on Mon or separate list)
  const undatedTasks = tasks.filter(t => !t.due_date);

  return (
    <div className="flex-1 h-full bg-pure-white p-8 overflow-y-auto relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-charcoal">Weekly Schedule</h1>
          <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-sunset-border shadow-sm">
            <button onClick={() => changeWeek(-1)} className="px-3 py-1 text-warm-gray hover:text-sunset-coral font-bold">
              &lt;
            </button>
            <span className="font-semibold text-charcoal min-w-[120px] text-center">{monthYear}</span>
            <button onClick={() => changeWeek(1)} className="px-3 py-1 text-warm-gray hover:text-sunset-coral font-bold">
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dateTasks = getTasksForDate(day);
            const isMonday = index === 0;
            const showUndated = isMonday && undatedTasks.length > 0;

            return (
              <div key={day.toISOString()} className={`bg-white p-4 rounded-xl border border-sunset-border h-96 flex flex-col hover:bg-warm-white transition-colors duration-200 ${day.toDateString() === new Date().toDateString() ? 'ring-2 ring-sunset-coral ring-opacity-50' : ''}`}>
                <div className="font-medium text-charcoal mb-4 border-b border-sunset-border pb-2 flex justify-between">
                  <span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
                  <span className="text-sm text-warm-gray">{day.getDate()}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {/* Real Date Tasks */}
                  {dateTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-3 rounded-lg border border-sunset-border border-l-4 shadow-sm cursor-pointer hover:shadow-md transition-all group relative ${getTaskStyles(task.status || 'todo')}`}
                    >
                      <div className={`text-sm font-semibold text-charcoal ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>{task.title}</div>
                      <div className="text-xs text-warm-gray mt-1 line-clamp-1">{task.description}</div>

                      {/* Status Badge (Mini) */}
                      {task.status === 'in_progress' && <div className="mt-1 text-[10px] text-blue-600 font-bold tracking-wide">● 진행중</div>}
                      {task.status === 'done' && <div className="mt-1 text-[10px] text-green-600 font-bold tracking-wide">✔ 완료</div>}
                    </div>
                  ))}

                  {/* Simplified fallback for undated tasks on Monday (Temporary Logic) */}
                  {showUndated && undatedTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 shadow-sm cursor-pointer hover:shadow-md transition-shadow opacity-80"
                    >
                      <div className="text-sm font-semibold text-gray-500">? {task.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <h3 className="font-semibold text-charcoal mb-2">New Task (Upload Syllabus)</h3>
          <FileDropZone />
        </div>
      </div>

      {/* Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
};

export default CalendarView;
