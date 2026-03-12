// ===== DOM Elements =====
const input = document.getElementById('json-input');
const outputCode = document.getElementById('json-output-code');
const statusBar = document.getElementById('status-bar');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ===== Stats =====
function updateStats(jsonStr) {
    try {
        const parsed = JSON.parse(jsonStr);
        const keys = countKeys(parsed);
        const depth = getDepth(parsed);
        const size = new Blob([jsonStr]).size;
        document.getElementById('stat-keys').textContent = keys;
        document.getElementById('stat-depth').textContent = depth;
        document.getElementById('stat-size').textContent = formatBytes(size);
    } catch {
        document.getElementById('stat-keys').textContent = '–';
        document.getElementById('stat-depth').textContent = '–';
        document.getElementById('stat-size').textContent = formatBytes(new Blob([jsonStr]).size);
    }
}

function countKeys(obj) {
    let count = 0;
    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            obj.forEach(item => count += countKeys(item));
        } else {
            Object.keys(obj).forEach(key => {
                count++;
                count += countKeys(obj[key]);
            });
        }
    }
    return count;
}

function getDepth(obj) {
    if (typeof obj !== 'object' || obj === null) return 0;
    const children = Array.isArray(obj) ? obj : Object.values(obj);
    if (children.length === 0) return 1;
    return 1 + Math.max(...children.map(getDepth));
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ===== Syntax Highlighting =====
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
        /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );
}

function setOutput(text) {
    outputCode.innerHTML = syntaxHighlight(text);
}

// ===== Status =====
function showStatus(message, type) {
    statusBar.textContent = message;
    statusBar.className = 'status-bar ' + type;
    setTimeout(() => statusBar.classList.add('hidden'), 4000);
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

// ===== Sort Keys Recursively =====
function sortKeys(obj) {
    if (Array.isArray(obj)) return obj.map(sortKeys);
    if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).sort().reduce((acc, key) => {
            acc[key] = sortKeys(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

// ===== Actions =====
document.getElementById('format-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(input.value);
        const formatted = JSON.stringify(parsed, null, 4);
        setOutput(formatted);
        updateStats(input.value);
        showStatus('✓ JSON beautified successfully!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('minify-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(input.value);
        const minified = JSON.stringify(parsed);
        setOutput(minified);
        updateStats(input.value);
        showStatus('✓ JSON minified successfully!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('validate-btn').addEventListener('click', () => {
    try {
        JSON.parse(input.value);
        updateStats(input.value);
        showStatus('✓ Valid JSON!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('sort-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(input.value);
        const sorted = sortKeys(parsed);
        const formatted = JSON.stringify(sorted, null, 4);
        setOutput(formatted);
        updateStats(input.value);
        showStatus('✓ Keys sorted alphabetically!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const text = outputCode.textContent || input.value;
    if (!text) { showStatus('Nothing to copy.', 'error'); return; }
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    });
});

document.getElementById('clear-btn').addEventListener('click', () => {
    input.value = '';
    outputCode.innerHTML = '';
    statusBar.classList.add('hidden');
    document.getElementById('stat-keys').textContent = '0';
    document.getElementById('stat-depth').textContent = '0';
    document.getElementById('stat-size').textContent = '0 B';
});

// ===== Real-time stats on input =====
input.addEventListener('input', () => {
    updateStats(input.value);
});

// ===== Persist input =====
const savedInput = localStorage.getItem('fossarium-json-formatter-input');
if (savedInput) {
    input.value = savedInput;
    updateStats(savedInput);
}

input.addEventListener('input', () => {
    localStorage.setItem('fossarium-json-formatter-input', input.value);
});

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');

    function updateIcon(theme) {
        icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
    }

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) {
        updateIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        updateIcon('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('fossarium-theme', newTheme);
        updateIcon(newTheme);
    });
}

initTheme();
