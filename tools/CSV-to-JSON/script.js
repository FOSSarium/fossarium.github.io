const csvInput = document.getElementById('csv-input');
const jsonOutput = document.getElementById('json-output');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const indentSelect = document.getElementById('indent-select');
const headerRowCheckbox = document.getElementById('header-row');
const previewSection = document.getElementById('preview-section');
const previewTable = document.getElementById('preview-table');

function parseCSV(text) {
    const lines = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentRow.push(currentField.trim());
                currentField = '';
            } else if (char === '\n' || char === '\r') {
                currentRow.push(currentField.trim());
                if (currentRow.length > 0 || currentField !== '') {
                    lines.push(currentRow);
                }
                currentRow = [];
                currentField = '';
                if (char === '\r' && nextChar === '\n') i++;
            } else {
                currentField += char;
            }
        }
    }
    if (currentRow.length > 0 || currentField !== '') {
        currentRow.push(currentField.trim());
        lines.push(currentRow);
    }
    return lines;
}

function convert() {
    const csvText = csvInput.value.trim();
    if (!csvText) {
        jsonOutput.value = '';
        previewSection.classList.add('hidden');
        return;
    }

    const rows = parseCSV(csvText);
    if (rows.length === 0) return;

    let result;
    const hasHeader = headerRowCheckbox.checked;

    if (hasHeader) {
        const headers = rows[0];
        result = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i] !== undefined ? row[i] : null;
            });
            return obj;
        });
        updatePreview(headers, rows.slice(1, 11)); // Preview first 10 rows
    } else {
        result = rows;
        updatePreview(null, rows.slice(0, 10));
    }

    const indent = indentSelect.value === 'tab' ? '\t' : parseInt(indentSelect.value);
    jsonOutput.value = JSON.stringify(result, null, indent);
    previewSection.classList.remove('hidden');
}

function updatePreview(headers, rows) {
    let html = '';
    if (headers) {
        html += `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    }
    html += `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`;
    previewTable.innerHTML = html;
}

const urlInput = document.getElementById('url-input');
const fetchBtn = document.getElementById('fetch-btn');
const pasteBtn = document.getElementById('paste-btn');

// ... (existing helper functions: parseCSV, convert, updatePreview) ...

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
        csvInput.value = text;
        convert();
    } catch (e) {
        alert('Error fetching URL: ' + e.message);
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
        csvInput.value = text;
        convert();
    } catch (err) {
        alert('Failed to read clipboard. Please use Ctrl+V directly.');
    }
});

// Global Paste (Ctrl+V)
document.addEventListener('paste', (e) => {
    if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        const text = (e.clipboardData || window.clipboardData).getData('text');
        csvInput.value = text;
        convert();
    }
});
indentSelect.addEventListener('change', convert);
headerRowCheckbox.addEventListener('change', convert);

clearBtn.addEventListener('click', () => {
    csvInput.value = '';
    convert();
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
        csvInput.value = e.target.result;
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
