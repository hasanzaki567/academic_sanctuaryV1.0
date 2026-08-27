import React, { useState } from 'react';
import { Material, Subject } from '../types';
import { Search, Download, Upload, FileText, Bookmark, Check } from 'lucide-react';

interface NotesRepositoryViewProps {
  materials: Material[];
  subjects: Subject[];
  initialType?: string;
  savedMaterialIds?: string[];
  onPreviewMaterial?: (material: Material) => void;
  onDownloadMaterial: (material: Material) => void;
  onSaveMaterial?: (material: Material) => void;
  onAddToDrive?: (material: Material) => void;
  onOpenUpload: () => void;
}

export const NotesRepositoryView: React.FC<NotesRepositoryViewProps> = ({
  materials,
  subjects,
  initialType = 'all',
  savedMaterialIds = [],
  onDownloadMaterial,
  onSaveMaterial,
  onAddToDrive,
  onOpenUpload,
}) => {
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [localSavedIds, setLocalSavedIds] = useState<Record<string, boolean>>({});
  const [driveIds, setDriveIds] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  const isItemSaved = (id: string) => {
    if (localSavedIds[id] !== undefined) return localSavedIds[id];
    return savedMaterialIds.includes(id);
  };

  const handleSaveToggle = (item: Material) => {
    const currentlySaved = isItemSaved(item.id);
    setLocalSavedIds((prev) => ({ ...prev, [item.id]: !currentlySaved }));
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

  const filtered = materials.filter((m) => {
    if (selectedType === 'saved') {
      if (!isItemSaved(m.id)) return false;
    } else if (selectedType !== 'all' && m.type !== selectedType) {
      return false;
    }
    if (selectedSubject !== 'all' && m.subjectId !== selectedSubject && m.subjectCode !== selectedSubject) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        m.subjectName.toLowerCase().includes(q) ||
        m.subjectCode.toLowerCase().includes(q) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-10 pb-32 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Class Repository
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Notes & Study Materials
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Access lecture summaries, solved PYQs, revision guides, formula sheets, and your saved files.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-950/15 flex items-center gap-2 self-start md:self-auto cursor-pointer hover:scale-[1.02]"
        >
          <Upload className="w-4 h-4" /> Upload Material
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 md:p-5 mb-8 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
            {[
              { id: 'all', label: 'All' },
              { id: 'notes', label: 'Notes' },
              { id: 'materials', label: 'Slides' },
              { id: 'saved', label: 'Saved Files' },
              { id: 'pyqs', label: 'PYQs' },
              { id: 'important_questions', label: 'Important Qs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="paper-input p-2 rounded-xl text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} - {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keyword or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl text-[#0F172A] w-full"
          />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#93C5FD] transition-all group relative shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#EFF6FF] text-[#1E3A8A] px-2.5 py-0.5 rounded text-[11px] font-bold uppercase border border-[#BFDBFE]">
                    {item.subjectCode}
                  </span>
                  <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    {item.fileFormat}
                  </span>
                  {isItemSaved(item.id) && (
                    <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded border border-[#FDE68A] flex items-center gap-1">
                      <Bookmark className="w-3 h-3 fill-[#D97706]" /> Saved
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-[#64748B]">{item.fileSize}</span>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-snug mt-2">
                {item.title}
              </h3>

              <p className="text-xs text-[#D97706] font-semibold mt-1">{item.subjectName}</p>

              {item.description && (
                <p className="text-xs text-[#475569] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E2E8F0] overflow-hidden border border-[#CBD5E1]">
                  <img
                    src={item.uploadedBy.avatar}
                    alt={item.uploadedBy.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xs font-medium text-[#334155]">{item.uploadedBy.name}</span>
              </div>
              <span className="text-xs text-[#64748B]">{item.uploadedDate}</span>
            </div>

            {/* Hover actions: Save File, Add to Google Drive, Download */}
            <div className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-[2px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all rounded-2xl p-4">
              {/* Save File Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveToggle(item);
                }}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                  isItemSaved(item.id)
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    : 'bg-white text-[#1E3A8A] hover:bg-[#EFF6FF]'
                }`}
                title={isItemSaved(item.id) ? 'Saved to My Library' : 'Save File'}
              >
                <Bookmark className={`w-5 h-5 ${isItemSaved(item.id) ? 'fill-[#D97706]' : ''}`} />
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
                title="Download File"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs">
          {selectedType === 'saved' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Bookmark className="w-7 h-7 fill-[#D97706]" />
              </div>
              <h4 className="text-lg font-bold text-[#0F172A]">No Saved Files Yet</h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Click the bookmark icon on any study notes, lecture slides, or solved PYQs to save them here for offline access and quick revision.
              </p>
            </>
          ) : (
            <>
              <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-2" />
              <h4 className="text-lg font-bold text-[#0F172A]">No materials match your search</h4>
              <p className="text-xs text-[#64748B] mt-1">Try switching filters or uploading a new file.</p>
            </>
          )}
        </div>
      )}
    </main>
  );
};
