(() => {
    const ROWS = 6, COLS = 7;
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const p1WinsEl = document.getElementById('p1-wins');
    const p2WinsEl = document.getElementById('p2-wins');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    let grid, currentPlayer, gameOver, winCells, p1Wins, p2Wins;
    p1Wins = parseInt(localStorage.getItem('fossarium-4row-p1') || '0');
    p2Wins = parseInt(localStorage.getItem('fossarium-4row-p2') || '0');
    p1WinsEl.textContent = p1Wins; p2WinsEl.textContent = p2Wins;

    function newGame() {
        grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        currentPlayer = 1; gameOver = false; winCells = [];
        gameoverOverlay.classList.add('hidden');
        turnEl.textContent = '🔴 P1';
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
                cell.addEventListener('click', () => dropDisc(c));
                boardEl.appendChild(cell);
            }
        }
    }

    function dropDisc(col) {
        if (gameOver) return;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][col] === 0) {
                grid[r][col] = currentPlayer;
                const win = checkWin(currentPlayer);
                if (win) {
                    winCells = win; gameOver = true;
                    if (currentPlayer === 1) { p1Wins++; localStorage.setItem('fossarium-4row-p1', p1Wins); p1WinsEl.textContent = p1Wins; }
                    else { p2Wins++; localStorage.setItem('fossarium-4row-p2', p2Wins); p2WinsEl.textContent = p2Wins; }
                    render();
                    setTimeout(() => {
                        document.getElementById('go-icon').textContent = '🎉';
                        document.getElementById('go-title').textContent = `Player ${currentPlayer} Wins!`;
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
                turnEl.textContent = currentPlayer === 1 ? '🔴 P1' : '🟡 P2';
                render();
                return;
            }
        }
    }

    function checkWin(player) {
        const dirs = [[0,1],[1,0],[1,1],[1,-1]];
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
