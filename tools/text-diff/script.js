document.getElementById('diff-btn').addEventListener('click', () => {
    const a = document.getElementById('text-a').value.split('\n');
    const b = document.getElementById('text-b').value.split('\n');
    const output = document.getElementById('diff-output');
    let html = '';
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
        const la = a[i] || '', lb = b[i] || '';
        if (la === lb) { html += la + '\n'; }
        else {
            if (la) html += '<span class="removed">' + la.replace(/</g, '&lt;') + '</span>\n';
            if (lb) html += '<span class="added">' + lb.replace(/</g, '&lt;') + '</span>\n';
        }
    }
    output.innerHTML = html || '<span style="color:var(--text-muted)">No differences found.</span>';
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
