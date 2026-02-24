const tabs = document.querySelectorAll('.tab-btn');
const inputLabel = document.getElementById('input-label');
const outputLabel = document.getElementById('output-label');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const btnProcess = document.getElementById('btn-process');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const toast = document.getElementById('toast');

let currentMode = 'encode'; // 'encode' or 'decode'

function setMode(mode) {
    currentMode = mode;

    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${mode}"]`).classList.add('active');

    // Update UI labels and buttons
    if (mode === 'encode') {
        inputLabel.textContent = "Plain Text Input";
        inputText.placeholder = "Type or paste your text here...";
        outputLabel.textContent = "Base64 Output";
        btnProcess.innerHTML = `Encode to Base64 <ion-icon name="arrow-down"></ion-icon>`;
    } else {
        inputLabel.textContent = "Base64 Input";
        inputText.placeholder = "Paste your Base64 encoded string here...";
        outputLabel.textContent = "Plain Text Output";
        btnProcess.innerHTML = `Decode Base64 <ion-icon name="arrow-down"></ion-icon>`;
    }

    // Clear and re-process if there's text
    outputText.value = "";
    outputText.classList.remove('error');
    if (inputText.value.trim() !== "") {
        processText();
    }
}

function processText() {
    const text = inputText.value;
    outputText.classList.remove('error');

    if (!text) {
        outputText.value = "";
        return;
    }

    try {
        if (currentMode === 'encode') {
            // Encode properly handling unicode
            outputText.value = btoa(unescape(encodeURIComponent(text)));
        } else {
            // Decode
            outputText.value = decodeURIComponent(escape(atob(text)));
        }
    } catch (e) {
        outputText.classList.add('error');
        outputText.value = `Error: ${currentMode === 'decode' ? 'Invalid Base64 string' : e.message}`;
    }
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Events
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        setMode(e.target.dataset.tab);
    });
});

btnProcess.addEventListener('click', processText);

// Optional auto-process on input (debounced)
let timeout = null;
inputText.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(processText, 300);
});

btnClear.addEventListener('click', () => {
    inputText.value = "";
    outputText.value = "";
    outputText.classList.remove('error');
    inputText.focus();
});

btnCopy.addEventListener('click', () => {
    if (!outputText.value || outputText.classList.contains('error')) return;

    navigator.clipboard.writeText(outputText.value).then(() => {
        showToast("Copied to clipboard!");
    }).catch(() => {
        outputText.select();
        document.execCommand('copy');
        showToast("Copied to clipboard!");
    });
});

// Init
setMode('encode');
