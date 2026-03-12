// ===== DOM =====
const resultNumber = document.getElementById('result-number');
const resultDisplay = document.getElementById('result-display');
const minInput = document.getElementById('min-val');
const maxInput = document.getElementById('max-val');
const qtyInput = document.getElementById('qty');
const uniqueCheck = document.getElementById('unique-check');
const integerCheck = document.getElementById('integer-check');
const multiResults = document.getElementById('multi-results');
const resultsGrid = document.getElementById('results-grid');
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

let history = [];
const MAX_HISTORY = 15;

// ===== Generate =====
function generate() {
    const min = parseFloat(minInput.value);
    const max = parseFloat(maxInput.value);
    const qty = Math.min(Math.max(parseInt(qtyInput.value) || 1, 1), 100);
    const integers = integerCheck.checked;
    const unique = uniqueCheck.checked;

    if (isNaN(min) || isNaN(max) || min > max) {
        resultNumber.textContent = '!';
        return;
    }

    if (unique && integers && qty > (max - min + 1)) {
        resultNumber.textContent = '!';
        return;
    }

    const numbers = [];
    const used = new Set();

    for (let i = 0; i < qty; i++) {
        let num;
        let attempts = 0;
        do {
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
            const rand = arr[0] / (0xFFFFFFFF + 1);

            if (integers) {
                num = Math.floor(rand * (max - min + 1)) + min;
            } else {
                num = +(rand * (max - min) + min).toFixed(4);
            }
            attempts++;
        } while (unique && used.has(num) && attempts < 10000);

        used.add(num);
        numbers.push(num);
    }

    // Animate result
    if (qty === 1) {
        resultNumber.textContent = numbers[0].toLocaleString();
        resultNumber.classList.remove('animate');
        void resultNumber.offsetWidth; // trigger reflow
        resultNumber.classList.add('animate');
        multiResults.classList.add('hidden');
    } else {
        resultNumber.textContent = qty + ' numbers';
        resultNumber.classList.remove('animate');
        void resultNumber.offsetWidth;
        resultNumber.classList.add('animate');

        resultsGrid.innerHTML = numbers.map(n =>
            `<span class="result-chip">${n.toLocaleString()}</span>`
        ).join('');
        multiResults.classList.remove('hidden');
    }

    // History
    const entry = qty === 1 ? `${numbers[0]}` : `[${numbers.join(', ')}]`;
    history.unshift(`${entry}  (${min}–${max})`);
    if (history.length > MAX_HISTORY) history.pop();
    renderHistory();
}

// ===== History =====
function renderHistory() {
    if (history.length === 0) {
        historySection.classList.add('hidden');
        return;
    }
    historySection.classList.remove('hidden');
    historyList.innerHTML = history.map(h =>
        `<div class="history-item">${h}</div>`
    ).join('');
}

// ===== Events =====
document.getElementById('generate-btn').addEventListener('click', generate);

// Keyboard shortcut
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') generate();
});

document.getElementById('copy-all').addEventListener('click', () => {
    const chips = resultsGrid.querySelectorAll('.result-chip');
    const vals = Array.from(chips).map(c => c.textContent).join(', ');
    navigator.clipboard.writeText(vals).then(() => showToast('Copied all!'));
});

document.getElementById('clear-history').addEventListener('click', () => {
    history = [];
    renderHistory();
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
