let remaining = 0;
let timer = null;
let running = false;

const display = document.getElementById("display");
const hrsInput = document.getElementById("hrs");
const minsInput = document.getElementById("mins");
const secsInput = document.getElementById("secs");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return [h, m, ss].map(v => String(v).padStart(2, "0")).join(":");
}

function startTimer() {
    if (running) {
        clearInterval(timer);
        running = false;
        startBtn.innerHTML = '<ion-icon name="play-outline"></ion-icon> Resume';
        return;
    }

    if (remaining <= 0) {
        const h = parseInt(hrsInput.value) || 0;
        const m = parseInt(minsInput.value) || 0;
        const s = parseInt(secsInput.value) || 0;
        remaining = h * 3600 + m * 60 + s;
    }

    if (remaining <= 0) return;

    running = true;
    startBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon> Pause';
    
    timer = setInterval(() => {
        remaining--;
        display.textContent = formatTime(remaining);
        
        if (remaining <= 0) {
            clearInterval(timer);
            running = false;
            display.textContent = "00:00:00";
            startBtn.innerHTML = '<ion-icon name="play-outline"></ion-icon> Start';
            alert("Time's up!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    remaining = 0;
    display.textContent = "00:00:00";
    startBtn.innerHTML = '<ion-icon name="play-outline"></ion-icon> Start';
    hrsInput.value = "";
    minsInput.value = "";
    secsInput.value = "";
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

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
initTheme();
