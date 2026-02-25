const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), palette = document.getElementById('palette');
const W = 400, CELL = 20, COLS = W / CELL, ROWS = W / CELL;
const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#a55eea', '#ff6348', '#fff', '#2c2c54', '#eccc68', '#ff6b81'];
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentColor = colors[0];

colors.forEach((c, i) => {
    const sw = document.createElement('div');
    sw.className = 'swatch' + (i === 0 ? ' active' : '');
    sw.style.background = c;
    sw.addEventListener('click', () => { palette.querySelectorAll('.swatch').forEach(s => s.classList.remove('active')); sw.classList.add('active'); currentColor = c; });
    palette.appendChild(sw);
});

function draw() {
    ctx.clearRect(0, 0, W, W);
    ctx.strokeStyle = 'rgba(128,128,128,0.15)';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
        if (grid[r][c]) { ctx.fillStyle = grid[r][c]; ctx.fillRect(c * CELL, r * CELL, CELL, CELL); }
    }
}

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / rect.width * COLS);
    const r = Math.floor((e.clientY - rect.top) / rect.height * ROWS);
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) { grid[r][c] = grid[r][c] === currentColor ? null : currentColor; draw(); }
});

document.getElementById('clear-btn').addEventListener('click', () => { grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null)); draw(); });
draw();
