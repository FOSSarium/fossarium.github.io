const hoursElem = document.getElementById('hours');
const minutesElem = document.getElementById('minutes');
const secondsElem = document.getElementById('seconds');
const millisecondsElem = document.getElementById('milliseconds');

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnLap = document.getElementById('btn-lap');
const btnReset = document.getElementById('btn-reset');
const lapsList = document.getElementById('laps-list');

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 0;
let lastLapTime = 0;

function formatTime(timeInMs) {
    const defaultDate = new Date(timeInMs);

    let h = Math.floor(timeInMs / 3600000);
    let m = defaultDate.getUTCMinutes();
    let s = defaultDate.getUTCSeconds();
    let ms = Math.floor(defaultDate.getUTCMilliseconds() / 10); // get 2 digits

    return {
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
        ms: String(ms).padStart(2, '0')
    };
}

function updateDisplay(time) {
    const formatted = formatTime(time);
    hoursElem.textContent = formatted.h;
    minutesElem.textContent = formatted.m;
    secondsElem.textContent = formatted.s;
    millisecondsElem.textContent = `.${formatted.ms}`;
}

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay(elapsedTime);
    }, 10);

    isRunning = true;
    btnStart.classList.add('hidden');
    btnPause.classList.remove('hidden');
    btnLap.disabled = false;
}

function pause() {
    clearInterval(timerInterval);
    isRunning = false;
    btnPause.classList.add('hidden');
    btnStart.classList.remove('hidden');
    btnLap.disabled = true;
}

function reset() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    lastLapTime = 0;
    lapCount = 0;

    updateDisplay(0);

    btnPause.classList.add('hidden');
    btnStart.classList.remove('hidden');
    btnLap.disabled = true;

    lapsList.innerHTML = '';
}

function lap() {
    if (!isRunning) return;

    lapCount++;
    const currentLapTimeMs = elapsedTime - lastLapTime;
    lastLapTime = elapsedTime;

    const lapFormatted = formatTime(currentLapTimeMs);
    const totalFormatted = formatTime(elapsedTime);

    const lapTimeStr = `${lapFormatted.h !== "00" ? lapFormatted.h + ':' : ''}${lapFormatted.m}:${lapFormatted.s}.${lapFormatted.ms}`;
    const totalTimeStr = `${totalFormatted.h !== "00" ? totalFormatted.h + ':' : ''}${totalFormatted.m}:${totalFormatted.s}.${totalFormatted.ms}`;

    const li = document.createElement('li');
    li.className = 'lap-item';
    li.innerHTML = `
        <span class="lap-number">${String(lapCount).padStart(2, '0')}</span>
        <span class="lap-time">${lapTimeStr}</span>
        <span class="lap-total">${totalTimeStr}</span>
    `;

    lapsList.prepend(li); // add to top
}

btnStart.addEventListener('click', start);
btnPause.addEventListener('click', pause);
btnReset.addEventListener('click', reset);
btnLap.addEventListener('click', lap);

// Initial display
updateDisplay(0);
