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
    cohortName: "Oxford • B.Tech CSE '26",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
  },
  {
    id: 'user-michael',
    name: 'Michael Klein',
    email: 'michael.k@oxford.edu',
    role: 'admin' as const,
    roleTitle: 'Admin',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    cohortName: "Oxford • B.Tech CSE '26",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    email: 'elena.r@oxford.edu',
    role: 'student' as const,
    roleTitle: 'Student',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    cohortName: "Oxford • B.Tech CSE '26",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
  },
  {
    id: 'user-david',
    name: 'David Chen',
    email: 'david.c@oxford.edu',
    role: 'student' as const,
    roleTitle: 'Student',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    cohortName: "Oxford • B.Tech CSE '26",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
  },
  {
    id: 'user-alex',
    name: 'Alex Turner',
    email: 'alex.t@stanford.edu',
    role: 'super_admin' as const,
    roleTitle: 'Super Admin',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    cohortName: "Stanford • AI & Data '26",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A',
  },
  {
    id: 'user-maya',
    name: 'Maya Lin',
    email: 'maya.l@stanford.edu',
    role: 'student' as const,
    roleTitle: 'Student',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    cohortName: "Stanford • AI & Data '26",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
  },
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot-password' | 'reset-password';
  onAuthSuccess: (user: User, classroom: Classroom | null, message: string) => void;
  onQuickDemoLogin?: (email: string) => Promise<{ ok: boolean; error?: string }>;
  classrooms: Classroom[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  onQuickDemoLogin,
  classrooms,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'reset-password' | 'verify-signup-otp'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up form state (5 required fields)
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Sign Up OTP verification state
  const [signupOtpCode, setSignupOtpCode] = useState('');
  const [simulatedSignupOtp, setSimulatedSignupOtp] = useState<string | null>(null);
  const [signupOtpCountdown, setSignupOtpCountdown] = useState(0);

  // Forgot password & Reset password form state
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmailConfirmationSent(false);
    setSignupOtpCode('');
  }, [initialMode, isOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (signupOtpCountdown <= 0) return;
    const timer = setTimeout(() => {
      setSignupOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [signupOtpCountdown]);

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
  const buildAppUser = async (supabaseUser: any, fallbackProfile?: any): Promise<{ user: User; classroom: Classroom | null }> => {
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
      '';

    const resolvedRegNo =
      profileData?.registration_number ||
      supabaseUser.user_metadata?.registration_number ||
      registrationNumber ||
      '';

    // Match classroom cohort if class code is provided
    const matched = resolvedClassCode
      ? classrooms.find(
          (c) => c.code.trim().toLowerCase() === resolvedClassCode.trim().toLowerCase()
        ) || null
      : null;

    const appUser: User = {
      id: supabaseUser.id,
      name: resolvedName,
      email: supabaseUser.email || '',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(supabaseUser.id)}`,
      role: 'student',
      department: 'Academic Sanctuary',
      rollNumber: resolvedRegNo,
      classCode: resolvedClassCode || undefined,
      registrationNumber: resolvedRegNo,
      classroomId: matched?.id || undefined,
    };

    return { user: appUser, classroom: matched };
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
      // 1. Try Supabase Auth for registered users
      let supabaseError: any = null;
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
          return;
        }

        if (error) {
          supabaseError = error;
        }
      } catch (sbErr: any) {
        supabaseError = sbErr;
      }

      // 2. Fallback check for accounts registered directly on local database
      let resData: any = null;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const text = await res.text();
        try {
          resData = text ? JSON.parse(text) : {};
        } catch {
          resData = null;
        }

        if (res.ok && resData?.user) {
          confetti({ particleCount: 50, spread: 60 });
          onAuthSuccess(resData.user, resData.classroom, resData.message || 'Signed in successfully!');
          onClose();
          return;
        }

        if (res.status === 401 && resData?.error) {
          setErrorMessage(resData.error);
          return;
        }
      } catch (localErr) {
        // Fallback fetch error ignored
      }

      // 3. Return clear error message on incorrect email or password
      if (
        supabaseError?.message?.toLowerCase().includes('email not confirmed') ||
        supabaseError?.code === 'email_not_confirmed'
      ) {
        setErrorMessage(
          'Your email has not been verified yet. Please check your inbox and click the verification link to log in.'
        );
      } else if (supabaseError) {
        setErrorMessage(
          supabaseError.message === 'Invalid login credentials'
            ? 'Invalid email or password. Please verify your credentials and try again.'
            : supabaseError.message
        );
      } else {
        setErrorMessage(resData?.error || 'Invalid email or password. Please verify your credentials and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  // 1b. Handle Quick Demo Login (1-Click)
  const handleQuickDemoSelect = async (demo: typeof DEMO_USERS[0]) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoginEmail(demo.email);
    setLoginPassword('password123');

    try {
      if (onQuickDemoLogin) {
        const result = await onQuickDemoLogin(demo.email);
        if (result.ok) {
          onClose();
        } else {
          setErrorMessage(result.error || 'Could not authenticate demo user.');
        }
        return;
      }

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

  // 2. Handle Sign Up Submission (Dispatch OTP)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Strict validation of the required fields
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

    const trimmedEmail = signupEmail.trim().toLowerCase();
    const trimmedFullName = fullName.trim();
    const trimmedRegNo = registrationNumber.trim().toUpperCase();

    try {
      // 1. Try Supabase Auth sign up
      let supabaseError: any = null;
      let supabaseInitiated = false;
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: signupPassword,
          options: {
            data: {
              full_name: trimmedFullName,
              registration_number: trimmedRegNo,
            },
          },
        });

        if (error) {
          supabaseError = error;
        } else if (data?.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            setErrorMessage('An account with this email is already registered. Please sign in instead.');
            setLoading(false);
            return;
          }
          supabaseInitiated = true;
        }
      } catch (sbErr: any) {
        supabaseError = sbErr;
      }

      // Check if user already registered according to Supabase
      if (
        supabaseError &&
        (supabaseError.status === 422 ||
          supabaseError.message?.toLowerCase().includes('already registered') ||
          supabaseError.message?.toLowerCase().includes('already exists'))
      ) {
        setErrorMessage('An account with this email is already registered. Please sign in instead.');
        setLoading(false);
        return;
      }

      // 2. Also dispatch OTP via our backend service for backup & instant verification
      let serverOtp: string | null = null;
      let serverError: string | null = null;
      try {
        const res = await fetch('/api/auth/send-signup-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedFullName,
            email: trimmedEmail,
            password: signupPassword,
            regNo: trimmedRegNo,
            rollNumber: trimmedRegNo,
            department: 'Computer Science & Engineering',
          }),
        });

        const text = await res.text();
        let resData: any = null;
        try {
          resData = text ? JSON.parse(text) : {};
        } catch {
          resData = null;
        }

        if (res.ok && resData?.otp) {
          serverOtp = resData.otp;
        } else if (resData?.error) {
          serverError = resData.error;
        }
      } catch (fetchErr) {
        console.warn('Backend send-signup-otp error:', fetchErr);
      }

      // If user already exists in backend database
      if (serverError && serverError.includes('already exists') && !supabaseInitiated) {
        setErrorMessage(serverError);
        setLoading(false);
        return;
      }

      // Transition to OTP verification screen!
      setSimulatedSignupOtp(serverOtp);
      setSignupOtpCode('');
      setSignupOtpCountdown(60);
      setSuccessMessage(`A 6-digit verification OTP has been sent to ${trimmedEmail}. Please enter it below to complete your registration.`);
      setMode('verify-signup-otp');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  // 2b. Handle Verify Sign Up OTP Submission
  const handleVerifySignupOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = signupEmail.trim().toLowerCase();
    const cleanOtp = signupOtpCode.trim();
    const trimmedFullName = fullName.trim();
    const trimmedRegNo = registrationNumber.trim().toUpperCase();

    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification OTP code.');
      setLoading(false);
      return;
    }

    // 1. First attempt: Supabase Auth verifyOtp
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: cleanOtp,
        type: 'signup',
      });

      if (!error && data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: trimmedFullName,
            registration_number: trimmedRegNo,
          });
        } catch (pe) {
          console.warn('Profile upsert notice:', pe);
        }

        confetti({ particleCount: 70, spread: 80 });
        const { user: appUser, classroom: appClassroom } = await buildAppUser(data.user, {
          id: data.user.id,
          full_name: trimmedFullName,
          registration_number: trimmedRegNo,
        });

        onAuthSuccess(appUser, appClassroom, 'Account verified and signed up successfully! Welcome to Academic Sanctuary.');
        onClose();
        return;
      }
    } catch (sbErr) {
      console.warn('Supabase verifyOtp notice:', sbErr);
    }

    // 2. Second attempt: Local server OTP verification
    try {
      const res = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          otp: cleanOtp,
        }),
      });

      const text = await res.text();
      let resData: any = null;
      try {
        resData = text ? JSON.parse(text) : {};
      } catch {
        resData = null;
      }

      if (res.ok && resData?.user) {
        confetti({ particleCount: 70, spread: 80 });
        onAuthSuccess(
          resData.user,
          resData.classroom || null,
          resData.message || 'Account verified and signed up successfully!'
        );
        onClose();
        return;
      }

      if (resData?.error) {
        setErrorMessage(resData.error);
        setLoading(false);
        return;
      }
    } catch (localErr) {
      console.warn('Backend verify-signup-otp error:', localErr);
    }

    setErrorMessage('Invalid or expired OTP code. Please check the code in your email and try again.');
    setLoading(false);
  };

  // 2c. Resend Sign Up OTP
  const handleResendSignupOtp = async () => {
    if (signupOtpCountdown > 0) return;
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = signupEmail.trim().toLowerCase();
    const trimmedFullName = fullName.trim();
    const trimmedRegNo = registrationNumber.trim().toUpperCase();

    // Supabase resend
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: trimmedEmail,
      });
    } catch (e) {
      // ignore
    }

    // Server resend
    let newOtp: string | null = null;
    try {
      const res = await fetch('/api/auth/send-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedFullName,
          email: trimmedEmail,
          password: signupPassword,
          regNo: trimmedRegNo,
          rollNumber: trimmedRegNo,
          department: 'Computer Science & Engineering',
        }),
      });

      const text = await res.text();
      const resData = text ? JSON.parse(text) : null;
      if (res.ok && resData?.otp) {
        newOtp = resData.otp;
      }
    } catch (e) {
      // ignore
    }

    if (newOtp) {
      setSimulatedSignupOtp(newOtp);
    }

    setSignupOtpCountdown(60);
    setLoading(false);
    setSuccessMessage(`A new 6-digit OTP code has been dispatched to ${trimmedEmail}.`);
  };

  // 3. Handle Forgot Password (Send OTP)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setSimulatedOtp(null);

    const email = resetEmail.trim().toLowerCase();
    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      setLoading(false);
      return;
    }

    try {
      // 1. Try Supabase password reset email first
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#reset-password`,
        });
        if (!error) {
          setSuccessMessage(`A password reset link has been sent to ${email}. Please check your inbox.`);
          setLoading(false);
          return;
        }
      } catch (sbErr) {
        // Fallback to local OTP
      }

      // 2. Fallback to local OTP service
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = null;
      }

      if (res.ok && data?.otp) {
        setSimulatedOtp(data.otp);
        setSuccessMessage(`A 6-digit verification OTP has been sent to ${email}.`);
        setMode('verify-otp');
      } else {
        setErrorMessage(data?.error || 'Failed to send OTP code. Please check your email.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Verify OTP & Set New Password
  const handleVerifyOtpAndResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = resetEmail.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    if (!cleanOtp) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      setLoading(false);
      return;
    }

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
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: cleanOtp,
          newPassword,
        }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = null;
      }

      if (res.ok) {
        confetti({ particleCount: 60, spread: 70 });
        setSuccessMessage('Password changed successfully! You can now sign in with your new password.');
        setLoginEmail(email);
        setLoginPassword('');
        setOtpCode('');
        setSimulatedOtp(null);
        setNewPassword('');
        setConfirmNewPassword('');
        setMode('login');
      } else {
        setErrorMessage(data?.error || 'Failed to verify OTP. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to authentication server.');
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
                Forgot Password
              </h2>
              <p className="text-base sm:text-lg text-[#56615a]">
                Enter your registered institutional email to receive a 6-digit verification OTP code.
              </p>
            </div>
          )}

          {mode === 'verify-otp' && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight mb-2">
                Verify OTP & Reset Password
              </h2>
              <p className="text-base sm:text-lg text-[#56615a]">
                Enter the 6-digit OTP code sent to <strong className="text-[#1b1c1c]">{resetEmail}</strong> and choose a new password.
              </p>
            </div>
          )}

          {mode === 'verify-signup-otp' && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight mb-2">
                Verify Your Account
              </h2>
              <p className="text-base sm:text-lg text-[#56615a]">
                Enter the 6-digit verification OTP sent to <strong className="text-[#1b1c1c]">{signupEmail}</strong> to complete registration.
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
                Click any profile to instantly sign in with full demo data, notes, chats, and cohort permissions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickDemoSelect(demo)}
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

            {/* 3. Registration Number */}
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

        {/* C. FORGOT PASSWORD (REQUEST OTP) */}
        {mode === 'forgot-password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
            <div>
              <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block mb-2">
                Registered Institutional Email <span className="text-[#ba1a1a]">*</span>
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
              <p className="text-xs sm:text-sm text-[#737874] mt-2">
                We will generate and send a secure 6-digit OTP verification code to this address.
              </p>
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
                    <span>Sending verification OTP...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Send Verification OTP</span>
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

        {/* D. VERIFY OTP & RESET PASSWORD FORM */}
        {mode === 'verify-otp' && (
          <form onSubmit={handleVerifyOtpAndResetSubmit} className="space-y-6">
            {/* Simulated OTP Notification Banner */}
            {simulatedOtp && (
              <div className="p-4 bg-[#e8f5e9] border-2 border-[#a5d6a7] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm font-semibold text-[#1b5e20] shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2e7d32] shrink-0" />
                  <span>
                    Sent to <strong>{resetEmail}</strong>: Code is{' '}
                    <strong className="font-mono text-base tracking-widest text-[#1b5e20] bg-white px-2 py-0.5 rounded border border-[#a5d6a7]">
                      {simulatedOtp}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedOtp)}
                  className="px-3.5 py-1.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  Auto-Fill OTP
                </button>
              </div>
            )}

            {/* 6-Digit OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block">
                  6-Digit OTP Code <span className="text-[#ba1a1a]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPasswordSubmit}
                  disabled={loading}
                  className="text-xs sm:text-sm font-bold text-[#56615a] hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-12 sm:pl-14 pr-4 py-4 text-xl sm:text-2xl font-mono font-bold tracking-widest rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] shadow-xs focus:outline-none focus:border-[#56615a]"
                />
              </div>
            </div>

            {/* New Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            </div>

            {/* Password Strength Checklist */}
            {newPassword && (
              <div className="p-4 bg-[#f8faf8] border-2 border-[#E5E4E2] rounded-2xl space-y-2">
                <div className="text-xs font-bold text-[#56615a] uppercase tracking-wider">
                  New Password Requirements:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${newPasswordStrength.hasMinLength ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${newPasswordStrength.hasMinLength ? 'text-[#20402b]' : 'opacity-40'}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${newPasswordStrength.hasUppercase ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${newPasswordStrength.hasUppercase ? 'text-[#20402b]' : 'opacity-40'}`} />
                    <span>1 uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${newPasswordStrength.hasLowercase ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${newPasswordStrength.hasLowercase ? 'text-[#20402b]' : 'opacity-40'}`} />
                    <span>1 lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${newPasswordStrength.hasNumber || newPasswordStrength.hasSpecial ? 'text-[#20402b] font-bold' : 'text-[#737874]'}`}>
                    <Check className={`w-3.5 h-3.5 ${newPasswordStrength.hasNumber || newPasswordStrength.hasSpecial ? 'text-[#20402b]' : 'opacity-40'}`} />
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
                    <span>Verifying OTP & Updating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Verify OTP & Update Password</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot-password');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#56615a] hover:underline cursor-pointer"
              >
                ← Change Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#737874] hover:text-[#1b1c1c] hover:underline cursor-pointer"
              >
                Cancel & Sign In
              </button>
            </div>
          </form>
        )}

        {/* E. VERIFY SIGN UP OTP FORM */}
        {mode === 'verify-signup-otp' && (
          <form onSubmit={handleVerifySignupOtpSubmit} className="space-y-6">
            {/* Simulated OTP Notification Banner (Demo/Local fallback helper) */}
            {simulatedSignupOtp && (
              <div className="p-4 bg-[#e8f5e9] border-2 border-[#a5d6a7] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm font-semibold text-[#1b5e20] shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2e7d32] shrink-0" />
                  <span>
                    Sent to <strong>{signupEmail}</strong>: Code is{' '}
                    <strong className="font-mono text-base tracking-widest text-[#1b5e20] bg-white px-2 py-0.5 rounded border border-[#a5d6a7]">
                      {simulatedSignupOtp}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSignupOtpCode(simulatedSignupOtp)}
                  className="px-3.5 py-1.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  Auto-Fill OTP
                </button>
              </div>
            )}

            {/* Verification Info Box */}
            <div className="p-4 bg-[#f8faf8] border border-[#e2e8e0] rounded-2xl flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#56615a] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#56615a]">
                A 6-digit confirmation OTP was dispatched to <span className="font-bold text-[#1b1c1c]">{signupEmail}</span>. Please check your inbox and enter it below to activate your account.
              </div>
            </div>

            {/* 6-Digit OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm sm:text-base font-bold text-[#2d312e] uppercase tracking-wide block">
                  6-Digit Verification OTP <span className="text-[#ba1a1a]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleResendSignupOtp}
                  disabled={loading || signupOtpCountdown > 0}
                  className={`text-xs sm:text-sm font-bold cursor-pointer ${
                    signupOtpCountdown > 0
                      ? 'text-[#737874] cursor-not-allowed'
                      : 'text-[#56615a] hover:underline'
                  }`}
                >
                  {signupOtpCountdown > 0 ? `Resend in ${signupOtpCountdown}s` : 'Resend Code'}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 text-[#56615a] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={signupOtpCode}
                  onChange={(e) => setSignupOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-12 sm:pl-14 pr-4 py-4 text-2xl sm:text-3xl font-mono font-black tracking-[0.3em] text-center rounded-2xl bg-white border-2 border-[#D8D6D4] text-[#1b1c1c] shadow-xs focus:outline-none focus:border-[#56615a]"
                />
              </div>
              <span className="text-xs text-[#737874] mt-1.5 block text-center">
                Enter the 6 numbers received in your email
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || signupOtpCode.length < 6}
                className="w-full py-4.5 sm:py-5 bg-[#56615a] hover:bg-[#3e4641] disabled:opacity-50 text-white font-extrabold text-base sm:text-xl rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Verifying OTP & Registering...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Verify OTP & Complete Sign Up</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#56615a] hover:underline cursor-pointer"
              >
                ← Back to Edit Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#737874] hover:text-[#1b1c1c] hover:underline cursor-pointer"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
