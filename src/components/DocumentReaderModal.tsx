import React, { useState } from 'react';
import { Material } from '../types';
import { X, Download, Share2, Bookmark, Check, Copy, BookOpen, ThumbsUp } from 'lucide-react';

interface DocumentReaderModalProps {
  material: Material | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (material: Material) => void;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  material,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!isOpen || !material) return null;

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(material.downloadsCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FEFEFA] border-2 border-[#E5E4E2] rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-[#F0EDED] bg-[#FDFCF8] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#1b1c1c] text-xs sm:text-sm font-bold transition-colors cursor-pointer flex-shrink-0 border border-[#E5E4E2]"
              title="Return to materials"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back</span>
            </button>
            <span className="bg-[#d9e6dc] text-[#37413a] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase flex-shrink-0 border border-[#b2beb5]">
              {material.subjectCode}
            </span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-[#1b1c1c] leading-tight truncate">
                {material.title}
              </h2>
              <div className="text-xs sm:text-sm text-[#56615a] font-medium flex items-center gap-2 mt-0.5 truncate">
                <span className="font-bold">{material.fileFormat} • {material.fileSize}</span>
                <span>•</span>
                <span>Uploaded by {material.uploadedBy.name} ({material.uploadedDate})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-colors cursor-pointer ${
                bookmarked
                  ? 'bg-[#d6e7a1]/50 border-[#56642b] text-[#56642b]'
                  : 'border-[#E5E4E2] text-[#737874] hover:bg-[#F0EDED]'
              }`}
              title="Bookmark Note"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2.5 sm:p-3 rounded-2xl border-2 border-[#E5E4E2] text-[#737874] hover:bg-[#F0EDED] transition-colors cursor-pointer"
              title="Share"
            >
              {copied ? <Check className="w-5 h-5 text-[#56642b]" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 sm:p-3 rounded-2xl text-[#737874] hover:text-[#1b1c1c] hover:bg-[#F0EDED] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Document Content Canvas */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-[#FDFCF8] font-sans">
          {material.description && (
            <div className="bg-[#F6F3F2] p-4 sm:p-5 rounded-2xl mb-6 border-2 border-[#E5E4E2] text-sm sm:text-base text-[#1b1c1c] leading-relaxed">
              <span className="font-extrabold text-[#1b1c1c] block mb-1">Study Overview:</span>
              {material.description}
            </div>
          )}

          {/* Rendered Academic Note Snippet */}
          <div className="max-w-none text-[#1b1c1c] leading-relaxed space-y-4">
            <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-[#E5E4E2] shadow-xs font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-[#1b1c1c]">
              {material.contentSnippet || (
                `# ${material.title}\n\n` +
                `Course: ${material.subjectCode} - ${material.subjectName}\n` +
                `Unit: ${material.unit || 'Core Modules'}\n\n` +
                `## Key Theoretical Foundations\n` +
                `1. Abstract Data Representation & Space-Time Trade-offs\n` +
                `2. Deterministic vs Non-Deterministic algorithmic guarantees\n` +
                `3. Proof of Correctness using Mathematical Induction\n\n` +
                `## Model Examination Problems\n` +
                `- Question 1: Analyze worst-case amortized cost under repeated insertions.\n` +
                `- Question 2: Prove that AVL tree height is bounded by 1.44 log2(N).\n` +
                `- Question 3: Construct the minimum spanning tree using Kruskal's algorithm.`
              )}
            </div>

            {material.tags && material.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {material.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs sm:text-sm font-bold bg-[#F0EDED] text-[#56615a] px-3 py-1 rounded-xl"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t-2 border-[#F0EDED] bg-[#FDFCF8] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl border-2 transition-colors cursor-pointer ${
                hasLiked
                  ? 'bg-[#d6e7a1]/50 border-[#56642b] text-[#56642b]'
                  : 'border-[#E5E4E2] text-[#434844] hover:bg-[#F0EDED]'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likes} Helpful</span>
            </button>
            <span className="text-xs sm:text-sm text-[#56615a] font-medium">
              {material.viewsCount} Cohort Views
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onDownload(material)}
              className="px-6 py-3 bg-[#56615a] hover:bg-[#434d46] text-white text-sm sm:text-base font-black rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Download className="w-5 h-5" /> Download {material.fileFormat}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
