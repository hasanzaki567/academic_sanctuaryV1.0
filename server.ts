import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initial Mock Database
let classrooms = [
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

let registeredUsers = [
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

let currentUser = registeredUsers[0];

let subjects = [
  {
    id: 'sub-ds',
    classroomId: 'cls-1',
    code: 'CS301',
    name: 'Data Structures',
    professor: 'Prof. Alan Turing',
    description: 'Fundamental concepts of data organization, algorithms, and complexity analysis essential for efficient software development.',
    creditHours: 4,
    materialsCount: 14,
    notesCount: 8,
    pyqsCount: 5,
  },
  {
    id: 'sub-os',
    classroomId: 'cls-1',
    code: 'CS302',
    name: 'Operating Systems',
    professor: 'Prof. A. Kumar',
    description: 'Concurrency, process management, memory virtualisation, file systems and distributed operating system architectures.',
    creditHours: 4,
    materialsCount: 18,
    notesCount: 11,
    pyqsCount: 6,
  },
  {
    id: 'sub-algo',
    classroomId: 'cls-1',
    code: 'CS303',
    name: 'Algorithm Analysis',
    professor: 'Dr. S. Gupta',
    description: 'Asymptotic notation, dynamic programming, divide-and-conquer, greedy heuristics, NP-completeness and graph algorithms.',
    creditHours: 4,
    materialsCount: 12,
    notesCount: 7,
    pyqsCount: 4,
  },
  {
    id: 'sub-cn',
    classroomId: 'cls-1',
    code: 'CS304',
    name: 'Computer Networks',
    professor: 'Dr. N. Singh',
    description: 'OSI & TCP/IP stack layers, routing protocols, flow and congestion control, socket programming and network security.',
    creditHours: 3,
    materialsCount: 16,
    notesCount: 9,
    pyqsCount: 5,
  },
  {
    id: 'sub-dbms',
    classroomId: 'cls-1',
    code: 'CS305',
    name: 'Database Management Systems',
    professor: 'Dr. E. Codd',
    description: 'Relational algebra, SQL schema normalization, indexing, ACID transactions and distributed NoSQL systems.',
    creditHours: 4,
    materialsCount: 15,
    notesCount: 10,
    pyqsCount: 5,
  },
  {
    id: 'sub-toc',
    classroomId: 'cls-1',
    code: 'CS306',
    name: 'Theory of Computation',
    professor: 'Prof. N. Chomsky',
    description: 'Automata theory, regular expressions, context-free grammars, Turing machines, decidability and computational complexity.',
    creditHours: 3,
    materialsCount: 10,
    notesCount: 6,
    pyqsCount: 4,
  },
];

let materials = [
  {
    id: 'mat-1',
    subjectId: 'sub-ds',
    subjectCode: 'CS301',
    subjectName: 'Data Structures',
    title: 'Trees & Graphs Deep Dive',
    description: 'Comprehensive guide covering Binary Search Trees, AVL Trees, Red-Black Trees, Graph traversals (BFS/DFS), Dijkstra & A* shortest paths.',
    type: 'notes',
    fileFormat: 'PDF',
    fileSize: '2.4 MB',
    uploadedBy: {
      id: 'user-sarah',
      name: 'Sarah J.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOr9ihyIm8fSL2h8ABIdrhEVsTaSSF1MtWlN3-YQRsFcatsotXnT-Tfz31RRQSgyBaGTFnMG3ZGt8-p2sw8GjnpuUO7yGjxsa11thhS0YCg3XmDsccUBx_Pswu3idSrwAlTd8vKzteip1VJeTr8GdDPfUHN7HqksrK4F0q2hknVgq0tJPtorwnixkwU2OyTcR6qrX4XGogOpYu7-tfu6gvAe9Qxu6fGwcudfTfRMW-g0WyhVbb7_v17A',
      role: 'super_admin',
    },
    uploadedDate: 'Oct 12',
    downloadsCount: 142,
    viewsCount: 389,
    isVerified: true,
    tags: ['Trees', 'Graphs', 'BFS/DFS', 'AVL Trees'],
    unit: 'Unit 3 & 4',
    contentSnippet: '# Trees & Graphs Deep Dive\n\n## 1. Binary Search Trees (BST)\nA binary tree where every node in the left subtree has key ≤ node key, and right subtree has key > node key.\n\n### Balanced Trees\n- **AVL Trees**: Strict height balancing where balance factor BF = |h_L - h_R| ≤ 1.\n- **Rotations**: Single left (LL), single right (RR), double left-right (LR), double right-left (RL).\n\n## 2. Graph Algorithms\n- BFS: Uses Queue, O(V + E), shortest path in unweighted graphs.\n- DFS: Uses Stack / Recursion, cycle detection, topological sorting.',
  },
  {
    id: 'mat-2',
    subjectId: 'sub-ds',
    subjectCode: 'CS301',
    subjectName: 'Data Structures',
    title: 'Sorting Algorithms Summary',
    description: 'Time & space complexity cheat sheet for Quicksort, Mergesort, Heapsort, Radix Sort, with stability analysis and edge-case code samples.',
    type: 'notes',
    fileFormat: 'PDF',
    fileSize: '1.8 MB',
    uploadedBy: {
      id: 'user-michael',
      name: 'Michael K.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
      role: 'admin',
    },
    uploadedDate: 'Oct 10',
    downloadsCount: 98,
    viewsCount: 245,
    isVerified: true,
    tags: ['Sorting', 'Complexity', 'Quicksort', 'Heapsort'],
    unit: 'Unit 2',
    contentSnippet: '# Sorting Algorithms Quick Reference\n\n| Algorithm | Best | Average | Worst | Space | Stable? |\n|---|---|---|---|---|---|\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |\n| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |',
  },
  {
    id: 'mat-3',
    subjectId: 'sub-ds',
    subjectCode: 'CS301',
    subjectName: 'Data Structures',
    title: 'Midterm Review Notes',
    description: 'Consolidated review questions and high-yield theorems for Midterm Exam 1. Includes solved problems from past 3 years.',
    type: 'notes',
    fileFormat: 'DOCX',
    fileSize: '540 KB',
    uploadedBy: {
      id: 'user-elena',
      name: 'Elena R.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
      role: 'student',
    },
    uploadedDate: 'Oct 05',
    downloadsCount: 167,
    viewsCount: 412,
    isVerified: true,
    tags: ['Midterm', 'Exam Prep', 'Formulas'],
    unit: 'Unit 1-3',
    contentSnippet: '# Data Structures Midterm Review\n\n## Important Concepts Checklist:\n1. Array vs Linked List trade-offs in cache locality\n2. Stack applications (Infix to Postfix evaluation, Parentheses matching)\n3. Circular Queue implementation and modular arithmetic\n4. Hashing collision resolution (Chaining vs Open Addressing)',
  },
  {
    id: 'mat-4',
    subjectId: 'sub-os',
    subjectCode: 'CS302',
    subjectName: 'Operating Systems',
    title: 'Operating Systems Ch 4',
    description: 'Process Synchronization, Semaphores, Mutex Locks, Monitors, and Classic Synchronization Problems (Dining Philosophers, Readers-Writers).',
    type: 'materials',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    uploadedBy: {
      id: 'prof-kumar',
      name: 'Prof. A. Kumar',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
      role: 'super_admin',
    },
    uploadedDate: 'Yesterday',
    downloadsCount: 215,
    viewsCount: 520,
    isVerified: true,
    tags: ['Synchronization', 'Semaphores', 'Deadlocks'],
    unit: 'Chapter 4',
  },
  {
    id: 'mat-5',
    subjectId: 'sub-algo',
    subjectCode: 'CS303',
    subjectName: 'Algorithm Analysis',
    title: 'Algorithm Analysis Notes',
    description: 'Master Theorem proofs, divide and conquer recurrences, amortized analysis with aggregate and potential method.',
    type: 'notes',
    fileFormat: 'DOCX',
    fileSize: '1.2 MB',
    uploadedBy: {
      id: 'user-sgupta',
      name: 'S. Gupta',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
      role: 'admin',
    },
    uploadedDate: 'Oct 08',
    downloadsCount: 180,
    viewsCount: 390,
    isVerified: true,
    tags: ['Master Theorem', 'Recurrences', 'Amortized'],
    unit: 'Unit 1 & 2',
  },
  {
    id: 'mat-6',
    subjectId: 'sub-cn',
    subjectCode: 'CS304',
    subjectName: 'Computer Networks',
    title: 'Computer Networks Lec 2',
    description: 'Physical & Data Link Layer fundamentals, framing, CRC error detection, Sliding Window Protocols and HDLC.',
    type: 'materials',
    fileFormat: 'PPTX',
    fileSize: '4.5 MB',
    uploadedBy: {
      id: 'dr-nsingh',
      name: 'Dr. N. Singh',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1PwqHGy5aQHpTAIK7j3134mtI9CM0k1_yKx2kXB2gX7nB5eU69RDFagtrZZbKZrzCGKMTfqZTO4wl9r5YtwAj-a8Jt1TqT2OGJ7I1zYliDnaHM6G8UP4avi81EH57FxqmIogm5-bDjwBnPaYPafDUDVQ3SqBmGx5snvc9LKmmuUPDrjKJMXULeOdhgVONPGPze1AUVelqNOGoYQTs9sUsga2VZLRuhWuwkQ8GC0078UcNoMwCyrhaVw',
      role: 'admin',
    },
    uploadedDate: 'Oct 04',
    downloadsCount: 132,
    viewsCount: 290,
    isVerified: true,
    tags: ['OSI Model', 'Data Link', 'CRC', 'Sliding Window'],
    unit: 'Lecture 2',
  },
  {
    id: 'mat-7',
    subjectId: 'sub-ds',
    subjectCode: 'CS301',
    subjectName: 'Data Structures',
    title: '2023 Fall Midterm PYQ with Solutions',
    description: 'Official Previous Year Question paper from Fall 2023 with step-by-step verified solutions and grading rubrics.',
    type: 'pyqs',
    fileFormat: 'PDF',
    fileSize: '3.4 MB',
    uploadedBy: {
      id: 'user-sarah',
      name: 'Sarah J.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
      role: 'super_admin',
    },
    uploadedDate: 'Sep 28',
    downloadsCount: 310,
    viewsCount: 650,
    isVerified: true,
    tags: ['PYQ', '2023', 'Solved Paper'],
    unit: 'Past Exam',
  },
  {
    id: 'mat-8',
    subjectId: 'sub-ds',
    subjectCode: 'CS301',
    subjectName: 'Data Structures',
    title: 'Top 50 University Exam Questions (High Yield)',
    description: 'Curated list of repeated 5-mark and 10-mark questions across 5 academic years with model diagrams and code snippets.',
    type: 'important_questions',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    uploadedBy: {
      id: 'user-michael',
      name: 'Michael K.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
      role: 'admin',
    },
    uploadedDate: 'Oct 01',
    downloadsCount: 420,
    viewsCount: 880,
    isVerified: true,
    tags: ['Important Questions', 'Finals', 'Must-Do'],
    unit: 'All Units',
  },
];

let announcements = [
  {
    id: 'ann-1',
    classroomId: 'cls-1',
    title: 'Internal Exam Schedule Released for Mid-Semesters.',
    description: 'Mid-semester examinations will commence from the 5th of next month. Please check the Exams tab for the complete timetable and seating arrangements.',
    timestamp: 'Today, 09:00 AM',
    author: 'Admin Office',
    isUrgent: true,
  },
  {
    id: 'ann-2',
    classroomId: 'cls-1',
    title: 'Guest Lecture: Advances in Machine Learning by Dr. V. Sharma in Hall 3.',
    description: 'All 3rd-year CS students are requested to attend. Attendance will be counted towards the lab curriculum.',
    timestamp: 'Yesterday',
    author: 'Prof. Alan Turing',
    isUrgent: false,
  },
  {
    id: 'ann-3',
    classroomId: 'cls-1',
    title: 'Data Structures Assignment 3 Deadline Extended to Sunday Midnight.',
    description: 'Submit your Tree traversal and Graph cycle detection assignments directly via the portal or notes submission tab.',
    timestamp: '3 days ago',
    author: 'Sarah Jenkins (Class Rep)',
    isUrgent: false,
  },
];

let exams = [
  {
    id: 'exam-1',
    classroomId: 'cls-1',
    subjectName: 'Data Structures',
    subjectCode: 'CS301',
    date: '2026-09-05',
    daysRemaining: 12,
    time: '10:00 AM - 01:00 PM',
    venue: 'Academic Block B - Hall 201',
    progressPercent: 75,
  },
  {
    id: 'exam-2',
    classroomId: 'cls-1',
    subjectName: 'Operating Systems',
    subjectCode: 'CS302',
    date: '2026-09-08',
    daysRemaining: 15,
    time: '10:00 AM - 01:00 PM',
    venue: 'Academic Block B - Hall 202',
    progressPercent: 60,
  },
  {
    id: 'exam-3',
    classroomId: 'cls-1',
    subjectName: 'Algorithm Analysis',
    subjectCode: 'CS303',
    date: '2026-09-12',
    daysRemaining: 19,
    time: '02:00 PM - 05:00 PM',
    venue: 'Computing Center 1',
    progressPercent: 45,
  },
  {
    id: 'exam-4',
    classroomId: 'cls-1',
    subjectName: 'Computer Networks',
    subjectCode: 'CS304',
    date: '2026-09-15',
    daysRemaining: 22,
    time: '10:00 AM - 01:00 PM',
    venue: 'Auditorium North',
    progressPercent: 30,
  },
];

let members = [
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@oxford.edu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
    role: 'super_admin',
    rollNumber: 'CS22B042',
    joinedDate: 'Aug 2024',
  },
  {
    id: 'user-michael',
    name: 'Michael Klein',
    email: 'michael.k@oxford.edu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
    role: 'admin',
    rollNumber: 'CS22B018',
    joinedDate: 'Aug 2024',
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    email: 'elena.r@oxford.edu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    role: 'student',
    rollNumber: 'CS22B029',
    joinedDate: 'Sep 2024',
  },
  {
    id: 'user-david',
    name: 'David Chen',
    email: 'david.c@oxford.edu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
    role: 'student',
    rollNumber: 'CS22B011',
    joinedDate: 'Sep 2024',
  },
];

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Current user profile & their single specific enrolled classroom
app.get('/api/auth/me', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ authenticated: false });
  }
  const userClassroom = classrooms.find((c) => c.id === currentUser.classroomId) || classrooms[0];
  res.json({
    authenticated: true,
    user: currentUser,
    classroom: userClassroom,
  });
});

