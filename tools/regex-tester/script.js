// ===== DOM =====
const regexInput = document.getElementById('regex-input');
const flagsInput = document.getElementById('flags-input');
const testInput = document.getElementById('test-input');
const highlightedText = document.getElementById('highlighted-text');
const matchCountEl = document.getElementById('match-count');
const groupCountEl = document.getElementById('group-count');
const errorBox = document.getElementById('error-box');
const errorText = document.getElementById('error-text');
const matchesSection = document.getElementById('matches-section');
const matchesList = document.getElementById('matches-list');

// ===== Test Regex =====
function testRegex() {
    const pattern = regexInput.value;
    const flags = flagsInput.value;
    const text = testInput.value;

    // Reset
    errorBox.classList.add('hidden');
    matchesSection.classList.add('hidden');
    highlightedText.innerHTML = '';
    matchCountEl.textContent = '0';
    groupCountEl.textContent = '0';

    if (!pattern || !text) {
        highlightedText.innerHTML = escapeHtml(text);
        return;
    }

    let regex;
    try {
        regex = new RegExp(pattern, flags);
    } catch (e) {
        errorBox.classList.remove('hidden');
        errorText.textContent = e.message;
        highlightedText.innerHTML = escapeHtml(text);
        return;
    }

    // Prevent infinite loops on zero-length matches
    if (regex.global || regex.sticky) {
        const matches = [];
        let match;
        let lastIndex = -1;
        let safeCount = 0;

        regex.lastIndex = 0;
        while ((match = regex.exec(text)) !== null && safeCount < 5000) {
            if (regex.lastIndex === lastIndex) {
                regex.lastIndex++;
                continue;
            }
            lastIndex = regex.lastIndex;
            matches.push({
                value: match[0],
                index: match.index,
                end: match.index + match[0].length,
                groups: match.slice(1)
            });
            safeCount++;
        }

        matchCountEl.textContent = matches.length;
        const maxGroups = matches.reduce((max, m) => Math.max(max, m.groups.length), 0);
        groupCountEl.textContent = maxGroups;

        // Build highlighted text
        let highlighted = '';
        let pos = 0;
        matches.forEach(m => {
            if (m.index > pos) {
                highlighted += escapeHtml(text.substring(pos, m.index));
            }
            highlighted += `<mark>${escapeHtml(m.value)}</mark>`;
            pos = m.end;
        });
        if (pos < text.length) {
            highlighted += escapeHtml(text.substring(pos));
        }
        highlightedText.innerHTML = highlighted;

        // Render match list
        if (matches.length > 0) {
            matchesList.innerHTML = matches.slice(0, 50).map((m, i) => {
                let detail = `<span class="match-val">"${escapeHtml(m.value)}"</span>`;
                if (m.groups.length > 0) {
                    detail += ` <span class="match-idx">Groups: ${m.groups.map((g, j) => `$${j + 1}="${escapeHtml(g || '')}"`).join(', ')}</span>`;
                }
                return `<div class="match-item">${detail}<span class="match-idx">@${m.index}</span></div>`;
            }).join('');
            matchesSection.classList.remove('hidden');
        }
    } else {
        // Non-global
        const match = regex.exec(text);
        if (match) {
            matchCountEl.textContent = '1';
            groupCountEl.textContent = match.length - 1;

            let highlighted = '';
            highlighted += escapeHtml(text.substring(0, match.index));
            highlighted += `<mark>${escapeHtml(match[0])}</mark>`;
            highlighted += escapeHtml(text.substring(match.index + match[0].length));
            highlightedText.innerHTML = highlighted;

            let detail = `<span class="match-val">"${escapeHtml(match[0])}"</span>`;
            if (match.length > 1) {
                const groups = match.slice(1);
                detail += ` <span class="match-idx">Groups: ${groups.map((g, j) => `$${j + 1}="${escapeHtml(g || '')}"`).join(', ')}</span>`;
            }
            matchesList.innerHTML = `<div class="match-item">${detail}<span class="match-idx">@${match.index}</span></div>`;
            matchesSection.classList.remove('hidden');
        } else {
            highlightedText.innerHTML = escapeHtml(text);
        }
    }
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Sync scroll =====
testInput.addEventListener('scroll', () => {
    highlightedText.scrollTop = testInput.scrollTop;
    highlightedText.scrollLeft = testInput.scrollLeft;
});

// ===== Live update =====
regexInput.addEventListener('input', testRegex);
flagsInput.addEventListener('input', testRegex);
testInput.addEventListener('input', testRegex);

// ===== Flag Toggles =====
document.querySelectorAll('.flag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        // Rebuild flags from active buttons
        const flags = Array.from(document.querySelectorAll('.flag-btn.active'))
            .map(b => b.dataset.flag).join('');
        flagsInput.value = flags;
        testRegex();
    });
});

// Keep flag buttons in sync with manual flags input
flagsInput.addEventListener('input', () => {
    const flags = flagsInput.value;
    document.querySelectorAll('.flag-btn').forEach(btn => {
        btn.classList.toggle('active', flags.includes(btn.dataset.flag));
    });
});

// ===== Presets =====
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        regexInput.value = btn.dataset.regex;
        flagsInput.value = btn.dataset.flags;
        // Sync flag buttons
        document.querySelectorAll('.flag-btn').forEach(fb => {
            fb.classList.toggle('active', btn.dataset.flags.includes(fb.dataset.flag));
        });
        testRegex();
    });
});

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');
    function updateIcon(theme) { icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline'); }
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        updateIcon(isLight ? 'light' : 'dark');
    });
}

initTheme();
