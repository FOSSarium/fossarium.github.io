// ===== DOM =====
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const bgColor = document.getElementById('bg-color');
const bgHex = document.getElementById('bg-hex');
const textColor = document.getElementById('text-color');
const textHex = document.getElementById('text-hex');
const customText = document.getElementById('custom-text');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

let format = 'png';

// ===== Sync Color Pickers =====
bgColor.addEventListener('input', () => { bgHex.value = bgColor.value; generate(); });
bgHex.addEventListener('input', () => {
    if (/^#[0-9a-f]{6}$/i.test(bgHex.value)) { bgColor.value = bgHex.value; generate(); }
});

textColor.addEventListener('input', () => { textHex.value = textColor.value; generate(); });
textHex.addEventListener('input', () => {
    if (/^#[0-9a-f]{6}$/i.test(textHex.value)) { textColor.value = textHex.value; generate(); }
});

// ===== Live Update =====
widthInput.addEventListener('input', generate);
heightInput.addEventListener('input', generate);
customText.addEventListener('input', generate);

// ===== Format Selector =====
document.querySelectorAll('.fmt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        format = btn.dataset.format;
    });
});

// ===== Presets =====
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        widthInput.value = btn.dataset.w;
        heightInput.value = btn.dataset.h;
        generate();
    });
});

// ===== Generate =====
function generate() {
    const w = Math.max(10, Math.min(4000, parseInt(widthInput.value) || 800));
    const h = Math.max(10, Math.min(4000, parseInt(heightInput.value) || 400));

    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, w, h);

    // Cross lines
    ctx.strokeStyle = textColor.value;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
    ctx.moveTo(w, 0);
    ctx.lineTo(0, h);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Text
    const text = customText.value || `${w} × ${h}`;
    const fontSize = Math.max(12, Math.min(w, h) / 8);
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = textColor.value;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
}

document.getElementById('generate-btn').addEventListener('click', generate);

// ===== Download =====
document.getElementById('download-btn').addEventListener('click', () => {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const ext = format === 'jpeg' ? 'jpg' : format;
    const dataUrl = canvas.toDataURL(mimeType, 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `placeholder-${widthInput.value}x${heightInput.value}.${ext}`;
    a.click();
    showToast('Image downloaded!');
});

// ===== Copy Data URL =====
document.getElementById('copy-url-btn').addEventListener('click', () => {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, 0.95);
    navigator.clipboard.writeText(dataUrl).then(() => showToast('Data URL copied!'));
});

// ===== Toast =====
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');
    function updateIcon(theme) { icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline'); }
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        updateIcon(isLight ? 'light' : 'dark');
    });
}

// ===== Init =====
initTheme();
generate();
