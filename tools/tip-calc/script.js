let tipPct = 15;
document.querySelectorAll('.tip-btn').forEach(b => { b.addEventListener('click', () => { document.querySelectorAll('.tip-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); tipPct = parseInt(b.dataset.t); calc(); }); });
function calc() { const bill = parseFloat(document.getElementById('bill').value) || 0; const split = parseInt(document.getElementById('split').value) || 1; const tip = bill * tipPct / 100; const total = bill + tip; const perPerson = total / split; const fmt = v => '$' + v.toFixed(2); document.getElementById('results').innerHTML = [['Tip Amount', fmt(tip)], ['Total', fmt(total)], ['Per Person', fmt(perPerson)]].map(([l, v]) => `<div class="res-row"><span class="res-label">${l}</span><span class="res-val">${v}</span></div>`).join(''); }
document.getElementById('bill').addEventListener('input', calc); document.getElementById('split').addEventListener('input', calc); calc();


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
