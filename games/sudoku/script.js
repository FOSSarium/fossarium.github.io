const board = document.getElementById('board'), status = document.getElementById('status');
let solution = [], puzzle = [];

function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) { if (grid[row][i] === num || grid[i][col] === num) return false; }
    const r = Math.floor(row / 3) * 3, c = Math.floor(col / 3) * 3;
    for (let i = r; i < r + 3; i++) for (let j = c; j < c + 3; j++) if (grid[i][j] === num) return false;
    return true;
}

function solve(grid) {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
            const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (const n of nums) { if (isValid(grid, r, c, n)) { grid[r][c] = n; if (solve(grid)) return true; grid[r][c] = 0; } }
            return false;
        }
    }
    return true;
}

function generate() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    solve(grid);
    solution = grid.map(r => [...r]);
    const diff = document.getElementById('difficulty').value;
    const remove = diff === 'easy' ? 30 : diff === 'medium' ? 45 : 55;
    puzzle = grid.map(r => [...r]);
    let count = 0;
    while (count < remove) {
        const r = Math.floor(Math.random() * 9), c = Math.floor(Math.random() * 9);
        if (puzzle[r][c] !== 0) { puzzle[r][c] = 0; count++; }
    }
    render();
}

function render() {
    board.innerHTML = '';
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (c % 3 === 2 && c < 8) cell.classList.add('border-right');
        if (r % 3 === 2 && r < 8) cell.classList.add('border-bottom');
        if (puzzle[r][c] !== 0) { cell.classList.add('given'); cell.textContent = puzzle[r][c]; }
        else { const inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 1; inp.dataset.r = r; inp.dataset.c = c; cell.appendChild(inp); }
        board.appendChild(cell);
    }
    status.classList.add('hidden');
}

document.getElementById('check-btn').addEventListener('click', () => {
    const inputs = board.querySelectorAll('input');
    let correct = true;
    inputs.forEach(inp => {
        const r = parseInt(inp.dataset.r), c = parseInt(inp.dataset.c), v = parseInt(inp.value);
        if (v !== solution[r][c]) correct = false;
    });
    status.textContent = correct ? '✓ Congratulations! Puzzle solved!' : '✗ Some cells are incorrect.';
    status.className = 'status-bar ' + (correct ? 'success' : 'error');
});

document.getElementById('new-btn').addEventListener('click', generate);
generate();
