import React, { useState } from 'react';
import { Subject, Material } from '../types';
import { BookOpen, Plus, Search, ChevronRight, FileText, Sparkles, ArrowLeft } from 'lucide-react';

interface SubjectsListViewProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onOpenAddSubject?: () => void;
  onAddSubject?: (data: { name: string; code: string; professor: string; description: string; creditHours?: number }) => void;
  onBack?: () => void;
}

export const SubjectsListView: React.FC<SubjectsListViewProps> = ({
  subjects,
  onSelectSubject,
  onOpenAddSubject,
  onAddSubject,
  onBack,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [description, setDescription] = useState('');
  const [creditHours, setCreditHours] = useState(4);

  const handleOpenAdd = () => {
    if (onAddSubject) {
      setShowAddModal(true);
    } else if (onOpenAddSubject) {
      onOpenAddSubject();
    }
  };

  const handleSubmitNewSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    if (onAddSubject) {
      onAddSubject({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        professor: professor.trim() || 'Faculty Department',
        description: description.trim() || `Curriculum, syllabus notes, and examination references for ${name.trim()}.`,
        creditHours: Number(creditHours) || 4,
      });
    }
    setName('');
    setCode('');
    setProfessor('');
    setDescription('');
    setShowAddModal(false);
  };

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.professor.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#737874] uppercase tracking-wider">
            Semester Curriculum
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
            Subjects & Courses
          </h1>
          <p className="text-sm text-[#434844] mt-1">
            Browse through active academic courses, view modules, notes, and past exams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#737874] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl text-[#1b1c1c] w-full sm:w-56"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Subject
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-6 flex flex-col justify-between hover:border-[#b2beb5] transition-all cursor-pointer group shadow-[0_4px_20px_rgba(51,51,51,0.02)] hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-[#b2beb5]/25 text-[#434844] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#b2beb5]/30">
                  {subject.code}
                </span>
                <span className="text-xs text-[#737874] font-medium">
                  {subject.creditHours || 4} Credits
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1b1c1c] group-hover:text-[#56615a] transition-colors leading-snug">
                {subject.name}
              </h3>
              <p className="text-xs text-[#737874] font-medium mt-1">
                {subject.professor}
              </p>
              <p className="text-xs text-[#434844] mt-3 line-clamp-2 leading-relaxed">
                {subject.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E2E1] flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-[#737874]">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#56615a]" /> {subject.notesCount || 8} Notes
                </span>
                <span>•</span>
                <span>{subject.pyqsCount || 4} PYQs</span>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#F0EDED] group-hover:bg-[#56615a] group-hover:text-white flex items-center justify-center transition-all">
                <ChevronRight className="w-4 h-4 text-[#737874] group-hover:text-white" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FEFEFA] rounded-2xl max-w-lg w-full p-6 border border-[#E5E4E2] shadow-2xl">
            <h3 className="text-xl font-bold text-[#1b1c1c] mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#56615a]" />
              Add Academic Course / Subject
            </h3>
            <p className="text-xs text-[#737874] mb-4">
              Add a new course curriculum to your cohort syllabus and lecture repository.
            </p>

            <form onSubmit={handleSubmitNewSubject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#434844] block mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs text-[#1b1c1c]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#434844] block mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS307"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-mono uppercase text-[#1b1c1c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#434844] block mb-1">
                    Faculty / Professor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Robert Chen"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs text-[#1b1c1c]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#434844] block mb-1">
                    Credit Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={creditHours}
                    onChange={(e) => setCreditHours(parseInt(e.target.value, 10) || 4)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs text-[#1b1c1c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#434844] block mb-1">
                  Course Description / Syllabus Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline syllabus units, prerequisites, or topics covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="paper-input w-full p-2.5 rounded-lg text-xs text-[#1b1c1c]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#737874] hover:bg-[#F0EDED] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
