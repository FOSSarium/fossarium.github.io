const grid = document.getElementById('grid'),
    octalEl = document.getElementById('octal'),
    symEl = document.getElementById('symbolic');

const roles = ['Owner', 'Group', 'Other'],
    perms = ['Read', 'Write', 'Execute'];
const vals = [[true, true, true], [true, false, true], [true, false, true]];

function renderGrid() {
    let html = '<div class="hdr"></div>' + perms.map(p => `<div class="hdr">${p}</div>`).join('');
    roles.forEach((r, ri) => {
        html += `<div class="role">${r}</div>`;
        perms.forEach((p, pi) => {
            const id = `p${ri}${pi}`;
            html += `
                <label>
                    <input type="checkbox" id="${id}" ${vals[ri][pi] ? 'checked' : ''} data-r="${ri}" data-p="${pi}">
                    <ion-icon name="${p === 'Read' ? 'eye' : p === 'Write' ? 'create' : 'flash'}-outline"></ion-icon>
                </label>`;
        });
    });
    grid.innerHTML = html;
}

function update() {
    let o = '', s = '';
    for (let r = 0; r < 3; r++) {
        let v = 0;
        const rPerms = ['r', 'w', 'x'];
        for (let p = 0; p < 3; p++) {
            if (document.querySelector(`[data-r="${r}"][data-p="${p}"]`).checked) {
                v += Math.pow(2, 2 - p);
                s += rPerms[p];
            } else {
                s += '-';
            }
        }
        o += v;
    }
    octalEl.textContent = o;
    symEl.textContent = s;
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

renderGrid();
grid.addEventListener('change', update);
initTheme();
update();
