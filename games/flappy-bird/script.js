const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), scoreEl = document.getElementById('score');
const W = 320, H = 480;
let bird, pipes, score, running, frame;
const GAP = 130, PIPE_W = 50, GRAVITY = 0.4, FLAP = -7;

function init() { bird = { x: 60, y: H / 2, vy: 0, r: 14 }; pipes = []; score = 0; frame = 0; running = true; scoreEl.textContent = 0; addPipe(); }

function addPipe() {
    const topH = 60 + Math.random() * (H - GAP - 120);
    pipes.push({ x: W, top: topH, bottom: topH + GAP, scored: false });
}

function flap() { if (!running) { init(); } bird.vy = FLAP; }

function loop() {
    ctx.clearRect(0, 0, W, H);
    // Bird
    bird.vy += GRAVITY; bird.y += bird.vy;
    ctx.fillStyle = '#ffa502'; ctx.beginPath(); ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bird.x + 5, bird.y - 4, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(bird.x + 6, bird.y - 4, 2, 0, Math.PI * 2); ctx.fill();

    // Pipes
    frame++;
    if (frame % 90 === 0) addPipe();
    pipes.forEach(p => {
        p.x -= 2.5;
        ctx.fillStyle = '#2ed573';
        ctx.fillRect(p.x, 0, PIPE_W, p.top);
        ctx.fillRect(p.x, p.bottom, PIPE_W, H - p.bottom);
        // Collision
        if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_W) {
            if (bird.y - bird.r < p.top || bird.y + bird.r > p.bottom) { running = false; ctx.fillStyle = '#fff'; ctx.font = 'bold 28px Inter'; ctx.textAlign = 'center'; ctx.fillText('Game Over', W / 2, H / 2); ctx.font = '16px Inter'; ctx.fillText('Click to restart', W / 2, H / 2 + 30); }
        }
        if (!p.scored && p.x + PIPE_W < bird.x) { p.scored = true; score++; scoreEl.textContent = score; }
    });
    pipes = pipes.filter(p => p.x + PIPE_W > 0);
    if (bird.y + bird.r > H || bird.y - bird.r < 0) { running = false; }
    if (running) requestAnimationFrame(loop);
}

canvas.addEventListener('click', () => { flap(); if (running) requestAnimationFrame(loop); else { init(); loop(); } });
document.addEventListener('keydown', e => { if (e.key === ' ') { e.preventDefault(); flap(); } });
init(); loop();
