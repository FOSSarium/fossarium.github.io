(() => {
    const diceEl = document.getElementById('dice');
    const diceMsgEl = document.getElementById('dice-msg');
    const rollBtn = document.getElementById('roll-btn');
    const holdBtn = document.getElementById('hold-btn');
    const p1Card = document.getElementById('p1-card');
    const p2Card = document.getElementById('p2-card');
    const p1Label = document.getElementById('p1-label');
    const p2Label = document.getElementById('p2-label');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const modeBotBtn = document.getElementById('mode-bot');
    const modePvpBtn = document.getElementById('mode-pvp');

    const DICE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const WIN_SCORE = 100;
    let scores, current, activePlayer, gameOver, gameMode; // 'bot' or 'pvp'

    function newGame() {
        scores = [0, 0]; current = 0; activePlayer = 0; gameOver = false;
        gameoverOverlay.classList.add('hidden');
        rollBtn.disabled = false; holdBtn.disabled = false;
        diceMsgEl.textContent = ''; diceMsgEl.className = 'dice-msg';
        diceEl.textContent = '⚀';
        updateUI();
    }

    function setMode(mode) {
        gameMode = mode;
        if (mode === 'bot') {
            p1Label.textContent = 'You';
            p2Label.textContent = 'CPU';
            modeBotBtn.classList.add('active');
            modePvpBtn.classList.remove('active');
        } else {
            p1Label.textContent = 'Player 1';
            p2Label.textContent = 'Player 2';
            modeBotBtn.classList.remove('active');
            modePvpBtn.classList.add('active');
        }
        newGame();
    }

    function updateUI() {
        document.getElementById('p1-total').textContent = scores[0];
        document.getElementById('p2-total').textContent = scores[1];
        document.getElementById('p1-current').textContent = activePlayer === 0 ? current : 0;
        document.getElementById('p2-current').textContent = activePlayer === 1 ? current : 0;
        p1Card.classList.toggle('active', activePlayer === 0);
        p2Card.classList.toggle('active', activePlayer === 1);
    }

    function roll() {
        if (gameOver || (gameMode === 'bot' && activePlayer !== 0)) return;
        const value = Math.floor(Math.random() * 6) + 1;
        diceEl.textContent = DICE[value - 1];
        diceEl.classList.remove('rolling');
        void diceEl.offsetWidth;
        diceEl.classList.add('rolling');

        if (value === 1) {
            current = 0;
            const playerName = gameMode === 'bot' ? 'You' : (activePlayer === 0 ? 'Player 1' : 'Player 2');
            diceMsgEl.textContent = `${playerName} rolled a 1! Turn lost!`;
            diceMsgEl.className = 'dice-msg bad';
            updateUI();
            setTimeout(switchPlayer, 800);
        } else {
            current += value;
            const playerName = gameMode === 'bot' ? 'You' : (activePlayer === 0 ? 'Player 1' : 'Player 2');
            diceMsgEl.textContent = `${playerName} +${value}`;
            diceMsgEl.className = 'dice-msg';
            updateUI();
        }
    }

    function hold() {
        if (gameOver || (gameMode === 'bot' && activePlayer !== 0)) return;
        scores[activePlayer] += current;
        current = 0;
        diceMsgEl.textContent = '';
        if (scores[activePlayer] >= WIN_SCORE) {
            gameOver = true; updateUI();
            document.getElementById('go-icon').textContent = activePlayer === 0 ? '🎉' : '🎉';
            const winner = gameMode === 'bot' ? (activePlayer === 0 ? 'You' : 'CPU') : (activePlayer === 0 ? 'Player 1' : 'Player 2');
            document.getElementById('go-title').textContent = `${winner} Wins!`;
            document.getElementById('go-msg').textContent = `Final Score: ${scores[activePlayer]}`;
            gameoverOverlay.classList.remove('hidden');
            return;
        }
        updateUI();
        switchPlayer();
    }

    function switchPlayer() {
        activePlayer = activePlayer === 0 ? 1 : 0;
        current = 0;
        updateUI();
        if (gameMode === 'bot' && activePlayer === 1) {
            rollBtn.disabled = true; holdBtn.disabled = true;
            setTimeout(cpuTurn, 600);
        } else {
            rollBtn.disabled = false; holdBtn.disabled = false;
        }
    }

    function cpuTurn() {
        if (gameOver || gameMode !== 'bot') return;
        const value = Math.floor(Math.random() * 6) + 1;
        diceEl.textContent = DICE[value - 1];
        diceEl.classList.remove('rolling');
        void diceEl.offsetWidth;
        diceEl.classList.add('rolling');

        if (value === 1) {
            current = 0;
            diceMsgEl.textContent = 'CPU rolled 1! Turn lost!';
            diceMsgEl.className = 'dice-msg bad';
            updateUI();
            setTimeout(switchPlayer, 800);
        } else {
            current += value;
            diceMsgEl.textContent = `CPU +${value}`;
            diceMsgEl.className = 'dice-msg';
            updateUI();

            // CPU strategy: hold at 20+ or if would win
            if (scores[1] + current >= WIN_SCORE) {
                setTimeout(() => {
                    scores[1] += current; current = 0;
                    diceMsgEl.textContent = '';
                    gameOver = true; updateUI();
                    document.getElementById('go-icon').textContent = '💀';
                    document.getElementById('go-title').textContent = 'CPU Wins!';
                    document.getElementById('go-msg').textContent = `CPU Score: ${scores[1]}`;
                    gameoverOverlay.classList.remove('hidden');
                }, 600);
            } else if (current >= 20) {
                setTimeout(() => {
                    scores[1] += current; current = 0;
                    diceMsgEl.textContent = 'CPU holds';
                    diceMsgEl.className = 'dice-msg';
                    updateUI();
                    setTimeout(switchPlayer, 600);
                }, 600);
            } else {
                setTimeout(cpuTurn, 700);
            }
        }
    }

    rollBtn.addEventListener('click', roll);
    holdBtn.addEventListener('click', hold);
    document.addEventListener('keydown', e => {
        if (e.code === 'Space') { e.preventDefault(); roll(); }
        if (e.key === 'h' || e.key === 'H') hold();
    });

    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    
    // Mode selector
    modeBotBtn.addEventListener('click', () => setMode('bot'));
    modePvpBtn.addEventListener('click', () => setMode('pvp'));

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        themeIcon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        themeIcon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });

    setMode('bot');
})();
