import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Resilient path normalization for Vercel serverless functions
app.use((req, res, next) => {
  if (process.env.VERCEL && !req.url.startsWith('/api') && !req.url.startsWith('/ws')) {
    req.url = '/api' + req.url;
  }
  next();
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const host = request.headers.host || 'localhost:3000';
  const urlObj = new URL(request.url || '', `http://${host}`);
  if (urlObj.pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// Full Interactive Demo Database
let classrooms: any[] = [
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

let registeredUsers: any[] = [
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

let currentUser: any = null;

let subjects: any[] = [
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

let materials: any[] = [
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
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
      role: 'super_admin',
    },
    uploadedDate: 'Aug 20, 2026',
    createdAt: 1786500000000,
    downloadsCount: 142,
    viewsCount: 389,
    isVerified: true,
    tags: ['Trees', 'Graphs', 'BFS/DFS', 'AVL Trees'],
    unit: 'Unit 3 & 4',
    recommendedExam: 'SEM',
    contentSnippet: '# Trees & Graphs Deep Dive\n\n## 1. Binary Search Trees (BST)\nA binary tree where every node in the left subtree has key <= node key, and right subtree has key > node key.\n\n### Balanced Trees\n- **AVL Trees**: Strict height balancing where balance factor BF = |h_L - h_R| <= 1.\n- **Rotations**: Single left (LL), single right (RR), double left-right (LR), double right-left (RL).\n\n## 2. Graph Algorithms\n- BFS: Uses Queue, O(V + E), shortest path in unweighted graphs.\n- DFS: Uses Stack / Recursion, cycle detection, topological sorting.\n- Dijkstra Algorithm: Greedy single-source shortest path with priority queue O((V + E) log V).',
  },
  {
    id: 'mat-2',
    subjectId: 'sub-ds',
    subjectCode: 'CS301',
    subjectName: 'Data Structures',
    title: 'Sorting Algorithms Summary & Cheat Sheet',
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
    uploadedDate: 'Aug 24, 2026',
    createdAt: 1786800000000,
    downloadsCount: 98,
    viewsCount: 245,
    isVerified: true,
    tags: ['Sorting', 'Complexity', 'Quicksort', 'Heapsort'],
    unit: 'Unit 2',
    recommendedExam: 'IAT 1',
    contentSnippet: '# Sorting Algorithms Quick Reference\n\n| Algorithm | Best | Average | Worst | Space | Stable? |\n|---|---|---|---|---|---|\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |\n| Quick Sort | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |\n| Insertion Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |',
  },
  {
    id: 'mat-3',
    subjectId: 'sub-ds',
    subjectCode: 'CS301',
    subjectName: 'Data Structures',
    title: 'Midterm Review Notes & Solved Problems',
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
    uploadedDate: 'Aug 28, 2026',
    createdAt: 1787100000000,
    downloadsCount: 167,
    viewsCount: 412,
    isVerified: true,
    tags: ['Midterm', 'Exam Prep', 'Formulas'],
    unit: 'Unit 1-3',
    recommendedExam: 'IAT 1',
    contentSnippet: '# Data Structures Midterm Review\n\n## Important Concepts Checklist:\n1. Array vs Linked List trade-offs in cache locality\n2. Stack applications (Infix to Postfix evaluation, Parentheses matching)\n3. Circular Queue implementation and modular arithmetic\n4. Hashing collision resolution (Chaining vs Open Addressing)',
  },
  {
    id: 'mat-4',
    subjectId: 'sub-os',
    subjectCode: 'CS302',
    subjectName: 'Operating Systems',
    title: 'Process Synchronization & Semaphores',
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
    uploadedDate: 'Aug 31, 2026',
    createdAt: 1787400000000,
    downloadsCount: 215,
    viewsCount: 520,
    isVerified: true,
    tags: ['Synchronization', 'Semaphores', 'Deadlocks'],
    unit: 'Chapter 4',
    recommendedExam: 'IAT 2',
    contentSnippet: '# Process Synchronization\n\n## Critical Section Problem\nA code segment that accesses shared variables and must be executed atomically.\n\n### Requirements:\n1. Mutual Exclusion\n2. Progress\n3. Bounded Waiting\n\n### Semaphores\nInteger variable accessed only via atomic wait() [P] and signal() [V] operations.',
  },
  {
    id: 'mat-5',
    subjectId: 'sub-algo',
    subjectCode: 'CS303',
    subjectName: 'Algorithm Analysis',
    title: 'Master Theorem & Divide and Conquer Recurrences',
    description: 'Master Theorem proofs, divide and conquer recurrences, amortized analysis with aggregate and potential method.',
    type: 'notes',
    fileFormat: 'DOCX',
    fileSize: '1.2 MB',
    uploadedBy: {
      id: 'user-michael',
      name: 'Michael K.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
      role: 'admin',
    },
    uploadedDate: 'Sep 02, 2026',
    createdAt: 1787700000000,
    downloadsCount: 180,
    viewsCount: 390,
    isVerified: true,
    tags: ['Master Theorem', 'Recurrences', 'Amortized'],
    unit: 'Unit 1 & 2',
    recommendedExam: 'IAT 2',
    contentSnippet: '# Master Theorem Guide\n\nFor recurrence: `T(n) = aT(n/b) + f(n)`\n\nCompare f(n) with n^(log_b a):\n1. If f(n) = O(n^(log_b a - epsilon)), then T(n) = Theta(n^(log_b a))\n2. If f(n) = Theta(n^(log_b a)), then T(n) = Theta(n^(log_b a) * log n)\n3. If f(n) = Omega(n^(log_b a + epsilon)), then T(n) = Theta(f(n))',
  },
  {
    id: 'mat-6',
    subjectId: 'sub-cn',
    subjectCode: 'CS304',
    subjectName: 'Computer Networks',
    title: 'OSI Model & Data Link Layer Lecture Slides',
    description: 'Physical & Data Link Layer fundamentals, framing, CRC error detection, Sliding Window Protocols and HDLC.',
    type: 'slides',
    fileFormat: 'PPTX',
    fileSize: '4.5 MB',
    uploadedBy: {
      id: 'dr-nsingh',
      name: 'Dr. N. Singh',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
      role: 'admin',
    },
    uploadedDate: 'Sep 04, 2026',
    createdAt: 1788000000000,
    downloadsCount: 132,
    viewsCount: 290,
    isVerified: true,
    tags: ['OSI Model', 'Data Link', 'CRC', 'Sliding Window'],
    unit: 'Lecture 2',
    recommendedExam: 'IAT 1',
    contentSnippet: '# Computer Networks Lecture 2\n\n- Framing techniques: Character count, Byte stuffing, Bit stuffing\n- Cyclic Redundancy Check (CRC) polynomial division\n- Stop-and-Wait vs Go-Back-N vs Selective Repeat ARQ',
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
    uploadedDate: 'Sep 05, 2026',
    createdAt: 1788300000000,
    downloadsCount: 310,
    viewsCount: 650,
    isVerified: true,
    tags: ['PYQ', '2023', 'Solved Paper'],
    unit: 'Past Exam',
    recommendedExam: 'IAT 1',
    contentSnippet: '# 2023 Fall Midterm Exam Solutions\n\n### Q1: Construct an AVL tree by inserting [15, 20, 24, 10, 13, 7, 30, 36, 25]\nSolution: Shows step-by-step tree drawings and rotation triggers.\n\n### Q2: Prove that Dijkstra does not work for negative edge weights.\nSolution: Counterexample graph with 3 vertices.',
  },
  {
    id: 'mat-8',
    subjectId: 'sub-dbms',
    subjectCode: 'CS305',
    subjectName: 'Database Management Systems',
    title: 'SQL, Normalization & ACID Transactions Sheet',
    description: 'BCNF vs 3NF decomposition algorithms, serializability testing with precedence graphs, and 2-phase locking protocol.',
    type: 'notes',
    fileFormat: 'PDF',
    fileSize: '3.0 MB',
    uploadedBy: {
      id: 'user-david',
      name: 'David C.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
      role: 'student',
    },
    uploadedDate: 'Sep 04, 2026',
    createdAt: 1788100000000,
    downloadsCount: 240,
    viewsCount: 510,
    isVerified: true,
    tags: ['BCNF', 'Normalization', 'ACID', 'Transactions'],
    unit: 'Unit 3 & 4',
    recommendedExam: 'IAT 2',
    contentSnippet: '# Database Normalization & Transactions\n\n## Normal Forms:\n- 1NF: Atomic attribute values\n- 2NF: 1NF + No partial dependencies\n- 3NF: 2NF + No transitive dependencies (X -> A implies X is superkey OR A is prime attribute)\n- BCNF: X -> A implies X is superkey\n\n## ACID Properties:\n- Atomicity (All or nothing)\n- Consistency (Preserves database integrity)\n- Isolation (Concurrent transactions do not interfere)\n- Durability (Committed updates persist)',
  },
];

let announcements: any[] = [
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

let exams: any[] = [
  {
    id: 'exam-1',
    classroomId: 'cls-1',
    subjectName: 'Data Structures',
    subjectCode: 'CS301',
    date: '2026-09-20',
    daysRemaining: 6,
    time: '10:00 AM - 01:00 PM',
    examType: 'IAT 1',
    venue: 'Hall 201',
    progressPercent: 80,
    isCompleted: false,
  },
  {
    id: 'exam-2',
    classroomId: 'cls-1',
    subjectName: 'Theory of Computation',
    subjectCode: 'CS306',
    date: '2026-09-24',
    daysRemaining: 10,
    time: '10:00 AM - 01:00 PM',
    examType: 'IAT 1',
    venue: 'Hall 201',
    progressPercent: 70,
    isCompleted: false,
  },
  {
    id: 'exam-3',
    classroomId: 'cls-1',
    subjectName: 'Computer Networks',
    subjectCode: 'CS304',
    date: '2026-09-28',
    daysRemaining: 14,
    time: '02:00 PM - 05:00 PM',
    examType: 'IAT 1',
    venue: 'Hall 204',
    progressPercent: 65,
    isCompleted: false,
  },
  {
    id: 'exam-4',
    classroomId: 'cls-1',
    subjectName: 'Operating Systems',
    subjectCode: 'CS302',
    date: '2026-10-15',
    daysRemaining: 31,
    time: '10:00 AM - 01:00 PM',
    examType: 'IAT 2',
    venue: 'Hall 202',
    progressPercent: 45,
    isCompleted: false,
  },
];

let members: any[] = [
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

// Demo accounts for quick-login & testing
app.get('/api/auth/demo-users', (req, res) => {
  const sanitized = registeredUsers.map((u) => {
    const cls = classrooms.find((c) => c.id === u.classroomId);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      role: u.role,
      department: u.department,
      rollNumber: u.rollNumber,
      classroomId: u.classroomId,
      classroomName: cls ? cls.name : 'Unknown Cohort',
      classroomCode: cls ? cls.code : '',
    };
  });
  res.json(sanitized);
});

// Current user profile & their single specific enrolled classroom
app.get('/api/auth/me', (req, res) => {
  if (!currentUser) {
    return res.json({ authenticated: false, user: null, classroom: null });
  }
  const userClassroom = classrooms.find((c) => c.id === currentUser.classroomId) || classrooms[0] || null;
  res.json({
    authenticated: true,
    user: currentUser,
    classroom: userClassroom,
  });
});

app.get('/api/user', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(currentUser);
});

// Login endpoint (Institutional Email & Password)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Institutional email is required.' });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Find user by email (case-insensitive)
  let foundUser = registeredUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );

  // If user exists, check password
  if (foundUser) {
    if (foundUser.password && cleanPassword && foundUser.password !== cleanPassword) {
      return res.status(401).json({ error: 'Invalid password for this institutional account. Please check your credentials.' });
    }
  } else {
    // If student has an institution-provided credential not yet in memory, authenticate and register
    const defaultCls = classrooms[0];
    const newId = `user-${Date.now()}`;
    const nameFromEmail = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    
    foundUser = {
      id: newId,
      name: nameFromEmail || 'University Student',
      email: cleanEmail,
      password: cleanPassword,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
      role: 'student',
      department: defaultCls ? defaultCls.department : 'General Academic',
      rollNumber: `STU${Math.floor(1000 + Math.random() * 9000)}`,
      classroomId: defaultCls ? defaultCls.id : '',
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
    if (defaultCls) {
      defaultCls.memberCount += 1;
    }
  }

  currentUser = foundUser;
  const userClassroom = classrooms.find((c) => c.id === foundUser.classroomId) || classrooms[0] || null;

  res.json({
    success: true,
    user: foundUser,
    classroom: userClassroom,
    message: `Welcome back, ${foundUser.name}! Logged in with ${foundUser.email}`,
  });
});

// Signup endpoint (name, regNo, department, institutional email, password)
app.post('/api/auth/signup', (req, res) => {
  const {
    name,
    email,
    password,
    department,
    rollNumber,
    regNo,
    role = 'student',
    classroomOption = 'join', // 'join' | 'select' | 'create'
    classroomCode,
    classroomId,
    newClassroomData,
  } = req.body;

  const resolvedRegNo = (regNo || rollNumber || '').trim();

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Full name is required.' });
  }
  if (!resolvedRegNo) {
    return res.status(400).json({ error: 'Registration number (Reg No) is required.' });
  }
  if (!department || !department.trim()) {
    return res.status(400).json({ error: 'Department is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Institutional email ID is required.' });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ error: 'Institutional mail password is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this institutional email already exists. Please log in with your institutional credentials.' });
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
    email: cleanEmail,
    password: password.trim(),
    avatar: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    role: finalRole as any,
    department: department.trim(),
    rollNumber: resolvedRegNo,
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

// Quick switch user account
app.post('/api/auth/switch-user', (req, res) => {
  const { userId } = req.body;
  const user = registeredUsers.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  currentUser = user;
  const userClassroom = classrooms.find((c) => c.id === user.classroomId) || classrooms[0];
  res.json({ success: true, user, classroom: userClassroom });
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

  const activeUser = getCurrentOrReqUser(req);

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
    superAdminId: activeUser.id,
    memberCount: 1,
    createdAt: new Date().toISOString().split('T')[0],
  };

  classrooms.unshift(newClassroom);

  // Link active user to this created classroom as super_admin
  activeUser.classroomId = newClassroom.id;
  activeUser.role = 'super_admin';
  currentUser = activeUser;

  const regIndex = registeredUsers.findIndex((u) => u.id === activeUser.id);
  if (regIndex >= 0) {
    registeredUsers[regIndex].classroomId = newClassroom.id;
    registeredUsers[regIndex].role = 'super_admin';
  } else {
    registeredUsers.push(activeUser);
  }

  // Ensure active user is registered in the members directory as super_admin
  const memIndex = members.findIndex((m) => m.id === activeUser.id);
  if (memIndex >= 0) {
    members[memIndex].classroomId = newClassroom.id;
    members[memIndex].role = 'super_admin';
  } else {
    members.push({
      id: activeUser.id,
      name: activeUser.name,
      email: activeUser.email,
      avatar: activeUser.avatar,
      role: 'super_admin',
      rollNumber: activeUser.rollNumber || 'ADM001',
      joinedDate: 'Today',
      classroomId: newClassroom.id,
      department: activeUser.department,
    });
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
  const list = classroomId
    ? subjects.filter((s) => s.classroomId === classroomId)
    : subjects;
  const targetList = list.length > 0 ? list : subjects;

  const subjectsWithLiveCounts = targetList.map((s) => {
    const subMats = materials.filter((m) => m.subjectId === s.id || m.subjectCode?.toLowerCase() === s.code?.toLowerCase());
    return {
      ...s,
      materialsCount: subMats.length,
      notesCount: subMats.filter((m) => m.type === 'notes').length,
      pyqsCount: subMats.filter((m) => m.type === 'pyqs').length,
    };
  });

  res.json(subjectsWithLiveCounts);
});

app.get('/api/subjects/:id', (req, res) => {
  const subject = subjects.find((s) => s.id === req.params.id || s.code.toLowerCase() === req.params.id.toLowerCase());
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  const subMats = materials.filter((m) => m.subjectId === subject.id || m.subjectCode?.toLowerCase() === subject.code?.toLowerCase());
  res.json({
    ...subject,
    materialsCount: subMats.length,
    notesCount: subMats.filter((m) => m.type === 'notes').length,
    pyqsCount: subMats.filter((m) => m.type === 'pyqs').length,
  });
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

  // Arrange materials based on which is uploaded first (chronological upload order)
  result.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  res.json(result);
});

app.post('/api/materials', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const {
    subjectId,
    subjectName,
    subjectCode,
    professor,
    title,
    description = '',
    type = 'notes',
    fileFormat = 'PDF',
    fileSize = '1.5 MB',
    tags = [],
    unit = 'General',
    contentSnippet = '',
    recommendedExam = '',
  } = req.body;

  let subject = subjects.find((s) => s.id === subjectId);

  // If user typed a manual subject that doesn't exist yet, create it dynamically
  if ((!subject || subjectId === 'custom') && (subjectName || subjectCode)) {
    const sName = (subjectName || 'General Studies').trim();
    const sCode = (subjectCode || 'GEN101').trim().toUpperCase();
    const existing = subjects.find((s) => s.code.toLowerCase() === sCode.toLowerCase());
    if (existing) {
      subject = existing;
    } else {
      subject = {
        id: `sub-${Date.now()}`,
        classroomId: activeUser.classroomId || classrooms[0]?.id || '',
        code: sCode,
        name: sName,
        professor: professor ? professor.trim() : 'Faculty Instructor',
        description: `Course syllabus and student study repository for ${sName}.`,
        creditHours: 3,
        materialsCount: 0,
        notesCount: 0,
        pyqsCount: 0,
      };
      subjects.push(subject);
    }
  }

  if (!subject) {
    if (subjects.length > 0) {
      subject = subjects[0];
    } else {
      subject = {
        id: `sub-${Date.now()}`,
        classroomId: activeUser.classroomId || classrooms[0]?.id || '',
        code: subjectCode || 'ACAD101',
        name: subjectName || 'General Academic Course',
        professor: professor ? professor.trim() : 'Faculty Coordinator',
        description: 'Comprehensive course materials.',
        creditHours: 3,
        materialsCount: 0,
        notesCount: 0,
        pyqsCount: 0,
      };
      subjects.push(subject);
    }
  }

  const now = Date.now();
  const dateFormatted = new Date(now).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const newMaterial = {
    id: `mat-${now}`,
    subjectId: subject.id,
    subjectCode: subject.code,
    subjectName: subject.name,
    title: title || 'New Study Material',
    description: description || `Study guide for ${subject.name}`,
    type,
    fileFormat,
    fileSize,
    uploadedBy: {
      id: activeUser.id,
      name: activeUser.name,
      avatar: activeUser.avatar,
      role: activeUser.role,
    },
    uploadedDate: dateFormatted,
    createdAt: now,
    downloadsCount: 0,
    viewsCount: 1,
    isVerified: true,
    tags: Array.isArray(tags) ? tags : [tags],
    unit,
    recommendedExam: recommendedExam || '',
    contentSnippet: contentSnippet || `# ${title}\n\nUploaded notes and study guide for ${subject.name}.`,
  };

  materials.push(newMaterial);

  // Update counts
  if (type === 'notes') subject.notesCount += 1;
  if (type === 'pyqs') subject.pyqsCount += 1;
  subject.materialsCount += 1;

  res.status(201).json(newMaterial);
});

// Announcements
app.get('/api/announcements', (req, res) => {
  const { classroomId } = req.query;
  if (classroomId) {
    return res.json(announcements.filter((a) => a.classroomId === classroomId));
  }
  res.json(announcements);
});

app.post('/api/announcements', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { title, description, isUrgent = false, classroomId } = req.body;
  const newAnn = {
    id: `ann-${Date.now()}`,
    classroomId: classroomId || activeUser.classroomId || (classrooms[0]?.id || ''),
    title: title || 'New Announcement',
    description: description || '',
    timestamp: 'Just now',
    author: activeUser.name,
    isUrgent: Boolean(isUrgent),
  };
  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

// Exams
app.get('/api/exams', (req, res) => {
  const { classroomId } = req.query;
  if (classroomId) {
    return res.json(exams.filter((e) => e.classroomId === classroomId));
  }
  res.json(exams);
});

app.post('/api/exams', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== 'super_admin' && activeUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Only cohort administrators can publish examination schedules.' });
  }

  const { subjectName, subjectCode, date, time, examType, venue, isCompleted, classroomId } = req.body;
  
  // Calculate days remaining dynamically relative to current date (2026-09-05)
  let daysRemaining = 14;
  if (date) {
    const today = new Date('2026-09-05T00:00:00');
    const examDate = new Date(date + 'T00:00:00');
    const diff = examDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const newExam = {
    id: `exam-${Date.now()}`,
    classroomId: classroomId || activeUser.classroomId || (classrooms[0]?.id || ''),
    subjectName: subjectName || 'Subject Exam',
    subjectCode: subjectCode || 'CS300',
    date: date || '2026-09-20',
    daysRemaining,
    time: time || '10:00 AM - 01:00 PM',
    examType: examType || venue || 'Exam',
    venue: venue || examType || 'Main Exam Hall',
    progressPercent: isCompleted || daysRemaining < 0 ? 100 : 40,
    isCompleted: Boolean(isCompleted || daysRemaining < 0),
  };
  exams.push(newExam);
  res.status(201).json(newExam);
});

app.patch('/api/exams/:id', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== 'super_admin' && activeUser.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Only cohort administrators can modify examination schedules.' });
  }

  const exam = exams.find((e) => e.id === req.params.id);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  if (typeof req.body.isCompleted === 'boolean') {
    exam.isCompleted = req.body.isCompleted;
    if (exam.isCompleted) exam.progressPercent = 100;
  }
  if (typeof req.body.progressPercent === 'number') {
    exam.progressPercent = req.body.progressPercent;
  }
  res.json(exam);
});

