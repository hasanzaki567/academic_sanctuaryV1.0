import React, { useState } from 'react';
import { ChatGroup, ChatMessage, User } from '../../types';
import { X, Search, Check, Send, Users, MessageSquare, BookOpen, FileText } from 'lucide-react';

interface ForwardMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  groups: ChatGroup[];
  currentUser: User;
  onForward: (messageId: string, targetGroupIds: string[]) => Promise<void>;
}

export const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  isOpen,
  onClose,
  message,
  groups,
  currentUser,
  onForward,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !message) return null;

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleConfirmForward = async () => {
    if (selectedGroupIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await onForward(message.id, selectedGroupIds);
      setSelectedGroupIds([]);
      onClose();
    } catch (err) {
      console.error('Error forwarding message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        id="forward-message-modal"
        className="w-full max-w-xl bg-[#FEFEFA] rounded-3xl shadow-2xl border-2 border-[#E5E4E2] overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-[#F0EDED] flex items-center justify-between bg-[#F9F8F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#008069]/15 text-[#008069] flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1b1c1c] leading-tight">Forward Message</h3>
              <p className="text-xs sm:text-sm text-[#56615a] font-medium mt-0.5">
                Select one or more chats to forward this message
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message Preview Snippet */}
        <div className="p-4 sm:p-5 bg-[#FAF9F7] border-b-2 border-[#F0EDED]">
          <div className="text-xs uppercase font-black text-[#56615a] tracking-wider mb-1.5">
            Message Preview
          </div>
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E5E4E2] text-sm text-[#1b1c1c] max-h-24 overflow-y-auto font-medium">
            <span className="font-black text-[#008069] block mb-1">{message.senderName}:</span>
            {message.type === 'file' ? (
              <span className="flex items-center gap-1.5 text-[#56615a] font-semibold">
                <FileText className="w-4 h-4" /> {message.fileName || 'Attachment'}
              </span>
            ) : message.type === 'material_forward' ? (
              <span className="flex items-center gap-1.5 text-[#56615a] font-semibold">
                <BookOpen className="w-4 h-4" /> {message.forwardedMaterial?.title || 'Study Material'}
              </span>
            ) : (
              <p className="line-clamp-2 text-[#1b1c1c] leading-relaxed">{message.content}</p>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-5 border-b-2 border-[#F0EDED] bg-white">
          <div className="relative">
            <Search className="w-5 h-5 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chats or groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#008069] placeholder:text-[#919692]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 divide-y divide-[#F0EDED]">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-[#737874]">No chats found</div>
          ) : (
            filteredGroups.map((grp) => {
              const isSelected = selectedGroupIds.includes(grp.id);
              return (
                <div
                  key={grp.id}
                  onClick={() => toggleGroup(grp.id)}
                  className={`pt-2 first:pt-0 p-3.5 rounded-2xl flex items-center justify-between gap-3.5 cursor-pointer transition-all border-2 ${
                    isSelected ? 'bg-[#008069]/10 border-[#008069]/60 shadow-xs' : 'border-transparent hover:bg-[#F6F4F0]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={grp.avatar}
                      alt={grp.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E5E4E2] flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-black text-[#1b1c1c] truncate">{grp.name}</div>
                      <div className="text-xs sm:text-sm text-[#56615a] font-medium flex items-center gap-1.5 mt-0.5">
                        {grp.isDirect ? (
                          <>
                            <MessageSquare className="w-3.5 h-3.5" /> Direct Chat
                          </>
                        ) : (
                          <>
                            <Users className="w-3.5 h-3.5" /> Group Chat
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#008069] border-[#008069] text-white'
                        : 'border-[#C3C8C3] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t-2 border-[#F0EDED] bg-[#F9F8F6] flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm font-medium text-[#56615a]">
            <strong className="text-[#1b1c1c] font-black text-sm sm:text-base">{selectedGroupIds.length}</strong> chat{selectedGroupIds.length === 1 ? '' : 's'} selected
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={selectedGroupIds.length === 0 || isSubmitting}
              onClick={handleConfirmForward}
              className="px-6 py-3 bg-[#008069] hover:bg-[#006a57] text-white rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-md active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Forwarding...' : 'Forward'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
