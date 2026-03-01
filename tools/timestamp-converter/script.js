setInterval(() => { const n = Math.floor(Date.now() / 1000); document.getElementById('now').textContent = n + ' (' + new Date().toISOString() + ')'; }, 1000);
function tsToDate() { const ts = parseInt(document.getElementById('ts').value); if (isNaN(ts)) return; const d = new Date(ts * 1000); document.getElementById('ts-result').textContent = d.toISOString() + '\n' + d.toLocaleString(); }
function dateToTs() { const v = document.getElementById('dt').value; if (!v) return; const ts = Math.floor(new Date(v).getTime() / 1000); document.getElementById('dt-result').textContent = ts + ' (seconds)\n' + (ts * 1000) + ' (milliseconds)'; }
document.getElementById('dt').value = new Date().toISOString().slice(0, 16);


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
