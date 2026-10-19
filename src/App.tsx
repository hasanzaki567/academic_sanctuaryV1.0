import React, { useState, useEffect } from 'react';
import { Classroom, User, Subject, Material, Announcement, Exam, Member, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { SubjectDetailView } from './components/SubjectDetailView';
import { CreateClassroomWizard } from './components/CreateClassroomWizard';
import { SubjectsListView } from './components/SubjectsListView';
import { NotesRepositoryView } from './components/NotesRepositoryView';
import { ExamsScheduleView } from './components/ExamsScheduleView';
import { MembersDirectoryView } from './components/MembersDirectoryView';
import { ProfileView } from './components/ProfileView';
import { UploadMaterialModal } from './components/UploadMaterialModal';
import { DocumentReaderModal } from './components/DocumentReaderModal';
import { JoinClassroomModal } from './components/JoinClassroomModal';
import { AuthModal } from './components/AuthModal';
import { ChatView } from './components/chat/ChatView';
import { supabase } from './lib/supabase';
import { MessageSquare, UserCheck, School } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // App navigation state: 'landing' | 'dashboard' | 'subject-detail' | 'create-classroom' | 'subjects' | 'notes' | 'exams' | 'members' | 'profile' | 'chat'
  const [currentView, setCurrentView] = useState<string>('landing');
  const [initialChatTargetUserId, setInitialChatTargetUserId] = useState<string | null>(null);
  const [materialToForward, setMaterialToForward] = useState<Material | null>(null);

  // Universal Navigation History Stack to enable Back Button across all views and features
  const [navHistory, setNavHistory] = useState<Array<{ view: string; subject?: Subject | null }>>([]);

  const handleForwardMaterialFromNotes = (material: Material) => {
    setNavHistory((prev) => [...prev, { view: currentView, subject: selectedSubject }]);
    setMaterialToForward(material);
    setCurrentView('chat');
  };
  
  // Data states
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [activeClassroom, setActiveClassroom] = useState<Classroom | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  // Auth Modal state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSubjectId, setUploadSubjectId] = useState<string | undefined>(undefined);
  const [uploadExamType, setUploadExamType] = useState<string | undefined>(undefined);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenUpload = (targetSubjectOrExamId?: string, targetExamType?: string) => {
    let resolvedSubjectId = targetSubjectOrExamId;
    let resolvedExamType = targetExamType;

    if (targetSubjectOrExamId && targetSubjectOrExamId.startsWith('exam-')) {
      const foundExam = exams.find((e) => e.id === targetSubjectOrExamId);
      if (foundExam) {
        resolvedExamType = targetExamType || foundExam.examType;
        const matchingSubject = subjects.find(
          (s) =>
            s.code.toLowerCase() === foundExam.subjectCode.toLowerCase() ||
            s.name.toLowerCase() === foundExam.subjectName.toLowerCase()
        );
        if (matchingSubject) {
          resolvedSubjectId = matchingSubject.id;
        }
      }
    }

    setUploadSubjectId(resolvedSubjectId);
    setUploadExamType(resolvedExamType);
    setIsUploadOpen(true);
  };

  // Helper to load all resources for a specific classroom
  const loadClassroomData = async (classroomId?: string) => {
    try {
      const q = classroomId ? `?classroomId=${classroomId}` : '';
      const [subRes, matRes, annRes, exRes, memRes] = await Promise.all([
        fetch(`/api/subjects${q}`),
        fetch(`/api/materials${q}`),
        fetch(`/api/announcements${q}`),
        fetch(`/api/exams${q}`),
        fetch(`/api/members${q}`),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubjects(subData);
        if (subData.length > 0) setSelectedSubject(subData[0]);
      }
      if (matRes.ok) {
        const matData = await matRes.json();
        setMaterials(matData);
      }
      if (annRes.ok) {
        const annData = await annRes.json();
        setAnnouncements(annData);
      }
      if (exRes.ok) {
        const exData = await exRes.json();
        setExams(exData);
      }
      if (memRes.ok) {
        const memData = await memRes.json();
        setMembers(memData);
      }
    } catch (err) {
      console.error('Error loading classroom resources:', err);
    }
  };

  // Helper to load Supabase User and match their classroom
  const loadSupabaseUser = async (sbUser: any, currentClassrooms: Classroom[]) => {
    try {
      let profile: any = null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sbUser.id)
          .maybeSingle();
        if (!error && data) {
          profile = data;
        }
      } catch (e) {
        console.warn('Could not query profiles table:', e);
      }

      const resolvedName =
        profile?.full_name ||
        sbUser.user_metadata?.full_name ||
        sbUser.email?.split('@')[0] ||
        'Student';

      const resolvedClassCode =
        profile?.class_code ||
        sbUser.user_metadata?.class_code ||
        '';

      const resolvedRegNo =
        profile?.registration_number ||
        sbUser.user_metadata?.registration_number ||
        '';

      let matchedCls = currentClassrooms.find(
        (c) => c.code.toLowerCase() === resolvedClassCode.toLowerCase()
      );

      if (!matchedCls && resolvedClassCode) {
        matchedCls = {
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
          superAdminId: sbUser.id,
          memberCount: 1,
          createdAt: new Date().toISOString(),
        };
        setClassrooms((prev) => [matchedCls!, ...prev.filter((c) => c.id !== matchedCls!.id)]);
      }

      const appUser: User = {
        id: sbUser.id,
        name: resolvedName,
        email: sbUser.email || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sbUser.id)}`,
        role: 'student',
        department: 'Academic Sanctuary',
        rollNumber: resolvedRegNo,
        classCode: resolvedClassCode,
        registrationNumber: resolvedRegNo,
        classroomId: matchedCls?.id,
      };

      setCurrentUser(appUser);
      if (matchedCls) {
        setActiveClassroom(matchedCls);
        loadClassroomData(matchedCls.id);
      }
    } catch (err) {
      console.error('Error loading Supabase user profile:', err);
    }
  };

  // Fetch initial data and restore Supabase authentication session
  useEffect(() => {
    let loadedClassrooms: Classroom[] = [];

    const initializeApp = async () => {
      try {
        const clsRes = await fetch('/api/classrooms');
        if (clsRes.ok) {
          loadedClassrooms = await clsRes.json();
          setClassrooms(loadedClassrooms);
          if (loadedClassrooms.length > 0) {
            setActiveClassroom(loadedClassrooms[0]);
            loadClassroomData(loadedClassrooms[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load initial classrooms from server:', err);
      }

      // Check URL for recovery link (password reset from email)
      if (window.location.hash.includes('type=recovery') || window.location.hash.includes('reset-password')) {
        setAuthInitialMode('reset-password');
        setIsAuthOpen(true);
      }

      // Restore active Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadSupabaseUser(session.user, loadedClassrooms);
        }
      } catch (err) {
        console.error('Error restoring Supabase session:', err);
      }
    };

    initializeApp();

    // Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthInitialMode('reset-password');
        setIsAuthOpen(true);
      } else if (event === 'SIGNED_IN' && session?.user) {
        await loadSupabaseUser(session.user, loadedClassrooms);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handlers
  const handleNavigate = (view: string, data?: any) => {
    if (view === currentView && (!data || data?.id === selectedSubject?.id)) return;
    if ((view === 'chat' || view === 'profile') && !currentUser) {
      showToast('Please sign in with your email and password to access ' + (view === 'chat' ? 'cohort chat.' : 'your profile.'));
      handleOpenAuth('login');
      return;
    }
    setNavHistory((prev) => [...prev, { view: currentView, subject: selectedSubject }]);
    if (view === 'subject-detail' && data) {
      setSelectedSubject(data);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (navHistory.length > 0) {
      const nextHist = [...navHistory];
      const prevEntry = nextHist.pop()!;
      setNavHistory(nextHist);
      if (prevEntry.subject) {
        setSelectedSubject(prevEntry.subject);
      }
      setCurrentView(prevEntry.view);
    } else {
      // Fallback hierarchy if stack is empty
      if (currentView === 'subject-detail') {
        setCurrentView('notes');
      } else if (currentView !== 'dashboard' && currentView !== 'landing') {
        setCurrentView('dashboard');
      } else if (currentView === 'dashboard') {
        setCurrentView('landing');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot-password' | 'reset-password' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user: User, classroom: Classroom, message: string) => {
    setCurrentUser(user);
    setActiveClassroom(classroom);
    if (!classrooms.find((c) => c.id === classroom.id)) {
      setClassrooms([classroom, ...classrooms]);
    }
    loadClassroomData(classroom.id);
    showToast(message || `Welcome, ${user.name}! Connected to ${classroom.code}`);
    setCurrentView('dashboard');
  };

  const handleQuickDemoLogin = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        confetti({ particleCount: 50, spread: 60 });
        handleAuthSuccess(data.user, data.classroom, data.message || `Welcome back, ${data.user.name}!`);
      } else {
        showToast(data.error || 'Failed to authenticate demo account.');
      }
    } catch {
      showToast('Error connecting to demo authentication server.');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setCurrentUser(null);
    showToast('Signed out successfully. Returned to sanctuary landing.');
    setCurrentView('landing');
  };

  const handleCreateClassroom = async (formData: any) => {
    try {
      const res = await fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newCls = await res.json();
        setClassrooms([newCls, ...classrooms]);
        setActiveClassroom(newCls);
        
        // Refresh subjects and data for new classroom
        loadClassroomData(newCls.id);

        confetti({ particleCount: 50, spread: 60 });
        showToast(`Classroom "${newCls.name}" created! You are Super Admin.`);
        setCurrentView('dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinClassroom = async (code: string) => {
    try {
      const res = await fetch('/api/classrooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.classroom) {
          setActiveClassroom(result.classroom);
          if (!classrooms.find((c) => c.id === result.classroom.id)) {
            setClassrooms([result.classroom, ...classrooms]);
          }
          loadClassroomData(result.classroom.id);
          confetti({ particleCount: 50, spread: 60 });
          showToast(`Successfully enrolled in "${result.classroom.name}"!`);
          setCurrentView('dashboard');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadMaterial = async (materialData: any) => {
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialData),
      });
      if (res.ok) {
        const newMat = await res.json();
        setMaterials([...materials, newMat]);
        showToast(`"${newMat.title}" uploaded to library.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAnnouncement = async (title: string, description: string) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, isUrgent: true }),
      });
      if (res.ok) {
        const newAnn = await res.json();
        setAnnouncements([newAnn, ...announcements]);
        showToast('Announcement posted to cohort members.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExam = async (examData: any) => {
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData),
      });
      if (res.ok) {
        const newExam = await res.json();
        setExams([...exams, newExam]);
        showToast(`Exam schedule added for ${newExam.subjectName}.`);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Only administrators can schedule exams.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (memberData: {
    email: string;
    name: string;
    rollNumber: string;
    role: 'student' | 'admin';
    department?: string;
  }) => {
    if (!activeClassroom) return;
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...memberData,
          classroomId: activeClassroom.id,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to enroll member.');
      }
      const newMember = await res.json();
      setMembers((prev) => {
        const exists = prev.some((m) => m.id === newMember.id);
        if (exists) return prev;
        return [...prev, newMember];
      });
      showToast(`${newMember.name} enrolled via institutional mail (${newMember.email}).`);
      confetti({ particleCount: 35, spread: 55 });
    } catch (err: any) {
      showToast(err.message || 'Error adding member.');
      throw err;
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: UserRole) => {
    try {
      const res = await fetch(`/api/members/${memberId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update role.');
      }
      const updated = await res.json();
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: updated.role } : m)));
      if (currentUser && currentUser.id === memberId) {
        setCurrentUser((prev) => (prev ? { ...prev, role: updated.role } : null));
      }
      showToast(
        newRole === 'admin'
          ? `Granted Administrator access to ${updated.name}.`
          : `Administrator access removed for ${updated.name}.`
      );
    } catch (err: any) {
      showToast(err.message || 'Error updating member role.');
      throw err;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to remove member.');
      }
      const target = members.find((m) => m.id === memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showToast(`Removed ${target?.name || 'member'} from cohort.`);
    } catch (err: any) {
      showToast(err.message || 'Error removing member.');
      throw err;
    }
  };

  const handleBanMember = async (memberId: string, memberName?: string) => {
    try {
      const res = await fetch(`/api/members/${memberId}/ban`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to ban member.');
      }
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showToast(`Permanently banned ${memberName || 'member'} from cohort.`);
    } catch (err: any) {
      showToast(err.message || 'Error banning member.');
      throw err;
    }
  };

  const handleToggleExamComplete = async (examId: string, currentCompleted?: boolean) => {
    const newStatus = !currentCompleted;
    try {
      const res = await fetch(`/api/exams/${examId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setExams((prev) => prev.map((e) => (e.id === examId ? updated : e)));
        showToast(newStatus ? 'Exam marked as completed! Great milestone!' : 'Exam moved back to upcoming timetable.');
      }
    } catch {
      setExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, isCompleted: newStatus } : e))
      );
    }
  };

  const handleDownloadMaterial = (material: Material) => {
    const content =
      material.contentSnippet ||
      `# ${material.title}\nCourse: ${material.subjectName} (${material.subjectCode})\nUploaded by: ${material.uploadedBy.name}\n\nAcademic notes provided for batch exam preparation.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${material.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${material.fileFormat.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloading "${material.title}" (${material.fileSize})...`);
  };

  const nextExam =
    exams
      .filter((e) => !e.isCompleted && (e.daysRemaining === undefined || e.daysRemaining >= 0))
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))[0] ||
    (exams.length > 0 ? exams[0] : null);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1b1c1c] flex flex-col font-body-md antialiased selection:bg-[#d9e6dc] selection:text-[#1b1c1c]">
      {/* Toast alert message */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1b1c1c] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span className="w-2 h-2 rounded-full bg-[#d6e7a1]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        activeClassroom={activeClassroom}
        currentUser={currentUser}
        announcements={announcements}
        classrooms={classrooms}
        onNavigate={handleNavigate}
        onBack={handleGoBack}
        canGoBack={navHistory.length > 0 || currentView !== 'landing'}
        onOpenCreateClassroom={() => handleNavigate('create-classroom')}
        onOpenJoinClassroom={() => setIsJoinOpen(true)}
        onSelectClassroom={(cls) => {
          setActiveClassroom(cls);
          loadClassroomData(cls.id);
          showToast(`Switched to cohort: ${cls.name}`);
        }}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Main Views */}
      <div className={currentView === 'landing' ? 'w-full' : 'pt-[68px] w-full min-h-screen'}>
        {currentView === 'landing' && (
          <LandingPage
            onOpenCreateClassroom={() => handleNavigate('create-classroom')}
            onOpenJoinClassroom={() => setIsJoinOpen(true)}
            onOpenAuth={handleOpenAuth}
            onQuickDemoLogin={handleQuickDemoLogin}
          />
        )}

        {currentView === 'dashboard' && (
          activeClassroom ? (
            <DashboardView
              classroom={activeClassroom}
              user={currentUser || {
                id: 'guest',
                name: 'Student',
                email: 'student@institution.edu',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
                role: 'student',
                department: 'General Studies',
                rollNumber: 'STU001'
              }}
              announcements={announcements}
              nextExam={nextExam}
              recentMaterials={materials.slice(0, 8)}
              onNavigate={handleNavigate}
              onBack={handleGoBack}
              onOpenUpload={() => handleOpenUpload()}
              onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
              onAddAnnouncement={handleAddAnnouncement}
            />
          ) : (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-[#E5E4E2] rounded-3xl text-center shadow-md flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#d9e6dc] flex items-center justify-center text-[#56615a]">
                <School className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#1b1c1c]">No Classroom Connected</h2>
              <p className="text-sm text-[#56615a]">
                You are not currently enrolled in any classroom cohort. Join an existing cohort with an access code or create a new classroom for your batch.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center">
                <button
                  onClick={() => setIsJoinOpen(true)}
                  className="px-6 py-3 bg-[#56615a] hover:bg-[#434d46] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Join Classroom
                </button>
                <button
                  onClick={() => handleNavigate('create-classroom')}
                  className="px-6 py-3 bg-white border border-[#E5E4E2] text-[#1b1c1c] font-bold text-sm rounded-xl hover:bg-[#F0EDED] transition-all cursor-pointer"
                >
                  Create Classroom
                </button>
              </div>
            </div>
          )
        )}

        {currentView === 'subject-detail' && selectedSubject && (
          <SubjectDetailView
            subject={selectedSubject}
            materials={materials}
            onOpenUpload={(subId) => handleOpenUpload(subId)}
            onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
            onDownloadMaterial={handleDownloadMaterial}
            onForwardMaterial={handleForwardMaterialFromNotes}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'create-classroom' && (
          <CreateClassroomWizard
            onCreate={handleCreateClassroom}
            onCancel={handleGoBack}
          />
        )}

        {currentView === 'subjects' && (
          <SubjectsListView
            subjects={subjects}
            onSelectSubject={(subject) => {
              handleNavigate('subject-detail', subject);
            }}
            onBack={handleGoBack}
            onAddSubject={(subjectData) => {
              fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subjectData),
              })
                .then((res) => res.json())
                .then((newSub) => {
                  setSubjects((prev) => [...prev, newSub]);
                  showToast(`Course "${newSub.name}" added successfully.`);
                })
                .catch((err) => {
                  console.error('Error adding subject:', err);
                  showToast('Failed to add subject.');
                });
            }}
          />
        )}

        {currentView === 'notes' && (
          <NotesRepositoryView
            materials={materials}
            subjects={subjects}
            onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
            onDownloadMaterial={handleDownloadMaterial}
            onOpenUpload={() => handleOpenUpload()}
            onForwardMaterial={handleForwardMaterialFromNotes}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'exams' && (
          <ExamsScheduleView
            exams={exams}
            materials={materials}
            currentUserRole={currentUser?.role || 'student'}
            onAddExam={handleAddExam}
            onToggleComplete={handleToggleExamComplete}
            onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
            onDownloadMaterial={handleDownloadMaterial}
            onOpenUpload={(examId, examType) => handleOpenUpload(examId, examType)}
            onBack={handleGoBack}
            onNavigateToSubject={(code) => {
              const found = subjects.find((s) => s.code.toLowerCase() === code.toLowerCase());
              if (found) {
                handleNavigate('subject-detail', found);
              } else {
                handleNavigate('notes');
              }
            }}
          />
        )}

        {currentView === 'members' && activeClassroom && (
          <MembersDirectoryView
            members={members}
            classroom={activeClassroom}
            currentUserRole={currentUser?.role || 'student'}
            currentUserId={currentUser?.id}
            onAddMember={handleAddMember}
            onUpdateRole={handleUpdateMemberRole}
            onRemoveMember={handleRemoveMember}
            onBanMember={handleBanMember}
            onBack={handleGoBack}
            onStartChat={(memberId) => {
              setNavHistory((prev) => [...prev, { view: currentView, subject: selectedSubject }]);
              setInitialChatTargetUserId(memberId);
              setCurrentView('chat');
            }}
          />
        )}

        {currentView === 'chat' && activeClassroom && (
          currentUser ? (
            <ChatView
              currentUser={currentUser}
              activeClassroomId={activeClassroom.id}
              classMembers={members}
              materials={materials}
              onOpenDocumentReader={(mat) => setPreviewMaterial(mat)}
              initialTargetUserId={initialChatTargetUserId}
              onClearInitialTarget={() => setInitialChatTargetUserId(null)}
              materialToForward={materialToForward}
              onClearMaterialToForward={() => setMaterialToForward(null)}
              onRemoveCohortMember={handleRemoveMember}
              onBanCohortMember={handleBanMember}
              onBack={handleGoBack}
              onUpdateCurrentUser={(updated) => {
                setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
                setMembers((prev) =>
                  prev.map((m) =>
                    m.id === currentUser?.id
                      ? {
                          ...m,
                          name: updated.name || m.name,
                          avatar: updated.avatar || m.avatar,
                        }
                      : m
                  )
                );
              }}
              onUpdateFriendName={(friendId, newName) => {
                setMembers((prev) =>
                  prev.map((m) => (m.id === friendId ? { ...m, name: newName } : m))
                );
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white border border-[#E5E4E2] rounded-3xl text-center shadow-md flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#d9e6dc] flex items-center justify-center text-[#56615a]">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#1b1c1c]">Sign In Required</h2>
              <p className="text-sm text-[#56615a]">
                Please sign in with your institutional email and credentials to participate in your cohort chat.
              </p>
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-6 py-3 bg-[#56615a] hover:bg-[#434d46] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Sign In with Institutional ID
              </button>
            </div>
          )
        )}

        {currentView === 'profile' && (
          currentUser ? (
            <ProfileView
              user={currentUser}
              classroom={activeClassroom}
              materials={materials}
              onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
              onOpenAuth={handleOpenAuth}
              onSignOut={handleSignOut}
              onBack={handleGoBack}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white border border-[#E5E4E2] rounded-3xl text-center shadow-md flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#d9e6dc] flex items-center justify-center text-[#56615a]">
                <UserCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#1b1c1c]">Member Profile</h2>
              <p className="text-sm text-[#56615a]">
                Sign in to your account to view your uploaded notes, enrolled cohort stats, and academic contributions.
              </p>
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-6 py-3 bg-[#56615a] hover:bg-[#434d46] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Sign In to Your Account
              </button>
            </div>
          )
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'subjects' && subjects.length > 0) {
            setSelectedSubject(subjects[0]);
          }
          handleNavigate(view);
        }}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        classrooms={classrooms}
      />

      <UploadMaterialModal
        isOpen={isUploadOpen}
        subjects={subjects}
        exams={exams}
        defaultSubjectId={uploadSubjectId}
        defaultExamType={uploadExamType}
        onClose={() => {
          setIsUploadOpen(false);
          setUploadSubjectId(undefined);
          setUploadExamType(undefined);
        }}
        onUpload={handleUploadMaterial}
      />

      <DocumentReaderModal
        isOpen={Boolean(previewMaterial)}
        material={previewMaterial}
        onClose={() => setPreviewMaterial(null)}
        onDownload={handleDownloadMaterial}
      />

      <JoinClassroomModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoin={handleJoinClassroom}
      />
    </div>
  );
}

