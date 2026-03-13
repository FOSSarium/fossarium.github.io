(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const msgEl = document.getElementById('msg');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const isLight = () => document.documentElement.classList.contains('light-theme');

    const W = 600, H = 200;
    canvas.width = W; canvas.height = H;
    const GROUND = H - 30;
    let best = parseInt(localStorage.getItem('fossarium-dino-best') || '0');
    bestEl.textContent = best;

    let dino, obstacles, clouds, score, speed, frame, running, started, ducking, particles;

    function init() {
        dino = { x: 50, y: GROUND, vy: 0, w: 25, h: 30, jumping: false };
        obstacles = []; clouds = []; particles = [];
        score = 0; speed = 4; frame = 0; running = false; started = false; ducking = false;
        gameoverOverlay.classList.add('hidden');
        msgEl.textContent = 'Click or Press Space to Start';
        scoreEl.textContent = 0;
        render();
    }

    function jump() {
        if (!dino.jumping) { dino.vy = -10; dino.jumping = true; }
    }

    function spawnObstacle() {
        const type = Math.random() < 0.3 && speed > 5 ? 'bird' : 'cactus';
        if (type === 'cactus') {
            const h = 20 + Math.random() * 25;
            obstacles.push({ type, x: W + 20, y: GROUND + dino.h - h, w: 15, h });
        } else {
            obstacles.push({ type, x: W + 20, y: GROUND - 20 - Math.random() * 20, w: 22, h: 14 });
        }
    }

    function render() {
        const bg = isLight() ? '#e8ecf2' : '#0a0e18';
        const fg = isLight() ? '#1a1a2e' : '#e6edf3';
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // Ground
        ctx.strokeStyle = isLight() ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(0, GROUND + dino.h); ctx.lineTo(W, GROUND + dino.h); ctx.stroke();

        // Ground detail
        for (let i = 0; i < W; i += 20) {
            const offset = (frame * speed * 0.5) % 20;
            ctx.fillStyle = isLight() ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)';
            ctx.fillRect(i - offset, GROUND + dino.h + 2, 8, 1);
        }

        // Clouds
        clouds.forEach(c => {
            ctx.fillStyle = isLight() ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)';
            ctx.beginPath(); ctx.arc(c.x, c.y, 12, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(c.x + 14, c.y - 2, 8, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(c.x + 10, c.y + 4, 7, 0, Math.PI * 2); ctx.fill();
        });

        // Dino
        const dinoH = ducking ? 15 : dino.h;
        const dinoW = ducking ? 35 : dino.w;
        const dinoY = ducking ? GROUND + dino.h - dinoH : dino.y;
        ctx.fillStyle = '#2ed573';
        ctx.fillRect(dino.x, dinoY, dinoW, dinoH);
        // Eye
        ctx.fillStyle = '#fff'; ctx.fillRect(dino.x + dinoW - 8, dinoY + 3, 6, 5);
        ctx.fillStyle = '#111'; ctx.fillRect(dino.x + dinoW - 5, dinoY + 4, 3, 3);

        // Obstacles
        obstacles.forEach(o => {
            if (o.type === 'cactus') {
                ctx.fillStyle = '#ff4757'; ctx.fillRect(o.x, o.y, o.w, o.h);
                ctx.fillStyle = '#e74c3c'; ctx.fillRect(o.x + 2, o.y, 3, o.h);
            } else {
                ctx.fillStyle = '#a55eea';
                ctx.beginPath();
                ctx.moveTo(o.x, o.y + o.h / 2);
                ctx.lineTo(o.x + o.w / 2, o.y);
                ctx.lineTo(o.x + o.w, o.y + o.h / 2);
                ctx.lineTo(o.x + o.w / 2, o.y + o.h);
                ctx.fill();
            }
        });

        // Particles
        particles.forEach(p => {
            ctx.globalAlpha = p.life / 15;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 3, 3);
        });
        ctx.globalAlpha = 1;
    }

    function update() {
        frame++;

        // Dino physics
        dino.vy += 0.55; dino.y += dino.vy;
        if (dino.y >= GROUND) { dino.y = GROUND; dino.jumping = false; dino.vy = 0; }

        // Clouds
        if (frame % 120 === 0) clouds.push({ x: W + 20, y: 20 + Math.random() * 40 });
        clouds.forEach(c => c.x -= speed * 0.3);
        clouds = clouds.filter(c => c.x > -30);

        // Obstacles
        if (frame % Math.max(30, 80 - Math.floor(score / 5)) === 0) spawnObstacle();
        obstacles.forEach(o => o.x -= speed);
        obstacles = obstacles.filter(o => o.x + o.w > -10);

        // Score
        if (frame % 8 === 0) { score++; scoreEl.textContent = score; }
        if (frame % 400 === 0) speed += 0.3;

        // Collision
        const dinoH = ducking ? 15 : dino.h;
        const dinoW = ducking ? 35 : dino.w;
        const dinoY = ducking ? GROUND + dino.h - dinoH : dino.y;
        for (const o of obstacles) {
            if (dino.x + dinoW > o.x + 3 && dino.x < o.x + o.w - 3 &&
                dinoY + dinoH > o.y + 3 && dinoY < o.y + o.h - 3) {
                gameOver();
                return;
            }
        }

        // Particles
        particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; });
        particles = particles.filter(p => p.life > 0);

        render();
    }

    function gameOver() {
        running = false;
        if (score > best) {
            best = score;
            localStorage.setItem('fossarium-dino-best', best);
            bestEl.textContent = best;
        }
        // Explosion particles
        for (let i = 0; i < 12; i++) {
            const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 3;
            particles.push({ x: dino.x + 12, y: dino.y + 15, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 15, color: '#2ed573' });
        }
        render();
        document.getElementById('final-score').textContent = score;
        gameoverOverlay.classList.remove('hidden');
        msgEl.textContent = '';
    }

    function loop() {
        if (!running) return;
        update();
        requestAnimationFrame(loop);
    }

    function startGame() {
        if (running) return;
        if (!started) {
            started = true; running = true;
            msgEl.textContent = '';
            loop();
        }
    }

    // Input
    document.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!running && started) return;
            startGame(); jump();
        }
        if (e.key === 'ArrowDown') { e.preventDefault(); ducking = true; }
    });
    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowDown') ducking = false;
    });

    canvas.parentElement.addEventListener('click', () => { startGame(); jump(); });

    // Buttons
    document.getElementById('play-again-btn').addEventListener('click', init);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {}); else document.exitFullscreen();
    });

    init();
})();
