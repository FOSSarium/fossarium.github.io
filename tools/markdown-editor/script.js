// ===== DOM Elements =====
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ===== Marked.js Config =====
marked.setOptions({
    breaks: true,
    gfm: true
});

// ===== Render Preview =====
function renderPreview() {
    preview.innerHTML = marked.parse(editor.value);
    updateStats();
}

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

// ===== Toolbar Actions =====
const TOOLBAR_ACTIONS = {
    bold: { before: '**', after: '**', placeholder: 'bold text' },
    italic: { before: '*', after: '*', placeholder: 'italic text' },
    heading: { before: '## ', after: '', placeholder: 'Heading', newLine: true },
    link: { before: '[', after: '](url)', placeholder: 'link text' },
    image: { before: '![', after: '](url)', placeholder: 'alt text' },
    code: { before: '`', after: '`', placeholder: 'code' },
    codeblock: { before: '```\n', after: '\n```', placeholder: 'code block', newLine: true },
    ul: { before: '- ', after: '', placeholder: 'list item', newLine: true },
    ol: { before: '1. ', after: '', placeholder: 'list item', newLine: true },
    quote: { before: '> ', after: '', placeholder: 'blockquote', newLine: true },
    hr: { before: '\n---\n', after: '', placeholder: '', newLine: true }
};

function applyAction(action) {
    const config = TOOLBAR_ACTIONS[action];
    if (!config) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    const text = selectedText || config.placeholder;

    let before = config.before;
    let after = config.after;

    // Add newline before block elements if not at start of line
    if (config.newLine && start > 0 && editor.value[start - 1] !== '\n') {
        before = '\n' + before;
    }

    const replacement = before + text + after;
    editor.setRangeText(replacement, start, end, 'select');

    // Select the inserted text (not the markers)
    const newStart = start + before.length;
    const newEnd = newStart + text.length;
    editor.setSelectionRange(newStart, newEnd);
    editor.focus();

    renderPreview();
    saveContent();
}

// Bind toolbar buttons
document.querySelectorAll('.tb-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
        applyAction(btn.dataset.action);
    });
});

// ===== Copy Buttons =====
document.getElementById('copy-md-btn').addEventListener('click', () => {
    if (!editor.value.trim()) return;
    navigator.clipboard.writeText(editor.value).then(() => showToast('Markdown copied!'));
});

document.getElementById('copy-html-btn').addEventListener('click', () => {
    const html = marked.parse(editor.value);
    if (!html.trim()) return;
    navigator.clipboard.writeText(html).then(() => showToast('HTML copied!'));
});

document.getElementById('clear-btn').addEventListener('click', () => {
    editor.value = '';
    renderPreview();
    saveContent();
});

// ===== Tab Key Support =====
editor.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.setRangeText('    ', start, end, 'end');
        renderPreview();
        saveContent();
    }
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

// ===== Persistence =====
function saveContent() {
    localStorage.setItem('fossarium-md-editor', editor.value);
}

function loadContent() {
    const saved = localStorage.getItem('fossarium-md-editor');
    if (saved !== null) {
        editor.value = saved;
    }
}

// ===== Live Preview =====
editor.addEventListener('input', () => {
    renderPreview();
    saveContent();
});

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
loadContent();
renderPreview();
