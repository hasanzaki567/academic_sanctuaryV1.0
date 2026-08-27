import React, { useState } from 'react';
import { Classroom, User, Announcement, Exam, Material } from '../types';
import { Sparkles, Plus, Clock, FileText, ArrowRight, Share2, Eye, Download, Bookmark } from 'lucide-react';

interface DashboardViewProps {
  classroom: Classroom;
  user: User;
  announcements: Announcement[];
  nextExam: Exam | null;
  recentMaterials: Material[];
  onNavigate: (view: string, data?: any) => void;
  onOpenUpload: () => void;
  onPreviewMaterial: (material: Material) => void;
  onAddAnnouncement: (title: string, description: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  classroom,
  user,
  announcements,
  nextExam,
  recentMaterials,
  onNavigate,
  onOpenUpload,
  onPreviewMaterial,
  onAddAnnouncement,
}) => {
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddAnnouncement(newTitle, newDesc);
    setNewTitle('');
    setNewDesc('');
    setShowAnnounceModal(false);
  };

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'picture_as_pdf';
      case 'DOCX':
        return 'description';
      case 'PPTX':
        return 'slideshow';
      default:
        return 'article';
    }
  };

  return (
    <main className="w-full max-w-[1280px] px-4 md:px-16 py-6 md:py-10 flex flex-col gap-8 mx-auto min-h-screen">
      {/* Welcome Header */}
      <section className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs md:text-sm font-bold text-[#64748B] tracking-wider uppercase">
            {classroom ? classroom.name : 'B.TECH CSE 2026 - SECTION A'}
          </p>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
            Active Session
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          Welcome back, {user ? user.name.split(' ')[0] : 'Sarah'}
        </h2>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Upcoming Exams Countdown (Left side) */}
        <section 
          onClick={() => onNavigate('exams')}
          className="col-span-1 md:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 academic-shadow flex flex-col justify-between gap-4 cursor-pointer hover:border-[#93C5FD] hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-[#1E3A8A]">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-2xl text-[#D97706]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                timer
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#0F172A]">Next Exam</h3>
            </div>
            <span className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-0.5 font-semibold">
              View All <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <span className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight">
              {nextExam ? nextExam.daysRemaining : 12}
            </span>
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider mt-1">
              Days until
            </span>
            <span className="text-lg md:text-xl font-bold text-[#1E3A8A] mt-1 text-center px-4">
              {nextExam ? nextExam.subjectName : 'Data Structures'}
            </span>
            <span className="text-xs text-[#64748B] mt-1 font-medium">
              {nextExam ? nextExam.date : 'Sep 05, 2026'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-[#64748B] font-medium mb-1.5">
              <span>Preparation Timeline</span>
              <span className="font-bold text-[#0F172A]">{nextExam ? nextExam.progressPercent : 75}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
                style={{ width: `${nextExam ? nextExam.progressPercent : 75}%` }}
              />
            </div>
          </div>
        </section>

        {/* Announcements Card (Right side) */}
        <section className="col-span-1 md:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 academic-shadow flex flex-col gap-5 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#1E3A8A]">
              <span
                className="material-symbols-outlined text-2xl text-[#1E3A8A]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                campaign
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#0F172A]">Announcements</h3>
            </div>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="text-xs font-bold text-[#1E3A8A] hover:text-[#0F172A] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer border border-[#BFDBFE]"
            >
              <Plus className="w-3.5 h-3.5" /> Post Notice
            </button>
          </div>

          <ul className="flex flex-col divide-y divide-[#F1F5F9]">
            {announcements.slice(0, 3).map((item) => (
              <li key={item.id} className="py-3.5 first:pt-1 last:pb-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">{item.timestamp}</span>
                  {item.isUrgent && (
                    <span className="text-[10px] uppercase font-bold text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-base md:text-lg font-semibold text-[#0F172A] leading-snug">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs md:text-sm text-[#475569] mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Quick Links Section */}
        <section className="col-span-1 md:col-span-12 flex flex-wrap gap-2.5 items-center py-1">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mr-2">
            Quick Access:
          </span>
          <button
            onClick={() => onNavigate('subjects')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] hover:border-[#93C5FD] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">menu_book</span>
            Subjects
          </button>
          <button
            onClick={() => onNavigate('notes')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] hover:border-[#93C5FD] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">description</span>
            Notes
          </button>
          <button
            onClick={() => onNavigate('slides')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] hover:border-[#93C5FD] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">slideshow</span>
            Slides
          </button>
          <button
            onClick={() => onNavigate('saved')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] hover:border-[#93C5FD] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#D97706]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
            Saved Files
          </button>
          <button
            onClick={() => onNavigate('exams')}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] hover:border-[#93C5FD] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">quiz</span>
            PYQs & Exams
          </button>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-full bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs md:text-sm transition-colors flex items-center gap-1.5 ml-auto shadow-md shadow-blue-950/15 cursor-pointer hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Upload Study Material
          </button>
        </section>

        {/* Recent Uploads Grid */}
        <section className="col-span-1 md:col-span-12 bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 academic-shadow flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#0F172A]">Recent Materials</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Freshly uploaded study materials, guides, and lecture slides</p>
            </div>
            <button
              onClick={() => onNavigate('notes')}
              className="text-xs md:text-sm font-bold text-[#1E3A8A] hover:text-[#0F172A] transition-colors flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentMaterials.map((file) => (
              <div
                key={file.id}
                onClick={() => onPreviewMaterial(file)}
                className="flex items-start gap-3.5 p-4 rounded-xl hover:bg-[#F8FAFC] transition-all group cursor-pointer border border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-xs"
              >
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-[#1E3A8A] flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors shadow-xs">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {getFileIcon(file.fileFormat)}
                  </span>
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors truncate">
                    {file.title}
                  </span>
                  <span className="text-xs text-[#64748B] mt-1 truncate">
                    {file.fileFormat} • {file.uploadedBy.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-1.5">
                    <span className="bg-[#F1F5F9] px-2 py-0.5 rounded text-[10px] font-semibold text-[#334155]">
                      {file.subjectCode}
                    </span>
                    <span>{file.fileSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Post Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E2E8F0] shadow-2xl">
            <h3 className="text-xl font-bold text-[#0F172A] mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1E3A8A]">campaign</span>
              Post Class Announcement
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Broadcast an exam alert, schedule change, or assignment reminder to all cohort members.
            </p>

            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">
                  Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Exam Schedule Released"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="paper-input w-full p-3 rounded-lg text-sm text-[#0F172A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">
                  Details / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional context, timing, hall numbers, or study instructions..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="paper-input w-full p-3 rounded-lg text-sm text-[#0F172A]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
