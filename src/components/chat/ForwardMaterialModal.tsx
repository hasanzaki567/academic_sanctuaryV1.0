import React, { useState } from 'react';
import { Material, ForwardedMaterialInfo } from '../../types';
import { X, Search, FileText, Send, BookOpen, Filter } from 'lucide-react';

interface ForwardMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  onForward: (materialInfo: ForwardedMaterialInfo) => void;
}

export const ForwardMaterialModal: React.FC<ForwardMaterialModalProps> = ({
  isOpen,
  onClose,
  materials,
  onForward,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  if (!isOpen) return null;

  const subjectsList = Array.from(new Set(materials.map((m) => m.subjectName)));

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      m.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || m.subjectName === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleSelect = (mat: Material) => {
    const forwardedInfo: ForwardedMaterialInfo = {
      id: mat.id,
      title: mat.title,
      subjectCode: mat.subjectCode,
      subjectName: mat.subjectName,
      type: mat.type,
      fileFormat: mat.fileFormat,
      fileSize: mat.fileSize,
      snippet: mat.contentSnippet || `${mat.title} - Shared from Academic Sanctuary Library.`,
    };
    onForward(forwardedInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="forward-material-modal"
        className="w-full max-w-2xl bg-[#FEFEFA] rounded-3xl shadow-2xl border-2 border-[#E5E4E2] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#F0EDED] bg-[#F9F8F6]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#56615a]/15 text-[#56615a] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-[#56615a]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1b1c1c]">Forward Study Material</h3>
              <p className="text-xs sm:text-sm text-[#56615a] font-medium">Select notes, slides, or PYQs to share in classroom discussion</p>
            </div>
          </div>
          <button
            id="close-forward-modal-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#737874] hover:text-[#1b1c1c] hover:bg-[#E5E4E2] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-5 border-b-2 border-[#F0EDED] bg-[#FEFEFA] flex flex-col gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-[#737874] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-materials-input"
              type="text"
              placeholder="Search by title, subject or course code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F6F4F0] border-2 border-[#D8DCD6] rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] focus:outline-none focus:border-[#56615a] placeholder:text-[#919692]"
            />
          </div>

          {subjectsList.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSubject === 'all'
                    ? 'bg-[#56615a] text-white shadow-xs'
                    : 'bg-[#F0EDED] text-[#434844] hover:bg-[#E4E2E1]'
                }`}
              >
                All Subjects
              </button>
              {subjectsList.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-[#56615a] text-white shadow-xs'
                      : 'bg-[#F0EDED] text-[#434844] hover:bg-[#E4E2E1]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-14 text-[#737874]">
              <FileText className="w-12 h-12 mx-auto text-[#b2beb5] mb-2.5" />
              <p className="text-base font-bold text-[#1b1c1c]">No study materials found</p>
              <p className="text-xs sm:text-sm mt-1">Try another search keyword or subject filter</p>
            </div>
          ) : (
            filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="flex items-center justify-between gap-3.5 group hover:bg-[#F9F8F6] p-3.5 rounded-2xl border-2 border-transparent hover:border-[#E5E4E2] transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0EDED] flex items-center justify-center flex-shrink-0 text-[#56615a] font-black text-xs sm:text-sm border-2 border-[#E5E4E2]">
                    {mat.fileFormat}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-[#1b1c1c] truncate">{mat.title}</h4>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#56615a] font-medium mt-0.5">
                      <span className="font-bold text-[#344037]">{mat.subjectCode}</span>
                      <span>•</span>
                      <span>{mat.fileSize}</span>
                      <span>•</span>
                      <span className="capitalize">{mat.type}</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`forward-material-${mat.id}`}
                  onClick={() => handleSelect(mat)}
                  className="px-4 py-2.5 rounded-xl bg-[#56615a] hover:bg-[#434d46] text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-colors flex-shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Forward</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