app.get('/api/user', (req, res) => {
  res.json(currentUser);
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // Find user by email (case-insensitive)
  let foundUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  // If password provided and user exists, check password
  if (foundUser) {
    if (foundUser.password && password && foundUser.password !== password) {
      return res.status(401).json({ error: 'Invalid password. (Default test password is password123)' });
    }
  } else {
    // If user not in system, create on-the-fly student account in default classroom
    const defaultCls = classrooms[0];
    const newId = `user-${Date.now()}`;
    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    
    foundUser = {
      id: newId,
      name: nameFromEmail || 'University Student',
      email: email.trim(),
      password: password || 'password123',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
      role: 'student',
      department: 'Computer Science & Engineering',
      rollNumber: `CS26B${Math.floor(100 + Math.random() * 900)}`,
      classroomId: defaultCls.id,
    };
    registeredUsers.push(foundUser);
    
    // Add to members
    members.push({
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      avatar: foundUser.avatar,
      role: foundUser.role as any,
      rollNumber: foundUser.rollNumber,
      joinedDate: 'Just now',
    });
    defaultCls.memberCount += 1;
  }

  currentUser = foundUser;
  const userClassroom = classrooms.find((c) => c.id === foundUser.classroomId) || classrooms[0];

  res.json({
    success: true,
    user: foundUser,
    classroom: userClassroom,
    message: `Welcome back, ${foundUser.name}!`,
  });
});

