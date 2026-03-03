let gradientType = 'linear';
let angleValue = 135;
let stops = [
    { color: '#7F00FF', pos: 0 },
    { color: '#E100FF', pos: 100 }
];

const stopsContainer = document.getElementById('stops-container');
const addStopBtn = document.getElementById('add-stop');
const typeBtns = document.querySelectorAll('.type-btn');
const linearControls = document.getElementById('linear-controls');
const angleInput = document.getElementById('angle');
const angleVal = document.getElementById('angle-val');
const previewBox = document.getElementById('preview-box');
const cssOutput = document.getElementById('css-output');
const copyBtn = document.getElementById('copy-btn');
const presetsGrid = document.getElementById('presets-grid');

const presets = [
    ['#7F00FF', '#E100FF'],
    ['#00c6ff', '#0072ff'],
    ['#f953c6', '#b91d73'],
    ['#3a1c71', '#d76d77', '#ffaf7b'],
    ['#1d976c', '#93f9b9'],
    ['#eb3349', '#f45c43'],
    ['#4568dc', '#b06ab3'],
    ['#1f4037', '#99f2c8']
];

function createStopHTML(stop, index) {
    const div = document.createElement('div');
    div.className = 'stop-item';
    div.innerHTML = `
        <input type="color" value="${stop.color}" data-index="${index}" class="stop-color">
        <input type="range" min="0" max="100" value="${stop.pos}" data-index="${index}" class="stop-pos">
        <span>${stop.pos}%</span>
        ${stops.length > 2 ? `<button class="remove-stop" data-index="${index}"><ion-icon name="trash-outline"></ion-icon></button>` : ''}
    `;
    return div;
}

function updateStopsList() {
    stopsContainer.innerHTML = '';
    stops.forEach((stop, index) => {
        stopsContainer.appendChild(createStopHTML(stop, index));
    });

    document.querySelectorAll('.stop-color').forEach(input => {
        input.addEventListener('input', (e) => {
            stops[e.target.dataset.index].color = e.target.value;
            updatePreview();
        });
    });

    document.querySelectorAll('.stop-pos').forEach(input => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            stops[e.target.dataset.index].pos = parseInt(val);
            e.target.nextElementSibling.textContent = `${val}%`;
            updatePreview();
        });
    });

    document.querySelectorAll('.remove-stop').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = btn.closest('.remove-stop').dataset.index;
            stops.splice(index, 1);
            updateStopsList();
            updatePreview();
        });
    });
}

function updatePreview() {
    const sortedStops = [...stops].sort((a, b) => a.pos - b.pos);
    const stopStrings = sortedStops.map(s => `${s.color} ${s.pos}%`);
    const stopsText = stopStrings.join(', ');
    
    let fullGradient;
    if (gradientType === 'linear') {
        fullGradient = `linear-gradient(${angleValue}deg, ${stopsText})`;
    } else {
        fullGradient = `radial-gradient(circle, ${stopsText})`;
    }

    previewBox.style.background = fullGradient;
    cssOutput.textContent = `background: ${fullGradient};`;
}

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gradientType = btn.dataset.type;
        linearControls.style.display = gradientType === 'linear' ? 'block' : 'none';
        updatePreview();
    });
});

angleInput.addEventListener('input', (e) => {
    angleValue = e.target.value;
    angleVal.textContent = angleValue;
    updatePreview();
});

addStopBtn.addEventListener('click', () => {
    if (stops.length < 5) {
        stops.push({ color: '#ffffff', pos: 100 });
        updateStopsList();
        updatePreview();
    }
});

function initPresets() {
    presets.forEach(p => {
        const div = document.createElement('div');
        div.className = 'preset-circle';
        div.style.background = `linear-gradient(135deg, ${p.join(', ')})`;
        div.addEventListener('click', () => {
            stops = p.map((color, i) => ({
                color,
                pos: Math.round((i / (p.length - 1)) * 100)
            }));
            updateStopsList();
            updatePreview();
        });
        presetsGrid.appendChild(div);
    });
}

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cssOutput.textContent);
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
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        if (icon) icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });
}

initTheme();
initPresets();
updateStopsList();
updatePreview();
