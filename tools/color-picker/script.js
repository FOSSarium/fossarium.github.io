const picker = document.getElementById('picker'),
    preview = document.getElementById('preview'),
    formats = document.getElementById('formats');

function hexToRgb(h) {
    const r = parseInt(h.slice(1, 3), 16) || 0,
        g = parseInt(h.slice(3, 5), 16) || 0,
        b = parseInt(h.slice(5, 7), 16) || 0;
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function update() {
    const hex = picker.value;
    preview.style.background = hex;
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);

    const colorFormats = [
        ['HEX', hex.toUpperCase()],
        ['RGB', `rgb(${r}, ${g}, ${b})`],
        ['HSL', `hsl(${h}, ${s}%, ${l}%)`],
        ['RGBA', `rgba(${r}, ${g}, ${b}, 1)`]
    ];

    formats.innerHTML = colorFormats.map(([label, val]) => `
        <div class="fmt-row" onclick="copyValue('${val}', this)">
            <span class="fmt-label">${label}</span>
            <span class="fmt-val">${val}</span>
        </div>
    `).join('');
}

function copyValue(val, el) {
    navigator.clipboard.writeText(val);
    const valSpan = el.querySelector('.fmt-val');
    const originalText = valSpan.textContent;
    valSpan.textContent = "COPIED!";
    setTimeout(() => {
        valSpan.textContent = originalText;
    }, 1000);
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

picker.addEventListener('input', update);
window.copyValue = copyValue;
initTheme();
update();
