import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const ProfilePage: React.FC = () => {
  const { userProfile, loadProfile, saveProfile } = useAppStore();
  const [name, setName] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadProfile();
      setIsLoading(false);
    };
    init();
  }, [loadProfile]);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setTargetCareer(userProfile.target_career);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetCareer.trim()) return;
    try {
      await saveProfile({ name, target_career: targetCareer });
    } catch (error) {
      alert("서버 오류: 백엔드가 실행 중인지 확인해주세요.");
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-warm-white">Loading...</div>;

  // Logic to "hide" this page if profile exists is handled in Layout or MainView.
  // Here we just render the form.

  return (
    <div className="flex flex-col items-center justify-center h-full bg-pure-white p-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-sunset-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Welcome to Coach Dokyung</h1>
          <p className="text-warm-gray">Let's set up your profile to start coaching.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-charcoal mb-2">Name / Nickname</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-sunset-border focus:ring-2 focus:ring-sunset-coral focus:border-transparent"
              placeholder="e.g. Won"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-charcoal mb-2">Target Career</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-sunset-border focus:ring-2 focus:ring-sunset-coral focus:border-transparent"
              placeholder="e.g. Service Planner, Developer"
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
            />
            <p className="text-xs text-warm-gray mt-2">Coach Dokyung will align tasks with this goal.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sunset-coral text-white font-bold rounded-xl hover:bg-deep-coral transition-colors shadow-md"
          >
            Save & Start
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
