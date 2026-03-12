const input = document.getElementById('input'), output = document.getElementById('output');
const charCount = document.getElementById('char-count'), wordCount = document.getElementById('word-count');
const toast = document.getElementById('toast'), toastMsg = document.getElementById('toast-message');

function toWords(s) { return s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_\-\.]+/g, ' ').trim().split(/\s+/).filter(Boolean); }

const cases = {
    upper: s => s.toUpperCase(),
    lower: s => s.toLowerCase(),
    title: s => s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()),
    sentence: s => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, (m, p, c) => p + c.toUpperCase()),
    camel: s => { const w = toWords(s); return w.map((v, i) => i === 0 ? v.toLowerCase() : v[0].toUpperCase() + v.slice(1).toLowerCase()).join(''); },
    pascal: s => toWords(s).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
    snake: s => toWords(s).map(w => w.toLowerCase()).join('_'),
    kebab: s => toWords(s).map(w => w.toLowerCase()).join('-'),
    constant: s => toWords(s).map(w => w.toUpperCase()).join('_'),
    dot: s => toWords(s).map(w => w.toLowerCase()).join('.'),
    toggle: s => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    reverse: s => s.split('').reverse().join('')
};

let activeCase = null;
function apply(type) {
    activeCase = type;
    document.querySelectorAll('.case-btn').forEach(b => b.classList.toggle('active', b.dataset.case === type));
    const text = input.value;
    output.value = text ? cases[type](text) : '';
    updateStats();
}

function updateStats() {
    const t = output.value;
    charCount.textContent = t.length;
    wordCount.textContent = t.trim() ? t.trim().split(/\s+/).length : 0;
}

document.querySelectorAll('.case-btn').forEach(b => b.addEventListener('click', () => apply(b.dataset.case)));
input.addEventListener('input', () => { if (activeCase) apply(activeCase); });

document.getElementById('copy-btn').addEventListener('click', () => {
    if (output.value) navigator.clipboard.writeText(output.value).then(() => {
        toastMsg.textContent = 'Copied!'; toast.classList.remove('hidden'); toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.classList.add('hidden'), 300); }, 2000);
    });
});

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
