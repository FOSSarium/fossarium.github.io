const tsInput = document.getElementById('ts-input'), dateInput = document.getElementById('date-input');
const liveTs = document.getElementById('live-ts');
const toast = document.getElementById('toast'), toastMsg = document.getElementById('toast-message');

// Live clock
setInterval(() => { liveTs.textContent = Math.floor(Date.now() / 1000); }, 1000);
liveTs.addEventListener('click', () => { tsInput.value = Math.floor(Date.now() / 1000); convertToDate(); });

// Tabs
document.querySelectorAll('.mode-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active')); b.classList.add('active');
    document.getElementById('to-date-section').classList.toggle('hidden', b.dataset.mode !== 'to-date');
    document.getElementById('to-ts-section').classList.toggle('hidden', b.dataset.mode !== 'to-ts');
}));

function relative(ts) {
    const diff = Date.now() / 1000 - ts; const abs = Math.abs(diff);
    const units = [[60, 'second'], [3600, 'minute', 60], [86400, 'hour', 3600], [2592000, 'day', 86400], [31536000, 'month', 2592000], [Infinity, 'year', 31536000]];
    for (const [limit, unit, div] of units) {
        if (abs < limit) {
            const n = div ? Math.floor(abs / div) : Math.floor(abs);
            return `${n} ${unit}${n !== 1 ? 's' : ''} ${diff > 0 ? 'ago' : 'from now'}`;
        }
    }
}

function convertToDate() {
    const ts = parseInt(tsInput.value);
    if (isNaN(ts)) return;
    const d = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
    document.getElementById('r-local').textContent = d.toLocaleString();
    document.getElementById('r-utc').textContent = d.toUTCString();
    document.getElementById('r-iso').textContent = d.toISOString();
    document.getElementById('r-relative').textContent = relative(ts > 1e12 ? ts / 1000 : ts);
}

function convertToTs() {
    const d = new Date(dateInput.value);
    if (isNaN(d)) return;
    document.getElementById('r-seconds').textContent = Math.floor(d.getTime() / 1000);
    document.getElementById('r-millis').textContent = d.getTime();
}

tsInput.addEventListener('input', convertToDate);
dateInput.addEventListener('input', convertToTs);
document.getElementById('now-btn').addEventListener('click', () => { tsInput.value = Math.floor(Date.now() / 1000); convertToDate(); });

// Click-to-copy result items
document.querySelectorAll('.result-item').forEach(el => el.addEventListener('click', () => {
    const v = el.querySelector('.r-value').textContent;
    if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!'));
}));

function showToast(msg) {
    toastMsg.textContent = msg; toast.classList.remove('hidden'); toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.classList.add('hidden'), 300); }, 2000);
}

(function() {
    const b = document.getElementById('theme-toggle'), icon = b.querySelector('ion-icon');
    const u = t => icon.setAttribute('name', t === 'light' ? 'moon-outline' : 'sunny-outline');
    const sv = localStorage.getItem('fossarium-theme');
    if (sv) u(sv); else if (matchMedia('(prefers-color-scheme:light)').matches) u('light');
    b.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const l = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', l ? 'light' : 'dark'); u(l ? 'light' : 'dark');
    });
})();
