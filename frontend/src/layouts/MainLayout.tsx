import React, { useEffect } from 'react';
import CalendarView from '../components/Calendar/CalendarView';
import ChatSidebar from '../components/Chat/ChatSidebar';
import ProfilePage from '../pages/ProfilePage';
import { useAppStore } from '../store/useAppStore';

const MainLayout: React.FC = () => {
  const { userProfile, loadProfile } = useAppStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (!userProfile) {
    return (
      <div className="flex h-screen bg-warm-white">
        <ProfilePage />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-warm-white overflow-hidden">
      {/* Main Content Area (Calendar) */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <CalendarView />
      </main>

      {/* Right Sidebar (Chat) */}
      <aside className="h-full relative z-20">
        <ChatSidebar />
      </aside>
    </div>
  );
};

export default MainLayout;

