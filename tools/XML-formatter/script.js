const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const formatBtn = document.getElementById('format-btn');
const minifyBtn = document.getElementById('minify-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const indentSelect = document.getElementById('indent-select');
const errorBar = document.getElementById('error-bar');
const errorMsg = document.getElementById('error-msg');

function showError(msg) {
    errorMsg.textContent = msg;
    errorBar.classList.remove('hidden');
}

function hideError() {
    errorBar.classList.add('hidden');
}

function formatXML(xml, indentStr) {
    // Parse to validate
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error(parseError.textContent.split('\n')[0] || 'Invalid XML');
    }

    // Custom pretty printer
    let formatted = '';
    let depth = 0;
    const raw = xml.replace(/>\s*</g, '><').trim();

    const tokens = raw.match(/<[^>]+>|[^<]+/g) || [];
    tokens.forEach(token => {
        if (token.startsWith('</')) {
            // Closing tag
            depth--;
            formatted += indentStr.repeat(depth) + token + '\n';
        } else if (token.startsWith('<?')) {
            // Processing instruction
            formatted += indentStr.repeat(depth) + token + '\n';
        } else if (token.startsWith('<!--')) {
            // Comment
            formatted += indentStr.repeat(depth) + token + '\n';
        } else if (token.startsWith('<') && token.endsWith('/>')) {
            // Self-closing
            formatted += indentStr.repeat(depth) + token + '\n';
        } else if (token.startsWith('<')) {
            // Opening tag
            formatted += indentStr.repeat(depth) + token + '\n';
            depth++;
        } else {
            // Text content — put on the same line as previous tag
            if (formatted.endsWith('\n')) {
                formatted = formatted.slice(0, -1);
            }
            formatted += token + '\n';
            // Reduce depth since next will be closing tag
        }
    });

    return formatted.trim();
}

function minifyXML(xml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error(parseError.textContent.split('\n')[0] || 'Invalid XML');
    }
    return xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
}

formatBtn.addEventListener('click', () => {
    const xml = inputEl.value.trim();
    if (!xml) return;

    try {
        const indentVal = indentSelect.value;
        const indentStr = indentVal === 'tab' ? '\t' : ' '.repeat(parseInt(indentVal));
        outputEl.value = formatXML(xml, indentStr);
        hideError();
    } catch (e) {
        outputEl.value = '';
        showError(e.message);
    }
});

minifyBtn.addEventListener('click', () => {
    const xml = inputEl.value.trim();
    if (!xml) return;

    try {
        outputEl.value = minifyXML(xml);
        hideError();
    } catch (e) {
        outputEl.value = '';
        showError(e.message);
    }
});

clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    outputEl.value = '';
    hideError();
    inputEl.focus();
});

copyBtn.addEventListener('click', () => {
    if (!outputEl.value) return;
    navigator.clipboard.writeText(outputEl.value);
    const icon = copyBtn.querySelector('ion-icon');
    copyBtn.style.color = 'var(--success)';
    icon.setAttribute('name', 'checkmark-outline');
    setTimeout(() => {
        copyBtn.style.color = '';
        icon.setAttribute('name', 'copy-outline');
    }, 1500);
});

downloadBtn.addEventListener('click', () => {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
});

// Theme
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const saved = localStorage.getItem('fossarium-theme');
    if (saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches)) {
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