// Members Management
app.get('/api/members', (req, res) => {
  const { classroomId } = req.query;
  if (classroomId) {
    const userIdsInClassroom = registeredUsers
      .filter((u) => u.classroomId === classroomId)
      .map((u) => u.id);
    const filtered = members.filter(
      (m) => m.classroomId === classroomId || userIdsInClassroom.includes(m.id)
    );
    return res.json(filtered);
  }
  res.json(members);
});

// Add Member using Institutional Email
app.post('/api/members', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== 'super_admin' && activeUser.role !== 'admin') {
    return res.status(403).json({ error: 'Only cohort administrators can add members.' });
  }

  const { email, name, rollNumber, role = 'student', department, classroomId } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Institutional email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const targetClassroomId = classroomId || activeUser.classroomId || classrooms[0]?.id;

  if (!targetClassroomId) {
    return res.status(400).json({ error: 'No active classroom found to enroll member into.' });
  }

  // Check if member with this email already exists in this cohort
  const existingInClass = members.find(
    (m) =>
      (m.classroomId === targetClassroomId ||
        registeredUsers.some((u) => u.id === m.id && u.classroomId === targetClassroomId)) &&
      m.email.toLowerCase() === cleanEmail
  );
  if (existingInClass) {
    return res.status(400).json({ error: 'A member with this institutional email is already enrolled in this cohort.' });
  }

  const memberName =
    name && name.trim()
      ? name.trim()
      : cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const memberRoll =
    rollNumber && rollNumber.trim()
      ? rollNumber.trim().toUpperCase()
      : `ROLL-${Math.floor(100 + Math.random() * 900)}`;
  const memberRole = role === 'admin' ? 'admin' : 'student';

  const defaultAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
  ];

  const newMemberId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const avatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

  const newUser = {
    id: newMemberId,
    name: memberName,
    email: cleanEmail,
    password: 'password123',
    avatar,
    role: memberRole,
    department: department || activeUser.department || 'Academic Studies',
    rollNumber: memberRoll,
    classroomId: targetClassroomId,
  };
  registeredUsers.push(newUser);

  const newMemberRecord = {
    id: newMemberId,
    name: memberName,
    email: cleanEmail,
    avatar,
    role: memberRole,
    rollNumber: memberRoll,
    joinedDate: 'Today',
    classroomId: targetClassroomId,
    department: newUser.department,
  };
  members.push(newMemberRecord);

  const targetClassroom = classrooms.find((c) => c.id === targetClassroomId);
  if (targetClassroom) {
    targetClassroom.memberCount = (targetClassroom.memberCount || 0) + 1;
  }

  res.status(201).json(newMemberRecord);
});

