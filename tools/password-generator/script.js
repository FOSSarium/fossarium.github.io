// ===== DOM =====
const passwordEl = document.getElementById('password');
const lengthSlider = document.getElementById('length');
const lengthVal = document.getElementById('length-val');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const entropyText = document.getElementById('entropy-text');
const historyList = document.getElementById('history-list');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

const CHARSETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

let history = [];
const MAX_HISTORY = 5;

// ===== Generate Password =====
function generate() {
    let charset = '';
    const options = ['uppercase', 'lowercase', 'numbers', 'symbols'];
    const active = options.filter(o => document.getElementById(o).checked);

    if (active.length === 0) {
        passwordEl.textContent = 'Select at least one option';
        strengthBar.style.width = '0%';
        strengthText.textContent = '—';
        entropyText.textContent = '0 bits';
        return;
    }

    active.forEach(o => charset += CHARSETS[o]);
    const length = parseInt(lengthSlider.value);

    // Crypto-secure random
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    // Ensure at least one char from each selected set
    active.forEach((o, i) => {
        const chars = CHARSETS[o];
        const randIdx = crypto.getRandomValues(new Uint32Array(1))[0] % chars.length;
        const pos = crypto.getRandomValues(new Uint32Array(1))[0] % length;
        password = password.substring(0, pos) + chars[randIdx] + password.substring(pos + 1);
    });

    passwordEl.textContent = password;
    updateStrength(password, charset.length);
    addToHistory(password);
}

// ===== Strength =====
function updateStrength(password, charsetSize) {
    const entropy = Math.log2(charsetSize) * password.length;
    entropyText.textContent = Math.round(entropy) + ' bits';

    let pct, color, label;
    if (entropy < 28) { pct = 15; color = '#ff4757'; label = 'Very Weak'; }
    else if (entropy < 36) { pct = 30; color = '#ff6b81'; label = 'Weak'; }
    else if (entropy < 60) { pct = 50; color = '#ffa502'; label = 'Fair'; }
    else if (entropy < 80) { pct = 70; color = '#2ed573'; label = 'Strong'; }
    else if (entropy < 120) { pct = 85; color = '#1fa2ff'; label = 'Very Strong'; }
    else { pct = 100; color = '#7c3aed'; label = 'Excellent'; }

    strengthBar.style.width = pct + '%';
    strengthBar.style.background = color;
    strengthText.textContent = label;
    strengthText.style.color = color;
}

// ===== History =====
function addToHistory(password) {
    history.unshift(password);
    if (history.length > MAX_HISTORY) history.pop();
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        document.getElementById('history-section').style.display = 'none';
        return;
    }
    document.getElementById('history-section').style.display = 'block';
    historyList.innerHTML = history.map((pw, i) => `
        <div class="history-item">
            <span>${escapeHtml(pw.length > 40 ? pw.substring(0, 40) + '…' : pw)}</span>
            <button class="history-copy-btn" data-index="${i}" title="Copy"><ion-icon name="copy-outline"></ion-icon></button>
        </div>
    `).join('');

    historyList.querySelectorAll('.history-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(history[parseInt(btn.dataset.index)]).then(() => showToast('Copied!'));
        });
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Events =====
lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value;
});

document.getElementById('generate-btn').addEventListener('click', generate);
document.getElementById('refresh-btn').addEventListener('click', generate);

document.getElementById('copy-btn').addEventListener('click', () => {
    const pw = passwordEl.textContent;
    if (!pw || pw === 'Click Generate' || pw.startsWith('Select')) return;
    navigator.clipboard.writeText(pw).then(() => showToast('Password copied!'));
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
generate();
