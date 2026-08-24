import React, { useState } from 'react';
import { Material, Subject, MaterialType } from '../types';
import { Search, Filter, Download, Eye, Upload, Tag, FileText } from 'lucide-react';

interface NotesRepositoryViewProps {
  materials: Material[];
  subjects: Subject[];
  onPreviewMaterial: (material: Material) => void;
  onDownloadMaterial: (material: Material) => void;
  onOpenUpload: () => void;
}

export const NotesRepositoryView: React.FC<NotesRepositoryViewProps> = ({
  materials,
  subjects,
  onPreviewMaterial,
  onDownloadMaterial,
  onOpenUpload,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = materials.filter((m) => {
    if (selectedType !== 'all' && m.type !== selectedType) return false;
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
          <span className="text-xs font-bold text-[#737874] uppercase tracking-wider">
            Class Repository
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
            Notes & Study Materials
          </h1>
          <p className="text-sm text-[#434844] mt-1">
            Access lecture summaries, solved PYQs, revision guides, and formula sheets.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Upload Material
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-4 md:p-5 mb-8 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-[#F6F3F2] p-1 rounded-xl border border-[#E5E4E2]">
            {[
              { id: 'all', label: 'All' },
              { id: 'notes', label: 'Notes' },
              { id: 'materials', label: 'Slides' },
              { id: 'pyqs', label: 'PYQs' },
              { id: 'important_questions', label: 'Important Qs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-white text-[#1b1c1c] shadow-xs'
                    : 'text-[#737874] hover:text-[#1b1c1c]'
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
            className="paper-input p-2 rounded-xl text-xs font-semibold text-[#1b1c1c] border border-[#E5E4E2] bg-[#F6F3F2]"
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
          <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keyword or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl text-[#1b1c1c] w-full"
          />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-6 flex flex-col justify-between hover:border-[#bdc9c0] transition-all group relative shadow-[0_4px_20px_rgba(51,51,51,0.02)] hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#b2beb5]/25 text-[#434844] px-2.5 py-0.5 rounded text-[11px] font-bold uppercase">
                    {item.subjectCode}
                  </span>
                  <span className="text-[11px] font-semibold text-[#737874] bg-[#F0EDED] px-2 py-0.5 rounded">
                    {item.fileFormat}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#737874]">{item.fileSize}</span>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[#1b1c1c] group-hover:text-[#56615a] transition-colors leading-snug mt-2">
                {item.title}
              </h3>

              <p className="text-xs text-[#737874] mt-0.5">{item.subjectName}</p>

              {item.description && (
                <p className="text-xs text-[#434844] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E2E1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#F0EDED] overflow-hidden border border-[#C3C8C3]/50">
                  <img
                    src={item.uploadedBy.avatar}
                    alt={item.uploadedBy.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xs text-[#737874]">{item.uploadedBy.name}</span>
              </div>
              <span className="text-xs text-[#737874]">{item.uploadedDate}</span>
            </div>

            {/* Hover actions */}
            <div className="absolute inset-0 bg-[#F6F3F2]/90 backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all rounded-2xl p-4">
              <button
                onClick={() => onPreviewMaterial(item)}
                className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#56615a] hover:bg-[#F0EDED] transition-colors cursor-pointer"
                title="Preview"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDownloadMaterial(item)}
                className="w-12 h-12 bg-[#56615a] text-white rounded-full shadow-md flex items-center justify-center hover:bg-[#434d46] transition-colors cursor-pointer"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E5E4E2] rounded-2xl p-8">
          <FileText className="w-12 h-12 text-[#737874] mx-auto mb-2" />
          <h4 className="text-lg font-bold text-[#1b1c1c]">No materials match your search</h4>
          <p className="text-xs text-[#737874] mt-1">Try switching filters or uploading a new file.</p>
        </div>
      )}
    </main>
  );
};
