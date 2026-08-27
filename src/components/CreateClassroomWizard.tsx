import React, { useState } from 'react';
import { Classroom, DegreeLevel } from '../types';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, Check, Sparkles, ShieldCheck, School, Plus, X, Trash2 } from 'lucide-react';

interface CreateClassroomWizardProps {
  onCreate: (classroomData: any) => void;
  onCancel: () => void;
}

export const CreateClassroomWizard: React.FC<CreateClassroomWizardProps> = ({
  onCreate,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: College Details
  const [collegeName, setCollegeName] = useState('Oxford University');
  const [location, setLocation] = useState('Oxford, United Kingdom');
  const [department, setDepartment] = useState('Faculty of Computer Science & Engineering');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>('undergraduate');

  // Step 2: Batch & Subjects
  const [batchYear, setBatchYear] = useState('2026');
  const [section, setSection] = useState('Section A');
  const [semester, setSemester] = useState('Semester 5');
  
  const defaultSubjectList = [
    'Data Structures (CS301)',
    'Operating Systems (CS302)',
    'Algorithm Analysis (CS303)',
    'Computer Networks (CS304)',
    'Database Management Systems (CS305)',
    'Theory of Computation (CS306)',
  ];

  const [availableSubjects, setAvailableSubjects] = useState<string[]>(defaultSubjectList);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Data Structures (CS301)',
    'Operating Systems (CS302)',
    'Algorithm Analysis (CS303)',
    'Computer Networks (CS304)',
    'Database Management Systems (CS305)',
  ]);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Step 3: Admin & Permissions
  const [allowStudentUploads, setAllowStudentUploads] = useState(true);
  const [requireModeration, setRequireModeration] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCreate({
        collegeName,
        location,
        department,
        course,
        degreeLevel,
        batchYear,
        section,
        semester,
        selectedSubjects,
        allowStudentUploads,
        requireModeration,
      });
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleAddCustomSubject = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSubjectName.trim();
    if (!trimmed) return;

    if (!availableSubjects.includes(trimmed)) {
      setAvailableSubjects([...availableSubjects, trimmed]);
    }
    if (!selectedSubjects.includes(trimmed)) {
      setSelectedSubjects([...selectedSubjects, trimmed]);
    }
    setNewSubjectName('');
  };

  const handleRemoveSubject = (subjectToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAvailableSubjects(availableSubjects.filter((s) => s !== subjectToRemove));
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectToRemove));
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return 'Step 1 of 3: College Details';
      case 2:
        return 'Step 2 of 3: Batch & Curriculum';
      case 3:
        return 'Step 3 of 3: Access & Permissions';
      default:
        return '';
    }
  };

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-16 py-8 md:py-12 min-h-screen">
      {/* Header & Progress */}
      <div className="mb-8 text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-2">
          Create Classroom
        </h2>
        <p className="text-base md:text-lg text-[#475569] mb-4">
          {getStepSubtitle()}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Info Box (Super Admin Role) */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 md:p-6 flex gap-4 items-start mb-8 shadow-xs">
        <span
          className="material-symbols-outlined text-[#1E3A8A] text-2xl flex-shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          info
        </span>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#0F172A] mb-1">
            Super Admin Role
          </h3>
          <p className="text-xs md:text-sm text-[#475569] leading-relaxed">
            By creating this classroom, you will become the Super Admin. You can invite other teachers and manage student access later.
          </p>
        </div>
      </div>

      {/* Form Canvas */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-10 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <form onSubmit={handleNext} className="space-y-6">
          {/* STEP 1: College Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oxford University"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Science / Department of CS"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                    Course / Program *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                    Degree Level
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
                    className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A] cursor-pointer"
                  >
                    <option value="undergraduate">Undergraduate (BSc, B.Tech, BA)</option>
                    <option value="postgraduate">Postgraduate (MSc, M.Tech, MA)</option>
                    <option value="doctorate">Doctorate (PhD)</option>
                    <option value="other">Diploma / Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Batch & Subjects */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                    Batch Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                    Section / Group *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Section A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#334155] mb-2 uppercase tracking-wide">
                    Semester
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Semester 5"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="paper-input w-full p-3.5 text-sm font-medium rounded-t-lg text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#334155] block uppercase tracking-wide">
                    Cohort Subjects ({selectedSubjects.length} Selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAvailableSubjects(defaultSubjectList);
                      setSelectedSubjects(defaultSubjectList.slice(0, 5));
                    }}
                    className="text-[11px] font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    Reset to Defaults
                  </button>
                </div>

                {/* Input field for writing/adding subject name */}
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Write subject name & code (e.g. Artificial Intelligence - CS307)..."
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSubject();
                        }
                      }}
                      className="paper-input w-full p-3 text-xs font-medium rounded-xl text-[#0F172A] border border-[#CBD5E1] bg-[#F8FAFC]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddCustomSubject()}
                    disabled={!newSubjectName.trim()}
                    className="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {/* Subjects Grid with defaults and custom additions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {availableSubjects.map((sub) => {
                    const isSelected = selectedSubjects.includes(sub);
                    const isDefault = defaultSubjectList.includes(sub);
                    return (
                      <div
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all group ${
                          isSelected
                            ? 'bg-[#EFF6FF] border-[#1E3A8A] text-[#1E3A8A] shadow-xs'
                            : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] hover:border-[#93C5FD]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span
                            className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                                : 'border-[#CBD5E1] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <span className="truncate">{sub}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSubject(sub, e)}
                              className="opacity-60 hover:opacity-100 hover:text-[#DC2626] p-1 rounded-md transition-all"
                              title="Delete custom subject"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Default core courses are pre-loaded. Click to toggle selection or type above to add new electives.</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Admin & Permissions */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                  <ShieldCheck className="w-5 h-5 text-[#1E3A8A]" />
                  Classroom Access Code Generated
                </div>
                <div className="text-2xl font-black text-[#1E3A8A] tracking-widest bg-white p-3 rounded-lg border border-[#CBD5E1] inline-block shadow-xs">
                  {course.slice(0, 3).toUpperCase()}{batchYear.slice(-2)}{section.slice(-1) || 'A'}
                </div>
                <p className="text-xs text-[#64748B]">
                  Share this code with your classmates to let them immediately enter and download batch materials.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowStudentUploads}
                    onChange={(e) => setAllowStudentUploads(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#1E3A8A] rounded"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">Allow Student Notes Uploads</div>
                    <div className="text-xs text-[#64748B]">
                      Permit enrolled batch members to contribute study guides, PYQs, and class notes.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireModeration}
                    onChange={(e) => setRequireModeration(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#1E3A8A] rounded"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">Require Super Admin Moderation</div>
                    <div className="text-xs text-[#64748B]">
                      All new student uploads must be reviewed by an admin before appearing publicly.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-8 flex justify-between items-center border-t border-[#E2E8F0]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-[#F1F5F9] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-sm py-3.5 px-8 rounded-2xl transition-all flex items-center gap-2 shadow-md shadow-blue-950/15 cursor-pointer hover:scale-[1.02]"
            >
              <span>{step === 3 ? 'Launch Classroom' : 'Next Step'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
