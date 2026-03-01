const target = document.getElementById("target");
const result = document.getElementById("result");

// Set default target to 1 month from now
const d = new Date();
d.setMonth(d.getMonth() + 1);
target.value = d.toISOString().slice(0, 16);

function update() {
    const t = new Date(target.value) - new Date();
    
    if (t <= 0) {
        result.innerHTML = '<div class="passed-message">🎉 The target date has passed!</div>';
        return;
    }

    const days = Math.floor(t / 86400000);
    const hrs = Math.floor((t % 86400000) / 3600000);
    const mins = Math.floor((t % 3600000) / 60000);
    const secs = Math.floor((t % 60000) / 1000);

    result.innerHTML = `
        <div class="time-block">
            <span class="value">${String(days).padStart(2, '0')}</span>
            <span class="label">Days</span>
        </div>
        <div class="time-block">
            <span class="value">${String(hrs).padStart(2, '0')}</span>
            <span class="label">Hours</span>
        </div>
        <div class="time-block">
            <span class="value">${String(mins).padStart(2, '0')}</span>
            <span class="label">Mins</span>
        </div>
        <div class="time-block">
            <span class="value">${String(secs).padStart(2, '0')}</span>
            <span class="label">Secs</span>
        </div>
    `;
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

target.addEventListener("input", update);
setInterval(update, 1000);
initTheme();
update();
