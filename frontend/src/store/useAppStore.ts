import { create } from 'zustand';
import { fetchTasks, sendMessage, type Task, type ChatResponse, type UserProfile, updateProfile, fetchProfile, type SuggestedAction, fetchChatHistory, updateTask } from '../services/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  action?: SuggestedAction;
}

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  tasks: Task[];
  loadTasks: () => Promise<void>;

  currentDate: Date;
  changeWeek: (offset: number) => void;

  // Chat
  messages: Message[];
  sendUserMessage: (text: string) => Promise<void>;
  loadHistory: () => Promise<void>;

  // Profile
  userProfile: UserProfile | null;
  loadProfile: () => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;

  // Task Actions
  updateTaskStatus: (id: number, status: 'todo' | 'in_progress' | 'done') => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  tasks: [],
  loadTasks: async () => {
    const tasks = await fetchTasks();
    set({ tasks });
  },

  currentDate: new Date(),
  changeWeek: (offset: number) => set((state) => {
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() + (offset * 7));
    return { currentDate: newDate };
  }),

  // Initial greeting will be overwritten by history if exists
  messages: [{ id: 0, text: "안녕하세요! 오늘 기분은 어떠신가요?", isUser: false }],

  loadHistory: async () => {
    try {
      const history = await fetchChatHistory();
      if (history.length > 0) {
        const mappedMessages = history.map((msg: any) => {
          let text = msg.content;
          let action = undefined;

          if (msg.role === 'assistant' && msg.is_json) {
            try {
              const data = JSON.parse(msg.content);
              text = data.message_to_user;
              action = data.suggested_action;
            } catch (e) {
              console.error("JSON parse error in history", e);
            }
          }

          return {
            id: msg.id,
            text: text,
            isUser: msg.role === 'user',
            action: action
          };
        });
        set({ messages: mappedMessages });
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  },

  sendUserMessage: async (text: string) => {
    // 1. Add User Message
    const userMsg = { id: Date.now(), text, isUser: true };
    set((state) => ({ messages: [...state.messages, userMsg] }));

    try {
      // 2. Call API
      const response: ChatResponse = await sendMessage(text);

      // 3. Add AI Message (with Action if available)
      const aiMsg = {
        id: Date.now() + 1,
        text: response.message_to_user,
        isUser: false,
        action: response.suggested_action
      };
      set((state) => ({ messages: [...state.messages, aiMsg] }));

      // 4. Handle Server Action (Refresh Calendar)
      if (response.server_action && response.server_action.action_type === 'create_task') {
        // Reload tasks to show the new one
        await get().loadTasks();
      }

    } catch (e) {
      console.error(e);
      const errorMsg = { id: Date.now() + 1, text: "오류가 발생했습니다.", isUser: false };
      set((state) => ({ messages: [...state.messages, errorMsg] }));
    }
  },

  // Task Actions
  updateTaskStatus: async (id, status) => {
    try {
      const updated = await updateTask(id, { status });
      set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? updated : t)
      }));
    } catch (e) {
      console.error("Failed to update task status", e);
    }
  },

  userProfile: null,
  loadProfile: async () => {
    try {
      const profile = await fetchProfile();
      // If profile exists (has name), set it
      if (profile.name) set({ userProfile: profile });
    } catch (e) {
      console.log("No profile found or error");
    }
  },
  saveProfile: async (profile: UserProfile) => {
    await updateProfile(profile);
    set({ userProfile: profile });
  }
}));
