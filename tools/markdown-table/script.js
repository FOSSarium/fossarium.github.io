// ===== State =====
let rows = 4;
let cols = 3;
let data = [];

// ===== DOM =====
const tableWrapper = document.getElementById('table-wrapper');
const mdOutput = document.getElementById('md-output').querySelector('code');
const previewDiv = document.getElementById('preview');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ===== Init Data =====
function initData() {
    data = [];
    // Header row (row 0)
    const header = [];
    for (let c = 0; c < cols; c++) header.push('Header ' + (c + 1));
    data.push(header);
    // Data rows
    for (let r = 1; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) row.push('');
        data.push(row);
    }
}

// ===== Render Table Editor =====
function renderTable() {
    let html = '<table>';
    // Header row
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
        html += `<th><input type="text" data-r="0" data-c="${c}" value="${escapeAttr(data[0][c])}" placeholder="Header"></th>`;
    }
    html += '</tr>';
    // Data rows
    for (let r = 1; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
            html += `<td><input type="text" data-r="${r}" data-c="${c}" value="${escapeAttr(data[r] ? data[r][c] || '' : '')}" placeholder="Cell"></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    tableWrapper.innerHTML = html;

    // Bind input events
    tableWrapper.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const r = parseInt(input.dataset.r);
            const c = parseInt(input.dataset.c);
            if (!data[r]) data[r] = [];
            data[r][c] = input.value;
            generateOutput();
        });
    });

    generateOutput();
}

function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Generate Markdown Output =====
function generateOutput() {
    if (data.length === 0 || cols === 0) {
        mdOutput.textContent = '';
        previewDiv.innerHTML = '';
        return;
    }

    // Calculate column widths for alignment
    const widths = [];
    for (let c = 0; c < cols; c++) {
        let max = 3; // minimum width
        for (let r = 0; r < data.length; r++) {
            const cell = (data[r] && data[r][c]) || '';
            if (cell.length > max) max = cell.length;
        }
        widths.push(max);
    }

    // Build markdown lines
    const lines = [];

    // Header
    const headerCells = [];
    for (let c = 0; c < cols; c++) {
        const cell = (data[0] && data[0][c]) || '';
        headerCells.push(' ' + cell.padEnd(widths[c]) + ' ');
    }
    lines.push('|' + headerCells.join('|') + '|');

    // Separator
    const sepCells = [];
    for (let c = 0; c < cols; c++) {
        sepCells.push(' ' + '-'.repeat(widths[c]) + ' ');
    }
    lines.push('|' + sepCells.join('|') + '|');

    // Data rows
    for (let r = 1; r < rows; r++) {
        const rowCells = [];
        for (let c = 0; c < cols; c++) {
            const cell = (data[r] && data[r][c]) || '';
            rowCells.push(' ' + cell.padEnd(widths[c]) + ' ');
        }
        lines.push('|' + rowCells.join('|') + '|');
    }

    const md = lines.join('\n');
    mdOutput.textContent = md;

    // Preview
    let previewHtml = '<table><thead><tr>';
    for (let c = 0; c < cols; c++) {
        previewHtml += `<th>${escapeHtml((data[0] && data[0][c]) || '')}</th>`;
    }
    previewHtml += '</tr></thead><tbody>';
    for (let r = 1; r < rows; r++) {
        previewHtml += '<tr>';
        for (let c = 0; c < cols; c++) {
            previewHtml += `<td>${escapeHtml((data[r] && data[r][c]) || '')}</td>`;
        }
        previewHtml += '</tr>';
    }
    previewHtml += '</tbody></table>';
    previewDiv.innerHTML = previewHtml;

    // Save
    localStorage.setItem('fossarium-md-table', JSON.stringify({ rows, cols, data }));
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Controls =====
document.getElementById('resize-btn').addEventListener('click', () => {
    const newRows = parseInt(document.getElementById('rows-input').value) || 4;
    const newCols = parseInt(document.getElementById('cols-input').value) || 3;
    resizeTable(Math.max(1, Math.min(newRows, 20)), Math.max(1, Math.min(newCols, 10)));
});

document.getElementById('add-row-btn').addEventListener('click', () => {
    rows++;
    data.push(new Array(cols).fill(''));
    document.getElementById('rows-input').value = rows;
    renderTable();
});

document.getElementById('add-col-btn').addEventListener('click', () => {
    cols++;
    data.forEach((row, i) => {
        row.push(i === 0 ? 'Header ' + cols : '');
    });
    document.getElementById('cols-input').value = cols;
    renderTable();
});

document.getElementById('clear-btn').addEventListener('click', () => {
    initData();
    renderTable();
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const text = mdOutput.textContent;
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(() => showToast('Markdown table copied!'));
});

function resizeTable(newRows, newCols) {
    const oldData = data.slice();
    rows = newRows;
    cols = newCols;
    data = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            if (oldData[r] && oldData[r][c] !== undefined) {
                row.push(oldData[r][c]);
            } else {
                row.push(r === 0 ? 'Header ' + (c + 1) : '');
            }
        }
        data.push(row);
    }
    renderTable();
}

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

// Load saved data or init
const saved = localStorage.getItem('fossarium-md-table');
if (saved) {
    try {
        const parsed = JSON.parse(saved);
        rows = parsed.rows;
        cols = parsed.cols;
        data = parsed.data;
    } catch {
        initData();
    }
} else {
    initData();
}

document.getElementById('rows-input').value = rows;
document.getElementById('cols-input').value = cols;
renderTable();
