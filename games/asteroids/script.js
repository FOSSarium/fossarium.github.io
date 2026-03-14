(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const waveEl = document.getElementById('wave');
    const livesEl = document.getElementById('lives');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const exitFsBtn = document.getElementById('exit-fs-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const gameRoot = document.getElementById('game-root');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');

    const isLight = () => document.documentElement.classList.contains('light-theme');

    function updateThemeIcon() {
        if (isLight()) {
            themeIcon.setAttribute('name', 'moon-outline');
        } else {
            themeIcon.setAttribute('name', 'sunny-outline');
        }
    }

    let W, H;
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = H = Math.floor(rect.width);
        canvas.width = W; canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    let ship, bullets, asteroids, particles, score, lives, wave, keys, gameRunning, invulnTimer;

    function initGame() {
        score = 0; lives = 3; wave = 0; gameRunning = true; invulnTimer = 0;
        ship = { x: W / 2, y: H / 2, angle: -Math.PI / 2, vx: 0, vy: 0, r: 12 };
        bullets = []; asteroids = []; particles = []; keys = {};
        scoreEl.textContent = 0; livesEl.textContent = '❤'.repeat(lives); waveEl.textContent = 1;
        gameoverOverlay.classList.add('hidden');
        nextWave();
    }

    function nextWave() {
        wave++;
        waveEl.textContent = wave;
        const count = 3 + wave;
        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = Math.random() * W; y = Math.random() * H;
            } while (Math.hypot(x - ship.x, y - ship.y) < 100);
            const a = Math.random() * Math.PI * 2;
            const sp = 0.5 + Math.random() * (0.5 + wave * 0.15);
            asteroids.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 28 + Math.random() * 12, sides: 7 + Math.floor(Math.random() * 4) });
        }
    }

    function spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 3;
            particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 20 + Math.random() * 20, color });
        }
    }

    function wrap(obj) {
        if (obj.x < -30) obj.x = W + 30;
        if (obj.x > W + 30) obj.x = -30;
        if (obj.y < -30) obj.y = H + 30;
        if (obj.y > H + 30) obj.y = -30;
    }

    function drawShip() {
        if (invulnTimer > 0 && Math.floor(invulnTimer / 4) % 2 === 0) return; // blink
        ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle);
        const shipColor = isLight() ? '#0056b3' : '#58a6ff';
        ctx.strokeStyle = shipColor; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(15, 0); ctx.lineTo(-10, -9); ctx.lineTo(-6, 0); ctx.lineTo(-10, 9); ctx.closePath(); ctx.stroke();
        if (keys['ArrowUp'] || keys['t-thrust']) {
            ctx.strokeStyle = '#ffa502'; ctx.lineWidth = 2; ctx.beginPath();
            ctx.moveTo(-8, -4); ctx.lineTo(-16 - Math.random() * 5, 0); ctx.lineTo(-8, 4); ctx.stroke();
        }
        ctx.restore();
    }

    function update() {
        if (!gameRunning) return;

        ctx.fillStyle = isLight() ? '#e4e8ee' : '#020208';
        ctx.fillRect(0, 0, W, H);

        // Ship controls
        if (keys['ArrowLeft'] || keys['a'] || keys['t-left']) ship.angle -= 0.06;
        if (keys['ArrowRight'] || keys['d'] || keys['t-right']) ship.angle += 0.06;
        if (keys['ArrowUp'] || keys['w'] || keys['t-thrust']) {
            ship.vx += Math.cos(ship.angle) * 0.12;
            ship.vy += Math.sin(ship.angle) * 0.12;
        }
        ship.vx *= 0.99; ship.vy *= 0.99;
        ship.x += ship.vx; ship.y += ship.vy;
        wrap(ship);
        if (invulnTimer > 0) invulnTimer--;
        drawShip();

        // Bullets
        bullets.forEach(b => {
            b.x += b.vx; b.y += b.vy; b.life--;
            ctx.fillStyle = '#2ed573'; ctx.beginPath(); ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2); ctx.fill();
        });
        bullets = bullets.filter(b => b.life > 0 && b.x >= -10 && b.x <= W + 10 && b.y >= -10 && b.y <= H + 10);

        // Asteroids
        const asteroidColor = isLight() ? '#6a5acd' : '#8a7aff';
        asteroids.forEach(a => {
            a.x += a.vx; a.y += a.vy; wrap(a);
            ctx.strokeStyle = asteroidColor; ctx.lineWidth = 1.5; ctx.beginPath();
            for (let i = 0; i <= a.sides; i++) {
                const ang = (i / a.sides) * Math.PI * 2;
                const px = a.x + Math.cos(ang) * a.r, py = a.y + Math.sin(ang) * a.r;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath(); ctx.stroke();
        });

        // Ship-asteroid collision
        if (invulnTimer <= 0) {
            for (const a of asteroids) {
                if (Math.hypot(ship.x - a.x, ship.y - a.y) < a.r + ship.r) {
                    lives--;
                    livesEl.textContent = '❤'.repeat(Math.max(0, lives));
                    spawnParticles(ship.x, ship.y, '#ff4757', 15);
                    if (lives <= 0) {
                        gameRunning = false;
                        document.getElementById('final-score').textContent = score;
                        document.getElementById('final-wave').textContent = wave;
                        gameoverOverlay.classList.remove('hidden');
                        return;
                    }
                    ship.x = W / 2; ship.y = H / 2; ship.vx = 0; ship.vy = 0;
                    invulnTimer = 90;
                    break;
                }
            }
        }

        // Bullet-asteroid collision
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
            const b = bullets[bi];
            for (let ai = asteroids.length - 1; ai >= 0; ai--) {
                const a = asteroids[ai];
                if (Math.hypot(b.x - a.x, b.y - a.y) < a.r) {
                    bullets.splice(bi, 1);
                    score += Math.round(100 / a.r * 10);
                    scoreEl.textContent = score;
                    spawnParticles(a.x, a.y, asteroidColor, 8);
                    if (a.r > 16) {
                        for (let k = 0; k < 2; k++) {
                            const ang = Math.random() * Math.PI * 2;
                            asteroids.push({ x: a.x, y: a.y, vx: Math.cos(ang) * 1.8, vy: Math.sin(ang) * 1.8, r: a.r * 0.55, sides: a.sides });
                        }
                    }
                    asteroids.splice(ai, 1);
                    break;
                }
            }
        }

        // Particles
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.life--;
            ctx.globalAlpha = p.life / 40;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
        });
        ctx.globalAlpha = 1;
        particles = particles.filter(p => p.life > 0);

        // Next wave
        if (asteroids.length === 0) nextWave();

        requestAnimationFrame(update);
    }

    // Keyboard
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (gameRunning) {
                bullets.push({
                    x: ship.x + Math.cos(ship.angle) * 15,
                    y: ship.y + Math.sin(ship.angle) * 15,
                    vx: Math.cos(ship.angle) * 7, vy: Math.sin(ship.angle) * 7, life: 55
                });
            }
        }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });

    // Touch controls
    ['t-left', 't-right', 't-thrust', 't-fire'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const addTouch = (name) => {
            btn.addEventListener('touchstart', e => { e.preventDefault(); keys[name] = true; if (name === 't-fire' && gameRunning) { bullets.push({ x: ship.x + Math.cos(ship.angle) * 15, y: ship.y + Math.sin(ship.angle) * 15, vx: Math.cos(ship.angle) * 7, vy: Math.sin(ship.angle) * 7, life: 55 }); }}, { passive: false });
            btn.addEventListener('touchend', e => { e.preventDefault(); keys[name] = false; }, { passive: false });
            btn.addEventListener('mousedown', () => { keys[name] = true; });
            btn.addEventListener('mouseup', () => { keys[name] = false; });
        };
        addTouch(id);
    });

    // Buttons
    document.getElementById('play-again-btn').addEventListener('click', () => { initGame(); requestAnimationFrame(update); });

    // Help
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            gameRoot.requestFullscreen().catch(err => console.warn(`Fullscreen request failed: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    });

    exitFsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenBtn.classList.add('hidden');
            exitFsBtn.classList.remove('hidden');
        } else {
            fullscreenBtn.classList.remove('hidden');
            exitFsBtn.classList.add('hidden');
        }
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        updateThemeIcon();
    });

    // Initial setup
    updateThemeIcon();
    // If already in fullscreen on load, adjust button visibility
    if (document.fullscreenElement) {
        fullscreenBtn.classList.add('hidden');
        exitFsBtn.classList.remove('hidden');
    }

    initGame();
    requestAnimationFrame(update);
})();
