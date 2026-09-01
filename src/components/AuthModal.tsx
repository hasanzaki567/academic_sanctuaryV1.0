import React, { useState, useEffect } from 'react';
import { User, Classroom } from '../types';
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  School,
  Lock,
  Mail,
  User as UserIcon,
  BookOpen,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  KeyRound,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: User, classroom: Classroom, message: string) => void;
  classrooms: Classroom[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  classrooms,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('Computer Science');
  const [signupRollNumber, setSignupRollNumber] = useState('');
  
  // Single classroom enrollment choice
  const [enrollmentMode, setEnrollmentMode] = useState<'code' | 'select' | 'create'>('code');
  const [classroomCode, setClassroomCode] = useState('BTECH26A');
  const [selectedClassroomId, setSelectedClassroomId] = useState(classrooms[0]?.id || 'cls-1');
  
  // New classroom state if creating during signup
  const [newCourseName, setNewCourseName] = useState('B.Tech Data Science');
  const [newCollegeName, setNewCollegeName] = useState('Stanford University');
  const [newBatchYear, setNewBatchYear] = useState('2026');
  const [newSection, setNewSection] = useState('Section A');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      confetti({ particleCount: 40, spread: 60 });
      onAuthSuccess(data.user, data.classroom, data.message || 'Logged in successfully!');
      onClose();
    } catch (err: any) {
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!signupName.trim() || !signupEmail.trim()) {
      setErrorMessage('Please fill in your name and university email.');
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword.trim() || 'password123',
        department: signupDepartment.trim(),
        rollNumber: signupRollNumber.trim() || `STU${Math.floor(1000 + Math.random() * 9000)}`,
        classroomOption: enrollmentMode === 'create' ? 'create' : enrollmentMode === 'code' ? 'join' : 'select',
      };

      if (enrollmentMode === 'code') {
        payload.classroomCode = classroomCode.trim();
      } else if (enrollmentMode === 'select') {
        payload.classroomId = selectedClassroomId;
      } else if (enrollmentMode === 'create') {
        payload.newClassroomData = {
          course: newCourseName,
          collegeName: newCollegeName,
          department: signupDepartment,
          batchYear: newBatchYear,
          section: newSection,
          selectedSubjects: [
            'Data Structures (CS301)',
            'Operating Systems (CS302)',
            'Computer Networks (CS304)',
          ],
        };
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      confetti({ particleCount: 60, spread: 70 });
      onAuthSuccess(data.user, data.classroom, data.message || 'Account created successfully!');
      onClose();
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1c1c]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] border border-[#E5E4E2] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E5E4E2] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center font-bold">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1b1c1c] tracking-tight flex items-center gap-2">
                Academic Sanctuary
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F0EDED] text-[#56615a] px-2 py-0.5 rounded-full border border-[#C3C8C3]/60">
                  Auth
                </span>
              </h2>
              <p className="text-xs text-[#737874]">
                Single Classroom Access & Repository
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#737874] hover:bg-[#F0EDED] hover:text-[#1b1c1c] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-[#F9F6EE] border-b border-[#E5E4E2]">
          <div className="grid grid-cols-2 p-1 bg-[#EAE8E7] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1b1c1c] shadow-xs'
                  : 'text-[#56615a] hover:text-[#1b1c1c]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#1b1c1c] shadow-xs'
                  : 'text-[#56615a] hover:text-[#1b1c1c]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-grow">
          {errorMessage && (
            <div className="p-3.5 bg-[#ffdad6]/40 border border-[#ffb4ab] rounded-xl text-xs font-semibold text-[#ba1a1a] flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#434844] block mb-1.5 uppercase tracking-wide">
                  University / Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah.j@oxford.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="paper-input w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c] focus:outline-none focus:border-[#56615a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#434844] block mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="paper-input w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c] focus:outline-none focus:border-[#56615a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737874] hover:text-[#1b1c1c]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#56615a] hover:bg-[#434d46] disabled:opacity-50 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? 'Authenticating...' : 'Sign In to My Cohort'}</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <p className="text-[11px] text-[#737874]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#56615a] hover:underline cursor-pointer"
                  >
                    Create Account & Join a Classroom
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Sign Up Form (Strict 1-Classroom Rule) */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="paper-input w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1.5 uppercase tracking-wide">
                    Institutional Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. elena.r@oxford.edu"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="paper-input w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1.5 uppercase tracking-wide">
                    Department / Discipline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={signupDepartment}
                    onChange={(e) => setSignupDepartment(e.target.value)}
                    className="paper-input w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1.5 uppercase tracking-wide">
                    Roll / Registration No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS22B029"
                    value={signupRollNumber}
                    onChange={(e) => setSignupRollNumber(e.target.value)}
                    className="paper-input w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#434844] block mb-1.5 uppercase tracking-wide">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (or leave for default)..."
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="paper-input w-full pl-10 pr-10 py-2 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737874] hover:text-[#1b1c1c]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Strict 1-Classroom Assignment Section */}
              <div className="p-3.5 bg-[#d9e6dc]/30 border border-[#b2beb5] rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#56615a]" />
                  <span className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wide">
                    Single Classroom Cohort Assignment
                  </span>
                </div>
                <p className="text-[11px] text-[#434844]">
                  In Academic Sanctuary, every student belongs to <strong>one specific classroom cohort</strong> for unified notes, exams, and syllabus tracking.
                </p>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEnrollmentMode('code')}
                    className={`py-2 px-1 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      enrollmentMode === 'code'
                        ? 'bg-white border-[#56615a] text-[#1b1c1c] font-bold shadow-xs ring-1 ring-[#56615a]'
                        : 'bg-white/60 border-[#E5E4E2] text-[#737874]'
                    }`}
                  >
                    Enter Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnrollmentMode('select')}
                    className={`py-2 px-1 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      enrollmentMode === 'select'
                        ? 'bg-white border-[#56615a] text-[#1b1c1c] font-bold shadow-xs ring-1 ring-[#56615a]'
                        : 'bg-white/60 border-[#E5E4E2] text-[#737874]'
                    }`}
                  >
                    Select Cohort
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnrollmentMode('create')}
                    className={`py-2 px-1 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      enrollmentMode === 'create'
                        ? 'bg-white border-[#56615a] text-[#1b1c1c] font-bold shadow-xs ring-1 ring-[#56615a]'
                        : 'bg-white/60 border-[#E5E4E2] text-[#737874]'
                    }`}
                  >
                    Create New
                  </button>
                </div>

                {enrollmentMode === 'code' && (
                  <div>
                    <label className="text-[11px] font-bold text-[#434844] block mb-1">
                      Classroom Invite Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BTECH26A"
                      value={classroomCode}
                      onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                      className="paper-input w-full p-2.5 text-xs font-mono font-bold tracking-widest text-[#1b1c1c] uppercase rounded-xl bg-white border border-[#E5E4E2]"
                    />
                    <span className="text-[10px] text-[#737874] mt-1 block">
                      Tip: Try <code className="font-bold">BTECH26A</code> (Oxford) or <code className="font-bold">AIDS26A</code> (Stanford).
                    </span>
                  </div>
                )}

                {enrollmentMode === 'select' && (
                  <div>
                    <label className="text-[11px] font-bold text-[#434844] block mb-1">
                      Choose Your Cohort
                    </label>
                    <select
                      value={selectedClassroomId}
                      onChange={(e) => setSelectedClassroomId(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#E5E4E2] text-[#1b1c1c] font-medium"
                    >
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.collegeName}) • {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {enrollmentMode === 'create' && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-[#434844] block mb-1">
                          Program / Course
                        </label>
                        <input
                          type="text"
                          value={newCourseName}
                          onChange={(e) => setNewCourseName(e.target.value)}
                          className="paper-input w-full p-2 text-xs rounded-xl bg-white border border-[#E5E4E2]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#434844] block mb-1">
                          University / College
                        </label>
                        <input
                          type="text"
                          value={newCollegeName}
                          onChange={(e) => setNewCollegeName(e.target.value)}
                          className="paper-input w-full p-2 text-xs rounded-xl bg-white border border-[#E5E4E2]"
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-[#56642b] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>You will be registered as Super Admin for this new cohort.</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#56615a] hover:bg-[#434d46] disabled:opacity-50 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Creating Profile...' : 'Complete Registration & Join Cohort'}</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <p className="text-[11px] text-[#737874]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#56615a] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