// Update Member Role (Grant/Revoke Admin Access)
app.patch('/api/members/:id/role', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== 'super_admin' && activeUser.role !== 'admin') {
    return res.status(403).json({ error: 'Only cohort administrators can manage member roles.' });
  }

  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin or student.' });
  }

  const member = members.find((m) => m.id === id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found.' });
  }

  if (member.role === 'super_admin') {
    return res.status(403).json({ error: 'Cannot modify permissions of Super Admin.' });
  }

  // A regular admin cannot demote another admin unless they are super_admin
  if (activeUser.role === 'admin' && member.role === 'admin' && role === 'student') {
    return res.status(403).json({ error: 'Only the Super Admin can demote other administrators.' });
  }

  member.role = role as any;

  const regUser = registeredUsers.find((u) => u.id === id);
  if (regUser) {
    regUser.role = role as any;
  }

  if (currentUser && currentUser.id === id) {
    currentUser.role = role as any;
  }

  res.json({ success: true, member });
});

// Delete/Remove Member from Cohort
app.delete('/api/members/:id', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== 'super_admin' && activeUser.role !== 'admin') {
    return res.status(403).json({ error: 'Only cohort administrators can remove members.' });
  }

  const { id } = req.params;
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Member not found.' });
  }

  if (members[index].role === 'super_admin') {
    return res.status(403).json({ error: 'Cannot remove Super Admin.' });
  }

  const removed = members.splice(index, 1)[0];
  const regIdx = registeredUsers.findIndex((u) => u.id === id);
  if (regIdx !== -1) {
    registeredUsers.splice(regIdx, 1);
  }

  const cls = classrooms.find((c) => c.id === removed.classroomId);
  if (cls && cls.memberCount > 1) {
    cls.memberCount -= 1;
  }

  res.json({ success: true, member: removed });
});

// Banned Cohort Users Store
let bannedCohortUsers: {
  classroomId: string;
  userId: string;
  email: string;
  name: string;
  rollNumber?: string;
  bannedAt: string;
  bannedBy: string;
}[] = [];

// Ban and Remove Member from Cohort
app.post('/api/members/:id/ban', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== 'super_admin' && activeUser.role !== 'admin') {
    return res.status(403).json({ error: 'Only cohort administrators can ban members.' });
  }

  const { id } = req.params;
  if (id === activeUser.id) {
    return res.status(400).json({ error: 'You cannot ban yourself from the cohort.' });
  }

  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Member not found.' });
  }

  if (members[index].role === 'super_admin') {
    return res.status(403).json({ error: 'Cannot ban the Super Admin.' });
  }

  const memberToBan = members.splice(index, 1)[0];

  // Remove from registeredUsers so direct credentials won't log into this cohort
  const regIdx = registeredUsers.findIndex((u) => u.id === id);
  if (regIdx !== -1) {
    registeredUsers.splice(regIdx, 1);
  }

  // Record into banned cohort list
  bannedCohortUsers.push({
    classroomId: memberToBan.classroomId || '',
    userId: memberToBan.id,
    email: memberToBan.email.toLowerCase(),
    name: memberToBan.name,
    rollNumber: memberToBan.rollNumber,
    bannedAt: new Date().toISOString(),
    bannedBy: activeUser.name,
  });

  // Decrement classroom count
  const cls = classrooms.find((c) => c.id === memberToBan.classroomId);
  if (cls && cls.memberCount > 1) {
    cls.memberCount -= 1;
  }

  // Also remove from all chat groups in this classroom
  const affectedGroups = chatGroups.filter((g) => g.classroomId === memberToBan.classroomId);
  for (const grp of affectedGroups) {
    chatGroupMembers = chatGroupMembers.filter(
      (m) => !(m.groupId === grp.id && m.userId === id)
    );
    if (!grp.bannedUserIds) grp.bannedUserIds = [];
    if (!grp.bannedUserIds.includes(id)) grp.bannedUserIds.push(id);

    broadcastToGroup(grp.id, {
      type: 'chat:member_banned',
      groupId: grp.id,
      userId: id,
      bannedBy: activeUser.name,
    });
  }

  res.json({ success: true, banned: true, member: memberToBan });
});

