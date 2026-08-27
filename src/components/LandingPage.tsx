import React from 'react';
import { Plus, LogIn, ArrowRight, Sparkles, UserPlus, School, KeyRound, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onOpenCreateClassroom: () => void;
  onOpenJoinClassroom: () => void;
  onEnterDemo: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenCreateClassroom,
  onOpenJoinClassroom,
  onEnterDemo,
  onOpenAuth,
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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-grow flex flex-col items-center justify-center pt-8 md:pt-14 pb-16 max-w-[1280px] mx-auto w-full px-4 md:px-16">
        {/* Hero Section */}
        <section className="w-full text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-full text-xs font-bold mb-6 border border-[#FDE68A] animate-in fade-in shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-[#D97706]">menu_book</span>
            <span>Single Classroom Platform for Academic Cohorts</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#0F172A] tracking-tight mb-6 max-w-4xl mx-auto leading-[1.15]">
            Your Class. Your Notes. Your Knowledge.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#475569] mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Sign in to your dedicated batch classroom. Every student gets a focused sanctuary for notes, PYQs, and exams.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-lg mx-auto">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-950/15 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Student Account</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-sm md:text-base px-7 py-3.5 rounded-xl hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4 text-[#1E3A8A]" />
              <span>Sign In</span>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs">
            <button
              onClick={onEnterDemo}
              className="text-[#1E3A8A] underline hover:text-[#0F172A] font-bold cursor-pointer transition-colors"
            >
              Explore Oxford CSE 2026 Batch →
            </button>
            <span className="text-[#CBD5E1]">•</span>
            <button
              onClick={() => onOpenAuth('login')}
              className="text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer transition-colors font-medium"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
              <span>1-Click Test Profiles</span>
            </button>
          </div>
        </section>

        {/* Illustration Section */}
        <section className="w-full mb-16 md:mb-20 flex justify-center">
          <div className="w-full max-w-5xl h-[280px] sm:h-[400px] md:h-[480px] rounded-3xl overflow-hidden border border-[#CBD5E1] bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.12)] relative flex items-center justify-center group ring-1 ring-black/5">
            <img
              src="/hero-library.jpg"
              alt="University students studying in a grand Oxford library with glowing amber lamps"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </section>

        {/* Benefits Section (Bento Grid) */}
        <section className="w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] text-center mb-10 tracking-tight">
            Everything you need to succeed in your cohort
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-3 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:border-[#93C5FD] hover:shadow-[0_12px_30px_rgba(30,58,138,0.08)] transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#1E3A8A] mb-1 group-hover:bg-[#DBEAFE] transition-colors shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#0F172A] leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 md:px-16 py-8 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4 mt-auto bg-white">
        <div className="text-xs text-[#64748B]">
          © 2024 Academic Sanctuary. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-xs text-[#1E3A8A] font-medium">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span className="hover:underline cursor-pointer">Help Center</span>
        </div>
      </footer>
    </div>
  );
};
