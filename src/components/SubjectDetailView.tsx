import React, { useState } from 'react';
import { Subject, Material, MaterialType } from '../types';
import { Download, Eye, Plus, Search, BookOpen, FileCheck, CheckCircle2 } from 'lucide-react';

interface SubjectDetailViewProps {
  subject: Subject;
  materials: Material[];
  onOpenUpload: (subjectId?: string) => void;
  onPreviewMaterial: (material: Material) => void;
  onDownloadMaterial: (material: Material) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  materials,
  onOpenUpload,
  onPreviewMaterial,
  onDownloadMaterial,
}) => {
  const [activeTab, setActiveTab] = useState<string>('notes');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
          <span className="bg-[#b2beb5]/25 text-[#434844] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#b2beb5]/40">
            {subject.code}
          </span>
          <span className="text-[#434844] text-sm font-medium">
            {subject.professor}
          </span>
          {subject.creditHours && (
            <span className="text-xs text-[#737874] bg-[#F0EDED] px-2.5 py-0.5 rounded-md">
              {subject.creditHours} Credits
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1b1c1c] tracking-tight mb-3">
          {subject.name}
        </h1>

        <p className="text-base md:text-lg text-[#434844] max-w-3xl leading-relaxed">
          {subject.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#E4E2E1] mb-8 overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 sm:gap-6 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm md:text-base font-semibold pb-3 transition-all relative whitespace-nowrap cursor-pointer px-1 ${
                  isActive
                    ? 'text-[#56615a]'
                    : 'text-[#737874] hover:text-[#1b1c1c]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#56615a] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 pb-2 pl-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topic or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="paper-input text-xs pl-9 pr-3 py-1.5 rounded-lg w-56 text-[#1b1c1c]"
            />
          </div>
        </div>
      </div>

      {/* Overview Tab Content (if selected) */}
      {activeTab === 'overview' && (
        <div className="mb-8 bg-white border border-[#E5E4E2] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-[#1b1c1c] mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#56615a]" /> Course Syllabus & Key Modules
            </h3>
            <p className="text-sm text-[#434844] leading-relaxed">
              This course explores abstract data types, linear and non-linear memory representations, algorithmic efficiency, complexity bounds (Big-O, Big-Omega, Theta), recursion, tree balances, and network graph pathfinding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F9F6EE] border border-[#E5E4E2]">
              <div className="text-xs font-bold text-[#737874] uppercase">Unit 1 & 2</div>
              <div className="text-base font-bold text-[#1b1c1c] mt-1">Linear Structures & Sorting</div>
              <div className="text-xs text-[#434844] mt-1">Arrays, Linked Lists, Stacks, Queues, Merge & Quicksort</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F9F6EE] border border-[#E5E4E2]">
              <div className="text-xs font-bold text-[#737874] uppercase">Unit 3 & 4</div>
              <div className="text-base font-bold text-[#1b1c1c] mt-1">Trees, Heaps & Hashing</div>
              <div className="text-xs text-[#434844] mt-1">BST, AVL Trees, Red-Black Trees, Priority Queues, Hash Tables</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F9F6EE] border border-[#E5E4E2]">
              <div className="text-xs font-bold text-[#737874] uppercase">Unit 5 & 6</div>
              <div className="text-base font-bold text-[#1b1c1c] mt-1">Graphs & Complex Networks</div>
              <div className="text-xs text-[#434844] mt-1">BFS/DFS, Dijkstra, Kruskal, Prim, Floyd-Warshall, Dynamic Programming</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area: Notes List (Matching exact cards from screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-6 flex flex-col gap-3 hover:border-[#bdc9c0] transition-all group relative shadow-[0_4px_20px_rgba(51,51,51,0.02)] hover:shadow-md"
          >
            {/* Top metadata */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#b2beb5]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  description
                </span>
                <span className="text-[11px] font-bold text-[#434844] bg-[#F0EDED] px-2 py-0.5 rounded">
                  {item.fileFormat}
                </span>
                {item.unit && (
                  <span className="text-[11px] font-medium text-[#737874]">
                    {item.unit}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-[#737874]">{item.fileSize}</span>
            </div>

            {/* Note title */}
            <h3 className="text-xl font-bold text-[#1b1c1c] leading-snug mt-1 group-hover:text-[#56615a] transition-colors">
              {item.title}
            </h3>

            {item.description && (
              <p className="text-xs text-[#434844] line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Author and Date Footer */}
            <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-[#E4E2E1]">
              <div className="w-7 h-7 rounded-full bg-[#F0EDED] overflow-hidden flex-shrink-0 border border-[#C3C8C3]/50">
                <img
                  src={item.uploadedBy.avatar}
                  alt={item.uploadedBy.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs text-[#434844] font-medium flex-grow truncate">
                Uploaded by {item.uploadedBy.name}
              </span>
              <span className="text-xs text-[#737874] whitespace-nowrap">{item.uploadedDate}</span>
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-[#F6F3F2]/90 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl p-4">
              <button
                onClick={() => onPreviewMaterial(item)}
                className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#56615a] hover:bg-[#F0EDED] hover:scale-105 transition-all cursor-pointer"
                title="Preview Document & Notes"
              >
                <span className="material-symbols-outlined text-[24px]">visibility</span>
              </button>
              <button
                onClick={() => onDownloadMaterial(item)}
                className="w-12 h-12 bg-[#56615a] text-white rounded-full shadow-md flex items-center justify-center hover:bg-[#434d46] hover:scale-105 transition-all cursor-pointer"
                title="Download Study Material"
              >
                <span className="material-symbols-outlined text-[24px]">download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E5E4E2] rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-[#F0EDED] flex items-center justify-center mx-auto text-[#737874] mb-3">
            <span className="material-symbols-outlined text-3xl">folder_off</span>
          </div>
          <h4 className="text-lg font-bold text-[#1b1c1c]">No materials found in this section</h4>
          <p className="text-xs text-[#737874] mt-1 max-w-sm mx-auto">
            Be the first student to upload lecture notes or past papers for this topic!
          </p>
          <button
            onClick={() => onOpenUpload(subject.id)}
            className="mt-4 px-5 py-2.5 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            + Upload First Note
          </button>
        </div>
      )}

      {/* Floating Action Button (Exact match from screenshot) */}
      <button
        onClick={() => onOpenUpload(subject.id)}
        className="fixed bottom-[84px] md:bottom-10 right-4 md:right-16 bg-[#56615a] hover:bg-[#434d46] text-white rounded-[16px] px-6 py-3.5 sm:py-4 flex items-center gap-2 shadow-[0_4px_20px_rgba(51,51,51,0.2)] transition-all z-40 group cursor-pointer hover:scale-105"
      >
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform text-[20px]">
          add
        </span>
        <span className="text-sm font-bold tracking-tight">Upload Material</span>
      </button>
    </main>
  );
};
