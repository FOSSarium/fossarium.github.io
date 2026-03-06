const container = document.getElementById('container');
const code = document.getElementById('code');
const inputs = ['flex-direction', 'justify-content', 'align-items', 'flex-wrap'];
const itemCountInput = document.getElementById('item-count');
const copyBtn = document.getElementById('copy-btn');

function update() {
    // Update container style
    inputs.forEach(id => {
        const val = document.getElementById(id).value;
        container.style[id.replace(/-([a-z])/g, g => g[1].toUpperCase())] = val;
    });

    // Update items
    const count = parseInt(itemCountInput.value);
    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'flex-item';
        div.textContent = i;
        container.appendChild(div);
    }

    // Generate code
    let cssCode = `.container {\n  display: flex;\n`;
    inputs.forEach(id => {
        cssCode += `  ${id}: ${document.getElementById(id).value};\n`;
    });
    cssCode += `}`;
    code.textContent = cssCode;
}

// Event Listeners
[...inputs, 'item-count'].forEach(id => {
    document.getElementById(id).addEventListener('input', update);
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(code.textContent);
    const icon = copyBtn.querySelector('ion-icon');
    const originalName = icon.getAttribute('name');
    icon.setAttribute('name', 'checkmark-outline');
    copyBtn.style.color = '#3fb950';
    setTimeout(() => {
        icon.setAttribute('name', originalName);
        copyBtn.style.color = '';
    }, 1500);
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
update();
