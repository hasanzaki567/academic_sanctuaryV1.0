<div align="center">

# 📚 Academic Sanctuary

### *Your Class. Your Notes. Your Knowledge.*

A collaborative digital library and classroom workspace for college cohorts to share notes, organize subjects, and prepare for exams — together.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

</div>

## 🌟 Overview

**Academic Sanctuary** is a full-stack web application designed for university students and faculty to collaboratively manage their academic lives. It provides a centralized hub where a class or cohort can share study materials, manage subject repositories, track exam schedules, post announcements, and build a structured knowledge base — all within a beautiful, modern interface.

Whether you're a class representative organizing resources for 60+ students, a professor distributing lecture slides, or a student hunting for last year's question papers, Academic Sanctuary brings everything into one unified workspace.

---

## ✨ Features

### 🏫 Classroom Management
- **Create & Join Classrooms** — Set up a classroom for your batch/section with college details, department, course info, and semester. Others can join via a unique classroom code.
- **Role-Based Access** — Three-tier role system: **Super Admin** (classroom creator), **Admin** (class reps/moderators), and **Student**.
- **Multi-Classroom Support** — Switch between enrolled classrooms seamlessly via the navbar.

### 📖 Subjects & Materials
- **Subject Repository** — Browse all enrolled subjects with professor info, credit hours, and resource counts.
- **Material Library** — Upload, browse, and download study materials categorized by type:
  - 📝 **Notes** — Handwritten or typed lecture notes
  - 📚 **Materials** — Official lecture slides, textbooks, reference docs
  - 📄 **PYQs** (Previous Year Questions) — Past exam papers with solutions
  - ⭐ **Important Questions** — Curated high-yield questions for exam prep
- **In-App Document Reader** — Preview materials with formatted content rendering directly in the browser.
- **Tags & Unit Organization** — Materials are tagged and organized by unit/chapter for easy discovery.

### 📢 Announcements
- **Cohort-wide Announcements** — Admins and super admins can post urgent notices, deadline extensions, and event notifications.
- **Urgency Indicators** — Mark critical announcements to ensure visibility.

### 📅 Exam Schedule
- **Countdown Dashboard** — Track upcoming exams with days-remaining countdowns.
- **Exam Details** — View date, time, venue, and subject-wise preparation progress.
- **Add New Exams** — Admins can add and manage the exam calendar.

### 👥 Members Directory
- **Cohort Member List** — View all enrolled students with roles, roll numbers, and join dates.
- **Role Badges** — Visual distinction between super admins, admins, and students.

### 🔐 Authentication
- **Login & Signup** — Full authentication flow with email/password.
- **Demo Accounts** — Quick-login with pre-configured demo accounts for testing.
- **Account Switching** — Instantly switch between demo user profiles to test different roles.

### 👤 User Profile
- **Profile Dashboard** — View personal details, role, department, and contribution history.
- **Upload History** — See all materials you've contributed to the library.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 5.8, TailwindCSS 4 |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React, Google Material Symbols |
| **Typography** | Manrope (Google Fonts) |
| **Build Tool** | Vite 6 |
| **Backend** | Express.js 4 (TypeScript via tsx) |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Utilities** | clsx, tailwind-merge, canvas-confetti |

---

## 📂 Project Structure

