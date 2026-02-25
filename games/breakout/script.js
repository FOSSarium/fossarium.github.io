const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), scoreEl = document.getElementById('score'), msgEl = document.getElementById('msg');
let ball, paddle, bricks, score, running, animId;
const W = 480, H = 400, COLS = 8, ROWS = 5, BW = 54, BH = 18, BP = 4;
const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#a55eea'];

function init() {
    score = 0; scoreEl.textContent = 0; running = false;
    paddle = { x: W / 2 - 40, y: H - 20, w: 80, h: 10 };
    ball = { x: W / 2, y: H - 35, r: 6, dx: 3, dy: -3 };
    bricks = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) bricks.push({ x: c * (BW + BP) + 35, y: r * (BH + BP) + 40, w: BW, h: BH, alive: true, color: colors[r] });
    render();
}

function render() {
    ctx.clearRect(0, 0, W, H);
    // Bricks
    bricks.forEach(b => { if (!b.alive) return; ctx.fillStyle = b.color; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 4); ctx.fill(); });
    // Paddle
    ctx.fillStyle = '#58a6ff'; ctx.beginPath(); ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 5); ctx.fill();
    // Ball
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
}

function update() {
    ball.x += ball.dx; ball.y += ball.dy;
    if (ball.x - ball.r < 0 || ball.x + ball.r > W) ball.dx = -ball.dx;
    if (ball.y - ball.r < 0) ball.dy = -ball.dy;
    if (ball.y + ball.r > H) { running = false; msgEl.textContent = 'Game Over! Click to restart.'; init(); return; }
    // Paddle
    if (ball.y + ball.r >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.dy > 0) {
        ball.dy = -ball.dy; ball.dx += (ball.x - (paddle.x + paddle.w / 2)) * 0.08;
    }
    // Bricks
    bricks.forEach(b => {
        if (!b.alive) return;
        if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
            b.alive = false; ball.dy = -ball.dy; score++; scoreEl.textContent = score;
            if (bricks.every(b => !b.alive)) { running = false; msgEl.textContent = '🎉 You Win! Click to play again.'; return; }
        }
    });
}

function loop() { if (!running) return; update(); render(); animId = requestAnimationFrame(loop); }

canvas.addEventListener('mousemove', e => { const rect = canvas.getBoundingClientRect(); paddle.x = (e.clientX - rect.left) / rect.width * W - paddle.w / 2; paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x)); });
canvas.addEventListener('touchmove', e => { e.preventDefault(); const rect = canvas.getBoundingClientRect(); paddle.x = (e.touches[0].clientX - rect.left) / rect.width * W - paddle.w / 2; paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x)); }, { passive: false });
canvas.addEventListener('click', () => { if (!running) { init(); running = true; msgEl.textContent = ''; loop(); } });
init();
