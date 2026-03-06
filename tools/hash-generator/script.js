const textInput = document.getElementById('text-input');

async function hashString(algorithm, message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function updateHashes() {
    const text = textInput.value;
    if (!text) {
        document.getElementById('sha256').value = '';
        document.getElementById('sha512').value = '';
        document.getElementById('sha1').value = '';
        return;
    }
    document.getElementById('sha256').value = await hashString('SHA-256', text);
    document.getElementById('sha512').value = await hashString('SHA-512', text);
    document.getElementById('sha1').value = await hashString('SHA-1', text);
}

textInput.addEventListener('input', updateHashes);

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target.value) {
            navigator.clipboard.writeText(target.value);
            const icon = btn.querySelector('ion-icon');
            const original = icon.getAttribute('name');
            icon.setAttribute('name', 'checkmark-outline');
            btn.style.color = '#3fb950';
            setTimeout(() => {
                icon.setAttribute('name', original);
                btn.style.color = '';
            }, 1000);
        }
    });
});

// Theme Logic
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    
    const setDarkMode = () => {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    };
    const setLightMode = () => {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    };

    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        setLightMode();
    } else {
        setDarkMode();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light-theme')) {
            setDarkMode();
            localStorage.setItem('fossarium-theme', 'dark');
        } else {
            setLightMode();
            localStorage.setItem('fossarium-theme', 'light');
        }
    });
}

initTheme();
updateHashes();
