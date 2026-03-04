const tabs = document.querySelectorAll('.tab-btn');
const inputLabel = document.getElementById('input-label');
const outputLabel = document.getElementById('output-label');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const toast = document.getElementById('toast');

let currentMode = 'encode'; // 'encode' or 'decode'

function setMode(mode) {
    currentMode = mode;

    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${mode}"]`).classList.add('active');

    // Update UI labels
    if (mode === 'encode') {
        inputLabel.textContent = "Plain Text Input";
        inputText.placeholder = "Type or paste your text here...";
        outputLabel.textContent = "Base64 Output";
    } else {
        inputLabel.textContent = "Base64 Input";
        inputText.placeholder = "Paste your Base64 encoded string here...";
        outputLabel.textContent = "Plain Text Output";
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

// Live-process on input
inputText.addEventListener('input', processText);

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
