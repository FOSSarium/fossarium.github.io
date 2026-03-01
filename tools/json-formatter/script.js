const input = document.getElementById('json-input');
const output = document.getElementById('json-output');
const statusBar = document.getElementById('status-bar');

function showStatus(message, type) {
    statusBar.textContent = message;
    statusBar.className = 'status-bar ' + type;
    setTimeout(() => statusBar.classList.add('hidden'), 4000);
}

document.getElementById('format-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, 4);
        showStatus('✓ JSON beautified successfully!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('minify-btn').addEventListener('click', () => {
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed);
        showStatus('✓ JSON minified successfully!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('validate-btn').addEventListener('click', () => {
    try {
        JSON.parse(input.value);
        showStatus('✓ Valid JSON!', 'success');
    } catch (e) {
        showStatus('✗ Invalid JSON: ' + e.message, 'error');
    }
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const text = output.value || input.value;
    if (!text) { showStatus('Nothing to copy.', 'error'); return; }
    navigator.clipboard.writeText(text).then(() => {
        showStatus('✓ Copied to clipboard!', 'success');
    });
});

document.getElementById('clear-btn').addEventListener('click', () => {
    input.value = '';
    output.value = '';
    statusBar.classList.add('hidden');
});


function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('ion-icon');

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');

        if (isLight) {
            localStorage.setItem('fossarium-theme', 'light');
            if (icon) icon.setAttribute('name', 'moon-outline');
        } else {
            localStorage.setItem('fossarium-theme', 'dark');
            if (icon) icon.setAttribute('name', 'sunny-outline');
        }
    });
}

initTheme();
