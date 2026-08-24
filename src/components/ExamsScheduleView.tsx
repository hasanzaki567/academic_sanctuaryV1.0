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
          <span className="text-xs font-bold text-[#737874] uppercase tracking-wider">
            Examination Schedule
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
            Exams & Countdown Timetable
          </h1>
          <p className="text-sm text-[#434844] mt-1">
            Stay ahead of your midterms and finals with real-time countdowns and revision trackers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Exam Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam, index) => (
          <div
            key={exam.id}
            className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(51,51,51,0.02)] hover:border-[#b2beb5] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="bg-[#b2beb5]/25 text-[#434844] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#b2beb5]/30">
                    {exam.subjectCode}
                  </span>
                  <h3 className="text-2xl font-bold text-[#1b1c1c] mt-2">
                    {exam.subjectName}
                  </h3>
                </div>

                <div className="text-center px-4 py-2 bg-[#F6F3F2] rounded-xl border border-[#E5E4E2] flex-shrink-0">
                  <span className="text-3xl font-black text-[#1b1c1c] block leading-none">
                    {exam.daysRemaining}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#737874] tracking-wider">
                    Days left
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#434844] mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#56615a]" />
                  <span>Exam Date: <strong className="text-[#1b1c1c]">{exam.date}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#56615a]" />
                  <span>Time: <strong>{exam.time}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#56615a]" />
                  <span>Venue: <strong>{exam.venue}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E2E1] flex items-center justify-between">
              <div className="flex-grow mr-4">
                <div className="flex justify-between text-[11px] text-[#737874] font-medium mb-1">
                  <span>Revision Progress</span>
                  <span>{exam.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-[#E4E2E1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b2beb5] rounded-full"
                    style={{ width: `${exam.progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onNavigateToSubject(exam.subjectCode)}
                className="text-xs font-bold text-[#56615a] hover:text-[#1b1c1c] flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                Study Notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E5E4E2] shadow-2xl">
            <h3 className="text-xl font-bold text-[#1b1c1c] mb-1">Add Exam Timetable Entry</h3>
            <p className="text-xs text-[#737874] mb-4">Post an upcoming quiz, mid-sem, or final exam date.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#434844] block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#1b1c1c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS302"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#1b1c1c]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#1b1c1c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1">Time Range</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 01:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#1b1c1c]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#434844] block mb-1">Exam Hall / Venue</label>
                  <input
                    type="text"
                    placeholder="Academic Block B"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#1b1c1c]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#737874] hover:bg-[#F0EDED] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl"
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
