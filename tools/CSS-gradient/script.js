const type = document.getElementById('type'), angle = document.getElementById('angle'), c1 = document.getElementById('c1'), c2 = document.getElementById('c2');
const preview = document.getElementById('preview'), output = document.getElementById('css-output'), av = document.getElementById('angle-val');

function update() {
    av.textContent = angle.value;
    let css;
    if (type.value === 'linear') {
        css = `background: linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value});`;
        preview.style.background = `linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value})`;
    } else {
        css = `background: radial-gradient(circle, ${c1.value}, ${c2.value});`;
        preview.style.background = `radial-gradient(circle, ${c1.value}, ${c2.value})`;
    }
    output.textContent = css;
}

[type, angle, c1, c2].forEach(el => el.addEventListener('input', update));
document.getElementById('copy-btn').addEventListener('click', () => navigator.clipboard.writeText(output.textContent));
update();


function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('ion-icon');

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
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
