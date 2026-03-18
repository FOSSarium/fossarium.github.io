(() => {
    const setupPhase = document.getElementById('setup-phase');
    const clockPhase = document.getElementById('clock-phase');
    const clock1El = document.getElementById('clock-1');
    const clock2El = document.getElementById('clock-2');
    const time1El = document.getElementById('time-1');
    const time2El = document.getElementById('time-2');
    const moves1El = document.getElementById('moves-1');
    const moves2El = document.getElementById('moves-2');
    const pauseBtn = document.getElementById('pause-btn');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    let timeBase = 300, increment = 0;
    let time1, time2, moves1, moves2, activePlayer, interval, paused, gameOver;

    function formatTime(ms) {
        const totalSec = Math.max(0, Math.ceil(ms / 1000));
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        time1El.textContent = formatTime(time1);
        time2El.textContent = formatTime(time2);
        moves1El.textContent = moves1;
        moves2El.textContent = moves2;
        clock1El.className = 'clock-area' + (activePlayer === 1 && !paused ? ' active' : '') + (time1 < 30000 && activePlayer === 1 ? ' danger' : '');
        clock2El.className = 'clock-area' + (activePlayer === 2 && !paused ? ' active' : '') + (time2 < 30000 && activePlayer === 2 ? ' danger' : '');
    }

    function startClock() {
        const minsInput = document.getElementById('custom-mins');
        const incInput = document.getElementById('custom-inc');
        timeBase = parseInt(minsInput.value) * 60 || 300;
        increment = parseInt(incInput.value) || 0;

        time1 = time2 = timeBase * 1000;
        moves1 = moves2 = 0;
        activePlayer = 1; paused = false; gameOver = false;
        setupPhase.classList.add('hidden');
        clockPhase.classList.remove('hidden');
        gameoverOverlay.classList.add('hidden');
        pauseBtn.textContent = '⏸';
        updateDisplay();
        startTimer();
    }

    function startTimer() {
        clearInterval(interval);
        const tick = 100;
        interval = setInterval(() => {
            if (paused || gameOver) return;
            if (activePlayer === 1) time1 -= tick;
            else time2 -= tick;

            if (time1 <= 0) { time1 = 0; endGame(2); }
            if (time2 <= 0) { time2 = 0; endGame(1); }
            updateDisplay();
        }, tick);
    }

    function switchPlayer() {
        if (paused || gameOver) return;
        if (activePlayer === 1) {
            moves1++;
            time1 += increment * 1000;
            activePlayer = 2;
        } else {
            moves2++;
            time2 += increment * 1000;
            activePlayer = 1;
        }
        updateDisplay();
    }

    function endGame(winner) {
        gameOver = true;
        clearInterval(interval);
        document.getElementById('go-title').textContent = "Time's Up!";
        document.getElementById('go-msg').textContent = `Player ${winner} wins on time!`;
        gameoverOverlay.classList.remove('hidden');
    }

    function resetClock() {
        clearInterval(interval); gameOver = true;
        clockPhase.classList.add('hidden');
        setupPhase.classList.remove('hidden');
    }

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mins = parseInt(btn.dataset.time) / 60;
            const inc = parseInt(btn.dataset.inc);
            document.getElementById('custom-mins').value = mins;
            document.getElementById('custom-inc').value = inc;
        });
    });

    // Clock clicks
    clock1El.addEventListener('click', () => { if (activePlayer === 1) switchPlayer(); });
    clock2El.addEventListener('click', () => { if (activePlayer === 2) switchPlayer(); });

    // Space bar to switch
    document.addEventListener('keydown', e => {
        if (e.code === 'Space' && !clockPhase.classList.contains('hidden')) {
            e.preventDefault(); switchPlayer();
        }
    });

    pauseBtn.addEventListener('click', () => {
        paused = !paused;
        pauseBtn.textContent = paused ? '▶' : '⏸';
        updateDisplay();
    });

    document.getElementById('start-btn').addEventListener('click', startClock);
    document.getElementById('reset-btn').addEventListener('click', resetClock);
    document.getElementById('play-again-btn').addEventListener('click', resetClock);

    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

    // Fullscreen logic
    const fsBtn = document.getElementById('fullscreen-btn');
    const exitFsBtn = document.getElementById('exit-fs-btn');
    const gameRoot = document.getElementById('game-root');

    fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            gameRoot.requestFullscreen().catch(err => console.warn(err));
        }
    });

    exitFsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fsBtn.classList.add('hidden');
            exitFsBtn.style.display = 'flex';
        } else {
            fsBtn.classList.remove('hidden');
            exitFsBtn.style.display = 'none';
        }
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');

    function updateThemeIcon() {
        if (document.documentElement.classList.contains('light-theme')) {
            themeIcon.setAttribute('name', 'moon-outline');
        } else {
            themeIcon.setAttribute('name', 'sunny-outline');
        }
    }

    updateThemeIcon();

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLightMode = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLightMode ? 'light' : 'dark');
        updateThemeIcon();
    });
})();
