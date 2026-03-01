const input = document.getElementById('cron'), fieldsEl = document.getElementById('fields'), resultEl = document.getElementById('result');
const names = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];
const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function describePart(p, name) {
    if (p === '*') return 'every ' + name;
    if (p.includes('/')) return 'every ' + p.split('/')[1] + ' ' + name + '(s)';
    if (p.includes('-')) { const [a, b] = p.split('-'); return name + ' ' + a + ' through ' + b; }
    if (p.includes(',')) return name + ' ' + p;
    return 'at ' + name + ' ' + p;
}
function parse() {
    const parts = input.value.trim().split(/\s+/);
    if (parts.length !== 5) { resultEl.textContent = 'Enter 5 fields: min hour day month weekday'; fieldsEl.innerHTML = ''; return; }
    fieldsEl.innerHTML = parts.map((p, i) => `<div class="field"><div class="label">${names[i]}</div><div class="val">${p}</div></div>`).join('');
    const desc = parts.map((p, i) => describePart(p, names[i].toLowerCase())).join(', ');
    resultEl.textContent = 'Runs: ' + desc;
}
input.addEventListener('input', parse); parse();


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
