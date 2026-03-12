// ===== DOM Elements =====
const input = document.getElementById('input');
const output = document.getElementById('output');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ===== Marked.js Config =====
marked.setOptions({ breaks: true, gfm: true });

// ===== Render Preview =====
function renderPreview() {
    output.innerHTML = marked.parse(input.value);
}

// ===== Event Listeners =====
input.addEventListener('input', () => {
    renderPreview();
    localStorage.setItem('fossarium-md-preview', input.value);
});

document.getElementById('copy-html-btn').addEventListener('click', () => {
    const html = marked.parse(input.value);
    if (!html.trim()) return;
    navigator.clipboard.writeText(html).then(() => showToast('HTML copied!'));
});

document.getElementById('clear-btn').addEventListener('click', () => {
    input.value = '';
    output.innerHTML = '';
    localStorage.removeItem('fossarium-md-preview');
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
const saved = localStorage.getItem('fossarium-md-preview');
if (saved !== null) input.value = saved;
renderPreview();
