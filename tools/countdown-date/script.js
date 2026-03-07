const target = document.getElementById("target");
const result = document.getElementById("result");
const startBtn = document.getElementById("start-btn");
const modalOverlay = document.getElementById("modal-overlay");
const modalOk = document.getElementById("modal-ok");
const modalIcon = document.querySelector(".modal-icon");
const modalTitle = document.querySelector(".modal-card h2");
const modalMessage = document.querySelector(".modal-card p");

function showModal(icon, title, message) {
    modalIcon.setAttribute("name", icon);
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOverlay.classList.remove("hidden");
}

function hideModal() {
    modalOverlay.classList.add("hidden");
}

// Set default target to 1 month from now
const d = new Date();
d.setMonth(d.getMonth() + 1);
target.value = d.toISOString().slice(0, 16);

let timerInterval = null;
let hasPlayedAlert = false;
let audioCtx = null;
let soundInterval = null;

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
    showModal("trophy-outline", "Target Reached!", "The countdown has finished. The moment you were waiting for is here!");
}

function stopAlert() {
    if (soundInterval) {
        clearInterval(soundInterval);
        soundInterval = null;
    }
    hideModal();
}

function update() {
    const now = new Date();
    const t = new Date(target.value) - now;
    
    if (t <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        result.innerHTML = '<div class="passed-message">🎉 The target date has passed!</div>';
        if (!hasPlayedAlert) {
            startAlert();
            hasPlayedAlert = true;
        }
        startBtn.innerHTML = '<ion-icon name="play-outline"></ion-icon> Start Countdown';
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

function startCountdown() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.innerHTML = '<ion-icon name="play-outline"></ion-icon> Start Countdown';
        return;
    }

    const targetDate = new Date(target.value);
    if (isNaN(targetDate) || targetDate <= new Date()) {
        showModal("alert-circle-outline", "Invalid Date", "Please select a valid future date and time.");
        return;
    }

    hasPlayedAlert = false;
    stopAlert();
    update();
    timerInterval = setInterval(update, 1000);
    startBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon> Stop Countdown';
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

startBtn.addEventListener("click", startCountdown);
modalOk.addEventListener("click", stopAlert);
initTheme();
