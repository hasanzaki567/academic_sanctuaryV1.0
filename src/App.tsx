import React, { useState, useEffect } from 'react';
import { Classroom, User, Subject, Material, Announcement, Exam, Member } from './types';
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
import confetti from 'canvas-confetti';

export default function App() {
  // App navigation state: 'landing' | 'dashboard' | 'subject-detail' | 'create-classroom' | 'subjects' | 'notes' | 'exams' | 'members' | 'profile'
  const [currentView, setCurrentView] = useState<string>('landing');
  
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
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSubjectId, setUploadSubjectId] = useState<string | undefined>(undefined);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
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

  // Fetch initial data from Express backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clsRes, authMeRes] = await Promise.all([
          fetch('/api/classrooms'),
          fetch('/api/auth/me'),
        ]);

        let initialClassroom: Classroom | null = null;

        if (clsRes.ok) {
          const clsData = await clsRes.json();
          setClassrooms(clsData);
          if (clsData.length > 0) {
            initialClassroom = clsData[0];
            setActiveClassroom(clsData[0]);
          }
        }

        if (authMeRes.ok) {
          const authData = await authMeRes.json();
          if (authData.user) {
            setCurrentUser(authData.user);
          }
          if (authData.classroom) {
            initialClassroom = authData.classroom;
            setActiveClassroom(authData.classroom);
          }
        }

        if (initialClassroom) {
          loadClassroomData(initialClassroom.id);
        }
      } catch (err) {
        console.error('Failed to load initial data from server:', err);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleNavigate = (view: string, data?: any) => {
    if (view === 'subject-detail' && data) {
      setSelectedSubject(data);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
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

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    showToast('Signed out. Returned to sanctuary landing.');
    setCurrentView('landing');
  };

  const handleOpenUpload = (subjectId?: string) => {
    setUploadSubjectId(subjectId);
    setIsUploadOpen(true);
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
        setMaterials([newMat, ...materials]);
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
      }
    } catch (err) {
      console.error(err);
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

  const nextExam = exams.length > 0 ? exams[0] : null;

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
        onOpenCreateClassroom={() => setCurrentView('create-classroom')}
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
      <div className={currentView === 'landing' ? '' : 'pt-[68px]'}>
        {currentView === 'landing' && (
          <LandingPage
            onOpenCreateClassroom={() => setCurrentView('create-classroom')}
            onOpenJoinClassroom={() => setIsJoinOpen(true)}
            onEnterDemo={() => setCurrentView('dashboard')}
            onOpenAuth={handleOpenAuth}
            currentUser={currentUser}
            onGoToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'dashboard' && activeClassroom && (
          <DashboardView
            classroom={activeClassroom}
            user={currentUser || {
              id: 'guest',
              name: 'Student',
              email: 'student@sanctuary.edu',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
              role: 'student',
              department: 'General Studies',
              rollNumber: 'STU001'
            }}
            announcements={announcements}
            nextExam={nextExam}
            recentMaterials={materials.slice(0, 6)}
            onNavigate={handleNavigate}
            onOpenUpload={() => handleOpenUpload()}
            onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}

        {currentView === 'subject-detail' && selectedSubject && (
          <SubjectDetailView
            subject={selectedSubject}
            materials={materials}
            onOpenUpload={(subId) => handleOpenUpload(subId)}
            onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
            onDownloadMaterial={handleDownloadMaterial}
          />
        )}

        {currentView === 'create-classroom' && (
          <CreateClassroomWizard
            onCreate={handleCreateClassroom}
            onCancel={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'subjects' && (
          <SubjectsListView
            subjects={subjects}
            onSelectSubject={(subject) => {
              setSelectedSubject(subject);
              setCurrentView('subject-detail');
            }}
            onOpenAddSubject={() => {
              const name = prompt('Enter new subject name (e.g. Cloud Computing):');
              if (name) {
                const code = prompt('Enter course code (e.g. CS307):') || 'CS307';
                fetch('/api/subjects', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, code, professor: 'Dr. Guest Faculty', description: `Curriculum and notes for ${name}` }),
                })
                  .then((res) => res.json())
                  .then((newSub) => {
                    setSubjects([...subjects, newSub]);
                    showToast(`Subject "${newSub.name}" added.`);
                  });
              }
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
          />
        )}

        {currentView === 'exams' && (
          <ExamsScheduleView
            exams={exams}
            onAddExam={handleAddExam}
            onNavigateToSubject={(code) => {
              const found = subjects.find((s) => s.code.toLowerCase() === code.toLowerCase());
              if (found) {
                setSelectedSubject(found);
                setCurrentView('subject-detail');
              } else {
                setCurrentView('notes');
              }
            }}
          />
        )}

        {currentView === 'members' && activeClassroom && (
          <MembersDirectoryView
            members={members}
            classroom={activeClassroom}
            currentUserRole={currentUser?.role || 'student'}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <ProfileView
            user={currentUser}
            classroom={activeClassroom}
            materials={materials}
            onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
            onOpenAuth={handleOpenAuth}
            onSignOut={handleSignOut}
          />
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
        defaultSubjectId={uploadSubjectId}
        onClose={() => setIsUploadOpen(false)}
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

