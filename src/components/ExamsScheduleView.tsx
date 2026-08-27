import React, { useState } from 'react';
import { Exam } from '../types';
import { Calendar, Clock, MapPin, Plus, CheckCircle, ArrowRight } from 'lucide-react';

interface ExamsScheduleViewProps {
  exams: Exam[];
  onAddExam: (examData: any) => void;
  onNavigateToSubject: (subjectCode: string) => void;
}

export const ExamsScheduleView: React.FC<ExamsScheduleViewProps> = ({
  exams,
  onAddExam,
  onNavigateToSubject,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [venue, setVenue] = useState('Hall 204');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    onAddExam({
      subjectName,
      subjectCode: subjectCode || 'CS300',
      date,
      time,
      venue,
    });
    setSubjectName('');
    setSubjectCode('');
    setShowAddModal(false);
  };

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-10 pb-32 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Examination Schedule
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Exams & Countdown Timetable
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Stay ahead of your midterms and finals with real-time countdowns and revision trackers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-950/15 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Add Exam Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:border-[#93C5FD] hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="bg-[#EFF6FF] text-[#1E3A8A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#BFDBFE]">
                    {exam.subjectCode}
                  </span>
                  <h3 className="text-2xl font-bold text-[#0F172A] mt-2">
                    {exam.subjectName}
                  </h3>
                </div>

                <div className="text-center px-4 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex-shrink-0">
                  <span className="text-3xl font-black text-[#0F172A] block leading-none">
                    {exam.daysRemaining}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider mt-0.5 block">
                    Days left
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#475569] mt-4 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Exam Date: <strong className="text-[#0F172A]">{exam.date}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Time: <strong className="text-[#0F172A]">{exam.time}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Venue: <strong className="text-[#0F172A]">{exam.venue}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <div className="flex-grow mr-4">
                <div className="flex justify-between text-[11px] text-[#64748B] font-semibold mb-1">
                  <span>Revision Progress</span>
                  <span className="text-[#0F172A] font-bold">{exam.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E3A8A] rounded-full"
                    style={{ width: `${exam.progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onNavigateToSubject(exam.subjectCode)}
                className="text-xs font-bold text-[#1E3A8A] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer whitespace-nowrap bg-[#EFF6FF] px-3 py-1.5 rounded-lg transition-colors"
              >
                Study Notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl">
            <h3 className="text-xl font-bold text-[#0F172A] mb-1">Add Exam Timetable Entry</h3>
            <p className="text-xs text-[#64748B] mb-4">Post an upcoming quiz, mid-sem, or final exam date.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS302"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">Exam Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">Time Range</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 01:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1 uppercase tracking-wide">Exam Hall / Venue</label>
                  <input
                    type="text"
                    placeholder="Academic Block B"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                >
                  Add Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
