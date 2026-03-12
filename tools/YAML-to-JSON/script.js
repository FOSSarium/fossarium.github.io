const yamlInput = document.getElementById('yaml-input');
const jsonOutput = document.getElementById('json-output');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const indentSelect = document.getElementById('indent-select');
const urlInput = document.getElementById('url-input');
const fetchBtn = document.getElementById('fetch-btn');
const pasteBtn = document.getElementById('paste-btn');

const modalOverlay = document.getElementById('modal-overlay');
const modalOk = document.getElementById('modal-ok');
const modalIcon = document.querySelector('.modal-icon');
const modalTitle = document.querySelector('.modal-card h2');
const modalMessage = document.querySelector('.modal-card p');

function showModal(icon, title, message) {
    modalIcon.setAttribute('name', icon);
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOverlay.style.display = 'flex';
    setTimeout(() => {
        modalOverlay.classList.remove('hidden');
    }, 10);
}

function hideModal() {
    modalOverlay.classList.add('hidden');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
    }, 300);
}

modalOk.addEventListener('click', hideModal);

function convert() {
    const yamlText = yamlInput.value.trim();
    if (!yamlText) {
        jsonOutput.value = '';
        return;
    }

    try {
        const parsed = jsyaml.load(yamlText);
        const indent = indentSelect.value === 'tab' ? '\t' : parseInt(indentSelect.value);
        jsonOutput.value = JSON.stringify(parsed, null, indent);
    } catch (e) {
        jsonOutput.value = '';
        showModal('alert-circle-outline', 'Invalid YAML', e.message || 'Could not parse the YAML input.');
    }
}

// Real-time conversion on input
yamlInput.addEventListener('input', convert);
indentSelect.addEventListener('change', convert);

// Fetch from URL
fetchBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    fetchBtn.disabled = true;
    const icon = fetchBtn.querySelector('ion-icon');
    icon.setAttribute('name', 'refresh-outline');
    icon.classList.add('spinning');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        yamlInput.value = text;
        convert();
    } catch (e) {
        showModal('alert-circle-outline', 'Error', 'Error fetching URL: ' + e.message);
    } finally {
        fetchBtn.disabled = false;
        icon.setAttribute('name', 'arrow-forward-outline');
        icon.classList.remove('spinning');
    }
});

// Paste from Button
pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        yamlInput.value = text;
        convert();
    } catch (err) {
        showModal('clipboard-outline', 'Clipboard Error', 'Failed to read clipboard. Please use Ctrl+V directly.');
    }
});

// Global Paste (Ctrl+V)
document.addEventListener('paste', (e) => {
    if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        const text = (e.clipboardData || window.clipboardData).getData('text');
        yamlInput.value = text;
        convert();
    }
});

clearBtn.addEventListener('click', () => {
    yamlInput.value = '';
    jsonOutput.value = '';
    yamlInput.focus();
});

copyBtn.addEventListener('click', () => {
    if (!jsonOutput.value) return;
    navigator.clipboard.writeText(jsonOutput.value);
    const icon = copyBtn.querySelector('ion-icon');
    copyBtn.style.color = 'var(--success)';
    icon.setAttribute('name', 'checkmark-outline');
    setTimeout(() => {
        copyBtn.style.color = '';
        icon.setAttribute('name', 'copy-outline');
    }, 1500);
});

downloadBtn.addEventListener('click', () => {
    if (!jsonOutput.value) return;
    const blob = new Blob([jsonOutput.value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    a.click();
    URL.revokeObjectURL(url);
});

// File Upload Logic
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        yamlInput.value = e.target.result;
        convert();
    };
    reader.readAsText(file);
}

// Theme Logic
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        if (icon) icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });
}

initTheme();
convert();
