import React, { useState } from 'react';
import { type Task } from '../../services/api';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onSave: (id: number, status: 'todo' | 'in_progress' | 'done') => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onSave }) => {
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>(task.status || 'todo');

  const handleSave = () => {
    onSave(task.id, status);
    onClose();
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'done': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</label>
            <div className="mt-1 text-gray-900 font-medium">
              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No Date'}
              {task.due_date && <span className="text-gray-400 text-sm ml-2">({new Date(task.due_date).toLocaleString('en-us', { weekday: 'short' })})</span>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
            <div className="mt-1 text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 h-24 overflow-y-auto custom-scrollbar">
              {task.description || "No description provided."}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Status (진행단계)</label>
            <div className="flex gap-2">
              {['todo', 'in_progress', 'done'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s as any)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${status === s
                    ? getStatusColor(s) + ' ring-2 ring-offset-1 ring-blue-300'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {s === 'todo' ? '시작전' : s === 'in_progress' ? '진행중' : '완료'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 active:transform active:scale-95 transition-all"
          >
            UPDATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