// Get Banned Cohort Members
app.get('/api/classrooms/:id/banned', (req, res) => {
  const list = bannedCohortUsers.filter((b) => b.classroomId === req.params.id);
  res.json(list);
});

// ==========================================
// WHATSAPP-STYLE CHAT SYSTEM (Groups, DMs, Messages, Real-Time WS)
// ==========================================

interface GroupMemberRecord {
  groupId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

interface ChatGroupRecord {
  id: string;
  classroomId: string;
  name: string;
  avatar: string;
  description: string;
  isDirect: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  pinnedMessageId?: string;
  bannedUserIds?: string[];
}

interface ChatMessageRecord {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'text' | 'file' | 'camera_image' | 'material_forward';
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  forwardedMaterial?: {
    id: string;
    title: string;
    subjectCode: string;
    subjectName: string;
    type: string;
    fileFormat: string;
    fileSize: string;
    snippet?: string;
  };
  timestamp: string;
  createdAt: number;
  deliveredTo: string[];
  readBy: string[];
  isDeleted?: boolean;
  reactions?: Array<{ emoji: string; userId: string; userName: string }>;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
    type?: string;
  };
  isPinned?: boolean;
  isStarred?: boolean;
  starredBy?: string[];
}

// In-Memory Database Collections with Relational Indexes (Interactive Demo State)
let chatGroups: ChatGroupRecord[] = [
  {
    id: 'grp-cohort-cls-1',
    classroomId: 'cls-1',
    name: 'BTECH26A - General Cohort',
    avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    description: 'Official cohort group for all Section A members to coordinate lectures, lab submissions, exam dates, and lecture notes.',
    isDirect: false,
    createdBy: 'user-sarah',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-09-06T10:30:00Z',
  },
  {
    id: 'grp-algo-prep',
    classroomId: 'cls-1',
    name: 'CS301 Data Structures & Algorithms Prep',
    avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    description: 'Daily algorithmic problem discussion, viva preparation, and dynamic programming tips.',
    isDirect: false,
    createdBy: 'user-elena',
    createdAt: '2026-08-22T14:30:00Z',
    updatedAt: '2026-09-06T09:15:00Z',
  },
  {
    id: 'dm-sarah-elena',
    classroomId: 'cls-1',
    name: 'Elena Rostova',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    description: 'Direct Conversation',
    isDirect: true,
    createdBy: 'user-sarah',
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-09-06T08:45:00Z',
  },
  {
    id: 'dm-sarah-michael',
    classroomId: 'cls-1',
    name: 'Michael Klein',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
    description: 'Direct Conversation',
    isDirect: true,
    createdBy: 'user-sarah',
    createdAt: '2026-08-26T14:00:00Z',
    updatedAt: '2026-09-06T09:20:00Z',
  },
];

let chatGroupMembers: GroupMemberRecord[] = [
  // General cohort
  { groupId: 'grp-cohort-cls-1', userId: 'user-sarah', role: 'admin', joinedAt: '2026-08-15T09:00:00Z' },
  { groupId: 'grp-cohort-cls-1', userId: 'user-michael', role: 'admin', joinedAt: '2026-08-15T09:05:00Z' },
  { groupId: 'grp-cohort-cls-1', userId: 'user-elena', role: 'member', joinedAt: '2026-08-15T09:10:00Z' },
  { groupId: 'grp-cohort-cls-1', userId: 'user-david', role: 'member', joinedAt: '2026-08-15T09:15:00Z' },

  // DSA Prep
  { groupId: 'grp-algo-prep', userId: 'user-elena', role: 'admin', joinedAt: '2026-08-22T14:30:00Z' },
  { groupId: 'grp-algo-prep', userId: 'user-sarah', role: 'member', joinedAt: '2026-08-22T14:32:00Z' },
  { groupId: 'grp-algo-prep', userId: 'user-david', role: 'member', joinedAt: '2026-08-22T14:35:00Z' },
  { groupId: 'grp-algo-prep', userId: 'user-michael', role: 'member', joinedAt: '2026-08-22T14:40:00Z' },

  // Direct DM Sarah & Elena
  { groupId: 'dm-sarah-elena', userId: 'user-sarah', role: 'admin', joinedAt: '2026-08-25T11:00:00Z' },
  { groupId: 'dm-sarah-elena', userId: 'user-elena', role: 'admin', joinedAt: '2026-08-25T11:00:00Z' },

  // Direct DM Sarah & Michael
  { groupId: 'dm-sarah-michael', userId: 'user-sarah', role: 'admin', joinedAt: '2026-08-26T14:00:00Z' },
  { groupId: 'dm-sarah-michael', userId: 'user-michael', role: 'admin', joinedAt: '2026-08-26T14:00:00Z' },
];

