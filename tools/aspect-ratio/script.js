const w1 = document.getElementById('w1'),
    h1 = document.getElementById('h1'),
    w2 = document.getElementById('w2'),
    h2 = document.getElementById('h2'),
    ratioDisplay = document.getElementById('ratio-display'),
    previewBox = document.getElementById('preview-box'),
    boxLabel = document.getElementById('box-label'),
    presetBtns = document.querySelectorAll('.preset-btn');

function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

function update() {
    const valW1 = parseInt(w1.value) || 0;
    const valH1 = parseInt(h1.value) || 0;
    const valW2 = parseInt(w2.value) || 0;

    if (valW1 > 0 && valH1 > 0) {
        const common = gcd(valW1, valH1);
        const rW = valW1 / common;
        const rH = valH1 / common;
        
        ratioDisplay.textContent = `${rW}:${rH}`;
        
        // Calculate target
        if (valW2 > 0) {
            const calculatedH2 = Math.round((valW2 * valH1) / valW1);
            h2.value = calculatedH2;
            boxLabel.textContent = `${valW2} × ${calculatedH2}`;
        }

        // Update visual preview
        const maxDim = 260; // Max size in px
        if (rW >= rH) {
            previewBox.style.width = `${maxDim}px`;
            previewBox.style.height = `${(maxDim * rH) / rW}px`;
        } else {
            previewBox.style.height = `${maxDim}px`;
            previewBox.style.width = `${(maxDim * rW) / rH}px`;
        }
    } else {
        ratioDisplay.textContent = "--:--";
        h2.value = "";
    }
}

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        w1.value = btn.dataset.w;
        h1.value = btn.dataset.h;
        update();
    });
});

[w1, h1, w2].forEach(el => el.addEventListener('input', update));

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
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
update();
