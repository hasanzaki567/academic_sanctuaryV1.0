import React, { useState, useEffect, useRef } from 'react';
import {
  ChatGroup,
  ChatMessage,
  ChatGroupMember,
  Member,
  User,
  Material,
  ForwardedMaterialInfo,
} from '../../types';
import {
  Search,
  Plus,
  Send,
  Paperclip,
  Camera,
  Smile,
  Check,
  CheckCheck,
  MoreVertical,
  ArrowLeft,
  BookOpen,
  FileText,
  Download,
  Users,
  MessageSquare,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Info,
  ChevronDown,
  Pin,
  Star,
  X,
  Reply,
  Copy,
  Forward,
  Pencil,
} from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupInfoDrawer } from './GroupInfoDrawer';
import { CameraSnapshotModal } from './CameraSnapshotModal';
import { ForwardMaterialModal } from './ForwardMaterialModal';
import { NewDirectChatModal } from './NewDirectChatModal';
import { MessageContextMenu } from './MessageContextMenu';
import { ForwardMessageModal } from './ForwardMessageModal';
import { EditProfileModal } from './EditProfileModal';
import { EditFriendNameModal } from './EditFriendNameModal';
import { ForwardMaterialMultiModal } from './ForwardMaterialMultiModal';
import { MemberContextMenu, TargetMemberInfo } from './MemberContextMenu';

interface ChatViewProps {
  currentUser: User;
  activeClassroomId: string;
  classMembers: Member[];
  materials: Material[];
  onOpenDocumentReader?: (material: Material) => void;
  initialTargetUserId?: string | null;
  onClearInitialTarget?: () => void;
  onUpdateCurrentUser?: (updated: Partial<User>) => void;
  onUpdateFriendName?: (friendId: string, newName: string) => void;
  materialToForward?: Material | null;
  onClearMaterialToForward?: () => void;
  onRemoveCohortMember?: (memberId: string) => Promise<void> | void;
  onBanCohortMember?: (memberId: string, memberName: string) => Promise<void> | void;
  onBack?: () => void;
}

