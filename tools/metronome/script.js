// ===== State =====
let bpm = 120;
let beatsPerMeasure = 4;
let isPlaying = false;
let intervalId = null;
let currentBeat = 0;
let audioCtx = null;

// ===== DOM =====
const bpmVal = document.getElementById('bpm-val');
const bpmSlider = document.getElementById('bpm-slider');
const bpmRing = document.getElementById('bpm-ring');
const tempoName = document.getElementById('tempo-name');
const startBtn = document.getElementById('start-btn');
const playIcon = document.getElementById('play-icon');
const tapBtn = document.getElementById('tap-btn');
const beatIndicators = document.getElementById('beat-indicators');

// ===== Tempo Names =====
function getTempoName(bpm) {
    if (bpm < 40) return 'Grave';
    if (bpm < 55) return 'Largo';
    if (bpm < 66) return 'Larghetto';
    if (bpm < 76) return 'Adagio';
    if (bpm < 92) return 'Andante';
    if (bpm < 108) return 'Moderato';
    if (bpm < 120) return 'Allegretto';
    if (bpm < 156) return 'Allegro';
    if (bpm < 176) return 'Vivace';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
}

// ===== Update BPM =====
function setBpm(newBpm) {
    bpm = Math.max(30, Math.min(300, newBpm));
    bpmVal.textContent = bpm;
    bpmSlider.value = bpm;
    tempoName.textContent = getTempoName(bpm);
    localStorage.setItem('fossarium-metronome-bpm', bpm);

    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
}

// ===== Audio =====
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playClick(isAccent) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.value = isAccent ? 1000 : 700;
    osc.type = 'sine';

    gain.gain.setValueAtTime(isAccent ? 0.5 : 0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
}

// ===== Metronome =====
function startMetronome() {
    isPlaying = true;
    currentBeat = 0;
    startBtn.classList.add('active');
    playIcon.setAttribute('name', 'stop-outline');
    tick();
    intervalId = setInterval(tick, (60 / bpm) * 1000);
}

function stopMetronome() {
    isPlaying = false;
    clearInterval(intervalId);
    intervalId = null;
    startBtn.classList.remove('active');
    playIcon.setAttribute('name', 'play-outline');
    clearBeatDots();
    bpmRing.classList.remove('pulse');
}

function tick() {
    const isAccent = currentBeat === 0;
    playClick(isAccent);

    // Visual pulse
    bpmRing.classList.add('pulse');
    setTimeout(() => bpmRing.classList.remove('pulse'), 100);

    // Update beat dots
    updateBeatDots(currentBeat, isAccent);

    currentBeat = (currentBeat + 1) % beatsPerMeasure;
}

// ===== Beat Indicators =====
function renderBeatDots() {
    beatIndicators.innerHTML = '';
    for (let i = 0; i < beatsPerMeasure; i++) {
        const dot = document.createElement('div');
        dot.className = 'beat-dot';
        beatIndicators.appendChild(dot);
    }
}

function updateBeatDots(beat, isAccent) {
    const dots = beatIndicators.querySelectorAll('.beat-dot');
    dots.forEach(d => d.classList.remove('active', 'accent'));
    if (dots[beat]) {
        dots[beat].classList.add(isAccent ? 'accent' : 'active');
    }
}

function clearBeatDots() {
    const dots = beatIndicators.querySelectorAll('.beat-dot');
    dots.forEach(d => d.classList.remove('active', 'accent'));
}

// ===== Event Listeners =====
bpmSlider.addEventListener('input', () => setBpm(parseInt(bpmSlider.value)));

startBtn.addEventListener('click', () => {
    initAudio();
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
});

// Fine controls
document.getElementById('bpm-down-10').addEventListener('click', () => setBpm(bpm - 10));
document.getElementById('bpm-down-1').addEventListener('click', () => setBpm(bpm - 1));
document.getElementById('bpm-up-1').addEventListener('click', () => setBpm(bpm + 1));
document.getElementById('bpm-up-10').addEventListener('click', () => setBpm(bpm + 10));

// Beat selector
document.querySelectorAll('.beat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.beat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        beatsPerMeasure = parseInt(btn.dataset.beats);
        currentBeat = 0;
        renderBeatDots();
        localStorage.setItem('fossarium-metronome-beats', beatsPerMeasure);

        if (isPlaying) {
            stopMetronome();
            startMetronome();
        }
    });
});

// ===== Tap Tempo =====
let tapTimes = [];
tapBtn.addEventListener('click', () => {
    initAudio();
    const now = Date.now();
    tapTimes.push(now);

    // Keep only last 5 taps
    if (tapTimes.length > 5) tapTimes.shift();

    // Need at least 2 taps
    if (tapTimes.length >= 2) {
        // Remove old taps (> 3 seconds)
        const recent = tapTimes.filter(t => now - t < 3000);
        if (recent.length >= 2) {
            tapTimes = recent;
            const intervals = [];
            for (let i = 1; i < recent.length; i++) {
                intervals.push(recent[i] - recent[i - 1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const tappedBpm = Math.round(60000 / avgInterval);
            setBpm(tappedBpm);
        }
    }

    playClick(true);
});

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');

    function updateIcon(theme) {
        icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
    }

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('fossarium-theme', newTheme);
        updateIcon(newTheme);
    });
}

// ===== Init =====
initTheme();

// Load saved state
const savedBpm = localStorage.getItem('fossarium-metronome-bpm');
if (savedBpm) bpm = parseInt(savedBpm);

const savedBeats = localStorage.getItem('fossarium-metronome-beats');
if (savedBeats) {
    beatsPerMeasure = parseInt(savedBeats);
    document.querySelectorAll('.beat-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.beats) === beatsPerMeasure);
    });
}

bpmVal.textContent = bpm;
bpmSlider.value = bpm;
tempoName.textContent = getTempoName(bpm);
renderBeatDots();
