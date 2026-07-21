# AjaiaDoc — README

**A lightweight collaborative document editor**  
Built by Yahya Mundewadi | [yahya.in](https://yahya.in) | mdyahyamundewadi@gmail.com

---

## ⚡ Quick Launch (`web_code/`)

You can run the application instantly in two ways:

### Option A: Open Directly in Browser (0 Setup Required)
Open `web_code/index.html` directly in any web browser!

### Option B: Local Web Server
```bash
cd "Assessment Submission\web_code"
npx serve .
```

---

## Reviewer Test Accounts
| Account | Email | Password | Role |
|---------|-------|----------|------|
| Owner | `user1@test.com` | `123456` | Document owner |
| Collaborator | `user2@test.com` | `123456` | Shared user |

> Use the **Sign In** buttons on the login screen for 1-click test access.

---

## Features

- **Rich Text Editing** — Bold, italic, underline, strikethrough, headings (H1–H3), bullet lists, numbered lists, task checklists, blockquotes, undo/redo
- **Document Management** — Create, rename (inline), auto-save (2s debounce), manual save
- **File Import** — Upload `.txt` or `.md` files, converted to editable documents
- **Sharing** — Share by email with Viewer (read-only) or Editor (full edit) roles
- **Version History** — Manual save creates snapshots; restore any version
- **Real-time Sync** — Supabase Realtime broadcasts edits across open tabs/users
- **PDF Export** — One-click PDF download via html2pdf.js
- **Markdown Export** — Download document as `.md` file
- **Persistence** — All data stored in Supabase Postgres; survives refresh

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install
```bash
git clone <your-repo>
cd "Assessment Submission"
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run SQL migrations
In your Supabase dashboard → SQL Editor, run these in order:

1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_rls_policies.sql`

### 4. Enable Realtime (optional, for live sync)
In Supabase dashboard → Database → Replication → enable `documents` table.

### 5. Start the dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 6. Create test accounts
In Supabase → Authentication → Users, create:
- `reviewer1@ajaia.test` / `TestPass123!`
- `reviewer2@ajaia.test` / `TestPass123!`

---

## Run Tests
```bash
npm test
```

---

## Build for Production
```bash
npm run build
```

---

## Supported File Import Formats
- `.txt` — Plain text
- `.md` — Markdown (headings and paragraphs preserved)
- `.docx` — **Not supported** (stated clearly in upload UI)

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite |
| Rich Text | Tiptap v3 |
| Backend / Auth / DB | Supabase (Postgres + RLS + Realtime) |
| PDF Export | html2pdf.js |
| Routing | React Router v7 |
| Styling | Vanilla CSS (custom design system) |
| Testing | Vitest |
| Deployment | Vercel |
