document.getElementById('format-btn').addEventListener('click', () => {
    const xml = document.getElementById('input').value;
    if (!xml.trim()) return;
    let formatted = '', indent = '';
    const pad = '    ';
    xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean).forEach(node => {
        if (node.match(/^<\/\w/)) indent = indent.substring(pad.length);
        formatted += indent + node + '\n';
        if (node.match(/^<\w[^>]*[^\/]>$/)) indent += pad;
    });
    document.getElementById('output').value = formatted.trim();
});
document.getElementById('copy-btn').addEventListener('click', () => { const t = document.getElementById('output').value; if (t) navigator.clipboard.writeText(t); });


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
