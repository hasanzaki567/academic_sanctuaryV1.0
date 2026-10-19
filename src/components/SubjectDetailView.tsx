import React, { useState, useEffect } from 'react';
import { Subject, Material, MaterialType } from '../types';
import { Download, Eye, Plus, Search, BookOpen, FileCheck, CheckCircle2, Forward, MoreVertical, ArrowLeft } from 'lucide-react';

interface SubjectDetailViewProps {
  subject: Subject;
  materials: Material[];
  onOpenUpload: (subjectId?: string) => void;
  onPreviewMaterial: (material: Material) => void;
  onDownloadMaterial: (material: Material) => void;
  onForwardMaterial?: (material: Material) => void;
  onBack?: () => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  materials,
  onOpenUpload,
  onPreviewMaterial,
  onDownloadMaterial,
  onForwardMaterial,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    material: Material;
  } | null>(null);

  useEffect(() => {
    const handleClose = () => setContextMenu(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    if (contextMenu) {
      window.addEventListener('click', handleClose);
      window.addEventListener('contextmenu', handleClose);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('contextmenu', handleClose);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, material: Material) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 210;
    const menuHeight = 175;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 12);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 12);
    setContextMenu({ x, y, material });
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'notes', label: 'Notes' },
    { id: 'slides', label: 'Slides' },
    { id: 'pyqs', label: 'PYQs' },
    { id: 'important_questions', label: 'Important Qs' },
  ];

  // Helper to extract numeric timestamp of upload
  const getMaterialUploadTime = (m: Material): number => {
    if (m.createdAt) return m.createdAt;
    if (m.uploadedDate) {
      const parsed = Date.parse(m.uploadedDate);
      if (!isNaN(parsed)) return parsed;
    }
    if (m.id && m.id.startsWith('mat-')) {
      const num = parseInt(m.id.replace('mat-', ''), 10);
      if (!isNaN(num) && num > 1000) return num;
      if (!isNaN(num)) return num * 100000;
    }
    return 0;
  };

  // Filter and arrange materials based on current active tab, search query, and which was uploaded first
  const sortedMaterials = [...materials]
    .filter((m) => {
      const matchesSubject = m.subjectId === subject.id || m.subjectCode === subject.code;
      if (!matchesSubject) return false;

      if (activeTab === 'notes' && m.type !== 'notes') return false;
      if (
        activeTab === 'slides' &&
        m.type !== 'slides' &&
        m.type !== 'materials' &&
        m.fileFormat !== 'PPTX'
      )
        return false;
      if (activeTab === 'pyqs' && m.type !== 'pyqs') return false;
      if (activeTab === 'important_questions' && m.type !== 'important_questions')
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      return true;
    })
    // Arranged based on which is uploaded first (earliest uploaded first)
    .sort((a, b) => getMaterialUploadTime(a) - getMaterialUploadTime(b));

  return (
    <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 pt-6 md:pt-8 pb-32 min-h-screen">
      {/* Back button */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#434844] hover:text-[#1b1c1c] text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Previous Screen</span>
          </button>
        </div>
      )}

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

      {/* Pill tabs matching user screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-[#FEFEFA] border border-[#E5E4E2] p-4 rounded-2xl shadow-xs">
        <div className="bg-[#F0EDED] p-1 rounded-full border border-[#E5E4E2] inline-flex items-center gap-1 shadow-2xs overflow-x-auto hide-scrollbar self-start">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#1b1c1c] shadow-xs'
                    : 'text-[#737874] hover:text-[#1b1c1c]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topic or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="paper-input text-xs pl-9 pr-3 py-1.5 rounded-xl w-full text-[#1b1c1c]"
            />
          </div>
        </div>
      </div>

      {/* Content Area: Notes List as Clean Horizontal Rectangles */}
      <div className="flex flex-col gap-3">
        {sortedMaterials.map((item, index) => (
          <div
            key={item.id}
            id={`subject-material-card-${item.id}`}
            onContextMenu={(e) => handleContextMenu(e, item)}
            className="bg-[#FEFEFA] border border-[#E5E4E2] hover:border-[#56615a] rounded-2xl p-4 md:p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group relative select-text"
          >
            {/* Left Info: Icon & Metadata */}
            <div 
              className="flex items-start md:items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
              onClick={() => onPreviewMaterial(item)}
            >
              <div className="w-12 h-12 rounded-xl bg-[#F6F3F2] border border-[#E5E4E2] flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-[#56615a]/10 transition-colors">
                <span
                  className="material-symbols-outlined text-[#56615a] text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  description
                </span>
                <span className="text-[9px] font-black uppercase text-[#737874] tracking-tight mt-0.5">
                  {item.fileFormat || 'PDF'}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-bold text-[#434844] bg-[#F0EDED] px-2 py-0.5 rounded">
                    {item.fileFormat}
                  </span>
                  <span className="bg-[#56615a]/10 text-[#56615a] border border-[#56615a]/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight">
                    #{index + 1} Uploaded
                  </span>
                  {item.unit && (
                    <span className="text-[11px] font-medium text-[#737874] bg-[#F6F3F2] px-2 py-0.5 rounded">
                      {item.unit}
                    </span>
                  )}
                  <span className="text-xs font-medium text-[#737874]">&bull; {item.fileSize}</span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-[#1b1c1c] leading-snug group-hover:text-[#56615a] transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2.5 text-xs text-[#737874] mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#F0EDED] overflow-hidden border border-[#C3C8C3]/50">
                      <img
                        src={item.uploadedBy.avatar}
                        alt={item.uploadedBy.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[#434844] font-medium">{item.uploadedBy.name}</span>
                  </div>
                  <span>&bull;</span>
                  <span>{item.uploadedDate}</span>
                  {item.description && (
                    <>
                      <span className="hidden lg:inline text-[#DCDAD6]">&bull;</span>
                      <span className="hidden lg:inline text-[#737874] truncate max-w-md">
                        {item.description}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Direct Action Buttons + Forward + More Options */}
            <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EDED] w-full md:w-auto justify-end">
              <button
                id={`preview-btn-${item.id}`}
                onClick={() => onPreviewMaterial(item)}
                className="px-3.5 py-2 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Preview Document & Notes"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
              <button
                id={`download-btn-${item.id}`}
                onClick={() => onDownloadMaterial(item)}
                className="px-3 py-2 bg-[#F6F3F2] hover:bg-[#EAE7E6] text-[#434844] text-xs font-semibold rounded-xl transition-colors border border-[#E5E4E2] flex items-center gap-1.5 cursor-pointer"
                title="Download Study Material"
              >
                <Download className="w-3.5 h-3.5 text-[#56615a]" />
                <span className="hidden sm:inline">Download</span>
              </button>
              {onForwardMaterial && (
                <button
                  id={`forward-btn-${item.id}`}
                  onClick={() => onForwardMaterial(item)}
                  className="px-3 py-2 bg-[#008069]/10 hover:bg-[#008069]/20 text-[#008069] text-xs font-bold rounded-xl transition-colors border border-[#008069]/20 flex items-center gap-1.5 cursor-pointer"
                  title="Forward to Cohort Chat (Direct or Groups)"
                >
                  <Forward className="w-3.5 h-3.5 text-[#008069]" />
                  <span>Forward</span>
                </button>
              )}
              <button
                id={`options-btn-${item.id}`}
                onClick={(e) => handleContextMenu(e, item)}
                className="p-2 text-[#737874] hover:text-[#1b1c1c] hover:bg-[#F0EDED] rounded-xl transition-colors cursor-pointer"
                title="More actions (Download, View, Forward)"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right-click Context Menu */}
      {contextMenu && (
        <div
          id="subject-material-context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#E5E4E2] p-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-[#F0EDED] mb-1">
            <p className="text-xs font-bold text-[#1b1c1c] truncate">
              {contextMenu.material.title}
            </p>
            <div className="text-[10px] text-[#737874] flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-[#56615a]">
                {contextMenu.material.subjectCode}
              </span>
              <span>&bull;</span>
              <span>{contextMenu.material.fileSize}</span>
              <span>&bull;</span>
              <span className="uppercase font-medium">{contextMenu.material.fileFormat}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            {/* Option 1: Download */}
            <button
              id="sub-context-download"
              onClick={() => {
                onDownloadMaterial(contextMenu.material);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1b1c1c] hover:bg-[#F6F4F0] rounded-xl transition-colors text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#F6F4F0] group-hover:bg-[#E5E4E2] flex items-center justify-center text-[#56615a] transition-colors">
                <Download className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold">Download</span>
                <p className="text-[10px] text-[#737874] font-normal">Save file to device</p>
              </div>
            </button>

            {/* Option 2: View */}
            <button
              id="sub-context-view"
              onClick={() => {
                onPreviewMaterial(contextMenu.material);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1b1c1c] hover:bg-[#F6F4F0] rounded-xl transition-colors text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#F6F4F0] group-hover:bg-[#E5E4E2] flex items-center justify-center text-[#56615a] transition-colors">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold">View</span>
                <p className="text-[10px] text-[#737874] font-normal">Read & preview in reader</p>
              </div>
            </button>

            {/* Option 3: Forward */}
            {onForwardMaterial && (
              <button
                id="sub-context-forward"
                onClick={() => {
                  onForwardMaterial(contextMenu.material);
                  setContextMenu(null);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#008069] hover:bg-[#008069]/10 rounded-xl transition-colors text-left cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#008069]/15 group-hover:bg-[#008069]/25 flex items-center justify-center text-[#008069] transition-colors">
                  <Forward className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-[#008069]">Forward</span>
                  <p className="text-[10px] text-[#008069]/80 font-normal">
                    Share to multiple classmates or groups
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {sortedMaterials.length === 0 && (
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