let chatMessages: ChatMessageRecord[] = [
  {
    id: 'msg-101',
    groupId: 'grp-cohort-cls-1',
    senderId: 'user-sarah',
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
    type: 'text',
    content: 'Welcome everyone to the official BTECH26A cohort chat! You can forward lecture notes, snap textbook queries, and organize study sessions here.',
    timestamp: 'Yesterday, 02:15 PM',
    createdAt: Date.now() - 86400000 + 5000,
    deliveredTo: ['user-sarah', 'user-elena', 'user-michael', 'user-david'],
    readBy: ['user-sarah', 'user-elena', 'user-michael', 'user-david'],
    isPinned: true,
  },
  {
    id: 'msg-102',
    groupId: 'grp-cohort-cls-1',
    senderId: 'user-michael',
    senderName: 'Michael Klein',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
    type: 'text',
    content: 'I have verified and forwarded our Unit 3 Tree Traversals slides from the library. You can check them directly below:',
    timestamp: 'Yesterday, 03:20 PM',
    createdAt: Date.now() - 86400000 + 40000,
    deliveredTo: ['user-sarah', 'user-elena', 'user-michael', 'user-david'],
    readBy: ['user-sarah', 'user-elena', 'user-michael', 'user-david'],
    reactions: [{ emoji: '👍', userId: 'user-sarah', userName: 'Sarah Jenkins' }],
  },
  {
    id: 'msg-103',
    groupId: 'grp-cohort-cls-1',
    senderId: 'user-michael',
    senderName: 'Michael Klein',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
    type: 'material_forward',
    content: 'Unit 3 Binary Trees & Traversals Complete Slides',
    forwardedMaterial: {
      id: 'mat-1',
      title: 'Trees & Graphs Deep Dive',
      subjectCode: 'CS301',
      subjectName: 'Data Structures',
      type: 'notes',
      fileFormat: 'PDF',
      fileSize: '2.4 MB',
      snippet: 'Binary search tree invariants, AVL tree balancing rotations, and Morris in-order traversal algorithms.',
    },
    timestamp: 'Yesterday, 03:22 PM',
    createdAt: Date.now() - 86400000 + 45000,
    deliveredTo: ['user-sarah', 'user-elena', 'user-michael', 'user-david'],
    readBy: ['user-sarah', 'user-elena', 'user-michael', 'user-david'],
    reactions: [
      { emoji: '❤️', userId: 'user-elena', userName: 'Elena Rostova' },
      { emoji: '🔥', userId: 'user-david', userName: 'David Chen' },
    ],
  },
  {
    id: 'msg-104',
    groupId: 'grp-cohort-cls-1',
    senderId: 'user-elena',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    type: 'text',
    content: 'Super helpful Michael! Does anyone want to practice the previous year questions together before the IAT 1 exams?',
    timestamp: 'Today, 09:30 AM',
    createdAt: Date.now() - 3600000,
    deliveredTo: ['user-sarah', 'user-elena', 'user-michael', 'user-david'],
    readBy: ['user-sarah', 'user-elena'],
  },
  {
    id: 'msg-201',
    groupId: 'grp-algo-prep',
    senderId: 'user-elena',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    type: 'text',
    content: 'Hey everyone, today we are tackling Dynamic Programming: 0/1 Knapsack vs Unbounded Knapsack. Drop your solutions below!',
    timestamp: 'Today, 10:15 AM',
    createdAt: Date.now() - 7200000,
    deliveredTo: ['user-sarah', 'user-elena', 'user-david', 'user-michael'],
    readBy: ['user-sarah', 'user-elena', 'user-david'],
  },
  {
    id: 'msg-202',
    groupId: 'grp-algo-prep',
    senderId: 'user-david',
    senderName: 'David Chen',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZtyqQ3lycnq7AMccaFmVziEt3AOMSS90B5pj4-UFEp42WGtql_hBxHwcbB4K-JONAFXKO9-abTCyW9oAG_JgeGVlyq9sx6f93oFLYzHV7HCo51NPdlO26vXmieOXaRjm9rM5PtUHLrI_sqCf2yGFoWopo6LDOqBuZahjQVNFzuGvnqdcddWtdhK7MMA_LBxaxaSFpgc6om_JSFb5BVA_HqzGkhPpFmFemKVwo8Cish1-yDuQlW5yWDQ',
    type: 'text',
    content: 'For 0/1 Knapsack, space can be optimized to 1D array iterating weights backwards from W down to wt[i]! O(W) space.',
    timestamp: 'Today, 10:45 AM',
    createdAt: Date.now() - 5400000,
    deliveredTo: ['user-sarah', 'user-elena', 'user-david', 'user-michael'],
    readBy: ['user-sarah', 'user-david'],
    reactions: [{ emoji: '💡', userId: 'user-sarah', userName: 'Sarah Jenkins' }],
  },
  {
    id: 'msg-dm-1',
    groupId: 'dm-sarah-elena',
    senderId: 'user-elena',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    type: 'text',
    content: 'Hi Sarah! Did you review the OS assignment rubric before submission?',
    timestamp: 'Today, 11:20 AM',
    createdAt: Date.now() - 3600000,
    deliveredTo: ['user-sarah', 'user-elena'],
    readBy: ['user-sarah', 'user-elena'],
  },
  {
    id: 'msg-dm-2',
    groupId: 'dm-sarah-elena',
    senderId: 'user-sarah',
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpKVqp8kbAfxGqOzgulKLDI74NQiSdlDhDdFDyQV_evpa8r7d5WkZGkgnCShgY15unIPoRzhmSGM8c5eYPlAfPusWbCSY4vPjAwP8KRomBMr7KQOQX0hIJBjhcSdgOwc2dkZEXm70URgJJ9cLOY4dgO0jxryXS4sw8mAUGz6kgZFPaT6gja0ikk7HNAfoTyv5oY_mEIBEb28YJUw2rW5IOw1WBEJ7mg51EYzStKeEueXcmsQHbIoC-nA',
    type: 'text',
    content: 'Yes! Make sure the Peterson algorithm mutual exclusion proof is clearly drawn. See you in the lab this afternoon!',
    timestamp: 'Today, 11:25 AM',
    createdAt: Date.now() - 3300000,
    deliveredTo: ['user-sarah', 'user-elena'],
    readBy: ['user-sarah', 'user-elena'],
  },
  {
    id: 'msg-dm-3',
    groupId: 'dm-sarah-michael',
    senderId: 'user-michael',
    senderName: 'Michael Klein',
    senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBi-zIOKYT1CTN9RV3ZzQNieXOigrdCfr81_ihfbOqXHZzoMgFBdaEoBMZKl89hXhj_Om3SEgrx7dTB_i9FJqzma_T0g0Tf3DtnuXuWmMdQnaX-eOgOcdJLbUhWfy34CChRKQFpmloUWTp4QMGnnPQ-C3Lndf0MXhLQ80s437Z0YbdROLpO8-R6f8rAPpT8SPOAHaGk_thBcwBigM4TyxJMNJZWmNHABG_qY1TNnmdM-E3z0-9U-ATvg',
    type: 'text',
    content: 'Hey Sarah, I uploaded the 2023 Fall Midterm PYQs to the repository. Added solutions for the AVL tree question.',
    timestamp: 'Yesterday, 04:30 PM',
    createdAt: Date.now() - 86400000 + 60000,
    deliveredTo: ['user-sarah', 'user-michael'],
    readBy: ['user-sarah', 'user-michael'],
  },
];

// Helper to safely get active user or request fallback
function getCurrentOrReqUser(req?: express.Request) {
  if (currentUser) return currentUser;
  const headerUserId = req ? ((req.headers['x-user-id'] as string) || (req.query.userId as string)) : undefined;
  if (headerUserId) {
    const found = registeredUsers.find((u) => u.id === headerUserId) || members.find((m) => m.id === headerUserId);
    if (found) return found;
  }
  return {
    id: 'user-guest',
    name: 'Classmate',
    email: 'student@academic.edu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGaR09JxPLMxTUqAOn21XHcUqnAmqIeBD6jAqrDU96ITXbLPrkZZaOCjQK7IIR0PKxWNWRRHW7UpC6dTEYhaUWD4iA8mgfmc13xgb933NjQg-Kp__Lo1419atLEixTCMlfpxIvT1-8pb6FjhhmuDcoj3YBiMdoQrxSHJdiO59ij_2u55zAV4duQwWVxUctNVbs3budTAzNTx5QK-4QBTQeVbxrdva2Bi57wirGxl-DIZIC8wyz5e_v2A',
    role: 'student',
    department: 'General Studies',
    rollNumber: 'STU001',
    classroomId: classrooms[0]?.id || '',
  };
}

// Active WebSocket Clients & Online Presence
const connectedSockets = new Map<WebSocket, { userId: string; classroomId: string }>();

function isUserOnline(userId: string): boolean {
  for (const client of connectedSockets.values()) {
    if (client.userId === userId) return true;
  }
  return false;
}

function broadcastToGroup(groupId: string, data: any, excludeWs?: WebSocket) {
  const memberEntries = chatGroupMembers.filter((m) => m.groupId === groupId);
  const memberUserIds = new Set(memberEntries.map((m) => m.userId));
  const payload = JSON.stringify(data);

  for (const [clientWs, info] of connectedSockets.entries()) {
    if (clientWs !== excludeWs && clientWs.readyState === WebSocket.OPEN && memberUserIds.has(info.userId)) {
      clientWs.send(payload);
    }
  }
}

function broadcastPresence(userId: string, isOnline: boolean, lastSeen?: string) {
  const payload = JSON.stringify({
    type: 'chat:presence',
    userId,
    isOnline,
    lastSeen: lastSeen || (isOnline ? 'Online' : 'Last seen recently'),
  });

  for (const [clientWs] of connectedSockets.entries()) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(payload);
    }
  }
}

// WebSocket Connection Lifecycle
wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (messageRaw: string) => {
    try {
      const data = JSON.parse(messageRaw.toString());
      
      if (data.type === 'auth') {
        const userId = data.userId || (currentUser ? currentUser.id : 'user-guest');
        const classroomId = data.classroomId || (currentUser ? currentUser.classroomId : '');
        connectedSockets.set(ws, { userId, classroomId });

        // Send current list of online users to the connected client
        const onlineUserIds = Array.from(
          new Set(Array.from(connectedSockets.values()).map((c) => c.userId))
        );
        ws.send(
          JSON.stringify({
            type: 'chat:online_users',
            onlineUserIds,
          })
        );

        // Broadcast to everyone that this user is now online
        broadcastPresence(userId, true);
      } else if (data.type === 'typing') {
        // Typing indicator broadcast
        if (data.groupId && data.userId) {
          broadcastToGroup(
            data.groupId,
            {
              type: 'chat:typing',
              groupId: data.groupId,
              userId: data.userId,
              userName: data.userName || 'Someone',
              isTyping: Boolean(data.isTyping),
            },
            ws
          );
        }
      } else if (data.type === 'read') {
        if (data.groupId && data.userId) {
          const unread = chatMessages.filter(
            (m) => m.groupId === data.groupId && !m.readBy.includes(data.userId)
          );
          unread.forEach((m) => m.readBy.push(data.userId));
          broadcastToGroup(data.groupId, {
            type: 'chat:read_receipt',
            groupId: data.groupId,
            userId: data.userId,
          });
        }
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    const client = connectedSockets.get(ws);
    connectedSockets.delete(ws);
    if (client) {
      const stillConnected = Array.from(connectedSockets.values()).some(
        (c) => c.userId === client.userId
      );
      if (!stillConnected) {
        broadcastPresence(client.userId, false, 'Just now');
      }
    }
  });
});

// -------------------------------------------------------------
// CHAT REST API ENDPOINTS
// -------------------------------------------------------------

// Helper to find member profile
function getMemberProfile(userId: string) {
  const reg = registeredUsers.find((u) => u.id === userId);
  if (reg) return reg;
  const mem = members.find((m) => m.id === userId);
  if (mem) {
    return {
      id: mem.id,
      name: mem.name,
      email: mem.email,
      avatar: mem.avatar,
      role: mem.role,
      rollNumber: mem.rollNumber,
    };
  }
  return {
    id: userId,
    name: 'Classmate',
    email: 'student@sanctuary.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    rollNumber: '',
  };
}

