import React from 'react';
import { User, Material, Classroom } from '../types';
import { FileText, Bookmark, Download, Award, ShieldCheck, Mail, School, Users, KeyRound, LogOut, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  classroom?: Classroom | null;
  materials: Material[];
  onPreviewMaterial: (material: Material) => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  classroom,
  materials,
  onPreviewMaterial,
  onOpenAuth,
  onSignOut,
}) => {
  const userUploads = materials.filter((m) => m.uploadedBy.id === user.id);

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-10 pb-32 min-h-screen">
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-10 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#E2E8F0] border-2 border-[#CBD5E1] overflow-hidden flex-shrink-0 shadow-md ring-4 ring-[#EFF6FF]">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {user.name}
              </h1>
              <span className="text-xs uppercase font-bold bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full border border-[#FDE68A]">
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-[#64748B] font-medium flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-[#1E3A8A]" /> {user.department}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#1E3A8A]" /> Roll: {user.rollNumber}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#1E3A8A]" /> {user.email}
              </span>
            </p>

            {/* Enrolled Classroom Cohort details (1-Classroom Rule) */}
            {classroom && (
              <div className="mt-3 p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                      {classroom.name}
                      <span className="text-[10px] bg-white border border-[#CBD5E1] text-[#1E3A8A] px-1.5 py-0.2 rounded font-mono font-bold">
                        {classroom.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      {classroom.collegeName} • {classroom.section} • {classroom.semester}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-[#FDE68A] shadow-xs">
                  1 Classroom Membership Active
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-[#0F172A]">{userUploads.length}</div>
                  <div className="text-[11px] text-[#64748B] uppercase font-bold">Notes Uploaded</div>
                </div>
                <div className="h-8 w-px bg-[#E2E8F0]" />
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-[#0F172A]">1.4k</div>
                  <div className="text-[11px] text-[#64748B] uppercase font-bold">Cohort Downloads</div>
                </div>
                <div className="h-8 w-px bg-[#E2E8F0]" />
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-[#D97706]">Top Contributor</div>
                  <div className="text-[11px] text-[#64748B] uppercase font-bold">Badge</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#334155] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Switch User</span>
                </button>
                <button
                  onClick={onSignOut}
                  className="px-3.5 py-2 bg-white border border-[#FECACA] hover:bg-[#FEE2E2]/60 text-[#DC2626] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Contributed Notes */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 md:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#1E3A8A]" />
          My Uploaded Notes & Contributions
        </h2>

        {userUploads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userUploads.map((item) => (
              <div
                key={item.id}
                onClick={() => onPreviewMaterial(item)}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all cursor-pointer group shadow-xs hover:bg-white"
              >
                <div className="flex justify-between text-xs text-[#64748B] mb-2">
                  <span className="font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">{item.subjectCode}</span>
                  <span>{item.fileSize}</span>
                </div>
                <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-4 pt-2 border-t border-[#E2E8F0]">
                  <span>{item.uploadedDate}</span>
                  <span className="text-[#D97706] font-bold">{item.downloadsCount} downloads</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-[#64748B]">
            No study materials uploaded yet.
          </div>
        )}
      </div>
    </main>
  );
};
