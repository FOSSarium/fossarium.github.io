const colsInput = document.getElementById('cols');
const rowsInput = document.getElementById('rows');
const colGapInput = document.getElementById('col-gap');
const rowGapInput = document.getElementById('row-gap');
const container = document.getElementById('container');
const codeEl = document.getElementById('code');
const copyBtn = document.getElementById('copy-btn');

function update() {
    const cols = colsInput.value.trim() || '1fr 1fr 1fr';
    const rows = rowsInput.value.trim() || '1fr 1fr';
    const colGap = colGapInput.value || 0;
    const rowGap = rowGapInput.value || 0;

    try {
        container.style.gridTemplateColumns = cols;
        container.style.gridTemplateRows = rows;
        container.style.columnGap = colGap + 'px';
        container.style.rowGap = rowGap + 'px';

        // Count items based on gaps/spaces
        const colCount = cols.split(/\s+/).length;
        const rowCount = rows.split(/\s+/).length;
        const total = colCount * rowCount;

        if (total > 0 && total < 200) {
            container.innerHTML = '';
            for (let i = 1; i <= total; i++) {
                const div = document.createElement('div');
                div.className = 'grid-cell';
                div.textContent = i;
                container.appendChild(div);
            }
        }

        codeEl.textContent = `.grid-container {
  display: grid;
  grid-template-columns: ${cols};
  grid-template-rows: ${rows};
  column-gap: ${colGap}px;
  row-gap: ${rowGap}px;
}`;
    } catch (e) {
        // Silently fail for invalid CSS grid syntax during typing
    }
}

[colsInput, rowsInput, colGapInput, rowGapInput].forEach(el => {
    el.addEventListener('input', update);
});

copyBtn.addEventListener('click', () => {
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
