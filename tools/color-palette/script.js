const baseInput = document.getElementById("base");
const baseHex = document.getElementById("base-hex");
const palette = document.getElementById("palette");

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return "#" + f(0) + f(8) + f(4);
}

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255,
        g = parseInt(hex.slice(3, 5), 16) / 255,
        b = parseInt(hex.slice(5, 7), 16) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) {
        const d = mx - mn;
        s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
        if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        else if (mx === g) h = ((b - r) / d + 2) * 60;
        else h = ((r - g) / d + 4) * 60;
    }
    return [h, s * 100, l * 100];
}

function gen() {
    const hexVal = baseInput.value;
    baseHex.value = hexVal.toUpperCase();
    const [h, s, l] = hexToHsl(hexVal);
    
    const schemes = [
        [h, s, l], [h + 30, s, l], [h + 60, s, l], [h + 180, s, l], 
        [h + 210, s, l], [h - 30, s, l], [h, s, Math.min(l + 15, 90)], 
        [h, s, Math.max(l - 15, 10)], [h, Math.min(s + 20, 100), l], 
        [h, Math.max(s - 20, 10), l]
    ];

    palette.innerHTML = schemes.map(([hh, ss, ll]) => {
        const hex = hslToHex(((hh % 360) + 360) % 360, ss, ll);
        const dark = ll < 50;
        return `
            <div class="swatch" style="background:${hex}; color:${dark ? "#fff" : "#000"}" onclick="copyColor('${hex}', this)">
                <span>${hex.toUpperCase()}</span>
            </div>`;
    }).join("");
}

function copyColor(hex, el) {
    navigator.clipboard.writeText(hex);
    const span = el.querySelector('span');
    const originalText = span.textContent;
    span.textContent = "COPIED!";
    setTimeout(() => {
        span.textContent = originalText;
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

baseInput.addEventListener("input", gen);
baseHex.addEventListener("input", () => {
    let val = baseHex.value;
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-F]{6}$/i.test(val)) {
        baseInput.value = val;
        gen();
    }
});

initTheme();
gen();
window.copyColor = copyColor;
