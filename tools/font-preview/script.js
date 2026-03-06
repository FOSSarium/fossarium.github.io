const fonts = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", 
    "Playfair Display", "Oswald", "Raleway", "Merriweather", 
    "Source Code Pro", "JetBrains Mono", "Fira Sans", "Nunito", "Ubuntu"
];

const textInput = document.getElementById("text-input");
const fontSizeInput = document.getElementById("font-size");
const sizeVal = document.getElementById("size-val");
const fontList = document.getElementById("font-list");

// Load fonts from Google
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=" + fonts.map(f => f.replace(/ /g, "+")).join("&family=") + "&display=swap";
document.head.appendChild(link);

function render() {
    const size = fontSizeInput.value;
    const sampleText = textInput.value || "The quick brown fox jumps over the lazy dog.";
    sizeVal.textContent = size;

    fontList.innerHTML = fonts.map(f => `
        <div class="font-item" onclick="copyCSS('${f}')">
            <div class="font-info">
                <span class="font-name">${f}</span>
                <span class="copy-hint">Click to copy CSS</span>
            </div>
            <div class="font-sample" style="font-family:'${f}'; font-size:${size}px">
                ${sampleText}
            </div>
        </div>
    `).join("");
}

function copyCSS(font) {
    const css = `font-family: '${font}', sans-serif;`;
    navigator.clipboard.writeText(css);
    
    // Minimal feedback - we can improve this if needed
    const items = document.querySelectorAll('.font-item');
    items.forEach(item => {
        if(item.querySelector('.font-name').textContent === font) {
            const hint = item.querySelector('.copy-hint');
            const original = hint.textContent;
            hint.textContent = "Copied!";
            hint.style.color = "#3fb950";
            setTimeout(() => {
                hint.textContent = original;
                hint.style.color = "";
            }, 1000);
        }
    });
}

textInput.addEventListener("input", render);
fontSizeInput.addEventListener("input", render);

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
render();
window.copyCSS = copyCSS;
