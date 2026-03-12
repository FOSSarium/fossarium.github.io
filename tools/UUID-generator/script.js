const countInput = document.getElementById('count');
const caseSelect = document.getElementById('case-select');
const noHyphens = document.getElementById('no-hyphens');
const generateBtn = document.getElementById('generate-btn');
const copyAllBtn = document.getElementById('copy-all-btn');
const uuidList = document.getElementById('uuid-list');

let uuids = [];

function generateUUID() {
    // Use crypto.randomUUID if available, else fallback
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatUUID(uuid) {
    let result = uuid;
    if (caseSelect.value === 'upper') result = result.toUpperCase();
    else result = result.toLowerCase();
    if (noHyphens.checked) result = result.replace(/-/g, '');
    return result;
}

function copyText(text, btn) {
    navigator.clipboard.writeText(text);
    const icon = btn.querySelector('ion-icon');
    if (icon) {
        icon.setAttribute('name', 'checkmark-outline');
        btn.style.color = 'var(--success)';
        setTimeout(() => {
            icon.setAttribute('name', 'copy-outline');
            btn.style.color = '';
        }, 1200);
    }
}

function render() {
    uuidList.innerHTML = uuids.map((uuid, i) => `
        <div class="uuid-item" style="animation-delay: ${i * 0.04}s">
            <span class="uuid-text">${uuid}</span>
            <button class="uuid-copy" onclick="copyText('${uuid}', this)" title="Copy">
                <ion-icon name="copy-outline"></ion-icon>
            </button>
        </div>
    `).join('');
}

function generate() {
    const count = Math.min(Math.max(parseInt(countInput.value) || 1, 1), 100);
    countInput.value = count;
    uuids = [];
    for (let i = 0; i < count; i++) {
        uuids.push(formatUUID(generateUUID()));
    }
    render();
}

window.copyText = copyText;

generateBtn.addEventListener('click', generate);

copyAllBtn.addEventListener('click', () => {
    if (!uuids.length) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    const icon = copyAllBtn.querySelector('ion-icon');
    copyAllBtn.style.color = 'var(--success)';
    icon.setAttribute('name', 'checkmark-outline');
    setTimeout(() => {
        copyAllBtn.style.color = '';
        icon.setAttribute('name', 'copy-outline');
    }, 1500);
});

// Re-format on setting change
caseSelect.addEventListener('change', () => {
    uuids = uuids.map(u => {
        let raw = u.toLowerCase();
        if (!raw.includes('-') && raw.length === 32) {
            raw = raw.slice(0,8)+'-'+raw.slice(8,12)+'-'+raw.slice(12,16)+'-'+raw.slice(16,20)+'-'+raw.slice(20);
        }
        return formatUUID(raw);
    });
    render();
});

noHyphens.addEventListener('change', () => {
    uuids = uuids.map(u => {
        let raw = u.toLowerCase().replace(/-/g, '');
        raw = raw.slice(0,8)+'-'+raw.slice(8,12)+'-'+raw.slice(12,16)+'-'+raw.slice(16,20)+'-'+raw.slice(20);
        return formatUUID(raw);
    });
    render();
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
generate();
