// ===== Config =====
const MODES = {
    work: { label: 'Focus Session', color: '--work-color' },
    short: { label: 'Short Break', color: '--short-color' },
    long: { label: 'Long Break', color: '--long-color' }
};

let config = {
    work: 25, short: 5, long: 15, sessionsUntilLong: 4
};

let currentMode = 'work';
let timeLeft = config.work * 60;
let totalTime = config.work * 60;
let isRunning = false;
let intervalId = null;
let sessionsCompleted = 0;
let totalFocusSeconds = 0;

// ===== DOM =====
const timerDisplay = document.getElementById('timer');
const timerLabel = document.getElementById('label');
const playBtn = document.getElementById('start-btn');
const playIcon = document.getElementById('play-icon');
const ringProgress = document.getElementById('ring-progress');
const sessionDots = document.getElementById('session-dots');
const CIRCUMFERENCE = 2 * Math.PI * 90; // r=90

ringProgress.style.strokeDasharray = CIRCUMFERENCE;

// ===== Timer Display =====
function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Update title
    document.title = `${timerDisplay.textContent} — Pomodoro`;

    // Ring progress
    const progress = 1 - (timeLeft / totalTime);
    ringProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    // Ring color
    const color = getComputedStyle(document.documentElement).getPropertyValue(MODES[currentMode].color).trim();
    ringProgress.style.stroke = color;
}

// ===== Start / Pause =====
function toggleTimer() {
    if (isRunning) {
        pause();
    } else {
        start();
    }
}

function start() {
    isRunning = true;
    playIcon.setAttribute('name', 'pause-outline');
    playBtn.style.background = getComputedStyle(document.documentElement).getPropertyValue(MODES[currentMode].color).trim();

    intervalId = setInterval(() => {
        timeLeft--;
        if (currentMode === 'work') totalFocusSeconds++;
        updateDisplay();
        updateStats();

        if (timeLeft <= 0) {
            clearInterval(intervalId);
            isRunning = false;
            onTimerComplete();
        }
    }, 1000);
}

function pause() {
    isRunning = false;
    clearInterval(intervalId);
    playIcon.setAttribute('name', 'play-outline');
}

function reset() {
    pause();
    timeLeft = config[currentMode] * 60;
    totalTime = timeLeft;
    updateDisplay();
}

// ===== Timer Complete =====
function onTimerComplete() {
    // Play notification sound
    playNotificationSound();

    if (currentMode === 'work') {
        sessionsCompleted++;
        updateSessionDots();
        updateStats();

        if (sessionsCompleted % config.sessionsUntilLong === 0) {
            showModal('Focus Session Complete!', 'Time for a long break. You earned it!');
            switchMode('long');
        } else {
            showModal('Focus Session Complete!', 'Take a short break.');
            switchMode('short');
        }
    } else {
        showModal('Break Over!', 'Ready to focus again?');
        switchMode('work');
    }
}

function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 200, 400].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime + delay / 1000);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay / 1000 + 0.15);
            osc.start(ctx.currentTime + delay / 1000);
            osc.stop(ctx.currentTime + delay / 1000 + 0.15);
        });
    } catch {}
}

// ===== Mode Switching =====
function switchMode(mode) {
    currentMode = mode;
    timeLeft = config[mode] * 60;
    totalTime = timeLeft;

    // Update UI
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    timerLabel.textContent = MODES[mode].label;

    const color = getComputedStyle(document.documentElement).getPropertyValue(MODES[mode].color).trim();
    playBtn.style.background = color;
    playBtn.style.boxShadow = `0 6px 20px ${color}40`;

    playIcon.setAttribute('name', 'play-outline');
    updateDisplay();
}

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) pause();
        switchMode(btn.dataset.mode);
    });
});

// ===== Session Dots =====
function updateSessionDots() {
    const count = config.sessionsUntilLong;
    sessionDots.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i < (sessionsCompleted % count) ? ' filled' : '');
        sessionDots.appendChild(dot);
    }
}

// ===== Stats =====
function updateStats() {
    document.getElementById('session-count').textContent = sessionsCompleted;
    const mins = Math.floor(totalFocusSeconds / 60);
    document.getElementById('total-focus').textContent = mins < 60 ? mins + 'm' : Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
}

// ===== Modal =====
function showModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-overlay').classList.remove('hidden');
}

document.getElementById('modal-ok').addEventListener('click', () => {
    document.getElementById('modal-overlay').classList.add('hidden');
});

// ===== Controls =====
playBtn.addEventListener('click', toggleTimer);
document.getElementById('reset-btn').addEventListener('click', reset);

// ===== Settings =====
document.getElementById('settings-toggle').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.toggle('hidden');
});

['work-min', 'short-min', 'long-min', 'sessions-until'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        config.work = parseInt(document.getElementById('work-min').value) || 25;
        config.short = parseInt(document.getElementById('short-min').value) || 5;
        config.long = parseInt(document.getElementById('long-min').value) || 15;
        config.sessionsUntilLong = parseInt(document.getElementById('sessions-until').value) || 4;

        localStorage.setItem('fossarium-pomo-config', JSON.stringify(config));
        updateSessionDots();
        if (!isRunning) {
            timeLeft = config[currentMode] * 60;
            totalTime = timeLeft;
            updateDisplay();
        }
    });
});

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');
    function updateIcon(theme) { icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline'); }
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        updateIcon(isLight ? 'light' : 'dark');
    });
}

// ===== Init =====
initTheme();

// Load saved config
const savedConfig = localStorage.getItem('fossarium-pomo-config');
if (savedConfig) {
    try {
        const parsed = JSON.parse(savedConfig);
        Object.assign(config, parsed);
        document.getElementById('work-min').value = config.work;
        document.getElementById('short-min').value = config.short;
        document.getElementById('long-min').value = config.long;
        document.getElementById('sessions-until').value = config.sessionsUntilLong;
    } catch {}
}

switchMode('work');
updateSessionDots();
updateStats();
