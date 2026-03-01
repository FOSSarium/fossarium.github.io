const ranges = {
    arrows: [8592, 8703],
    math: [8704, 8959],
    currency: [36, 36, 162, 165, 8352, 8399],
    box: [9472, 9599],
    emoji: [9728, 9983]
};

const grid = document.getElementById("grid");
const cat = document.getElementById("category");

function render() {
    const key = cat.value;
    let chars = [];
    const r = ranges[key];
    if (r.length === 2) {
        for (let i = r[0]; i <= r[1]; i++) chars.push(i);
    } else {
        for (let i = 0; i < r.length; i += 2) {
            const s = r[i], e = r[i + 1] || r[i];
            for (let j = s; j <= e; j++) chars.push(j);
        }
    }
    grid.innerHTML = chars.slice(0, 200).map(c => `
        <div class="char-cell" onclick="copyChar('${String.fromCodePoint(c)}', this)" title="U+${c.toString(16).toUpperCase().padStart(4, 0)}">
            ${String.fromCodePoint(c)}
            <div class="code">U+${c.toString(16).toUpperCase().padStart(4, "0")}</div>
        </div>
    `).join("");
}

function copyChar(char, el) {
    navigator.clipboard.writeText(char);
    const originalBg = el.style.background;
    el.style.background = 'rgba(88, 166, 255, 0.2)';
    el.style.borderColor = 'var(--accent-color)';
    setTimeout(() => {
        el.style.background = originalBg;
        el.style.borderColor = '';
    }, 500);
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

cat.addEventListener("change", render);
initTheme();
render();
window.copyChar = copyChar; // Make it global for onclick
