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
          <span className="text-xs font-bold text-[#737874] uppercase tracking-wider">
            Cohort Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
            Class Members & Admins
          </h1>
          <p className="text-sm text-[#434844] mt-1">
            Enrolled students, class representatives, and super admin coordinators.
          </p>
        </div>

        {/* Invite Code Card */}
        <div className="p-4 bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl flex items-center gap-4 shadow-xs">
          <div>
            <div className="text-[11px] font-bold text-[#737874] uppercase">Class Access Code</div>
            <div className="text-lg font-mono font-bold text-[#56615a]">{classroom.code}</div>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#1b1c1c] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#56642b]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Search and stats */}
      <div className="bg-white border border-[#E5E4E2] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#434844]">
          <Users className="w-4 h-4 text-[#56615a]" />
          <span>Total Cohort Size: <strong>{classroom.memberCount || members.length} Students</strong></span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl text-[#1b1c1c] w-full"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#E4E2E1]">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="p-4 md:p-5 flex items-center justify-between hover:bg-[#F9F6EE] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#E4E2E1] border border-[#C3C8C3] overflow-hidden flex-shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-base font-bold text-[#1b1c1c]">{member.name}</h4>
                  {member.role === 'super_admin' && (
                    <span className="text-[10px] uppercase font-bold bg-[#d6e7a1]/50 text-[#56642b] px-2 py-0.5 rounded-full border border-[#d6e7a1]">
                      Super Admin
                    </span>
                  )}
                  {member.role === 'admin' && (
                    <span className="text-[10px] uppercase font-bold bg-[#F0EDED] text-[#56615a] px-2 py-0.5 rounded-full">
                      Moderator
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#737874] flex items-center gap-2 mt-0.5">
                  <span>{member.rollNumber}</span>
                  <span>•</span>
                  <span>{member.email}</span>
                  <span className="hidden sm:inline">• Joined {member.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#737874] capitalize bg-[#F6F3F2] px-3 py-1 rounded-lg">
                {member.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
