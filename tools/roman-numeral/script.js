// ===== Conversion Logic =====
const ROMAN_MAP = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];

function intToRoman(num) {
    if (num < 1 || num > 3999) return null;
    let result = '';
    for (const [value, symbol] of ROMAN_MAP) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }
    return result;
}

function romanToInt(str) {
    str = str.toUpperCase().trim();
    if (!/^[MDCLXVI]+$/.test(str)) return null;

    const map = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
    let total = 0;

    for (let i = 0; i < str.length; i++) {
        const current = map[str[i]];
        const next = map[str[i + 1]];
        if (next && current < next) {
            total -= current;
        } else {
            total += current;
        }
    }

    // Validate by converting back
    if (intToRoman(total) !== str) return null;
    return total;
}

// ===== DOM =====
const numberInput = document.getElementById('number-input');
const romanInput = document.getElementById('roman-input');
const romanText = document.getElementById('roman-text');
const numberText = document.getElementById('number-text');
const toRomanSection = document.getElementById('to-roman-section');
const toNumberSection = document.getElementById('to-number-section');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

let currentMode = 'to-roman';

// ===== Mode Switching =====
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        toRomanSection.classList.toggle('hidden', currentMode !== 'to-roman');
        toNumberSection.classList.toggle('hidden', currentMode !== 'to-number');
    });
});

// ===== Real-time Conversion =====
numberInput.addEventListener('input', () => {
    const n = parseInt(numberInput.value);
    if (isNaN(n) || n < 1 || n > 3999) {
        romanText.textContent = numberInput.value ? 'Range: 1–3,999' : '—';
        romanText.classList.toggle('error', !!numberInput.value);
        return;
    }
    romanText.classList.remove('error');
    romanText.textContent = intToRoman(n);
});

romanInput.addEventListener('input', () => {
    const val = romanInput.value.trim();
    if (!val) { numberText.textContent = '—'; numberText.classList.remove('error'); return; }

    const result = romanToInt(val);
    if (result === null) {
        numberText.textContent = 'Invalid Roman numeral';
        numberText.classList.add('error');
    } else {
        numberText.classList.remove('error');
        numberText.textContent = result.toLocaleString();
    }
});

// ===== Copy =====
document.getElementById('copy-roman').addEventListener('click', () => {
    const text = romanText.textContent;
    if (text && text !== '—' && !romanText.classList.contains('error')) {
        navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
    }
});

document.getElementById('copy-number').addEventListener('click', () => {
    const text = numberText.textContent;
    if (text && text !== '—' && !numberText.classList.contains('error')) {
        navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
    }
});

// ===== Quick Convert =====
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Switch to to-roman mode
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-mode="to-roman"]').classList.add('active');
        currentMode = 'to-roman';
        toRomanSection.classList.remove('hidden');
        toNumberSection.classList.add('hidden');

        numberInput.value = btn.dataset.val;
        numberInput.dispatchEvent(new Event('input'));
    });
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

initTheme();
