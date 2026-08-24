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
  const [likes, setLikes] = useState(material.downloadsCount);
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-[#E5E4E2] bg-[#FDFCF8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#b2beb5]/25 text-[#434844] px-2.5 py-1 rounded text-xs font-bold uppercase">
              {material.subjectCode}
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#1b1c1c] leading-tight">
                {material.title}
              </h2>
              <div className="text-xs text-[#737874] flex items-center gap-2 mt-0.5">
                <span>{material.fileFormat} • {material.fileSize}</span>
                <span>•</span>
                <span>Uploaded by {material.uploadedBy.name} ({material.uploadedDate})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-xl border transition-colors ${
                bookmarked
                  ? 'bg-[#d6e7a1]/40 border-[#56642b] text-[#56642b]'
                  : 'border-[#E5E4E2] text-[#737874] hover:bg-[#F0EDED]'
              }`}
              title="Bookmark Note"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-[#E5E4E2] text-[#737874] hover:bg-[#F0EDED] transition-colors"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-[#56642b]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#737874] hover:text-[#1b1c1c] hover:bg-[#F0EDED] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Canvas */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-[#FDFCF8] font-sans">
          {material.description && (
            <div className="bg-[#F6F3F2] p-4 rounded-xl mb-6 border border-[#E5E4E2] text-xs md:text-sm text-[#434844] leading-relaxed">
              <span className="font-bold text-[#1b1c1c] block mb-1">Overview:</span>
              {material.description}
            </div>
          )}

          {/* Rendered Academic Note Snippet */}
          <div className="prose prose-sm max-w-none text-[#1b1c1c] leading-relaxed space-y-4">
            <div className="p-6 bg-white rounded-xl border border-[#E5E4E2] shadow-xs font-mono text-xs whitespace-pre-wrap leading-relaxed text-[#2c302e]">
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
              <div className="flex flex-wrap gap-1.5 pt-2">
                {material.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold bg-[#F0EDED] text-[#56615a] px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 md:p-5 border-t border-[#E5E4E2] bg-[#FDFCF8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                hasLiked
                  ? 'bg-[#d6e7a1]/40 border-[#56642b] text-[#56642b]'
                  : 'border-[#E5E4E2] text-[#434844] hover:bg-[#F0EDED]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{likes} Helpful</span>
            </button>
            <span className="text-xs text-[#737874]">
              {material.viewsCount} Cohort Views
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(material)}
              className="px-5 py-2 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download {material.fileFormat}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
