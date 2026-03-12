// ===== DOM =====
const pxInput = document.getElementById('px-input');
const remInput = document.getElementById('rem-input');
const baseInput = document.getElementById('base-size');
const refBody = document.getElementById('ref-body');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ===== Conversion =====
function getBase() {
    return parseFloat(baseInput.value) || 16;
}

function pxToRem(px) {
    return +(px / getBase()).toFixed(6).replace(/\.?0+$/, '') || 0;
}

function remToPx(rem) {
    return +(rem * getBase()).toFixed(4).replace(/\.?0+$/, '') || 0;
}

// ===== Events =====
pxInput.addEventListener('input', () => {
    const val = parseFloat(pxInput.value);
    if (!isNaN(val)) {
        remInput.value = pxToRem(val);
    } else {
        remInput.value = '';
    }
});

remInput.addEventListener('input', () => {
    const val = parseFloat(remInput.value);
    if (!isNaN(val)) {
        pxInput.value = remToPx(val);
    } else {
        pxInput.value = '';
    }
});

baseInput.addEventListener('input', () => {
    // Re-convert from whichever field has focus
    if (document.activeElement === remInput) {
        const val = parseFloat(remInput.value);
        if (!isNaN(val)) pxInput.value = remToPx(val);
    } else {
        const val = parseFloat(pxInput.value);
        if (!isNaN(val)) remInput.value = pxToRem(val);
    }
    localStorage.setItem('fossarium-px-rem-base', baseInput.value);
    buildReference();
});

document.getElementById('swap-btn').addEventListener('click', () => {
    const temp = pxInput.value;
    pxInput.value = remInput.value;
    remInput.value = temp;
    // Trigger re-calculation from px
    const val = parseFloat(pxInput.value);
    if (!isNaN(val)) remInput.value = pxToRem(val);
});

// ===== Copy =====
document.getElementById('copy-px').addEventListener('click', () => {
    if (pxInput.value) {
        navigator.clipboard.writeText(pxInput.value + 'px').then(() => showToast('Copied PX!'));
    }
});

document.getElementById('copy-rem').addEventListener('click', () => {
    if (remInput.value) {
        navigator.clipboard.writeText(remInput.value + 'rem').then(() => showToast('Copied REM!'));
    }
});

// ===== Reference Table =====
function buildReference() {
    const sizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];
    const base = getBase();
    refBody.innerHTML = sizes.map(px => {
        const rem = (px / base).toFixed(4).replace(/\.?0+$/, '');
        const pt = (px * 0.75).toFixed(2).replace(/\.?0+$/, '');
        return `<div class="ref-row">
            <span>${px}px</span>
            <span>${rem}rem</span>
            <span>${pt}pt</span>
        </div>`;
    }).join('');
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

const savedBase = localStorage.getItem('fossarium-px-rem-base');
if (savedBase) baseInput.value = savedBase;

buildReference();
