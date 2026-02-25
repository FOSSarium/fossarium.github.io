const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');
const W = 400, SIZE = 20, COLS = W / SIZE, ROWS = W / SIZE;
let grid, player;

function generate() {
    grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ top: true, right: true, bottom: true, left: true, visited: false })));
    const stack = [{ r: 0, c: 0 }]; grid[0][0].visited = true;
    while (stack.length) {
        const { r, c } = stack[stack.length - 1];
        const neighbors = [];
        if (r > 0 && !grid[r - 1][c].visited) neighbors.push({ r: r - 1, c, dir: 'top' });
        if (r < ROWS - 1 && !grid[r + 1][c].visited) neighbors.push({ r: r + 1, c, dir: 'bottom' });
        if (c > 0 && !grid[r][c - 1].visited) neighbors.push({ r, c: c - 1, dir: 'left' });
        if (c < COLS - 1 && !grid[r][c + 1].visited) neighbors.push({ r, c: c + 1, dir: 'right' });
        if (neighbors.length) {
            const n = neighbors[Math.floor(Math.random() * neighbors.length)];
            grid[n.r][n.c].visited = true;
            if (n.dir === 'top') { grid[r][c].top = false; grid[n.r][n.c].bottom = false; }
            if (n.dir === 'bottom') { grid[r][c].bottom = false; grid[n.r][n.c].top = false; }
            if (n.dir === 'left') { grid[r][c].left = false; grid[n.r][n.c].right = false; }
            if (n.dir === 'right') { grid[r][c].right = false; grid[n.r][n.c].left = false; }
            stack.push(n);
        } else stack.pop();
    }
    player = { r: 0, c: 0 };
    draw();
}

function draw() {
    ctx.clearRect(0, 0, W, W);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const x = c * SIZE, y = r * SIZE, cell = grid[r][c];
        if (cell.top) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + SIZE, y); ctx.stroke(); }
        if (cell.right) { ctx.beginPath(); ctx.moveTo(x + SIZE, y); ctx.lineTo(x + SIZE, y + SIZE); ctx.stroke(); }
        if (cell.bottom) { ctx.beginPath(); ctx.moveTo(x, y + SIZE); ctx.lineTo(x + SIZE, y + SIZE); ctx.stroke(); }
        if (cell.left) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + SIZE); ctx.stroke(); }
    }
    // Exit
    ctx.fillStyle = '#2ed573'; ctx.fillRect((COLS - 1) * SIZE + 3, (ROWS - 1) * SIZE + 3, SIZE - 6, SIZE - 6);
    // Player
    ctx.fillStyle = '#58a6ff'; ctx.beginPath(); ctx.arc(player.c * SIZE + SIZE / 2, player.r * SIZE + SIZE / 2, SIZE / 3, 0, Math.PI * 2); ctx.fill();
}

document.addEventListener('keydown', e => {
    const { r, c } = player, cell = grid[r][c];
    if (e.key === 'ArrowUp' && !cell.top) player.r--;
    if (e.key === 'ArrowDown' && !cell.bottom) player.r++;
    if (e.key === 'ArrowLeft' && !cell.left) player.c--;
    if (e.key === 'ArrowRight' && !cell.right) player.c++;
    draw();
    if (player.r === ROWS - 1 && player.c === COLS - 1) { setTimeout(() => { alert('🎉 You escaped!'); generate(); }, 100); }
});
document.getElementById('new-btn').addEventListener('click', generate);
generate();
