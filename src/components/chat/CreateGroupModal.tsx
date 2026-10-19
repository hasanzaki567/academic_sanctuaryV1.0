import React, { useState } from 'react';
import { Member } from '../../types';
import { X, Users, Search, Check, Image, Sparkles, Shield, Camera } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  currentUserId: string;
  onCreateGroup: (groupData: {
    name: string;
    avatar: string;
    description: string;
    memberIds: string[];
  }) => Promise<void>;
}

const PRESET_AVATARS = [
  {
    label: 'General Cohort',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Study Squad',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Algorithms & Code',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Exam Revision',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Laboratory Team',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150&auto=format&fit=crop&q=80',
  },
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  members,
  currentUserId,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter out current user from selectable members (creator is already admin/member)
  const selectableMembers = members.filter((m) => m.id !== currentUserId);

  const filteredMembers = selectableMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMemberIds.length === selectableMembers.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(selectableMembers.map((m) => m.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateGroup({
        name: groupName.trim(),
        avatar: customAvatarInput.trim() || avatar,
        description: description.trim(),
        memberIds: selectedMemberIds,
      });
      // Reset form
      setGroupName('');
      setDescription('');
      setSelectedMemberIds([]);
      onClose();
    } catch (err) {
      console.error('Failed to create group:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="create-group-modal"
        className="w-full max-w-2xl bg-[#FEFEFA] rounded-3xl shadow-2xl border-2 border-[#E5E4E2] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#F0EDED] bg-[#F9F8F6]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#008069]/15 text-[#008069] flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-[#008069]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1b1c1c] leading-tight">Create New Group</h3>
              <p className="text-xs sm:text-sm text-[#56615a] font-medium mt-0.5">You will be designated as the Group Admin</p>
            </div>
          </div>
          <button
            id="close-create-group-modal"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Group Picture & Name */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#56615a] shadow-xs flex-shrink-0 bg-[#F0EDED]">
                <img
                  src={customAvatarInput.trim() || avatar}
                  alt="Group icon"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#1b1c1c]">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                id="group-name-input"
                type="text"
                required
                placeholder="e.g. Operating Systems Lab Squad"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#008069]"
              />
            </div>
          </div>

          {/* Avatar Presets Selection */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-[#1b1c1c]">Group Profile Picture</label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {PRESET_AVATARS.map((p) => (
                <button
                  type="button"
                  key={p.url}
                  onClick={() => {
                    setAvatar(p.url);
                    setCustomAvatarInput('');
                  }}
                  className={`relative p-1 rounded-2xl transition-all flex-shrink-0 cursor-pointer ${
                    avatar === p.url && !customAvatarInput
                      ? 'ring-3 ring-[#008069] scale-105 shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={p.label}
                >
                  <img
                    src={p.url}
                    alt={p.label}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {avatar === p.url && !customAvatarInput && (
                    <span className="absolute -bottom-1 -right-1 bg-[#008069] text-white rounded-full p-1 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-[#1b1c1c]">Group Description (Optional)</label>
            <input
              id="group-description-input"
              type="text"
              placeholder="e.g. For coordinating lab practicals and homework solutions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#008069]"
            />
          </div>

          {/* Member Selection */}
          <div className="space-y-3 pt-3 border-t-2 border-[#F0EDED]">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black text-[#1b1c1c]">
                Select Members ({selectedMemberIds.length} chosen)
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs sm:text-sm font-bold text-[#008069] hover:underline cursor-pointer"
              >
                {selectedMemberIds.length === selectableMembers.length
                  ? 'Deselect All'
                  : 'Select All Classmates'}
              </button>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search classmates by name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#008069]"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 border-2 border-[#E5E4E2] rounded-2xl p-2.5 bg-[#FAFAF8]">
              {filteredMembers.map((m) => {
                const isSelected = selectedMemberIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'bg-[#008069]/10 border-[#008069]/60 shadow-xs'
                        : 'border-transparent hover:bg-[#F0EDED]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-11 h-11 rounded-2xl object-cover border-2 border-[#E5E4E2]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="text-sm sm:text-base font-black text-[#1b1c1c] truncate">{m.name}</div>
                        <div className="text-xs sm:text-sm text-[#56615a] font-medium truncate">
                          {m.rollNumber} &bull; {m.role.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#008069] border-[#008069] text-white'
                          : 'border-[#C3C8C3] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t-2 border-[#F0EDED] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-create-group-btn"
              type="submit"
              disabled={!groupName.trim() || isSubmitting}
              className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black bg-[#008069] hover:bg-[#006a57] text-white transition-all disabled:opacity-40 cursor-pointer shadow-md active:scale-98"
            >
              {isSubmitting ? 'Creating Group...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
