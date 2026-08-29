import React, { useState } from 'react';
import { Classroom, User, Announcement } from '../types';
import { Bell, ArrowLeft, School, Plus, LogIn, ChevronDown, Check, Users, Sparkles, BookOpen, UserPlus, LogOut, KeyRound } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  activeClassroom: Classroom | null;
  currentUser: User | null;
  announcements: Announcement[];
  classrooms: Classroom[];
  onNavigate: (view: string, data?: any) => void;
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
      <header className="w-full px-4 md:px-16 py-5 flex justify-between items-center z-50 bg-[#FDFCF8]/90 backdrop-blur-sm sticky top-0 border-b border-[#E5E4E2]/60">
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

  const showBackButton = currentView !== 'dashboard';

  return (
    <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-16 py-3 bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#E5E4E2]">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-[#434844] hover:bg-[#F0EDED] hover:text-[#1b1c1c] rounded-full p-2 transition-colors flex items-center justify-center cursor-pointer"
            title="Back to Dashboard"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
        ) : (
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
        )}

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
                className="hidden lg:flex items-center gap-1.5 ml-2 px-3 py-1 bg-[#d9e6dc]/60 hover:bg-[#d9e6dc] rounded-full text-xs font-semibold text-[#37413a] border border-[#b2beb5]/60 transition-colors"
                title="Your Enrolled Cohort (1 Classroom Rule)"
              >
                <span className="w-2 h-2 rounded-full bg-[#56615a]"></span>
                <span className="truncate max-w-[180px]">{activeClassroom.code} • {activeClassroom.section}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#56615a]" />
              </button>

              {showClassroomDropdown && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E4E2] p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[11px] font-bold text-[#737874] uppercase tracking-wider flex items-center justify-between">
                    <span>Enrolled Cohort</span>
                    <span className="text-[10px] bg-[#F0EDED] text-[#56615a] px-1.5 py-0.5 rounded font-mono">
                      1 CLASSROOM LOCK
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#F9F6EE] rounded-xl border border-[#E5E4E2] mt-1 mb-2">
                    <div className="text-xs font-bold text-[#1b1c1c]">{activeClassroom.name}</div>
                    <div className="text-[11px] text-[#737874]">{activeClassroom.collegeName}</div>
                    <div className="text-[10px] font-mono text-[#56615a] mt-1">Code: {activeClassroom.code}</div>
                  </div>

                  {classrooms.length > 1 && (
                    <div className="space-y-1 mt-2 pt-2 border-t border-[#E5E4E2]">
                      <div className="px-2 text-[10px] font-bold text-[#737874] uppercase">Available Cohorts</div>
                      {classrooms.map((cls) => (
                        <button
                          key={cls.id}
                          onClick={() => {
                            onSelectClassroom(cls);
                            setShowClassroomDropdown(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs hover:bg-[#F0EDED] transition-colors ${
                            activeClassroom.id === cls.id ? 'bg-[#d9e6dc]/40 font-bold text-[#1b1c1c]' : 'text-[#434844]'
                          }`}
                        >
                          <span className="truncate">{cls.code} - {cls.name}</span>
                          {activeClassroom.id === cls.id && <Check className="w-3.5 h-3.5 text-[#56615a]" />}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-[#E5E4E2] mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowClassroomDropdown(false);
                        onOpenCreateClassroom();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-[#56615a] hover:bg-[#F0EDED] rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create New Cohort
                    </button>
                    <button
                      onClick={() => {
                        setShowClassroomDropdown(false);
                        onOpenJoinClassroom();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-[#434844] hover:bg-[#F0EDED] rounded-lg flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Join Cohort with Code
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
      </nav>

      {/* Right Actions: Notifications & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
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
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E5E4E2] p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E4E2]">
                <div className="flex items-center gap-2 text-[#56615a] font-bold text-sm">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    campaign
                  </span>
                  Class Announcements
                </div>
                <span className="text-xs text-[#737874]">{announcements.length} new</span>
              </div>
              <div className="divide-y divide-[#F0EDED] max-h-80 overflow-y-auto mt-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="py-3 flex flex-col gap-1 hover:bg-[#FDFCF8] px-1 rounded-lg">
                    <div className="flex items-center justify-between text-[11px] text-[#737874]">
                      <span>{ann.author}</span>
                      <span>{ann.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#1b1c1c] leading-snug">{ann.title}</p>
                    {ann.description && (
                      <p className="text-[11px] text-[#434844] line-clamp-2">{ann.description}</p>
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
              className="w-10 h-10 rounded-full bg-[#E4E2E1] border border-[#C3C8C3] overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#56615a]/40 transition-all flex items-center justify-center"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E4E2] p-3 z-50 animate-in fade-in">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E5E4E2] px-1">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#C3C8C3]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-[#1b1c1c] truncate">{currentUser.name}</div>
                    <div className="text-xs text-[#737874] truncate">{currentUser.email}</div>
                    <span className="inline-block mt-0.5 text-[10px] uppercase font-bold bg-[#D6E7A1]/40 text-[#56642b] px-2 py-0.5 rounded-full">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1b1c1c] hover:bg-[#F0EDED] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">person</span> My Profile & Uploads
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAuth('login');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#56615a] hover:bg-[#F0EDED] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[#56615a]" /> Switch / Demo Logins
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenCreateClassroom();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1b1c1c] hover:bg-[#F0EDED] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span> Create Classroom
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenJoinClassroom();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#1b1c1c] hover:bg-[#F0EDED] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">login</span> Join Another Cohort
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors flex items-center gap-2 border-t border-[#E5E4E2] mt-1 pt-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#ba1a1a]" /> Sign Out
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

