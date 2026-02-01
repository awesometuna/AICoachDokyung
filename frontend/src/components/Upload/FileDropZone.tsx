import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadSyllabus, createTasksBatch, type Task } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';
import SyllabusPreviewModal from './SyllabusPreviewModal';

const FileDropZone: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { loadTasks } = useAppStore();

  // Preview State
  const [previewTasks, setPreviewTasks] = useState<Task[] | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload & Parse (No Save)
      const data = await uploadSyllabus(file);
      // 2. Open Preview Modal
      setPreviewTasks(data.tasks_preview);
    } catch (error) {
      console.error(error);
      alert("Failed to upload/parse file.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleConfirmTasks = async (selectedTasks: Task[]) => {
    if (!selectedTasks || selectedTasks.length === 0) return;

    setIsUploading(true);
    try {
      // 3. Batch Create
      await createTasksBatch(selectedTasks);
      // 4. Refresh Calendar
      await loadTasks();
      setPreviewTasks(null); // Close Modal
    } catch (e) {
      console.error(e);
      alert("Failed to save tasks.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

  return (
    <>
      <div
        {...getRootProps()}
        className={`
                mt-8 p-10 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer
                ${isDragActive ? 'border-sunset-coral bg-orange-50' : 'border-sunset-border bg-white hover:bg-warm-white'}
            `}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-4">📄</div>
        <h3 className="font-semibold text-charcoal mb-2">
          {isUploading ? '도경이가 분석 중이에요... 🧠' : '강의 계획서를 넣어주세요'}
        </h3>
        <p className="text-warm-gray text-sm mb-4">
          {isUploading ? '잠시만 기다려주세요.' : 'PDF나 이미지를 드래그하거나 클릭하여 업로드'}
        </p>
      </div>

      {/* Preview Modal */}
      {previewTasks && (
        <SyllabusPreviewModal
          tasks={previewTasks}
          onConfirm={handleConfirmTasks}
          onCancel={() => setPreviewTasks(null)}
        />
      )}
    </>
  );
};

export default FileDropZone;
