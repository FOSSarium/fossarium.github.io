const w1 = document.getElementById('w1'), h1 = document.getElementById('h1'), w2 = document.getElementById('w2'), h2 = document.getElementById('h2'), result = document.getElementById('result');
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function update() { const w = parseInt(w1.value) || 0, h = parseInt(h1.value) || 0; if (!w || !h) return; const d = gcd(w, h); result.textContent = 'Ratio: ' + w / d + ':' + h / d; const nw = parseInt(w2.value) || 0; h2.value = Math.round(nw * h / w); }
w1.addEventListener('input', update); h1.addEventListener('input', update); w2.addEventListener('input', update); update();


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