// Signup endpoint (strict single classroom assignment)
app.post('/api/auth/signup', (req, res) => {
  const {
    name,
    email,
    password,
    department = 'Computer Science',
    rollNumber,
    role = 'student',
    classroomOption = 'join', // 'join' | 'select' | 'create'
    classroomCode,
    classroomId,
    newClassroomData,
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this institutional email already exists. Please log in.' });
  }

  const userId = `user-${Date.now()}`;
  let assignedClassroom = classrooms[0];
  let finalRole = role;

  // Resolve single classroom assignment
  if (classroomOption === 'create' && newClassroomData) {
    // User is creating a brand new classroom and becomes super_admin for it
    finalRole = 'super_admin';
    const newCode = `${newClassroomData.course ? newClassroomData.course.substring(0, 3).toUpperCase() : 'CLS'}${newClassroomData.batchYear ? newClassroomData.batchYear.slice(-2) : '26'}${newClassroomData.section ? newClassroomData.section.slice(-1) : 'A'}`.replace(/[^A-Z0-9]/g, '') || `SANCT${Math.floor(10 + Math.random() * 90)}`;
    
    assignedClassroom = {
      id: `cls-${Date.now()}`,
      code: newCode,
      name: `${newClassroomData.course || 'Classroom'} ${newClassroomData.batchYear || '2026'} - ${newClassroomData.section || 'Section A'}`,
      collegeName: newClassroomData.collegeName || 'Academic University',
      location: newClassroomData.location || 'Campus',
      department: newClassroomData.department || department,
      course: newClassroomData.course || 'Degree Program',
      degreeLevel: newClassroomData.degreeLevel || 'undergraduate',
      batchYear: newClassroomData.batchYear || '2026',
      section: newClassroomData.section || 'Section A',
      semester: newClassroomData.semester || 'Semester 5',
      superAdminId: userId,
      memberCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    classrooms.unshift(assignedClassroom);

    // Bootstrap selected subjects
    if (Array.isArray(newClassroomData.selectedSubjects) && newClassroomData.selectedSubjects.length > 0) {
      newClassroomData.selectedSubjects.forEach((subName: string, idx: number) => {
        const match = subName.match(/^(.*?)(?:\s*\((.*?)\))?$/);
        const sName = match && match[1] ? match[1].trim() : subName;
        const sCode = match && match[2] ? match[2].trim() : `CS30${idx + 1}`;
        subjects.push({
          id: `sub-${Date.now()}-${idx}`,
          classroomId: assignedClassroom.id,
          code: sCode,
          name: sName,
          professor: 'Faculty Coordinator',
          description: `Comprehensive coursework and materials for ${sName}.`,
          creditHours: 4,
          materialsCount: 0,
          notesCount: 0,
          pyqsCount: 0,
        });
      });
    }
  } else if (classroomOption === 'join' && classroomCode) {
    const codeMatch = classrooms.find((c) => c.code.toLowerCase() === classroomCode.trim().toLowerCase());
    if (codeMatch) {
      assignedClassroom = codeMatch;
      assignedClassroom.memberCount += 1;
    } else {
      // Create new cohort for that code
      assignedClassroom = {
        id: `cls-${Date.now()}`,
        code: classroomCode.trim().toUpperCase(),
        name: `Cohort ${classroomCode.trim().toUpperCase()}`,
        collegeName: 'University Campus',
        location: 'Academic Hall',
        department: department || 'Engineering',
        course: 'Degree Program',
        degreeLevel: 'undergraduate',
        batchYear: '2026',
        section: 'Section A',
        semester: 'Semester 5',
        superAdminId: userId,
        memberCount: 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      classrooms.unshift(assignedClassroom);
    }
  } else if (classroomId) {
    const found = classrooms.find((c) => c.id === classroomId);
    if (found) {
      assignedClassroom = found;
      assignedClassroom.memberCount += 1;
    }
  }

  const defaultAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
  ];

  const newUser = {
    id: userId,
    name: name.trim(),
    email: email.trim(),
    password: password || 'password123',
    avatar: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    role: finalRole as any,
    department: department.trim() || 'Computer Science',
    rollNumber: rollNumber ? rollNumber.trim() : `STU${Math.floor(1000 + Math.random() * 9000)}`,
    classroomId: assignedClassroom.id,
  };

  registeredUsers.push(newUser);
  currentUser = newUser;

  members.push({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    role: newUser.role,
    rollNumber: newUser.rollNumber,
    joinedDate: 'Just now',
  });

  res.status(201).json({
    success: true,
    user: newUser,
    classroom: assignedClassroom,
    message: `Account created! Enrolled in ${assignedClassroom.name}`,
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  // Switch to guest/default or keep user for landing
  res.json({ success: true, message: 'Logged out successfully' });
});

// Classrooms
app.get('/api/classrooms', (req, res) => {
  res.json(classrooms);
});

app.get('/api/classrooms/:id', (req, res) => {
  const cls = classrooms.find((c) => c.id === req.params.id) || classrooms[0];
  res.json(cls);
});

app.post('/api/classrooms', (req, res) => {
  const {
    collegeName,
    location,
    department,
    course,
    degreeLevel,
    batchYear = '2026',
    section = 'Section A',
    semester = 'Semester 5',
    selectedSubjects = [],
  } = req.body;

  const newCode = `${course ? course.substring(0, 3).toUpperCase() : 'CLS'}${batchYear.slice(-2)}${section ? section.slice(-1) : 'A'}`.replace(/[^A-Z0-9]/g, '') || 'SANCT26';

  const newClassroom = {
    id: `cls-${Date.now()}`,
    code: newCode,
    name: `${course || 'Classroom'} ${batchYear} - ${section}`,
    collegeName: collegeName || 'Academic University',
    location: location || 'Campus',
    department: department || 'General Studies',
    course: course || 'General Program',
    degreeLevel: degreeLevel || 'undergraduate',
    batchYear,
    section,
    semester,
    superAdminId: currentUser.id,
    memberCount: 1,
    createdAt: new Date().toISOString().split('T')[0],
  };

  classrooms.unshift(newClassroom);

  // Link current user to this created classroom as super_admin
  if (currentUser) {
    currentUser.classroomId = newClassroom.id;
    currentUser.role = 'super_admin';
    const reg = registeredUsers.find((u) => u.id === currentUser.id);
    if (reg) {
      reg.classroomId = newClassroom.id;
      reg.role = 'super_admin';
    }
  }

  // Register selected subjects for this classroom
  if (Array.isArray(selectedSubjects) && selectedSubjects.length > 0) {
    selectedSubjects.forEach((subName: string, idx: number) => {
      const match = subName.match(/^(.*?)(?:\s*\((.*?)\))?$/);
      const name = match && match[1] ? match[1].trim() : subName;
      const code = match && match[2] ? match[2].trim() : `CS30${idx + 1}`;
      subjects.push({
        id: `sub-${Date.now()}-${idx}`,
        classroomId: newClassroom.id,
        code,
        name,
        professor: 'Faculty Coordinator',
        description: `Comprehensive coursework and materials for ${name}.`,
        creditHours: 4,
        materialsCount: 0,
        notesCount: 0,
        pyqsCount: 0,
      });
    });
  }

  res.status(201).json(newClassroom);
});

app.post('/api/classrooms/join', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Classroom code is required' });
  }

  const found = classrooms.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  if (found) {
    found.memberCount += 1;
    if (currentUser) {
      currentUser.classroomId = found.id;
      const reg = registeredUsers.find((u) => u.id === currentUser.id);
      if (reg) reg.classroomId = found.id;
    }
    return res.json({ success: true, classroom: found });
  }

  // Create temporary joined classroom if code matches standard pattern
  const joined = {
    id: `cls-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name: `Classroom ${code.trim().toUpperCase()}`,
    collegeName: 'Partner University',
    location: 'Campus',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    degreeLevel: 'undergraduate',
    batchYear: '2026',
    section: 'Section B',
    semester: 'Semester 5',
    superAdminId: currentUser ? currentUser.id : 'admin',
    memberCount: 1,
    createdAt: new Date().toISOString().split('T')[0],
  };
  classrooms.unshift(joined);
  if (currentUser) {
    currentUser.classroomId = joined.id;
    const reg = registeredUsers.find((u) => u.id === currentUser.id);
    if (reg) reg.classroomId = joined.id;
  }
  res.json({ success: true, classroom: joined });
});

// Subjects
app.get('/api/subjects', (req, res) => {
  const { classroomId } = req.query;
  if (classroomId) {
    const filtered = subjects.filter((s) => s.classroomId === classroomId);
    return res.json(filtered.length > 0 ? filtered : subjects);
  }
  res.json(subjects);
});

app.get('/api/subjects/:id', (req, res) => {
  const subject = subjects.find((s) => s.id === req.params.id || s.code.toLowerCase() === req.params.id.toLowerCase());
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  res.json(subject);
});

app.post('/api/subjects', (req, res) => {
  const { code, name, professor, description, classroomId = 'cls-1', creditHours = 4 } = req.body;
  const newSubject = {
    id: `sub-${Date.now()}`,
    classroomId,
    code: code || 'CS399',
    name: name || 'Special Topics in CS',
    professor: professor || 'Prof. Guest Lecturer',
    description: description || 'Advanced course curriculum and study materials.',
    creditHours: Number(creditHours) || 3,
    materialsCount: 0,
    notesCount: 0,
    pyqsCount: 0,
  };
  subjects.push(newSubject);
  res.status(201).json(newSubject);
});

// Materials
app.get('/api/materials', (req, res) => {
  const { subjectId, type, search } = req.query;
  let result = [...materials];

  if (subjectId) {
    result = result.filter((m) => m.subjectId === subjectId);
  }
  if (type && type !== 'all') {
    result = result.filter((m) => m.type === type);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  res.json(result);
});

app.post('/api/materials', (req, res) => {
  const {
    subjectId = 'sub-ds',
    title,
    description = '',
    type = 'notes',
    fileFormat = 'PDF',
    fileSize = '1.5 MB',
    tags = [],
    unit = 'General',
    contentSnippet = '',
  } = req.body;

  const subject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const newMaterial = {
    id: `mat-${Date.now()}`,
    subjectId: subject.id,
    subjectCode: subject.code,
    subjectName: subject.name,
    title: title || 'New Study Material',
    description: description || `Study guide for ${subject.name}`,
    type,
    fileFormat,
    fileSize,
    uploadedBy: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      role: currentUser.role,
    },
    uploadedDate: 'Just now',
    downloadsCount: 1,
    viewsCount: 1,
    isVerified: true,
    tags: Array.isArray(tags) ? tags : [tags],
    unit,
    contentSnippet: contentSnippet || `# ${title}\n\nUploaded notes and study guide for ${subject.name}.`,
  };

  materials.unshift(newMaterial);

  // Update counts
  if (type === 'notes') subject.notesCount += 1;
  if (type === 'pyqs') subject.pyqsCount += 1;
  subject.materialsCount += 1;

  res.status(201).json(newMaterial);
});

// Announcements
app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

app.post('/api/announcements', (req, res) => {
  const { title, description, isUrgent = false } = req.body;
  const newAnn = {
    id: `ann-${Date.now()}`,
    classroomId: 'cls-1',
    title: title || 'New Announcement',
    description: description || '',
    timestamp: 'Just now',
    author: currentUser.name,
    isUrgent: Boolean(isUrgent),
  };
  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

// Exams
app.get('/api/exams', (req, res) => {
  res.json(exams);
});

app.post('/api/exams', (req, res) => {
  const { subjectName, subjectCode, date, time, venue } = req.body;
  const newExam = {
    id: `exam-${Date.now()}`,
    classroomId: 'cls-1',
    subjectName: subjectName || 'Subject Exam',
    subjectCode: subjectCode || 'CS300',
    date: date || '2026-09-20',
    daysRemaining: 25,
    time: time || '10:00 AM - 01:00 PM',
    venue: venue || 'Main Exam Hall',
    progressPercent: 50,
  };
  exams.push(newExam);
  res.status(201).json(newExam);
});

// Members
app.get('/api/members', (req, res) => {
  res.json(members);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Academic Sanctuary server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