const EMOJI_LIST = ['👍', '🙌', '📚', '💡', '🔥', '❤️', '✍️', '🎯', '😊', '😂', '🤔', '🚀', '💻', '💯', '🙏', '🎓'];

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  activeClassroomId,
  classMembers,
  materials,
  onOpenDocumentReader,
  initialTargetUserId,
  onClearInitialTarget,
  onUpdateCurrentUser,
  onUpdateFriendName,
  materialToForward,
  onClearMaterialToForward,
  onRemoveCohortMember,
  onBanCohortMember,
  onBack,
}) => {
  // State: Conversations list & Active Conversation
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [activeGroupDetails, setActiveGroupDetails] = useState<
    (ChatGroup & { members: ChatGroupMember[] }) | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'groups' | 'direct'>('all');

  // Multi-target Material Forwarding State
  const [isMultiForwardOpen, setIsMultiForwardOpen] = useState(false);
  const [multiForwardMaterial, setMultiForwardMaterial] = useState<Material | null>(null);

  // When materialToForward is provided via navigation from Notes view
  useEffect(() => {
    if (materialToForward) {
      setMultiForwardMaterial(materialToForward);
      setIsMultiForwardOpen(true);
    }
  }, [materialToForward]);

  // WhatsApp Context Menu & Message Actions State (Image 2)
  const [contextMenuState, setContextMenuState] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    message: ChatMessage | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    message: null,
  });

  // WhatsApp-Style Right-Click Member Context Menu
  const [memberContextMenuState, setMemberContextMenuState] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    member: TargetMemberInfo | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    member: null,
  });

  const handleOpenMemberContextMenu = (
    e: React.MouseEvent,
    userId: string,
    userName: string,
    userAvatar?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const groupMember = activeGroupDetails?.members.find((m) => m.userId === userId);
    const classMember = classMembers.find((m) => m.id === userId);
    setMemberContextMenuState({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      member: {
        id: userId,
        name: userName,
        avatar: userAvatar || groupMember?.avatar || classMember?.avatar,
        email: groupMember?.email || classMember?.email,
        role: classMember?.role,
        rollNumber: groupMember?.rollNumber || classMember?.rollNumber,
        groupRole: groupMember?.role || 'member',
      },
    });
  };
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<ChatMessage | null>(null);
  const [isInChatSearchOpen, setIsInChatSearchOpen] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Real-time State
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map()); // userId -> name
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Sub-Modals
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isForwardMaterialOpen, setIsForwardMaterialOpen] = useState(false);
  const [isNewDirectOpen, setIsNewDirectOpen] = useState(false);
  const [isEditMyProfileOpen, setIsEditMyProfileOpen] = useState(false);
  const [isEditFriendNameOpen, setIsEditFriendNameOpen] = useState(false);

  const isCohortAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Fetch Conversations List
  const fetchGroups = async () => {
    try {
      const res = await fetch(
        `/api/chat/groups?classroomId=${activeClassroomId}&userId=${currentUser.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
        if (!activeGroupId && data.length > 0) {
          setActiveGroupId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching chat groups:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [activeClassroomId, currentUser.id]);

  // Handle initial direct chat targeting (e.g. clicked "Message" from members view)
  useEffect(() => {
    if (initialTargetUserId) {
      handleStartDirectChat(initialTargetUserId);
      if (onClearInitialTarget) onClearInitialTarget();
    }
  }, [initialTargetUserId]);

  // 2. Fetch Active Group Details & Messages
  const fetchActiveConversation = async (groupId: string) => {
    try {
      const [groupRes, msgsRes] = await Promise.all([
        fetch(`/api/chat/groups/${groupId}`),
        fetch(`/api/chat/groups/${groupId}/messages`),
      ]);

      if (groupRes.ok) {
        const groupData = await groupRes.json();
        setActiveGroupDetails(groupData);
      }

      if (msgsRes.ok) {
        const msgsData = await msgsRes.json();
        setMessages(msgsData);
        // Mark as read
        markGroupAsRead(groupId);
      }
    } catch (err) {
      console.error('Error fetching active group data:', err);
    }
  };

  useEffect(() => {
    if (activeGroupId) {
      fetchActiveConversation(activeGroupId);
      setTypingUsers(new Map());
    }
  }, [activeGroupId]);

  const markGroupAsRead = async (groupId: string) => {
    try {
      await fetch(`/api/chat/groups/${groupId}/read`, { method: 'POST' });
      // update unreadCount in local group list
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, unreadCount: 0 } : g))
      );
      // notify WS
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'read',
            groupId,
            userId: currentUser.id,
          })
        );
      }
    } catch (err) {
      console.error('Failed to mark group as read:', err);
    }
  };

  // 3. WebSocket Real-Time Setup
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      // Authenticate socket session
      socket.send(
        JSON.stringify({
          type: 'auth',
          userId: currentUser.id,
          classroomId: activeClassroomId,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'chat:online_users') {
          setOnlineUserIds(new Set(data.onlineUserIds));
        } else if (data.type === 'chat:presence') {
          setOnlineUserIds((prev) => {
            const next = new Set(prev);
            if (data.isOnline) {
              next.add(data.userId);
            } else {
              next.delete(data.userId);
            }
            return next;
          });
        } else if (data.type === 'chat:message_new') {
          const newMsg: ChatMessage = data.message;
          // If message is in current open group
          if (newMsg.groupId === activeGroupId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            markGroupAsRead(newMsg.groupId);
          }

          // Update sidebar preview
          setGroups((prev) => {
            return prev.map((g) => {
              if (g.id === newMsg.groupId) {
                const unread =
                  g.id === activeGroupId || newMsg.senderId === currentUser.id
                    ? 0
                    : (g.unreadCount || 0) + 1;
                return {
                  ...g,
                  unreadCount: unread,
                  lastMessage: {
                    text:
                      newMsg.type === 'material_forward'
                        ? `📄 Forwarded: ${newMsg.forwardedMaterial?.title || 'Material'}`
                        : newMsg.type === 'camera_image'
                        ? '📷 Photo snapshot'
                        : newMsg.type === 'file'
                        ? `📎 File: ${newMsg.fileName || 'Attachment'}`
                        : newMsg.content,
                    timestamp: newMsg.timestamp,
                    senderName: newMsg.senderName,
                    senderId: newMsg.senderId,
                    type: newMsg.type,
                  },
                };
              }
              return g;
            });
          });
        } else if (data.type === 'chat:typing') {
          if (data.groupId === activeGroupId && data.userId !== currentUser.id) {
            setTypingUsers((prev) => {
              const updated = new Map(prev);
              if (data.isTyping) {
                updated.set(data.userId, data.userName);
              } else {
                updated.delete(data.userId);
              }
              return updated;
            });
          }
        } else if (data.type === 'chat:read_receipt') {
          if (data.groupId === activeGroupId) {
            setMessages((prev) =>
              prev.map((m) => {
                if (!m.readBy.includes(data.userId)) {
                  return { ...m, readBy: [...m.readBy, data.userId] };
                }
                return m;
              })
            );
          }
        } else if (data.type === 'chat:message_reaction') {
          if (data.groupId === activeGroupId) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === data.messageId ? { ...m, reactions: data.reactions } : m
              )
            );
          }
        } else if (data.type === 'chat:message_pinned') {
          if (data.groupId === activeGroupId) {
            setMessages((prev) =>
              prev.map((m) => ({
                ...m,
                isPinned: m.id === data.messageId ? data.isPinned : false,
              }))
            );
            if (activeGroupDetails) {
              setActiveGroupDetails((prev) =>
                prev ? { ...prev, pinnedMessageId: data.isPinned ? data.messageId : undefined } : null
              );
            }
          }
        } else if (data.type === 'chat:message_deleted') {
          if (data.groupId === activeGroupId) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === data.messageId
                  ? {
                      ...m,
                      isDeleted: true,
                      content: 'This message was deleted',
                      fileUrl: undefined,
                      forwardedMaterial: undefined,
                    }
                  : m
              )
            );
          }
        } else if (data.type === 'chat:user_profile_updated') {
          if (data.userId === currentUser.id && onUpdateCurrentUser) {
            onUpdateCurrentUser({ name: data.name, avatar: data.avatar });
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.senderId === data.userId
                ? { ...m, senderName: data.name, senderAvatar: data.avatar }
                : m
            )
          );
          fetchGroups();
          if (activeGroupId) fetchActiveConversation(activeGroupId);
        } else if (data.type === 'chat:friend_renamed') {
          if (onUpdateFriendName) {
            onUpdateFriendName(data.userId, data.newName);
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.senderId === data.userId ? { ...m, senderName: data.newName } : m
            )
          );
          fetchGroups();
          if (activeGroupId) fetchActiveConversation(activeGroupId);
        } else if (
          data.type === 'chat:group_created' ||
          data.type === 'chat:group_updated' ||
          data.type === 'chat:group_deleted' ||
          data.type === 'chat:members_added' ||
          data.type === 'chat:member_removed' ||
          data.type === 'chat:role_changed'
        ) {
          fetchGroups();
          if (activeGroupId) {
            fetchActiveConversation(activeGroupId);
          }
        }
      } catch (e) {
        console.error('Error handling WebSocket message payload:', e);
      }
    };

    return () => {
      socket.close();
    };
  }, [activeClassroomId, currentUser.id, activeGroupId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Handle Typing Notifications
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    if (activeGroupId && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (!isTyping) {
        setIsTyping(true);
        wsRef.current.send(
          JSON.stringify({
            type: 'typing',
            groupId: activeGroupId,
            userId: currentUser.id,
            userName: currentUser.name,
            isTyping: true,
          })
        );
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'typing',
              groupId: activeGroupId,
              userId: currentUser.id,
              userName: currentUser.name,
              isTyping: false,
            })
          );
        }
      }, 2000);
    }
  };

  // 4. Send Message Handler
  const handleSendMessage = async (payload: {
    type?: 'text' | 'file' | 'camera_image' | 'material_forward';
    content?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    forwardedMaterial?: ForwardedMaterialInfo;
  }) => {
    if (!activeGroupId) return;

    try {
      const replyToPayload = replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            content: replyingTo.content || (replyingTo.fileName ? `📎 ${replyingTo.fileName}` : 'Attachment'),
            type: replyingTo.type,
          }
        : undefined;

      const res = await fetch(`/api/chat/groups/${activeGroupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, replyTo: replyToPayload }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        // Optimistically add to state if not already received via WS
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        setInputText('');
        setReplyingTo(null);
        setShowEmojiPicker(false);
        setShowAttachMenu(false);

        // Turn off typing
        if (isTyping && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          setIsTyping(false);
          wsRef.current.send(
            JSON.stringify({
              type: 'typing',
              groupId: activeGroupId,
              userId: currentUser.id,
              userName: currentUser.name,
              isTyping: false,
            })
          );
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // 4b. Toggle Emoji Reaction
  const handleToggleReaction = async (msg: ChatMessage, emoji: string) => {
    try {
      const res = await fetch(`/api/chat/messages/${msg.id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, reactions: data.reactions } : m))
        );
      }
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    }
  };

  // 4c. Toggle Pin Message
  const handleTogglePin = async (msg: ChatMessage) => {
    try {
      const res = await fetch(`/api/chat/messages/${msg.id}/pin`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => ({
            ...m,
            isPinned: m.id === msg.id ? data.isPinned : false,
          }))
        );
        showToast(data.isPinned ? 'Message pinned to chat' : 'Message unpinned');
      }
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  // 4d. Toggle Star Message
  const handleToggleStar = async (msg: ChatMessage) => {
    try {
      const res = await fetch(`/api/chat/messages/${msg.id}/star`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isStarred: data.isStarred } : m))
        );
        showToast(data.isStarred ? 'Message starred' : 'Message unstarred');
      }
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  // 4e. Copy Message Text
  const handleCopyMessage = (msg: ChatMessage) => {
    const textToCopy = msg.content || msg.fileName || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      showToast('Message copied to clipboard');
    }
  };

  // 4f. Confirm Forward Message
  const handleConfirmForward = async (messageId: string, targetGroupIds: string[]) => {
    try {
      const res = await fetch('/api/chat/messages/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, targetGroupIds }),
      });
      if (res.ok) {
        showToast('Message forwarded successfully');
        fetchGroups();
      }
    } catch (err) {
      console.error('Failed to forward message:', err);
    }
  };

  // Helper to group message reactions
  const getEmojiGroups = (reactions?: ChatMessage['reactions']) => {
    if (!reactions || reactions.length === 0) return [];
    const map = new Map<
      string,
      { emoji: string; count: number; userNames: string[]; hasUserReacted: boolean }
    >();
    for (const r of reactions) {
      if (!map.has(r.emoji)) {
        map.set(r.emoji, {
          emoji: r.emoji,
          count: 0,
          userNames: [],
          hasUserReacted: false,
        });
      }
      const item = map.get(r.emoji)!;
      item.count++;
      item.userNames.push(r.userName);
      if (r.userId === currentUser.id) {
        item.hasUserReacted = true;
      }
    }
    return Array.from(map.values());
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    handleSendMessage({ type: 'text', content: inputText.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // 5. File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
      };

      handleSendMessage({
        type: 'file',
        content: `Shared file: ${file.name}`,
        fileUrl: dataUrl,
        fileName: file.name,
        fileSize: formatSize(file.size),
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 6. Camera Snapshot Handler
  const handleCameraCapture = (imageDataUrl: string) => {
    handleSendMessage({
      type: 'camera_image',
      content: 'Shared photo snapshot',
      fileUrl: imageDataUrl,
      fileName: 'Camera_Snapshot.jpg',
      fileSize: '1.2 MB',
    });
  };

  // 7. Forward Material Handler
  const handleForwardMaterial = (mat: ForwardedMaterialInfo) => {
    handleSendMessage({
      type: 'material_forward',
      content: mat.title,
      forwardedMaterial: mat,
    });
  };

  // 8. Delete Message Handler
  const handleDeleteMessage = async (msgId: string) => {
    try {
      const res = await fetch(`/api/chat/messages/${msgId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  isDeleted: true,
                  content: 'This message was deleted',
                  fileUrl: undefined,
                  forwardedMaterial: undefined,
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // 9. Start Direct 1-on-1 Chat
  const handleStartDirectChat = async (targetUserId: string) => {
    try {
      const res = await fetch('/api/chat/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, classroomId: activeClassroomId }),
      });
      if (res.ok) {
        const dmGroup = await res.json();
        await fetchGroups();
        setActiveGroupId(dmGroup.id);
      }
    } catch (err) {
      console.error('Failed to open direct chat:', err);
    }
  };

  // Group Operations
  const handleCreateGroup = async (groupData: any) => {
    if (!isCohortAdmin) {
      showToast('Only cohort administrators can create group channels.');
      return;
    }
    const res = await fetch('/api/chat/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...groupData, classroomId: activeClassroomId }),
    });
    if (res.ok) {
      const newGrp = await res.json();
      await fetchGroups();
      setActiveGroupId(newGrp.id);
      showToast(`Group "${newGrp.name}" created.`);
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.error || 'Failed to create group channel.');
    }
  };

  // Profile Update Handler (User can change their own name and profile pic)
  const handleSaveMyProfile = async (updated: { name: string; avatar: string }) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        if (onUpdateCurrentUser) {
          onUpdateCurrentUser(data.user || updated);
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.senderId === currentUser.id
              ? { ...m, senderName: updated.name, senderAvatar: updated.avatar }
              : m
          )
        );
        fetchGroups();
        showToast('Your profile was updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Friend Name Update Handler (User can change ONLY friend's name in direct chat)
  const handleSaveFriendName = async (targetUserId: string, newName: string, groupId?: string) => {
    try {
      const res = await fetch('/api/chat/friend-name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, name: newName, groupId: groupId || activeGroupId }),
      });
      if (res.ok) {
        setActiveGroupDetails((prev) =>
          prev
            ? {
                ...prev,
                name: newName,
                members: prev.members.map((m) =>
                  m.userId === targetUserId ? { ...m, name: newName } : m
                ),
              }
            : null
        );
        setGroups((prev) =>
          prev.map((g) =>
            g.id === activeGroupId || (g.isDirect && g.memberIds.includes(targetUserId))
              ? { ...g, name: newName }
              : g
          )
        );
        setMessages((prev) =>
          prev.map((m) => (m.senderId === targetUserId ? { ...m, senderName: newName } : m))
        );
        if (onUpdateFriendName) {
          onUpdateFriendName(targetUserId, newName);
        }
        showToast(`Friend's name updated to "${newName}"`);
      }
    } catch (err) {
      console.error('Failed to update friend name:', err);
    }
  };

  const handleUpdateGroup = async (updates: any) => {
    if (!activeGroupId) return;
    if (activeGroup?.isDirect && updates.name) {
      const otherId = activeGroup.memberIds.find((id) => id !== currentUser.id);
      if (otherId) {
        await handleSaveFriendName(otherId, updates.name, activeGroupId);
        return;
      }
    }
    await fetch(`/api/chat/groups/${activeGroupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    fetchGroups();
    fetchActiveConversation(activeGroupId);
  };

  const handleAddMembers = async (memberIds: string[]) => {
    if (!activeGroupId) return;
    await fetch(`/api/chat/groups/${activeGroupId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberIds }),
    });
    fetchActiveConversation(activeGroupId);
  };

  const handleRemoveMember = async (userId: string) => {
    if (!activeGroupId) return;
    await fetch(`/api/chat/groups/${activeGroupId}/members/${userId}`, {
      method: 'DELETE',
    });
    fetchActiveConversation(activeGroupId);
    showToast('Member removed from group.');
  };

  const handleBanGroupMember = async (userId: string, userName?: string) => {
    if (!activeGroupId) return;
    try {
      const res = await fetch(`/api/chat/groups/${activeGroupId}/members/${userId}/ban`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchActiveConversation(activeGroupId);
        showToast(`Banned and removed ${userName || 'member'} from group.`);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to ban member from group.');
      }
    } catch (err) {
      console.error('Failed to ban group member:', err);
    }
  };

  const handleBanCohortMember = async (userId: string, userName?: string) => {
    try {
      const res = await fetch(`/api/members/${userId}/ban`, {
        method: 'POST',
      });
      if (res.ok) {
        showToast(`Permanently banned ${userName || 'member'} from cohort.`);
        if (activeGroupId) fetchActiveConversation(activeGroupId);
        fetchGroups();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to ban member from cohort.');
      }
    } catch (err) {
      console.error('Failed to ban cohort member:', err);
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'admin' | 'member') => {
    if (!activeGroupId) return;
    await fetch(`/api/chat/groups/${activeGroupId}/members/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    fetchActiveConversation(activeGroupId);
  };

  const handleDeleteGroup = async () => {
    if (!activeGroupId) return;
    await fetch(`/api/chat/groups/${activeGroupId}`, { method: 'DELETE' });
    setIsInfoDrawerOpen(false);
    setActiveGroupId(null);
    setActiveGroupDetails(null);
    await fetchGroups();
  };

  const handleLeaveGroup = async () => {
    if (!activeGroupId) return;
    await fetch(`/api/chat/groups/${activeGroupId}/members/${currentUser.id}`, {
      method: 'DELETE',
    });
    setIsInfoDrawerOpen(false);
    setActiveGroupId(null);
    setActiveGroupDetails(null);
    await fetchGroups();
  };

  // Open Document in Global Reader Modal
  const handleOpenMaterial = (matInfo: ForwardedMaterialInfo) => {
    const fullMat = materials.find((m) => m.id === matInfo.id) || {
      id: matInfo.id,
      title: matInfo.title,
      subjectCode: matInfo.subjectCode,
      subjectName: matInfo.subjectName,
      type: matInfo.type,
      fileFormat: matInfo.fileFormat,
      fileSize: matInfo.fileSize,
      contentSnippet: matInfo.snippet,
      uploadedBy: {
        id: 'user-shared',
        name: 'Cohort Member',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      uploadedDate: 'Today',
      downloadCount: 15,
      likesCount: 8,
      isVerifiedByStaff: true,
      fileUrl: '#',
    };
    if (onOpenDocumentReader) {
      onOpenDocumentReader(fullMat as Material);
    }
  };

  // Filter Conversations
  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTab === 'groups') return matchesSearch && !g.isDirect;
    if (filterTab === 'direct') return matchesSearch && g.isDirect;
    return matchesSearch;
  });

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  // Group messages by day for clear chronological presentation
  const formatMessageDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Direct chat friend details for friend renaming
  const directFriend =
    activeGroup && activeGroup.isDirect
      ? (() => {
          const otherId = activeGroup.memberIds.find((id) => id !== currentUser.id);
          const memberObj = activeGroupDetails?.members.find((m) => m.userId === otherId);
          const classMember = otherId ? classMembers.find((m) => m.id === otherId) : null;
          return {
            id: otherId || '',
            name: memberObj?.name || classMember?.name || activeGroup.name,
            avatar: memberObj?.avatar || classMember?.avatar || activeGroup.avatar,
          };
        })()
      : null;

  return (
    <div className="w-full h-[calc(100vh-68px)] flex flex-col p-0 m-0 overflow-hidden">
      <div 
        id="chat-main-container"
        className="w-full h-full bg-white border-t border-[#E5E4E2] flex overflow-hidden"
      >
        {/* ========================================================= */}
        {/* LEFT SIDEBAR: CONVERSATION THREADS (WHATSAPP SIGNATURE) */}
        {/* ========================================================= */}
        <aside
          className={`w-full md:w-96 lg:w-[420px] xl:w-[450px] border-r border-[#E5E4E2] bg-[#FDFCF8] flex flex-col h-full flex-shrink-0 ${
            activeGroupId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Sidebar Top Header with User Profile Trigger */}
          <div className="px-5 py-3.5 border-b border-[#E5E4E2] bg-[#F6F4F0] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  id="chat-back-btn"
                  onClick={onBack}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#434844] hover:bg-black/10 transition-colors cursor-pointer -ml-2"
                  title="Back to Previous Screen"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <button
                id="user-profile-header-btn"
                onClick={() => setIsEditMyProfileOpen(true)}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-black/5 transition-all text-left group cursor-pointer"
                title="Click to edit your name and profile picture"
              >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#C3C8C3] group-hover:ring-2 group-hover:ring-[#008069] transition-all"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm md:text-[15px] font-bold text-[#1b1c1c] group-hover:text-[#008069] transition-colors leading-tight">
                    {currentUser.name}
                  </span>
                  <Pencil className="w-3.5 h-3.5 text-[#737874] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs text-[#56615a] font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Cohort Online &bull; Edit Profile
                </span>
              </div>
            </button>
          </div>

            <div className="flex items-center gap-1.5">
              <button
                id="new-direct-chat-btn"
                onClick={() => setIsNewDirectOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#434844] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
                title="New Direct Message"
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {isCohortAdmin && (
                <button
                  id="create-group-btn"
                  onClick={() => setIsCreateGroupOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#434844] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
                  title="Create Group (Admin only)"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="px-4 pt-3 pb-2.5 bg-[#FDFCF8]">
            <div className="relative">
              <Search className="w-4.5 h-4.5 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-chats-input"
                type="text"
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F0EDED] border border-[#E5E4E2] rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#737874] focus:outline-none focus:border-[#56615a]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mt-2.5">
              <button
                id="tab-all-chats"
                onClick={() => setFilterTab('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-[#56615a] text-white'
                    : 'bg-[#F0EDED] text-[#434844] hover:bg-[#E5E4E2]'
                }`}
              >
                All
              </button>
              <button
                id="tab-group-chats"
                onClick={() => setFilterTab('groups')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  filterTab === 'groups'
                    ? 'bg-[#56615a] text-white'
                    : 'bg-[#F0EDED] text-[#434844] hover:bg-[#E5E4E2]'
                }`}
              >
                Groups
              </button>
              <button
                id="tab-direct-chats"
                onClick={() => setFilterTab('direct')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  filterTab === 'direct'
                    ? 'bg-[#56615a] text-white'
                    : 'bg-[#F0EDED] text-[#434844] hover:bg-[#E5E4E2]'
                }`}
              >
                Direct (DMs)
              </button>
            </div>
          </div>

          {/* Conversations Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0EDED] scrollbar-thin">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center text-[#737874]">
                <MessageSquare className="w-8 h-8 mx-auto text-[#C3C8C3] mb-2" />
                <p className="text-sm font-medium">No conversations found</p>
                <p className="text-xs text-[#919692] mt-0.5">
                  Start a group or chat with a classmate!
                </p>
              </div>
            ) : (
              filteredGroups.map((grp) => {
                const isActive = grp.id === activeGroupId;
                const hasUnread = (grp.unreadCount || 0) > 0;

                // Check if other participant in direct chat is online
                let isOtherOnline = false;
                if (grp.isDirect) {
                  const otherId = grp.memberIds.find((id) => id !== currentUser.id);
                  if (otherId && onlineUserIds.has(otherId)) isOtherOnline = true;
                }

                return (
                  <div
                    id={`chat-item-${grp.id}`}
                    key={grp.id}
                    onClick={() => setActiveGroupId(grp.id)}
                    className={`px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#F0EDED] border-l-4 border-[#008069]'
                        : 'hover:bg-[#F9F8F6]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <img
                          src={grp.avatar}
                          alt={grp.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#E5E4E2]"
                          referrerPolicy="no-referrer"
                        />
                        {grp.isDirect && (
                          <span
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                              isOtherOnline ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          />
                        )}
                        {!grp.isDirect && (
                          <span className="absolute -bottom-0.5 -right-0.5 bg-[#56615a] text-white p-1 rounded-full ring-2 ring-white">
                            <Users className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[15px] font-semibold text-[#1b1c1c] truncate">
                            {grp.name}
                          </h4>
                          <span className="text-xs text-[#737874] flex-shrink-0 ml-1 font-medium">
                            {grp.lastMessage?.timestamp || ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[13.5px] text-[#54656f] truncate max-w-[220px] leading-snug">
                            {grp.lastMessage ? (
                              <span>
                                {grp.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                                {grp.lastMessage.text}
                              </span>
                            ) : (
                              <span className="italic text-[#919692]">No messages yet</span>
                            )}
                          </p>

                          {hasUnread && (
                            <span className="ml-2 bg-[#008069] text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 min-w-[20px] text-center">
                              {grp.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT MAIN CHAT AREA (MESSAGES & INPUT DOCK) */}
        {/* ========================================================= */}
        <main
          className={`flex-1 flex flex-col h-full bg-[#EFEAE2]/30 relative ${
            !activeGroupId ? 'hidden md:flex items-center justify-center' : 'flex'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(#d9e6dc 0.75px, transparent 0.75px), radial-gradient(#d9e6dc 0.75px, #faf9f6 0.75px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        >
          {activeGroup && activeGroupDetails ? (
            <>
              {/* Chat Top Bar Header */}
              <header className="px-4 py-2.5 bg-[#F6F4F0] border-b border-[#E5E4E2] flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    id="back-to-chats-btn"
                    onClick={() => setActiveGroupId(null)}
                    className="md:hidden p-1.5 -ml-1 text-[#434844] hover:bg-[#E5E4E2] rounded-full transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div
                    onClick={() => setIsInfoDrawerOpen(true)}
                    className="flex items-center gap-3.5 cursor-pointer group select-none min-w-0"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={activeGroup.avatar}
                        alt={activeGroup.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#C3C8C3] group-hover:opacity-90 transition-opacity shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      {activeGroup.isDirect ? (
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                            activeGroupDetails.members.some(
                              (m) => m.userId !== currentUser.id && m.isOnline
                            )
                              ? 'bg-emerald-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ) : (
                        <span className="absolute -bottom-0.5 -right-0.5 bg-[#56615a] text-white p-1 rounded-full ring-2 ring-white">
                          <Users className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-bold text-[#1b1c1c] group-hover:text-[#008069] transition-colors truncate">
                          {activeGroup.name}
                        </h3>
                        {activeGroup.isDirect && (
                          <button
                            id="header-edit-friend-name-btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditFriendNameOpen(true);
                            }}
                            className="p-1 text-[#737874] hover:text-[#008069] hover:bg-black/5 rounded-md transition-colors cursor-pointer"
                            title="Change friend's name"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs md:text-[13px] text-[#737874] truncate max-w-md mt-0.5">
                        {typingUsers.size > 0 ? (
                          <span className="text-emerald-700 font-semibold animate-pulse">
                            {Array.from(typingUsers.values()).join(', ')} is typing...
                          </span>
                        ) : activeGroup.isDirect ? (
                          activeGroupDetails.members.find((m) => m.userId !== currentUser.id)
                            ?.isOnline ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Online
                            </span>
                          ) : (
                            'Offline'
                          )
                        ) : (
                          `${activeGroupDetails.members.length} members · ${activeGroupDetails.members
                            .map((m) => m.name.split(' ')[0])
                            .join(', ')}`
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    id="open-in-chat-search-btn"
                    onClick={() => setIsInChatSearchOpen(!isInChatSearchOpen)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      isInChatSearchOpen ? 'bg-[#56615a] text-white' : 'text-[#434844] hover:bg-[#E5E4E2]'
                    }`}
                    title="Search messages"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    id="open-group-info-btn"
                    onClick={() => setIsInfoDrawerOpen(true)}
                    className="p-2 text-[#434844] hover:bg-[#E5E4E2] rounded-full transition-colors cursor-pointer"
                    title="Group Details & Members"
                  >
                    <Info className="w-5 h-5 text-[#56615a]" />
                  </button>
                </div>
              </header>

              {/* In-Chat Message Search Bar */}
              {isInChatSearchOpen && (
                <div className="px-4 py-2 bg-white border-b border-[#E5E4E2] flex items-center gap-2 animate-in slide-in-from-top-1 z-10 shadow-2xs">
                  <Search className="w-4 h-4 text-[#737874]" />
                  <input
                    type="text"
                    placeholder="Search in this conversation..."
                    value={inChatSearchQuery}
                    onChange={(e) => setInChatSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 text-xs text-[#1b1c1c] focus:outline-none"
                  />
                  {inChatSearchQuery && (
                    <span className="text-[11px] text-[#737874]">
                      {messages.filter((m) =>
                        m.content.toLowerCase().includes(inChatSearchQuery.toLowerCase()) ||
                        (m.fileName && m.fileName.toLowerCase().includes(inChatSearchQuery.toLowerCase()))
                      ).length}{' '}
                      found
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setIsInChatSearchOpen(false);
                      setInChatSearchQuery('');
                    }}
                    className="text-[#737874] hover:text-[#1b1c1c] p-1 rounded-md cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Pinned Message Banner */}
              {messages.some((m) => m.isPinned) && (
                <div className="px-4 py-2 bg-[#F6F4F0] border-b border-[#E5E4E2] flex items-center justify-between text-xs text-[#1b1c1c] shadow-2xs z-10">
                  {(() => {
                    const pinnedMsg = messages.find((m) => m.isPinned)!;
                    return (
                      <>
                        <div
                          onClick={() => {
                            const el = document.getElementById(`chat-message-${pinnedMsg.id}`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              el.classList.add('ring-2', 'ring-amber-500');
                              setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 1500);
                            }
                          }}
                          className="flex items-center gap-2 cursor-pointer hover:underline min-w-0"
                        >
                          <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600 flex-shrink-0" />
                          <span className="font-bold text-amber-800 flex-shrink-0">Pinned Message:</span>
                          <span className="text-[#54656f] truncate">
                            <span className="font-semibold text-[#1b1c1c]">{pinnedMsg.senderName}:</span>{' '}
                            {pinnedMsg.content || pinnedMsg.fileName || 'Attachment'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleTogglePin(pinnedMsg)}
                          className="text-[11px] font-medium text-[#737874] hover:text-[#1b1c1c] px-2 py-0.5 rounded hover:bg-[#E5E4E2] cursor-pointer flex-shrink-0"
                          title="Unpin message"
                        >
                          Unpin
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Messages Chronological Stream */}
              <div 
                id="messages-scroll-area"
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 scrollbar-thin"
              >
                {/* Cohort Safety Notice */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-[#F0EDED]/90 backdrop-blur-xs text-[#56615a] text-[10px] font-semibold rounded-lg shadow-2xs border border-[#E5E4E2] flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    <span>Academic Cohort Chat • Verified Members Only</span>
                  </span>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-16 text-[#737874]">
                    <div className="w-12 h-12 rounded-2xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#1b1c1c]">No messages yet</p>
                    <p className="text-xs mt-1">Send a message, photo, or study notes to begin!</p>
                  </div>
                ) : (
                  (inChatSearchQuery.trim()
                    ? messages.filter((m) =>
                        m.content.toLowerCase().includes(inChatSearchQuery.toLowerCase()) ||
                        (m.fileName && m.fileName.toLowerCase().includes(inChatSearchQuery.toLowerCase())) ||
                        (m.forwardedMaterial?.title &&
                          m.forwardedMaterial.title.toLowerCase().includes(inChatSearchQuery.toLowerCase()))
                      )
                    : messages
                  ).map((msg, index) => {
                    const isSelf = msg.senderId === currentUser.id;
                    const prevMsg = messages[index - 1];
                    const showDateHeader =
                      !prevMsg ||
                      formatMessageDate(prevMsg.createdAt) !== formatMessageDate(msg.createdAt);

                    const isReadByOthers =
                      msg.readBy.filter((id) => id !== currentUser.id).length > 0;

                    return (
                      <React.Fragment key={msg.id}>
                        {showDateHeader && (
                          <div className="flex justify-center my-3">
                            <span className="px-3 py-0.5 bg-[#F0EDED] text-[#737874] text-[10px] font-bold rounded-full uppercase tracking-wider border border-[#E5E4E2]">
                              {formatMessageDate(msg.createdAt)}
                            </span>
                          </div>
                        )}

                        <div
                          id={`chat-message-${msg.id}`}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenuState({
                              isOpen: true,
                              position: { x: e.clientX, y: e.clientY },
                              message: msg,
                            });
                          }}
                          className={`flex items-end gap-2 group ${
                            isSelf ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {!isSelf && (
                            <img
                              src={msg.senderAvatar}
                              alt={msg.senderName}
                              onContextMenu={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleOpenMemberContextMenu(
                                  e,
                                  msg.senderId,
                                  msg.senderName,
                                  msg.senderAvatar
                                );
                              }}
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1 border border-[#E5E4E2] cursor-pointer hover:ring-2 hover:ring-[#56615a]/40 transition-all select-none"
                              title={`Right-click to moderate or message ${msg.senderName}`}
                              referrerPolicy="no-referrer"
                            />
                          )}

                          <div
                            className={`relative max-w-[88%] sm:max-w-lg md:max-w-xl xl:max-w-2xl rounded-2xl p-3.5 md:p-4 shadow-xs transition-all ${
                              isSelf
                                ? 'bg-[#d9e6dc] text-[#1b1c1c] rounded-br-xs border border-[#b2beb5]/50'
                                : 'bg-white text-[#1b1c1c] rounded-bl-xs border border-[#E5E4E2]'
                            }`}
                          >
                            {/* WhatsApp Dropdown Options Trigger Button */}
                            {!msg.isDeleted && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setContextMenuState({
                                    isOpen: true,
                                    position: { x: rect.left, y: rect.bottom + 4 },
                                    message: msg,
                                  });
                                }}
                                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-0.5 text-[#54656f] hover:text-[#1b1c1c] bg-white/80 hover:bg-white rounded-full transition-opacity shadow-2xs cursor-pointer z-10"
                                title="Message options"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Sender Name in Group Chat */}
                            {!isSelf && !activeGroup.isDirect && (
                              <div
                                onContextMenu={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleOpenMemberContextMenu(
                                    e,
                                    msg.senderId,
                                    msg.senderName,
                                    msg.senderAvatar
                                  );
                                }}
                                className="text-xs md:text-[13px] font-bold text-[#56642b] mb-1.5 flex items-center justify-between cursor-pointer hover:underline select-none"
                                title={`Right-click to moderate or message ${msg.senderName}`}
                              >
                                <span>{msg.senderName}</span>
                              </div>
                            )}

                            {/* Quoted Reply Preview */}
                            {msg.replyTo && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const targetEl = document.getElementById(`chat-message-${msg.replyTo?.id}`);
                                  if (targetEl) {
                                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    targetEl.classList.add('ring-2', 'ring-[#00a884]');
                                    setTimeout(() => targetEl.classList.remove('ring-2', 'ring-[#00a884]'), 1500);
                                  }
                                }}
                                className="mb-2 p-2.5 rounded-lg bg-black/5 border-l-4 border-[#00a884] text-xs md:text-[13px] cursor-pointer hover:bg-black/10 transition-colors"
                              >
                                <div className="font-bold text-[#00a884] text-[11px] md:text-xs mb-0.5">
                                  {msg.replyTo.senderName}
                                </div>
                                <div className="text-[#54656f] line-clamp-2 text-xs md:text-[13px]">
                                  {msg.replyTo.content}
                                </div>
                              </div>
                            )}

                            {/* Message Content by Type */}
                            {msg.isDeleted ? (
                              <p className="text-xs md:text-sm italic text-[#737874] flex items-center gap-1.5">
                                <Trash2 className="w-3.5 h-3.5" /> This message was deleted
                              </p>
                            ) : msg.type === 'camera_image' ? (
                              <div className="space-y-1.5">
                                <div className="rounded-xl overflow-hidden border border-[#C3C8C3] bg-black max-h-72">
                                  <img
                                    src={msg.fileUrl}
                                    alt="Camera snap"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                {msg.content && (
                                  <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                  </p>
                                )}
                              </div>
                            ) : msg.type === 'file' ? (
                              <div className="space-y-2">
                                <div className="p-3 rounded-xl bg-black/5 flex items-center justify-between gap-3 border border-black/10">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-[#56615a] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs md:text-sm font-bold truncate">
                                        {msg.fileName || 'Attachment'}
                                      </div>
                                      <div className="text-[11px] text-[#737874]">
                                        {msg.fileSize || 'Document'}
                                      </div>
                                    </div>
                                  </div>
                                  {msg.fileUrl && (
                                    <a
                                      href={msg.fileUrl}
                                      download={msg.fileName || 'file'}
                                      className="p-2 rounded-lg bg-white hover:bg-gray-100 text-[#56615a] shadow-xs transition-colors"
                                      title="Download File"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                                {msg.content && (
                                  <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                  </p>
                                )}
                              </div>
                            ) : msg.type === 'material_forward' && msg.forwardedMaterial ? (
                              <div className="space-y-2">
                                <div className="p-3.5 rounded-xl bg-white border border-[#E5E4E2] shadow-xs space-y-2">
                                  <div className="flex items-center justify-between gap-2 border-b border-[#F0EDED] pb-1.5">
                                    <span className="text-[11px] font-bold text-[#56615a] uppercase flex items-center gap-1">
                                      <BookOpen className="w-3.5 h-3.5" />
                                      {msg.forwardedMaterial.subjectCode} • {msg.forwardedMaterial.subjectName}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold bg-[#F0EDED] px-2 py-0.5 rounded text-[#434844]">
                                      {msg.forwardedMaterial.fileFormat}
                                    </span>
                                  </div>

                                  <h4 className="text-sm font-bold text-[#1b1c1c]">
                                    {msg.forwardedMaterial.title}
                                  </h4>

                                  {msg.forwardedMaterial.snippet && (
                                    <p className="text-xs md:text-[13px] text-[#737874] line-clamp-2">
                                      {msg.forwardedMaterial.snippet}
                                    </p>
                                  )}

                                  <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                                    <span className="text-xs text-[#737874]">
                                      Size: {msg.forwardedMaterial.fileSize}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        id={`read-forwarded-${msg.forwardedMaterial.id}`}
                                        onClick={() => handleOpenMaterial(msg.forwardedMaterial!)}
                                        className="px-3 py-1.5 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" /> Read Material
                                      </button>
                                      <button
                                        id={`re-forward-${msg.forwardedMaterial.id}`}
                                        onClick={() => {
                                          const fwdMat = msg.forwardedMaterial!;
                                          const fullMat = materials.find((m) => m.id === fwdMat.id) || {
                                            id: fwdMat.id,
                                            classroomId: activeClassroomId,
                                            subjectId: 'sub-1',
                                            subjectCode: fwdMat.subjectCode,
                                            subjectName: fwdMat.subjectName,
                                            title: fwdMat.title,
                                            description: fwdMat.snippet,
                                            fileFormat: fwdMat.fileFormat,
                                            fileSize: fwdMat.fileSize,
                                            downloadUrl: '#',
                                            uploadedBy: {
                                              id: currentUser.id,
                                              name: currentUser.name,
                                              avatar: currentUser.avatar,
                                              role: 'student' as const,
                                            },
                                            uploadedDate: 'Today',
                                            downloadsCount: 1,
                                            viewsCount: 1,
                                            type: fwdMat.type,
                                          };
                                          setMultiForwardMaterial(fullMat);
                                          setIsMultiForwardOpen(true);
                                        }}
                                        className="px-2.5 py-1.5 bg-[#008069]/10 hover:bg-[#008069]/20 text-[#008069] text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                        title="Forward to other chats or classmates"
                                      >
                                        <Forward className="w-3.5 h-3.5" /> Forward
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                {msg.content}
                              </p>
                            )}

                            {/* Message Footer: Timestamp, Star, Pin & Delivery Status */}
                            <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[11px] md:text-xs text-[#737874]">
                              {msg.isPinned && (
                                <span title="Pinned message">
                                  <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600 inline" />
                                </span>
                              )}
                              {(msg.isStarred || (msg.starredBy && msg.starredBy.includes(currentUser.id))) && (
                                <span title="Starred message">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
                                </span>
                              )}
                              <span>{msg.timestamp}</span>
                              {isSelf && (
                                <span className="ml-0.5">
                                  {isReadByOthers ? (
                                    <CheckCheck className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                                  ) : (
                                    <CheckCheck className="w-4 h-4 text-[#737874]" />
                                  )}
                                </span>
                              )}
                            </div>

                            {/* WhatsApp Emoji Reactions Display */}
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5 -mb-0.5">
                                {getEmojiGroups(msg.reactions).map(
                                  ({ emoji, count, userNames, hasUserReacted }) => (
                                    <button
                                      key={emoji}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleReaction(msg, emoji);
                                      }}
                                      className={`px-1.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 border shadow-2xs transition-transform hover:scale-105 cursor-pointer ${
                                        hasUserReacted
                                          ? 'bg-[#d9e6dc] border-[#b2beb5] text-[#1b1c1c] font-bold'
                                          : 'bg-white/90 border-[#E5E4E2] text-[#434844]'
                                      }`}
                                      title={`${userNames.join(', ')}`}
                                    >
                                      <span>{emoji}</span>
                                      {count > 1 && <span className="text-[10px]">{count}</span>}
                                    </button>
                                  )
                                )}
                              </div>
                            )}

                            {/* Delete Message Button for Sender or Admin */}
                            {!msg.isDeleted &&
                              (isSelf ||
                                (activeGroupDetails?.adminIds || []).includes(currentUser.id)) && (
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="absolute top-1 right-7 opacity-0 group-hover:opacity-100 p-1 text-[#737874] hover:text-red-600 bg-white/80 rounded-md transition-opacity shadow-xs cursor-pointer"
                                  title="Delete Message"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}

                {/* Real-time Typing Indicator in Message Area */}
                {typingUsers.size > 0 && (
                  <div className="flex items-center gap-2 text-xs text-[#56615a] italic bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-full w-fit border border-[#E5E4E2] animate-pulse">
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-[#56615a] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#56615a] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#56615a] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                    <span>{Array.from(typingUsers.values()).join(', ')} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Emoji Tray */}
              {showEmojiPicker && (
                <div 
                  id="emoji-picker-panel"
                  className="px-4 py-2 bg-[#F6F4F0] border-t border-[#E5E4E2] flex items-center gap-2 overflow-x-auto"
                >
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setInputText((prev) => prev + emoji)}
                      className="text-lg p-1.5 hover:bg-[#E5E4E2] rounded-lg transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Replying Banner (WhatsApp Styled) */}
              {replyingTo && (
                <div className="px-4 py-2 bg-[#F0EDED] border-t border-[#E5E4E2] flex items-center justify-between animate-in slide-in-from-bottom-2 z-10">
                  <div className="flex items-center gap-3 border-l-4 border-[#00a884] pl-2.5 min-w-0">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#00a884] flex items-center gap-1">
                        <Reply className="w-3 h-3" /> Replying to {replyingTo.senderName}
                      </div>
                      <div className="text-xs text-[#54656f] truncate max-w-md">
                        {replyingTo.content || (replyingTo.fileName ? `📎 ${replyingTo.fileName}` : 'Attachment')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="w-6 h-6 rounded-full hover:bg-[#E5E4E2] flex items-center justify-center text-[#737874] cursor-pointer"
                    title="Cancel reply"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Bottom Message Input Dock (WhatsApp Styled) */}
              <footer className="p-3 md:p-4 bg-[#F6F4F0] border-t border-[#E5E4E2] flex items-end gap-2 relative">
                {/* Attach Menu Popover */}
                {showAttachMenu && (
                  <div 
                    id="attachment-menu-popover"
                    className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-xl border border-[#E5E4E2] p-2 flex flex-col gap-1 z-30 animate-in fade-in slide-in-from-bottom-2 w-56"
                  >
                    <button
                      id="attach-file-option"
                      onClick={() => {
                        setShowAttachMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1b1c1c] hover:bg-[#F0EDED] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Share Document</div>
                        <div className="text-[10px] text-[#737874] font-normal">PDF, DOCX, files</div>
                      </div>
                    </button>

                    <button
                      id="attach-camera-option"
                      onClick={() => {
                        setShowAttachMenu(false);
                        setIsCameraOpen(true);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1b1c1c] hover:bg-[#F0EDED] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Camera Snapshot</div>
                        <div className="text-[10px] text-[#737874] font-normal">Snap textbook/note photo</div>
                      </div>
                    </button>

                    <button
                      id="attach-forward-material-option"
                      onClick={() => {
                        setShowAttachMenu(false);
                        setIsForwardMaterialOpen(true);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1b1c1c] hover:bg-[#F0EDED] rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Forward Library Material</div>
                        <div className="text-[10px] text-[#737874] font-normal">Send cohort slides & PYQs</div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Action Buttons: Emoji & Attach */}
                <button
                  id="toggle-emoji-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                    showEmojiPicker ? 'bg-[#56615a] text-white' : 'text-[#434844] hover:bg-[#E5E4E2]'
                  }`}
                  title="Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  id="toggle-attach-btn"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                    showAttachMenu ? 'bg-[#56615a] text-white' : 'text-[#434844] hover:bg-[#E5E4E2]'
                  }`}
                  title="Attach file, camera photo, or forward study material"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Textarea Input */}
                <div className="flex-1 bg-white rounded-2xl border border-[#E5E4E2] focus-within:border-[#008069] shadow-xs px-4 py-2.5 flex items-center">
                  <textarea
                    id="chat-message-input"
                    rows={1}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message (Press Enter to send, Shift+Enter for new line)..."
                    className="w-full text-sm md:text-[15px] text-[#1b1c1c] bg-transparent focus:outline-none resize-none max-h-28 scrollbar-thin"
                  />
                </div>

                {/* Send Button */}
                <button
                  id="send-chat-message-btn"
                  onClick={handleSendText}
                  disabled={!inputText.trim()}
                  className="w-11 h-11 rounded-full bg-[#008069] hover:bg-[#006e5a] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-[#008069] cursor-pointer shadow-md flex-shrink-0"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </footer>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-[#737874] m-auto max-w-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#d9e6dc] text-[#56615a] flex items-center justify-center mb-4 shadow-sm">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1b1c1c]">Cohort Digital Sanctuary Chat</h3>
              <p className="text-xs text-[#737874] mt-1.5 leading-relaxed">
                Connect and coordinate with fellow classmates. Select an existing group or start a new
                conversation from the sidebar.
              </p>
              <div className="flex items-center gap-2 mt-4">
                {isCohortAdmin && (
                  <button
                    onClick={() => setIsCreateGroupOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#56615a] text-white shadow-xs cursor-pointer hover:bg-[#434d46] transition-colors"
                  >
                    + Create Group
                  </button>
                )}
                <button
                  onClick={() => setIsNewDirectOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F0EDED] text-[#1b1c1c] cursor-pointer hover:bg-[#E4E2E1] transition-colors"
                >
                  Direct Chat
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Group Creation Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        members={classMembers}
        currentUserId={currentUser.id}
        onCreateGroup={handleCreateGroup}
      />

      {/* Group Info & Admin Controls Drawer */}
      {activeGroup && activeGroupDetails && (
        <GroupInfoDrawer
          isOpen={isInfoDrawerOpen}
          onClose={() => setIsInfoDrawerOpen(false)}
          group={activeGroup}
          members={activeGroupDetails.members}
          allClassMembers={classMembers}
          currentUserId={currentUser.id}
          chatMessages={messages}
          onOpenSearch={() => setIsInChatSearchOpen(true)}
          materials={materials}
          onOpenDocumentReader={onOpenDocumentReader}
          onUpdateGroup={handleUpdateGroup}
          onAddMembers={handleAddMembers}
          onRemoveMember={handleRemoveMember}
          onBanMember={handleBanGroupMember}
          onStartDirectChat={handleStartDirectChat}
          onChangeRole={handleChangeRole}
          onDeleteGroup={handleDeleteGroup}
          onLeaveGroup={handleLeaveGroup}
        />
      )}

      {/* WhatsApp Message Context Menu (Right click or hover chevron) */}
      <MessageContextMenu
        isOpen={contextMenuState.isOpen}
        position={contextMenuState.position}
        message={contextMenuState.message}
        currentUser={currentUser}
        isGroupAdmin={(activeGroupDetails?.adminIds || []).includes(currentUser.id)}
        onClose={() => setContextMenuState((prev) => ({ ...prev, isOpen: false }))}
        onReply={(msg) => setReplyingTo(msg)}
        onCopy={handleCopyMessage}
        onReact={handleToggleReaction}
        onForward={(msg) => setForwardingMessage(msg)}
        onPin={handleTogglePin}
        onStar={handleToggleStar}
        onDelete={(msg) => handleDeleteMessage(msg.id)}
      />

      {/* WhatsApp-Style Member Context Menu (Right-click on sender avatar/name or profile) */}
      <MemberContextMenu
        isOpen={memberContextMenuState.isOpen}
        position={memberContextMenuState.position}
        member={memberContextMenuState.member}
        currentUser={currentUser}
        contextType="both"
        groupId={activeGroupId || undefined}
        groupName={activeGroup?.name}
        cohortName="Cohort"
        isCohortAdmin={isCohortAdmin}
        isGroupAdmin={(activeGroupDetails?.adminIds || []).includes(currentUser.id)}
        onClose={() => setMemberContextMenuState((prev) => ({ ...prev, isOpen: false }))}
        onMessageUser={handleStartDirectChat}
        onRemoveFromGroup={handleRemoveMember}
        onBanFromGroup={handleBanGroupMember}
        onRemoveFromCohort={onRemoveCohortMember}
        onBanFromCohort={onBanCohortMember || handleBanCohortMember}
        onToggleGroupRole={(memberId, currentRole) =>
          handleChangeRole(memberId, currentRole === 'admin' ? 'member' : 'admin')
        }
      />

      {/* WhatsApp Forward Message Modal */}
      <ForwardMessageModal
        isOpen={Boolean(forwardingMessage)}
        onClose={() => setForwardingMessage(null)}
        message={forwardingMessage}
        groups={groups}
        currentUser={currentUser}
        onForward={handleConfirmForward}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b1c1c] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-white/10">
          <Check className="w-4 h-4 text-[#00a884]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Camera Snapshot Modal */}
      <CameraSnapshotModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Forward Study Material Modal */}
      <ForwardMaterialModal
        isOpen={isForwardMaterialOpen}
        onClose={() => setIsForwardMaterialOpen(false)}
        materials={materials}
        onForward={handleForwardMaterial}
      />

      {/* New Direct 1-on-1 Chat Modal */}
      <NewDirectChatModal
        isOpen={isNewDirectOpen}
        onClose={() => setIsNewDirectOpen(false)}
        members={classMembers}
        currentUserId={currentUser.id}
        onSelectUser={handleStartDirectChat}
      />

      {/* Edit Current User Profile Modal */}
      <EditProfileModal
        isOpen={isEditMyProfileOpen}
        currentUser={currentUser}
        onClose={() => setIsEditMyProfileOpen(false)}
        onSave={handleSaveMyProfile}
      />

      {/* Edit Friend's Name Only Modal */}
      {directFriend && (
        <EditFriendNameModal
          isOpen={isEditFriendNameOpen}
          friendId={directFriend.id}
          friendCurrentName={directFriend.name}
          friendAvatar={directFriend.avatar}
          groupId={activeGroupId || undefined}
          onClose={() => setIsEditFriendNameOpen(false)}
          onSave={handleSaveFriendName}
        />
      )}
      {/* Multi-Target Material Forwarding Modal (Forward to multiple people or groups) */}
      <ForwardMaterialMultiModal
        isOpen={isMultiForwardOpen}
        onClose={() => {
          setIsMultiForwardOpen(false);
          setMultiForwardMaterial(null);
          onClearMaterialToForward?.();
        }}
        material={multiForwardMaterial}
        groups={groups}
        classMembers={classMembers}
        currentUser={currentUser}
        onForwardComplete={(forwardedGroupIds) => {
          fetchGroups();
          if (forwardedGroupIds.length > 0) {
            setActiveGroupId(forwardedGroupIds[0]);
          }
          setIsMultiForwardOpen(false);
          setMultiForwardMaterial(null);
          onClearMaterialToForward?.();
          showToast(
            `Material forwarded to ${forwardedGroupIds.length} ${
              forwardedGroupIds.length === 1 ? 'chat' : 'chats'
            }!`
          );
        }}
      />
    </div>
  );
};
