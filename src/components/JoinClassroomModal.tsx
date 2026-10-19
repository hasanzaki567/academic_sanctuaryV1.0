import React, { useState } from 'react';
import { X, LogIn, ArrowLeft, School, Sparkles } from 'lucide-react';

interface JoinClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
}

export const JoinClassroomModal: React.FC<JoinClassroomModalProps> = ({
  isOpen,
  onClose,
  onJoin,
}) => {
  if (!isOpen) return null;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a valid classroom code');
      return;
    }
    setError('');
    onJoin(code.trim().toUpperCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#FDFCF8] text-[#1b1c1c] overflow-y-auto flex flex-col min-h-screen animate-in fade-in duration-200">
      {/* Sticky Full-Width Header */}
      <header className="sticky top-0 z-20 w-full px-4 sm:px-8 md:px-12 py-4 sm:py-5 bg-white/95 backdrop-blur-md border-b border-[#E5E4E2] flex items-center justify-between shadow-xs">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#2d312e] hover:text-[#1b1c1c] text-sm sm:text-base font-bold transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Previous Screen</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center font-bold">
            <School className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-black text-[#1b1c1c] tracking-tight">Academic Sanctuary</h1>
            <p className="text-xs text-[#737874]">Join Cohort</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#56615a] hover:text-[#1b1c1c] hover:bg-[#F0EDED] text-sm sm:text-base font-bold transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Close</span>
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Spacious Container */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-8 py-10 md:py-16 flex flex-col justify-center flex-grow">
        <div className="bg-white border-2 border-[#E5E4E2] rounded-3xl p-6 sm:p-10 md:p-12 shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#d9e6dc] flex items-center justify-center text-[#56615a] shadow-xs flex-shrink-0">
              <LogIn className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1b1c1c] tracking-tight">
                Join a Classroom
              </h2>
              <p className="text-base sm:text-lg text-[#56615a] mt-1">
                Enter your cohort's unique invitation or access code
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm sm:text-base font-bold text-[#2d312e] block mb-2 uppercase tracking-wide">
                Classroom Access Code *
              </label>
              <input
                type="text"
                required
                placeholder="ENTER CODE"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                className="paper-input w-full p-4 sm:p-5 text-center text-2xl sm:text-3xl md:text-4xl font-mono font-extrabold tracking-widest rounded-2xl text-[#1b1c1c] uppercase border-2 border-[#D8D6D4] focus:border-[#56615a] shadow-xs"
                maxLength={12}
                autoFocus
              />
              {error && (
                <p className="text-sm sm:text-base font-bold text-[#ba1a1a] mt-2 bg-[#ffdad6] p-3 rounded-xl border border-[#ffb4ab]">
                  {error}
                </p>
              )}
              <div className="p-4 bg-[#F0EDED]/80 rounded-2xl border border-[#E5E4E2] mt-4 flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-[#56642b] flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#434844] leading-relaxed">
                  Enter the unique classroom code provided by your cohort admin or faculty member to enroll.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/3 py-4 text-base sm:text-lg font-bold text-[#737874] hover:text-[#1b1c1c] hover:bg-[#F0EDED] rounded-2xl transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-2/3 py-4 sm:py-5 bg-[#56615a] hover:bg-[#3e4641] text-white text-base sm:text-lg md:text-xl font-extrabold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Join Classroom Cohort</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
