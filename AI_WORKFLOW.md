# AI Workflow Note — AjaiaDoc

**Author:** Yahya Mundewadi  
**Assessment:** Ajaia LLC — Full Stack Product Engineer  

---

## AI Tools Used

| Tool | Purpose |
|------|---------|
| **Antigravity (IDE AI Assistant)** | Architectural planning, UI design tokens, component generation |
| **Copilot** | Autocomplete for DOM event listeners and SVG icon structures |

---

## Key Workflow Milestones

### 1. Pivot to Standalone HTML/CSS/JS Architecture
To avoid database configuration & permission errors (such as Supabase RLS recursion 500 errors), AI assisted in distilling the full React feature set into a zero-dependency Vanilla HTML/CSS/JS implementation inside `web_code/`.

### 2. Design System Iteration
Generated a modern, high-contrast light theme CSS system with custom variables for background (`#f8fafc`), surface (`#ffffff`), borders (`#e2e8f0`), and crisp SVG icons.

### 3. File Import & Export Utilities
AI structured the FileReader API logic for `.txt` and `.md` imports and integrated `html2pdf.js` for one-click PDF exports.

---

## Verification & Testing

- Tested 1-click test sign-in (`user1@test.com` and `user2@test.com`).
- Verified document creation, editing, auto-save, and deletion.
- Tested file import with `Sample_Document.md` and `Project_Notes.txt`.
- Verified version history creation and 1-click restoration.
- Verified PDF and Markdown export downloads.
