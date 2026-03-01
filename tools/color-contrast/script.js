const fgColor = document.getElementById('fg-color');
const bgColor = document.getElementById('bg-color');
const fgHex = document.getElementById('fg-hex');
const bgHex = document.getElementById('bg-hex');
const preview = document.getElementById('preview');

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    return { r: parseInt(hex.substr(0, 2), 16), g: parseInt(hex.substr(2, 2), 16), b: parseInt(hex.substr(4, 2), 16) };
}

function luminance(r, g, b) {
    const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(fg, bg) {
    const l1 = luminance(fg.r, fg.g, fg.b);
    const l2 = luminance(bg.r, bg.g, bg.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function update() {
    const fg = hexToRgb(fgHex.value);
    const bg = hexToRgb(bgHex.value);
    const ratio = contrastRatio(fg, bg);
    const ratioStr = ratio.toFixed(2) + ':1';

    preview.style.color = fgHex.value;
    preview.style.backgroundColor = bgHex.value;

    document.getElementById('ratio').textContent = ratioStr;

    const set = (id, pass) => {
        const el = document.getElementById(id);
        el.textContent = pass ? 'Pass ✓' : 'Fail ✗';
        el.className = 'result-value ' + (pass ? 'pass' : 'fail');
    };

    set('aa-normal', ratio >= 4.5);
    set('aa-large', ratio >= 3);
    set('aaa-normal', ratio >= 7);
    set('aaa-large', ratio >= 4.5);
}

fgColor.addEventListener('input', () => { fgHex.value = fgColor.value; update(); });
bgColor.addEventListener('input', () => { bgHex.value = bgColor.value; update(); });
fgHex.addEventListener('input', () => { fgColor.value = fgHex.value; update(); });
bgHex.addEventListener('input', () => { bgColor.value = bgHex.value; update(); });

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
