import React, { useEffect, useRef, useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Shield,
  UserMinus,
  Ban,
  Copy,
  Check,
  AlertTriangle,
  X,
  School,
  Mail,
  User as UserIcon,
  ShieldAlert,
} from 'lucide-react';
import { User, Member } from '../../types';

export interface TargetMemberInfo {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  rollNumber?: string;
  groupRole?: 'admin' | 'member';
}

interface MemberContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  member: TargetMemberInfo | null;
  currentUser: User;
  contextType: 'cohort' | 'group' | 'both';
  groupId?: string;
  groupName?: string;
  cohortName?: string;
  isCohortAdmin: boolean;
  isGroupAdmin: boolean;
  onClose: () => void;
  onMessageUser?: (memberId: string) => void;
  onRemoveFromGroup?: (memberId: string) => Promise<void> | void;
  onBanFromGroup?: (memberId: string, memberName: string) => Promise<void> | void;
  onRemoveFromCohort?: (memberId: string) => Promise<void> | void;
  onBanFromCohort?: (memberId: string, memberName: string) => Promise<void> | void;
  onToggleGroupRole?: (memberId: string, currentRole: 'admin' | 'member') => Promise<void> | void;
  onToggleCohortRole?: (memberId: string, currentRole: string) => Promise<void> | void;
}

