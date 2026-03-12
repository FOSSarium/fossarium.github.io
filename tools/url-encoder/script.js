const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const swapBtn = document.getElementById('swap-btn');
const encodeType = document.getElementById('encode-type');

let mode = 'encode';

function convert() {
    const val = inputEl.value;
    if (!val) { outputEl.value = ''; return; }

    try {
        if (mode === 'encode') {
            outputEl.value = encodeType.value === 'component'
                ? encodeURIComponent(val)
                : encodeURI(val);
        } else {
            outputEl.value = encodeType.value === 'component'
                ? decodeURIComponent(val)
                : decodeURI(val);
        }
    } catch (e) {
        outputEl.value = '⚠ Error: ' + e.message;
    }
}

inputEl.addEventListener('input', convert);
encodeType.addEventListener('change', convert);

// Mode pills
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        mode = pill.dataset.mode;
        convert();
    });
});

clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    outputEl.value = '';
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

swapBtn.addEventListener('click', () => {
    const temp = outputEl.value;
    inputEl.value = temp;
    convert();
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
