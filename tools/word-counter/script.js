const input = document.getElementById('text-input');
function update() {
    const t = input.value;
    document.getElementById('chars').textContent = t.length;
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    document.getElementById('words').textContent = words;
    document.getElementById('sentences').textContent = t.trim() ? (t.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0) : 0;
    document.getElementById('paragraphs').textContent = t.trim() ? t.split(/\n\s*\n/).filter(p => p.trim()).length || (words > 0 ? 1 : 0) : 0;
    document.getElementById('reading-time').textContent = Math.ceil(words / 200);
}
input.addEventListener('input', update);


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
