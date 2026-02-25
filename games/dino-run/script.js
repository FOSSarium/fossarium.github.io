const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), scoreEl = document.getElementById('score');
const W = 600, H = 200, GROUND = H - 30;
let dino = { x: 50, y: GROUND, vy: 0, w: 25, h: 30, jumping: false };
let obstacles = [], score = 0, speed = 4, running = true, frame = 0;

function jump() { if (!dino.jumping) { dino.vy = -10; dino.jumping = true; } }

function loop() {
    ctx.clearRect(0, 0, W, H);
    // Ground
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, GROUND + dino.h); ctx.lineTo(W, GROUND + dino.h); ctx.stroke();

    // Dino
    dino.vy += 0.5; dino.y += dino.vy;
    if (dino.y >= GROUND) { dino.y = GROUND; dino.jumping = false; dino.vy = 0; }
    ctx.fillStyle = '#2ed573'; ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
    // Eye
    ctx.fillStyle = '#fff'; ctx.fillRect(dino.x + 17, dino.y + 5, 6, 6);
    ctx.fillStyle = '#000'; ctx.fillRect(dino.x + 20, dino.y + 6, 3, 4);

    // Obstacles
    frame++;
    if (frame % Math.max(40, 80 - score) === 0) {
        const h = 20 + Math.random() * 25;
        obstacles.push({ x: W, y: GROUND + dino.h - h, w: 15, h });
    }
    obstacles.forEach(o => {
        o.x -= speed;
        ctx.fillStyle = '#ff4757'; ctx.fillRect(o.x, o.y, o.w, o.h);
        // Collision
        if (dino.x + dino.w > o.x && dino.x < o.x + o.w && dino.y + dino.h > o.y) {
            running = false;
            ctx.fillStyle = '#fff'; ctx.font = 'bold 24px Inter'; ctx.textAlign = 'center';
            ctx.fillText('Game Over! Click to restart', W / 2, H / 2);
        }
    });
    obstacles = obstacles.filter(o => o.x + o.w > 0);

    if (frame % 10 === 0) { score++; scoreEl.textContent = score; }
    if (frame % 500 === 0) speed += 0.3;
    if (running) requestAnimationFrame(loop);
}

canvas.addEventListener('click', () => { if (!running) { obstacles = []; score = 0; speed = 4; frame = 0; running = true; dino.y = GROUND; loop(); } else jump(); });
document.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); if (!running) { obstacles = []; score = 0; speed = 4; frame = 0; running = true; dino.y = GROUND; loop(); } else jump(); } });
loop();
