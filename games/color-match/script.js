(() => {
    const wordEl = document.getElementById('word');
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');
    const bestEl = document.getElementById('best');
    const progressEl = document.getElementById('progress');
    const feedbackEl = document.getElementById('feedback');
    const startBtn = document.getElementById('start-btn');
    const answerBtns = document.getElementById('answer-btns');
    const resultsOverlay = document.getElementById('results-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const COLOR_DATA = [
        { name: 'RED', hex: '#ff4757' },
        { name: 'BLUE', hex: '#1e90ff' },
        { name: 'GREEN', hex: '#2ed573' },
        { name: 'YELLOW', hex: '#ffd32a' },
        { name: 'PURPLE', hex: '#a55eea' },
        { name: 'ORANGE', hex: '#ffa502' },
        { name: 'PINK', hex: '#ff6b81' },
        { name: 'CYAN', hex: '#00d2d3' }
    ];

    const DURATION = 30;
    let score, correct, wrong, timeLeft, interval, running, currentMatch, best;

    best = parseInt(localStorage.getItem('fossarium-colormatch-best') || '0');
    bestEl.textContent = best;

    function randomColor() { return COLOR_DATA[Math.floor(Math.random() * COLOR_DATA.length)]; }

    function nextWord() {
        const word = randomColor();
        const textColor = randomColor();
        currentMatch = (word.name === textColor.name);
        wordEl.textContent = word.name;
        wordEl.style.color = textColor.hex;
        feedbackEl.classList.add('hidden');
    }

    function showFeedback(isCorrect) {
        feedbackEl.textContent = isCorrect ? '✓ Correct!' : '✗ Wrong!';
        feedbackEl.className = 'feedback ' + (isCorrect ? 'correct' : 'wrong');
    }

    function answer(playerSaysYes) {
        if (!running) return;
        const isCorrect = (playerSaysYes === currentMatch);
        if (isCorrect) { score += 10; correct++; }
        else { score = Math.max(0, score - 5); wrong++; }
        scoreEl.textContent = score;
        showFeedback(isCorrect);
        nextWord();
    }

    function startGame() {
        score = 0; correct = 0; wrong = 0; timeLeft = DURATION; running = true;
        scoreEl.textContent = 0; timeEl.textContent = DURATION;
        progressEl.style.width = '100%';
        startBtn.classList.add('hidden');
        answerBtns.style.pointerEvents = 'auto';
        resultsOverlay.classList.add('hidden');
        nextWord();

        clearInterval(interval);
        interval = setInterval(() => {
            timeLeft--;
            timeEl.textContent = timeLeft;
            progressEl.style.width = (timeLeft / DURATION * 100) + '%';
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    function endGame() {
        running = false;
        clearInterval(interval);
        answerBtns.style.pointerEvents = 'none';

        if (score > best) {
            best = score;
            localStorage.setItem('fossarium-colormatch-best', best);
            bestEl.textContent = best;
        }

        document.getElementById('r-score').textContent = score;
        document.getElementById('r-correct').textContent = correct;
        document.getElementById('r-wrong').textContent = wrong;
        const total = correct + wrong;
        document.getElementById('r-accuracy').textContent = total > 0 ? Math.round((correct / total) * 100) + '%' : '0%';
        resultsOverlay.classList.remove('hidden');
    }

    // Event listeners
    document.getElementById('yes-btn').addEventListener('click', () => answer(true));
    document.getElementById('no-btn').addEventListener('click', () => answer(false));
    startBtn.addEventListener('click', startGame);
    document.getElementById('play-again-btn').addEventListener('click', startGame);

    // Keyboard
    document.addEventListener('keydown', e => {
        if (!running) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') answer(true);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') answer(false);
    });

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
            gameRoot.requestFullscreen().catch(() => {});
        }
    });

    exitFsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
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

    // Initial state
    answerBtns.style.pointerEvents = 'none';
    wordEl.style.color = COLOR_DATA[0].hex;
})();
