// ===== DOM Elements =====
const jsonInput = document.getElementById('json-input');
const pathInput = document.getElementById('path-input');
const resultCode = document.getElementById('result-code');
const matchCount = document.getElementById('match-count');
const pathsGrid = document.getElementById('paths-grid');
const filterInput = document.getElementById('filter-input');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

const SAMPLE_JSON = {
    "user": {
        "name": "Alice",
        "age": 30,
        "email": "alice@fossarium.dev",
        "active": true,
        "address": {
            "city": "San Francisco",
            "zip": "94102",
            "country": "US"
        }
    },
    "items": [
        { "id": 1, "title": "Learn JSON Path", "done": true },
        { "id": 2, "title": "Build an API", "done": false },
        { "id": 3, "title": "Deploy to production", "done": false }
    ],
    "metadata": {
        "version": "2.0",
        "count": 3,
        "tags": ["json", "path", "query"]
    }
};

// ===== Extract all paths from JSON =====
function extractPaths(obj, prefix = '') {
    const paths = [];
    if (obj === null || obj === undefined) {
        paths.push({ path: prefix || '$', value: obj, type: 'null' });
        return paths;
    }
    if (Array.isArray(obj)) {
        if (prefix) paths.push({ path: prefix, value: obj, type: 'array' });
        obj.forEach((item, i) => {
            paths.push(...extractPaths(item, prefix ? `${prefix}[${i}]` : `[${i}]`));
        });
    } else if (typeof obj === 'object') {
        if (prefix) paths.push({ path: prefix, value: obj, type: 'object' });
        Object.keys(obj).forEach(key => {
            const p = prefix ? `${prefix}.${key}` : key;
            paths.push(...extractPaths(obj[key], p));
        });
    } else {
        paths.push({ path: prefix, value: obj, type: typeof obj });
    }
    return paths;
}

// ===== Query JSON by dot-notation path =====
function queryPath(obj, path) {
    if (!path || !path.trim()) return undefined;
    const parts = [];
    // Parse path like "items[0].title" or "items.*.done"
    path.replace(/\[(\d+)\]/g, '.$1').split('.').forEach(p => {
        if (p !== '') parts.push(p);
    });

    function resolve(current, segments) {
        if (segments.length === 0) return [current];
        const [head, ...rest] = segments;
        if (head === '*') {
            if (Array.isArray(current)) {
                return current.flatMap(item => resolve(item, rest));
            } else if (typeof current === 'object' && current !== null) {
                return Object.values(current).flatMap(val => resolve(val, rest));
            }
            return [];
        }
        if (current === null || current === undefined) return [];
        if (Array.isArray(current)) {
            const idx = parseInt(head, 10);
            if (isNaN(idx) || idx >= current.length) return [];
            return resolve(current[idx], rest);
        }
        if (typeof current === 'object' && head in current) {
            return resolve(current[head], rest);
        }
        return [];
    }

    return resolve(obj, parts);
}

// ===== Render paths tree =====
function renderPaths(filter = '') {
    try {
        const obj = JSON.parse(jsonInput.value);
        const paths = extractPaths(obj);
        const filtered = filter
            ? paths.filter(p => p.path.toLowerCase().includes(filter) || String(p.value).toLowerCase().includes(filter))
            : paths;

        pathsGrid.innerHTML = filtered.slice(0, 100).map(p => {
            const displayVal = typeof p.value === 'object' && p.value !== null
                ? (Array.isArray(p.value) ? `[${p.value.length} items]` : `{${Object.keys(p.value).length} keys}`)
                : String(p.value);
            return `
                <div class="path-row" data-path="${p.path}">
                    <span class="path-key">${p.path}</span>
                    <span class="path-type ${p.type}">${p.type}</span>
                    <span class="path-value">${escapeHtml(displayVal)}</span>
                </div>
            `;
        }).join('');

        // Click on path to fill query
        pathsGrid.querySelectorAll('.path-row').forEach(row => {
            row.addEventListener('click', () => {
                pathInput.value = row.dataset.path;
                evaluateQuery();
            });
        });
    } catch {
        pathsGrid.innerHTML = '<div class="path-row"><span class="path-key" style="color:var(--text-muted)">Enter valid JSON to see paths</span></div>';
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== Evaluate the current query =====
function evaluateQuery() {
    try {
        const obj = JSON.parse(jsonInput.value);
        const path = pathInput.value.trim();
        if (!path) {
            resultCode.textContent = 'Enter a path to query...';
            matchCount.textContent = '0 matches';
            return;
        }
        const results = queryPath(obj, path);
        if (results.length === 0) {
            resultCode.textContent = 'No match found for "' + path + '"';
            matchCount.textContent = '0 matches';
        } else if (results.length === 1) {
            resultCode.textContent = typeof results[0] === 'object'
                ? JSON.stringify(results[0], null, 2)
                : String(results[0]);
            matchCount.textContent = '1 match';
        } else {
            resultCode.textContent = JSON.stringify(results, null, 2);
            matchCount.textContent = results.length + ' matches';
        }
    } catch {
        resultCode.textContent = 'Invalid JSON';
        matchCount.textContent = '0 matches';
    }
}

// ===== Event Listeners =====
jsonInput.addEventListener('input', () => {
    renderPaths(filterInput.value.toLowerCase());
    evaluateQuery();
    localStorage.setItem('fossarium-jsonpath-input', jsonInput.value);
});

pathInput.addEventListener('input', evaluateQuery);

filterInput.addEventListener('input', () => {
    renderPaths(filterInput.value.toLowerCase());
});

document.getElementById('sample-btn').addEventListener('click', () => {
    jsonInput.value = JSON.stringify(SAMPLE_JSON, null, 2);
    jsonInput.dispatchEvent(new Event('input'));
});

document.getElementById('clear-btn').addEventListener('click', () => {
    jsonInput.value = '';
    pathInput.value = '';
    resultCode.textContent = 'Enter a path to query...';
    matchCount.textContent = '0 matches';
    pathsGrid.innerHTML = '';
    localStorage.removeItem('fossarium-jsonpath-input');
});

document.getElementById('copy-result-btn').addEventListener('click', () => {
    const text = resultCode.textContent;
    if (!text || text === 'Enter a path to query...') return;
    navigator.clipboard.writeText(text).then(() => showToast('Result copied!'));
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

const savedInput = localStorage.getItem('fossarium-jsonpath-input');
if (savedInput) {
    jsonInput.value = savedInput;
} else {
    jsonInput.value = JSON.stringify(SAMPLE_JSON, null, 2);
}
renderPaths();
