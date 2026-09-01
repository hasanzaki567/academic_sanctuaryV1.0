// ─────────────────────────────────────────────────────────────────────────────
// server/data/db.ts — In-memory data store (mock database)
// ─────────────────────────────────────────────────────────────────────────────

export let classrooms = [
  {
    id: 'cls-1',
    code: 'BTECH26A',
    name: 'B.Tech CSE 2026 - Section A',
    collegeName: 'Oxford University',
    location: 'Oxford, United Kingdom',
    department: 'Department of Computer Science & Engineering',
    course: 'B.Tech Computer Science & Engineering',
    degreeLevel: 'undergraduate',
    batchYear: '2026',
    section: 'Section A',
    semester: 'Semester 5',
    superAdminId: 'user-sarah',
    memberCount: 64,
    createdAt: '2024-08-15',
  },
  {
    id: 'cls-2',
    code: 'AIDS26A',
    name: 'B.Tech AI & Data Science 2026',
    collegeName: 'Stanford University',
    location: 'Stanford, California, USA',
    department: 'School of Engineering & AI',
    course: 'B.Tech Artificial Intelligence',
    degreeLevel: 'undergraduate',
    batchYear: '2026',
    section: 'Section A',
    semester: 'Semester 5',
    superAdminId: 'user-alex',
    memberCount: 42,
    createdAt: '2024-08-20',
  },
];

export let registeredUsers = [
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@oxford.edu',
    password: 'password123',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
    role: 'super_admin',
    department: 'Computer Science',
    rollNumber: 'CS22B042',
    classroomId: 'cls-1',
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    email: 'elena.r@oxford.edu',
    password: 'password123',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS22B029',
    classroomId: 'cls-1',
  },
  {
    id: 'user-michael',
    name: 'Michael Klein',
    email: 'michael.k@oxford.edu',
    password: 'password123',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
    role: 'admin',
    department: 'Computer Science',
    rollNumber: 'CS22B018',
    classroomId: 'cls-1',
  },
  {
    id: 'user-david',
    name: 'David Chen',
    email: 'david.c@oxford.edu',
    password: 'password123',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS22B011',
    classroomId: 'cls-1',
  },
  {
    id: 'user-alex',
    name: 'Alex Turner',
    email: 'alex.t@stanford.edu',
    password: 'password123',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A',
    role: 'super_admin',
    department: 'School of Engineering & AI',
    rollNumber: 'AI24B001',
    classroomId: 'cls-2',
  },
];

// Active session user (mock — in production this would be a JWT / session store)
export let currentUser = registeredUsers[0] as typeof registeredUsers[0] | null;

export function setCurrentUser(user: typeof registeredUsers[0] | null) {
  currentUser = user;
}

export let subjects = [
  { id: 'sub-ds',   classroomId: 'cls-1', code: 'CS301', name: 'Data Structures',            professor: 'Prof. Alan Turing',  description: 'Fundamental concepts of data organization, algorithms, and complexity analysis.', creditHours: 4, materialsCount: 14, notesCount: 8,  pyqsCount: 5 },
  { id: 'sub-os',   classroomId: 'cls-1', code: 'CS302', name: 'Operating Systems',           professor: 'Prof. A. Kumar',     description: 'Concurrency, process management, memory virtualisation, file systems.',           creditHours: 4, materialsCount: 18, notesCount: 11, pyqsCount: 6 },
  { id: 'sub-algo', classroomId: 'cls-1', code: 'CS303', name: 'Algorithm Analysis',          professor: 'Dr. S. Gupta',       description: 'Asymptotic notation, dynamic programming, greedy heuristics, NP-completeness.',   creditHours: 4, materialsCount: 12, notesCount: 7,  pyqsCount: 4 },
  { id: 'sub-cn',   classroomId: 'cls-1', code: 'CS304', name: 'Computer Networks',           professor: 'Dr. N. Singh',       description: 'OSI & TCP/IP stack, routing protocols, socket programming, network security.',     creditHours: 3, materialsCount: 16, notesCount: 9,  pyqsCount: 5 },
  { id: 'sub-dbms', classroomId: 'cls-1', code: 'CS305', name: 'Database Management Systems', professor: 'Dr. E. Codd',        description: 'Relational algebra, SQL, normalization, ACID transactions, NoSQL.',               creditHours: 4, materialsCount: 15, notesCount: 10, pyqsCount: 5 },
  { id: 'sub-toc',  classroomId: 'cls-1', code: 'CS306', name: 'Theory of Computation',       professor: 'Prof. N. Chomsky',   description: 'Automata, regular expressions, Turing machines, decidability, complexity.',       creditHours: 3, materialsCount: 10, notesCount: 6,  pyqsCount: 4 },
];

