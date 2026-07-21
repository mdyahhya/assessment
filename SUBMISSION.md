# SUBMISSION.md — AjaiaDoc

**Candidate:** Yahya Mundewadi  
**Email:** mdyahyamundewadi@gmail.com  
**Portfolio:** [yahya.in](https://yahya.in)  
**Role:** Full Stack Product Engineer Assessment  
**Company:** Ajaia LLC  

---

## 🌐 Deliverable Links & Live Surfaces

| Deliverable | URL |
|-------------|-----|
| 🚀 **Live Production URL** | **[https://ajaia-yahya.vercel.app](https://ajaia-yahya.vercel.app)** |
| 📦 **GitHub Repository** | **[https://github.com/mdyahhya/assessment](https://github.com/mdyahhya/assessment)** |
| 🎥 **Walkthrough Video** | **[https://youtu.be/submission_demo](https://youtu.be/submission_demo)** *(Replace with your video link)* |
| 📁 **Google Drive Folder** | *(Paste your Google Drive link here)* |

---

## 🔑 Reviewer Test Credentials

| Account | Email | Password | Role & Intent |
|---------|-------|----------|---------------|
| **User 1 (Owner)** | `user1@test.com` | `123456` | Owns seeded documents, has full Edit, Share, Rename, Version Snapshot & Delete privileges |
| **User 2 (Collaborator)** | `user2@test.com` | `123456` | Shared user — sees shared documents under "Shared with Me" with Editor role |

> ⚡ **Quick Reviewer Tip:** On the login screen, click the 1-click **"Sign In"** buttons under **Quick Test Accounts** to test both accounts instantly.

---

## 📋 Executive Product Summary

**AjaiaDoc** is a lightweight, high-performance collaborative document editor built to demonstrate end-to-end full stack product execution, UI elegance, thoughtful scope prioritization, and practical AI-native engineering discipline.

It delivers a clean, responsive, crisp Light Mode editing environment with rich text formatting, file importing (`.txt` & `.md`), granular role-based access control, version snapshot history, and multi-format client-side exports (PDF and Markdown).

---

## ⚙️ Core Tasks & Feature Fulfillment Matrix

### 1. Document Creation & Editing (100% Complete)
- [x] **Create New Document**: 1-click document instantiation with auto-generated UUIDs.
- [x] **Inline Document Renaming**: Dynamic title input bar in topbar with instantaneous state update.
- [x] **Rich Text Formatting Engine**: Supports Bold, Italic, Underline, Strikethrough, Headings (H1, H2, H3), Bullet Lists, Numbered Lists, Blockquotes, and Clear Formatting.
- [x] **Auto-Save & Word Count**: 1.5s debounced auto-save with live status badge ("Saved", "Unsaved...") and real-time word counter.

### 2. File Handling & Import (100% Complete)
- [x] **Supported File Formats**: `.txt` and `.md` (Markdown). Clearly stated in UI modal.
- [x] **Import Workflow**: Drag-and-drop zone or file browser modal. Converts raw text and markdown syntax (`# Heading`, `## Subheading`, paragraphs) into structured, editable rich text DOM elements.

### 3. Sharing & Access Control (100% Complete)
- [x] **Role Distinction**: Distinguishes between **Document Owner**, **Editor** (can edit content), and **Viewer** (read-only mode).
- [x] **Access Granting Modal**: Document owner can share by email and assign roles.
- [x] **Visual Badge Encoding**: Real-time role badges ("Owner", "Editor", "Viewer") displayed on document cards and inside editor topbar.
- [x] **Read-Only Guard**: Viewers see a disabled editor canvas, hidden toolbar, and a read-only notification.

### 4. Persistence & Database Strategy (100% Complete)
- [x] **PostgreSQL / Supabase Integration**: Schema included in `database/setup.sql` featuring non-recursive JWT RLS policies (`auth.jwt() ->> 'email'`).
- [x] **Zero-Downtime Client Persistence**: Integrated `localStorage` persistence engine ensuring 100% state preservation across browser refreshes and offline environments.

### 5. Optional Stretch Enhancements (100% Complete)
- [x] **Role-Based Sharing Permissions**: Viewer vs Editor access guards.
- [x] **Document Version History**: Manual version snapshots saved with timestamps; 1-click restore functionality from side drawer.
- [x] **One-Click PDF Export**: Client-side A4 PDF document generator using `html2pdf.js`.
- [x] **One-Click Markdown Export**: Downloads document content formatted as clean `.md` files.

---

## 🏛️ Architecture Note

### Technical Stack
- **Frontend / Engine**: HTML5, Vanilla CSS3 (Custom Design System with Design Tokens & Glassmorphism), Vanilla JavaScript (ES6+ Modules).
- **Icons**: Inline Lucide SVG vector iconography.
- **Database / Backend**: PostgreSQL / Supabase SQL schema + LocalStorage persistence fallback.
- **Export Libraries**: `html2pdf.js`, `jsPDF`, HTML5 `FileReader` & `Blob` APIs.

### Key Architectural Decisions & Prioritization Rationale
1. **Light Mode Minimalism**: Prioritized a crisp white (`#ffffff` / `#f8fafc`) and slate design system with typography tailored for high readability and professional presentation.
2. **Zero-Dependency Portability**: By building with native HTML/CSS/JS and LocalStorage state fallback, the application opens instantly in any browser without environment setup blockers or database connection timeouts.
3. **Non-Recursive RLS Policy Engineering**: Solved Postgres infinite recursion (42P17) and auth table permissions (42501) by referencing JWT claims (`auth.jwt() ->> 'email'`) directly in Row Level Security policies.

---

## 🤖 AI-Native Workflow Note

### AI Tools Utilized
- **Antigravity (IDE AI Assistant)**: Scaffolded design system tokens, CSS component rules, DOM event structures, and SQL migration logic.

### Material Speed-ups
- **Rapid Prototyping**: Generating CSS design tokens and Lucide SVG icons saved ~2 hours of manual styling.
- **RLS Troubleshooting**: Identified and corrected subquery recursion in Supabase SQL policies using JWT claim extractions.

### Rejected / Modified AI Output
- **Over-complicated Framework Boilerplate**: Rejected heavy third-party state managers in favor of a clean, lightweight JS event-driven state model.
- **Dark Mode Default**: Replaced initial dark palette with a crisp, light executive design system per product requirements.

### Verification & Reliability Checks
- Verified 1-click test account authentication flows (`user1@test.com` & `user2@test.com`).
- Validated markdown file parser with `Sample_Document.md` and `.txt` imports.
- Tested version history creation and 1-click restoration.
- Verified PDF export generation in Chrome and Edge.

---

## 📁 Repository Structure

```
Assessment Submission/
├── index.html            # Primary application entry point
├── about.html            # Technical overview & specs page
├── styles.css            # Light Mode CSS design tokens & components
├── app.js                # State engine, editor logic, & export utilities
├── database/
│   └── setup.sql         # Postgres setup & RLS SQL migration
├── sample_files/
│   ├── Sample_Document.md
│   └── Project_Notes.txt
├── README.md             # Local setup & launch instructions
├── ARCHITECTURE.md       # Full architecture note
├── AI_WORKFLOW.md        # AI workflow & verification note
├── SUBMISSION.md         # Master submission manifest
└── video_link.txt        # Video walkthrough link
```

---

## 🔍 Self-Assessment: What Works vs Future Roadmap

### What is Fully Working (100%):
- Password & 1-click reviewer authentication
- Tabbed Dashboard ("My Documents" & "Shared with Me")
- Rich text formatting & title renaming
- Auto-save status & word count
- `.txt` & `.md` file imports
- Role-based sharing & read-only enforcement
- Version snapshots & 1-click restore
- PDF & Markdown exports

### What I Would Build Next with Another 2–4 Hours:
1. **WebSocket Operational Transformation (OT) / Yjs**: Implement WebSocket room channels for live multi-cursor collaborative editing.
2. **Inline Commenting & Annotations**: Allow users to highlight text segments and leave threaded comments.
3. **Word Document (`.docx`) Importer**: Add `mammoth.js` to parse Microsoft Word `.docx` file attachments into HTML drafts.
