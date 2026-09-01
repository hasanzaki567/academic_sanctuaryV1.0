import React from 'react';
import { User, Material, Classroom } from '../types';
import { FileText, Bookmark, Download, Award, ShieldCheck, Mail, School, Users, LogIn, LogOut, Sparkles } from 'lucide-react';

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
      <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-3xl p-6 md:p-10 shadow-[0_4px_20px_rgba(51,51,51,0.03)] mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#E4E2E1] border-2 border-[#C3C8C3] overflow-hidden flex-shrink-0 shadow-md">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b1c1c] tracking-tight">
                {user.name}
              </h1>
              <span className="text-xs uppercase font-bold bg-[#d6e7a1]/50 text-[#56642b] px-3 py-1 rounded-full border border-[#d6e7a1]">
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-[#737874] font-medium flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-[#56615a]" /> {user.department}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#56615a]" /> Roll: {user.rollNumber}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#56615a]" /> {user.email}
              </span>
            </p>

            {/* Enrolled Classroom Cohort details (1-Classroom Rule) */}
            {classroom && (
              <div className="mt-3 p-3 bg-[#d9e6dc]/30 border border-[#b2beb5]/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#56615a] text-white flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1b1c1c] flex items-center gap-1.5">
                      {classroom.name}
                      <span className="text-[10px] bg-white border border-[#C3C8C3] text-[#56615a] px-1.5 py-0.2 rounded font-mono">
                        {classroom.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#737874]">
                      {classroom.collegeName} • {classroom.section} • {classroom.semester}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[#56642b] uppercase tracking-wider bg-white/80 px-2.5 py-1 rounded-full border border-[#d6e7a1]">
                  1 Classroom Membership Active
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-[#1b1c1c]">{userUploads.length}</div>
                  <div className="text-[11px] text-[#737874] uppercase font-semibold">Notes Uploaded</div>
                </div>
                <div className="h-8 w-px bg-[#E5E4E2]" />
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-[#1b1c1c]">1.4k</div>
                  <div className="text-[11px] text-[#737874] uppercase font-semibold">Cohort Downloads</div>
                </div>
                <div className="h-8 w-px bg-[#E5E4E2]" />
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-[#56642b]">Top Contributor</div>
                  <div className="text-[11px] text-[#737874] uppercase font-semibold">Badge</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 bg-white border border-[#E5E4E2] hover:bg-[#F0EDED] text-[#434844] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#56615a]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={onSignOut}
                  className="px-3.5 py-2 bg-white border border-[#ffb4ab] hover:bg-[#ffdad6]/40 text-[#ba1a1a] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
      <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-3xl p-6 md:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-[#1b1c1c] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#56615a]" />
          My Uploaded Notes & Contributions
        </h2>

        {userUploads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userUploads.map((item) => (
              <div
                key={item.id}
                onClick={() => onPreviewMaterial(item)}
                className="p-4 rounded-2xl bg-white border border-[#E5E4E2] hover:border-[#b2beb5] transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex justify-between text-xs text-[#737874] mb-2">
                  <span className="font-bold text-[#56615a]">{item.subjectCode}</span>
                  <span>{item.fileSize}</span>
                </div>
                <h4 className="text-sm font-bold text-[#1b1c1c] group-hover:text-[#56615a] transition-colors leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-[#737874] mt-4 pt-2 border-t border-[#F0EDED]">
                  <span>{item.uploadedDate}</span>
                  <span className="text-[#56642b] font-medium">{item.downloadsCount} downloads</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-[#737874]">
            No study materials uploaded yet.
          </div>
        )}
      </div>
    </main>
  );
};
