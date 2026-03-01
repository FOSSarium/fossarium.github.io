const input = document.getElementById('cron');
const fieldsEl = document.getElementById('fields');
const resultEl = document.getElementById('result');

const names = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];

function describePart(p, name) {
    if (p === '*') return 'every ' + name;
    if (p.includes('/')) {
        const [range, interval] = p.split('/');
        return `every ${interval} ${name}(s)` + (range !== '*' ? ` starting from ${range}` : '');
    }
    if (p.includes('-')) {
        const [a, b] = p.split('-');
        return name + ' ' + a + ' through ' + b;
    }
    if (p.includes(',')) return name + ' ' + p;
    return 'at ' + name + ' ' + p;
}

function parse() {
    const parts = input.value.trim().split(/\s+/);
    
    if (parts.length !== 5) {
        resultEl.textContent = 'Please enter 5 fields: min hour day month weekday';
        fieldsEl.innerHTML = '';
        return;
    }

    fieldsEl.innerHTML = parts.map((p, i) => `
        <div class="field-comp">
            <div class="label">${names[i]}</div>
            <div class="val">${p}</div>
        </div>
    `).join('');

    const desc = parts.map((p, i) => describePart(p, names[i].toLowerCase())).join(', ');
    resultEl.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
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

input.addEventListener('input', parse);
initTheme();
parse();
