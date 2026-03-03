let layers = [
    { h: 5, v: 5, b: 15, s: 0, color: '#000000', opacity: 40, inset: false }
];

const layersList = document.getElementById('layers-list'),
    addLayerBtn = document.getElementById('add-layer'),
    previewBox = document.getElementById('preview-box'),
    previewPane = document.getElementById('preview-pane'),
    cssOutput = document.getElementById('css-output'),
    copyBtn = document.getElementById('copy-btn'),
    boxColorPicker = document.getElementById('box-color'),
    borderRadiusSlider = document.getElementById('border-radius'),
    brVal = document.getElementById('br-val'),
    bgColorPicker = document.getElementById('bg-color-picker');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn'),
    tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-tab`).classList.remove('hidden');
    });
});

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
    return [
        parseInt(hex.substr(0, 2), 16) || 0,
        parseInt(hex.substr(2, 2), 16) || 0,
        parseInt(hex.substr(4, 2), 16) || 0
    ];
}

function createLayerHTML(layer, index) {
    const div = document.createElement('div');
    div.className = 'layer-item';
    div.innerHTML = `
        <div class="layer-header">
            <span class="layer-title">Layer ${index + 1}</span>
            ${layers.length > 1 ? `<button class="remove-layer" data-index="${index}"><ion-icon name="trash-outline"></ion-icon></button>` : ''}
        </div>
        <div class="layer-controls">
            <div class="field-group">
                <label>H-Offset: <span>${layer.h}px</span></label>
                <input type="range" class="layer-input" data-prop="h" data-index="${index}" min="-100" max="100" value="${layer.h}">
            </div>
            <div class="field-group">
                <label>V-Offset: <span>${layer.v}px</span></label>
                <input type="range" class="layer-input" data-prop="v" data-index="${index}" min="-100" max="100" value="${layer.v}">
            </div>
            <div class="field-group">
                <label>Blur: <span>${layer.b}px</span></label>
                <input type="range" class="layer-input" data-prop="b" data-index="${index}" min="0" max="150" value="${layer.b}">
            </div>
            <div class="field-group">
                <label>Spread: <span>${layer.s}px</span></label>
                <input type="range" class="layer-input" data-prop="s" data-index="${index}" min="-100" max="100" value="${layer.s}">
            </div>
            <div class="field-group">
                <label>Color</label>
                <input type="color" class="layer-input" data-prop="color" data-index="${index}" value="${layer.color}">
            </div>
            <div class="field-group">
                <label>Opacity: <span>${layer.opacity}%</span></label>
                <input type="range" class="layer-input" data-prop="opacity" data-index="${index}" min="0" max="100" value="${layer.opacity}">
            </div>
            <div class="field-group full-width">
                <label class="checkbox-container">
                    <input type="checkbox" class="layer-input" data-prop="inset" data-index="${index}" ${layer.inset ? 'checked' : ''}>
                    Inset Shadow
                </label>
            </div>
        </div>
    `;
    return div;
}

function updateLayersList() {
    layersList.innerHTML = '';
    layers.forEach((layer, index) => {
        layersList.appendChild(createLayerHTML(layer, index));
    });

    document.querySelectorAll('.layer-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            const prop = e.target.dataset.prop;
            let val = e.target.value;

            if (prop === 'inset') val = e.target.checked;
            else if (prop === 'color') val = e.target.value;
            else val = parseInt(val);

            layers[index][prop] = val;
            
            // Update the label span immediately
            if (prop !== 'inset' && prop !== 'color') {
                e.target.previousElementSibling.querySelector('span').textContent = `${val}${prop === 'opacity' ? '%' : 'px'}`;
            }
            
            updatePreview();
        });
    });

    document.querySelectorAll('.remove-layer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.closest('.remove-layer').dataset.index);
            layers.splice(index, 1);
            updateLayersList();
            updatePreview();
        });
    });
}

function updatePreview() {
    const shadowStrings = layers.map(l => {
        const [r, g, b] = hexToRgb(l.color);
        const alpha = (l.opacity / 100).toFixed(2);
        return `${l.inset ? 'inset ' : ''}${l.h}px ${l.v}px ${l.b}px ${l.s}px rgba(${r}, ${g}, ${b}, ${alpha})`;
    });

    const fullShadow = shadowStrings.join(', ');
    previewBox.style.boxShadow = fullShadow;
    previewBox.style.backgroundColor = boxColorPicker.value;
    previewBox.style.borderRadius = `${borderRadiusSlider.value}px`;
    previewPane.style.backgroundColor = bgColorPicker.value;
    brVal.textContent = borderRadiusSlider.value;

    cssOutput.textContent = `box-shadow: ${fullShadow};
background-color: ${boxColorPicker.value};
border-radius: ${borderRadiusSlider.value}px;`;
}

addLayerBtn.addEventListener('click', () => {
    layers.push({ h: 5, v: 5, b: 15, s: 0, color: '#000000', opacity: 40, inset: false });
    updateLayersList();
    updatePreview();
});

[boxColorPicker, borderRadiusSlider, bgColorPicker].forEach(el => {
    el.addEventListener('input', updatePreview);
});

// Presets
const presets = {
    soft: [{ h: 0, v: 10, b: 30, s: 0, color: '#000000', opacity: 15, inset: false }],
    hard: [{ h: 6, v: 6, b: 0, s: 0, color: '#000000', opacity: 100, inset: false }],
    neon: [
        { h: 0, v: 0, b: 5, s: 0, color: '#58a6ff', opacity: 100, inset: false },
        { h: 0, v: 0, b: 20, s: 0, color: '#58a6ff', opacity: 60, inset: false },
        { h: 0, v: 0, b: 40, s: 0, color: '#58a6ff', opacity: 30, inset: false }
    ],
    inner: [{ h: 4, v: 4, b: 10, s: 0, color: '#000000', opacity: 50, inset: true }],
    multi: [
        { h: 5, v: 5, b: 0, s: 0, color: '#ff7b72', opacity: 100, inset: false },
        { h: 10, v: 10, b: 0, s: 0, color: '#58a6ff', opacity: 100, inset: false },
        { h: 15, v: 15, b: 0, s: 0, color: '#3fb950', opacity: 100, inset: false }
    ]
};

document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.preset;
        layers = JSON.parse(JSON.stringify(presets[type]));
        updateLayersList();
        updatePreview();
    });
});

// Theme Toggle
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

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cssOutput.textContent);
    const icon = copyBtn.querySelector('ion-icon');
    const originalName = icon.getAttribute('name');
    icon.setAttribute('name', 'checkmark-outline');
    copyBtn.style.color = 'var(--accent-color)';
    setTimeout(() => {
        icon.setAttribute('name', originalName);
        copyBtn.style.color = '';
    }, 1500);
});

initTheme();
updateLayersList();
updatePreview();
