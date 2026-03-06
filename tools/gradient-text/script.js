const textInput = document.getElementById("text");
const stopsContainer = document.getElementById("stops");
const addColorBtn = document.getElementById("add-color");
const previewEl = document.getElementById("preview");
const codeEl = document.getElementById("code");
const copyBtn = document.getElementById("copy-btn");

let colors = [
    { value: "#58a6ff", pos: 0 },
    { value: "#7F00FF", pos: 100 }
];

function renderStops() {
    stopsContainer.innerHTML = '';
    colors.forEach((c, i) => {
        const stopDiv = document.createElement('div');
        stopDiv.className = 'color-stop-item';
        stopDiv.innerHTML = `
            <input type="color" value="${c.value}" data-index="${i}">
            <input type="range" min="0" max="100" value="${c.pos}" data-index="${i}">
            <span class="stop-pos-val">${c.pos}%</span>
            <button class="remove-stop-btn" data-index="${i}"><ion-icon name="close-circle-outline"></ion-icon></button>
        `;
        stopsContainer.appendChild(stopDiv);
    });

    document.querySelectorAll('.color-stop-item input[type="color"]').forEach(input => {
        input.addEventListener('input', updateGradient);
    });
    document.querySelectorAll('.color-stop-item input[type="range"]').forEach(input => {
        input.addEventListener('input', updateGradient);
    });
    document.querySelectorAll('.remove-stop-btn').forEach(btn => {
        btn.addEventListener('click', removeStop);
    });
}

function updateGradient(event) {
    const index = parseInt(event.target.dataset.index);
    if (event.target.type === 'color') {
        colors[index].value = event.target.value;
    } else {
        colors[index].pos = parseInt(event.target.value);
        event.target.previousElementSibling.textContent = `${event.target.value}%`;
    }
    
    colors.sort((a, b) => a.pos - b.pos); // Keep colors sorted by position
    renderGradient();
}

function addColorStop() {
    if (colors.length < 5) {
        colors.push({ value: "#ffffff", pos: 100 });
        colors.sort((a, b) => a.pos - b.pos);
        renderStops();
        renderGradient();
    }
}

function removeStop(event) {
    const index = parseInt(event.target.closest('.remove-stop-btn').dataset.index);
    if (colors.length > 2) { // Ensure at least two stops remain
        colors.splice(index, 1);
        renderStops();
        renderGradient();
    }
}


function renderGradient() {
    const sortedColors = [...colors].sort((a, b) => a.pos - b.pos);
    const gradientCss = sortedColors.map(c => `${c.value} ${c.pos}%`).join(', ');
    const fullGradient = `linear-gradient(90deg, ${gradientCss})`;

    previewEl.textContent = textInput.value;
    previewEl.style.background = fullGradient;
    previewEl.style.webkitBackgroundClip = "text";
    previewEl.style.webkitTextFillColor = "transparent";
    previewEl.style.backgroundClip = "text";
    previewEl.style.textFillColor = "transparent";
    
    codeEl.textContent = `background: ${fullGradient};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
color: transparent;`;
}

textInput.addEventListener("input", renderGradient);
addColorBtn.addEventListener("click", addColorStop);

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(codeEl.textContent);
    const icon = copyBtn.querySelector('ion-icon');
    const originalName = icon.getAttribute('name');
    icon.setAttribute('name', 'checkmark-outline');
    copyBtn.style.color = '#3fb950';
    setTimeout(() => {
        icon.setAttribute('name', originalName);
        copyBtn.style.color = '';
    }, 1500);
});


function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('ion-icon');

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    } else {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
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
renderStops();
renderGradient();
