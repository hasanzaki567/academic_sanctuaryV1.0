import React, { useState } from 'react';
import { Classroom, User, Announcement } from '../types';
import { Bell, ArrowLeft, School, Plus, LogIn, ChevronDown, Check, Users, Sparkles, BookOpen, UserPlus, LogOut, KeyRound, MessageCircle } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  activeClassroom: Classroom | null;
  currentUser: User | null;
  announcements: Announcement[];
  classrooms: Classroom[];
  onNavigate: (view: string, data?: any) => void;
  onBack?: () => void;
  canGoBack?: boolean;
  onOpenCreateClassroom: () => void;
  onOpenJoinClassroom: () => void;
  onSelectClassroom: (classroom: Classroom) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeClassroom,
  currentUser,
  announcements,
  classrooms,
  onNavigate,
  onBack,
  canGoBack = false,
  onOpenCreateClassroom,
  onOpenJoinClassroom,
  onSelectClassroom,
  onOpenAuth,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClassroomDropdown, setShowClassroomDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // If on landing page
  if (currentView === 'landing') {
    return (
      <header className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-5 flex justify-between items-center z-50 bg-[#FDFCF8]/90 backdrop-blur-sm sticky top-0 border-b border-[#E5E4E2]/60">
        <div 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-3 text-[#56615a] cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center font-bold">
            <School className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl tracking-tight text-[#1b1c1c] group-hover:text-[#56615a] transition-colors leading-none">
              Academic Sanctuary
            </span>
            <span className="text-[11px] text-[#737874] font-medium tracking-wide">Single Classroom Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-[#56615a] text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#434d46] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Go to My Cohort</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:flex items-center gap-1.5 border border-[#E5E4E2] text-[#434844] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#F0EDED] transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#56615a]" />
                <span>Switch User</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="text-[#434844] hover:text-[#1b1c1c] px-3.5 py-2 font-semibold text-xs sm:text-sm transition-colors rounded-xl hover:bg-[#F0EDED] flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#56615a]" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="bg-[#56615a] text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#434d46] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      </header>
    );
  }

  const showBackButton = onBack && (canGoBack || currentView !== 'dashboard');

  return (
    <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-3 bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#E5E4E2]">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBack ? onBack : () => onNavigate('dashboard')}
            className="text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c] rounded-full p-2 transition-colors flex items-center justify-center cursor-pointer"
            title="Go back to most recent page/feature"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
        )}

        <div 
          onClick={() => onNavigate('profile')}
          className="w-10 h-10 rounded-full bg-[#E4E2E1] overflow-hidden flex-shrink-0 cursor-pointer border border-[#C3C8C3] hover:opacity-90 transition-opacity"
          title="My Profile & Enrolled Cohort"
        >
          <img
            src={currentUser?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A'}
            alt={currentUser?.name || 'User'}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xl md:text-2xl font-bold text-[#56615a] tracking-tight hover:opacity-80 transition-opacity text-left flex items-center gap-2"
          >
            Digital Library
          </button>

          {activeClassroom && (
            <div className="relative">
              <button
                onClick={() => setShowClassroomDropdown(!showClassroomDropdown)}
                className="hidden sm:flex items-center gap-2 ml-2 px-3.5 py-1.5 bg-[#d9e6dc]/80 hover:bg-[#d9e6dc] rounded-2xl text-xs sm:text-sm font-bold text-[#2d312e] border border-[#b2beb5]/80 transition-all shadow-2xs cursor-pointer"
                title="Your Enrolled Cohort (1 Classroom Rule)"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#56615a]"></span>
                <span className="truncate max-w-[200px]">{activeClassroom.code} • {activeClassroom.section}</span>
                <ChevronDown className="w-4 h-4 text-[#56615a]" />
              </button>

              {showClassroomDropdown && (
                <div className="absolute left-0 mt-3 w-88 sm:w-[420px] bg-white rounded-3xl shadow-2xl border-2 border-[#E5E4E2] p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-1 py-1 text-xs font-extrabold text-[#56615a] uppercase tracking-wider flex items-center justify-between">
                    <span>Enrolled Cohort</span>
                    <span className="text-xs bg-[#56615a]/10 text-[#56615a] border border-[#56615a]/25 px-2.5 py-1 rounded-lg font-mono font-bold">
                      1 CLASSROOM LOCK
                    </span>
                  </div>

                  <div className="p-4 bg-[#F9F6EE] rounded-2xl border-2 border-[#E5E4E2] mt-2 mb-4 shadow-2xs">
                    <div className="text-base sm:text-lg font-black text-[#1b1c1c] leading-snug">
                      {activeClassroom.name}
                    </div>
                    <div className="text-xs sm:text-sm text-[#56615a] font-medium mt-1">
                      {activeClassroom.collegeName}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-[#D8D6D4] text-xs sm:text-sm font-mono font-bold text-[#1b1c1c] shadow-2xs">
                        <span className="text-[#737874] font-sans font-normal">Code:</span> {activeClassroom.code}
                      </span>
                      <span className="text-xs font-bold text-[#56615a] bg-[#d9e6dc] px-2.5 py-1 rounded-xl">
                        {activeClassroom.section}
                      </span>
                    </div>
                  </div>

                  {classrooms.length > 1 && (
                    <div className="space-y-1.5 mt-3 pt-3 border-t-2 border-[#F0EDED]">
                      <div className="px-1 text-xs font-extrabold text-[#737874] uppercase tracking-wider mb-2">
                        Available Cohorts
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {classrooms.map((cls) => (
                          <button
                            key={cls.id}
                            onClick={() => {
                              onSelectClassroom(cls);
                              setShowClassroomDropdown(false);
                            }}
                            className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 text-sm sm:text-base hover:bg-[#F0EDED] transition-all cursor-pointer border ${
                              activeClassroom.id === cls.id
                                ? 'bg-[#d9e6dc]/60 border-[#56615a]/40 font-bold text-[#1b1c1c] shadow-2xs'
                                : 'border-transparent text-[#2d312e]'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-[#E5E4E2] text-[#56615a]">
                                  {cls.code}
                                </span>
                                <span className="text-xs text-[#737874]">{cls.section}</span>
                              </div>
                              <div className="font-bold truncate text-[#1b1c1c] text-sm">
                                {cls.name}
                              </div>
                            </div>
                            {activeClassroom.id === cls.id && (
                              <div className="w-6 h-6 rounded-full bg-[#56615a] text-white flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-[#F0EDED] mt-4 pt-4 space-y-2.5">
                    <button
                      onClick={() => {
                        setShowClassroomDropdown(false);
                        onOpenCreateClassroom();
                      }}
                      className="w-full text-left px-4 py-3.5 text-sm sm:text-base font-bold text-[#56615a] bg-[#F9F6EE] hover:bg-[#EDE9DF] border border-[#E5E4E2] rounded-2xl flex items-center gap-3 transition-colors cursor-pointer shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#56615a] text-white flex items-center justify-center flex-shrink-0">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span>Create New Cohort</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowClassroomDropdown(false);
                        onOpenJoinClassroom();
                      }}
                      className="w-full text-left px-4 py-3.5 text-sm sm:text-base font-bold text-[#1b1c1c] bg-[#F0EDED] hover:bg-[#E4E2E1] border border-[#E5E4E2] rounded-2xl flex items-center gap-3 transition-colors cursor-pointer shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#1b1c1c] text-white flex items-center justify-center flex-shrink-0">
                        <LogIn className="w-4 h-4" />
                      </div>
                      <span>Join Cohort with Code</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'dashboard'
              ? 'text-[#1b1c1c] font-bold bg-[#F0EDED]'
              : 'text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c]'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('subjects')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'subjects' || currentView === 'subject-detail'
              ? 'text-[#56615a] font-bold bg-[#F0EDED]'
              : 'text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c]'
          }`}
        >
          Subjects
        </button>
        <button
          onClick={() => onNavigate('notes')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'notes'
              ? 'text-[#56615a] font-bold bg-[#F0EDED]'
              : 'text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c]'
          }`}
        >
          Notes & PYQs
        </button>
        <button
          onClick={() => onNavigate('exams')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'exams'
              ? 'text-[#56615a] font-bold bg-[#F0EDED]'
              : 'text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c]'
          }`}
        >
          Exams
        </button>
        <button
          onClick={() => onNavigate('members')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            currentView === 'members'
              ? 'text-[#56615a] font-bold bg-[#F0EDED]'
              : 'text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c]'
          }`}
        >
          Members
        </button>
        <button
          id="navbar-chat-tab"
          onClick={() => onNavigate('chat')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
            currentView === 'chat'
              ? 'text-[#56615a] font-bold bg-[#F0EDED]'
              : 'text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c]'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat</span>
        </button>
      </nav>

      {/* Right Actions: Notifications & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Chat Quick Action */}
        <button
          id="navbar-chat-icon-btn"
          onClick={() => onNavigate('chat')}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors relative cursor-pointer ${
            currentView === 'chat' ? 'bg-[#56615a] text-white' : 'text-[#434844] hover:bg-[#F0EDED]'
          }`}
          title="Cohort Chat"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#434844] hover:bg-[#F0EDED] transition-colors relative cursor-pointer"
            title="Announcements & Alerts"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {announcements.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-[#FDFCF8]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-88 sm:w-[420px] bg-white rounded-3xl shadow-2xl border-2 border-[#E5E4E2] p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#F0EDED]">
                <div className="flex items-center gap-2.5 text-[#1b1c1c] font-black text-base sm:text-lg">
                  <div className="w-8 h-8 rounded-xl bg-[#56615a]/10 flex items-center justify-center text-[#56615a]">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      campaign
                    </span>
                  </div>
                  <span>Class Announcements</span>
                </div>
                <span className="text-xs font-bold text-[#56615a] bg-[#d9e6dc] px-2.5 py-1 rounded-xl">
                  {announcements.length} updates
                </span>
              </div>
              <div className="divide-y divide-[#F0EDED] max-h-96 overflow-y-auto mt-2 pr-1 space-y-1">
                {announcements.map((ann) => (
                  <div key={ann.id} className="py-3.5 px-2.5 hover:bg-[#F9F8F6] rounded-2xl transition-colors">
                    <div className="flex items-center justify-between text-xs text-[#737874] mb-1">
                      <span className="font-bold text-[#56615a] bg-[#F0EDED] px-2 py-0.5 rounded-md">
                        {ann.author}
                      </span>
                      <span className="font-mono text-xs">{ann.timestamp}</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-[#1b1c1c] leading-snug mt-1.5">
                      {ann.title}
                    </p>
                    {ann.description && (
                      <p className="text-xs sm:text-sm text-[#434844] leading-relaxed mt-1 line-clamp-3">
                        {ann.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown or Login button */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-11 h-11 rounded-full bg-[#E4E2E1] border-2 border-[#C3C8C3] overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#56615a]/40 transition-all flex items-center justify-center shadow-xs"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-[#E5E4E2] p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3.5 pb-4 border-b-2 border-[#F0EDED] px-1">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-[#C3C8C3] shadow-xs flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden min-w-0 flex-1">
                    <div className="text-base sm:text-lg font-black text-[#1b1c1c] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-xs sm:text-sm text-[#737874] truncate mt-0.5">
                      {currentUser.email}
                    </div>
                    <span className="inline-block mt-1 text-xs uppercase font-extrabold bg-[#D6E7A1]/50 text-[#404c1c] px-2.5 py-0.5 rounded-lg border border-[#D6E7A1]">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="py-3 space-y-1.5">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3.5 py-3 text-sm sm:text-base font-bold text-[#1b1c1c] hover:bg-[#F0EDED] rounded-2xl transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl text-[#56615a]">person</span>
                    <span>My Profile & Uploads</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAuth('login');
                    }}
                    className="w-full text-left px-3.5 py-3 text-sm sm:text-base font-bold text-[#56615a] hover:bg-[#F0EDED] rounded-2xl transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <KeyRound className="w-5 h-5 text-[#56615a]" />
                    <span>Switch Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenCreateClassroom();
                    }}
                    className="w-full text-left px-3.5 py-3 text-sm sm:text-base font-bold text-[#1b1c1c] hover:bg-[#F0EDED] rounded-2xl transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl text-[#56615a]">add_circle</span>
                    <span>Create Classroom</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenJoinClassroom();
                    }}
                    className="w-full text-left px-3.5 py-3 text-sm sm:text-base font-bold text-[#1b1c1c] hover:bg-[#F0EDED] rounded-2xl transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xl text-[#56615a]">login</span>
                    <span>Join Another Cohort</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3.5 py-3 text-sm sm:text-base font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-2xl transition-colors flex items-center gap-3 cursor-pointer border-t-2 border-[#F0EDED] mt-2 pt-3"
                  >
                    <LogOut className="w-5 h-5 text-[#ba1a1a]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 bg-[#56615a] text-white text-xs font-bold rounded-xl hover:bg-[#434d46] transition-colors cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

