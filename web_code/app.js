/* ============================================================
   AjaiaDoc — Application Logic (Vanilla JS)
   ============================================================ */

// ── Initial Seed Data ──────────────────────────────────────
const DEFAULT_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Welcome to AjaiaDoc 🚀',
    content: `<h1>Welcome to AjaiaDoc</h1>
<p>AjaiaDoc is a lightweight, real-time collaborative document editor built by <b>Yahya Mundewadi</b> for the Ajaia LLC Full Stack Product Engineer assessment.</p>
<h2>Key Capabilities</h2>
<ul>
  <li>Rich text formatting (Bold, Italic, Headings, Lists, Quotes)</li>
  <li>File Import (.txt and .md)</li>
  <li>Access Sharing with Viewer & Editor roles</li>
  <li>Version History with one-click restore</li>
  <li>Export to PDF and Markdown</li>
</ul>`,
    owner_id: 'user1@test.com',
    owner_email: 'user1@test.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'doc-2',
    title: 'Shared Product Specs',
    content: `<h1>Shared Product Specs</h1>
<p>This document is owned by <b>user1@test.com</b> and shared with <b>user2@test.com</b> as an Editor.</p>
<p>Sign in as <b>user2@test.com</b> to find this document in the <b>Shared with Me</b> tab and edit it!</p>`,
    owner_id: 'user1@test.com',
    owner_email: 'user1@test.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_SHARES = [
  { id: 'share-1', document_id: 'doc-2', shared_with_email: 'user2@test.com', role: 'editor' }
];

// ── Local Storage Persistence ──────────────────────────────
function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage Save Error:', e);
  }
}

// Global App State
let state = {
  currentUser: getStorage('ajaiadoc_user', null),
  documents: getStorage('ajaiadoc_docs', DEFAULT_DOCUMENTS),
  shares: getStorage('ajaiadoc_shares', DEFAULT_SHARES),
  versions: getStorage('ajaiadoc_versions', []),
  currentDocId: null,
  activeTab: 'mine',
  autosaveTimer: null
};

// ── Toast System ────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Auth Handlers ───────────────────────────────────────────
function initAuth() {
  const authView = document.getElementById('auth-view');
  const dashboardView = document.getElementById('dashboard-view');
  const editorView = document.getElementById('editor-view');
  const headerUserSection = document.getElementById('header-user-section');
  const headerUserEmail = document.getElementById('header-user-email');

  if (state.currentUser) {
    authView.style.display = 'none';
    headerUserSection.style.display = 'flex';
    headerUserEmail.textContent = state.currentUser.email;

    if (state.currentDocId) {
      dashboardView.style.display = 'none';
      editorView.style.display = 'flex';
    } else {
      dashboardView.style.display = 'block';
      editorView.style.display = 'none';
      renderDashboard();
    }
  } else {
    authView.style.display = 'flex';
    dashboardView.style.display = 'none';
    editorView.style.display = 'none';
    headerUserSection.style.display = 'none';
  }
}

function loginUser(email) {
  state.currentUser = { email: email.toLowerCase() };
  setStorage('ajaiadoc_user', state.currentUser);
  showToast(`Signed in as ${email}`, 'success');
  initAuth();
}

function logoutUser() {
  state.currentUser = null;
  state.currentDocId = null;
  localStorage.removeItem('ajaiadoc_user');
  showToast('Signed out', 'success');
  initAuth();
}

