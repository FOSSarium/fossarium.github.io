(() => {
    const arena = document.getElementById('arena');
    const target = document.getElementById('target');
    const startPrompt = document.getElementById('start-prompt');
    const progressFill = document.getElementById('progress');
    const hitsEl = document.getElementById('hits');
    const accuracyEl = document.getElementById('accuracy');
    const avgRtEl = document.getElementById('avg-rt');
    const bestRtEl = document.getElementById('best-rt');
    const resultsOverlay = document.getElementById('results-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const TOTAL = 30;
    let targetSize = 50;
    let hits = 0, misses = 0, times = [], bestTime = Infinity;
    let startTime = 0, round = 0, active = false;

    function moveTarget() {
        const w = arena.clientWidth - targetSize;
        const h = arena.clientHeight - targetSize;
        target.style.width = target.style.height = targetSize + 'px';
        target.style.left = Math.max(0, Math.random() * w) + 'px';
        target.style.top = Math.max(0, Math.random() * h) + 'px';
        target.style.display = 'block';
        startTime = Date.now();
    }

    function updateStats() {
        hitsEl.textContent = hits;
        const total = hits + misses;
        accuracyEl.textContent = total > 0 ? Math.round((hits / total) * 100) + '%' : '—';
        if (times.length > 0) {
            const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
            avgRtEl.textContent = avg + 'ms';
        }
        bestRtEl.textContent = bestTime < Infinity ? bestTime + 'ms' : '—';
        progressFill.style.width = (round / TOTAL * 100) + '%';
    }

    function endRound() {
        active = false;
        target.style.display = 'none';
        const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
        document.getElementById('r-hits').textContent = hits;
        document.getElementById('r-misses').textContent = misses;
        const total = hits + misses;
        document.getElementById('r-accuracy').textContent = total > 0 ? Math.round((hits / total) * 100) + '%' : '0%';
        document.getElementById('r-avg').textContent = avg + 'ms';
        document.getElementById('r-best').textContent = bestTime < Infinity ? bestTime + 'ms' : '—';
        resultsOverlay.classList.remove('hidden');
    }

    function startGame() {
        hits = 0; misses = 0; times = []; bestTime = Infinity; round = 0;
        active = true;
        startPrompt.style.display = 'none';
        resultsOverlay.classList.add('hidden');
        updateStats();
        moveTarget();
    }

    // Target click
    target.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        if (!active) return;
        const rt = Date.now() - startTime;
        times.push(rt);
        hits++;
        if (rt < bestTime) bestTime = rt;
        round++;
        updateStats();
        if (round >= TOTAL) { endRound(); return; }
        moveTarget();
    });

    // Miss click
    arena.addEventListener('mousedown', (e) => {
        if (!active) {
            startGame();
            return;
        }
        if (e.target === target) return;
        misses++;
        updateStats();
    });

    // Difficulty
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            targetSize = parseInt(btn.dataset.size);
            if (active) {
                target.style.width = target.style.height = targetSize + 'px';
            }
        });
    });

    // Reset
    function resetGame() {
        active = false;
        target.style.display = 'none';
        hits = 0; misses = 0; times = []; bestTime = Infinity; round = 0;
        hitsEl.textContent = '0'; accuracyEl.textContent = '—';
        avgRtEl.textContent = '—'; bestRtEl.textContent = '—';
        progressFill.style.width = '0%';
        startPrompt.style.display = 'flex';
        resultsOverlay.classList.add('hidden');
    }
    document.getElementById('reset-btn').addEventListener('click', resetGame);

    // Play Again
    document.getElementById('play-again-btn').addEventListener('click', startGame);

    // Help
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    resultsOverlay.addEventListener('click', e => { if (e.target === resultsOverlay) resultsOverlay.classList.add('hidden'); });

    // Fullscreen
    const fsBtn = document.getElementById('fullscreen-btn');
    const exitFsBtn = document.getElementById('exit-fs-btn');
    const gameRoot = document.getElementById('game-root');

    fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            gameRoot.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            });
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
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        updateThemeIcon();
    });

    window.addEventListener('resize', () => {
        if (active) {
            // Re-check bounds if resized during round
            const w = arena.clientWidth - targetSize;
            const h = arena.clientHeight - targetSize;
            const curL = parseInt(target.style.left);
            const curT = parseInt(target.style.top);
            if (curL > w) target.style.left = Math.max(0, w) + 'px';
            if (curT > h) target.style.top = Math.max(0, h) + 'px';
        }
    });

})();
