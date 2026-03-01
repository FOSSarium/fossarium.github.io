const jwtInput = document.getElementById('jwt-input');
const headerOutput = document.getElementById('header-output');
const payloadOutput = document.getElementById('payload-output');
const status = document.getElementById('status');

function decode() {
    const token = jwtInput.value.trim();
    if (!token) { headerOutput.textContent = '{}'; payloadOutput.textContent = '{}'; status.classList.add('hidden'); return; }
    try {
        const parts = token.split('.');
        if (parts.length < 2) throw new Error('Invalid JWT format');
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        headerOutput.textContent = JSON.stringify(header, null, 2);
        payloadOutput.textContent = JSON.stringify(payload, null, 2);
        status.classList.add('hidden');
    } catch (e) {
        status.textContent = '✗ ' + e.message;
        status.className = 'status-bar error';
    }
}

jwtInput.addEventListener('input', decode);


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
