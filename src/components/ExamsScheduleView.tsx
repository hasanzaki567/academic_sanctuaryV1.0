import React, { useState, useMemo } from 'react';
import { Exam, Material, UserRole } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Plus,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Archive,
  Layers,
  ChevronRight,
  Eye,
  Download,
  Upload,
  BookOpen,
  Filter,
  ShieldCheck,
} from 'lucide-react';

interface ExamsScheduleViewProps {
  exams: Exam[];
  materials?: Material[];
  currentUserRole?: UserRole;
  onAddExam: (examData: any) => void;
  onToggleComplete?: (examId: string, currentCompleted?: boolean) => void;
  onNavigateToSubject: (subjectCode: string) => void;
  onPreviewMaterial?: (material: Material) => void;
  onDownloadMaterial?: (material: Material) => void;
  onOpenUpload?: (subjectId?: string, examType?: string) => void;
  onBack?: () => void;
}

export const ExamsScheduleView: React.FC<ExamsScheduleViewProps> = ({
  exams,
  materials = [],
  currentUserRole,
  onAddExam,
  onToggleComplete,
  onNavigateToSubject,
  onPreviewMaterial,
  onDownloadMaterial,
  onOpenUpload,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [selectedAssessmentFilter, setSelectedAssessmentFilter] = useState<string>('all');
  const [onlyWithMaterials, setOnlyWithMaterials] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form states
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [examType, setExamType] = useState('IAT 1');
  const [isCompletedInput, setIsCompletedInput] = useState(false);

  const isAdmin = currentUserRole === 'super_admin' || currentUserRole === 'admin';

  // Simulated current date
  const todayStr = '2026-09-05';

  const computeDays = (targetDate: string): number => {
    try {
      const today = new Date(todayStr + 'T00:00:00');
      const target = new Date(targetDate + 'T00:00:00');
      const diff = target.getTime() - today.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch {
      return 10;
    }
  };

  const formatDateDisplay = (dateStr: string): string => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to find recommended study materials for an exam based on subject & exam type
  const getRecommendedMaterials = (exam: Exam, currentGroupType?: string): Material[] => {
    if (!materials || materials.length === 0) return [];
    const examSubCode = (exam.subjectCode || '').trim().toLowerCase();
    const examSubName = (exam.subjectName || '').trim().toLowerCase();
    const targetExamType = (currentGroupType || exam.examType || exam.venue || '').trim().toLowerCase();

    return materials.filter((m) => {
      // 1. Must match the subject
      const matchesSubject =
        (m.subjectCode && m.subjectCode.trim().toLowerCase() === examSubCode) ||
        (m.subjectName && m.subjectName.trim().toLowerCase() === examSubName);
      if (!matchesSubject) return false;

      // 2. Must match the recommended assessment
      const recExam = (m.recommendedExam || '').trim().toLowerCase();
      if (!recExam) {
        if (
          targetExamType &&
          (m.tags?.some((t) => t.toLowerCase() === targetExamType) ||
            m.unit?.toLowerCase() === targetExamType)
        ) {
          return true;
        }
        return false;
      }

      if (
        recExam === 'all' ||
        recExam === 'all exams' ||
        recExam === 'general preparation' ||
        recExam === 'general'
      ) {
        return true;
      }

      if (recExam === targetExamType) return true;
      if (targetExamType && (recExam.includes(targetExamType) || targetExamType.includes(recExam))) {
        return true;
      }

      return false;
    });
  };

  const getSubjectMaterialsTotal = (exam: Exam): number => {
    if (!materials) return 0;
    const examSubCode = (exam.subjectCode || '').trim().toLowerCase();
    const examSubName = (exam.subjectName || '').trim().toLowerCase();
    return materials.filter(
      (m) =>
        (m.subjectCode && m.subjectCode.trim().toLowerCase() === examSubCode) ||
        (m.subjectName && m.subjectName.trim().toLowerCase() === examSubName)
    ).length;
  };

  // Check if exam is completed
  const isExamCompleted = (exam: Exam): boolean => {
    if (typeof exam.isCompleted === 'boolean') {
      return exam.isCompleted;
    }
    const days = exam.daysRemaining !== undefined ? exam.daysRemaining : computeDays(exam.date);
    return days < 0;
  };

  // Split into upcoming and completed
  const upcomingExams = exams.filter((e) => !isExamCompleted(e));
  const completedExams = exams.filter((e) => isExamCompleted(e));

  // Group upcoming exams by examType
  const groupsMap: { [type: string]: Exam[] } = {};
  upcomingExams.forEach((exam) => {
    const rawType = (exam.examType || exam.venue || 'General Assessment').trim();
    if (!groupsMap[rawType]) {
      groupsMap[rawType] = [];
    }
    groupsMap[rawType].push(exam);
  });

  // Sort subjects within each group chronologically by date and time
  Object.keys(groupsMap).forEach((type) => {
    groupsMap[type].sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return (a.time || '').localeCompare(b.time || '');
    });
  });

  // Order groups themselves based on which assessment commences first
  const allUpcomingGroups = Object.keys(groupsMap)
    .map((type) => {
      const subjectList = groupsMap[type];
      const earliestDate = subjectList[0]?.date || '9999-99-99';
      const earliestDays = computeDays(earliestDate);
      return {
        type,
        exams: subjectList,
        earliestDate,
        earliestDays,
        subjectCount: subjectList.length,
      };
    })
    .sort((g1, g2) => g1.earliestDate.localeCompare(g2.earliestDate));

  // Filter groups according to user selection
  const sortedUpcomingGroups = allUpcomingGroups
    .filter((g) => {
      if (selectedAssessmentFilter !== 'all' && g.type !== selectedAssessmentFilter) {
        return false;
      }
      return true;
    })
    .map((g) => {
      if (!onlyWithMaterials) return g;
      const filteredExams = g.exams.filter(
        (ex) => getRecommendedMaterials(ex, g.type).length > 0
      );
      return {
        ...g,
        exams: filteredExams,
        subjectCount: filteredExams.length,
      };
    })
    .filter((g) => g.exams.length > 0);

  // Available assessment types
  const availableAssessmentTypes = useMemo(() => {
    const types = new Set<string>();
    exams.forEach((e) => {
      const t = (e.examType || e.venue || '').trim();
      if (t) types.add(t);
    });
    return Array.from(types);
  }, [exams]);

  // Overall count of recommended materials linked in upcoming schedule
  const totalRecommendedCount = useMemo(() => {
    let count = 0;
    upcomingExams.forEach((e) => {
      count += getRecommendedMaterials(e).length;
    });
    return count;
  }, [upcomingExams, materials]);

  // Sort completed exams with most recent first
  const sortedCompletedExams = [...completedExams].sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    return dateB.localeCompare(dateA);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    
    onAddExam({
      subjectName,
      subjectCode: subjectCode || 'CS300',
      date,
      time,
      examType: examType.trim() || 'IAT 1',
      isCompleted: isCompletedInput,
    });

    setSubjectName('');
    setSubjectCode('');
    setExamType('IAT 1');
    setIsCompletedInput(false);
    setShowAddModal(false);
  };

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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#737874] uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#56615a]" /> Examination Schedule & Timetable
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
            Exam Assessment Timetable
          </h1>
          <p className="text-sm text-[#434844] mt-1 max-w-2xl">
            Subjects are categorized by assessment type (IAT 1, IAT 2, SEM) and arranged in chronological order by commencement date.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Exam Schedule
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#d9e6dc]/60 text-[#56615a] text-xs font-bold rounded-xl border border-[#c3d1c7]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Managed Timetable</span>
          </div>
        )}
      </div>

      {/* Filter Tabs and Assessment Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E2E1] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#56615a] text-white shadow-xs'
                  : 'bg-[#FEFEFA] text-[#56615a] hover:bg-[#F3EFE6] border border-[#E5E4E2]'
              }`}
            >
              All Schedules ({exams.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-[#56615a] text-white shadow-xs'
                  : 'bg-[#FEFEFA] text-[#56615a] hover:bg-[#F3EFE6] border border-[#E5E4E2]'
              }`}
            >
              <span>Upcoming Assessments</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'upcoming'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#56615a]/10 text-[#56615a]'
                }`}
              >
                {upcomingExams.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-[#56615a] text-white shadow-xs'
                  : 'bg-[#FEFEFA] text-[#56615a] hover:bg-[#F3EFE6] border border-[#E5E4E2]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed Exams</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'completed'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#56615a]/10 text-[#56615a]'
                }`}
              >
                {completedExams.length}
              </span>
            </button>
          </div>

          {/* Recommended Materials Indicator */}
          {totalRecommendedCount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#EAF1EA] text-[#2A6E3B] border border-[#B5DEC0] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e5a93c]" />
                <span>{totalRecommendedCount} Study Documents Linked to Timetable</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#F6F3F2] text-[#56615a] border border-[#E5E4E2] px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#56615a]" />
                <span>Timetable ready for exam dates</span>
              </span>
            </div>
          )}
        </div>

        {/* Assessment and Material Filters Bar */}
        {(activeTab === 'all' || activeTab === 'upcoming') && availableAssessmentTypes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 bg-[#F9F7F4] p-3 rounded-2xl border border-[#E5E4E2]">
            <span className="text-[11px] font-bold text-[#737874] uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#56615a]" /> Filter Assessment:
            </span>
            <button
              onClick={() => setSelectedAssessmentFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedAssessmentFilter === 'all'
                  ? 'bg-[#56615a] text-white shadow-2xs'
                  : 'bg-white text-[#56615a] hover:bg-[#F0EDED] border border-[#D1D5DB]'
              }`}
            >
              All Types
            </button>
            {availableAssessmentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedAssessmentFilter(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAssessmentFilter === type
                    ? 'bg-[#56615a] text-white shadow-2xs'
                    : 'bg-white text-[#56615a] hover:bg-[#F0EDED] border border-[#D1D5DB]'
                }`}
              >
                {type}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setOnlyWithMaterials(!onlyWithMaterials)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  onlyWithMaterials
                    ? 'bg-[#2A6E3B] text-white border-[#2A6E3B]'
                    : 'bg-white text-[#434844] hover:text-[#1b1c1c] border-[#D1D5DB]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#e5a93c]" />
                <span>With Recommended Material Only</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPCOMING EXAMS SECTION (GROUPED BY TYPE AND ORDERED BY COMMENCEMENT DATE) */}
      {(activeTab === 'all' || activeTab === 'upcoming') && (
        <div className="space-y-12 mb-16">
          {sortedUpcomingGroups.length === 0 ? (
            <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#56615a]/10 text-[#56615a] flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1b1c1c]">No Exams in Timetable</h3>
              <p className="text-xs text-[#737874] mt-1 max-w-sm mx-auto">
                {onlyWithMaterials
                  ? 'No upcoming exams currently have recommended materials matching this filter.'
                  : 'Add your semester dates, internal assessments, or midterms to track preparation timelines.'}
              </p>
              {onlyWithMaterials ? (
                <button
                  onClick={() => setOnlyWithMaterials(false)}
                  className="mt-3 px-3 py-1.5 bg-[#56615a] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Show All Exams
                </button>
              ) : isAdmin ? (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Exam</span>
                </button>
              ) : (
                <div className="mt-3 px-3.5 py-2 bg-[#F0EDED] text-[#56615a] text-xs font-semibold rounded-xl inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timetable will appear once posted by cohort administrators.</span>
                </div>
              )}
            </div>
          ) : (
            sortedUpcomingGroups.map((group, groupIdx) => {
              const daysLeft = group.earliestDays;
              const countdownLabel =
                daysLeft === 0
                  ? 'Commencing Today'
                  : daysLeft === 1
                  ? 'Commencing Tomorrow'
                  : daysLeft > 1
                  ? `Commencing in ${daysLeft} days`
                  : 'In Progress';

              return (
                <section
                  key={group.type}
                  id={`section-${group.type.toLowerCase().replace(/\s+/g, '-')}`}
                  className="space-y-4"
                >
                  {/* Assessment Type Header */}
                  <div className="bg-gradient-to-r from-[#F6F3F2] via-[#FAF8F5] to-transparent p-5 rounded-2xl border border-[#E5E4E2] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#56615a] text-white flex items-center justify-center font-black text-sm shadow-xs">
                        #{groupIdx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-2xl font-extrabold text-[#1b1c1c] tracking-tight">
                            {group.type}
                          </h2>
                          <span className="bg-[#56615a]/10 text-[#2c332e] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#56615a]/20">
                            {group.subjectCount} {group.subjectCount === 1 ? 'Subject' : 'Subjects'}
                          </span>
                        </div>
                        <p className="text-xs text-[#56615a] font-medium mt-0.5 flex items-center gap-1.5">
                          <span>First Exam Starts:</span>
                          <strong>{formatDateDisplay(group.earliestDate)}</strong>
                          <span className="text-[#737874]">• Recommended materials for this assessment shown below</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-white rounded-xl border border-[#E5E4E2] text-xs font-bold text-[#1b1c1c] shadow-2xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#56615a]" />
                        {countdownLabel}
                      </span>
                    </div>
                  </div>

                  {/* Box beneath the Exam Heading containing Subjects as Horizontal Rectangles */}
                  <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-4 md:p-5 shadow-xs flex flex-col gap-3">
                    {group.exams.map((exam, examIdx) => {
                      const daysRemaining =
                        exam.daysRemaining !== undefined ? exam.daysRemaining : computeDays(exam.date);
                      const recommendedMats = getRecommendedMaterials(exam, group.type);
                      const subjectTotalCount = getSubjectMaterialsTotal(exam);

                      return (
                        <div
                          key={exam.id}
                          className="bg-white border border-[#EAE8E5] hover:border-[#56615a] rounded-xl p-4 md:p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 group"
                        >
                          {/* Left Column: Code, Subject Title, Schedule Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="bg-[#b2beb5]/25 text-[#434844] px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#b2beb5]/30">
                                {exam.subjectCode}
                              </span>
                              <span className="text-[11px] font-bold text-[#737874] bg-[#F6F3F2] px-2 py-0.5 rounded-md border border-[#E5E4E2]">
                                Subject {examIdx + 1} of {group.subjectCount}
                              </span>
                              {exam.venue && (
                                <span className="text-xs text-[#737874] flex items-center gap-1 font-medium">
                                  <Tag className="w-3 h-3 text-[#56615a]" /> {exam.venue}
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-[#1b1c1c] group-hover:text-[#56615a] transition-colors leading-snug">
                              {exam.subjectName}
                            </h3>

                            {/* Clean schedule metadata line */}
                            <div className="flex items-center gap-4 text-xs text-[#434844] mt-2 flex-wrap">
                              <span className="flex items-center gap-1.5 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-[#56615a]" />
                                <strong className="text-[#1b1c1c]">{formatDateDisplay(exam.date)}</strong>
                              </span>
                              <span className="text-[#DCDAD6] hidden sm:inline">&bull;</span>
                              <span className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-3.5 h-3.5 text-[#56615a]" />
                                <span>{exam.time}</span>
                              </span>
                              {exam.syllabus && (
                                <>
                                  <span className="text-[#DCDAD6] hidden sm:inline">&bull;</span>
                                  <span className="text-[#737874] truncate max-w-xs sm:max-w-md">
                                    Syllabus: <strong className="text-[#434844] font-semibold">{exam.syllabus}</strong>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Middle Column: Recommended Study Notes (Clean pill & direct preview) */}
                          <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-start gap-2 py-2 xl:py-0 border-y xl:border-y-0 xl:border-x border-[#F0EDED] px-0 xl:px-5 flex-shrink-0">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#e5a93c]" />
                              <span className="text-xs font-bold text-[#1b1c1c]">Exam Prep Materials:</span>
                            </div>

                            {recommendedMats.length > 0 ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-[#2A6E3B] bg-[#EBF3ED] border border-[#B5DEC0] px-2.5 py-1 rounded-lg flex items-center gap-1">
                                  {recommendedMats.length} {recommendedMats.length === 1 ? 'Doc' : 'Docs'} Ready
                                </span>
                                {onPreviewMaterial && (
                                  <button
                                    type="button"
                                    onClick={() => onPreviewMaterial(recommendedMats[0])}
                                    className="text-xs font-bold text-[#56615a] hover:text-[#1b1c1c] underline flex items-center gap-1 cursor-pointer"
                                    title={recommendedMats[0].title}
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Read Notes</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#737874]">No prep doc tagged</span>
                                {onOpenUpload && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenUpload(exam.id, group.type)}
                                    className="text-xs font-bold text-[#56615a] hover:underline cursor-pointer"
                                  >
                                    + Upload
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right Column: Days Remaining & Actions */}
                          <div className="flex items-center justify-between xl:justify-end gap-4 flex-shrink-0">
                            <div className="text-left xl:text-right">
                              <div className="flex items-baseline gap-1 xl:justify-end">
                                <span className="text-2xl font-black text-[#1b1c1c] leading-none">
                                  {daysRemaining >= 0 ? daysRemaining : 0}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-[#737874] tracking-wider">
                                  {daysRemaining === 1 ? 'day left' : 'days left'}
                                </span>
                              </div>
                              <span className="text-[11px] font-semibold text-[#56615a] block mt-0.5">
                                {daysRemaining === 0 ? 'Starts Today!' : daysRemaining < 0 ? 'Concluded' : 'Upcoming'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {onToggleComplete && (
                                <button
                                  onClick={() => onToggleComplete(exam.id, false)}
                                  className="px-3 py-2 bg-[#F6F3F2] hover:bg-[#E8F3EB] text-[#56615a] hover:text-[#2A6E3B] text-xs font-bold rounded-xl transition-colors border border-[#E5E4E2] hover:border-[#B5DEC0] flex items-center gap-1.5 cursor-pointer"
                                  title="Mark this subject exam as completed"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Mark Done</span>
                                </button>
                              )}

                              <button
                                onClick={() => onNavigateToSubject(exam.subjectCode)}
                                className="px-3 py-2 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                title={`Browse all notes for ${exam.subjectCode}`}
                              >
                                <span>Notes</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </div>
      )}

      {/* COMPLETED EXAMS SECTION */}
      {(activeTab === 'all' || activeTab === 'completed') && (
        <section className="mt-12 pt-8 border-t-2 border-dashed border-[#E4E2E1]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2A6E3B]/10 text-[#2A6E3B] flex items-center justify-center">
                  <Archive className="w-4 h-4" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#1b1c1c] tracking-tight">
                  Completed Exams
                </h2>
                <span className="bg-[#2A6E3B]/10 text-[#2A6E3B] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#2A6E3B]/20">
                  {sortedCompletedExams.length} Concluded
                </span>
              </div>
              <p className="text-xs text-[#737874] mt-1">
                Archived timetable of exams that were successfully concluded or marked as finished.
              </p>
            </div>
          </div>

          {sortedCompletedExams.length === 0 ? (
            <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-8 text-center">
              <p className="text-xs text-[#737874]">
                No completed exams recorded yet. Once an assessment date passes or you click &quot;Mark Done&quot;, it will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-[#FEFEFA] border border-[#E5E4E2] rounded-2xl p-4 md:p-5 shadow-xs flex flex-col gap-3">
              {sortedCompletedExams.map((exam) => {
                const recMats = getRecommendedMaterials(exam, exam.examType);

                return (
                  <div
                    key={exam.id}
                    className="bg-white border border-[#EAE8E5] rounded-xl p-4 md:p-5 transition-all shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-4 opacity-90 hover:opacity-100"
                  >
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="bg-[#E4E2E1] text-[#56615a] px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          {exam.subjectCode}
                        </span>
                        <span className="bg-[#2A6E3B]/10 text-[#2A6E3B] px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 border border-[#2A6E3B]/20">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                        <span className="px-2 py-0.5 bg-[#F6F3F2] rounded-md text-[11px] font-bold text-[#56615a] border border-[#E5E4E2]">
                          {exam.examType || exam.venue || 'IAT 1'}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-[#1b1c1c] leading-snug line-through decoration-[#737874]/40">
                        {exam.subjectName}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-[#737874] mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#737874]" />
                          Held on: <strong>{formatDateDisplay(exam.date)}</strong>
                        </span>
                        <span className="text-[#DCDAD6] hidden sm:inline">&bull;</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#737874]" />
                          Time: <strong>{exam.time}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Notes studied recap */}
                    {recMats.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap py-2 xl:py-0 border-y xl:border-y-0 xl:border-x border-[#F0EDED] px-0 xl:px-5 flex-shrink-0">
                        <span className="text-xs font-semibold text-[#56615a]">
                          Notes studied:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {recMats.slice(0, 2).map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => onPreviewMaterial && onPreviewMaterial(m)}
                              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#F6F3F2] hover:bg-[#EAE7E6] text-[#1b1c1c] border border-[#E5E4E2] truncate max-w-[180px] cursor-pointer"
                              title={m.title}
                            >
                              {m.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Right: Actions */}
                    <div className="flex items-center justify-between xl:justify-end gap-3 flex-shrink-0">
                      {onToggleComplete && (
                        <button
                          onClick={() => onToggleComplete(exam.id, true)}
                          className="px-3 py-2 bg-[#F6F3F2] hover:bg-white text-[#56615a] text-xs font-bold rounded-xl border border-[#E5E4E2] flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Move back to upcoming schedule"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Mark Upcoming</span>
                        </button>
                      )}

                      <button
                        onClick={() => onNavigateToSubject(exam.subjectCode)}
                        className="px-3 py-2 bg-[#56615a] hover:bg-[#434d46] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Notes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Add Exam Timetable Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E5E4E2] shadow-2xl">
            <h3 className="text-xl font-bold text-[#1b1c1c] mb-1">Add Exam Timetable Entry</h3>
            <p className="text-xs text-[#737874] mb-4">
              Post an upcoming assessment (e.g. IAT 1, IAT 2, SEM). Timetables will automatically group by assessment type and order chronologically.
            </p>

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
                <label className="text-xs font-bold text-[#434844] block mb-1">
                  Assessment / Exam Type *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IAT 1, IAT 2, SEM, Model Exam"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="paper-input w-full p-2.5 rounded-lg text-xs font-medium text-[#1b1c1c]"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-[#737874] font-medium">Presets:</span>
                  {['IAT 1', 'IAT 2', 'SEM', 'Model Exam', 'Quiz'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setExamType(preset)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                        examType === preset
                          ? 'bg-[#56615a] text-white border-[#56615a] shadow-xs'
                          : 'bg-[#F6F3F2] text-[#56615a] border-[#E4E2E1] hover:bg-[#EAE7E6]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="markCompletedCheckbox"
                  checked={isCompletedInput}
                  onChange={(e) => setIsCompletedInput(e.target.checked)}
                  className="rounded border-[#E4E2E1] text-[#56615a] focus:ring-[#56615a] cursor-pointer"
                />
                <label htmlFor="markCompletedCheckbox" className="text-xs text-[#434844] cursor-pointer">
                  This exam is already completed (add directly to Completed Archive)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#737874] hover:bg-[#F0EDED] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#56615a] hover:bg-[#424d46] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Add to Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
