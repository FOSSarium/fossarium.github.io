const ROWS = 6, COLS = 7;
let grid, currentPlayer, gameOver;
const boardEl = document.getElementById('board'), turnEl = document.getElementById('turn'), statusEl = document.getElementById('status');

function init() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPlayer = 1; gameOver = false;
    turnEl.textContent = 'Player 1'; turnEl.className = 'p1';
    statusEl.classList.add('hidden');
    render();
}

function render() {
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell' + (grid[r][c] === 1 ? ' p1' : grid[r][c] === 2 ? ' p2' : '');
        cell.addEventListener('click', () => drop(c));
        boardEl.appendChild(cell);
    }
}

function drop(col) {
    if (gameOver) return;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r][col] === 0) {
            grid[r][col] = currentPlayer;
            if (checkWin(r, col)) { statusEl.textContent = `🎉 Player ${currentPlayer} wins!`; statusEl.className = 'status-bar success'; gameOver = true; }
            else if (grid.every(row => row.every(c => c !== 0))) { statusEl.textContent = "It's a draw!"; statusEl.className = 'status-bar success'; gameOver = true; }
            else { currentPlayer = currentPlayer === 1 ? 2 : 1; turnEl.textContent = `Player ${currentPlayer}`; turnEl.className = `p${currentPlayer}`; }
            render(); return;
        }
    }
}

function checkWin(r, c) {
    const p = grid[r][c], dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of dirs) {
        let count = 1;
        for (let d = 1; d <= 3; d++) { const nr = r + dr * d, nc = c + dc * d; if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === p) count++; else break; }
        for (let d = 1; d <= 3; d++) { const nr = r - dr * d, nc = c - dc * d; if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === p) count++; else break; }
        if (count >= 4) return true;
    }
    return false;
}

document.getElementById('reset-btn').addEventListener('click', init);
init();
