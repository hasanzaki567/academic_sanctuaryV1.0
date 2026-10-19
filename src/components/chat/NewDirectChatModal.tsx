import React, { useState } from 'react';
import { Member } from '../../types';
import { X, Search, MessageSquare, UserCheck } from 'lucide-react';

interface NewDirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
}

export const NewDirectChatModal: React.FC<NewDirectChatModalProps> = ({
  isOpen,
  onClose,
  members,
  currentUserId,
  onSelectUser,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const selectable = members.filter((m) => m.id !== currentUserId);

  const filtered = selectable.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="new-direct-chat-modal"
        className="w-full max-w-xl bg-[#FEFEFA] rounded-3xl shadow-2xl border-2 border-[#E5E4E2] overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#F0EDED] bg-[#F9F8F6]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#008069]/15 text-[#008069] flex items-center justify-center font-bold flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1b1c1c] leading-tight">New Direct Chat</h3>
              <p className="text-xs sm:text-sm text-[#56615a] font-medium mt-0.5">Select a classmate to start chatting privately</p>
            </div>
          </div>
          <button
            id="close-new-direct-chat-modal"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 border-b-2 border-[#F0EDED] bg-white">
          <div className="relative">
            <Search className="w-5 h-5 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-classmates-input"
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#008069] placeholder:text-[#919692]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 divide-y divide-[#F0EDED]">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-[#C3C8C3] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#1b1c1c]">No classmates found</p>
              <p className="text-xs text-[#737874] mt-0.5">Try searching with a different keyword</p>
            </div>
          ) : (
            filtered.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectUser(m.id);
                  onClose();
                }}
                className="pt-2 first:pt-0 flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#F6F4F0] cursor-pointer transition-colors group border-2 border-transparent hover:border-[#E5E4E2]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E5E4E2] flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-[#1b1c1c] group-hover:text-[#008069] truncate">
                      {m.name}
                    </h4>
                    <div className="text-xs sm:text-sm text-[#56615a] font-medium truncate">
                      {m.rollNumber} &bull; {m.role.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <button 
                  id={`chat-with-${m.id}`}
                  className="px-4 py-2 bg-[#008069]/10 group-hover:bg-[#008069] text-[#008069] group-hover:text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex-shrink-0"
                >
                  Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
