const nativePicker = document.getElementById('native-color-picker');
const previewBox = document.getElementById('preview-box');
const hexVal = document.getElementById('hex-val');
const rgbVal = document.getElementById('rgb-val');
const hslVal = document.getElementById('hsl-val');
const copyPrimary = document.getElementById('copy-primary');
const btnRandom = document.getElementById('generate-random');
const harmonySelect = document.getElementById('harmony-type');
const paletteDisplay = document.getElementById('palette-display');
const toast = document.getElementById('toast');

// Utility Functions
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function getRandomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Generators
function generatePalette(baseHex, type) {
    const rgb = hexToRgb(baseHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let palette = [baseHex];

    switch (type) {
        case 'analogous':
            palette.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
            palette.push(hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l));
            palette.unshift(hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
            palette.unshift(hslToHex((hsl.h - 60 + 360) % 360, hsl.s, hsl.l));
            break;
        case 'monochromatic':
            palette = [
                hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 40)),
                hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)),
                baseHex,
                hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20)),
                hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 40))
            ];
            break;
        case 'triadic':
            palette = [
                baseHex,
                hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
                hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
            ];
            break;
        case 'complementary':
            const comp = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
            palette = [
                hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)),
                baseHex,
                hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20)),
                comp,
                hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(0, hsl.l - 20))
            ];
            break;
    }

    // Sort logic to make center the base hex isn't strict, just UI flow
    return palette;
}

function updateUI(hexStr) {
    const rgb = hexToRgb(hexStr);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Update main section
    previewBox.style.backgroundColor = hexStr;
    nativePicker.value = hexStr;
    hexVal.textContent = hexStr.toUpperCase();
    rgbVal.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    hslVal.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    // Determine text color based on lightness
    const textColor = hsl.l > 50 ? '#000' : '#fff';
    document.querySelectorAll('.color-value').forEach(el => el.style.color = textColor);
    copyPrimary.style.color = textColor;
    copyPrimary.style.background = hsl.l > 50 ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)';

    // Generate Palette
    renderPalette(hexStr);
}

function renderPalette(baseHex) {
    const type = harmonySelect.value;
    const colors = generatePalette(baseHex, type);

    paletteDisplay.innerHTML = '';
    colors.forEach(hex => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = hex;

        const label = document.createElement('div');
        label.className = 'swatch-hex';
        label.textContent = hex.toUpperCase();

        swatch.appendChild(label);

        swatch.addEventListener('click', () => copyToClipboard(hex.toUpperCase()));

        paletteDisplay.appendChild(swatch);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text}`);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast(`Copied ${text}`);
    });
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Event Listeners
nativePicker.addEventListener('input', (e) => {
    updateUI(e.target.value);
});

btnRandom.addEventListener('click', () => {
    updateUI(getRandomHex());
});

harmonySelect.addEventListener('change', () => {
    updateUI(nativePicker.value);
});

copyPrimary.addEventListener('click', (e) => {
    e.stopPropagation(); // don't trigger color picker
    copyToClipboard(nativePicker.value.toUpperCase());
});

// Init
updateUI('#58a6ff');
