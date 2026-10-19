import React, { useState } from 'react';
import { Member, Classroom, UserRole } from '../types';
import {
  Users,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Search,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  UserPlus,
  Mail,
  X,
  Trash2,
  AlertCircle,
  Ban,
} from 'lucide-react';
import { MemberContextMenu, TargetMemberInfo } from './chat/MemberContextMenu';

interface MembersDirectoryViewProps {
  members: Member[];
  classroom: Classroom;
  currentUserRole: UserRole;
  currentUserId?: string;
  onAddMember?: (data: {
    email: string;
    name: string;
    rollNumber: string;
    role: 'student' | 'admin';
    department?: string;
  }) => Promise<void> | void;
  onUpdateRole?: (memberId: string, newRole: UserRole) => Promise<void> | void;
  onRemoveMember?: (memberId: string) => Promise<void> | void;
  onBanMember?: (memberId: string, memberName: string) => Promise<void> | void;
  onStartChat?: (memberId: string) => void;
  onBack?: () => void;
}

export const MembersDirectoryView: React.FC<MembersDirectoryViewProps> = ({
  members,
  classroom,
  currentUserRole,
  currentUserId,
  onAddMember,
  onUpdateRole,
  onRemoveMember,
  onBanMember,
  onStartChat,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [rollInput, setRollInput] = useState('');
  const [roleInput, setRoleInput] = useState<'student' | 'admin'>('student');
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // WhatsApp-style Right-Click Member Context Menu
  const [contextMenuState, setContextMenuState] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    member: TargetMemberInfo | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    member: null,
  });

  const handleMemberContextMenu = (e: React.MouseEvent, m: Member) => {
    e.preventDefault();
    setContextMenuState({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      member: {
        id: m.id,
        name: m.name,
        email: m.email,
        avatar: m.avatar,
        role: m.role,
        rollNumber: m.rollNumber,
      },
    });
  };

  const isAdmin = currentUserRole === 'super_admin' || currentUserRole === 'admin';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAddModal = () => {
    setEmailInput('');
    setNameInput('');
    setRollInput('');
    setRoleInput('student');
    setModalError(null);
    setIsAddModalOpen(true);
  };

  const handleSubmitAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setModalError('Please enter an institutional email address.');
      return;
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setModalError('Please enter a valid academic or institutional email format.');
      return;
    }

    const exists = members.some((m) => m.email.toLowerCase() === cleanEmail);
    if (exists) {
      setModalError('A member with this institutional email is already enrolled.');
      return;
    }

    try {
      setIsSubmitting(true);
      setModalError(null);
      if (onAddMember) {
        await onAddMember({
          email: cleanEmail,
          name: nameInput.trim(),
          rollNumber: rollInput.trim(),
          role: roleInput,
          department: classroom.department,
        });
      }
      setIsAddModalOpen(false);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to enroll member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleRole = async (member: Member) => {
    if (!onUpdateRole) return;
    const targetRole: UserRole = member.role === 'admin' ? 'student' : 'admin';
    try {
      setActionLoadingId(member.id);
      await onUpdateRole(member.id, targetRole);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemove = async (member: Member) => {
    if (!onRemoveMember) return;
    const confirmed = window.confirm(`Are you sure you want to remove ${member.name} from this cohort?`);
    if (!confirmed) return;
    try {
      setActionLoadingId(member.id);
      await onRemoveMember(member.id);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 pb-32 min-h-screen">
      {/* Back button */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#434844] hover:text-[#1b1c1c] text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Previous Screen</span>
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#737874] uppercase tracking-wider">
            Cohort Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
            Class Members & Admins
          </h1>
          <p className="text-sm text-[#434844] mt-1">
            Manage enrolled students, moderators, and assign administrator privileges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Add Member Button for Admins */}
          {isAdmin && (
            <button
              id="add-member-btn"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member via Institutional Mail</span>
            </button>
          )}

          {/* Invite Code Card */}
          <div className="p-3 sm:p-4 bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl flex items-center gap-4 shadow-xs">
            <div>
              <div className="text-[10px] font-bold text-[#737874] uppercase">Class Access Code</div>
              <div className="text-base sm:text-lg font-mono font-bold text-[#56615a]">{classroom.code}</div>
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
      </div>

      {/* Search and stats */}
      <div className="bg-white border border-[#E5E4E2] rounded-2xl p-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#434844]">
          <Users className="w-4 h-4 text-[#56615a]" />
          <span>
            Total Cohort Size: <strong>{members.length} Enrolled Members</strong>
          </span>
          <span className="text-[#737874]">•</span>
          <span className="text-xs text-[#56642b] font-bold">
            {members.filter((m) => m.role === 'super_admin' || m.role === 'admin').length} Admins
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, mail, or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl text-[#1b1c1c] w-full"
          />
        </div>
      </div>

      {/* WhatsApp Right-Click Tip Banner */}
      {isAdmin && (
        <div className="mb-6 px-4 py-2.5 bg-[#f0f4f1] border border-[#b2beb5] rounded-2xl flex items-center justify-between text-xs text-[#2d312e] shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#56615a] animate-pulse"></span>
            <span>
              <strong>WhatsApp-Style Moderation:</strong> Right-click on any member card or profile to access <strong>Remove</strong> and <strong>Remove & Ban</strong> options.
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-white text-[#56615a] px-2 py-0.5 rounded-md border border-[#c3d1c7]">
            Right Click
          </span>
        </div>
      )}

      {/* Members List */}
      {filtered.length === 0 ? (
        <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-12 text-center shadow-xs flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#1b1c1c]">No Members Found</h3>
          <p className="text-xs text-[#737874] max-w-sm mt-1">
            {search
              ? `No members match "${search}". Try clearing your search query.`
              : 'This cohort currently has no members. As an administrator, you can add students using their institutional email address.'}
          </p>
          {isAdmin && !search && (
            <button
              onClick={handleOpenAddModal}
              className="mt-4 px-4 py-2 bg-[#56615a] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll First Member</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#E4E2E1]">
          {filtered.map((member) => {
            const isSelf = currentUserId === member.id;
            const isSuperAdminMember = member.role === 'super_admin';
            const canManageRole = isAdmin && !isSuperAdminMember && !isSelf;

            return (
              <div
                key={member.id}
                onContextMenu={(e) => handleMemberContextMenu(e, member)}
                className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9F6EE] transition-colors cursor-context-menu group/row select-none"
                title={isAdmin && !isSelf ? `Right-click for WhatsApp-style moderation options (Remove, Ban, Message ${member.name})` : undefined}
              >
                <div 
                  className="flex items-center gap-3.5 cursor-pointer"
                  onContextMenu={(e) => handleMemberContextMenu(e, member)}
                >
                  <div className="w-11 h-11 rounded-full bg-[#E4E2E1] border border-[#C3C8C3] overflow-hidden flex-shrink-0 relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm md:text-base font-bold text-[#1b1c1c]">{member.name}</h4>
                      {isSelf && (
                        <span className="text-[10px] font-bold bg-[#E5E4E2] text-[#434844] px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                      {member.role === 'super_admin' && (
                        <span className="text-[10px] uppercase font-bold bg-[#d6e7a1]/60 text-[#56642b] px-2 py-0.5 rounded-full border border-[#d6e7a1] inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Cohort Creator & Super Admin
                        </span>
                      )}
                      {member.role === 'admin' && (
                        <span className="text-[10px] uppercase font-bold bg-[#d9e6dc] text-[#56615a] px-2 py-0.5 rounded-full border border-[#c3d1c7] inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Administrator
                        </span>
                      )}
                      {member.role === 'student' && (
                        <span className="text-[10px] uppercase font-semibold bg-[#F0EDED] text-[#737874] px-2 py-0.5 rounded-full">
                          Student
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#737874] flex items-center flex-wrap gap-2 mt-0.5">
                      <span className="font-mono font-medium">{member.rollNumber}</span>
                      <span>•</span>
                      <span className="text-[#1b1c1c] font-medium">{member.email}</span>
                      <span className="hidden sm:inline">• Joined {member.joinedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                  {/* Admin Role Toggle (Give Admin Access / Revoke Admin Access) */}
                  {canManageRole && (
                    <button
                      onClick={() => handleToggleRole(member)}
                      disabled={actionLoadingId === member.id}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        member.role === 'admin'
                          ? 'bg-[#F0EDED] text-[#737874] hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 border border-transparent'
                          : 'bg-[#d6e7a1]/70 hover:bg-[#d6e7a1] text-[#56642b] border border-[#c5d88f]'
                      }`}
                      title={member.role === 'admin' ? 'Revoke administrator access' : 'Promote to Cohort Administrator'}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</span>
                    </button>
                  )}

                  {/* Remove Member Button (Admin only) */}
                  {canManageRole && onRemoveMember && (
                    <button
                      onClick={() => handleRemove(member)}
                      disabled={actionLoadingId === member.id}
                      className="p-1.5 text-[#737874] hover:text-[#ba1a1a] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title={`Remove ${member.name} from cohort`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Remove and Ban Member Button (Admin only) */}
                  {canManageRole && onBanMember && (
                    <button
                      onClick={(e) => handleMemberContextMenu(e, member)}
                      disabled={actionLoadingId === member.id}
                      className="p-1.5 text-[#737874] hover:text-[#ba1a1a] hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      title={`Remove and Ban ${member.name} from cohort (or right-click)`}
                    >
                      <Ban className="w-4 h-4 text-[#ba1a1a]" />
                    </button>
                  )}

                  {/* Direct DM / Message Button */}
                  {!isSelf && onStartChat && (
                    <button
                      id={`message-member-${member.id}`}
                      onClick={() => onStartChat(member.id)}
                      className="px-3.5 py-1.5 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title={`Send direct message to ${member.name}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Direct DM</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E4E2] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E2E1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#1b1c1c]">Enroll Cohort Member</h3>
                  <p className="text-xs text-[#737874]">Add via verified institutional email address</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#737874] hover:bg-[#F0EDED] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-[#ba1a1a] text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitAddMember} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                  Institutional Email Address <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rollno@university.edu or student@inst.edu"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="paper-input text-xs pl-10 pr-4 py-2.5 rounded-xl text-[#1b1c1c] w-full"
                  />
                </div>
                <p className="text-[11px] text-[#737874] mt-1">
                  The user can sign in using this institutional email to access all cohort materials.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">Full Student / Faculty Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Henderson"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="paper-input text-xs px-3.5 py-2.5 rounded-xl text-[#1b1c1c] w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">Roll / Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. 2026-CS-104"
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  className="paper-input text-xs px-3.5 py-2.5 rounded-xl text-[#1b1c1c] w-full uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1b1c1c] mb-1">Cohort Privileges & Role</label>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setRoleInput('student')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      roleInput === 'student'
                        ? 'border-[#56615a] bg-[#d9e6dc]/30 text-[#1b1c1c]'
                        : 'border-[#E5E4E2] bg-white text-[#737874] hover:bg-[#F9F6EE]'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5 text-[#1b1c1c]">
                      <Users className="w-3.5 h-3.5 text-[#56615a]" />
                      <span>Student</span>
                    </div>
                    <div className="text-[11px] text-[#737874] mt-1 leading-tight">
                      Can view & upload notes, send direct messages.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoleInput('admin')}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      roleInput === 'admin'
                        ? 'border-[#56615a] bg-[#d9e6dc]/30 text-[#1b1c1c]'
                        : 'border-[#E5E4E2] bg-white text-[#737874] hover:bg-[#F9F6EE]'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5 text-[#1b1c1c]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#56642b]" />
                      <span>Administrator</span>
                    </div>
                    <div className="text-[11px] text-[#737874] mt-1 leading-tight">
                      Can manage members, add timetable, create chat groups.
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-[#E4E2E1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#737874] hover:bg-[#F0EDED] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Enrolling...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Enroll Member</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp-Style Right-Click Member Context Menu */}
      <MemberContextMenu
        isOpen={contextMenuState.isOpen}
        position={contextMenuState.position}
        member={contextMenuState.member}
        currentUser={{
          id: currentUserId || '',
          name: 'You',
          email: '',
          role: currentUserRole,
          avatar: '',
        }}
        contextType="cohort"
        cohortName={classroom.name}
        isCohortAdmin={isAdmin}
        isGroupAdmin={false}
        onClose={() => setContextMenuState((prev) => ({ ...prev, isOpen: false }))}
        onMessageUser={onStartChat}
        onRemoveFromCohort={onRemoveMember}
        onBanFromCohort={onBanMember}
        onToggleCohortRole={(memberId) => {
          const mem = members.find((m) => m.id === memberId);
          if (mem) handleToggleRole(mem);
        }}
      />
    </main>
  );
};

