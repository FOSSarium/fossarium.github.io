document.getElementById('fetch-btn').addEventListener('click', async () => {
    const res = document.getElementById('results');
    res.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Loading...</p>';
    try {
        const r = await fetch('https://ipapi.co/json/'); const d = await r.json();
        res.innerHTML = [['IP', d.ip], ['City', d.city], ['Region', d.region], ['Country', d.country_name], ['ISP', d.org], ['Timezone', d.timezone], ['Latitude', d.latitude], ['Longitude', d.longitude]].map(([l, v]) => `<div class="info-row"><span class="info-label">${l}</span><span class="info-val">${v || 'N/A'}</span></div>`).join('');
    } catch (e) { res.innerHTML = '<p style="text-align:center;color:#ff4757">Failed to fetch IP info. Try again.</p>'; }
});


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
