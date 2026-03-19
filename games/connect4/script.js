(() => {
    const ROWS = 6, COLS = 7;
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const p1WinsEl = document.getElementById('p1-wins');
    const p2WinsEl = document.getElementById('p2-wins');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    let grid, currentPlayer, gameOver, winCells, aiMode;
    let p1Wins, p2Wins;

    // Load scores based on mode
    function loadScores() {
        const key = aiMode ? 'c4-ai' : 'c4-pvp';
        p1Wins = parseInt(localStorage.getItem(`fossarium-${key}-p1`) || '0');
        p2Wins = parseInt(localStorage.getItem(`fossarium-${key}-p2`) || '0');
        p1WinsEl.textContent = p1Wins;
        p2WinsEl.textContent = p2Wins;
    }

    function saveScores() {
        const key = aiMode ? 'c4-ai' : 'c4-pvp';
        localStorage.setItem(`fossarium-${key}-p1`, p1Wins);
        localStorage.setItem(`fossarium-${key}-p2`, p2Wins);
    }

    function newGame() {
        grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        currentPlayer = 1; gameOver = false; winCells = [];
        gameoverOverlay.classList.add('hidden');
        updateTurnDisplay();
        render();
    }

    function updateTurnDisplay() {
        if (aiMode) {
            turnEl.textContent = currentPlayer === 1 ? '🔴 You' : '🟡 AI';
        } else {
            turnEl.textContent = currentPlayer === 1 ? '🔴 P1' : '🟡 P2';
        }
    }

    function render() {
        boardEl.innerHTML = '';
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (grid[r][c] === 1) cell.classList.add('p1');
                else if (grid[r][c] === 2) cell.classList.add('p2');
                if (winCells.some(w => w[0] === r && w[1] === c)) cell.classList.add('win');
                cell.addEventListener('click', () => handleMove(c));
                boardEl.appendChild(cell);
            }
        }
    }

    function handleMove(col) {
        if (gameOver) return;
        if (aiMode && currentPlayer === 2) return; // AI's turn

        const row = dropDisc(col, currentPlayer);
        if (row < 0) return; // Column full

        const win = checkWin(currentPlayer);
        if (win) {
            winCells = win; gameOver = true;
            if (currentPlayer === 1) { p1Wins++; saveScores(); p1WinsEl.textContent = p1Wins; }
            else { p2Wins++; saveScores(); p2WinsEl.textContent = p2Wins; }
            render();
            setTimeout(() => {
                document.getElementById('go-icon').textContent = '🎉';
                document.getElementById('go-title').textContent = aiMode ? 'You Win!' : `Player ${currentPlayer} Wins!`;
                gameoverOverlay.classList.remove('hidden');
            }, 300);
            return;
        }

        if (grid[0].every(c => c !== 0)) {
            gameOver = true; render();
            setTimeout(() => {
                document.getElementById('go-icon').textContent = '🤝';
                document.getElementById('go-title').textContent = 'Draw!';
                gameoverOverlay.classList.remove('hidden');
            }, 300);
            return;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateTurnDisplay();
        render();

        if (aiMode && currentPlayer === 2) {
            setTimeout(aiMove, 500);
        }
    }

    function dropDisc(col, player) {
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][col] === 0) {
                grid[r][col] = player;
                return r;
            }
        }
        return -1;
    }

    function checkWin(player) {
        const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c] !== player) continue;
                for (const [dr, dc] of dirs) {
                    const cells = [[r, c]];
                    for (let i = 1; i < 4; i++) {
                        const nr = r + dr * i, nc = c + dc * i;
                        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || grid[nr][nc] !== player) break;
                        cells.push([nr, nc]);
                    }
                    if (cells.length === 4) return cells;
                }
            }
        }
        return null;
    }

    function aiMove() {
        if (gameOver) return;

        // AI strategy: 1) Win if possible, 2) Block player, 3) Center preference
        let bestCol = -1;

        // Check if AI can win
        for (let c = 0; c < COLS; c++) {
            const r = getDropRow(c);
            if (r < 0) continue;
            grid[r][c] = 2;
            if (checkWin(2)) { grid[r][c] = 0; bestCol = c; break; }
            grid[r][c] = 0;
        }

        // Block player win
        if (bestCol < 0) {
            for (let c = 0; c < COLS; c++) {
                const r = getDropRow(c);
                if (r < 0) continue;
                grid[r][c] = 1;
                if (checkWin(1)) { grid[r][c] = 0; bestCol = c; break; }
                grid[r][c] = 0;
            }
        }

        // Prefer center columns
        if (bestCol < 0) {
            const order = [3, 2, 4, 1, 5, 0, 6];
            for (const c of order) {
                if (getDropRow(c) >= 0) { bestCol = c; break; }
            }
        }

        if (bestCol >= 0) {
            dropDisc(bestCol, 2);
            const win = checkWin(2);
            if (win) {
                winCells = win; gameOver = true;
                p2Wins++; saveScores(); p2WinsEl.textContent = p2Wins;
                render();
                setTimeout(() => {
                    document.getElementById('go-icon').textContent = '💀';
                    document.getElementById('go-title').textContent = 'AI Wins!';
                    gameoverOverlay.classList.remove('hidden');
                }, 300);
                return;
            }
            if (grid[0].every(c => c !== 0)) {
                gameOver = true; render();
                setTimeout(() => {
                    document.getElementById('go-icon').textContent = '🤝';
                    document.getElementById('go-title').textContent = 'Draw!';
                    gameoverOverlay.classList.remove('hidden');
                }, 300);
                return;
            }
        }

        currentPlayer = 1;
        updateTurnDisplay();
        render();
    }

    function getDropRow(col) {
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][col] === 0) return r;
        }
        return -1;
    }

    // Mode switching
    const aiModeBtn = document.getElementById('ai-mode-btn');
    const pvpModeBtn = document.getElementById('pvp-mode-btn');

    aiModeBtn.addEventListener('click', () => {
        aiMode = true;
        aiModeBtn.classList.add('active');
        pvpModeBtn.classList.remove('active');
        loadScores();
        newGame();
    });

    pvpModeBtn.addEventListener('click', () => {
        aiMode = false;
        pvpModeBtn.classList.add('active');
        aiModeBtn.classList.remove('active');
        loadScores();
        newGame();
    });

    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);

    // Help
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

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

    // Initialize
    aiMode = true; // Default to AI mode
    loadScores();
    newGame();
})();
