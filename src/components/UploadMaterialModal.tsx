import React, { useState } from 'react';
import { Subject, MaterialType, FileFormat } from '../types';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UploadMaterialModalProps {
  isOpen: boolean;
  subjects: Subject[];
  defaultSubjectId?: string;
  onClose: () => void;
  onUpload: (data: any) => void;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  subjects,
  defaultSubjectId,
  onClose,
  onUpload,
}) => {
  if (!isOpen) return null;

  const [subjectId, setSubjectId] = useState<string>(
    defaultSubjectId || (subjects.length > 0 ? subjects[0].id : '')
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MaterialType>('notes');
  const [fileFormat, setFileFormat] = useState<FileFormat>('PDF');
  const [unit, setUnit] = useState('Unit 1');
  const [tags, setTags] = useState('Important, Midterm, Algorithms');
  const [contentSnippet, setContentSnippet] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const ext = file.name.split('.').pop()?.toUpperCase();
      if (ext === 'PDF' || ext === 'DOCX' || ext === 'PPTX' || ext === 'TXT') {
        setFileFormat(ext as FileFormat);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    onUpload({
      subjectId,
      title,
      description,
      type,
      fileFormat,
      fileSize: uploadedFileName ? '2.8 MB' : '1.9 MB',
      unit,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      contentSnippet: contentSnippet || `# ${title}\n\nKey academic lecture notes and chapter summaries for ${unit}.`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#64748B] hover:text-[#0F172A] p-2 hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#E0E7FF] flex items-center justify-center text-[#1E3A8A] shadow-xs">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">Upload Study Material</h3>
            <p className="text-xs text-[#64748B]">Share lecture notes, question papers, or summary slides with your cohort</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag and drop file area */}
          <div className="border-2 border-dashed border-[#CBD5E1] hover:border-[#1E3A8A] rounded-2xl p-6 text-center bg-[#F8FAFC] transition-colors relative cursor-pointer group">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl text-[#1E3A8A] group-hover:scale-110 transition-transform">
                cloud_upload
              </span>
              <div className="text-xs font-bold text-[#0F172A]">
                {uploadedFileName ? (
                  <span className="text-[#D97706] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 inline" /> {uploadedFileName}
                  </span>
                ) : (
                  'Click to browse or drag & drop lecture file here'
                )}
              </div>
              <p className="text-[11px] text-[#64748B]">Supports PDF, DOCX, PPTX, TXT up to 25MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#334155] block mb-1">
                Subject Course *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="paper-input w-full p-2.5 rounded-xl text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
                required
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#334155] block mb-1">
                Category / Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaterialType)}
                className="paper-input w-full p-2.5 rounded-xl text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
              >
                <option value="notes">Lecture Notes</option>
                <option value="materials">Reference Materials / Slides</option>
                <option value="pyqs">Previous Year Questions (PYQs)</option>
                <option value="important_questions">Important Exam Questions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#334155] block mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Trees & Graphs Deep Dive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="paper-input w-full p-2.5 rounded-xl text-xs font-medium text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#334155] block mb-1">
                Unit / Module
              </label>
              <input
                type="text"
                placeholder="e.g. Unit 3 & 4"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="paper-input w-full p-2.5 rounded-xl text-xs font-medium text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#334155] block mb-1">
                File Format
              </label>
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value as FileFormat)}
                className="paper-input w-full p-2.5 rounded-xl text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
              >
                <option value="PDF">PDF Document</option>
                <option value="DOCX">Word (.DOCX)</option>
                <option value="PPTX">PowerPoint (.PPTX)</option>
                <option value="ZIP">ZIP Archive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#334155] block mb-1">
              Description / Study Highlights
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of theorems, proofs, or questions contained..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="paper-input w-full p-2.5 rounded-xl text-xs font-medium text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#334155] block mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Graphs, AVL Trees, Final Prep"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="paper-input w-full p-2.5 rounded-xl text-xs font-medium text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-950/15 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
            >
              <Upload className="w-3.5 h-3.5" /> Upload to Class Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
