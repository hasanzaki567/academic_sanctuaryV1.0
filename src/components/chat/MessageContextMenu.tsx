import React, { useEffect, useRef, useState } from 'react';
import {
  Reply,
  Copy,
  Smile,
  Forward,
  Pin,
  Star,
  Trash2,
  Plus,
} from 'lucide-react';
import { ChatMessage, User } from '../../types';

interface MessageContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  message: ChatMessage | null;
  currentUser: User;
  isGroupAdmin: boolean;
  onClose: () => void;
  onReply: (message: ChatMessage) => void;
  onCopy: (message: ChatMessage) => void;
  onReact: (message: ChatMessage, emoji: string) => void;
  onForward: (message: ChatMessage) => void;
  onPin: (message: ChatMessage) => void;
  onStar: (message: ChatMessage) => void;
  onDelete: (message: ChatMessage) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const EXTENDED_EMOJIS = [
  '👏', '🎉', '🔥', '✨', '💯', '🤔', '🙌', '🚀',
  '📚', '💡', '✍️', '🎯', '😊', '😍', '🥳', '😎',
  '🤝', '💪', '👀', '🎓', '📝', '⚡', '🌟', '✅'
];

export const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  isOpen,
  position,
  message,
  currentUser,
  isGroupAdmin,
  onClose,
  onReply,
  onCopy,
  onReact,
  onForward,
  onPin,
  onStar,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [showExtendedReactions, setShowExtendedReactions] = useState(false);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) {
      setShowExtendedReactions(false);
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  // Adjust coordinates to ensure the menu fits within the viewport
  const menuWidth = 280;
  const menuHeight = 440;
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

  const isSelf = message.senderId === currentUser.id;
  const canDelete = isSelf || isGroupAdmin;
  const isStarred = Boolean(message.isStarred || (message.starredBy && message.starredBy.includes(currentUser.id)));
  const isPinned = Boolean(message.isPinned);

  return (
    <div
      ref={menuRef}
      id="message-whatsapp-context-menu"
      style={{ top: `${posY}px`, left: `${posX}px` }}
      className="fixed z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      {/* 1. Floating Quick Reaction Bar (WhatsApp Signature) */}
      <div 
        id="quick-reaction-bar"
        className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-2xl border-2 border-[#E5E4E2] flex items-center gap-2 w-fit"
      >
        {QUICK_REACTIONS.map((emoji) => {
          const hasReacted = message.reactions?.some(
            (r) => r.userId === currentUser.id && r.emoji === emoji
          );
          return (
            <button
              key={emoji}
              onClick={() => {
                onReact(message, emoji);
                onClose();
              }}
              className={`text-2xl w-9 h-9 rounded-full flex items-center justify-center hover:scale-125 hover:bg-[#F0EDED] transition-all cursor-pointer ${
                hasReacted ? 'bg-[#d9e6dc] scale-110' : ''
              }`}
              title={`React ${emoji}`}
            >
              {emoji}
            </button>
          );
        })}

        <button
          onClick={() => setShowExtendedReactions(!showExtendedReactions)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-[#56615a] hover:bg-[#F0EDED] transition-colors cursor-pointer ${
            showExtendedReactions ? 'bg-[#E5E4E2]' : ''
          }`}
          title="More reactions"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Extended Reactions Tray if '+' is clicked */}
      {showExtendedReactions && (
        <div 
          id="extended-reactions-tray"
          className="bg-white rounded-3xl shadow-2xl border-2 border-[#E5E4E2] p-3 grid grid-cols-6 gap-2 w-72 animate-in fade-in slide-in-from-top-1"
        >
          {EXTENDED_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(message, emoji);
                onClose();
              }}
              className="text-xl w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F0EDED] hover:scale-125 transition-transform cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* 2. WhatsApp-style Dropdown Menu Card (Matching Image 2) */}
      <div 
        id="context-menu-card"
        className="w-64 sm:w-72 bg-white rounded-3xl shadow-2xl border-2 border-[#E5E4E2] py-2 flex flex-col text-sm sm:text-base text-[#1b1c1c] overflow-hidden"
      >
        {/* Reply */}
        <button
          id="context-menu-reply"
          onClick={() => {
            onReply(message);
            onClose();
          }}
          className="px-4 py-3 hover:bg-[#F6F4F0] flex items-center gap-3.5 transition-colors text-left cursor-pointer font-bold"
        >
          <Reply className="w-5 h-5 text-[#56615a]" />
          <span>Reply</span>
        </button>

        {/* Copy */}
        <button
          id="context-menu-copy"
          onClick={() => {
            onCopy(message);
            onClose();
          }}
          className="px-4 py-3 hover:bg-[#F6F4F0] flex items-center gap-3.5 transition-colors text-left cursor-pointer font-bold"
        >
          <Copy className="w-5 h-5 text-[#56615a]" />
          <span>Copy</span>
        </button>

        {/* React */}
        <button
          id="context-menu-react"
          onClick={() => {
            setShowExtendedReactions(true);
          }}
          className="px-4 py-3 hover:bg-[#F6F4F0] flex items-center gap-3.5 transition-colors text-left cursor-pointer font-bold"
        >
          <Smile className="w-5 h-5 text-[#56615a]" />
          <span>React</span>
        </button>

        {/* Forward */}
        <button
          id="context-menu-forward"
          onClick={() => {
            onForward(message);
            onClose();
          }}
          className="px-4 py-3 hover:bg-[#F6F4F0] flex items-center gap-3.5 transition-colors text-left cursor-pointer font-bold"
        >
          <Forward className="w-5 h-5 text-[#56615a]" />
          <span>Forward</span>
        </button>

        {/* Pin */}
        <button
          id="context-menu-pin"
          onClick={() => {
            onPin(message);
            onClose();
          }}
          className="px-4 py-3 hover:bg-[#F6F4F0] flex items-center gap-3.5 transition-colors text-left cursor-pointer font-bold"
        >
          <Pin className={`w-5 h-5 ${isPinned ? 'text-amber-600 fill-amber-600' : 'text-[#56615a]'}`} />
          <span>{isPinned ? 'Unpin' : 'Pin'}</span>
        </button>

        {/* Star */}
        <button
          id="context-menu-star"
          onClick={() => {
            onStar(message);
            onClose();
          }}
          className="px-4 py-3 hover:bg-[#F6F4F0] flex items-center gap-3.5 transition-colors text-left cursor-pointer font-bold"
        >
          <Star className={`w-5 h-5 ${isStarred ? 'text-amber-500 fill-amber-500' : 'text-[#56615a]'}`} />
          <span>{isStarred ? 'Unstar' : 'Star'}</span>
        </button>

        {/* Delete (with divider above) */}
        {canDelete && (
          <>
            <div className="my-1 border-t-2 border-[#F0EDED]" />
            <button
              id="context-menu-delete"
              onClick={() => {
                onDelete(message);
                onClose();
              }}
              className="px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3.5 transition-colors text-left cursor-pointer font-bold"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
