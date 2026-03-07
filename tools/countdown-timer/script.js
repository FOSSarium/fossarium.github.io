let remaining = 0;
let timer = null;
let running = false;
let audioCtx = null;
let soundInterval = null;

const display = document.getElementById("display");
const hrsInput = document.getElementById("hrs");
const minsInput = document.getElementById("mins");
const secsInput = document.getElementById("secs");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const modalOverlay = document.getElementById("modal-overlay");
const modalOk = document.getElementById("modal-ok");
const modalIcon = document.querySelector(".modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");

function showModal(icon, title, message) {
    if (icon) modalIcon.setAttribute("name", icon);
    if (title) modalTitle.textContent = title;
    if (message) modalMessage.textContent = message;
    modalOverlay.classList.remove("hidden");
}

function hideModal() {
    modalOverlay.classList.add("hidden");
}

function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return [h, m, ss].map(v => String(v).padStart(2, "0")).join(":");
}

function playBeep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

function startAlert() {
    playBeep();
    soundInterval = setInterval(playBeep, 1500);
    showModal("alarm-outline", "Time's Up!", "The countdown has finished. Your timer has reached zero.");
}

function stopAlert() {
    if (soundInterval) {
        clearInterval(soundInterval);
        soundInterval = null;
    }
    hideModal();
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
            startAlert();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    stopAlert();
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
modalOk.addEventListener("click", stopAlert);
initTheme();
