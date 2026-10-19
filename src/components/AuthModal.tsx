import React, { useState, useEffect } from 'react';
import { User, Classroom } from '../types';
import { supabase } from '../lib/supabase';
import {
  X,
  LogIn,
  UserPlus,
  School,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  Check,
  KeyRound,
  Info,
  Award,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DEMO_USERS = [
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@oxford.edu',
    role: 'super_admin' as const,
    roleTitle: 'Super Admin (Class Rep)',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    cohortName: 'Oxford • B.Tech CSE \'26',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
  },
  {
    id: 'user-michael',
    name: 'Michael Klein',
    email: 'michael.k@oxford.edu',
    role: 'admin' as const,
    roleTitle: 'Admin',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    cohortName: 'Oxford • B.Tech CSE \'26',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    email: 'elena.r@oxford.edu',
    role: 'student' as const,
    roleTitle: 'Student',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    cohortName: 'Oxford • B.Tech CSE \'26',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
  },
  {
    id: 'user-david',
    name: 'David Chen',
    email: 'david.c@oxford.edu',
    role: 'student' as const,
    roleTitle: 'Student',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    cohortName: 'Oxford • B.Tech CSE \'26',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
  },
  {
    id: 'user-alex',
    name: 'Alex Turner',
    email: 'alex.t@stanford.edu',
    role: 'super_admin' as const,
    roleTitle: 'Super Admin',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    cohortName: 'Stanford • AI & Data \'26',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A',
  },
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot-password' | 'reset-password';
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
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up form state (6 required fields)
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classCode, setClassCode] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Forgot password & Reset password form state
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmailConfirmationSent(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    const hasMinLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    const score = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    return {
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
      isStrong: score >= 4 && hasMinLength,
    };
  };

  const passwordStrength = getPasswordStrength(signupPassword);
  const newPasswordStrength = getPasswordStrength(newPassword);

  // Helper to map Supabase User & Profile to application User object
  const buildAppUser = async (supabaseUser: any, fallbackProfile?: any): Promise<{ user: User; classroom: Classroom }> => {
    let profileData: any = fallbackProfile || null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (!error && data) {
        profileData = data;
      }
    } catch (e) {
      console.warn('Could not query profiles table directly:', e);
    }

    const resolvedName =
      profileData?.full_name ||
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.email?.split('@')[0] ||
      'Student';

    const resolvedClassCode =
      profileData?.class_code ||
      supabaseUser.user_metadata?.class_code ||
      classCode ||
      'DEFAULT';

    const resolvedRegNo =
      profileData?.registration_number ||
      supabaseUser.user_metadata?.registration_number ||
      registrationNumber ||
      '';

    // Match or create fallback classroom cohort
    const matched = classrooms.find(
      (c) => c.code.trim().toLowerCase() === resolvedClassCode.trim().toLowerCase()
    );

    const fallbackClassroom: Classroom = matched || {
      id: `cls-${resolvedClassCode.toLowerCase().replace(/[^a-z0-9]/g, '') || 'general'}`,
      code: resolvedClassCode.toUpperCase(),
      name: `Classroom Cohort ${resolvedClassCode.toUpperCase()}`,
      collegeName: 'Academic Sanctuary',
      location: 'Main Campus',
      department: 'Engineering & Sciences',
      course: 'Academic Cohort',
      degreeLevel: 'undergraduate',
      batchYear: '2026',
      section: 'A',
      semester: 'Semester 1',
      superAdminId: supabaseUser.id,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    const appUser: User = {
      id: supabaseUser.id,
      name: resolvedName,
      email: supabaseUser.email || '',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(supabaseUser.id)}`,
      role: 'student',
      department: 'Academic Sanctuary',
      rollNumber: resolvedRegNo,
      classCode: resolvedClassCode,
      registrationNumber: resolvedRegNo,
      classroomId: fallbackClassroom.id,
    };

    return { user: appUser, classroom: fallbackClassroom };
  };

  // 1. Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = loginEmail.trim();
    const password = loginPassword;

    if (!email) {
      setErrorMessage('Please enter your email address.');
      setLoading(false);
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      setLoading(false);
      return;
    }

    try {
      // 1. Try Supabase Auth first
      let supabaseSuccess = false;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          confetti({ particleCount: 50, spread: 60 });
          const { user: appUser, classroom: appClassroom } = await buildAppUser(data.user);
          onAuthSuccess(appUser, appClassroom, 'Signed in successfully with Supabase Auth!');
          onClose();
          supabaseSuccess = true;
          return;
        }
      } catch (sbErr) {
        // Fall back to local demo server
      }

      // 2. Fallback to local demo backend API (/api/auth/login)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();
      if (res.ok && resData.user) {
        confetti({ particleCount: 50, spread: 60 });
        onAuthSuccess(resData.user, resData.classroom, resData.message || 'Signed in successfully!');
        onClose();
        return;
      }

      setErrorMessage(resData.error || 'Invalid email or password. Please verify your credentials and try again.');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  // 1b. Handle Quick Demo Login
  const handleQuickDemoLogin = async (demo: typeof DEMO_USERS[0]) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoginEmail(demo.email);
    setLoginPassword('password123');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demo.email, password: 'password123' }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        confetti({ particleCount: 55, spread: 70 });
        onAuthSuccess(data.user, data.classroom, data.message || `Logged in as ${demo.name}!`);
        onClose();
      } else {
        setErrorMessage(data.error || 'Could not authenticate demo user.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to demo authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Sign Up
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmailConfirmationSent(false);

    // Strict validation of the 6 required fields
    if (!fullName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupEmail.trim() || !emailPattern.test(signupEmail.trim())) {
      setErrorMessage('Please enter a valid email address (e.g., student@university.edu).');
      setLoading(false);
      return;
    }

    if (!classCode.trim()) {
      setErrorMessage('Please enter your Class Code.');
      setLoading(false);
      return;
    }

    if (!registrationNumber.trim()) {
      setErrorMessage('Please enter your Registration Number.');
      setLoading(false);
      return;
    }

    // Strong password enforcement
    if (signupPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (!passwordStrength.isStrong) {
      setErrorMessage('Please choose a stronger password matching the security criteria below.');
      setLoading(false);
      return;
    }

    // Password confirmation match
    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter to confirm.');
      setLoading(false);
      return;
    }

    try {
      const trimmedEmail = signupEmail.trim().toLowerCase();
      const trimmedFullName = fullName.trim();
      const trimmedClassCode = classCode.trim().toUpperCase();
      const trimmedRegNo = registrationNumber.trim().toUpperCase();

      // Register user through Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: trimmedFullName,
            class_code: trimmedClassCode,
            registration_number: trimmedRegNo,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          setErrorMessage('An account with this email already exists. Please sign in instead.');
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      // If user was created, also ensure profile is saved to public profiles table
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: trimmedFullName,
              class_code: trimmedClassCode,
              registration_number: trimmedRegNo,
            });

          if (profileError) {
            console.warn('Note: Profile upsert returned:', profileError.message);
          }
        } catch (pe) {
          console.warn('Note: Error saving profile to profiles table:', pe);
        }

        // Check if email confirmation is required by Supabase
        if (!data.session) {
          setEmailConfirmationSent(true);
          setSuccessMessage(
            `Registration successful! A confirmation email has been sent to ${trimmedEmail}. Please check your inbox and verify your email to log in.`
          );
          setLoading(false);
          return;
        }

        // If email confirmation is disabled or immediate session returned
        confetti({ particleCount: 70, spread: 80 });
        const { user: appUser, classroom: appClassroom } = await buildAppUser(data.user, {
          id: data.user.id,
          full_name: trimmedFullName,
          class_code: trimmedClassCode,
          registration_number: trimmedRegNo,
        });

        onAuthSuccess(appUser, appClassroom, 'Account created and authenticated successfully!');
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = resetEmail.trim();
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSuccessMessage(`Password reset link sent to ${email}. Please check your inbox and follow the instructions.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Reset Password (Setting New Password)
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (!newPasswordStrength.isStrong) {
      setErrorMessage('Please choose a stronger password matching the criteria.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match. Please re-enter to confirm.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        confetti({ particleCount: 50, spread: 60 });
        const { user: appUser, classroom: appClassroom } = await buildAppUser(data.user);
        onAuthSuccess(appUser, appClassroom, 'Password updated successfully! Welcome back.');
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#FDFCF8] text-[#1b1c1c] overflow-y-auto flex flex-col min-h-screen animate-in fade-in duration-200">
      {/* Sticky Full-Width Header Bar */}
      <header className="sticky top-0 z-20 w-full px-4 sm:px-8 md:px-12 py-4 sm:py-5 bg-white/95 backdrop-blur-md border-b border-[#E5E4E2] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#2d312e] hover:text-[#1b1c1c] text-sm sm:text-base font-bold transition-colors cursor-pointer shadow-xs"
            title="Back to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center font-bold shadow-xs">
            <School className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg sm:text-xl font-black text-[#1b1c1c] tracking-tight">
              Academic Sanctuary
            </h1>
            <p className="text-xs text-[#737874] font-medium">Supabase Authentication Portal</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#56615a] hover:text-[#1b1c1c] hover:bg-[#F0EDED] text-sm sm:text-base font-bold transition-colors cursor-pointer"
          title="Close Auth Portal"
        >
          <span className="hidden sm:inline">Close</span>
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Full-Page Content Area */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 flex-grow flex flex-col gap-6">
        {/* Tab Switcher (Only visible for Login / Sign Up modes) */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="grid grid-cols-2 p-1.5 bg-[#EAE8E7] rounded-2xl text-base sm:text-lg font-bold shadow-xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-3.5 sm:py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1b1c1c] shadow-sm font-extrabold ring-1 ring-black/5'
                  : 'text-[#56615a] hover:text-[#1b1c1c]'
              }`}
            >
              <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-3.5 sm:py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#1b1c1c] shadow-sm font-extrabold ring-1 ring-black/5'
                  : 'text-[#56615a] hover:text-[#1b1c1c]'
              }`}
            >
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <div>
          {mode === 'login' && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight mb-2">
                Sign In to Your Account
              </h2>
              <p className="text-base sm:text-lg text-[#56615a]">
                Enter your email address and password to access your classroom cohort.
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight mb-2">
                Create a New Account
              </h2>
              <p className="text-base sm:text-lg text-[#56615a]">
                Fill out the required information below to register your academic profile.
              </p>
            </div>
          )}

          {mode === 'forgot-password' && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight mb-2">
                Reset Your Password
              </h2>
              <p className="text-base sm:text-lg text-[#56615a]">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          )}

          {mode === 'reset-password' && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight mb-2">
                Set a New Password
              </h2>
              <p className="text-base sm:text-lg text-[#56615a]">
                Create a strong new password for your Academic Sanctuary account.
              </p>
            </div>
          )}
        </div>

        {/* Alerts & Messages */}
        {errorMessage && (
          <div className="p-4 sm:p-5 bg-[#ffdad6] border-2 border-[#ffb4ab] rounded-2xl text-sm sm:text-base font-bold text-[#ba1a1a] flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 sm:p-5 bg-[#d9e6dc] border-2 border-[#b2beb5] rounded-2xl text-sm sm:text-base font-bold text-[#20402b] flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#20402b]" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Email Verification Sent Screen */}
        {emailConfirmationSent && (
          <div className="p-6 sm:p-8 bg-white border-2 border-[#b2beb5] rounded-3xl text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-[#d9e6dc] rounded-full mx-auto flex items-center justify-center text-[#56615a]">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#1b1c1c]">Verification Email Sent</h3>
            <p className="text-sm sm:text-base text-[#56615a] max-w-md mx-auto">
              Please check your inbox at <span className="font-bold text-[#1b1c1c]">{signupEmail}</span> and click the confirmation link to activate your account.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setEmailConfirmationSent(false);
                  setSuccessMessage(null);
                }}
                className="px-6 py-3 bg-[#56615a] text-white font-bold rounded-xl hover:bg-[#434d46] transition-colors cursor-pointer"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        )}

        {/* A. LOGIN FORM */}
        {mode === 'login' && !emailConfirmationSent && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Quick Demo Accounts Selection */}
            <div className="bg-[#f4f6f4] border-2 border-[#d2dcd4] rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#56615a] text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1b1c1c]">
                    Quick Demo Accounts (1-Click Login)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#56615a] bg-white px-2.5 py-0.5 rounded-full border border-[#d2dcd4]">
                  Interactive
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#56615a] mb-3 font-medium">
                Click any profile to instantly sign in with full demo data, chats, and cohort permissions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickDemoLogin(demo)}
                    className="flex items-center gap-3 p-2.5 sm:p-3 bg-white hover:bg-[#ebf0ec] active:scale-[0.98] border border-[#CCD6CF] hover:border-[#56615a] rounded-xl text-left transition-all group shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    <img
                      src={demo.avatar}
                      alt={demo.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#D8DED9] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs sm:text-sm font-bold text-[#1b1c1c] truncate group-hover:text-[#2d312e]">
                          {demo.name}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${demo.badgeColor}`}>
                          {demo.roleTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#737874] truncate block">
                        {demo.cohortName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[#D8D6D4] w-full" />
              <span className="bg-[#FAF9F5] px-3 text-xs font-bold text-[#737874] uppercase tracking-wider shrink-0">
                Or Sign In with Credentials
              </span>
              <div className="border-t border-[#D8D6D4] w-full" />
            </div>
            <div>
              <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                Email Address <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@institution.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-4 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a] focus:ring-2 focus:ring-[#56615a]/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block">
                  Password <span className="text-[#ba1a1a]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password');
                    setResetEmail(loginEmail);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs sm:text-sm font-bold text-[#56615a] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-12 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a] focus:ring-2 focus:ring-[#56615a]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737874] hover:text-[#1b1c1c] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 sm:py-5 bg-[#56615a] hover:bg-[#3e4641] disabled:opacity-50 text-white font-extrabold text-base sm:text-xl rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm sm:text-base text-[#737874]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-[#56615a] hover:underline cursor-pointer ml-1"
                >
                  Create an account →
                </button>
              </p>
            </div>
          </form>
        )}

        {/* B. SIGN UP FORM (6 REQUIRED FIELDS) */}
        {mode === 'signup' && !emailConfirmationSent && (
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            {/* 1. Full Name & 2. Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                  Full Name <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-4 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                  Email Address <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@university.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-4 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Class Code & 4. Registration Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                  Class Code <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. BTECH26A"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 sm:pl-14 pr-4 py-4 text-base sm:text-lg font-mono font-bold uppercase rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] shadow-xs focus:outline-none focus:border-[#56615a]"
                  />
                </div>
                <span className="text-xs text-[#737874] mt-1 block">Classroom cohort code to join</span>
              </div>

              <div>
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                  Registration Number <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024CS104"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    className="w-full pl-12 sm:pl-14 pr-4 py-4 text-base sm:text-lg font-mono font-bold uppercase rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] shadow-xs focus:outline-none focus:border-[#56615a]"
                  />
                </div>
                <span className="text-xs text-[#737874] mt-1 block">Unique student or roll number</span>
              </div>
            </div>

            {/* 5. Password & 6. Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                  Password <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 8 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-12 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737874] hover:text-[#1b1c1c] p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                  Confirm Password <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-12 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737874] hover:text-[#1b1c1c] p-1 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Checklist */}
            {signupPassword && (
              <div className="p-4 bg-[#f8faf8] border-2 border-[#E5E4E2] rounded-2xl space-y-2">
                <div className="text-xs font-bold text-[#56615a] uppercase tracking-wider">
                  Password Strength Requirements:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${passwordStrength.hasMinLength ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${passwordStrength.hasMinLength ? 'text-[#20402b]' : 'opacity-40'}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordStrength.hasUppercase ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${passwordStrength.hasUppercase ? 'text-[#20402b]' : 'opacity-40'}`} />
                    <span>1 uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordStrength.hasLowercase ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${passwordStrength.hasLowercase ? 'text-[#20402b]' : 'opacity-40'}`} />
                    <span>1 lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordStrength.hasNumber || passwordStrength.hasSpecial ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${passwordStrength.hasNumber || passwordStrength.hasSpecial ? 'text-[#20402b]' : 'opacity-40'}`} />
                    <span>Number or symbol</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 sm:py-5 bg-[#56615a] hover:bg-[#3e4641] disabled:opacity-50 text-white font-extrabold text-base sm:text-xl rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm sm:text-base text-[#737874]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-[#56615a] hover:underline cursor-pointer ml-1"
                >
                  Sign in to your account →
                </button>
              </p>
            </div>
          </form>
        )}

        {/* C. FORGOT PASSWORD FORM */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
            <div>
              <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                Registered Email Address <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@institution.edu"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-4 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 sm:py-5 bg-[#56615a] hover:bg-[#3e4641] disabled:opacity-50 text-white font-extrabold text-base sm:text-xl rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Send Password Reset Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#56615a] hover:underline cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* D. RESET PASSWORD FORM (SETTING NEW PASSWORD) */}
        {mode === 'reset-password' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
            <div>
              <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                New Password <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-12 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737874] hover:text-[#1b1c1c] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                Confirm New Password <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-12 py-4 text-base sm:text-lg rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] font-medium shadow-xs focus:outline-none focus:border-[#56615a]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737874] hover:text-[#1b1c1c] p-1 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 sm:py-5 bg-[#56615a] hover:bg-[#3e4641] disabled:opacity-50 text-white font-extrabold text-base sm:text-xl rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Set New Password & Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
