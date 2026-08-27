import React, { useState } from 'react';
import { X, LogIn, Key, Users } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#64748B] hover:text-[#0F172A] p-2 hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E0E7FF] flex items-center justify-center text-[#1E3A8A] shadow-xs">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">Join a Classroom</h3>
            <p className="text-xs text-[#64748B]">Enter your cohort's invitation code</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">
              Classroom Access Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. BTECH26A"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              className="paper-input w-full p-3.5 text-center text-lg font-mono font-bold tracking-widest rounded-xl text-[#1E3A8A] border border-[#CBD5E1] bg-[#F8FAFC]"
              maxLength={12}
            />
            {error && <p className="text-xs text-[#DC2626] mt-1">{error}</p>}
            <p className="text-[11px] text-[#64748B] mt-2">
              Ask your batch representative or professor for the 6-character code (e.g. <span className="font-mono font-bold text-[#1E3A8A]">BTECH26A</span>).
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-950/15 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <LogIn className="w-3.5 h-3.5" /> Join Classroom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
