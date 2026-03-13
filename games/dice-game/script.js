(() => {
    const diceEl = document.getElementById('dice');
    const diceMsgEl = document.getElementById('dice-msg');
    const rollBtn = document.getElementById('roll-btn');
    const holdBtn = document.getElementById('hold-btn');
    const p1Card = document.getElementById('p1-card');
    const p2Card = document.getElementById('p2-card');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const DICE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const WIN_SCORE = 100;
    let scores, current, activePlayer, gameOver;

    function newGame() {
        scores = [0, 0]; current = 0; activePlayer = 0; gameOver = false;
        gameoverOverlay.classList.add('hidden');
        rollBtn.disabled = false; holdBtn.disabled = false;
        diceMsgEl.textContent = ''; diceMsgEl.className = 'dice-msg';
        diceEl.textContent = '⚀';
        updateUI();
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
        if (gameOver || activePlayer !== 0) return;
        const value = Math.floor(Math.random() * 6) + 1;
        diceEl.textContent = DICE[value - 1];
        diceEl.classList.remove('rolling');
        void diceEl.offsetWidth;
        diceEl.classList.add('rolling');

        if (value === 1) {
            current = 0;
            diceMsgEl.textContent = 'Rolled a 1! Turn lost!';
            diceMsgEl.className = 'dice-msg bad';
            updateUI();
            setTimeout(switchPlayer, 800);
        } else {
            current += value;
            diceMsgEl.textContent = `+${value}`;
            diceMsgEl.className = 'dice-msg';
            updateUI();
        }
    }

    function hold() {
        if (gameOver || activePlayer !== 0) return;
        scores[0] += current;
        current = 0;
        diceMsgEl.textContent = '';
        if (scores[0] >= WIN_SCORE) {
            gameOver = true; updateUI();
            document.getElementById('go-icon').textContent = '🎉';
            document.getElementById('go-title').textContent = 'You Win!';
            document.getElementById('go-msg').textContent = `Final Score: ${scores[0]}`;
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
        if (activePlayer === 1) {
            rollBtn.disabled = true; holdBtn.disabled = true;
            setTimeout(cpuTurn, 600);
        } else {
            rollBtn.disabled = false; holdBtn.disabled = false;
        }
    }

    function cpuTurn() {
        if (gameOver) return;
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
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => { }); else document.exitFullscreen();
    });

    newGame();
})();
