let unit = 'metric';
document.querySelectorAll('.tab').forEach(t => { t.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(x => x.classList.remove('active')); t.classList.add('active'); unit = t.dataset.u; document.getElementById('metric-fields').style.display = unit === 'metric' ? '' : 'none'; document.getElementById('imperial-fields').style.display = unit === 'imperial' ? '' : 'none'; calc(); }); });
function calc() {
    let bmi; if (unit === 'metric') { const h = parseFloat(document.getElementById('cm').value) / 100; const w = parseFloat(document.getElementById('kg').value); bmi = w / (h * h); } else { const h = parseFloat(document.getElementById('in').value); const w = parseFloat(document.getElementById('lbs').value); bmi = (w * 703) / (h * h); }
    if (isNaN(bmi) || !isFinite(bmi)) { document.getElementById('result').textContent = '—'; document.getElementById('category').textContent = ''; return; }
    document.getElementById('result').textContent = bmi.toFixed(1); const cat = bmi < 18.5 ? ['Underweight', '#ffa502'] : bmi < 25 ? ['Normal', '#2ed573'] : bmi < 30 ? ['Overweight', '#ff6348'] : ['Obese', '#ff4757']; document.getElementById('category').textContent = cat[0]; document.getElementById('category').style.color = cat[1];
}
document.querySelectorAll('input').forEach(i => i.addEventListener('input', calc)); calc();


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