export const MemberContextMenu: React.FC<MemberContextMenuProps> = ({
  isOpen,
  position,
  member,
  currentUser,
  contextType,
  groupId,
  groupName = 'Group Chat',
  cohortName = 'Cohort',
  isCohortAdmin,
  isGroupAdmin,
  onClose,
  onMessageUser,
  onRemoveFromGroup,
  onBanFromGroup,
  onRemoveFromCohort,
  onBanFromCohort,
  onToggleGroupRole,
  onToggleCohortRole,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  // Confirmation modal state for Banning
  const [confirmBanModal, setConfirmBanModal] = useState<{
    isOpen: boolean;
    type: 'cohort' | 'group';
  }>({
    isOpen: false,
    type: 'group',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Close on outside click or Escape key (unless confirmation dialog is active)
  useEffect(() => {
    if (!isOpen) {
      setConfirmBanModal({ isOpen: false, type: 'group' });
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (confirmBanModal.isOpen) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmBanModal.isOpen) {
          setConfirmBanModal({ isOpen: false, type: 'group' });
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, confirmBanModal.isOpen]);

  if (!isOpen || !member) return null;

  const isSelf = member.id === currentUser.id;
  const isSuperAdminMember = member.role === 'super_admin';

  // Position calculation to stay comfortably within the window viewport
  const menuWidth = 270;
  const menuHeight = 380;
  const padding = 16;

  let posX = position.x;
  let posY = position.y;

  if (typeof window !== 'undefined') {
    if (posX + menuWidth > window.innerWidth - padding) {
      posX = Math.max(padding, window.innerWidth - menuWidth - padding);
    }
    if (posY + menuHeight > window.innerHeight - padding) {
      posY = Math.max(padding, window.innerHeight - menuHeight - padding);
    }
  }

  const handleCopyEmail = () => {
    if (member.email) {
      navigator.clipboard.writeText(member.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleExecuteBan = async () => {
    if (!member) return;
    setIsProcessing(true);
    try {
      if (confirmBanModal.type === 'cohort') {
        if (onBanFromCohort) await onBanFromCohort(member.id, member.name);
      } else {
        if (onBanFromGroup) await onBanFromGroup(member.id, member.name);
      }
    } finally {
      setIsProcessing(false);
      setConfirmBanModal({ isOpen: false, type: 'group' });
      onClose();
    }
  };

  return (
    <>
      {/* WhatsApp-Style Floating Menu */}
      {!confirmBanModal.isOpen && (
        <div
          ref={menuRef}
          style={{ top: `${posY}px`, left: `${posX}px` }}
          className="fixed z-50 w-68 bg-[#FEFEFA]/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#E5E4E2] py-2 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#F0EDED] text-[#1b1c1c] select-none"
        >
          {/* Header Profile Snippet */}
          <div className="px-3.5 py-2 flex items-center gap-2.5 bg-[#FAF8F5] rounded-t-xl">
            <div className="w-10 h-10 rounded-full bg-[#E4E2E1] border border-[#C3C8C3] overflow-hidden flex-shrink-0">
              <img
                src={
                  member.avatar ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A'
                }
                alt={member.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-[#1b1c1c] truncate flex items-center gap-1.5">
                <span>{member.name}</span>
                {isSelf && (
                  <span className="text-[10px] text-[#737874] font-semibold">(You)</span>
                )}
              </div>
              <div className="text-[10px] text-[#737874] font-mono truncate">
                {member.rollNumber || member.email || 'Member'}
              </div>
              {member.role === 'super_admin' && (
                <span className="text-[9px] font-black uppercase text-[#56642b] bg-[#d6e7a1]/70 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                  Super Admin
                </span>
              )}
              {member.role === 'admin' && (
                <span className="text-[9px] font-black uppercase text-[#56615a] bg-[#d9e6dc] px-1.5 py-0.2 rounded mt-0.5 inline-block">
                  Cohort Admin
                </span>
              )}
              {member.groupRole === 'admin' && (
                <span className="text-[9px] font-black uppercase text-[#008069] bg-[#008069]/10 px-1.5 py-0.2 rounded mt-0.5 inline-block ml-1">
                  Group Admin
                </span>
              )}
            </div>
          </div>

          {/* General Actions */}
          <div className="py-1">
            {!isSelf && onMessageUser && (
              <button
                type="button"
                onClick={() => {
                  onMessageUser(member.id);
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#2d312e] hover:bg-[#F0EDED] flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#56615a]" />
                <span>Message {member.name.split(' ')[0]}</span>
              </button>
            )}

            {member.email && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#56615a] hover:bg-[#F0EDED] flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#56642b]" />
                ) : (
                  <Copy className="w-4 h-4 text-[#737874]" />
                )}
                <span>{copied ? 'Email Copied!' : 'Copy Email Address'}</span>
              </button>
            )}
          </div>

          {/* Group Chat Admin Actions */}
          {(contextType === 'group' || contextType === 'both') &&
            isGroupAdmin &&
            !isSelf && (
              <div className="py-1">
                <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#737874] flex items-center justify-between">
                  <span>Group Chat Admin</span>
                </div>

                {onToggleGroupRole && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleGroupRole(
                        member.id,
                        member.groupRole === 'admin' ? 'member' : 'admin'
                      );
                      onClose();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#434844] hover:bg-[#F0EDED] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    {member.groupRole === 'admin' ? (
                      <>
                        <Shield className="w-4 h-4 text-[#737874]" />
                        <span>Dismiss as Group Admin</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#008069]" />
                        <span>Make Group Admin</span>
                      </>
                    )}
                  </button>
                )}

                {/* Remove from Group */}
                {onRemoveFromGroup && (
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveFromGroup(member.id);
                      onClose();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#ba1a1a] hover:bg-red-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <UserMinus className="w-4 h-4 text-[#ba1a1a]" />
                    <span>Remove from Group</span>
                  </button>
                )}

                {/* Remove and Ban from Group */}
                {onBanFromGroup && (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmBanModal({ isOpen: true, type: 'group' });
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-black text-[#ba1a1a] hover:bg-red-100/70 flex items-center justify-between gap-2 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Ban className="w-4 h-4 text-[#ba1a1a] group-hover:scale-110 transition-transform" />
                      <span>Remove & Ban from Group</span>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-[#ffdad6] text-[#ba1a1a] px-1.5 py-0.2 rounded">
                      Ban
                    </span>
                  </button>
                )}
              </div>
            )}

          {/* Cohort Admin Actions */}
          {(contextType === 'cohort' || contextType === 'both') &&
            isCohortAdmin &&
            !isSelf &&
            !isSuperAdminMember && (
              <div className="py-1">
                <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#56615a] flex items-center justify-between">
                  <span>Cohort Admin</span>
                </div>

                {/* Cohort Role Toggle */}
                {onToggleCohortRole && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleCohortRole(member.id, member.role || 'student');
                      onClose();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#434844] hover:bg-[#F0EDED] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#56615a]" />
                    <span>
                      {member.role === 'admin' ? 'Revoke Admin' : 'Make Cohort Admin'}
                    </span>
                  </button>
                )}

                {/* Remove from Cohort */}
                {onRemoveFromCohort && (
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveFromCohort(member.id);
                      onClose();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-[#ba1a1a] hover:bg-red-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <UserMinus className="w-4 h-4 text-[#ba1a1a]" />
                    <span>Remove from Cohort</span>
                  </button>
                )}

                {/* Remove and Ban from Cohort */}
                {onBanFromCohort && (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmBanModal({ isOpen: true, type: 'cohort' });
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-black text-[#ba1a1a] hover:bg-red-100/70 flex items-center justify-between gap-2 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-[#ba1a1a] group-hover:scale-110 transition-transform" />
                      <span>Remove & Ban from Cohort</span>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-[#ffdad6] text-[#ba1a1a] px-1.5 py-0.2 rounded">
                      Ban
                    </span>
                  </button>
                )}
              </div>
            )}
        </div>
      )}

      {/* Confirmation Modal for "Remove and Ban" */}
      {confirmBanModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FEFEFA] border-2 border-[#ffb4ab] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1b1c1c]">
                  {confirmBanModal.type === 'cohort'
                    ? `Ban ${member.name} from Cohort?`
                    : `Ban ${member.name} from Group Chat?`}
                </h3>
                <p className="text-xs text-[#737874]">
                  {confirmBanModal.type === 'cohort'
                    ? `Cohort: ${cohortName}`
                    : `Group: ${groupName}`}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#fcf2f2] border border-[#ffb4ab] rounded-2xl text-xs text-[#ba1a1a] leading-relaxed space-y-1 font-medium">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Permanent Moderation Action
              </p>
              <p>
                {confirmBanModal.type === 'cohort'
                  ? `Are you sure you want to remove and ban ${member.name}? They will be immediately kicked from this cohort, removed from all related study groups, and blocked from rejoining with the invite code.`
                  : `Are you sure you want to remove and ban ${member.name}? They will be immediately kicked from this group chat and cannot be re-added by other members.`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  setConfirmBanModal({ isOpen: false, type: 'group' });
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl border border-[#E5E4E2] bg-white hover:bg-[#F0EDED] text-xs font-bold text-[#434844] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecuteBan}
                className="px-5 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Ban className="w-4 h-4" />
                <span>{isProcessing ? 'Banning Member...' : 'Yes, Remove & Ban'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
