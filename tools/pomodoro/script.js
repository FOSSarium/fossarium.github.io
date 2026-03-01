let timeLeft = 25 * 60, timer = null, isWork = true, sessions = 0;
const display = document.getElementById('timer'), label = document.getElementById('label'), startBtn = document.getElementById('start-btn');
function updateDisplay() { const m = Math.floor(timeLeft / 60).toString().padStart(2, '0'); const s = (timeLeft % 60).toString().padStart(2, '0'); display.textContent = m + ':' + s; }
function tick() { timeLeft--; updateDisplay(); if (timeLeft <= 0) { clearInterval(timer); timer = null; if (isWork) { sessions++; document.getElementById('session-count').textContent = sessions; isWork = false; timeLeft = 5 * 60; label.textContent = 'Break Time'; } else { isWork = true; timeLeft = 25 * 60; label.textContent = 'Work Session'; } updateDisplay(); startBtn.textContent = 'Start'; } }
startBtn.addEventListener('click', () => { if (timer) { clearInterval(timer); timer = null; startBtn.textContent = 'Start'; } else { timer = setInterval(tick, 1000); startBtn.textContent = 'Pause'; } });
document.getElementById('reset-btn').addEventListener('click', () => { clearInterval(timer); timer = null; isWork = true; timeLeft = 25 * 60; label.textContent = 'Work Session'; startBtn.textContent = 'Start'; updateDisplay(); });


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
