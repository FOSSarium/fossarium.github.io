const sentences = ["The quick brown fox jumps over the lazy dog.", "Pack my box with five dozen liquor jugs.", "How vexingly quick daft zebras jump.", "Sphinx of black quartz judge my vow.", "Two driven jocks help fax my big quiz."];
const sample = document.getElementById('sample'), input = document.getElementById('input'), startBtn = document.getElementById('start-btn');
let text = '', timer = null, timeLeft = 60, started = false;
function pickText() { text = sentences.sort(() => Math.random() - 0.5).join(' '); sample.textContent = text; }
function start() { pickText(); input.value = ''; input.disabled = false; input.focus(); timeLeft = 60; started = true; startBtn.textContent = 'Restart'; document.getElementById('wpm').textContent = '0'; document.getElementById('accuracy').textContent = '100'; document.getElementById('time').textContent = '60'; if (timer) clearInterval(timer); timer = setInterval(() => { timeLeft--; document.getElementById('time').textContent = timeLeft; if (timeLeft <= 0) { clearInterval(timer); input.disabled = true; started = false; startBtn.textContent = 'Start Test'; } }, 1000); }
startBtn.addEventListener('click', start);
input.addEventListener('input', () => { if (!started) return; const typed = input.value; let html = '', correct = 0; for (let i = 0; i < text.length; i++) { if (i < typed.length) { if (typed[i] === text[i]) { html += `<span class="correct">${text[i]}</span>`; correct++; } else html += `<span class="wrong">${text[i]}</span>`; } else if (i === typed.length) html += `<span class="current">${text[i]}</span>`; else html += text[i]; } sample.innerHTML = html; const words = typed.trim().split(/\s+/).filter(w => w).length; const elapsed = 60 - timeLeft || 1; document.getElementById('wpm').textContent = Math.round(words / (elapsed / 60)); document.getElementById('accuracy').textContent = typed.length ? Math.round(correct / typed.length * 100) : 100; });
pickText();


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
