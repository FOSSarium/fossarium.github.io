const jsonInput = document.getElementById('json-input');
const csvOutput = document.getElementById('csv-output');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const delimiterSelect = document.getElementById('delimiter-select');
const headerRowCheckbox = document.getElementById('include-headers');
const previewSection = document.getElementById('preview-section');
const previewTable = document.getElementById('preview-table');

function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

function convertToCSV() {
    const jsonText = jsonInput.value.trim();
    if (!jsonText) {
        csvOutput.value = '';
        previewSection.classList.add('hidden');
        return;
    }

    try {
        let data = JSON.parse(jsonText);
        if (!Array.isArray(data)) {
            data = [data];
        }

        if (data.length === 0) {
            csvOutput.value = '';
            return;
        }

        const flattenedData = data.map(item => flattenObject(item));
        const headers = Array.from(new Set(flattenedData.reduce((acc, item) => acc.concat(Object.keys(item)), [])));
        const delimiter = delimiterSelect.value === 'tab' ? '\t' : delimiterSelect.value;

        let csvRows = [];
        if (headerRowCheckbox.checked) {
            csvRows.push(headers.join(delimiter));
        }

        flattenedData.forEach(row => {
            const values = headers.map(header => {
                const val = row[header] === undefined || row[header] === null ? '' : row[header];
                const escaped = ('' + val).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(delimiter));
        });

        csvOutput.value = csvRows.join('\n');
        updatePreview(headers, flattenedData.slice(0, 10));
        previewSection.classList.remove('hidden');
    } catch (e) {
        csvOutput.value = 'Invalid JSON: ' + e.message;
        previewSection.classList.add('hidden');
    }
}

function updatePreview(headers, rows) {
    let html = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    html += `<tbody>${rows.map(row => `<tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>`;
    previewTable.innerHTML = html;
}

const urlInput = document.getElementById('url-input');
const fetchBtn = document.getElementById('fetch-btn');
const pasteBtn = document.getElementById('paste-btn');

// ... (existing helper functions: flattenObject, convertToCSV, updatePreview) ...

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
        const data = await response.json();
        jsonInput.value = JSON.stringify(data, null, 2);
        convertToCSV();
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
        jsonInput.value = text;
        convertToCSV();
    } catch (err) {
        alert('Failed to read clipboard. Please use Ctrl+V directly.');
    }
});

// Global Paste (Ctrl+V)
document.addEventListener('paste', (e) => {
    if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        const text = (e.clipboardData || window.clipboardData).getData('text');
        jsonInput.value = text;
        convertToCSV();
    }
});
delimiterSelect.addEventListener('change', convertToCSV);
headerRowCheckbox.addEventListener('change', convertToCSV);

clearBtn.addEventListener('click', () => {
    jsonInput.value = '';
    convertToCSV();
});

copyBtn.addEventListener('click', () => {
    if (!csvOutput.value) return;
    navigator.clipboard.writeText(csvOutput.value);
    const icon = copyBtn.querySelector('ion-icon');
    copyBtn.style.color = 'var(--success)';
    icon.setAttribute('name', 'checkmark-outline');
    setTimeout(() => {
        copyBtn.style.color = '';
        icon.setAttribute('name', 'copy-outline');
    }, 1500);
});

downloadBtn.addEventListener('click', () => {
    if (!csvOutput.value) return;
    const blob = new Blob([csvOutput.value], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
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
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        jsonInput.value = e.target.result;
        convertToCSV();
    };
    reader.readAsText(file);
}

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
convertToCSV();
