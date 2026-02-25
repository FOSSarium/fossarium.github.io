const SIZE = 5, boardEl = document.getElementById('board'), msgEl = document.getElementById('msg');
let grid;
function init() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
    for (let i = 0; i < 15; i++) toggle(Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE), true);
    msgEl.textContent = ''; render();
}
function toggle(r, c, silent) {
    const flip = [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
    flip.forEach(([rr, cc]) => { if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) grid[rr][cc] = !grid[rr][cc]; });
    if (!silent) { render(); if (grid.every(row => row.every(v => !v))) msgEl.textContent = '🎉 You solved it!'; }
}
function render() {
    boardEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
        const div = document.createElement('div');
        div.className = 'cell ' + (grid[r][c] ? 'on' : 'off');
        div.addEventListener('click', () => toggle(r, c, false));
        boardEl.appendChild(div);
    }
}
document.getElementById('new-btn').addEventListener('click', init);
init();
