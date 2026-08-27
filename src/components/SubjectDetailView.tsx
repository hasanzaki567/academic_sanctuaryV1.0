import React, { useState } from 'react';
import { Subject, Material } from '../types';
import { Download, Search, BookOpen, Bookmark, Check } from 'lucide-react';

interface SubjectDetailViewProps {
  subject: Subject;
  materials: Material[];
  onOpenUpload: (subjectId?: string) => void;
  onPreviewMaterial?: (material: Material) => void;
  onDownloadMaterial: (material: Material) => void;
  onSaveMaterial?: (material: Material) => void;
  onAddToDrive?: (material: Material) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  materials,
  onOpenUpload,
  onDownloadMaterial,
  onSaveMaterial,
  onAddToDrive,
}) => {
  const [activeTab, setActiveTab] = useState<string>('notes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [driveIds, setDriveIds] = useState<Record<string, boolean>>({});

  const handleSaveToggle = (item: Material) => {
    const isSaved = !savedIds[item.id];
    setSavedIds((prev) => ({ ...prev, [item.id]: isSaved }));
    if (onSaveMaterial) {
      onSaveMaterial(item);
    }
  };

  const handleDriveAdd = (item: Material) => {
    setDriveIds((prev) => ({ ...prev, [item.id]: true }));
    if (onAddToDrive) {
      onAddToDrive(item);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'materials', label: 'Materials' },
    { id: 'pyqs', label: 'PYQs' },
    { id: 'important_questions', label: 'Important Questions' },
  ];

  // Filter materials based on current active tab and search query
  const filteredMaterials = materials.filter((m) => {
    const matchesSubject = m.subjectId === subject.id || m.subjectCode === subject.code;
    if (!matchesSubject) return false;

    if (activeTab !== 'overview' && m.type !== activeTab) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 pt-6 md:pt-8 pb-32 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="bg-[#EFF6FF] text-[#1E3A8A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#BFDBFE]">
            {subject.code}
          </span>
          <span className="text-[#334155] text-sm font-medium">
            {subject.professor}
          </span>
          {subject.creditHours && (
            <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2.5 py-0.5 rounded-md font-medium border border-[#E2E8F0]">
              {subject.creditHours} Credits
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-3">
          {subject.name}
        </h1>

        <p className="text-base md:text-lg text-[#475569] max-w-3xl leading-relaxed">
          {subject.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] mb-8 overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 sm:gap-6 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm md:text-base font-bold pb-3 transition-all relative whitespace-nowrap cursor-pointer px-1 ${
                  isActive
                    ? 'text-[#1E3A8A]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1E3A8A] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 pb-2 pl-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topic or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="paper-input text-xs pl-9 pr-3 py-1.5 rounded-lg w-56 text-[#0F172A]"
            />
          </div>
        </div>
      </div>

      {/* Overview Tab Content (if selected) */}
      {activeTab === 'overview' && (
        <div className="mb-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1E3A8A]" /> Course Syllabus & Key Modules
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              This course explores abstract data types, linear and non-linear memory representations, algorithmic efficiency, complexity bounds (Big-O, Big-Omega, Theta), recursion, tree balances, and network graph pathfinding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-xs font-bold text-[#D97706] uppercase">Unit 1 & 2</div>
              <div className="text-base font-bold text-[#0F172A] mt-1">Linear Structures & Sorting</div>
              <div className="text-xs text-[#475569] mt-1">Arrays, Linked Lists, Stacks, Queues, Merge & Quicksort</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-xs font-bold text-[#D97706] uppercase">Unit 3 & 4</div>
              <div className="text-base font-bold text-[#0F172A] mt-1">Trees, Heaps & Hashing</div>
              <div className="text-xs text-[#475569] mt-1">BST, AVL Trees, Red-Black Trees, Priority Queues, Hash Tables</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="text-xs font-bold text-[#D97706] uppercase">Unit 5 & 6</div>
              <div className="text-base font-bold text-[#0F172A] mt-1">Graphs & Complex Networks</div>
              <div className="text-xs text-[#475569] mt-1">BFS/DFS, Dijkstra, Kruskal, Prim, Floyd-Warshall, Dynamic Programming</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area: Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-3 hover:border-[#93C5FD] transition-all group relative shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-md"
          >
            {/* Top metadata */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#1E3A8A]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  description
                </span>
                <span className="text-[11px] font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                  {item.fileFormat}
                </span>
                {item.unit && (
                  <span className="text-[11px] font-semibold text-[#64748B]">
                    {item.unit}
                  </span>
                )}
                {savedIds[item.id] && (
                  <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded border border-[#FDE68A] flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-[#D97706]" /> Saved
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-[#64748B]">{item.fileSize}</span>
            </div>

            {/* Note title */}
            <h3 className="text-xl font-bold text-[#0F172A] leading-snug mt-1 group-hover:text-[#1E3A8A] transition-colors">
              {item.title}
            </h3>

            {item.description && (
              <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Author and Date Footer */}
            <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-[#F1F5F9]">
              <div className="w-7 h-7 rounded-full bg-[#E2E8F0] overflow-hidden flex-shrink-0 border border-[#CBD5E1]">
                <img
                  src={item.uploadedBy.avatar}
                  alt={item.uploadedBy.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs text-[#334155] font-medium flex-grow truncate">
                Uploaded by {item.uploadedBy.name}
              </span>
              <span className="text-xs text-[#64748B] whitespace-nowrap">{item.uploadedDate}</span>
            </div>

            {/* Hover Action Overlay: Save File, Add to Google Drive, Download */}
            <div className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-[2px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl p-4">
              {/* Save File Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveToggle(item);
                }}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                  savedIds[item.id]
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    : 'bg-white text-[#1E3A8A] hover:bg-[#EFF6FF]'
                }`}
                title={savedIds[item.id] ? 'Saved to My Library' : 'Save File'}
              >
                <Bookmark className={`w-5 h-5 ${savedIds[item.id] ? 'fill-[#D97706]' : ''}`} />
              </button>

              {/* Add to Google Drive Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDriveAdd(item);
                }}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0F172A] hover:bg-[#EFF6FF] transition-all cursor-pointer hover:scale-105 relative"
                title="Add this PDF to Google Drive"
              >
                {driveIds[item.id] ? (
                  <Check className="w-5 h-5 text-[#16A34A]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M8.5 3L15.5 3L21.5 13.5L14.5 13.5L8.5 3Z" fill="#FFC107" />
                    <path d="M2.5 13.5L5.5 8.5L14.5 13.5L11.5 18.5L2.5 13.5Z" fill="#2196F3" />
                    <path d="M11.5 18.5L14.5 13.5L21.5 13.5L18.5 18.5L11.5 18.5Z" fill="#4CAF50" />
                  </svg>
                )}
              </button>

              {/* Download Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadMaterial(item);
                }}
                className="w-12 h-12 bg-[#1E3A8A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#172554] transition-all cursor-pointer border border-white/20 hover:scale-105"
                title="Download Study Material"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto text-[#1E3A8A] mb-3">
            <span className="material-symbols-outlined text-3xl">folder_off</span>
          </div>
          <h4 className="text-lg font-bold text-[#0F172A]">No materials found in this section</h4>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Be the first student to upload lecture notes or past papers for this topic!
          </p>
          <button
            onClick={() => onOpenUpload(subject.id)}
            className="mt-4 px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-950/15 transition-colors cursor-pointer"
          >
            + Upload First Note
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => onOpenUpload(subject.id)}
        className="fixed bottom-[84px] md:bottom-10 right-4 md:right-16 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-2xl px-6 py-3.5 sm:py-4 flex items-center gap-2 shadow-[0_8px_30px_rgba(30,58,138,0.3)] transition-all z-40 group cursor-pointer hover:scale-105"
      >
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform text-[20px]">
          add
        </span>
        <span className="text-sm font-bold tracking-tight">Upload Material</span>
      </button>
    </main>
  );
};
