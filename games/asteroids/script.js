const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), scoreEl = document.getElementById('score');
const W = 500, H = 500;
let ship = { x: W / 2, y: H / 2, angle: -Math.PI / 2, vx: 0, vy: 0, r: 12 };
let bullets = [], asteroids = [], score = 0, keys = {};

function spawnAsteroids(n) {
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = 0.5 + Math.random();
        asteroids.push({ x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 30 + Math.random() * 15, sides: 7 + Math.floor(Math.random() * 4) });
    }
}

function drawShip() {
    ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle);
    ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(15, 0); ctx.lineTo(-10, -9); ctx.lineTo(-6, 0); ctx.lineTo(-10, 9); ctx.closePath(); ctx.stroke();
    if (keys['ArrowUp']) { ctx.strokeStyle = '#ffa502'; ctx.beginPath(); ctx.moveTo(-8, -4); ctx.lineTo(-16, 0); ctx.lineTo(-8, 4); ctx.stroke(); }
    ctx.restore();
}

function wrap(obj) { if (obj.x < -20) obj.x = W + 20; if (obj.x > W + 20) obj.x = -20; if (obj.y < -20) obj.y = H + 20; if (obj.y > H + 20) obj.y = -20; }

function loop() {
    ctx.clearRect(0, 0, W, H);
    // Ship controls
    if (keys['ArrowLeft']) ship.angle -= 0.05;
    if (keys['ArrowRight']) ship.angle += 0.05;
    if (keys['ArrowUp']) { ship.vx += Math.cos(ship.angle) * 0.1; ship.vy += Math.sin(ship.angle) * 0.1; }
    ship.vx *= 0.99; ship.vy *= 0.99;
    ship.x += ship.vx; ship.y += ship.vy; wrap(ship);
    drawShip();

    // Bullets
    bullets.forEach(b => { b.x += b.vx; b.y += b.vy; b.life--; ctx.fillStyle = '#2ed573'; ctx.beginPath(); ctx.arc(b.x, b.y, 2, 0, Math.PI * 2); ctx.fill(); });
    bullets = bullets.filter(b => b.life > 0 && b.x >= 0 && b.x <= W && b.y >= 0 && b.y <= H);

    // Asteroids
    asteroids.forEach(a => {
        a.x += a.vx; a.y += a.vy; wrap(a);
        ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1.5; ctx.beginPath();
        for (let i = 0; i <= a.sides; i++) { const ang = (i / a.sides) * Math.PI * 2; const px = a.x + Math.cos(ang) * a.r; const py = a.y + Math.sin(ang) * a.r; i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
        ctx.closePath(); ctx.stroke();
        // Collision with ship
        const dx = ship.x - a.x, dy = ship.y - a.y;
        if (Math.sqrt(dx * dx + dy * dy) < a.r + ship.r) { ship.x = W / 2; ship.y = H / 2; ship.vx = 0; ship.vy = 0; }
    });

    // Bullet-asteroid
    bullets.forEach((b, bi) => {
        asteroids.forEach((a, ai) => {
            const dx = b.x - a.x, dy = b.y - a.y;
            if (Math.sqrt(dx * dx + dy * dy) < a.r) {
                bullets.splice(bi, 1); score += 10; scoreEl.textContent = score;
                if (a.r > 18) { for (let k = 0; k < 2; k++) { const ang = Math.random() * Math.PI * 2; asteroids.push({ x: a.x, y: a.y, vx: Math.cos(ang) * 1.5, vy: Math.sin(ang) * 1.5, r: a.r * 0.55, sides: a.sides }); } }
                asteroids.splice(ai, 1);
            }
        });
    });

    if (asteroids.length === 0) { spawnAsteroids(5 + Math.floor(score / 50)); }
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => { keys[e.key] = true; if (e.key === ' ') { e.preventDefault(); bullets.push({ x: ship.x + Math.cos(ship.angle) * 15, y: ship.y + Math.sin(ship.angle) * 15, vx: Math.cos(ship.angle) * 7, vy: Math.sin(ship.angle) * 7, life: 60 }); } });
document.addEventListener('keyup', e => { keys[e.key] = false; });

spawnAsteroids(5); loop();
