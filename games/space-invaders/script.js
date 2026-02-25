const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), scoreEl = document.getElementById('score');
const W = 400, H = 500;
let player = { x: W / 2 - 15, y: H - 40, w: 30, h: 16 }, bullets = [], enemies = [], score = 0, keys = {}, enemyDir = 1, enemySpeed = 0.5, frame = 0;

function spawnEnemies() {
    enemies = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++)
        enemies.push({ x: c * 45 + 30, y: r * 35 + 30, w: 28, h: 20, alive: true });
}

function loop() {
    ctx.clearRect(0, 0, W, H);
    // Player
    if (keys['ArrowLeft'] || keys['a']) player.x -= 4;
    if (keys['ArrowRight'] || keys['d']) player.x += 4;
    player.x = Math.max(0, Math.min(W - player.w, player.x));
    ctx.fillStyle = '#58a6ff';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(player.x + player.w / 2 - 3, player.y - 8, 6, 8);

    // Bullets
    bullets.forEach(b => { b.y -= 6; ctx.fillStyle = '#2ed573'; ctx.fillRect(b.x, b.y, 3, 10); });
    bullets = bullets.filter(b => b.y > 0);

    // Enemies
    let edgeHit = false;
    enemies.forEach(e => {
        if (!e.alive) return;
        e.x += enemyDir * enemySpeed;
        if (e.x <= 0 || e.x + e.w >= W) edgeHit = true;
        ctx.fillStyle = '#ff4757';
        ctx.fillRect(e.x, e.y, e.w, e.h);
        // Check bullet hit
        bullets.forEach((b, bi) => {
            if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                e.alive = false; bullets.splice(bi, 1); score++; scoreEl.textContent = score;
            }
        });
        if (e.y + e.h >= player.y) { ctx.fillStyle = '#fff'; ctx.font = '30px Inter'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', W / 2, H / 2); return; }
    });
    if (edgeHit) { enemyDir *= -1; enemies.forEach(e => { if (e.alive) e.y += 15; }); }
    if (enemies.every(e => !e.alive)) { score += 50; scoreEl.textContent = score; spawnEnemies(); enemySpeed += 0.2; }
    frame++;
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => { keys[e.key] = true; if (e.key === ' ') { e.preventDefault(); bullets.push({ x: player.x + player.w / 2 - 1, y: player.y }); } });
document.addEventListener('keyup', e => { keys[e.key] = false; });

// Touch controls
let touchX = null;
canvas.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; bullets.push({ x: player.x + player.w / 2 - 1, y: player.y }); }, { passive: true });
canvas.addEventListener('touchmove', e => {
    const rect = canvas.getBoundingClientRect();
    player.x = (e.touches[0].clientX - rect.left) / rect.width * W - player.w / 2;
    player.x = Math.max(0, Math.min(W - player.w, player.x));
}, { passive: true });

spawnEnemies(); loop();
