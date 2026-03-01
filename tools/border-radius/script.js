const ids = ["tl", "tr", "br", "bl"];
const box = document.getElementById("box");
const code = document.getElementById("code");
const copyBtn = document.getElementById("copy-btn");

function update() {
    const v = ids.map(id => {
        const val = document.getElementById(id).value;
        document.getElementById("v-" + id).textContent = val;
        return val + "px";
    });
    const borderRadius = v.join(" ");
    box.style.borderRadius = borderRadius;
    code.textContent = `border-radius: ${borderRadius};`;
}

ids.forEach(id => document.getElementById(id).addEventListener("input", update));

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(code.textContent);
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
    copyBtn.style.color = 'var(--accent-color)';
    setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.style.color = '';
    }, 2000);
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
update();
