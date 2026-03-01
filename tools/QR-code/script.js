const input = document.getElementById('qr-input');
const display = document.getElementById('qr-display');
let qr = null;

function generate() {
    const text = input.value.trim();
    if (!text) return;
    display.innerHTML = '';
    qr = new QRCode(display, {
        text: text,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

document.getElementById('generate-btn').addEventListener('click', generate);
input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
