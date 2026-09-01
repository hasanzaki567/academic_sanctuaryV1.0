import React from 'react';
import { Plus, LogIn, ArrowRight, Sparkles, UserPlus, School, KeyRound, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onOpenCreateClassroom: () => void;
  onOpenJoinClassroom: () => void;
  onEnterDemo: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  currentUser?: any | null;
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenCreateClassroom,
  onOpenJoinClassroom,
  onEnterDemo,
  onOpenAuth,
  currentUser,
  onGoToDashboard,
}) => {
  const benefits = [
    {
      icon: 'groups',
      title: 'One classroom for your entire batch',
      description: 'Keep everyone on the same page with a dedicated unified space for your cohort.',
    },
    {
      icon: 'category',
      title: 'All subjects in one place',
      description: 'Easily navigate between courses without losing track of your materials.',
    },
    {
      icon: 'library_books',
      title: 'Notes and study materials',
      description: 'Store and access high-quality study guides and lecture notes.',
    },
    {
      icon: 'share',
      title: 'Student-powered knowledge sharing',
      description: 'Collaborate with peers to build a robust repository of information.',
    },
    {
      icon: 'admin_panel_settings',
      title: 'Admin-controlled uploads',
      description: 'Maintain quality and organization with moderated content contributions.',
    },
    {
      icon: 'school',
      title: 'Exam preparation resources',
      description: 'Access past papers, quizzes, and specific study paths for finals.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center pt-8 md:pt-14 pb-16 max-w-[1280px] mx-auto w-full px-4 md:px-16">
        {/* Hero Section */}
        <section className="w-full text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D9E6DC] text-[#3E4942] rounded-full text-xs font-semibold mb-6 border border-[#C3C8C3]/40 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Single Classroom Platform for Academic Cohorts</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#1b1c1c] tracking-tight mb-6 max-w-4xl mx-auto leading-[1.15]">
            Your Class. Your Notes. Your Knowledge.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#434844] mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Sign in to your dedicated batch classroom. Every student gets a focused sanctuary for notes, PYQs, and exams.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-lg mx-auto">
            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto bg-[#56615a] hover:bg-[#434d46] text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Go to My Cohort</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            {!currentUser && (
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto bg-white border border-[#E5E4E2] text-[#1b1c1c] font-semibold text-sm md:text-base px-7 py-3.5 rounded-xl hover:bg-[#F0EDED] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4 text-[#56615a]" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs">
            <button
              onClick={onEnterDemo}
              className="text-[#56615a] underline hover:text-[#1b1c1c] font-semibold cursor-pointer"
            >
              Explore Oxford CSE 2026 Batch →
            </button>
            <span className="text-[#C3C8C3]">•</span>
            <button
              onClick={() => onOpenAuth('login')}
              className="text-[#737874] hover:text-[#1b1c1c] flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-[#56642b]" />
              <span>1-Click Test Profiles</span>
            </button>
          </div>
        </section>

        {/* Illustration Section */}
        <section className="w-full mb-16 md:mb-20 flex justify-center">
          <div className="w-full max-w-5xl h-[260px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden border border-[#E5E4E2] bg-[#FEFEFA] shadow-[0_4px_20px_rgba(51,51,51,0.05)] relative flex items-center justify-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdAnbxb7e7-hljEQ3bymM2tr6Ms58xnCp8kXLmS5SwZqeasQe7fAPcVRfLfawdqtYoweFUAzd9DyesLsN2D6e1KZt1qyHud8SvzDZTD69USJYUrua3YisGFZfUKP1N8qSmti2_Y7rLOpKbMUb6DmcqrpMVNMc7-cnDasfMjiymJtmQO1_TojSJmSFpZADkTFpg5CgdnKSokpoytCiW2_--4DBBGeDa1IbIp4-QmWKu_VbMGBgOf-1tBA"
              alt="Students studying together in warm library aesthetic"
              className="w-full h-full object-cover opacity-95 hover:scale-[1.01] transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Benefits Section (Bento Grid) */}
        <section className="w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1b1c1c] text-center mb-10 tracking-tight">
            Everything you need to succeed in your cohort
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-6 flex flex-col gap-3 shadow-[0_4px_20px_rgba(51,51,51,0.03)] hover:border-[#b2beb5] hover:shadow-[0_8px_30px_rgba(51,51,51,0.06)] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#EAE8E7] flex items-center justify-center text-[#56615a] mb-1 group-hover:bg-[#d9e6dc] transition-colors">
                  <span className="material-symbols-outlined text-[24px]">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1b1c1c] leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#434844] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 md:px-16 py-8 border-t border-[#E5E4E2] flex flex-col md:flex-row justify-between items-center gap-4 mt-auto bg-[#FDFCF8]">
        <div className="text-xs text-[#737874]">
          © 2024 Academic Sanctuary. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-xs text-[#56615a]">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help Center</span>
        </div>
      </footer>
    </div>
  );
};
