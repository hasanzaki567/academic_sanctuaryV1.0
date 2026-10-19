import React, { useState } from 'react';
import { X, Check, Pencil, Lock, UserCheck } from 'lucide-react';

interface EditFriendNameModalProps {
  isOpen: boolean;
  friendId: string;
  friendCurrentName: string;
  friendAvatar: string;
  groupId?: string;
  onClose: () => void;
  onSave: (targetUserId: string, newName: string, groupId?: string) => Promise<void> | void;
}

export const EditFriendNameModal: React.FC<EditFriendNameModalProps> = ({
  isOpen,
  friendId,
  friendCurrentName,
  friendAvatar,
  groupId,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(friendCurrentName);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when opened
  React.useEffect(() => {
    setName(friendCurrentName);
  }, [friendCurrentName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave(friendId, name.trim(), groupId);
      onClose();
    } catch (err) {
      console.error('Failed to change friend name:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="edit-friend-name-modal"
        className="w-full max-w-xl bg-[#FEFEFA] rounded-3xl shadow-2xl border-2 border-[#E5E4E2] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#008069] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">Change Friend's Name</h2>
              <p className="text-xs text-white/80 font-medium">Set a custom nickname for your classmate</p>
            </div>
          </div>
          <button
            id="close-edit-friend-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-white"
            title="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 flex flex-col gap-6">
          {/* Friend Avatar Preview (Fixed / Only name is editable) */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <img
                src={friendAvatar}
                alt={friendCurrentName}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-[#008069]/20 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span 
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#F0EDED] text-[#54656f] border-2 border-[#C3C8C3] rounded-full shadow-xs" 
                title="Friend's avatar is managed by them"
              >
                <Lock className="w-4 h-4" />
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border-2 border-amber-200/80 rounded-full text-xs font-bold text-amber-800 mt-1">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Only your friend's name can be changed</span>
            </div>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="friend-name-input" className="text-xs sm:text-sm font-black text-[#1b1c1c]">
              Friend's Name / Nickname <span className="text-red-500">*</span>
            </label>
            <input
              id="friend-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter friend's new name"
              required
              maxLength={50}
              autoFocus
              className="w-full px-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white rounded-2xl text-sm sm:text-base text-[#1b1c1c] font-semibold outline-none transition-colors"
            />
            <p className="text-xs sm:text-sm text-[#56615a] font-medium leading-relaxed">
              This updates how your friend's name appears in this chat thread, conversation list, and message bubbles.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#F0EDED]">
            <button
              type="button"
              id="cancel-friend-name-btn"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-3 text-xs sm:text-sm font-bold text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-friend-name-btn"
              disabled={isSaving || !name.trim()}
              className="px-6 py-3.5 text-xs sm:text-sm font-black text-white bg-[#008069] hover:bg-[#006a57] rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              {isSaving ? 'Saving...' : 'Update Name'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
