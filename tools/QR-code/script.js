// ===== DOM =====
const qrInput = document.getElementById('qr-input');
const sizeSelect = document.getElementById('qr-size');
const correctionSelect = document.getElementById('qr-correction');
const fgColor = document.getElementById('qr-fg');
const bgColor = document.getElementById('qr-bg');
const fgHex = document.getElementById('fg-hex');
const bgHex = document.getElementById('bg-hex');
const generateBtn = document.getElementById('generate-btn');
const qrOutput = document.getElementById('qr-output');
const qrCanvas = document.getElementById('qr-canvas');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

let qrInstance = null;

// ===== Color hex labels =====
fgColor.addEventListener('input', () => { fgHex.textContent = fgColor.value; });
bgColor.addEventListener('input', () => { bgHex.textContent = bgColor.value; });

// ===== Generate =====
function generateQR() {
    const text = qrInput.value.trim();
    if (!text) return;

    const size = parseInt(sizeSelect.value);
    const correction = correctionSelect.value;
    const correctionLevel = { L: QRCode.CorrectLevel.L, M: QRCode.CorrectLevel.M, Q: QRCode.CorrectLevel.Q, H: QRCode.CorrectLevel.H };

    // Clear old
    qrCanvas.innerHTML = '';

    qrInstance = new QRCode(qrCanvas, {
        text: text,
        width: size,
        height: size,
        colorDark: fgColor.value,
        colorLight: bgColor.value,
        correctLevel: correctionLevel[correction] || QRCode.CorrectLevel.M
    });

    qrOutput.classList.remove('hidden');
}

// ===== Download PNG =====
document.getElementById('download-png').addEventListener('click', () => {
    const canvas = qrCanvas.querySelector('canvas');
    const img = qrCanvas.querySelector('img');

    if (canvas) {
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } else if (img) {
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = img.src;
        link.click();
    }
});

// ===== Copy QR =====
document.getElementById('copy-qr').addEventListener('click', async () => {
    const canvas = qrCanvas.querySelector('canvas');
    if (canvas) {
        try {
            canvas.toBlob(async (blob) => {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('QR code copied!');
            });
        } catch {
            showToast('Copy not supported in this browser');
        }
    }
});

// ===== Events =====
generateBtn.addEventListener('click', generateQR);
qrInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateQR(); }
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

initTheme();
