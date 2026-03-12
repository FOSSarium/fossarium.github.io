(() => {
    const ROWS = 6, COLS = 7;
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const winsEl = document.getElementById('wins');
    const lossesEl = document.getElementById('losses');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    let grid, playerTurn, gameOver, winCells;
    let wins = parseInt(localStorage.getItem('fossarium-c4-wins') || '0');
    let losses = parseInt(localStorage.getItem('fossarium-c4-losses') || '0');
    winsEl.textContent = wins; lossesEl.textContent = losses;

    function newGame() {
        grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        playerTurn = true; gameOver = false; winCells = [];
        gameoverOverlay.classList.add('hidden');
        turnEl.textContent = '🔴 You';
        render();
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
                cell.addEventListener('click', () => playerDrop(c));
                boardEl.appendChild(cell);
            }
        }
    }

    function drop(col, player) {
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][col] === 0) { grid[r][col] = player; return r; }
        }
        return -1; // Column full
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

    function isFull() {
        return grid[0].every(c => c !== 0);
    }

    function playerDrop(col) {
        if (gameOver || !playerTurn) return;
        const row = drop(col, 1);
        if (row < 0) return;

        const win = checkWin(1);
        if (win) {
            winCells = win; gameOver = true;
            wins++; localStorage.setItem('fossarium-c4-wins', wins);
            winsEl.textContent = wins;
            render();
            setTimeout(() => {
                document.getElementById('go-icon').textContent = '🎉';
                document.getElementById('go-title').textContent = 'You Win!';
                gameoverOverlay.classList.remove('hidden');
            }, 300);
            return;
        }

        if (isFull()) {
            gameOver = true; render();
            setTimeout(() => {
                document.getElementById('go-icon').textContent = '🤝';
                document.getElementById('go-title').textContent = 'Draw!';
                gameoverOverlay.classList.remove('hidden');
            }, 300);
            return;
        }

        playerTurn = false;
        turnEl.textContent = '🟡 AI';
        render();
        setTimeout(aiMove, 400);
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
            drop(bestCol, 2);
            const win = checkWin(2);
            if (win) {
                winCells = win; gameOver = true;
                losses++; localStorage.setItem('fossarium-c4-losses', losses);
                lossesEl.textContent = losses;
                render();
                setTimeout(() => {
                    document.getElementById('go-icon').textContent = '💀';
                    document.getElementById('go-title').textContent = 'AI Wins!';
                    gameoverOverlay.classList.remove('hidden');
                }, 300);
                return;
            }
            if (isFull()) {
                gameOver = true; render();
                setTimeout(() => {
                    document.getElementById('go-icon').textContent = '🤝';
                    document.getElementById('go-title').textContent = 'Draw!';
                    gameoverOverlay.classList.remove('hidden');
                }, 300);
                return;
            }
        }

        playerTurn = true;
        turnEl.textContent = '🔴 You';
        render();
    }

    function getDropRow(col) {
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][col] === 0) return r;
        }
        return -1;
    }

    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {}); else document.exitFullscreen();
    });

    newGame();
})();
