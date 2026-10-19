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
  const [collegeName, setCollegeName] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>('undergraduate');

  // Step 2: Batch & Subjects
  const [batchYear, setBatchYear] = useState('');
  const [section, setSection] = useState('');
  const [semester, setSemester] = useState('');
  
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
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
    <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 min-h-screen">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              onCancel();
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F0EDED] hover:bg-[#E4E2E1] text-[#1b1c1c] text-sm sm:text-base font-bold transition-colors cursor-pointer border border-[#E5E4E2]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{step > 1 ? 'Back to Previous Step' : 'Back to Dashboard'}</span>
        </button>
      </div>

      {/* Header & Progress */}
      <div className="mb-8 text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1b1c1c] tracking-tight mb-3">
          Create Classroom
        </h2>
        <p className="text-base sm:text-xl text-[#56615a] font-semibold mb-6">
          {getStepSubtitle()}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-[#E4E2E1] rounded-full overflow-hidden p-0.5 border border-[#D8DCD6]">
          <div
            className="h-full bg-[#008069] rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Info Box (Super Admin Role) */}
      <div className="bg-[#008069]/10 border-2 border-[#008069]/30 rounded-3xl p-6 md:p-7 flex gap-4 items-start mb-8 shadow-sm">
        <span
          className="material-symbols-outlined text-[#008069] text-3xl flex-shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          info
        </span>
        <div>
          <h3 className="text-lg md:text-xl font-black text-[#1b1c1c] mb-1">
            Super Admin Role
          </h3>
          <p className="text-sm sm:text-base text-[#434844] font-medium leading-relaxed">
            By creating this classroom, you will become the Super Admin. You can invite other teachers, upload lecture material, and manage student access anytime.
          </p>
        </div>
      </div>

      {/* Form Canvas */}
      <div className="bg-[#FEFEFA] border-2 border-[#E5E4E2] rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl">
        <form onSubmit={handleNext} className="space-y-8">
          {/* STEP 1: College Details */}
          {step === 1 && (
            <div className="space-y-7 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oxford University"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Science / Department of CS"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                    Course / Program *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                    Degree Level
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
                    className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors cursor-pointer"
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
            <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                    Batch Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                    Section / Group *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Section A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-black text-[#1b1c1c] mb-2 uppercase tracking-wide">
                    Semester
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Semester 5"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-5 py-4 text-base sm:text-lg font-semibold rounded-2xl text-[#1b1c1c] bg-[#F6F4F0] border-2 border-[#D8DCD6] focus:border-[#008069] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm sm:text-base font-black text-[#1b1c1c] block uppercase tracking-wide">
                    Cohort Subjects ({selectedSubjects.length} Added)
                  </label>
                  {availableSubjects.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvailableSubjects([]);
                        setSelectedSubjects([]);
                      }}
                      className="text-xs sm:text-sm font-bold text-[#ba1a1a] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Input field for writing/adding subject name */}
                <div className="flex flex-col sm:flex-row gap-3">
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
                      className="w-full px-5 py-3.5 text-sm sm:text-base font-semibold rounded-2xl text-[#1b1c1c] border-2 border-[#D8DCD6] bg-[#F6F4F0] focus:border-[#008069] focus:bg-white outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddCustomSubject()}
                    disabled={!newSubjectName.trim()}
                    className="px-6 py-3.5 bg-[#008069] hover:bg-[#006a57] disabled:opacity-40 text-white text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-sm active:scale-98"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Subject</span>
                  </button>
                </div>

                {/* Subjects Grid with custom additions */}
                {availableSubjects.length === 0 ? (
                  <div className="py-8 px-4 text-center border-2 border-dashed border-[#D8DCD6] rounded-2xl bg-[#F6F4F0]">
                    <p className="text-sm font-bold text-[#1b1c1c]">No subjects added yet</p>
                    <p className="text-xs text-[#56615a] mt-1">
                      Type a course name or code above and click "Add Subject" to configure your classroom's syllabus.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {availableSubjects.map((sub) => {
                      const isSelected = selectedSubjects.includes(sub);
                      return (
                        <div
                          key={sub}
                          onClick={() => toggleSubject(sub)}
                          className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold flex items-center justify-between cursor-pointer transition-all group ${
                            isSelected
                              ? 'bg-[#008069]/10 border-[#008069] text-[#1b1c1c] shadow-sm'
                              : 'bg-white border-[#E5E4E2] text-[#434844] hover:bg-[#F0EDED]'
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate pr-2">
                            <span
                              className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                                isSelected
                                  ? 'bg-[#008069] border-[#008069] text-white'
                                  : 'border-[#C3C8C3] bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 stroke-[3] text-white" />}
                            </span>
                            <span className="truncate">{sub}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSubject(sub, e)}
                              className="opacity-60 hover:opacity-100 hover:text-[#ba1a1a] p-1.5 rounded-xl hover:bg-red-50 transition-all"
                              title="Delete subject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#56615a] font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#008069]" />
                  <span>Subjects configured here will form your classroom repository structure.</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Admin & Permissions */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <div className="p-6 sm:p-7 rounded-3xl bg-[#F6F3F2] border-2 border-[#E5E4E2] space-y-3">
                <div className="flex items-center gap-3 text-base sm:text-lg font-black text-[#1b1c1c]">
                  <ShieldCheck className="w-6 h-6 text-[#008069]" />
                  Classroom Access Code Generated
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#008069] tracking-widest bg-white px-6 py-4 rounded-2xl border-2 border-[#008069]/30 inline-block shadow-sm">
                  {(course ? course.slice(0, 3) : 'CLS').toUpperCase()}{batchYear ? batchYear.slice(-2) : '26'}{section ? section.slice(-1).toUpperCase() : 'A'}
                </div>
                <p className="text-sm text-[#56615a] font-medium leading-relaxed">
                  Share this code with your classmates to let them immediately enter and download batch materials.
                </p>
              </div>

              <div className="space-y-5">
                <label className="flex items-start gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-[#E5E4E2] hover:bg-[#F9F8F6] cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={allowStudentUploads}
                    onChange={(e) => setAllowStudentUploads(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#008069] rounded-lg cursor-pointer"
                  />
                  <div>
                    <div className="text-base font-black text-[#1b1c1c]">Allow Student Notes Uploads</div>
                    <div className="text-sm text-[#56615a] font-medium mt-0.5">
                      Permit enrolled batch members to contribute study guides, PYQs, and class notes.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-[#E5E4E2] hover:bg-[#F9F8F6] cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={requireModeration}
                    onChange={(e) => setRequireModeration(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#008069] rounded-lg cursor-pointer"
                  />
                  <div>
                    <div className="text-base font-black text-[#1b1c1c]">Require Super Admin Moderation</div>
                    <div className="text-sm text-[#56615a] font-medium mt-0.5">
                      All new student uploads must be reviewed by an admin before appearing publicly.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-8 flex justify-between items-center border-t-2 border-[#F0EDED]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3.5 rounded-2xl border-2 border-[#E5E4E2] text-sm sm:text-base font-bold text-[#434844] hover:bg-[#F0EDED] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-[#737874] hover:text-[#1b1c1c] hover:bg-[#F0EDED] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="bg-[#008069] hover:bg-[#006a57] text-white font-black text-base sm:text-lg py-4 px-10 rounded-2xl transition-all flex items-center gap-2.5 shadow-lg cursor-pointer active:scale-98"
            >
              <span>{step === 3 ? 'Launch Classroom' : 'Next Step'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
