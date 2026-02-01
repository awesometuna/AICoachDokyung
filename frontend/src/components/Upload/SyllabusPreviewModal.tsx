import React, { useState } from 'react';
import { type Task } from '../../services/api';

interface SyllabusPreviewModalProps {
  tasks: Task[];
  onConfirm: (selectedTasks: Task[]) => void;
  onCancel: () => void;
}

const SyllabusPreviewModal: React.FC<SyllabusPreviewModalProps> = ({ tasks, onConfirm, onCancel }) => {
  // By default, select all tasks
  const [selectedIds, setSelectedIds] = useState<number[]>(tasks.map(t => t.id));

  const toggleTask = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirm = () => {
    const selected = tasks.filter(t => selectedIds.includes(t.id));
    onConfirm(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 flex flex-col h-[600px] border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Preview Parsed Tasks</h2>
            <p className="text-sm text-gray-500">Select tasks to add to your calendar.</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 border border-gray-100 rounded-lg p-2 bg-gray-50 custom-scrollbar space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer ${selectedIds.includes(task.id)
                ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100'
                : 'bg-gray-100 border-transparent opacity-60'
                }`}
              onClick={() => toggleTask(task.id)}
            >
              <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${selectedIds.includes(task.id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                }`}>
                {selectedIds.includes(task.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold text-gray-900 ${!selectedIds.includes(task.id) && 'line-through text-gray-500'}`}>{task.title}</h3>
                  {task.due_date && <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{task.due_date}</span>}
                </div>
                <p className={`text-sm text-gray-600 mt-1 line-clamp-2 ${!selectedIds.includes(task.id) && 'text-gray-400'}`}>{task.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            Selected: <span className="font-bold text-gray-900">{selectedIds.length}</span> / {tasks.length}
          </span>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              Add {selectedIds.length} Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusPreviewModal;
