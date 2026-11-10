import React from 'react';
import { X, Check, CheckCheck, Clock, Eye } from 'lucide-react';
import { ChatGroupMember, ChatMessage } from '../../types';

interface MessageInfoModalProps {
  isOpen: boolean;
  message: ChatMessage | null;
  members: ChatGroupMember[];
  currentUserId: string;
  onClose: () => void;
}

export const MessageInfoModal: React.FC<MessageInfoModalProps> = ({
  isOpen,
  message,
  members,
  currentUserId,
  onClose,
}) => {
  if (!isOpen || !message) return null;

  const otherMembers = members.filter(
    (m) => m.userId !== message.senderId && m.userId !== currentUserId
  );

  const readMembers = otherMembers.filter((m) => message.readBy.includes(m.userId));
  const deliveredMembers = otherMembers.filter(
    (m) => !message.readBy.includes(m.userId) && message.deliveredTo.includes(m.userId)
  );
  const pendingMembers = otherMembers.filter(
    (m) => !message.readBy.includes(m.userId) && !message.deliveredTo.includes(m.userId)
  );

  const renderMemberRow = (
    member: ChatGroupMember,
    badge: React.ReactNode
  ) => (
    <div
      key={member.userId}
      className="flex items-center justify-between gap-3 py-2 px-2.5 rounded-xl hover:bg-[#F6F4F0] transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-9 h-9 rounded-full object-cover border border-[#E5E4E2] flex-shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <div className="text-sm font-bold text-[#1b1c1c] truncate flex items-center gap-1.5">
            <span>{member.name}</span>
            {member.role === 'admin' && (
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#d9e6dc] text-[#3e4942]">
                Admin
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#737874] truncate">
            {member.rollNumber || member.email}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">{badge}</div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="message-info-modal"
        className="bg-white w-full max-w-md rounded-3xl border border-[#E5E4E2] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 bg-[#F6F4F0] border-b border-[#E5E4E2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#d9e6dc] text-[#3e4942] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1b1c1c]">Message Info</h3>
              <p className="text-[11px] text-[#737874]">
                Seen by {readMembers.length} of {otherMembers.length}{' '}
                {otherMembers.length === 1 ? 'member' : 'members'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E5E4E2] text-[#56615a] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview */}
        <div className="px-5 py-3.5 bg-[#FDFCF8] border-b border-[#E5E4E2]">
          <div className="bg-[#d9e6dc] border border-[#b2beb5]/60 rounded-2xl p-3 text-sm text-[#1b1c1c]">
            <p className="whitespace-pre-wrap break-words line-clamp-4">
              {message.content || (message.fileName ? `📎 ${message.fileName}` : 'Attachment')}
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-1 text-[11px] text-[#56615a]">
              {message.isEdited && <span className="italic">Edited</span>}
              <span>{message.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Receipts Breakdown */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Read By */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0284c7] flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                Read by ({readMembers.length})
              </span>
            </div>
            {readMembers.length === 0 ? (
              <p className="text-xs text-[#737874] px-2.5 py-1.5">
                No members have read this message yet.
              </p>
            ) : (
              <div className="space-y-0.5">
                {readMembers.map((m) =>
                  renderMemberRow(m, <CheckCheck className="w-4 h-4 text-[#0284c7] stroke-[2.5]" />)
                )}
              </div>
            )}
          </div>

          {/* Delivered To */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#56615a] flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4" />
                Delivered to ({deliveredMembers.length})
              </span>
            </div>
            {deliveredMembers.length === 0 ? (
              <p className="text-xs text-[#737874] px-2.5 py-1.5">
                No pending unread deliveries.
              </p>
            ) : (
              <div className="space-y-0.5">
                {deliveredMembers.map((m) =>
                  renderMemberRow(m, <CheckCheck className="w-4 h-4 text-[#737874]" />)
                )}
              </div>
            )}
          </div>

          {/* Pending / Offline */}
          {pendingMembers.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#737874] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Not yet received ({pendingMembers.length})
                </span>
              </div>
              <div className="space-y-0.5">
                {pendingMembers.map((m) =>
                  renderMemberRow(m, <Check className="w-4 h-4 text-[#9ea39f]" />)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
