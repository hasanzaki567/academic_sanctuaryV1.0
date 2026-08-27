import React, { useState } from 'react';
import { Material } from '../types';
import { X, Download, Share2, Bookmark, Check, Copy, BookOpen, ThumbsUp } from 'lucide-react';

interface DocumentReaderModalProps {
  material: Material | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (material: Material) => void;
  onSaveMaterial?: (material: Material) => void;
  onAddToDrive?: (material: Material) => void;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  material,
  isOpen,
  onClose,
  onDownload,
  onSaveMaterial,
  onAddToDrive,
}) => {
  if (!isOpen || !material) return null;

  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [inDrive, setInDrive] = useState(false);
  const [likes, setLikes] = useState(material.downloadsCount);
  const [hasLiked, setHasLiked] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmarkToggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    if (onSaveMaterial) {
      onSaveMaterial(material);
    }
  };

  const handleDriveClick = () => {
    setInDrive(true);
    if (onAddToDrive) {
      onAddToDrive(material);
    }
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
    <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#EFF6FF] text-[#1E3A8A] px-2.5 py-1 rounded-lg text-xs font-bold uppercase border border-[#BFDBFE]">
              {material.subjectCode}
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A] leading-tight">
                {material.title}
              </h2>
              <div className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                <span>{material.fileFormat} • {material.fileSize}</span>
                <span>•</span>
                <span>Uploaded by {material.uploadedBy.name} ({material.uploadedDate})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                bookmarked
                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                  : 'border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9]'
              }`}
              title="Save File to My Library"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#D97706]' : ''}`} />
              <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save File'}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-[#D97706]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Canvas */}
        <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-white font-sans">
          {material.description && (
            <div className="bg-[#F8FAFC] p-4 rounded-2xl mb-6 border border-[#E2E8F0] text-xs md:text-sm text-[#475569] leading-relaxed">
              <span className="font-bold text-[#0F172A] block mb-1">Overview:</span>
              {material.description}
            </div>
          )}

          {/* Rendered Academic Note Snippet */}
          <div className="prose prose-sm max-w-none text-[#0F172A] leading-relaxed space-y-4">
            <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] shadow-xs font-mono text-xs whitespace-pre-wrap leading-relaxed text-[#1E293B]">
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
                    className="text-[11px] font-bold bg-[#EFF6FF] text-[#1E3A8A] px-2.5 py-1 rounded-lg border border-[#BFDBFE]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 md:p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                hasLiked
                  ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                  : 'border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{likes} Helpful</span>
            </button>
            <span className="text-xs text-[#64748B] font-medium">
              {material.viewsCount} Cohort Views
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDriveClick}
              className="px-4 py-2.5 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:border-[#93C5FD]"
            >
              {inDrive ? (
                <Check className="w-4 h-4 text-[#16A34A]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M8.5 3L15.5 3L21.5 13.5L14.5 13.5L8.5 3Z" fill="#FFC107" />
                  <path d="M2.5 13.5L5.5 8.5L14.5 13.5L11.5 18.5L2.5 13.5Z" fill="#2196F3" />
                  <path d="M11.5 18.5L14.5 13.5L21.5 13.5L18.5 18.5L11.5 18.5Z" fill="#4CAF50" />
                </svg>
              )}
              <span>{inDrive ? 'Added to Drive' : 'Add to Google Drive'}</span>
            </button>
            <button
              onClick={() => onDownload(material)}
              className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-950/15 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <Download className="w-3.5 h-3.5" /> Download {material.fileFormat}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