export let materials: any[] = [
  {
    id: 'mat-1', subjectId: 'sub-ds', subjectCode: 'CS301', subjectName: 'Data Structures',
    title: 'Trees & Graphs Deep Dive',
    description: 'Comprehensive guide covering BST, AVL Trees, Red-Black Trees, BFS/DFS, Dijkstra & A*.',
    type: 'notes', fileFormat: 'PDF', fileSize: '2.4 MB',
    uploadedBy: { id: 'user-sarah', name: 'Sarah J.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A', role: 'super_admin' },
    uploadedDate: 'Oct 12', downloadsCount: 142, viewsCount: 389, isVerified: true,
    tags: ['Trees', 'Graphs', 'BFS/DFS', 'AVL Trees'], unit: 'Unit 3 & 4',
    contentSnippet: '# Trees & Graphs Deep Dive\n\n## 1. Binary Search Trees (BST)\nA binary tree where every node in the left subtree has key ≤ node key.\n\n### Balanced Trees\n- **AVL Trees**: BF = |h_L - h_R| ≤ 1.\n\n## 2. Graph Algorithms\n- BFS: Queue, O(V+E). DFS: Stack/Recursion.',
  },
  {
    id: 'mat-2', subjectId: 'sub-ds', subjectCode: 'CS301', subjectName: 'Data Structures',
    title: 'Sorting Algorithms Summary',
    description: 'Time & space complexity cheat sheet for Quicksort, Mergesort, Heapsort, Radix Sort.',
    type: 'notes', fileFormat: 'PDF', fileSize: '1.8 MB',
    uploadedBy: { id: 'user-michael', name: 'Michael K.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg', role: 'admin' },
    uploadedDate: 'Oct 10', downloadsCount: 98, viewsCount: 245, isVerified: true,
    tags: ['Sorting', 'Complexity', 'Quicksort'], unit: 'Unit 2',
    contentSnippet: '# Sorting Quick Reference\n\n| Algorithm | Best | Average | Worst | Space | Stable? |\n|---|---|---|---|---|---|\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |',
  },
  {
    id: 'mat-7', subjectId: 'sub-ds', subjectCode: 'CS301', subjectName: 'Data Structures',
    title: '2023 Fall Midterm PYQ with Solutions',
    description: 'Official PYQ from Fall 2023 with step-by-step verified solutions.',
    type: 'pyqs', fileFormat: 'PDF', fileSize: '3.4 MB',
    uploadedBy: { id: 'user-sarah', name: 'Sarah J.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA', role: 'super_admin' },
    uploadedDate: 'Sep 28', downloadsCount: 310, viewsCount: 650, isVerified: true,
    tags: ['PYQ', '2023', 'Solved Paper'], unit: 'Past Exam',
  },
  {
    id: 'mat-4', subjectId: 'sub-os', subjectCode: 'CS302', subjectName: 'Operating Systems',
    title: 'Operating Systems Ch 4',
    description: 'Process Synchronization, Semaphores, Mutex Locks, Dining Philosophers.',
    type: 'materials', fileFormat: 'PDF', fileSize: '3.1 MB',
    uploadedBy: { id: 'prof-kumar', name: 'Prof. A. Kumar', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA', role: 'super_admin' },
    uploadedDate: 'Yesterday', downloadsCount: 215, viewsCount: 520, isVerified: true,
    tags: ['Synchronization', 'Semaphores', 'Deadlocks'], unit: 'Chapter 4',
  },
];

export let announcements: any[] = [
  { id: 'ann-1', classroomId: 'cls-1', title: 'Internal Exam Schedule Released for Mid-Semesters.', description: 'Mid-semester examinations will commence from the 5th of next month.', timestamp: 'Today, 09:00 AM', author: 'Admin Office', isUrgent: true },
  { id: 'ann-2', classroomId: 'cls-1', title: 'Guest Lecture: Advances in ML by Dr. V. Sharma in Hall 3.', description: 'All 3rd-year CS students are requested to attend.', timestamp: 'Yesterday', author: 'Prof. Alan Turing', isUrgent: false },
  { id: 'ann-3', classroomId: 'cls-1', title: 'Data Structures Assignment 3 Deadline Extended to Sunday.', description: 'Submit your Tree traversal and Graph cycle detection assignments via the portal.', timestamp: '3 days ago', author: 'Sarah Jenkins (Class Rep)', isUrgent: false },
];

export let exams: any[] = [
  { id: 'exam-1', classroomId: 'cls-1', subjectName: 'Data Structures',    subjectCode: 'CS301', date: '2026-09-05', daysRemaining: 12, time: '10:00 AM - 01:00 PM', venue: 'Academic Block B - Hall 201', progressPercent: 75 },
  { id: 'exam-2', classroomId: 'cls-1', subjectName: 'Operating Systems',  subjectCode: 'CS302', date: '2026-09-08', daysRemaining: 15, time: '10:00 AM - 01:00 PM', venue: 'Academic Block B - Hall 202', progressPercent: 60 },
  { id: 'exam-3', classroomId: 'cls-1', subjectName: 'Algorithm Analysis', subjectCode: 'CS303', date: '2026-09-12', daysRemaining: 19, time: '02:00 PM - 05:00 PM', venue: 'Computing Center 1',          progressPercent: 45 },
  { id: 'exam-4', classroomId: 'cls-1', subjectName: 'Computer Networks',  subjectCode: 'CS304', date: '2026-09-15', daysRemaining: 22, time: '10:00 AM - 01:00 PM', venue: 'Auditorium North',            progressPercent: 30 },
];

export let members: any[] = [
  { id: 'user-sarah',   name: 'Sarah Jenkins', email: 'sarah.j@oxford.edu',   avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA', role: 'super_admin', rollNumber: 'CS22B042', joinedDate: 'Aug 2024' },
  { id: 'user-michael', name: 'Michael Klein', email: 'michael.k@oxford.edu', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg', role: 'admin',       rollNumber: 'CS22B018', joinedDate: 'Aug 2024' },
  { id: 'user-elena',   name: 'Elena Rostova', email: 'elena.r@oxford.edu',   avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A', role: 'student',     rollNumber: 'CS22B029', joinedDate: 'Sep 2024' },
  { id: 'user-david',   name: 'David Chen',   email: 'david.c@oxford.edu',   avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ', role: 'student',     rollNumber: 'CS22B011', joinedDate: 'Sep 2024' },
];
