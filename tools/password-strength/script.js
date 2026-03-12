// ===== DOM =====
const pwInput = document.getElementById('pw-input');
const strengthFill = document.getElementById('strength-fill');
const strengthLabel = document.getElementById('strength-label');
const checklist = document.getElementById('checklist');
const visIcon = document.getElementById('vis-icon');
let isVisible = true;

// ===== Checks =====
const CHECKS = [
    { id: 'length8', label: 'At least 8 characters', test: pw => pw.length >= 8 },
    { id: 'length12', label: 'At least 12 characters', test: pw => pw.length >= 12 },
    { id: 'upper', label: 'Contains uppercase (A-Z)', test: pw => /[A-Z]/.test(pw) },
    { id: 'lower', label: 'Contains lowercase (a-z)', test: pw => /[a-z]/.test(pw) },
    { id: 'number', label: 'Contains numbers (0-9)', test: pw => /[0-9]/.test(pw) },
    { id: 'symbol', label: 'Contains symbols (!@#$...)', test: pw => /[^A-Za-z0-9]/.test(pw) },
    { id: 'noRepeat', label: 'No 3+ repeated characters', test: pw => !/(.)\1{2,}/.test(pw) },
    { id: 'noCommon', label: 'Not a common password', test: pw => !isCommon(pw) }
];

const COMMON = ['password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
    'dragon', 'login', 'admin', 'letmein', 'welcome', 'password1', 'p@ssw0rd', 'iloveyou'];

function isCommon(pw) {
    return COMMON.includes(pw.toLowerCase());
}

// ===== Analyze =====
function analyze() {
    const pw = pwInput.value;

    if (!pw) {
        strengthFill.style.width = '0%';
        strengthLabel.textContent = 'Type a password above';
        strengthLabel.style.color = '';
        document.getElementById('metric-entropy').textContent = '—';
        document.getElementById('metric-crack').textContent = '—';
        document.getElementById('metric-length').textContent = '—';
        document.getElementById('metric-charset').textContent = '—';
        renderChecklist([]);
        return;
    }

    // Calculate charset size
    let charsetSize = 0;
    if (/[a-z]/.test(pw)) charsetSize += 26;
    if (/[A-Z]/.test(pw)) charsetSize += 26;
    if (/[0-9]/.test(pw)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(pw)) charsetSize += 32;

    const entropy = Math.log2(charsetSize) * pw.length;
    const combinations = Math.pow(charsetSize, pw.length);

    // Crack time (10 billion guesses/sec)
    const guessesPerSec = 10e9;
    const seconds = combinations / guessesPerSec;
    const crackTime = formatTime(seconds);

    // Strength
    let pct, color, label;
    if (entropy < 28) { pct = 10; color = '#ff4757'; label = '🔴 Very Weak'; }
    else if (entropy < 36) { pct = 25; color = '#ff6b81'; label = '🟠 Weak'; }
    else if (entropy < 60) { pct = 45; color = '#ffa502'; label = '🟡 Fair'; }
    else if (entropy < 80) { pct = 65; color = '#2ed573'; label = '🟢 Strong'; }
    else if (entropy < 120) { pct = 85; color = '#1fa2ff'; label = '🔵 Very Strong'; }
    else { pct = 100; color = '#7c3aed'; label = '🟣 Excellent'; }

    // Deduct for common passwords
    if (isCommon(pw)) {
        pct = 5; color = '#ff4757'; label = '🔴 Common Password!';
    }

    strengthFill.style.width = pct + '%';
    strengthFill.style.background = color;
    strengthLabel.textContent = label;
    strengthLabel.style.color = color;

    // Metrics
    document.getElementById('metric-entropy').textContent = Math.round(entropy) + ' bits';
    document.getElementById('metric-crack').textContent = crackTime;
    document.getElementById('metric-length').textContent = pw.length;
    document.getElementById('metric-charset').textContent = charsetSize;

    // Checklist
    const results = CHECKS.map(check => ({
        label: check.label,
        pass: check.test(pw)
    }));
    renderChecklist(results);
}

function formatTime(seconds) {
    if (seconds < 0.001) return 'Instant';
    if (seconds < 1) return '< 1 second';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
    if (seconds < 86400 * 365) return Math.round(seconds / 86400) + ' days';
    if (seconds < 86400 * 365 * 1000) return Math.round(seconds / (86400 * 365)) + ' years';
    if (seconds < 86400 * 365 * 1e6) return Math.round(seconds / (86400 * 365 * 1000)) + 'K years';
    if (seconds < 86400 * 365 * 1e9) return Math.round(seconds / (86400 * 365 * 1e6)) + 'M years';
    return '∞';
}

function renderChecklist(results) {
    if (results.length === 0) {
        checklist.innerHTML = '';
        return;
    }
    checklist.innerHTML = results.map(r => `
        <div class="check-item ${r.pass ? 'pass' : 'fail'}">
            <ion-icon name="${r.pass ? 'checkmark-circle' : 'close-circle'}" class="check-icon"></ion-icon>
            <span>${r.label}</span>
        </div>
    `).join('');
}

// ===== Toggle Visibility =====
document.getElementById('toggle-vis').addEventListener('click', () => {
    isVisible = !isVisible;
    pwInput.type = isVisible ? 'text' : 'password';
    visIcon.setAttribute('name', isVisible ? 'eye-outline' : 'eye-off-outline');
});

// ===== Events =====
pwInput.addEventListener('input', analyze);

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

// ===== Init =====
initTheme();
