import React, { useState } from 'react';
import { Member, Classroom, UserRole } from '../types';
import { Users, Copy, Check, ShieldCheck, UserCheck, Search, Sparkles } from 'lucide-react';

interface MembersDirectoryViewProps {
  members: Member[];
  classroom: Classroom;
  currentUserRole: UserRole;
  onUpdateRole?: (memberId: string, newRole: UserRole) => void;
}

export const MembersDirectoryView: React.FC<MembersDirectoryViewProps> = ({
  members,
  classroom,
  currentUserRole,
  onUpdateRole,
}) => {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-10 pb-32 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Cohort Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Class Members & Admins
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Enrolled students, class representatives, and super admin coordinators.
          </p>
        </div>

        {/* Invite Code Card */}
        <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-center gap-4 shadow-xs">
          <div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase">Class Access Code</div>
            <div className="text-lg font-mono font-bold text-[#1E3A8A]">{classroom.code}</div>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E3A8A] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-[#BFDBFE]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#D97706]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Search and stats */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#334155]">
          <Users className="w-4 h-4 text-[#1E3A8A]" />
          <span>Total Cohort Size: <strong className="text-[#0F172A]">{classroom.memberCount || members.length} Students</strong></span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl text-[#0F172A] w-full"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#F1F5F9]">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="p-4 md:p-5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#E2E8F0] border border-[#CBD5E1] overflow-hidden flex-shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-base font-bold text-[#0F172A]">{member.name}</h4>
                  {member.role === 'super_admin' && (
                    <span className="text-[10px] uppercase font-bold bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                      Super Admin
                    </span>
                  )}
                  {member.role === 'admin' && (
                    <span className="text-[10px] uppercase font-bold bg-[#EFF6FF] text-[#1E3A8A] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                      Moderator
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[#0F172A] font-medium">{member.rollNumber}</span>
                  <span>•</span>
                  <span>{member.email}</span>
                  <span className="hidden sm:inline">• Joined {member.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B] font-medium capitalize bg-[#F8FAFC] px-3 py-1 rounded-lg border border-[#E2E8F0]">
                {member.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
