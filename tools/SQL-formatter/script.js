const KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'ON', 'AS', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'NATURAL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'DISTINCT', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CONSTRAINT', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CASCADE', 'DEFAULT', 'CHECK', 'UNIQUE', 'WITH', 'RECURSIVE', 'EXCEPT', 'INTERSECT', 'FETCH', 'NEXT', 'ROWS', 'ONLY', 'RETURNING', 'TRUNCATE', 'REPLACE', 'UPSERT', 'MERGE', 'USING', 'MATCHED'];
const NEWLINE_BEFORE = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'NATURAL', 'ORDER', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INSERT', 'UPDATE', 'DELETE', 'SET', 'VALUES', 'RETURNING', 'WITH'];
const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

function getIndent() {
    const v = document.getElementById('indent-select').value;
    return v === 'tab' ? '\t' : ' '.repeat(parseInt(v));
}

function formatSQL() {
    const raw = inputEl.value.trim();
    if (!raw) { outputEl.value = ''; return; }
    const kw = document.getElementById('case-select').value;
    const indent = getIndent();
    // Tokenize — preserve strings and quoted identifiers
    const tokens = [];
    let i = 0;
    while (i < raw.length) {
        if (raw[i] === "'" || raw[i] === '"') {
            const q = raw[i]; let j = i + 1;
            while (j < raw.length && raw[j] !== q) { if (raw[j] === '\\') j++; j++; }
            tokens.push(raw.substring(i, j + 1)); i = j + 1;
        } else if (raw[i] === '-' && raw[i + 1] === '-') {
            let j = i; while (j < raw.length && raw[j] !== '\n') j++;
            tokens.push(raw.substring(i, j)); i = j;
        } else if (/\s/.test(raw[i])) {
            i++; // skip whitespace
        } else if (/[,;()\.]/.test(raw[i])) {
            tokens.push(raw[i]); i++;
        } else {
            let j = i; while (j < raw.length && !/[\s,;()\.'"]/g.test(raw[j])) j++;
            tokens.push(raw.substring(i, j)); i = j;
        }
    }
    let result = '', depth = 0, lineStart = true;
    for (let t = 0; t < tokens.length; t++) {
        const token = tokens[t];
        const upper = token.toUpperCase();
        const isKW = KEYWORDS.includes(upper);
        const needsNewline = NEWLINE_BEFORE.includes(upper);
        if (token === '(') {
            result += ' ('; depth++; continue;
        }
        if (token === ')') {
            depth = Math.max(0, depth - 1);
            result += ')'; continue;
        }
        if (token === ',') {
            result += ',\n' + indent.repeat(depth + 1); lineStart = true; continue;
        }
        if (token === ';') {
            result += ';\n\n'; lineStart = true; depth = 0; continue;
        }
        if (needsNewline && !lineStart) {
            result += '\n' + indent.repeat(depth);
        }
        let display = token;
        if (isKW) {
            display = kw === 'upper' ? upper : kw === 'lower' ? token.toLowerCase() : token;
        }
        if (!lineStart && !needsNewline) result += ' ';
        result += display;
        lineStart = false;
    }
    outputEl.value = result.trim();
}

// Auto-format on input
inputEl.addEventListener('input', formatSQL);
document.getElementById('indent-select').addEventListener('change', formatSQL);
document.getElementById('case-select').addEventListener('change', formatSQL);
document.getElementById('format-btn').addEventListener('click', formatSQL);
document.getElementById('clear-btn').addEventListener('click', () => { inputEl.value = ''; outputEl.value = ''; });
document.getElementById('copy-btn').addEventListener('click', () => {
    if (outputEl.value) navigator.clipboard.writeText(outputEl.value).then(() => showToast('Copied!'));
});
document.getElementById('download-btn').addEventListener('click', () => {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: 'text/sql' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'formatted.sql'; a.click();
});
function showToast(msg) {
    toastMessage.textContent = msg; toast.classList.remove('hidden');
    toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}
function initTheme() {
    const b = document.getElementById('theme-toggle'), icon = b.querySelector('ion-icon');
    const u = t => icon.setAttribute('name', t === 'light' ? 'moon-outline' : 'sunny-outline');
    const sv = localStorage.getItem('fossarium-theme');
    if (sv) u(sv); else if (matchMedia('(prefers-color-scheme:light)').matches) u('light');
    b.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const l = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', l ? 'light' : 'dark'); u(l ? 'light' : 'dark');
    });
}
initTheme();
