# Architecture Note — AjaiaDoc

**Author:** Yahya Mundewadi  
**Assessment:** Ajaia LLC — Full Stack Product Engineer  

---

## Overview

AjaiaDoc is a standalone, client-side web application built with **HTML5, Vanilla CSS, and JavaScript**. It is designed for maximum reliability, speed, and portability across any environment without complex database or framework configuration blockers.

---

## System Diagram

```
Browser (Vanilla HTML5 / CSS3 / JavaScript)
    │
    ├── LocalStorage State Engine
    │       ├── documents  → JSON array of all documents & HTML contents
    │       ├── shares     → Granular email access rules (Viewer/Editor)
    │       └── versions   → Version history snapshots
    │
    ├── Export Modules
    │       ├── html2pdf.js → Client-side PDF generation
    │       └── Blob API    → Markdown (.md) download
    │
    └── Import Engine
            └── FileReader API → Instant .txt & .md file parsing
```

---

## Key Design Decisions

### 1. Light Theme & Monochrome Aesthetics
Designed with a crisp, modern light theme (`#ffffff` / `#f8fafc`), dark slate text (`#0f172a`), precise borders (`#e2e8f0`), layered shadows, and clean SVG iconography for an executive product feel.

### 2. Zero-Dependency State Persistence
Stores all documents, shares, and versions in `localStorage` with initial pre-seeded sample data. This guarantees 100% reliable performance across refreshes, tabs, and environments without database permission errors.

### 3. Role-Based Access Control (RBAC) Simulation
Enforces document permissions on both UI and editor canvas:
- **Owner**: Full edit, rename, share, delete, and version snapshot privileges
- **Editor**: Edit and save access
- **Viewer**: Read-only mode with hidden toolbar and non-editable canvas

### 4. Version History Snapshots
Each manual save creates an immutable version snapshot stored in `state.versions`. Users can open the history drawer to review timestamps and restore any previous version with 1 click.

---

## Technical Specifications

| Component | Implementation |
|-----------|----------------|
| UI / Styling | Vanilla CSS3 (Custom design tokens & responsive flex/grid) |
| Icons | Inline Lucide SVG vector graphics |
| Rich Text Engine | HTML5 `contentEditable` + custom DOM parsers |
| PDF Generation | `html2pdf.js` client-side library |
| File Import | HTML5 `FileReader` API (.txt and .md) |