// 1. Get all conversations (Groups & DMs) for current user
app.get('/api/chat/groups', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const classroomId = (req.query.classroomId as string) || activeUser.classroomId || (classrooms[0]?.id || '');
  const userId = (req.query.userId as string) || activeUser.id;

  // Find all groups where userId is a member
  const userMemberships = chatGroupMembers.filter((m) => m.userId === userId);
  const userGroupIds = new Set(userMemberships.map((m) => m.groupId));

  const relevantGroups = chatGroups
    .filter((g) => userGroupIds.has(g.id) && (!classroomId || g.classroomId === classroomId))
    .map((g) => {
      const groupMembersList = chatGroupMembers.filter((m) => m.groupId === g.id);
      const adminIds = groupMembersList.filter((m) => m.role === 'admin').map((m) => m.userId);
      const memberIds = groupMembersList.map((m) => m.userId);

      // If DM, dynamic title and avatar for the other person
      let displayName = g.name;
      let displayAvatar = g.avatar;

      if (g.isDirect) {
        const otherMemberId = memberIds.find((id) => id !== userId) || userId;
        const otherProfile = getMemberProfile(otherMemberId);
        displayName = otherProfile.name;
        displayAvatar = otherProfile.avatar;
      }

      // Find last message
      const groupMsgs = chatMessages
        .filter((m) => m.groupId === g.id)
        .sort((a, b) => b.createdAt - a.createdAt);
      const lastMsg = groupMsgs[0];

      // Count unread messages
      const unreadCount = chatMessages.filter(
        (m) => m.groupId === g.id && m.senderId !== userId && !m.readBy.includes(userId)
      ).length;

      return {
        id: g.id,
        classroomId: g.classroomId,
        name: displayName,
        avatar: displayAvatar,
        description: g.description,
        isDirect: g.isDirect,
        createdBy: g.createdBy,
        adminIds,
        memberIds,
        createdAt: g.createdAt,
        unreadCount,
        lastMessage: lastMsg
          ? {
              text:
                lastMsg.type === 'material_forward'
                  ? `📄 Forwarded: ${lastMsg.forwardedMaterial?.title || 'Material'}`
                  : lastMsg.type === 'camera_image'
                  ? '📷 Photo snapshot'
                  : lastMsg.type === 'file'
                  ? `📎 File: ${lastMsg.fileName || 'Attachment'}`
                  : lastMsg.content,
              timestamp: lastMsg.timestamp,
              senderName: lastMsg.senderName,
              senderId: lastMsg.senderId,
              type: lastMsg.type,
            }
          : undefined,
      };
    })
    .sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

  res.json(relevantGroups);
});

// 2. Create a new Group
app.post('/api/chat/groups', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  if (activeUser.role !== 'super_admin' && activeUser.role !== 'admin') {
    return res.status(403).json({
      error: 'Only cohort administrators can create group channels. You can message classmates directly via direct message.',
    });
  }

  const { name, avatar, description, memberIds = [], classroomId } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Group name is required' });
  }

  const groupId = `grp-${Date.now()}`;
  const effectiveClassroomId = classroomId || activeUser.classroomId || (classrooms[0]?.id || '');
  const groupAvatar =
    avatar ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80';

  const newGroup: ChatGroupRecord = {
    id: groupId,
    classroomId: effectiveClassroomId,
    name: name.trim(),
    avatar: groupAvatar,
    description: (description || '').trim(),
    isDirect: false,
    createdBy: activeUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatGroups.push(newGroup);

  // Group creator becomes admin
  chatGroupMembers.push({
    groupId,
    userId: activeUser.id,
    role: 'admin',
    joinedAt: new Date().toISOString(),
  });

  // Add selected members
  const uniqueMemberIds = Array.from(new Set(memberIds as string[])).filter(
    (id) => id !== activeUser.id
  );
  uniqueMemberIds.forEach((uid) => {
    chatGroupMembers.push({
      groupId,
      userId: uid,
      role: 'member',
      joinedAt: new Date().toISOString(),
    });
  });

  // Add system welcome message
  const welcomeMsg: ChatMessageRecord = {
    id: `msg-${Date.now()}`,
    groupId,
    senderId: activeUser.id,
    senderName: activeUser.name,
    senderAvatar: activeUser.avatar,
    type: 'text',
    content: `Created group "${newGroup.name}". Welcome everyone!`,
    timestamp: 'Just now',
    createdAt: Date.now(),
    deliveredTo: [activeUser.id],
    readBy: [activeUser.id],
  };
  chatMessages.push(welcomeMsg);

  // Broadcast to all newly added members
  broadcastToGroup(groupId, {
    type: 'chat:group_created',
    group: newGroup,
  });

  res.status(201).json({
    ...newGroup,
    adminIds: [activeUser.id],
    memberIds: [activeUser.id, ...uniqueMemberIds],
    unreadCount: 0,
    lastMessage: {
      text: welcomeMsg.content,
      timestamp: welcomeMsg.timestamp,
      senderName: welcomeMsg.senderName,
      senderId: welcomeMsg.senderId,
      type: 'text',
    },
  });
});

// 3. Get or Create a 1-on-1 Direct Chat
app.post('/api/chat/direct', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { targetUserId, classroomId } = req.body;
  if (!targetUserId) {
    return res.status(400).json({ error: 'Target user ID is required' });
  }

  const effectiveClassroomId = classroomId || activeUser.classroomId || (classrooms[0]?.id || '');

  // Check if a direct chat between these two already exists
  const myDms = chatGroupMembers
    .filter((m) => m.userId === activeUser.id)
    .map((m) => m.groupId);

  let existingGroupId: string | null = null;
  for (const gid of myDms) {
    const grp = chatGroups.find((g) => g.id === gid && g.isDirect);
    if (grp) {
      const otherMember = chatGroupMembers.find(
        (m) => m.groupId === gid && m.userId === targetUserId
      );
      if (otherMember) {
        existingGroupId = gid;
        break;
      }
    }
  }

  if (existingGroupId) {
    const grp = chatGroups.find((g) => g.id === existingGroupId)!;
    const targetUser = getMemberProfile(targetUserId);
    return res.json({
      ...grp,
      name: targetUser.name,
      avatar: targetUser.avatar,
      adminIds: [activeUser.id, targetUserId],
      memberIds: [activeUser.id, targetUserId],
    });
  }

  // Create new Direct Chat
  const newDmId = `dm-${[activeUser.id, targetUserId].sort().join('-')}`;
  const targetUser = getMemberProfile(targetUserId);

  const newDm: ChatGroupRecord = {
    id: newDmId,
    classroomId: effectiveClassroomId,
    name: targetUser.name,
    avatar: targetUser.avatar,
    description: 'Direct Message',
    isDirect: true,
    createdBy: activeUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chatGroups.push(newDm);
  chatGroupMembers.push({
    groupId: newDmId,
    userId: activeUser.id,
    role: 'admin',
    joinedAt: new Date().toISOString(),
  });
  chatGroupMembers.push({
    groupId: newDmId,
    userId: targetUserId,
    role: 'admin',
    joinedAt: new Date().toISOString(),
  });

  res.status(201).json({
    ...newDm,
    name: targetUser.name,
    avatar: targetUser.avatar,
    adminIds: [activeUser.id, targetUserId],
    memberIds: [activeUser.id, targetUserId],
  });
});

// 4. Get Group Info with Full Member List (Roles & Real-Time Presence)
app.get('/api/chat/groups/:id', (req, res) => {
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  const memberRecords = chatGroupMembers.filter((m) => m.groupId === group.id);
  const populatedMembers = memberRecords.map((rec) => {
    const profile = getMemberProfile(rec.userId);
    return {
      userId: rec.userId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      role: rec.role,
      rollNumber: profile.rollNumber,
      isOnline: isUserOnline(rec.userId),
      lastSeen: isUserOnline(rec.userId) ? 'Online' : 'Recently active',
    };
  });

  res.json({
    ...group,
    adminIds: memberRecords.filter((m) => m.role === 'admin').map((m) => m.userId),
    memberIds: memberRecords.map((m) => m.userId),
    members: populatedMembers,
  });
});

// 5. Update Group Info (Admin only)
app.patch('/api/chat/groups/:id', (req, res) => {
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  // Security Check: Verify user is an admin
  const activeUser = getCurrentOrReqUser(req);
  const userMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!userMember || userMember.role !== 'admin') {
    return res.status(403).json({ error: 'Only group admins can update group settings' });
  }

  const { name, avatar, description } = req.body;
  if (name && name.trim()) group.name = name.trim();
  if (avatar && avatar.trim()) group.avatar = avatar.trim();
  if (typeof description === 'string') group.description = description.trim();
  group.updatedAt = new Date().toISOString();

  broadcastToGroup(group.id, {
    type: 'chat:group_updated',
    groupId: group.id,
    group,
  });

  res.json(group);
});

// 6. Delete Group (Admin only)
app.delete('/api/chat/groups/:id', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupIndex = chatGroups.findIndex((g) => g.id === req.params.id);
  if (groupIndex === -1) {
    return res.status(404).json({ error: 'Group not found' });
  }

  const group = chatGroups[groupIndex];
  const userMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!userMember || userMember.role !== 'admin') {
    return res.status(403).json({ error: 'Only group admins can delete the group' });
  }

  // Notify members before deleting
  broadcastToGroup(group.id, {
    type: 'chat:group_deleted',
    groupId: group.id,
  });

  // Cascade delete group, members, and messages
  chatGroups.splice(groupIndex, 1);
  chatGroupMembers = chatGroupMembers.filter((m) => m.groupId !== group.id);
  chatMessages = chatMessages.filter((m) => m.groupId !== group.id);

  res.json({ success: true, message: 'Group deleted successfully' });
});

