const h = document.getElementById('h-offset'), v = document.getElementById('v-offset'), b = document.getElementById('blur'), s = document.getElementById('spread'), c = document.getElementById('shadow-color'), o = document.getElementById('opacity'), inset = document.getElementById('inset');
const preview = document.getElementById('preview-box'), output = document.getElementById('css-output');
const hv = document.getElementById('h-val'), vv = document.getElementById('v-val'), bv = document.getElementById('b-val'), sv = document.getElementById('s-val'), ov = document.getElementById('o-val');

function hexToRgb(hex) { hex = hex.replace('#', ''); return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)]; }

function update() {
    hv.textContent = h.value; vv.textContent = v.value; bv.textContent = b.value; sv.textContent = s.value; ov.textContent = o.value;
    const [r, g, bb] = hexToRgb(c.value);
    const alpha = (o.value / 100).toFixed(2);
    const ins = inset.checked ? 'inset ' : '';
    const css = `box-shadow: ${ins}${h.value}px ${v.value}px ${b.value}px ${s.value}px rgba(${r},${g},${bb},${alpha});`;
    preview.style.boxShadow = `${ins}${h.value}px ${v.value}px ${b.value}px ${s.value}px rgba(${r},${g},${bb},${alpha})`;
    output.textContent = css;
}

[h, v, b, s, c, o, inset].forEach(el => el.addEventListener('input', update));
document.getElementById('copy-btn').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
update();


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
