# 🤝 Contributing to Academic Sanctuary

Thank you for your interest in contributing to **Academic Sanctuary**! We're thrilled to have you here. This document provides guidelines and instructions for contributing to this project.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Project Architecture](#-project-architecture)
- [Code Style Guide](#-code-style-guide)
- [Commit Message Convention](#-commit-message-convention)
- [Pull Request Process](#-pull-request-process)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)
- [Community](#-community)

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- **Be respectful** — Treat everyone with dignity and respect
- **Be constructive** — Provide helpful feedback and suggestions
- **Be inclusive** — Welcome newcomers and help them get started
- **Be patient** — Remember that everyone was a beginner once
- **No harassment** — Harassment, discrimination, or offensive behavior will not be tolerated

---

## 💡 How Can I Contribute?

There are many ways to contribute, even if you're not a developer:

### 🐛 Report Bugs
Found a bug? [Open an issue](../../issues/new?template=bug_report.md) with details on how to reproduce it.

### ✨ Suggest Features
Have an idea for a new feature? [Open a feature request](../../issues/new?template=feature_request.md) and describe what you'd like to see.

### 📝 Improve Documentation
Spot a typo or unclear instruction? Documentation improvements are always welcome.

### 💻 Submit Code
Fix a bug, add a feature, or improve performance — code contributions are the backbone of open source.

### 🎨 Design & UI/UX
Help improve the user interface, design new components, or create visual assets.

### 🧪 Write Tests
Help improve code quality by adding unit tests, integration tests, or end-to-end tests.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18.x — [Download here](https://nodejs.org/)
- **Git** — [Download here](https://git-scm.com/)
- **A code editor** — We recommend [VS Code](https://code.visualstudio.com/)

### Fork & Clone

1. **Fork the repository** by clicking the "Fork" button on GitHub.

2. **Clone your fork:**
   ```bash
   git clone https://github.com/<your-username>/academic_sanctuaryV1.0.git
   cd academic_sanctuaryV1.0
   ```

3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/hasanzaki567/academic_sanctuaryV1.0.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key to `.env.local`:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

6. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.

---

## 🔄 Development Workflow

### 1. Sync with upstream

Before starting any work, make sure your fork is up to date:

```bash
git checkout main
git fetch upstream
git merge upstream/main
```

### 2. Create a feature branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-doc-update
```

**Branch naming conventions:**
| Prefix | Use Case |
|--------|----------|
| `feature/` | New features or enhancements |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring (no feature change) |
| `test/` | Adding or updating tests |
| `style/` | Code style / formatting changes |

### 3. Make your changes

- Write clean, readable code
- Follow the code style guide (below)
- Add comments for complex logic
- Update documentation if needed

### 4. Test your changes

```bash
# Type-check the project
npm run lint

# Run the dev server and test manually
npm run dev

# Build to verify production readiness
npm run build
```

### 5. Commit your changes

```bash
git add .
git commit -m "feat: add real-time chat for subject channels"
```

### 6. Push and create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub from your branch to `main`.

---

## 🏗️ Project Architecture

Understanding the project structure will help you contribute effectively:

```
academic-sanctuary/
├── server.ts               # Express backend — all API routes live here
├── src/
│   ├── App.tsx             # Root component — state management & routing
│   ├── types.ts            # TypeScript interfaces & type definitions
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global styles
│   ├── lib/utils.ts        # Utility functions
│   └── components/         # All UI components
│       ├── AuthModal.tsx
│       ├── DashboardView.tsx
│       ├── Navbar.tsx
│       └── ...
├── index.html              # HTML shell
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies & scripts
```

### Key Patterns

- **State Management** — App-level state is managed in `App.tsx` using React `useState` hooks. Props are passed down to child components.
- **API Communication** — The frontend communicates with the Express backend via `fetch()` calls to `/api/*` endpoints.
- **Mock Database** — Currently, data is stored in-memory in `server.ts`. A priority contribution area is adding a real database.
- **Styling** — TailwindCSS 4 utility classes are used throughout. The design follows a warm, paper-like aesthetic (`#FDFCF8` background) with the Manrope font.
- **Component Organization** — Each major view has its own component file. Modals are separate components rendered at the app level.

---

## 🎨 Code Style Guide

### TypeScript / React

- Use **functional components** with hooks (no class components)
- Use **TypeScript** for all new files (`.ts` / `.tsx`)
- Define interfaces in `src/types.ts` for shared types
- Use `const` by default; `let` only when reassignment is needed
- Destructure props in function parameters
- Use meaningful variable and function names

```tsx
// ✅ Good
const SubjectCard = ({ subject, onSelect }: SubjectCardProps) => {
  const handleClick = () => onSelect(subject);
  return <button onClick={handleClick}>{subject.name}</button>;
};

// ❌ Avoid
function Card(props: any) {
  return <button onClick={() => props.fn(props.data)}>{props.data.name}</button>;
}
```

### CSS / TailwindCSS

- Use Tailwind utility classes for styling
- Follow the existing color palette (warm neutrals, sage greens `#d6e7a1`, charcoal `#1b1c1c`)
- Use the `cn()` utility from `lib/utils.ts` for conditional class merging
- Keep responsive design in mind — mobile-first approach

### File Naming

- Components: `PascalCase.tsx` (e.g., `DashboardView.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)
- Types: `camelCase.ts` (e.g., `types.ts`)

---

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks (deps, config, etc.) |
| `perf` | Performance improvements |

### Examples

```
feat(auth): add JWT-based authentication flow
fix(upload): resolve file size validation on material upload
docs(readme): update installation instructions
refactor(server): extract API routes into separate modules
style(navbar): align classroom switcher dropdown on mobile
```

---

## 🔀 Pull Request Process

1. **Fill out the PR template** — Describe what your changes do and why.
2. **Link related issues** — Reference any issues your PR addresses (e.g., `Closes #42`).
3. **Keep PRs focused** — One feature or fix per PR. Avoid mixing unrelated changes.
4. **Ensure no build errors** — Run `npm run lint` and `npm run build` before submitting.
5. **Add screenshots** — For UI changes, include before/after screenshots.
6. **Be responsive** — Address review feedback promptly.

### PR Title Format

Follow the same convention as commit messages:
```
feat(subjects): add drag-and-drop material reordering
fix(dashboard): correct announcement timestamp display
```

---

## 🐛 Reporting Bugs

When reporting a bug, please include:

1. **Summary** — A clear, concise description of the bug
2. **Steps to Reproduce** — Detailed steps to reproduce the behavior
3. **Expected Behavior** — What you expected to happen
4. **Actual Behavior** — What actually happened
5. **Screenshots** — If applicable, add screenshots or screen recordings
6. **Environment** — Your OS, browser, Node.js version, etc.

### Bug Report Template

```markdown
**Bug Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[If applicable]

**Environment:**
- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node.js: [e.g., 20.10.0]
```

---

## 💡 Suggesting Features

We love hearing new ideas! When suggesting a feature:

1. **Check existing issues** — Your idea might already be discussed
2. **Describe the problem** — What problem does this feature solve?
3. **Propose a solution** — How would you implement it?
4. **Consider alternatives** — Are there simpler approaches?

---

## 🏷️ Issue Labels

We use labels to categorize issues:

| Label | Description |
|-------|-------------|
| `good first issue` | Great for newcomers |
| `help wanted` | Extra attention needed |
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `documentation` | Documentation improvements |
| `priority: high` | Critical issues |
| `priority: low` | Nice-to-have improvements |

> **New contributors:** Look for issues labeled `good first issue` to get started!

---

## 🌍 Community

- **GitHub Issues** — For bug reports and feature requests
- **GitHub Discussions** — For general questions and ideas
- **Pull Requests** — For code contributions

---

## 🙏 Recognition

All contributors will be recognized in the project. We value every contribution, big or small.

---

<div align="center">

**Thank you for helping make Academic Sanctuary better! 🎓**

*Every contribution, no matter how small, makes a difference.*

</div>