// ── Dashboard Handlers ──────────────────────────────────────
function renderDashboard() {
  const grid = document.getElementById('doc-grid');
  const emptyState = document.getElementById('empty-state');
  grid.innerHTML = '';

  const isMine = state.activeTab === 'mine';

  const docs = state.documents.filter(doc => {
    if (isMine) {
      return doc.owner_id === state.currentUser.email;
    } else {
      const share = state.shares.find(s => s.document_id === doc.id && s.shared_with_email === state.currentUser.email);
      return share !== undefined;
    }
  });

  if (docs.length === 0) {
    emptyState.style.display = 'block';
    document.getElementById('empty-title').textContent = isMine ? 'No documents yet' : 'Nothing shared with you';
    document.getElementById('empty-sub').textContent = isMine ? 'Create your first document to get started.' : 'When someone shares a document with you, it will appear here.';
  } else {
    emptyState.style.display = 'none';
    docs.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'doc-card';
      
      let badgeHtml = '';
      if (doc.owner_id === state.currentUser.email) {
        badgeHtml = '<span class="badge badge-owner">Owner</span>';
      } else {
        const share = state.shares.find(s => s.document_id === doc.id && s.shared_with_email === state.currentUser.email);
        const role = share ? share.role : 'viewer';
        badgeHtml = `<span class="badge badge-${role}">${role === 'editor' ? 'Editor' : 'Viewer'}</span>`;
      }

      // Format clean preview snippet
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = doc.content || '';
      const textSnippet = tempDiv.textContent.slice(0, 120) || 'Empty document...';

      card.innerHTML = `
        <div>
          <div class="doc-card-title">${escapeHtml(doc.title)}</div>
          <div class="doc-card-snippet">${escapeHtml(textSnippet)}</div>
        </div>
        <div class="doc-card-footer">
          <span>${formatDate(doc.updated_at)}</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            ${badgeHtml}
            ${doc.owner_id === state.currentUser.email ? `<button class="btn-ghost btn-sm delete-btn" style="color: var(--color-danger); padding: 2px 4px;" title="Delete document">✕</button>` : ''}
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
          e.stopPropagation();
          deleteDoc(doc.id);
        } else {
          openEditor(doc.id);
        }
      });

      grid.appendChild(card);
    });
  }
}

function refreshDocuments() {
  const icon = document.getElementById('refresh-icon');
  icon.style.animation = 'spin 0.7s linear infinite';
  
  // Re-read storage
  state.documents = getStorage('ajaiadoc_docs', DEFAULT_DOCUMENTS);
  state.shares = getStorage('ajaiadoc_shares', DEFAULT_SHARES);

  setTimeout(() => {
    icon.style.animation = 'none';
    renderDashboard();
    showToast('Documents refreshed', 'success');
  }, 500);
}

function createNewDoc() {
  const newDoc = {
    id: 'doc-' + Date.now(),
    title: 'Untitled Document',
    content: '<p>Start writing your document...</p>',
    owner_id: state.currentUser.email,
    owner_email: state.currentUser.email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  state.documents.unshift(newDoc);
  setStorage('ajaiadoc_docs', state.documents);
  showToast('Document created', 'success');
  openEditor(newDoc.id);
}

function deleteDoc(id) {
  if (!confirm('Are you sure you want to delete this document?')) return;
  state.documents = state.documents.filter(d => d.id !== id);
  setStorage('ajaiadoc_docs', state.documents);
  showToast('Document deleted', 'success');
  renderDashboard();
}

// ── Editor Handlers ─────────────────────────────────────────
function openEditor(docId) {
  state.currentDocId = docId;
  const doc = state.documents.find(d => d.id === docId);
  if (!doc) return;

  const canvas = document.getElementById('editor-canvas');
  const titleInput = document.getElementById('editor-title');
  const roleBadge = document.getElementById('editor-role-badge');
  const toolbar = document.getElementById('editor-toolbar');
  const readOnlyMsg = document.getElementById('editor-read-only-msg');

  titleInput.value = doc.title;
  canvas.innerHTML = doc.content || '<p></p>';

  // Determine user permissions
  const isOwner = doc.owner_id === state.currentUser.email;
  let shareRole = null;
  if (!isOwner) {
    const share = state.shares.find(s => s.document_id === docId && s.shared_with_email === state.currentUser.email);
    shareRole = share ? share.role : 'viewer';
  }

  const canEdit = isOwner || shareRole === 'editor';

  if (isOwner) {
    roleBadge.textContent = 'Owner';
    roleBadge.className = 'badge badge-owner';
  } else {
    roleBadge.textContent = shareRole === 'editor' ? 'Editor' : 'Viewer (Read Only)';
    roleBadge.className = `badge badge-${shareRole}`;
  }

  canvas.contentEditable = canEdit ? 'true' : 'false';
  toolbar.style.display = canEdit ? 'flex' : 'none';
  titleInput.disabled = !canEdit;
  document.getElementById('btn-manual-save').style.display = canEdit ? 'inline-flex' : 'none';
  document.getElementById('btn-share-modal').style.display = isOwner ? 'inline-flex' : 'none';
  readOnlyMsg.style.display = canEdit ? 'none' : 'inline';

  updateWordCount();
  initAuth();
}

function updateWordCount() {
  const canvas = document.getElementById('editor-canvas');
  const text = canvas.textContent || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('editor-word-count').textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

function autoSaveDoc() {
  if (!state.currentDocId) return;
  const doc = state.documents.find(d => d.id === state.currentDocId);
  if (!doc) return;

  const titleInput = document.getElementById('editor-title');
  const canvas = document.getElementById('editor-canvas');

  doc.title = titleInput.value.trim() || 'Untitled Document';
  doc.content = canvas.innerHTML;
  doc.updated_at = new Date().toISOString();

  setStorage('ajaiadoc_docs', state.documents);

  const saveStatus = document.getElementById('editor-save-status');
  saveStatus.textContent = 'Saved';
  updateWordCount();
}

function saveVersionSnapshot() {
  if (!state.currentDocId) return;
  const doc = state.documents.find(d => d.id === state.currentDocId);
  if (!doc) return;

  autoSaveDoc();

  const docVersions = state.versions.filter(v => v.document_id === state.currentDocId);
  const versionNum = docVersions.length + 1;

  const newVersion = {
    id: 'v-' + Date.now(),
    document_id: state.currentDocId,
    version_number: versionNum,
    title: doc.title,
    content: doc.content,
    created_at: new Date().toISOString()
  };

  state.versions.unshift(newVersion);
  setStorage('ajaiadoc_versions', state.versions);
  showToast(`Version ${versionNum} snapshot created`, 'success');
}

// ── File Import ─────────────────────────────────────────────
function handleFileImport(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split('\n');

    let htmlContent = '';
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        htmlContent += `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
      } else if (trimmed.startsWith('## ')) {
        htmlContent += `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        htmlContent += `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
      } else if (trimmed) {
        htmlContent += `<p>${escapeHtml(trimmed)}</p>`;
      }
    });

    const newDoc = {
      id: 'doc-' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, "") || 'Imported Document',
      content: htmlContent || '<p></p>',
      owner_id: state.currentUser.email,
      owner_email: state.currentUser.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    state.documents.unshift(newDoc);
    setStorage('ajaiadoc_docs', state.documents);
    showToast(`Imported ${file.name}`, 'success');
    document.getElementById('modal-import').style.display = 'none';
    openEditor(newDoc.id);
  };
  reader.readAsText(file);
}

