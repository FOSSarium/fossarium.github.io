const prompt = document.getElementById('prompt'), grid = document.getElementById('info-grid');
document.addEventListener('keydown', e => {
    e.preventDefault();
    prompt.textContent = e.key === ' ' ? 'Space' : e.key;
    prompt.classList.add('active');
    grid.innerHTML = [
        ['key', e.key], ['code', e.code], ['keyCode', e.keyCode], ['which', e.which],
        ['location', e.location], ['type', e.type], ['repeat', e.repeat],
        ['modifiers', [e.ctrlKey && 'Ctrl', e.shiftKey && 'Shift', e.altKey && 'Alt', e.metaKey && 'Meta'].filter(Boolean).join('+') || 'None']
    ].map(([l, v]) => `<div class="info-card"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
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
