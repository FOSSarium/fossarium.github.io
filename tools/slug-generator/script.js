// ===== DOM =====
const textInput = document.getElementById('text-input');
const slugOutput = document.getElementById('slug-output');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const separatorSelect = document.getElementById('separator');
const caseSelect = document.getElementById('case-select');
const removeNumbersCheck = document.getElementById('remove-numbers');
const maxLengthCheck = document.getElementById('max-length-check');
const maxLengthRow = document.getElementById('max-length-row');
const maxLengthVal = document.getElementById('max-length-val');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// ===== Slugify =====
function slugify(text) {
    const sep = separatorSelect.value;
    const caseMode = caseSelect.value;
    const removeNums = removeNumbersCheck.checked;
    const useMaxLen = maxLengthCheck.checked;
    const maxLen = parseInt(maxLengthVal.value) || 60;

    let slug = text
        // Normalize unicode (decompose accented chars)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Replace common special chars
        .replace(/&/g, ' and ')
        .replace(/@/g, ' at ')
        .replace(/#/g, ' hash ')
        .replace(/%/g, ' percent ');

    // Remove numbers if option set
    if (removeNums) {
        slug = slug.replace(/[0-9]/g, '');
    }

    slug = slug
        // Remove non-alphanumerics (keep spaces)
        .replace(/[^a-zA-Z0-9\s]/g, '')
        // Collapse whitespace
        .replace(/\s+/g, sep)
        // Remove leading/trailing separators
        .replace(new RegExp(`^\\${sep}+|\\${sep}+$`, 'g'), '');

    // Apply case
    if (caseMode === 'lower') slug = slug.toLowerCase();
    else if (caseMode === 'upper') slug = slug.toUpperCase();

    // Max length (don't cut mid-word)
    if (useMaxLen && slug.length > maxLen) {
        slug = slug.substring(0, maxLen);
        const lastSep = slug.lastIndexOf(sep);
        if (lastSep > maxLen * 0.5) {
            slug = slug.substring(0, lastSep);
        }
    }

    return slug;
}

function update() {
    const text = textInput.value;
    const slug = slugify(text);
    slugOutput.textContent = slug || 'your-slug-here';

    charCount.textContent = slug.length;
    const words = slug ? slug.split(separatorSelect.value).filter(Boolean).length : 0;
    wordCount.textContent = words;
}

// ===== Events =====
textInput.addEventListener('input', update);
separatorSelect.addEventListener('change', update);
caseSelect.addEventListener('change', update);
removeNumbersCheck.addEventListener('change', update);
maxLengthCheck.addEventListener('change', () => {
    maxLengthRow.classList.toggle('hidden', !maxLengthCheck.checked);
    update();
});
maxLengthVal.addEventListener('input', update);

// Copy
document.getElementById('copy-btn').addEventListener('click', () => {
    const slug = slugOutput.textContent;
    if (slug && slug !== 'your-slug-here') {
        navigator.clipboard.writeText(slug).then(() => showToast('Slug copied!'));
    }
});

// Examples
document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        textInput.value = btn.dataset.text;
        update();
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
