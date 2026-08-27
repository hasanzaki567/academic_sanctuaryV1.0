import React, { useState } from 'react';
import { Subject, Material } from '../types';
import { BookOpen, Plus, Search, ChevronRight, FileText, Sparkles } from 'lucide-react';

interface SubjectsListViewProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  onOpenAddSubject: () => void;
}

export const SubjectsListView: React.FC<SubjectsListViewProps> = ({
  subjects,
  onSelectSubject,
  onOpenAddSubject,
}) => {
  const [search, setSearch] = useState('');

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.professor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-10 pb-32 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Semester Curriculum
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Subjects & Courses
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Browse through active academic courses, view modules, notes, and past exams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="paper-input text-xs pl-9 pr-4 py-2 rounded-xl text-[#0F172A] w-full sm:w-56"
            />
          </div>
          <button
            onClick={onOpenAddSubject}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" /> Add Subject
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between hover:border-[#93C5FD] transition-all cursor-pointer group shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-[#EFF6FF] text-[#1E3A8A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#BFDBFE]">
                  {subject.code}
                </span>
                <span className="text-xs text-[#64748B] font-medium bg-[#F8FAFC] px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
                  {subject.creditHours || 4} Credits
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-snug">
                {subject.name}
              </h3>
              <p className="text-xs text-[#64748B] font-medium mt-1">
                {subject.professor}
              </p>
              <p className="text-xs text-[#475569] mt-3 line-clamp-2 leading-relaxed">
                {subject.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1 font-medium">
                  <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" /> {subject.notesCount || 8} Notes
                </span>
                <span>•</span>
                <span className="font-medium text-[#D97706]">{subject.pyqsCount || 4} PYQs</span>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#F1F5F9] group-hover:bg-[#1E3A8A] group-hover:text-white flex items-center justify-center transition-all">
                <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-white" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
