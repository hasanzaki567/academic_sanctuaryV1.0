import React, { useState, useMemo } from 'react';
import { Material, Subject } from '../types';
import {
  Search,
  Download,
  Eye,
  Upload,
  FileText,
  ArrowLeft,
  ArrowUpDown,
  Clock,
  Calendar,
  BookOpen,
  ChevronRight,
  Presentation,
  FileQuestion,
  HelpCircle,
  FolderCheck,
  Forward,
  MoreVertical,
  Plus,
} from 'lucide-react';

interface NotesRepositoryViewProps {
  materials: Material[];
  subjects: Subject[];
  onPreviewMaterial: (material: Material) => void;
  onDownloadMaterial: (material: Material) => void;
  onOpenUpload: (subjectId?: string) => void;
  onForwardMaterial: (material: Material) => void;
  onBack?: () => void;
}

type CategoryType = 'all' | 'notes' | 'slides' | 'pyqs' | 'important_questions';
type SortOption = 'uploaded-first' | 'uploaded-latest' | 'name' | 'popular';

export const NotesRepositoryView: React.FC<NotesRepositoryViewProps> = ({
  materials,
  subjects,
  onPreviewMaterial,
  onDownloadMaterial,
  onOpenUpload,
  onForwardMaterial,
  onBack,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [search, setSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('uploaded-first');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    material: Material;
  } | null>(null);

  // Close context menu on outside click or escape
  React.useEffect(() => {
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
    const menuWidth = 300;
    const menuHeight = 270;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 16);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 16);
    setContextMenu({ x, y, material });
  };

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

  // Compute materials count and breakdown for each subject
  const subjectStats = useMemo(() => {
    const statsMap = new Map<
      string,
      {
        total: number;
        notes: number;
        slides: number;
        pyqs: number;
        importantQs: number;
        earliestDate?: string;
        materials: Material[];
      }
    >();

    subjects.forEach((sub) => {
      const subMaterials = materials.filter(
        (m) => m.subjectId === sub.id || m.subjectCode === sub.code
      );
      const sortedByTime = [...subMaterials].sort(
        (a, b) => getMaterialUploadTime(a) - getMaterialUploadTime(b)
      );

      const notesCount = subMaterials.filter((m) => m.type === 'notes').length;
      const slidesCount = subMaterials.filter(
        (m) => m.type === 'slides' || m.type === 'materials' || m.fileFormat === 'PPTX'
      ).length;
      const pyqsCount = subMaterials.filter((m) => m.type === 'pyqs').length;
      const importantQsCount = subMaterials.filter(
        (m) => m.type === 'important_questions'
      ).length;

      statsMap.set(sub.id, {
        total: subMaterials.length,
        notes: notesCount,
        slides: slidesCount,
        pyqs: pyqsCount,
        importantQs: importantQsCount,
        earliestDate: sortedByTime[0]?.uploadedDate,
        materials: sortedByTime,
      });
    });

    return statsMap;
  }, [subjects, materials]);

  // Selected subject object
  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  // Filtered available subjects for the directory view
  const filteredSubjects = useMemo(() => {
    return subjects.filter((sub) => {
      if (subjectSearch.trim()) {
        const q = subjectSearch.toLowerCase();
        return (
          sub.name.toLowerCase().includes(q) ||
          sub.code.toLowerCase().includes(q) ||
          sub.professor.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [subjects, subjectSearch]);

  // Materials for the active selected subject
  const subjectMaterials = useMemo(() => {
    if (!currentSubject) return [];
    return materials.filter(
      (m) => m.subjectId === currentSubject.id || m.subjectCode === currentSubject.code
    );
  }, [materials, currentSubject]);

  // Global upload sequence ranking for selected subject (Earliest upload = #1)
  const uploadOrderMap = useMemo(() => {
    const allSorted = [...subjectMaterials].sort(
      (a, b) => getMaterialUploadTime(a) - getMaterialUploadTime(b)
    );
    const map = new Map<string, number>();
    allSorted.forEach((item, index) => {
      map.set(item.id, index + 1);
    });
    return map;
  }, [subjectMaterials]);

  // Filter materials for selected subject based on category & search
  const filteredMaterials = useMemo(() => {
    return subjectMaterials.filter((m) => {
      // Category filter matching the screenshot tabs
      if (activeCategory === 'notes' && m.type !== 'notes') return false;
      if (
        activeCategory === 'slides' &&
        m.type !== 'slides' &&
        m.type !== 'materials' &&
        m.fileFormat !== 'PPTX'
      )
        return false;
      if (activeCategory === 'pyqs' && m.type !== 'pyqs') return false;
      if (activeCategory === 'important_questions' && m.type !== 'important_questions')
        return false;

      // Text search
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          (m.unit && m.unit.toLowerCase().includes(q)) ||
          (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [subjectMaterials, activeCategory, search]);

  // Sort materials - By default arranged by which was uploaded first (earliest upload first)
  const sortedMaterials = useMemo(() => {
    return [...filteredMaterials].sort((a, b) => {
      if (sortBy === 'uploaded-first') {
        return getMaterialUploadTime(a) - getMaterialUploadTime(b);
      }
      if (sortBy === 'uploaded-latest') {
        return getMaterialUploadTime(b) - getMaterialUploadTime(a);
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'popular') {
        return b.downloadsCount - a.downloadsCount;
      }
      return 0;
    });
  }, [filteredMaterials, sortBy]);

  // Exact categories as seen in user's uploaded image:
  // [ All ]   [ Notes ]   [ Slides ]   [ PYQs ]   [ Important Qs ]
  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'notes', label: 'Notes' },
    { id: 'slides', label: 'Slides' },
    { id: 'pyqs', label: 'PYQs' },
    { id: 'important_questions', label: 'Important Qs' },
  ];

  // ==========================================
  // VIEW 1: AVAILABLE SUBJECTS DIRECTORY
  // ==========================================
  if (!currentSubject) {
    return (
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 pb-32 min-h-screen">
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#56615a] uppercase tracking-wider bg-[#56615a]/10 px-2.5 py-0.5 rounded-full border border-[#56615a]/20">
                <BookOpen className="w-3 h-3 text-[#56615a]" /> Available Course Notes
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] tracking-tight">
              Subject Notes & Study Directory
            </h1>
            <p className="text-sm text-[#434844] mt-1 max-w-2xl">
              Choose a subject below to browse its complete repository of lecture notes, presentation slides, solved PYQs, and high-yield exam questions.
            </p>
          </div>

          <button
            onClick={() => onOpenUpload()}
            className="inline-flex items-center gap-2 bg-[#56615a] hover:bg-[#434d46] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer self-start md:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        </div>

        {/* Search and Summary Bar */}
        <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-4 md:p-5 mb-8 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search available subjects by name or code (e.g. CS301)..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              className="paper-input text-xs pl-9 pr-4 py-2.5 rounded-xl w-full text-[#1b1c1c] placeholder:text-[#737874]"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-[#737874] px-1">
            <FolderCheck className="w-4 h-4 text-[#56615a]" />
            <span>
              <strong>{subjects.length}</strong> Courses registered &bull; <strong>{materials.length}</strong> Total documents uploaded
            </span>
          </div>
        </div>

        {/* Available Subjects Horizontal Rectangles List */}
        <div className="flex flex-col gap-3.5">
          {filteredSubjects.map((sub) => {
            const stats = subjectStats.get(sub.id) || {
              total: 0,
              notes: 0,
              slides: 0,
              pyqs: 0,
              importantQs: 0,
              earliestDate: undefined,
              materials: [],
            };

            const hasNotes = stats.total > 0;

            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setActiveCategory('all');
                  setSearch('');
                }}
                className="bg-[#FEFEFA] border border-[#E5E4E2] hover:border-[#56615a] rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-sm group cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden"
              >
                {/* Accent indicator line */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#56615a] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Left Info: Code, Subject Title, Instructor, Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="bg-[#b2beb5]/25 text-[#434844] px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                      {sub.code}
                    </span>

                    {hasNotes ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#56615a] bg-[#56615a]/10 px-2.5 py-0.5 rounded-full border border-[#56615a]/15">
                        <FolderCheck className="w-3 h-3" />
                        {stats.total} {stats.total === 1 ? 'Material' : 'Materials'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#737874] bg-[#F0EDED] px-2.5 py-0.5 rounded-full">
                        No uploads yet
                      </span>
                    )}

                    {stats.earliestDate && (
                      <span className="text-[11px] text-[#737874] flex items-center gap-1 ml-auto lg:ml-0">
                        <Clock className="w-3 h-3 text-[#737874]" /> First upload: {stats.earliestDate}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#1b1c1c] group-hover:text-[#56615a] transition-colors leading-tight">
                    {sub.name}
                  </h3>

                  <p className="text-xs text-[#737874] mt-1.5 font-medium flex items-center gap-1.5 flex-wrap">
                    <span>Instructor: <strong className="text-[#434844]">{sub.professor}</strong></span>
                    {sub.description && (
                      <>
                        <span className="text-[#DCDAD6] hidden sm:inline">&bull;</span>
                        <span className="text-[#56615a] truncate max-w-xl">{sub.description}</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Middle: Clean non-congested count pills */}
                <div className="flex items-center flex-wrap gap-2 py-2 lg:py-0 border-y lg:border-y-0 lg:border-x border-[#F0EDED] px-0 lg:px-6 flex-shrink-0">
                  <div className="flex items-center gap-1.5 bg-[#F6F3F2] px-3 py-1.5 rounded-lg text-xs">
                    <FileText className="w-3.5 h-3.5 text-[#56615a]" />
                    <span className="font-bold text-[#1b1c1c]">{stats.notes}</span>
                    <span className="text-[#737874]">Notes</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F6F3F2] px-3 py-1.5 rounded-lg text-xs">
                    <Presentation className="w-3.5 h-3.5 text-amber-700" />
                    <span className="font-bold text-[#1b1c1c]">{stats.slides}</span>
                    <span className="text-[#737874]">Slides</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F6F3F2] px-3 py-1.5 rounded-lg text-xs">
                    <FileQuestion className="w-3.5 h-3.5 text-indigo-700" />
                    <span className="font-bold text-[#1b1c1c]">{stats.pyqs}</span>
                    <span className="text-[#737874]">PYQs</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F6F3F2] px-3 py-1.5 rounded-lg text-xs">
                    <HelpCircle className="w-3.5 h-3.5 text-rose-700" />
                    <span className="font-bold text-[#1b1c1c]">{stats.importantQs}</span>
                    <span className="text-[#737874]">Imp Qs</span>
                  </div>
                </div>

                {/* Right Action: Button */}
                <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0">
                  <button className="px-4 py-2.5 bg-[#56615a] group-hover:bg-[#434d46] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer">
                    <span>Open Subject Notes</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#E5E4E2] rounded-2xl p-8 mt-6">
            <BookOpen className="w-12 h-12 text-[#737874] mx-auto mb-2" />
            <h4 className="text-lg font-bold text-[#1b1c1c]">No subjects matched "{subjectSearch}"</h4>
            <p className="text-xs text-[#737874] mt-1">Try searching by course code like CS301 or course title.</p>
          </div>
        )}
      </main>
    );
  }

  // =========================================================================
  // VIEW 2: SUBJECT NOTES VIEW (Chronologically arranged by uploaded first)
  // With exact category bar: [ All ] [ Notes ] [ Slides ] [ PYQs ] [ Important Qs ]
  // =========================================================================
  return (
    <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 pb-32 min-h-screen">
      {/* Top Navigation & Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#434844] hover:text-[#1b1c1c] text-xs font-bold transition-colors cursor-pointer"
              title="Back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <button
            onClick={() => setSelectedSubjectId(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#56615a] hover:text-[#1b1c1c] bg-[#F6F3F2] hover:bg-[#EAE6E4] px-3.5 py-2 rounded-xl border border-[#E5E4E2] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Available Subjects</span>
          </button>
        </div>

        {/* Quick subject switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#737874] font-medium hidden sm:inline">Switch Subject:</span>
          <select
            value={currentSubject.id}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setActiveCategory('all');
              setSearch('');
            }}
            className="bg-[#FEFEFA] border border-[#E5E4E2] text-xs font-bold text-[#1b1c1c] rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Header Banner */}
      <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-6 md:p-8 mb-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#b2beb5]/25 text-[#434844] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                {currentSubject.code}
              </span>
              <span className="text-xs text-[#737874] font-semibold">
                Instructor: {currentSubject.professor}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] tracking-tight">
              {currentSubject.name}
            </h1>
            <p className="text-xs md:text-sm text-[#434844] mt-1.5 max-w-3xl leading-relaxed">
              {currentSubject.description ||
                `Study materials, notes, presentations, and past exam questions for ${currentSubject.name}. All documents below are chronologically ordered by initial upload.`}
            </p>
          </div>

          <button
            onClick={() => onOpenUpload(currentSubject.id)}
            className="inline-flex items-center gap-2 bg-[#56615a] hover:bg-[#434d46] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer self-start md:self-auto shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload for {currentSubject.code}</span>
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* EXACT SECTION REQUESTED:                                */}
      {/* [ All ]   [ Notes ]   [ Slides ]   [ PYQs ]   [ Important Qs ] */}
      {/* ======================================================= */}
      <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-4 md:p-5 mb-6 shadow-xs flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          {/* Exact pill group from user screenshot */}
          <div className="bg-[#F0EDED] p-1 rounded-full border border-[#E5E4E2] inline-flex items-center gap-1 shadow-2xs overflow-x-auto hide-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#1b1c1c] shadow-xs'
                      : 'text-[#737874] hover:text-[#1b1c1c]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort selector defaulting to uploaded first */}
          <div className="flex items-center gap-1.5 bg-[#F6F3F2] px-3 py-1.5 rounded-full border border-[#E5E4E2]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#56615a]" />
            <span className="text-[11px] font-bold text-[#737874]">Order:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs font-bold text-[#1b1c1c] focus:outline-none cursor-pointer pr-1"
            >
              <option value="uploaded-first">Uploaded First (Earliest)</option>
              <option value="uploaded-latest">Uploaded Last (Newest)</option>
              <option value="name">Title (A - Z)</option>
              <option value="popular">Most Downloaded</option>
            </select>
          </div>
        </div>

        {/* Search inside this subject's materials */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${currentSubject.code} notes or topics...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl w-full text-[#1b1c1c] placeholder:text-[#737874]"
          />
        </div>
      </div>

      {/* Sorting Status Badge & Right-Click Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#56615a]/10 text-[#434844] text-xs font-bold border border-[#56615a]/15">
            <Clock className="w-3.5 h-3.5 text-[#56615a]" />
            {sortBy === 'uploaded-first' ? (
              <span>Arranged by Upload Order: <strong>Uploaded First (Earliest)</strong></span>
            ) : sortBy === 'uploaded-latest' ? (
              <span>Arranged by Upload Order: <strong>Uploaded Last (Newest)</strong></span>
            ) : sortBy === 'name' ? (
              <span>Arranged Alphabetically (A - Z)</span>
            ) : (
              <span>Arranged by Most Downloaded</span>
            )}
          </span>
          <span className="text-xs text-[#737874]">
            ({sortedMaterials.length} {sortedMaterials.length === 1 ? 'document' : 'documents'})
          </span>

          {/* User Hint about Right-Click */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#56615a] bg-[#d9e6dc]/40 px-2.5 py-0.5 rounded-full border border-[#b2beb5]/40 font-medium">
            💡 Right-click any note to <strong>Download</strong>, <strong>View</strong>, or <strong>Forward</strong>
          </span>
        </div>

        {sortBy !== 'uploaded-first' && (
          <button
            onClick={() => setSortBy('uploaded-first')}
            className="text-xs text-[#56615a] hover:underline font-bold cursor-pointer"
          >
            ← Reset to Uploaded First
          </button>
        )}
      </div>

      {/* Materials Horizontal Rectangles List for the Selected Subject */}
      {sortedMaterials.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E5E4E2] rounded-2xl p-8 flex flex-col items-center">
          <BookOpen className="w-12 h-12 text-[#737874] mb-3" />
          <h4 className="text-base font-bold text-[#1b1c1c]">No materials available in this section</h4>
          <p className="text-xs text-[#737874] max-w-sm mt-1 mb-4">
            {search
              ? `No documents matched "${search}". Try a different keyword.`
              : `There are currently no materials in ${activeCategory === 'all' ? currentSubject.name : activeCategory}. Be the first to contribute!`}
          </p>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Material to {currentSubject.code}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedMaterials.map((item) => {
          const uploadRank = uploadOrderMap.get(item.id);
          const isPresentation = item.type === 'slides' || item.fileFormat === 'PPTX';
          const isPyq = item.type === 'pyqs';
          const isImportant = item.type === 'important_questions';

          return (
            <div
              key={item.id}
              id={`material-card-${item.id}`}
              onContextMenu={(e) => handleContextMenu(e, item)}
              className="bg-[#FEFEFA] border border-[#E5E4E2] hover:border-[#56615a] rounded-2xl p-4 md:p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group relative select-text"
            >
              {/* Left Column: Format icon + Detailed Metadata */}
              <div 
                className="flex items-start md:items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                onClick={() => onPreviewMaterial(item)}
              >
                {/* Format Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[#F6F3F2] border border-[#E5E4E2] flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-[#56615a]/10 transition-colors">
                  {isPresentation ? (
                    <Presentation className="w-5 h-5 text-amber-700" />
                  ) : isPyq ? (
                    <FileQuestion className="w-5 h-5 text-indigo-700" />
                  ) : isImportant ? (
                    <HelpCircle className="w-5 h-5 text-rose-700" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#56615a]" />
                  )}
                  <span className="text-[9px] font-black uppercase text-[#737874] tracking-tight mt-0.5">
                    {item.fileFormat || 'PDF'}
                  </span>
                </div>

                {/* Content info */}
                <div className="min-w-0 flex-1">
                  {/* Badges line */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="bg-[#b2beb5]/25 text-[#434844] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                      {item.subjectCode}
                    </span>

                    {isPresentation ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Presentation className="w-2.5 h-2.5" /> Slides
                      </span>
                    ) : isPyq ? (
                      <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FileQuestion className="w-2.5 h-2.5" /> PYQs
                      </span>
                    ) : isImportant ? (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <HelpCircle className="w-2.5 h-2.5" /> Important Qs
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#434844] bg-[#F0EDED] border border-[#E5E4E2] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FileText className="w-2.5 h-2.5" /> Notes
                      </span>
                    )}

                    {uploadRank && (
                      <span
                        className="bg-[#56615a]/10 text-[#56615a] border border-[#56615a]/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight"
                        title={`Uploaded #${uploadRank} in ${currentSubject.name}`}
                      >
                        #{uploadRank} Uploaded
                      </span>
                    )}

                    {item.unit && (
                      <span className="text-[10px] font-semibold text-[#56615a] bg-[#56615a]/10 px-2 py-0.5 rounded">
                        {item.unit}
                      </span>
                    )}

                    <span className="text-xs text-[#737874]">&bull; {item.fileSize}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-bold text-[#1b1c1c] group-hover:text-[#56615a] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Uploader, Date and Description line */}
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

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#737874]" />
                      {item.uploadedDate}
                    </span>

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

              {/* Right Column: Clean action buttons + Forward + Context Menu Trigger */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EDED] w-full md:w-auto justify-end">
                <button
                  id={`preview-btn-${item.id}`}
                  onClick={() => onPreviewMaterial(item)}
                  className="px-3.5 py-2 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="Read / Preview notes"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  id={`download-btn-${item.id}`}
                  onClick={() => onDownloadMaterial(item)}
                  className="px-3 py-2 bg-[#F6F3F2] hover:bg-[#EAE7E6] text-[#434844] text-xs font-semibold rounded-xl transition-colors border border-[#E5E4E2] flex items-center gap-1.5 cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5 text-[#56615a]" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  id={`forward-btn-${item.id}`}
                  onClick={() => onForwardMaterial(item)}
                  className="px-3 py-2 bg-[#008069]/10 hover:bg-[#008069]/20 text-[#008069] text-xs font-bold rounded-xl transition-colors border border-[#008069]/20 flex items-center gap-1.5 cursor-pointer"
                  title="Forward to Cohort Chat (Direct or Groups)"
                >
                  <Forward className="w-3.5 h-3.5 text-[#008069]" />
                  <span>Forward</span>
                </button>
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
          );
        })}
      </div>
      )}

      {/* Right-click / Options Context Menu with Exact 3 Options */}
      {contextMenu && (
        <div
          id="material-rightclick-context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-72 sm:w-80 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-[#E5E4E2] p-2.5 sm:p-3 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header Info */}
          <div className="px-3 py-2.5 border-b-2 border-[#F0EDED] mb-2">
            <p className="text-sm sm:text-base font-extrabold text-[#1b1c1c] truncate">
              {contextMenu.material.title}
            </p>
            <div className="text-xs text-[#737874] flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-bold text-[#56615a] bg-[#d9e6dc] px-2 py-0.5 rounded-md">
                {contextMenu.material.subjectCode}
              </span>
              <span>&bull;</span>
              <span>{contextMenu.material.fileSize}</span>
              <span>&bull;</span>
              <span className="uppercase font-bold text-[#1b1c1c]">{contextMenu.material.fileFormat}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {/* Option 1: Download */}
            <button
              id="context-option-download"
              onClick={() => {
                onDownloadMaterial(contextMenu.material);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3.5 p-3 text-sm sm:text-base font-bold text-[#1b1c1c] hover:bg-[#F6F4F0] rounded-2xl transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F6F4F0] group-hover:bg-[#E5E4E2] flex items-center justify-center text-[#56615a] transition-colors flex-shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-[#1b1c1c] block">Download File</span>
                <p className="text-xs text-[#737874] font-medium mt-0.5">Save document directly to device</p>
              </div>
            </button>

            {/* Option 2: View */}
            <button
              id="context-option-view"
              onClick={() => {
                onPreviewMaterial(contextMenu.material);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3.5 p-3 text-sm sm:text-base font-bold text-[#1b1c1c] hover:bg-[#F6F4F0] rounded-2xl transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F6F4F0] group-hover:bg-[#E5E4E2] flex items-center justify-center text-[#56615a] transition-colors flex-shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-[#1b1c1c] block">Open & Preview</span>
                <p className="text-xs text-[#737874] font-medium mt-0.5">Read study notes and syllabus</p>
              </div>
            </button>

            {/* Option 3: Forward */}
            <button
              id="context-option-forward"
              onClick={() => {
                onForwardMaterial(contextMenu.material);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3.5 p-3 text-sm sm:text-base font-bold text-[#008069] hover:bg-[#008069]/10 rounded-2xl transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#008069]/15 group-hover:bg-[#008069]/25 flex items-center justify-center text-[#008069] transition-colors flex-shrink-0">
                <Forward className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-[#008069] block">Forward to Chat</span>
                <p className="text-xs text-[#008069]/80 font-medium mt-0.5">
                  Share with classmates or groups
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {sortedMaterials.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E5E4E2] rounded-2xl p-8 mt-4">
          <FileText className="w-12 h-12 text-[#737874] mx-auto mb-2" />
          <h4 className="text-lg font-bold text-[#1b1c1c]">No materials in this category</h4>
          <p className="text-xs text-[#737874] mt-1 max-w-md mx-auto">
            There are currently no documents matching "{activeCategory}" for {currentSubject.name}.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-[#56615a] hover:underline"
            >
              Show All Materials
            </button>
            <span className="text-[#C3C8C3]">&bull;</span>
            <button
              onClick={() => onOpenUpload(currentSubject.id)}
              className="text-xs font-bold bg-[#56615a] text-white px-3 py-1.5 rounded-lg hover:bg-[#434d46]"
            >
              Upload Material Now
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