// ── Sharing ─────────────────────────────────────────────────
function renderShares() {
  const list = document.getElementById('share-list');
  list.innerHTML = '';

  const docShares = state.shares.filter(s => s.document_id === state.currentDocId);
  if (docShares.length === 0) {
    list.innerHTML = '<div style="font-size: 12px; color: var(--color-text-muted);">Not shared with anyone yet.</div>';
    return;
  }

  docShares.forEach(s => {
    const item = document.createElement('div');
    item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding: 6px 10px; background: var(--color-bg); border-radius: 6px; border: 1px solid var(--color-border);';
    item.innerHTML = `
      <span>${escapeHtml(s.shared_with_email)}</span>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span class="badge badge-${s.role}">${s.role}</span>
        <button class="btn-ghost btn-sm" onclick="removeShareItem('${s.id}')" style="color: var(--color-danger); padding: 2px 4px;" title="Remove access">✕</button>
      </div>
    `;
    list.appendChild(item);
  });
}

window.removeShareItem = function(shareId) {
  state.shares = state.shares.filter(s => s.id !== shareId);
  setStorage('ajaiadoc_shares', state.shares);
  showToast('Share access removed', 'success');
  renderShares();
};

// ── Export PDF & Markdown ───────────────────────────────────
function exportToPDF() {
  const canvas = document.getElementById('editor-canvas');
  const title = document.getElementById('editor-title').value || 'document';
  
  const opt = {
    margin: 15,
    filename: `${title}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(canvas).save().then(() => {
    showToast('PDF downloaded', 'success');
  }).catch(() => {
    showToast('PDF generation failed', 'error');
  });
}

function exportToMarkdown() {
  const canvas = document.getElementById('editor-canvas');
  const title = document.getElementById('editor-title').value || 'document';
  
  let md = '';
  canvas.childNodes.forEach(node => {
    if (node.nodeName === 'H1') md += `# ${node.textContent}\n\n`;
    else if (node.nodeName === 'H2') md += `## ${node.textContent}\n\n`;
    else if (node.nodeName === 'H3') md += `### ${node.textContent}\n\n`;
    else if (node.nodeName === 'P') md += `${node.textContent}\n\n`;
    else if (node.nodeName === 'UL') {
      node.childNodes.forEach(li => { if (li.textContent) md += `- ${li.textContent}\n`; });
      md += '\n';
    }
  });

  const blob = new Blob([md || canvas.textContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Markdown downloaded', 'success');
}

// ── Helpers ─────────────────────────────────────────────────
function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Event Listeners ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAuth();

  // Auth Mode Tabs & Form
  let authMode = 'login';
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const authSubmitBtn = document.getElementById('auth-submit-btn');

  tabLogin.addEventListener('click', () => {
    authMode = 'login';
    tabLogin.className = 'auth-tab active';
    tabRegister.className = 'auth-tab';
    authSubmitBtn.textContent = 'Sign In';
  });

  tabRegister.className = 'auth-tab';
  tabRegister.addEventListener('click', () => {
    authMode = 'register';
    tabRegister.className = 'auth-tab active';
    tabLogin.className = 'auth-tab';
    authSubmitBtn.textContent = 'Create Account';
  });

  document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    if (email) {
      if (authMode === 'register') {
        showToast(`Account created for ${email}`, 'success');
      }
      loginUser(email);
    }
  });

  // Quick Test Buttons
  document.getElementById('btn-autofill-user1').addEventListener('click', () => loginUser('user1@test.com'));
  document.getElementById('btn-autofill-user2').addEventListener('click', () => loginUser('user2@test.com'));

  // Sign out & Modals
  document.getElementById('btn-signout').addEventListener('click', logoutUser);
  document.getElementById('btn-dev-modal').addEventListener('click', () => {
    document.getElementById('modal-dev').style.display = 'flex';
  });
  document.getElementById('btn-close-dev').addEventListener('click', () => {
    document.getElementById('modal-dev').style.display = 'none';
  });

  // Refresh
  document.getElementById('btn-refresh-docs').addEventListener('click', refreshDocuments);

  // Tabs
  document.getElementById('tab-my-docs').addEventListener('click', () => {
    state.activeTab = 'mine';
    document.getElementById('tab-my-docs').className = 'tab active';
    document.getElementById('tab-shared-docs').className = 'tab';
    renderDashboard();
  });
  document.getElementById('tab-shared-docs').addEventListener('click', () => {
    state.activeTab = 'shared';
    document.getElementById('tab-shared-docs').className = 'tab active';
    document.getElementById('tab-my-docs').className = 'tab';
    renderDashboard();
  });

  // New Doc
  document.getElementById('btn-new-doc').addEventListener('click', createNewDoc);

  // Editor Actions
  document.getElementById('btn-back-dashboard').addEventListener('click', () => {
    state.currentDocId = null;
    initAuth();
  });

  const canvas = document.getElementById('editor-canvas');
  const titleInput = document.getElementById('editor-title');

  canvas.addEventListener('input', () => {
    document.getElementById('editor-save-status').textContent = 'Unsaved...';
    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(autoSaveDoc, 1500);
  });

  titleInput.addEventListener('input', () => {
    document.getElementById('editor-save-status').textContent = 'Unsaved...';
    clearTimeout(state.autosaveTimer);
    state.autosaveTimer = setTimeout(autoSaveDoc, 1500);
  });

  document.getElementById('btn-manual-save').addEventListener('click', () => {
    saveVersionSnapshot();
  });

  // Rich Text Toolbar
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-command');
      const val = btn.getAttribute('data-val') || null;
      document.execCommand(cmd, false, val);
      canvas.focus();
    });
  });

  // File Import Modal
  document.getElementById('btn-import-modal').addEventListener('click', () => {
    document.getElementById('modal-import').style.display = 'flex';
  });
  document.getElementById('btn-close-import').addEventListener('click', () => {
    document.getElementById('modal-import').style.display = 'none';
  });
  document.getElementById('btn-browse-file').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });
  document.getElementById('file-input').addEventListener('change', (e) => {
    if (e.target.files[0]) handleFileImport(e.target.files[0]);
  });

  // Drag and drop import
  const dropZone = document.getElementById('drop-zone');
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--color-accent)'; });
  dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--color-border-dark)'; });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--color-border-dark)';
    if (e.dataTransfer.files[0]) handleFileImport(e.dataTransfer.files[0]);
  });

  // Share Modal
  document.getElementById('btn-share-modal').addEventListener('click', () => {
    document.getElementById('modal-share').style.display = 'flex';
    renderShares();
  });
  document.getElementById('btn-close-share').addEventListener('click', () => {
    document.getElementById('modal-share').style.display = 'none';
  });
  document.getElementById('form-share').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('share-email').value.trim().toLowerCase();
    const role = document.getElementById('share-role').value;
    if (!email) return;

    state.shares.push({ id: 'share-' + Date.now(), document_id: state.currentDocId, shared_with_email: email, role });
    setStorage('ajaiadoc_shares', state.shares);
    showToast(`Shared with ${email} as ${role}`, 'success');
    document.getElementById('share-email').value = '';
    renderShares();
  });

  // Version History Drawer
  document.getElementById('btn-history-drawer').addEventListener('click', () => {
    const drawer = document.getElementById('drawer-versions');
    const list = document.getElementById('version-list');
    drawer.style.display = 'block';
    list.innerHTML = '';

    const docVersions = state.versions.filter(v => v.document_id === state.currentDocId);
    if (docVersions.length === 0) {
      list.innerHTML = '<div style="font-size: 13px; color: var(--color-text-muted); text-align: center; padding: 32px 0;">No versions saved yet.<br><br>Click <b>Save</b> in the topbar to create version snapshots.</div>';
    } else {
      docVersions.forEach(v => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 12px; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;';
        item.innerHTML = `
          <div>
            <div style="font-size: 13px; font-weight: 600;">v${v.version_number} — ${escapeHtml(v.title)}</div>
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 2px;">${formatDate(v.created_at)}</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="restoreVersion('${v.id}')">Restore</button>
        `;
        list.appendChild(item);
      });
    }
  });

  document.getElementById('btn-close-versions').addEventListener('click', () => {
    document.getElementById('drawer-versions').style.display = 'none';
  });

  window.restoreVersion = function(versionId) {
    const v = state.versions.find(ver => ver.id === versionId);
    if (!v) return;

    document.getElementById('editor-title').value = v.title;
    document.getElementById('editor-canvas').innerHTML = v.content;
    autoSaveDoc();
    showToast(`Restored version ${v.version_number}`, 'success');
    document.getElementById('drawer-versions').style.display = 'none';
  };

  // Exports
  document.getElementById('btn-export-pdf').addEventListener('click', exportToPDF);
  document.getElementById('btn-export-md').addEventListener('click', exportToMarkdown);
});
