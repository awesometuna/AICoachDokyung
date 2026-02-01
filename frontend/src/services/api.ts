export const API_BASE_URL = 'http://localhost:8000';

// Response from Syllabus Parse (Preview)
export interface SyllabusPreview {
  filename: string;
  tasks_preview: Task[]; // These tasks have temporary IDs and string dates
}

export const uploadSyllabus = async (file: File): Promise<SyllabusPreview> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/parse/syllabus`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
};

export const createTasksBatch = async (tasks: Partial<Task>[]): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tasks)
  });
  if (!response.ok) throw new Error('Batch create failed');
};

export interface UserProfile {
  name: string;
  target_career: string;
}

export interface ChatRequest {
  message: string;
}

export interface SuggestedAction {
  title: string;
  duration_min: number;
  type: string;
}

export interface Analysis {
  user_mood: string;
  emotion_intensity: number;
  // Add others if needed for frontend display
}

export interface ServerAction {
  action_type: string;
  data: any;
}

export interface ChatResponse {
  analysis: Analysis;
  coach_thought: string;
  message_to_user: string;
  suggested_action?: SuggestedAction;
  server_action?: ServerAction;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date?: string;
  is_completed: boolean;
  status: 'todo' | 'in_progress' | 'done';
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE_URL}/api/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error('Chat failed');
  return response.json();
};

export const updateProfile = async (profile: UserProfile): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
}

export const fetchProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/api/profile`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export interface HistoryMessage {
  id: number;
  role: string;
  content: string;
  is_json: boolean;
  created_at: string;
}

export const fetchChatHistory = async (): Promise<HistoryMessage[]> => {
  const response = await fetch(`${API_BASE_URL}/api/chat/history`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}
