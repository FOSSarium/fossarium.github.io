// ===== State =====
let notes = [];
let activeTab = 0;

const STORAGE_KEY = 'fossarium-notepad';
const editor = document.getElementById('editor');
const tabsContainer = document.getElementById('tabs');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const saveIndicator = document.getElementById('save-indicator');

// ===== Load / Save =====
function loadNotes() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            notes = parsed.notes || [];
            activeTab = parsed.activeTab || 0;
        }
    } catch {}
    if (notes.length === 0) {
        notes = [{ title: 'Note 1', content: '' }];
        activeTab = 0;
    }
    if (activeTab >= notes.length) activeTab = 0;
}

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, activeTab }));
    flashSaveIndicator();
}

function flashSaveIndicator() {
    saveIndicator.style.opacity = '1';
    setTimeout(() => { saveIndicator.style.opacity = '0.5'; }, 1500);
}

// ===== Render Tabs =====
function renderTabs() {
    tabsContainer.innerHTML = notes.map((note, i) => `
        <button class="tab ${i === activeTab ? 'active' : ''}" data-index="${i}">
            ${escapeHtml(note.title)}
            ${notes.length > 1 ? `<span class="close-tab" data-index="${i}" title="Close">&times;</span>` : ''}
        </button>
    `).join('');

    // Tab click
    tabsContainer.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-tab')) return;
            switchTab(parseInt(tab.dataset.index));
        });
    });

    // Close tab
    tabsContainer.querySelectorAll('.close-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(parseInt(btn.dataset.index));
        });
    });
}

function switchTab(index) {
    // Save current content
    notes[activeTab].content = editor.value;
    activeTab = index;
    editor.value = notes[activeTab].content || '';
    renderTabs();
    updateStats();
    saveNotes();
    editor.focus();
}

function closeTab(index) {
    if (notes.length <= 1) return;
    notes.splice(index, 1);
    if (activeTab >= notes.length) activeTab = notes.length - 1;
    if (activeTab < 0) activeTab = 0;
    editor.value = notes[activeTab].content || '';
    renderTabs();
    updateStats();
    saveNotes();
}

// ===== Add Tab =====
document.getElementById('add-tab-btn').addEventListener('click', () => {
    notes[activeTab].content = editor.value;
    notes.push({ title: 'Note ' + (notes.length + 1), content: '' });
    activeTab = notes.length - 1;
    editor.value = '';
    renderTabs();
    updateStats();
    saveNotes();
    editor.focus();
});

// ===== Stats =====
function updateStats() {
    const text = editor.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const lines = text.split('\n').length;
    document.getElementById('stat-words').textContent = words;
    document.getElementById('stat-chars').textContent = chars;
    document.getElementById('stat-lines').textContent = lines;
}

// ===== Editor Events =====
let saveTimeout;
editor.addEventListener('input', () => {
    notes[activeTab].content = editor.value;
    updateStats();
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveNotes, 500);
});

editor.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        editor.setRangeText('    ', start, editor.selectionEnd, 'end');
        notes[activeTab].content = editor.value;
    }
});

// ===== Toolbar =====
document.getElementById('copy-btn').addEventListener('click', () => {
    if (!editor.value.trim()) return;
    navigator.clipboard.writeText(editor.value).then(() => showToast('Copied!'));
});

document.getElementById('clear-btn').addEventListener('click', () => {
    editor.value = '';
    notes[activeTab].content = '';
    updateStats();
    saveNotes();
    editor.focus();
});

document.getElementById('download-btn').addEventListener('click', () => {
    const text = editor.value;
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (notes[activeTab].title || 'note') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!');
});

// ===== Toast =====
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');
    function updateIcon(theme) {
        icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
    }
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('fossarium-theme', newTheme);
        updateIcon(newTheme);
    });
}

// ===== Init =====
initTheme();
loadNotes();
editor.value = notes[activeTab].content || '';
renderTabs();
updateStats();