// 7. Add Members to Group (Admin only)
app.post('/api/chat/groups/:id/members', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const adminMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!adminMember || adminMember.role !== 'admin') {
    return res.status(403).json({ error: 'Only group admins can add members' });
  }

  const { memberIds = [] } = req.body;
  const existingUserIds = new Set(
    chatGroupMembers.filter((m) => m.groupId === group.id).map((m) => m.userId)
  );

  const added: string[] = [];
  memberIds.forEach((uid: string) => {
    if (!existingUserIds.has(uid)) {
      chatGroupMembers.push({
        groupId: group.id,
        userId: uid,
        role: 'member',
        joinedAt: new Date().toISOString(),
      });
      added.push(uid);
    }
  });

  if (added.length > 0) {
    broadcastToGroup(group.id, {
      type: 'chat:members_added',
      groupId: group.id,
      addedUserIds: added,
    });
  }

  res.json({ success: true, addedCount: added.length });
});

// 8. Remove Member or Leave Group
app.delete('/api/chat/groups/:id/members/:userId', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const targetUserId = req.params.userId;
  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );

  // Self removal (leaving) OR admin removal
  const isSelf = targetUserId === activeUser.id;
  const isAdmin = callerMember && callerMember.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ error: 'Unauthorized to remove this member' });
  }

  chatGroupMembers = chatGroupMembers.filter(
    (m) => !(m.groupId === group.id && m.userId === targetUserId)
  );

  broadcastToGroup(group.id, {
    type: 'chat:member_removed',
    groupId: group.id,
    userId: targetUserId,
  });

  res.json({ success: true });
});

// Ban and Remove Member from Chat Group (Admin only)
app.post('/api/chat/groups/:id/members/:userId/ban', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const targetUserId = req.params.userId;
  if (targetUserId === activeUser.id) {
    return res.status(400).json({ error: 'You cannot ban yourself from the group.' });
  }

  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  const isCohortAdmin = activeUser.role === 'super_admin' || activeUser.role === 'admin';
  const isGroupAdmin = callerMember && callerMember.role === 'admin';

  if (!isCohortAdmin && !isGroupAdmin) {
    return res.status(403).json({ error: 'Only group administrators can ban members from this group' });
  }

  // Check if target is super admin
  const targetMember = members.find((m) => m.id === targetUserId);
  if (targetMember && targetMember.role === 'super_admin') {
    return res.status(403).json({ error: 'Cannot ban the Super Admin.' });
  }

  // Remove member from group
  chatGroupMembers = chatGroupMembers.filter(
    (m) => !(m.groupId === group.id && m.userId === targetUserId)
  );

  // Add to group banned list
  if (!group.bannedUserIds) group.bannedUserIds = [];
  if (!group.bannedUserIds.includes(targetUserId)) {
    group.bannedUserIds.push(targetUserId);
  }

  broadcastToGroup(group.id, {
    type: 'chat:member_banned',
    groupId: group.id,
    userId: targetUserId,
    bannedBy: activeUser.name,
  });

  res.json({ success: true, banned: true, userId: targetUserId });
});

// Get Banned Group Members
app.get('/api/chat/groups/:id/banned', (req, res) => {
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  res.json(group.bannedUserIds || []);
});

// 9. Promote or Demote Member Role (Admin only)
app.patch('/api/chat/groups/:id/members/:userId/role', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const group = chatGroups.find((g) => g.id === req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === activeUser.id
  );
  if (!callerMember || callerMember.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can change member roles' });
  }

  const targetMember = chatGroupMembers.find(
    (m) => m.groupId === group.id && m.userId === req.params.userId
  );
  if (!targetMember) return res.status(404).json({ error: 'Member not found in group' });

  const { role } = req.body;
  if (role !== 'admin' && role !== 'member') {
    return res.status(400).json({ error: 'Invalid role' });
  }

  targetMember.role = role;

  broadcastToGroup(group.id, {
    type: 'chat:role_changed',
    groupId: group.id,
    userId: req.params.userId,
    newRole: role,
  });

  res.json({ success: true, newRole: role });
});

// 10. Get Messages for a Group
app.get('/api/chat/groups/:id/messages', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupId = req.params.id;

  // Verify caller is a member of this group
  const isMember = chatGroupMembers.some(
    (m) => m.groupId === groupId && m.userId === activeUser.id
  );
  if (!isMember) {
    return res.status(403).json({ error: 'Access denied: You are not a member of this conversation' });
  }

  // Mark delivered to activeUser
  const groupMsgs = chatMessages.filter((m) => m.groupId === groupId);
  groupMsgs.forEach((m) => {
    if (!m.deliveredTo.includes(activeUser.id)) {
      m.deliveredTo.push(activeUser.id);
    }
  });

  res.json(groupMsgs);
});

// 11. Send a Message (Text, Forward Material, Camera Snap, or File)
app.post('/api/chat/groups/:id/messages', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupId = req.params.id;
  const isMember = chatGroupMembers.some(
    (m) => m.groupId === groupId && m.userId === activeUser.id
  );
  if (!isMember) {
    return res.status(403).json({ error: 'Cannot send message to a group you do not belong to' });
  }

  const { type = 'text', content, fileUrl, fileName, fileSize, forwardedMaterial, replyTo } = req.body;

  if (!content && !fileUrl && !forwardedMaterial) {
    return res.status(400).json({ error: 'Message content or attachment is required' });
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg: ChatMessageRecord = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    groupId,
    senderId: activeUser.id,
    senderName: activeUser.name,
    senderAvatar: activeUser.avatar,
    type,
    content: (content || '').trim(),
    fileUrl,
    fileName,
    fileSize,
    forwardedMaterial,
    replyTo: replyTo || undefined,
    reactions: [],
    timestamp: timeFormatted,
    createdAt: Date.now(),
    deliveredTo: [activeUser.id],
    readBy: [activeUser.id],
  };

  chatMessages.push(newMsg);

  // Update group timestamp
  const group = chatGroups.find((g) => g.id === groupId);
  if (group) {
    group.updatedAt = new Date().toISOString();
  }

  // Instant broadcast via WebSocket
  broadcastToGroup(groupId, {
    type: 'chat:message_new',
    groupId,
    message: newMsg,
  });

  res.status(201).json(newMsg);
});

// 12. React to Message (Toggle reaction)
app.post('/api/chat/messages/:id/react', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  const { emoji } = req.body;
  if (!emoji) return res.status(400).json({ error: 'Emoji is required' });

  if (!msg.reactions) msg.reactions = [];
  const existingIndex = msg.reactions.findIndex(
    (r) => r.userId === activeUser.id && r.emoji === emoji
  );

  if (existingIndex > -1) {
    // Toggle off
    msg.reactions.splice(existingIndex, 1);
  } else {
    // Add reaction
    msg.reactions.push({
      emoji,
      userId: activeUser.id,
      userName: activeUser.name,
    });
  }

  broadcastToGroup(msg.groupId, {
    type: 'chat:message_reaction',
    groupId: msg.groupId,
    messageId: msg.id,
    reactions: msg.reactions,
  });

  res.json({ success: true, reactions: msg.reactions });
});

// 13. Pin / Unpin Message
app.post('/api/chat/messages/:id/pin', (req, res) => {
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });

  const group = chatGroups.find((g) => g.id === msg.groupId);
  const willBePinned = !msg.isPinned;

  if (willBePinned) {
    // Clear other pins in this group
    chatMessages
      .filter((m) => m.groupId === msg.groupId)
      .forEach((m) => {
        m.isPinned = false;
      });
    msg.isPinned = true;
    if (group) group.pinnedMessageId = msg.id;
  } else {
    msg.isPinned = false;
    if (group && group.pinnedMessageId === msg.id) {
      group.pinnedMessageId = undefined;
    }
  }

  broadcastToGroup(msg.groupId, {
    type: 'chat:message_pinned',
    groupId: msg.groupId,
    messageId: msg.id,
    isPinned: msg.isPinned,
    pinnedMessage: willBePinned ? msg : null,
  });

  res.json({ success: true, isPinned: msg.isPinned, message: msg });
});

// 14. Star / Unstar Message
app.post('/api/chat/messages/:id/star', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });

  if (!msg.starredBy) msg.starredBy = [];
  const idx = msg.starredBy.indexOf(activeUser.id);
  let isStarred = false;
  if (idx > -1) {
    msg.starredBy.splice(idx, 1);
    isStarred = false;
  } else {
    msg.starredBy.push(activeUser.id);
    isStarred = true;
  }
  msg.isStarred = isStarred;

  res.json({ success: true, isStarred, messageId: msg.id });
});

// 15. Forward Message to target group(s)
app.post('/api/chat/messages/forward', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { messageId, targetGroupIds } = req.body;
  const sourceMsg = chatMessages.find((m) => m.id === messageId);
  if (!sourceMsg) return res.status(404).json({ error: 'Source message not found' });
  if (!Array.isArray(targetGroupIds) || targetGroupIds.length === 0) {
    return res.status(400).json({ error: 'targetGroupIds must be non-empty array' });
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const createdMsgs: ChatMessageRecord[] = [];

  for (const tGroupId of targetGroupIds) {
    const isMember = chatGroupMembers.some(
      (m) => m.groupId === tGroupId && m.userId === activeUser.id
    );
    if (!isMember) continue;

    const fwdMsg: ChatMessageRecord = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      groupId: tGroupId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      type: sourceMsg.type,
      content: sourceMsg.content,
      fileUrl: sourceMsg.fileUrl,
      fileName: sourceMsg.fileName,
      fileSize: sourceMsg.fileSize,
      forwardedMaterial: sourceMsg.forwardedMaterial,
      timestamp: timeFormatted,
      createdAt: Date.now(),
      deliveredTo: [activeUser.id],
      readBy: [activeUser.id],
    };

    chatMessages.push(fwdMsg);
    createdMsgs.push(fwdMsg);

    const grp = chatGroups.find((g) => g.id === tGroupId);
    if (grp) grp.updatedAt = new Date().toISOString();

    broadcastToGroup(tGroupId, {
      type: 'chat:message_new',
      groupId: tGroupId,
      message: fwdMsg,
    });
  }

  res.json({ success: true, forwardedCount: createdMsgs.length });
});

