import React, { useState, useEffect } from 'react';
import { Subject, MaterialType, FileFormat, Exam } from '../types';
import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  PenTool,
  List,
  Edit3,
  BookOpen,
  FileCode,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UploadMaterialModalProps {
  isOpen: boolean;
  subjects: Subject[];
  exams?: Exam[];
  defaultSubjectId?: string;
  defaultExamType?: string;
  onClose: () => void;
  onUpload: (data: any) => void;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  subjects,
  exams = [],
  defaultSubjectId,
  defaultExamType,
  onClose,
  onUpload,
}) => {
  if (!isOpen) return null;

  // Subject Selection Mode: 'dropdown' or 'manual'
  const [subjectMode, setSubjectMode] = useState<'dropdown' | 'manual'>('dropdown');
  const [subjectId, setSubjectId] = useState<string>(
    defaultSubjectId || (subjects.length > 0 ? subjects[0].id : '')
  );
  const [manualSubjectName, setManualSubjectName] = useState('');
  const [manualSubjectCode, setManualSubjectCode] = useState('');
  const [manualProfessor, setManualProfessor] = useState('');

  // Category Mode: 'dropdown' or 'manual'
  const [typeMode, setTypeMode] = useState<'dropdown' | 'manual'>('dropdown');
  const [type, setType] = useState<MaterialType>('notes');
  const [manualType, setManualType] = useState('');

  // Format Mode: 'dropdown' or 'manual'
  const [formatMode, setFormatMode] = useState<'dropdown' | 'manual'>('dropdown');
  const [fileFormat, setFileFormat] = useState<FileFormat>('PDF');
  const [manualFormat, setManualFormat] = useState('');

  // Content input mode: 'file' or 'manual-notes' or 'both'
  const [contentMode, setContentMode] = useState<'file' | 'manual-notes'>('file');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('Unit 1');
  const [recommendedExam, setRecommendedExam] = useState<string>(defaultExamType || 'IAT 1');
  const [examMode, setExamMode] = useState<'preset' | 'manual'>('preset');
  const [manualExamInput, setManualExamInput] = useState('');
  const [tags, setTags] = useState('Important, Midterm, Algorithms');
  const [contentSnippet, setContentSnippet] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSubjectId) {
      setSubjectId(defaultSubjectId);
      setSubjectMode('dropdown');
    }
    if (defaultExamType) {
      setRecommendedExam(defaultExamType);
    }
  }, [defaultSubjectId, defaultExamType, isOpen]);

  // Selected subject's specific upcoming exams
  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const subjectExams = exams.filter((e) => {
    if (!selectedSubject) return false;
    return (
      (e.subjectCode && e.subjectCode.toLowerCase() === selectedSubject.code.toLowerCase()) ||
      (e.subjectName && e.subjectName.toLowerCase() === selectedSubject.name.toLowerCase())
    );
  });

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
        setFormatMode('dropdown');
      } else if (ext) {
        setManualFormat(ext);
        setFormatMode('manual');
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

    const finalRecommendedExam =
      examMode === 'manual'
        ? manualExamInput.trim() || 'General'
        : recommendedExam === 'Custom'
        ? manualExamInput.trim() || 'General'
        : recommendedExam;

    const finalFormat = formatMode === 'manual' && manualFormat.trim() ? manualFormat.trim().toUpperCase() : fileFormat;
    const finalType = typeMode === 'manual' && manualType.trim() ? manualType.trim().toLowerCase() : type;

    const isManualSubject = subjectMode === 'manual';

    onUpload({
      subjectId: isManualSubject ? 'custom' : subjectId,
      subjectName: isManualSubject ? manualSubjectName.trim() || 'General Course' : undefined,
      subjectCode: isManualSubject ? manualSubjectCode.trim() || 'GEN101' : undefined,
      professor: isManualSubject ? manualProfessor.trim() || undefined : undefined,
      title: title.trim(),
      description: description.trim(),
      type: finalType,
      fileFormat: finalFormat,
      fileSize: uploadedFileName ? '2.8 MB' : contentSnippet.length > 500 ? '1.2 MB' : '850 KB',
      unit: unit.trim(),
      recommendedExam: finalRecommendedExam,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      contentSnippet:
        contentSnippet.trim() ||
        `# ${title}\n\nKey academic study notes and lecture summaries for ${unit}.\n\nRecommended for ${finalRecommendedExam}.`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FEFEFA] border-2 border-[#E5E4E2] rounded-3xl max-w-4xl w-full p-6 sm:p-8 md:p-10 shadow-2xl relative my-6 max-h-[94vh] flex flex-col">
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b-2 border-[#F0EDED]">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#1b1c1c] text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-[#E5E4E2]"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#56615a]/15 flex items-center justify-center text-[#56615a] flex-shrink-0">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1b1c1c] leading-tight">
                  Upload & Create Study Material
                </h3>
                <p className="text-xs sm:text-sm text-[#56615a] font-medium mt-0.5">
                  Upload lecture files or write notes manually with subject, syllabus, and exam tags
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#737874] hover:text-[#1b1c1c] p-2.5 hover:bg-[#F0EDED] rounded-2xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-1 sm:pr-2 flex-grow">
          {/* SECTION 1: Subject Course - Dropdown vs Manual Input */}
          <div className="bg-[#F9F6EE] border-2 border-[#E5E4E2] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm sm:text-base font-black text-[#1b1c1c] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#56615a]" />
                Subject Course *
              </label>
              <div className="flex items-center gap-1.5 bg-white border-2 border-[#D8DCD6] p-1 rounded-2xl text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setSubjectMode('dropdown')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                    subjectMode === 'dropdown'
                      ? 'bg-[#56615a] text-white shadow-xs'
                      : 'text-[#56615a] hover:text-[#1b1c1c]'
                  }`}
                >
                  <List className="w-4 h-4" /> Select from List
                </button>
                <button
                  type="button"
                  onClick={() => setSubjectMode('manual')}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                    subjectMode === 'manual'
                      ? 'bg-[#56615a] text-white shadow-xs'
                      : 'text-[#56615a] hover:text-[#1b1c1c]'
                  }`}
                >
                  <Edit3 className="w-4 h-4" /> ✍️ Write Manually
                </button>
              </div>
            </div>

            {subjectMode === 'dropdown' ? (
              <div>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="paper-input w-full p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6] focus:border-[#56615a]"
                  required
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code} - {sub.name} ({sub.professor})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#56615a] font-medium mt-2">
                  Need a course not listed above? Click <strong>✍️ Write Manually</strong> to type your custom course!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 animate-in fade-in">
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-bold text-[#434844] block mb-1.5">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required={subjectMode === 'manual'}
                    placeholder="e.g. Artificial Intelligence & Deep Learning"
                    value={manualSubjectName}
                    onChange={(e) => setManualSubjectName(e.target.value)}
                    className="paper-input w-full p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-[#434844] block mb-1.5">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required={subjectMode === 'manual'}
                    placeholder="e.g. CS405"
                    value={manualSubjectCode}
                    onChange={(e) => setManualSubjectCode(e.target.value)}
                    className="paper-input w-full p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs sm:text-sm font-bold text-[#434844] block mb-1.5">
                    Faculty / Professor Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Alan Turing"
                    value={manualProfessor}
                    onChange={(e) => setManualProfessor(e.target.value)}
                    className="paper-input w-full p-3 rounded-2xl text-sm font-medium text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Document Title */}
          <div>
            <label className="text-xs sm:text-sm font-black text-[#1b1c1c] block mb-1.5">
              Document Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Neural Networks Backpropagation & Optimization Algorithms"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="paper-input w-full p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] border-2 border-[#D8DCD6] focus:border-[#56615a]"
            />
          </div>

          {/* SECTION 3: Category & Format (with manual text entry) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Category / Type */}
            <div className="bg-[#F9F6EE] border-2 border-[#E5E4E2] rounded-3xl p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-extrabold text-[#1b1c1c]">Category / Type *</label>
                <div className="flex items-center gap-1 bg-white border border-[#D8DCD6] p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setTypeMode('dropdown')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      typeMode === 'dropdown' ? 'bg-[#56615a] text-white' : 'text-[#56615a]'
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeMode('manual')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      typeMode === 'manual' ? 'bg-[#56615a] text-white' : 'text-[#56615a]'
                    }`}
                  >
                    ✍️ Write
                  </button>
                </div>
              </div>

              {typeMode === 'dropdown' ? (
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MaterialType)}
                  className="paper-input w-full p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                >
                  <option value="notes">Lecture Notes</option>
                  <option value="slides">Presentation Slides</option>
                  <option value="pyqs">Previous Year Questions (PYQs)</option>
                  <option value="important_questions">Important Exam Questions</option>
                  <option value="materials">Reference Materials</option>
                </select>
              ) : (
                <input
                  type="text"
                  required={typeMode === 'manual'}
                  placeholder="e.g. Lab Manual, Formula Sheet, Cheat Sheet"
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value)}
                  className="paper-input w-full p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                />
              )}
            </div>

            {/* File Format */}
            <div className="bg-[#F9F6EE] border-2 border-[#E5E4E2] rounded-3xl p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-extrabold text-[#1b1c1c]">File Format</label>
                <div className="flex items-center gap-1 bg-white border border-[#D8DCD6] p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setFormatMode('dropdown')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      formatMode === 'dropdown' ? 'bg-[#56615a] text-white' : 'text-[#56615a]'
                    }`}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormatMode('manual')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                      formatMode === 'manual' ? 'bg-[#56615a] text-white' : 'text-[#56615a]'
                    }`}
                  >
                    ✍️ Write
                  </button>
                </div>
              </div>

              {formatMode === 'dropdown' ? (
                <select
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value as FileFormat)}
                  className="paper-input w-full p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="DOCX">Word (.DOCX)</option>
                  <option value="PPTX">PowerPoint (.PPTX)</option>
                  <option value="ZIP">ZIP Archive</option>
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Markdown, Jupyter (.ipynb), TXT, Code"
                  value={manualFormat}
                  onChange={(e) => setManualFormat(e.target.value)}
                  className="paper-input w-full p-3 sm:p-3.5 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                />
              )}
            </div>
          </div>

          {/* SECTION 4: Recommended for Exam (with manual input option) */}
          <div className="bg-[#F4F1EA]/90 border-2 border-[#E5E4E2] rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm sm:text-base font-black text-[#1b1c1c] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#56615a]" />
                Recommended for Exam (Timetable Integration) *
              </label>
              <div className="flex items-center gap-1 bg-white border-2 border-[#D8DCD6] p-1 rounded-2xl text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setExamMode('preset')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                    examMode === 'preset' ? 'bg-[#56615a] text-white shadow-xs' : 'text-[#56615a]'
                  }`}
                >
                  Exam List
                </button>
                <button
                  type="button"
                  onClick={() => setExamMode('manual')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                    examMode === 'manual' ? 'bg-[#56615a] text-white shadow-xs' : 'text-[#56615a]'
                  }`}
                >
                  ✍️ Write Manually
                </button>
              </div>
            </div>

            {examMode === 'preset' ? (
              <div className="space-y-2.5">
                {subjectExams.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subjectExams.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => setRecommendedExam(ex.examType || 'IAT 1')}
                        className={`text-xs sm:text-sm px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border-2 cursor-pointer ${
                          recommendedExam === ex.examType
                            ? 'bg-[#56615a] text-white border-[#56615a] shadow-xs'
                            : 'bg-white text-[#1b1c1c] border-[#D8DCD6] hover:border-[#56615a]'
                        }`}
                      >
                        <span>🎯 {ex.examType}</span>
                        <span className="text-xs opacity-80">({ex.date})</span>
                      </button>
                    ))}
                  </div>
                )}
                <select
                  value={
                    ['IAT 1', 'IAT 2', 'SEM', 'Model Exam', 'Lab Practical Exam', 'All Exams'].includes(
                      recommendedExam
                    )
                      ? recommendedExam
                      : 'Custom'
                  }
                  onChange={(e) => {
                    if (e.target.value === 'Custom') {
                      setExamMode('manual');
                    } else {
                      setRecommendedExam(e.target.value);
                    }
                  }}
                  className="paper-input w-full p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                >
                  <option value="IAT 1">IAT 1 (Internal Assessment 1)</option>
                  <option value="IAT 2">IAT 2 (Internal Assessment 2)</option>
                  <option value="SEM">Semester Final Examination (SEM)</option>
                  <option value="Model Exam">Model / Pre-Board Examination</option>
                  <option value="Lab Practical Exam">Lab Practical Examination</option>
                  <option value="All Exams">All Exams / General Preparation</option>
                </select>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  required={examMode === 'manual'}
                  placeholder="Enter exam name manually (e.g. Unit Test 2, Quiz 4, Viva Voce)"
                  value={manualExamInput}
                  onChange={(e) => setManualExamInput(e.target.value)}
                  className="paper-input w-full p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-bold text-[#1b1c1c] bg-white border-2 border-[#D8DCD6]"
                />
              </div>
            )}
          </div>

          {/* SECTION 5: Study Material Content: File Upload vs Manual Notes Writer */}
          <div className="border-2 border-[#E5E4E2] rounded-3xl overflow-hidden bg-white">
            <div className="flex border-b-2 border-[#E5E4E2] bg-[#F9F6EE]">
              <button
                type="button"
                onClick={() => setContentMode('file')}
                className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-colors cursor-pointer ${
                  contentMode === 'file'
                    ? 'bg-white text-[#1b1c1c] border-b-2 border-[#56615a]'
                    : 'text-[#737874] hover:text-[#1b1c1c]'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>📁 Upload File Document</span>
              </button>
              <button
                type="button"
                onClick={() => setContentMode('manual-notes')}
                className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-colors cursor-pointer ${
                  contentMode === 'manual-notes'
                    ? 'bg-white text-[#1b1c1c] border-b-2 border-[#56615a]'
                    : 'text-[#737874] hover:text-[#1b1c1c]'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>✍️ Write Notes Manually in Form</span>
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {contentMode === 'file' ? (
                <div className="border-2 border-dashed border-[#C3C8C3] hover:border-[#56615a] rounded-2xl p-8 text-center bg-[#FDFCF8] transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#56615a]/10 flex items-center justify-center text-[#56615a] group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">
                        cloud_upload
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#1b1c1c]">
                      {uploadedFileName ? (
                        <span className="text-[#56642b] flex items-center gap-1.5 font-black">
                          <CheckCircle2 className="w-5 h-5 inline text-[#56642b]" /> {uploadedFileName}
                        </span>
                      ) : (
                        'Click to browse or drag & drop lecture file here'
                      )}
                    </div>
                    <p className="text-xs text-[#737874]">Supports PDF, DOCX, PPTX, TXT, ZIP up to 25MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#737874]">
                    <span className="font-bold">Type lecture notes, definitions, formulas, or markdown:</span>
                    <span className="font-mono">{contentSnippet.length} characters</span>
                  </div>
                  <textarea
                    rows={7}
                    placeholder={`# Chapter Summary & Formulas\n\n## 1. Key Principles\n- Principle A: Explanation and derivation\n- Principle B: Practical examples and problem steps\n\n## 2. Exam Tips & Important Questions\n- Q1: Explain in 5 marks...\n- Q2: Solve following problem...`}
                    value={contentSnippet}
                    onChange={(e) => setContentSnippet(e.target.value)}
                    className="paper-input w-full p-4 rounded-2xl text-xs sm:text-sm font-mono text-[#1b1c1c] border-2 border-[#D8DCD6] leading-relaxed"
                  />
                  <p className="text-xs text-[#56615a] font-medium">
                    💡 Students can read and bookmark these notes directly inside the application's Document Reader.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 6: Unit / Module and Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="text-xs sm:text-sm font-black text-[#1b1c1c] block mb-1.5">
                Unit / Module
              </label>
              <input
                type="text"
                placeholder="e.g. Unit 3 & 4 (Trees, Graphs)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="paper-input w-full p-3.5 rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] border-2 border-[#D8DCD6]"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-black text-[#1b1c1c] block mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Midterm, Formulas, AVL Trees"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="paper-input w-full p-3.5 rounded-2xl text-sm sm:text-base font-semibold text-[#1b1c1c] border-2 border-[#D8DCD6]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs sm:text-sm font-black text-[#1b1c1c] block mb-1.5">
              Description / Study Highlights
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of theorems, proofs, or questions contained..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="paper-input w-full p-3.5 rounded-2xl text-sm font-medium text-[#1b1c1c] border-2 border-[#D8DCD6]"
            />
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-5 flex items-center justify-between border-t-2 border-[#F0EDED] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm sm:text-base font-bold text-[#737874] hover:text-[#1b1c1c] hover:bg-[#F0EDED] rounded-2xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back / Cancel</span>
            </button>
            <button
              type="submit"
              className="px-7 py-3.5 bg-[#56615a] hover:bg-[#434d46] text-white text-sm sm:text-base font-black rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer active:scale-98"
            >
              <Upload className="w-5 h-5" />
              <span>Save & Upload to Class Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
