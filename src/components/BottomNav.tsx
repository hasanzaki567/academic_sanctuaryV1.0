import React from 'react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  if (currentView === 'landing' || currentView === 'create-classroom') {
    return null;
  }

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'subjects', label: 'Subjects', icon: 'book' },
    { id: 'notes', label: 'Notes', icon: 'description' },
    { id: 'exams', label: 'Exams', icon: 'quiz' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-white/95 backdrop-blur-md md:hidden rounded-t-2xl border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
      {navItems.map((item) => {
        const isActive =
          currentView === item.id ||
          (item.id === 'subjects' && currentView === 'subject-detail');

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#1E3A8A] text-white font-bold rounded-full px-4 py-1.5 shadow-sm scale-100'
                : 'text-[#64748B] hover:bg-[#F1F5F9] px-2 py-1 rounded-xl'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-medium mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
