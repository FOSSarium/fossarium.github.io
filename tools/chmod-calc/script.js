const grid = document.getElementById('grid'), octalEl = document.getElementById('octal'), symEl = document.getElementById('symbolic');
const roles = ['Owner', 'Group', 'Other'], perms = ['Read', 'Write', 'Execute'];
const vals = [[true, true, true], [true, false, true], [true, false, true]];
grid.innerHTML = '<div class="hdr"></div>' + perms.map(p => `<div class="hdr">${p}</div>`).join('');
roles.forEach((r, ri) => {
    grid.innerHTML += `<div class="role">${r}</div>`;
    perms.forEach((p, pi) => {
        const id = `p${ri}${pi}`;
        grid.innerHTML += `<label><input type="checkbox" id="${id}" ${vals[ri][pi] ? 'checked' : ''} data-r="${ri}" data-p="${pi}"> ${p[0]}</label>`;
    });
});
function update() {
    let o = '', s = '';
    for (let r = 0; r < 3; r++) {
        let v = 0;
        if (document.querySelector(`[data-r="${r}"][data-p="0"]`).checked) { v += 4; s += 'r'; } else s += '-';
        if (document.querySelector(`[data-r="${r}"][data-p="1"]`).checked) { v += 2; s += 'w'; } else s += '-';
        if (document.querySelector(`[data-r="${r}"][data-p="2"]`).checked) { v += 1; s += 'x'; } else s += '-';
        o += v;
    }
    octalEl.textContent = o; symEl.textContent = s;
}
grid.addEventListener('change', update); update();


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