// 15b. Forward Material to Multiple Groups / Direct Chats
app.post('/api/chat/materials/forward', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const { material, targetGroupIds, targetUserIds, note } = req.body;
  if (!material) {
    return res.status(400).json({ error: 'Material is required' });
  }

  const effectiveClassroomId = activeUser.classroomId || (classrooms[0]?.id || '');
  const resolvedGroupIds = new Set<string>();

  if (Array.isArray(targetGroupIds)) {
    targetGroupIds.forEach((gid) => {
      if (typeof gid === 'string' && gid.trim()) resolvedGroupIds.add(gid.trim());
    });
  }

  // If targetUserIds provided, resolve or create direct chat DMs
  if (Array.isArray(targetUserIds)) {
    for (const targetUserId of targetUserIds) {
      if (!targetUserId || targetUserId === activeUser.id) continue;

      const myDms = chatGroupMembers
        .filter((m) => m.userId === activeUser.id)
        .map((m) => m.groupId);

      let existingGroupId: string | null = null;
      for (const gid of myDms) {
        const grp = chatGroups.find((g) => g.id === gid && g.isDirect);
        if (grp) {
          const otherMember = chatGroupMembers.find(
            (m) => m.groupId === gid && m.userId === targetUserId
          );
          if (otherMember) {
            existingGroupId = gid;
            break;
          }
        }
      }

      if (existingGroupId) {
        resolvedGroupIds.add(existingGroupId);
      } else {
        // Create new Direct Chat
        const newDmId = `dm-${[activeUser.id, targetUserId].sort().join('-')}`;
        const targetUser = getMemberProfile(targetUserId);

        const newDm: ChatGroupRecord = {
          id: newDmId,
          classroomId: effectiveClassroomId,
          name: targetUser.name,
          avatar: targetUser.avatar,
          description: 'Direct Message',
          isDirect: true,
          createdBy: activeUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        chatGroups.push(newDm);
        chatGroupMembers.push({
          groupId: newDmId,
          userId: activeUser.id,
          role: 'admin',
          joinedAt: new Date().toISOString(),
        });
        chatGroupMembers.push({
          groupId: newDmId,
          userId: targetUserId,
          role: 'admin',
          joinedAt: new Date().toISOString(),
        });

        resolvedGroupIds.add(newDmId);
      }
    }
  }

  if (resolvedGroupIds.size === 0) {
    return res.status(400).json({ error: 'At least one target group or user is required' });
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const createdMsgs: ChatMessageRecord[] = [];

  const forwardedMaterialInfo = {
    id: material.id,
    title: material.title,
    subjectCode: material.subjectCode || 'ACAD',
    subjectName: material.subjectName || material.title,
    type: material.type || 'notes',
    fileFormat: material.fileFormat || 'PDF',
    fileSize: material.fileSize || '1.5 MB',
    snippet: material.contentSnippet || `${material.title} - Shared from Academic Sanctuary Notes Repository.`,
  };

  for (const tGroupId of resolvedGroupIds) {
    const isMember = chatGroupMembers.some(
      (m) => m.groupId === tGroupId && m.userId === activeUser.id
    );
    if (!isMember) continue;

    const fwdMsg: ChatMessageRecord = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      groupId: tGroupId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      type: 'material_forward',
      content: note && typeof note === 'string' && note.trim() ? note.trim() : material.title,
      forwardedMaterial: forwardedMaterialInfo,
      timestamp: timeFormatted,
      createdAt: Date.now(),
      deliveredTo: [activeUser.id],
      readBy: [activeUser.id],
    };

    chatMessages.push(fwdMsg);
    createdMsgs.push(fwdMsg);

    const grp = chatGroups.find((g) => g.id === tGroupId);
    if (grp) {
      grp.updatedAt = new Date().toISOString();
    }

    broadcastToGroup(tGroupId, {
      type: 'chat:message_new',
      groupId: tGroupId,
      message: fwdMsg,
    });
  }

  res.json({
    success: true,
    forwardedCount: createdMsgs.length,
    groupIds: Array.from(resolvedGroupIds),
  });
});

// 16. Delete Message
app.delete('/api/chat/messages/:id', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const msg = chatMessages.find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });

  // Security: Only sender or group admin can delete
  const isSender = msg.senderId === activeUser.id;
  const callerMember = chatGroupMembers.find(
    (m) => m.groupId === msg.groupId && m.userId === activeUser.id
  );
  const isAdmin = callerMember && callerMember.role === 'admin';

  if (!isSender && !isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to delete this message' });
  }

  msg.isDeleted = true;
  msg.content = 'This message was deleted';
  msg.fileUrl = undefined;
  msg.forwardedMaterial = undefined;

  broadcastToGroup(msg.groupId, {
    type: 'chat:message_deleted',
    groupId: msg.groupId,
    messageId: msg.id,
  });

  res.json({ success: true, message: msg });
});

// 17. Mark Conversation Messages as Read
app.post('/api/chat/groups/:id/read', (req, res) => {
  const activeUser = getCurrentOrReqUser(req);
  const groupId = req.params.id;
  const unread = chatMessages.filter(
    (m) => m.groupId === groupId && !m.readBy.includes(activeUser.id)
  );

  unread.forEach((m) => {
    m.readBy.push(activeUser.id);
    if (!m.deliveredTo.includes(activeUser.id)) {
      m.deliveredTo.push(activeUser.id);
    }
  });

  broadcastToGroup(groupId, {
    type: 'chat:read_receipt',
    groupId,
    userId: activeUser.id,
  });

  res.json({ success: true, readCount: unread.length });
});

// 18. Update Current User Profile (Name and Avatar)
app.patch('/api/users/profile', (req, res) => {
  const { name, avatar } = req.body;
  if (!currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  if (name && typeof name === 'string' && name.trim()) {
    currentUser.name = name.trim();
  }
  if (avatar && typeof avatar === 'string' && avatar.trim()) {
    currentUser.avatar = avatar.trim();
  }
  // Update in registeredUsers
  const reg = registeredUsers.find((u) => u.id === currentUser.id);
  if (reg) {
    if (name && typeof name === 'string' && name.trim()) reg.name = name.trim();
    if (avatar && typeof avatar === 'string' && avatar.trim()) reg.avatar = avatar.trim();
  }
  // Update in members
  const mem = members.find((m) => m.id === currentUser.id);
  if (mem) {
    if (name && typeof name === 'string' && name.trim()) mem.name = name.trim();
    if (avatar && typeof avatar === 'string' && avatar.trim()) mem.avatar = avatar.trim();
  }
  // Update messages sent by current user
  chatMessages.forEach((m) => {
    if (m.senderId === currentUser.id) {
      if (name && typeof name === 'string' && name.trim()) m.senderName = name.trim();
      if (avatar && typeof avatar === 'string' && avatar.trim()) m.senderAvatar = avatar.trim();
    }
  });

  // Broadcast user update to all active clients
  for (const [clientWs] of connectedSockets.entries()) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'chat:user_profile_updated',
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        })
      );
    }
  }

  res.json({ success: true, user: currentUser });
});

// 19. Rename Friend / Contact (Change ONLY friend's name in direct chat)
app.patch('/api/chat/friend-name', (req, res) => {
  const { targetUserId, name, groupId } = req.body;
  if (!targetUserId || !name || !name.trim()) {
    return res.status(400).json({ error: 'Target user ID and new name are required' });
  }

  const newName = name.trim();

  // Update in registeredUsers
  const reg = registeredUsers.find((u) => u.id === targetUserId);
  if (reg) {
    reg.name = newName;
  }

  // Update in members
  const mem = members.find((m) => m.id === targetUserId);
  if (mem) {
    mem.name = newName;
  }

  // If direct group, update the direct chat group record name if stored
  if (groupId) {
    const grp = chatGroups.find((g) => g.id === groupId);
    if (grp && grp.isDirect) {
      grp.name = newName;
    }
  }

  // Update all messages from this friend so their bubble sender name updates
  chatMessages.forEach((m) => {
    if (m.senderId === targetUserId) {
      m.senderName = newName;
    }
  });

  // Broadcast friend name update
  for (const [clientWs] of connectedSockets.entries()) {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'chat:friend_renamed',
          userId: targetUserId,
          newName,
          groupId,
        })
      );
    }
  }

  res.json({ success: true, targetUserId, newName });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Academic Sanctuary server running on http://0.0.0.0:${PORT}`);
    });
  }
}

export { app, server };
export default app;

if (!process.env.VERCEL) {
  startServer();
}
