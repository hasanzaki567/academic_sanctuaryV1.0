import React from 'react';
import { X, School, Plus, LogIn, Users, BookOpen, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface CohortChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCohort: () => void;
  onJoinCohort: () => void;
  userName?: string;
}

export const CohortChoiceModal: React.FC<CohortChoiceModalProps> = ({
  isOpen,
  onClose,
  onCreateCohort,
  onJoinCohort,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#FDFCF8] rounded-3xl shadow-2xl border-2 border-[#E5E4E2] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-linear-to-r from-[#56615a] via-[#859489] to-[#d9e6dc]" />

        {/* Header */}
        <div className="px-6 sm:px-10 pt-8 pb-4 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d9e6dc] text-[#2d312e] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#56615a]" />
              <span>Welcome to Academic Sanctuary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1b1c1c] tracking-tight">
              {userName ? `Welcome, ${userName}!` : 'Get Started with Your Cohort'}
            </h2>
            <p className="text-sm sm:text-base text-[#56615a] mt-1">
              Academic Sanctuary revolves around your classroom cohort. Choose an option below to proceed:
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-2 text-[#737874] hover:text-[#1b1c1c] hover:bg-[#F0EDED] rounded-2xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content: 2 Cards */}
        <div className="px-6 sm:px-10 py-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Create a Cohort */}
            <div 
              onClick={() => {
                onClose();
                onCreateCohort();
              }}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#E5E4E2] hover:border-[#56615a] transition-all duration-200 hover:shadow-xl cursor-pointer hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plus className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F0EDED] text-[#56615a] border border-[#E5E4E2]">
                    Super Admin
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#1b1c1c] group-hover:text-[#56615a] transition-colors">
                  Create a Cohort
                </h3>
                <p className="text-xs sm:text-sm text-[#56615a] mt-2 leading-relaxed">
                  Start a fresh sanctuary for your branch, section, or batch. You will configure subjects and invite peers with an exclusive code.
                </p>

                <div className="mt-5 space-y-2.5 pt-4 border-t border-[#F0EDED]">
                  <div className="flex items-center gap-2.5 text-xs text-[#2d312e] font-medium">
                    <Shield className="w-4 h-4 text-[#56615a] shrink-0" />
                    <span>Become Super Admin for your class</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#2d312e] font-medium">
                    <BookOpen className="w-4 h-4 text-[#56615a] shrink-0" />
                    <span>Configure subjects, semesters & faculty</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#2d312e] font-medium">
                    <Users className="w-4 h-4 text-[#56615a] shrink-0" />
                    <span>Distribute invite code to your peers</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 bg-[#56615a] hover:bg-[#434d46] text-white font-bold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-lg cursor-pointer"
                >
                  <span>Create New Cohort</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: Join a Cohort */}
            <div 
              onClick={() => {
                onClose();
                onJoinCohort();
              }}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#E5E4E2] hover:border-[#56615a] transition-all duration-200 hover:shadow-xl cursor-pointer hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#EDE9DF] text-[#737874] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <LogIn className="w-7 h-7 text-[#2d312e]" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDE9DF] text-[#2d312e] border border-[#D8D6D4]">
                    Have a Code
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#1b1c1c] group-hover:text-[#56615a] transition-colors">
                  Join a Cohort
                </h3>
                <p className="text-xs sm:text-sm text-[#56615a] mt-2 leading-relaxed">
                  Already have a classroom code from your class representative or professor? Enter it now to join your classmates immediately.
                </p>

                <div className="mt-5 space-y-2.5 pt-4 border-t border-[#F0EDED]">
                  <div className="flex items-center gap-2.5 text-xs text-[#2d312e] font-medium">
                    <School className="w-4 h-4 text-[#56615a] shrink-0" />
                    <span>Instant access to batch materials & PYQs</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#2d312e] font-medium">
                    <BookOpen className="w-4 h-4 text-[#56615a] shrink-0" />
                    <span>Live exams calendar & lecture schedules</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#2d312e] font-medium">
                    <Users className="w-4 h-4 text-[#56615a] shrink-0" />
                    <span>Classroom discussions & community hub</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#1b1c1c] font-bold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 transition-all border border-[#D8D6D4] group-hover:border-[#56615a] cursor-pointer"
                >
                  <span>Enter Cohort Code</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-10 py-5 bg-[#F9F6EE] border-t border-[#E5E4E2] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-[#737874]">
            You can always switch or join another cohort later from your account settings.
          </p>
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#56615a] hover:underline cursor-pointer"
          >
            I'll decide later →
          </button>
        </div>
      </div>
    </div>
  );
};

