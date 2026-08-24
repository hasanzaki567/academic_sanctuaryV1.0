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
          <p className="text-xs md:text-sm font-semibold text-[#737874] tracking-wider uppercase">
            {classroom ? classroom.name : 'B.TECH CSE 2026 - SECTION A'}
          </p>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0EDED] text-[#56615a] rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#56642b] animate-pulse" />
            Active Session
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1b1c1c] tracking-tight">
          Welcome back, {user ? user.name.split(' ')[0] : 'Sarah'}
        </h2>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Announcements Card */}
        <section className="col-span-1 md:col-span-8 bg-white border border-[#C3C8C3]/80 rounded-2xl p-6 md:p-8 academic-shadow flex flex-col gap-5 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#56615a]">
              <span
                className="material-symbols-outlined text-2xl text-[#56615a]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                campaign
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#1b1c1c]">Announcements</h3>
            </div>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="text-xs font-semibold text-[#56615a] hover:text-[#1b1c1c] bg-[#F0EDED] hover:bg-[#E4E2E1] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Post Notice
            </button>
          </div>

          <ul className="flex flex-col divide-y divide-[#E4E2E1]">
            {announcements.slice(0, 3).map((item) => (
              <li key={item.id} className="py-3.5 first:pt-1 last:pb-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737874]">{item.timestamp}</span>
                  {item.isUrgent && (
                    <span className="text-[10px] uppercase font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-base md:text-lg font-semibold text-[#1b1c1c] leading-snug">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs md:text-sm text-[#434844] mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Upcoming Exams Countdown */}
        <section 
          onClick={() => onNavigate('exams')}
          className="col-span-1 md:col-span-4 bg-white border border-[#C3C8C3]/80 rounded-2xl p-6 md:p-8 academic-shadow flex flex-col justify-between gap-4 cursor-pointer hover:border-[#b2beb5] transition-all"
        >
          <div className="flex items-center justify-between text-[#56615a]">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-2xl text-[#56615a]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                timer
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#1b1c1c]">Next Exam</h3>
            </div>
            <span className="text-xs text-[#737874] hover:text-[#1b1c1c] flex items-center gap-0.5">
              View All <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6 bg-[#F6F3F2] rounded-xl border border-[#E5E4E2]">
            <span className="text-4xl md:text-5xl font-black text-[#1b1c1c] tracking-tight">
              {nextExam ? nextExam.daysRemaining : 12}
            </span>
            <span className="text-xs font-semibold text-[#737874] uppercase tracking-wider mt-1">
              Days until
            </span>
            <span className="text-lg md:text-xl font-bold text-[#1b1c1c] mt-1 text-center px-4">
              {nextExam ? nextExam.subjectName : 'Data Structures'}
            </span>
            <span className="text-xs text-[#737874] mt-1 font-medium">
              {nextExam ? nextExam.date : 'Sep 05, 2026'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-[#737874] font-medium mb-1.5">
              <span>Preparation Timeline</span>
              <span>{nextExam ? nextExam.progressPercent : 75}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#E4E2E1] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#b2beb5] rounded-full transition-all duration-500"
                style={{ width: `${nextExam ? nextExam.progressPercent : 75}%` }}
              />
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="col-span-1 md:col-span-12 flex flex-wrap gap-2.5 items-center py-1">
          <span className="text-xs font-bold text-[#737874] uppercase tracking-wider mr-2">
            Quick Access:
          </span>
          <button
            onClick={() => onNavigate('subjects')}
            className="px-4 py-2 rounded-full bg-[#F6F3F2] hover:bg-[#F0EDED] border border-[#E4E2E1] text-[#1b1c1c] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Subjects
          </button>
          <button
            onClick={() => onNavigate('notes')}
            className="px-4 py-2 rounded-full bg-[#F6F3F2] hover:bg-[#F0EDED] border border-[#E4E2E1] text-[#1b1c1c] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Notes
          </button>
          <button
            onClick={() => onNavigate('members')}
            className="px-4 py-2 rounded-full bg-[#F6F3F2] hover:bg-[#F0EDED] border border-[#E4E2E1] text-[#1b1c1c] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            Members
          </button>
          <button
            onClick={() => onNavigate('exams')}
            className="px-4 py-2 rounded-full bg-[#F6F3F2] hover:bg-[#F0EDED] border border-[#E4E2E1] text-[#1b1c1c] font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            PYQs & Exams
          </button>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-full bg-[#56615a] hover:bg-[#424d46] text-white font-semibold text-xs md:text-sm transition-colors flex items-center gap-1.5 ml-auto shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Upload Study Material
          </button>
        </section>

        {/* Recent Uploads Grid */}
        <section className="col-span-1 md:col-span-12 bg-white border border-[#C3C8C3]/80 rounded-2xl p-6 md:p-8 academic-shadow flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1b1c1c]">Recent Materials</h3>
              <p className="text-xs text-[#737874] mt-0.5">Freshly uploaded study materials, guides, and lecture slides</p>
            </div>
            <button
              onClick={() => onNavigate('notes')}
              className="text-xs md:text-sm font-semibold text-[#56615a] hover:text-[#1b1c1c] transition-colors flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentMaterials.map((file) => (
              <div
                key={file.id}
                onClick={() => onPreviewMaterial(file)}
                className="flex items-start gap-3.5 p-4 rounded-xl hover:bg-[#F6F3F2] transition-all group cursor-pointer border border-[#E5E4E2]/80 hover:border-[#b2beb5] hover:shadow-sm"
              >
                <div className="w-12 h-12 bg-[#b2beb5]/25 rounded-xl flex items-center justify-center text-[#56615a] flex-shrink-0 group-hover:bg-[#b2beb5]/40 transition-colors">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {getFileIcon(file.fileFormat)}
                  </span>
                </div>
                <div className="flex flex-col min-w-0 flex-grow">
                  <span className="text-sm font-bold text-[#1b1c1c] group-hover:text-[#56615a] transition-colors truncate">
                    {file.title}
                  </span>
                  <span className="text-xs text-[#737874] mt-1 truncate">
                    {file.fileFormat} • {file.uploadedBy.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-[#737874] mt-1.5">
                    <span className="bg-[#F0EDED] px-2 py-0.5 rounded text-[10px] font-semibold text-[#434844]">
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E5E4E2] shadow-2xl">
            <h3 className="text-xl font-bold text-[#1b1c1c] mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#56615a]">campaign</span>
              Post Class Announcement
            </h3>
            <p className="text-xs text-[#737874] mb-4">
              Broadcast an exam alert, schedule change, or assignment reminder to all cohort members.
            </p>

            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#434844] block mb-1">
                  Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Exam Schedule Released"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="paper-input w-full p-3 rounded-lg text-sm text-[#1b1c1c]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#434844] block mb-1">
                  Details / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional context, timing, hall numbers, or study instructions..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="paper-input w-full p-3 rounded-lg text-sm text-[#1b1c1c]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#737874] hover:bg-[#F0EDED] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
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
