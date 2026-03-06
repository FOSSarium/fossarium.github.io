const hexInput = document.getElementById("hex");
const rInput = document.getElementById("r");
const gInput = document.getElementById("g");
const bInput = document.getElementById("b");
const picker = document.getElementById("color-picker");
const preview = document.getElementById("preview");

function updateFromHex() {
    let hex = hexInput.value.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(c => c + c).join("");
    }
    
    if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            rInput.value = r;
            gInput.value = g;
            bInput.value = b;
            picker.value = "#" + hex;
            updatePreview("#" + hex);
        }
    }
}

function updateFromRGB() {
    const r = Math.min(255, Math.max(0, parseInt(rInput.value) || 0));
    const g = Math.min(255, Math.max(0, parseInt(gInput.value) || 0));
    const b = Math.min(255, Math.max(0, parseInt(bInput.value) || 0));
    
    const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
    hexInput.value = hex.toUpperCase();
    picker.value = hex;
    updatePreview(hex);
}

function updateFromPicker() {
    const hex = picker.value.toUpperCase();
    hexInput.value = hex;
    updateFromHex();
}

function updatePreview(color) {
    preview.style.backgroundColor = color;
}

hexInput.addEventListener("input", updateFromHex);
picker.addEventListener("input", updateFromPicker);
[rInput, gInput, bInput].forEach(el => el.addEventListener("input", updateFromRGB));

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        let val = "";
        
        if (target === 'hex') {
            val = hexInput.value;
        } else if (target === 'rgb') {
            val = `rgb(${rInput.value}, ${gInput.value}, ${bInput.value})`;
        }
        
        navigator.clipboard.writeText(val);
        
        const icon = btn.querySelector('ion-icon');
        const originalName = icon.getAttribute('name');
        icon.setAttribute('name', 'checkmark-outline');
        btn.style.color = '#3fb950';
        setTimeout(() => {
            icon.setAttribute('name', originalName);
            btn.style.color = '';
        }, 1500);
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
updateFromHex();
