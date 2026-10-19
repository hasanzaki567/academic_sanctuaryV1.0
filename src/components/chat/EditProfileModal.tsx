import React, { useState, useRef } from 'react';
import { X, Camera, Check, User as UserIcon, Upload } from 'lucide-react';
import { User } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onSave: (updated: { name: string; avatar: string }) => Promise<void> | void;
}

const PRESET_AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result as string;
        if (result) {
          setAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), avatar });
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="edit-profile-modal"
        className="w-full max-w-xl bg-[#FEFEFA] rounded-3xl shadow-2xl border-2 border-[#E5E4E2] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#008069] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">Edit Profile</h2>
              <p className="text-xs text-white/80 font-medium">Update your display avatar and cohort nickname</p>
            </div>
          </div>
          <button
            id="close-edit-profile-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-white"
            title="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 flex flex-col gap-6 overflow-y-auto">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={avatar}
                alt={name}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-[#008069]/20 shadow-md group-hover:opacity-90 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-3xl bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8" />
                <span className="text-xs font-black mt-1 tracking-wider">CHANGE PHOTO</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="upload-profile-photo-btn"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#008069] bg-[#008069]/10 hover:bg-[#008069]/20 rounded-2xl transition-colors cursor-pointer border-2 border-[#008069]/20"
              >
                <Upload className="w-4 h-4" />
                Upload New Photo
              </button>
            </div>

            {/* Presets */}
            <div className="w-full mt-1">
              <p className="text-xs sm:text-sm font-bold text-[#56615a] text-center mb-2.5">Or choose from preset avatars:</p>
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                {PRESET_AVATARS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(presetUrl)}
                    className={`w-12 h-12 rounded-2xl overflow-hidden border-3 transition-all cursor-pointer ${
                      avatar === presetUrl ? 'border-[#008069] scale-110 shadow-md ring-2 ring-[#008069]/30' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="user-profile-name-input" className="text-xs sm:text-sm font-black text-[#1b1c1c]">
              Your Display Name <span className="text-red-500">*</span>
            </label>
            <input
              id="user-profile-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              maxLength={50}
              className="w-full px-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white rounded-2xl text-sm sm:text-base text-[#1b1c1c] font-semibold outline-none transition-colors"
            />
            <span className="text-xs sm:text-sm text-[#56615a] font-medium leading-relaxed">
              This name will appear on messages, study submissions, and notifications sent to your classmates.
            </span>
          </div>

          {/* Read-Only Info */}
          <div className="p-4 bg-[#F6F4F0] rounded-2xl text-xs sm:text-sm text-[#56615a] flex flex-col gap-2 border-2 border-[#E5E4E2]">
            <div className="flex justify-between">
              <span className="text-[#737874] font-medium">Email:</span>
              <span className="font-bold text-[#1b1c1c]">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737874] font-medium">Role:</span>
              <span className="font-bold text-[#1b1c1c] capitalize">{currentUser.role.replace('_', ' ')}</span>
            </div>
            {currentUser.rollNumber && (
              <div className="flex justify-between">
                <span className="text-[#737874] font-medium">Student ID:</span>
                <span className="font-bold text-[#1b1c1c]">{currentUser.rollNumber}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#F0EDED]">
            <button
              type="button"
              id="cancel-edit-profile-btn"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-3 text-xs sm:text-sm font-bold text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-profile-btn"
              disabled={isSaving || !name.trim()}
              className="px-6 py-3.5 text-xs sm:text-sm font-black text-white bg-[#008069] hover:bg-[#006a57] rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
