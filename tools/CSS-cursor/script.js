const cursors = [
    'auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait',
    'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop',
    'not-allowed', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize',
    'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize',
    'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize',
    'zoom-in', 'zoom-out'
];

const grid = document.getElementById('grid');

function renderCursors() {
    grid.innerHTML = '';
    cursors.forEach(c => {
        const div = document.createElement('div');
        div.className = 'cursor-box';
        div.style.cursor = c;
        div.innerHTML = `
            <span class="cursor-usage">cursor: ${c}</span>
        `;
        div.onclick = () => copyToClipboard(c, div);
        grid.appendChild(div);
    });
}

function copyToClipboard(text, el) {
    const css = `cursor: ${text};`;
    navigator.clipboard.writeText(css);
    const originalText = el.querySelector('.cursor-name').textContent;
    el.querySelector('.cursor-name').textContent = 'COPIED!';
    el.style.borderColor = 'var(--accent-color)';
    el.style.color = '#3fb950';
    setTimeout(() => {
        el.querySelector('.cursor-name').textContent = originalText;
        el.style.borderColor = '';
        el.style.color = '';
    }, 1000);
}

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
renderCursors();
window.copyToClipboard = copyToClipboard;
