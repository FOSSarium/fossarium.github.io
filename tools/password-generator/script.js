const passwordElem = document.getElementById('password');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length');
const lengthVal = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toast = document.getElementById('toast');

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

function generatePassword() {
    let chars = '';
    if (uppercaseEl.checked) chars += UPPERCASE_CHARS;
    if (lowercaseEl.checked) chars += LOWERCASE_CHARS;
    if (numbersEl.checked) chars += NUMBER_CHARS;
    if (symbolsEl.checked) chars += SYMBOL_CHARS;

    if (chars === '') {
        passwordElem.textContent = 'Select at least one!';
        passwordElem.style.color = '#ff5858';
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
    }

    let password = '';
    const length = lengthSlider.value;

    // Ensure at least one from each checked category
    if (uppercaseEl.checked) password += getRandomChar(UPPERCASE_CHARS);
    if (lowercaseEl.checked) password += getRandomChar(LOWERCASE_CHARS);
    if (numbersEl.checked) password += getRandomChar(NUMBER_CHARS);
    if (symbolsEl.checked) password += getRandomChar(SYMBOL_CHARS);

    while (password.length < length) {
        password += getRandomChar(chars);
    }

    // Shuffle
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    passwordElem.textContent = password;
    passwordElem.style.color = 'var(--accent-color)';
    updateStrength(password);
}

function getRandomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
}

function updateStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    if (uppercaseEl.checked) strength += 1;
    if (lowercaseEl.checked) strength += 1;
    if (numbersEl.checked) strength += 1;
    if (symbolsEl.checked) strength += 1;

    let width = '0%';
    let color = '';
    let text = '';

    if (strength <= 2) {
        width = '25%'; color = '#ff5858'; text = 'Weak';
    } else if (strength <= 4) {
        width = '50%'; color = '#f5af19'; text = 'Fair';
    } else if (strength <= 5) {
        width = '75%'; color = '#38ef7d'; text = 'Good';
    } else {
        width = '100%'; color = '#11998e'; text = 'Strong';
    }

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

lengthSlider.addEventListener('input', () => {
    lengthVal.textContent = lengthSlider.value;
    generatePassword();
});

generateBtn.addEventListener('click', generatePassword);

// Generate initial password
generatePassword();

// Checkbox change triggers generation
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(cb => {
    cb.addEventListener('change', generatePassword);
});

copyBtn.addEventListener('click', async () => {
    if (!passwordElem.textContent || passwordElem.textContent === 'Select at least one!') return;

    try {
        await navigator.clipboard.writeText(passwordElem.textContent);
        showToast();
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = passwordElem.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast();
    }
});

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}


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
