import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, Scale, Lock, BookOpen, ExternalLink, Printer } from 'lucide-react';

export type LegalDocType = 'terms' | 'privacy' | 'honor';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocType>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="bg-[#FDFCF8] border border-[#E5E4E2] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_20px_50px_rgba(27,28,28,0.15)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E4E2] flex items-center justify-between bg-[#F9F7F1]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D9E6DC] text-[#3E4942] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg font-bold text-[#1b1c1c] leading-tight">
                Academic Sanctuary Legal & Trust
              </h2>
              <p className="text-xs text-[#737874]">
                Effective Date: September 2024 • Academic Cohort Governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="legal-print-button"
              onClick={handlePrint}
              title="Print Document"
              className="p-2 text-[#737874] hover:text-[#1b1c1c] hover:bg-[#EAE8E7] rounded-lg transition-colors cursor-pointer"
              aria-label="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              id="legal-close-button"
              onClick={onClose}
              className="p-2 text-[#737874] hover:text-[#1b1c1c] hover:bg-[#EAE8E7] rounded-lg transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E4E2] bg-[#FDFCF8] px-6 gap-2 pt-2">
          <button
            id="tab-terms-of-service"
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#56615a] text-[#1b1c1c]'
                : 'border-transparent text-[#737874] hover:text-[#1b1c1c]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
          <button
            id="tab-privacy-policy"
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#56615a] text-[#1b1c1c]'
                : 'border-transparent text-[#737874] hover:text-[#1b1c1c]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            id="tab-academic-integrity"
            onClick={() => setActiveTab('honor')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'honor'
                ? 'border-[#56615a] text-[#1b1c1c]'
                : 'border-transparent text-[#737874] hover:text-[#1b1c1c]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Honor Code & Fair Use</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-[#434844] text-sm leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <span className="text-xs font-semibold text-[#56615a] tracking-wider uppercase">Agreement</span>
                <h3 className="text-xl font-bold text-[#1b1c1c] mt-0.5 mb-2">Terms of Service</h3>
                <p>
                  Welcome to <strong>Academic Sanctuary</strong>. By creating an account, joining a cohort classroom, uploading course notes, or accessing academic resources on our platform, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, you must discontinue platform use.
                </p>
              </div>

              <section className="bg-[#F9F7F1] p-4 rounded-xl border border-[#E5E4E2] space-y-2">
                <h4 className="font-bold text-[#1b1c1c] flex items-center gap-1.5 text-sm">
                  <FileText className="w-4 h-4 text-[#56615a]" />
                  1. Purpose & Cohort Boundary
                </h4>
                <p className="text-xs md:text-sm">
                  Academic Sanctuary is designed exclusively as a collaborative educational sanctuary for verified university cohorts, classes, and academic departments. Each classroom maintains a distinct security perimeter accessible only by students and educators holding authorized access keys or approvals.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">2. Student-Contributed Content & Intellectual Property</h4>
                <p>
                  Students and moderators retain ownership of their personal study summaries, handwritten lecture annotations, and original notes uploaded to Academic Sanctuary.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                  <li>
                    <strong>Peer Study License:</strong> By sharing notes within your cohort classroom, you grant enrolled classroom peers a non-exclusive, royalty-free license to view, annotate, and reference materials solely for private academic preparation.
                  </li>
                  <li>
                    <strong>Commercial Resale Prohibition:</strong> Users are strictly prohibited from scraping, redistributing, or monetizing fellow classmates’ study guides on third-party commercial portals.
                  </li>
                  <li>
                    <strong>Fair Use & Attribution:</strong> Any reference to university syllabus textbooks, professor presentations, or standardized questions must adhere to statutory educational fair-use principles with proper academic attribution.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">3. Moderation & Administrative Roles</h4>
                <p>
                  Each classroom is governed by designated <strong>Super Admins</strong> and <strong>Admins</strong> who hold permissions to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
                  <li>Curate, verify, or archive subject resources and examination schedules.</li>
                  <li>Approve pending membership requests or revoke unauthorized access.</li>
                  <li>Remove materials that infringe copyright or compromise legitimate academic integrity.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">4. Prohibited Conduct</h4>
                <p>
                  You agree never to use Academic Sanctuary to transmit malicious software, harass classmates, impersonate faculty or fellow students, or distribute unauthorized real-time exam answers during proctored testing sessions.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">5. Termination & Access Revocation</h4>
                <p>
                  We reserve the right to suspend or terminate accounts that violate classroom rules or university codes of conduct upon notice from classroom administrators or university officials.
                </p>
              </section>

              <section className="space-y-2 text-xs text-[#737874] border-t border-[#E5E4E2] pt-4">
                <p>
                  Questions about our Terms? Contact our academic coordination desk at <span className="font-medium text-[#1b1c1c]">support@academicsanctuary.internal</span>.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <span className="text-xs font-semibold text-[#56615a] tracking-wider uppercase">Privacy & Data Governance</span>
                <h3 className="text-xl font-bold text-[#1b1c1c] mt-0.5 mb-2">Privacy Policy</h3>
                <p>
                  At <strong>Academic Sanctuary</strong>, we recognize the sensitivity of student records, academic conversations, and peer study materials. This Privacy Policy details how your personal information is gathered, safeguarded, and isolated within your respective classroom environment.
                </p>
              </div>

              <section className="bg-[#F9F7F1] p-4 rounded-xl border border-[#E5E4E2] space-y-2">
                <h4 className="font-bold text-[#1b1c1c] flex items-center gap-1.5 text-sm">
                  <Lock className="w-4 h-4 text-[#56615a]" />
                  Zero Third-Party Advertising Policy
                </h4>
                <p className="text-xs md:text-sm">
                  We never sell, rent, or monetize your academic activity, student profiles, notes, or messages to third-party ad networks. Your classroom data belongs to your cohort.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">1. Information Collected</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm">
                  <li>
                    <strong>Identity & Credentials:</strong> Full name, university email address, roll number, academic department, and avatar photo provided during profile creation.
                  </li>
                  <li>
                    <strong>Academic Contributions:</strong> Uploaded lecture PDFs, exam guides, summaries, subject associations, and forward histories.
                  </li>
                  <li>
                    <strong>Cohort Interactions:</strong> Real-time cohort group messages, direct peer communications, and read receipt timestamps.
                  </li>
                  <li>
                    <strong>Technical Telemetry:</strong> Minimal session tokens required to sustain persistent login and secure WebSocket channel authentication.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">2. How We Use and Isolate Information</h4>
                <p>
                  Information collected is strictly utilized to deliver the core academic collaboration experience:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
                  <li>Authenticating your membership within your university batch.</li>
                  <li>Indexing course materials by subject and semester for peer search.</li>
                  <li>Transmitting exam notifications and classroom bulletin updates.</li>
                  <li>Displaying contributor recognition on uploaded notes.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">3. Classroom Cohort Isolation</h4>
                <p>
                  Materials and discussion channels are bound by cryptographic or role-restricted classroom IDs. A student enrolled in Oxford Computer Science 2026 cannot view or query study repositories of another batch without an explicit invite code and administrator clearance.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">4. Student Rights & Data Portability</h4>
                <p>
                  You have the right at any time to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm">
                  <li>Export copies of study documents authored by your account.</li>
                  <li>Edit or anonymize your display name and contact handles.</li>
                  <li>Request permanent deletion of your profile and personal notes repository upon graduation or cohort transfer.</li>
                </ul>
              </section>

              <section className="space-y-2 text-xs text-[#737874] border-t border-[#E5E4E2] pt-4">
                <p>
                  Data Protection Officer inquiries: <span className="font-medium text-[#1b1c1c]">privacy@academicsanctuary.internal</span>.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'honor' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <span className="text-xs font-semibold text-[#56615a] tracking-wider uppercase">Academic Integrity</span>
                <h3 className="text-xl font-bold text-[#1b1c1c] mt-0.5 mb-2">Honor Code & Fair Use Policy</h3>
                <p>
                  Academic Sanctuary thrives on mutual trust, scholarly ethics, and supportive peer teamwork. All members pledge to uphold this Honor Code.
                </p>
              </div>

              <section className="bg-[#D9E6DC]/40 p-4 rounded-xl border border-[#C3C8C3]/60 space-y-2">
                <h4 className="font-bold text-[#1b1c1c] flex items-center gap-1.5 text-sm">
                  <BookOpen className="w-4 h-4 text-[#3E4942]" />
                  The Sanctuary Pledge
                </h4>
                <p className="text-xs md:text-sm text-[#27322B]">
                  "As a scholar in this sanctuary, I contribute knowledge with integrity, acknowledge the scholarly work of peers and faculty, and pledge to use these resources to deepen genuine understanding rather than bypass academic effort."
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">1. Ethical Study Habits</h4>
                <p className="text-xs md:text-sm">
                  Notes and past papers are intended for review, revision synthesis, and conceptual mastery. Users must never present another student's unedited project work, term papers, or graded lab deliverables as their own.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">2. Examination Protection</h4>
                <p className="text-xs md:text-sm">
                  Sharing live, in-progress examination or quiz questions while a testing window is open constitutes an immediate violation of university honor codes and will lead to automatic account suspension and administrative reporting.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-[#1b1c1c]">3. Quality & Responsible Sharing</h4>
                <p className="text-xs md:text-sm">
                  When uploading lecture materials, ensure legible scans, accurate course codes, and respectful comments that foster an encouraging academic environment for all cohort peers.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E4E2] bg-[#F9F7F1] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-[#737874]">
            Academic Sanctuary • Open Academic Standards
          </div>
          <button
            id="legal-understood-button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#56615a] hover:bg-[#434d46] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