```
academic-sanctuary/
├── index.html              # HTML entry point
├── server.ts               # Express backend (API routes + Vite dev server)
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies & scripts
├── metadata.json           # App metadata (AI Studio integration)
├── .env.example            # Environment variable template
├── assets/                 # Static assets
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # Root component & app-level state management
    ├── types.ts            # TypeScript type definitions
    ├── index.css           # Global styles
    ├── lib/
    │   └── utils.ts        # Utility functions (cn helper)
    └── components/
        ├── AuthModal.tsx              # Login / Signup authentication modal
        ├── BottomNav.tsx              # Mobile bottom navigation bar
        ├── CreateClassroomWizard.tsx  # Multi-step classroom creation wizard
        ├── DashboardView.tsx          # Main dashboard with announcements & quick actions
        ├── DocumentReaderModal.tsx    # In-app document preview modal
        ├── ExamsScheduleView.tsx      # Exam schedule & countdown view
        ├── JoinClassroomModal.tsx     # Join classroom by code modal
        ├── LandingPage.tsx            # Public landing / hero page
        ├── MembersDirectoryView.tsx   # Cohort members directory
        ├── Navbar.tsx                 # Top navigation bar
        ├── NotesRepositoryView.tsx    # Browsable notes & materials library
        ├── ProfileView.tsx            # User profile dashboard
        ├── SubjectDetailView.tsx      # Individual subject with its materials
        ├── SubjectsListView.tsx       # All subjects grid view
        └── UploadMaterialModal.tsx    # Material upload form modal
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **bun** package manager
- A **Gemini API Key** (for AI features) — [Get one here](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hasanzaki567/academic_sanctuaryV1.0.git
   cd academic_sanctuaryV1.0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at **http://localhost:3000**

### Build for Production

```bash
npm run build     # Builds frontend (Vite) + backend (esbuild)
npm start         # Runs the production server
```

---

## 📸 Demo Accounts

The app ships with pre-configured demo accounts for quick testing:

| Name | Email | Role | Classroom |
|------|-------|------|-----------|
| Sarah Jenkins | sarah.j@oxford.edu | Super Admin | B.Tech CSE 2026 - Section A |
| Michael Klein | michael.k@oxford.edu | Admin | B.Tech CSE 2026 - Section A |
| Elena Rostova | elena.r@oxford.edu | Student | B.Tech CSE 2026 - Section A |
| David Chen | david.c@oxford.edu | Student | B.Tech CSE 2026 - Section A |
| Alex Turner | alex.t@stanford.edu | Super Admin | B.Tech AI & Data Science 2026 |

> **Default password for all accounts:** `password123`

---

## 🔮 Roadmap & Future Vision

Academic Sanctuary is still in its early stages. Here's where we're headed:

### Phase 1 — Core Enhancements *(In Progress)*
- [ ] **Persistent Database** — Migrate from in-memory mock data to PostgreSQL/MongoDB for real data persistence
- [ ] **File Storage** — Integrate cloud storage (AWS S3 / Google Cloud Storage) for actual document uploads & downloads
- [ ] **JWT Authentication** — Replace session-based mock auth with proper JWT-based authentication & refresh tokens
- [ ] **Password Hashing** — Implement bcrypt for secure password storage

### Phase 2 — Collaboration Features
- [ ] **Real-time Chat** — Subject-wise and classroom-wide chat channels using WebSocket
- [ ] **Discussion Forums** — Threaded Q&A for each subject (doubt resolution)
- [ ] **Material Ratings & Reviews** — Upvote/downvote system to surface the best resources
- [ ] **Collaborative Note Editing** — Real-time collaborative markdown editor (like Google Docs)

### Phase 3 — AI-Powered Learning
- [ ] **AI Study Assistant** — Gemini-powered chatbot that can answer questions based on uploaded materials
- [ ] **Auto-Summary Generation** — AI-generated summaries of uploaded notes & lecture slides
- [ ] **Smart Question Generator** — Generate practice questions from uploaded content
- [ ] **Exam Prep Planner** — AI-generated study schedules based on exam dates and syllabus coverage

### Phase 4 — Platform Maturity
- [ ] **Notification System** — Push notifications for new materials, announcements, and exam reminders
- [ ] **Attendance Tracker** — Digital attendance management for classroom sessions
- [ ] **Timetable Integration** — Weekly schedule view synced with classroom subjects
- [ ] **Analytics Dashboard** — Insights on material engagement, study patterns, and preparation progress
- [ ] **Mobile App** — React Native companion app for on-the-go access
- [ ] **Dark Mode** — Full dark theme support

### Phase 5 — Scale & Community
- [ ] **Multi-University Support** — University-level org accounts with multiple departments
- [ ] **Public Material Marketplace** — Opt-in sharing of high-quality resources across universities
- [ ] **Professor Portal** — Dedicated professor dashboard for course management
- [ ] **API Documentation** — Public REST API for third-party integrations
- [ ] **Plugin System** — Extensible architecture for custom features

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing a bug, adding a feature, improving documentation, or suggesting ideas — every contribution matters.

👉 **[Read the Contributing Guide →](CONTRIBUTING.md)**

The contributing guide covers:
- How to set up your development environment
- Code style and conventions
- How to submit pull requests
- Issue reporting guidelines
- Our code of conduct

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for students, by students.**

*Academic Sanctuary — Because knowledge grows when shared.*

</div>
