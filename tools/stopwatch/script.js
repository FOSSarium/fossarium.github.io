let startTime = 0, elapsed = 0, running = false, rafId = null, laps = [], lastLapTime = 0;
const h = document.getElementById('hours'), m = document.getElementById('minutes'), sec = document.getElementById('seconds'), ms = document.getElementById('ms');
const playBtn = document.getElementById('start-btn'), playIcon = document.getElementById('play-icon');
const lapBtn = document.getElementById('lap-btn'), resetBtn = document.getElementById('reset-btn');
const lapsContainer = document.getElementById('laps-container'), lapsList = document.getElementById('laps-list');

function fmt(t) {
    const hrs = Math.floor(t / 3600000), mins = Math.floor((t % 3600000) / 60000);
    const secs = Math.floor((t % 60000) / 1000), mils = Math.floor((t % 1000) / 10);
    return { hrs: String(hrs).padStart(2, '0'), mins: String(mins).padStart(2, '0'), secs: String(secs).padStart(2, '0'), ms: '.' + String(mils).padStart(2, '0') };
}
function fmtStr(t) { const f = fmt(t); return `${f.hrs}:${f.mins}:${f.secs}${f.ms}`; }
function updateDisplay() {
    const now = performance.now();
    const total = elapsed + (running ? now - startTime : 0);
    const f = fmt(total);
    h.textContent = f.hrs; m.textContent = f.mins; sec.textContent = f.secs; ms.textContent = f.ms;
    if (running) rafId = requestAnimationFrame(updateDisplay);
}
function start() {
    running = true; startTime = performance.now();
    playIcon.setAttribute('name', 'pause-outline');
    playBtn.classList.add('running');
    lapBtn.disabled = false;
    rafId = requestAnimationFrame(updateDisplay);
}
function pause() {
    running = false; elapsed += performance.now() - startTime;
    cancelAnimationFrame(rafId);
    playIcon.setAttribute('name', 'play-outline');
    playBtn.classList.remove('running');
}
function reset() {
    pause(); elapsed = 0; lastLapTime = 0; laps = [];
    updateDisplay(); lapBtn.disabled = true;
    lapsContainer.classList.add('hidden'); lapsList.innerHTML = '';
}
function addLap() {
    const total = elapsed + (running ? performance.now() - startTime : 0);
    const lapTime = total - lastLapTime;
    lastLapTime = total;
    laps.unshift({ num: laps.length + 1, lap: lapTime, total });
    renderLaps();
    lapsContainer.classList.remove('hidden');
}
function renderLaps() {
    const times = laps.map(l => l.lap);
    const best = Math.min(...times), worst = Math.max(...times);
    lapsList.innerHTML = laps.map(l => {
        let cls = 'lap-item';
        if (laps.length > 1) { if (l.lap === best) cls += ' best'; else if (l.lap === worst) cls += ' worst'; }
        return `<div class="${cls}"><span class="lap-num">#${l.num}</span><span class="lap-time">${fmtStr(l.lap)}</span><span class="lap-total">${fmtStr(l.total)}</span></div>`;
    }).join('');
}
playBtn.addEventListener('click', () => running ? pause() : start());
lapBtn.addEventListener('click', addLap);
resetBtn.addEventListener('click', reset);
// Theme
(function() {
    const b = document.getElementById('theme-toggle'), icon = b.querySelector('ion-icon');
    const u = t => icon.setAttribute('name', t === 'light' ? 'moon-outline' : 'sunny-outline');
    const sv = localStorage.getItem('fossarium-theme');
    if (sv) u(sv); else if (matchMedia('(prefers-color-scheme:light)').matches) u('light');
    b.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const l = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', l ? 'light' : 'dark'); u(l ? 'light' : 'dark');
    });
})();
