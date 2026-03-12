(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const livesEl = document.getElementById('lives');
    const msgEl = document.getElementById('msg');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const isLight = () => document.documentElement.classList.contains('light-theme');

    const W = 480, H = 400;
    canvas.width = W; canvas.height = H;

    const COLORS = [
        '#ff4757', '#ff6b81', '#ffa502', '#ffdd59', '#2ed573',
        '#1e90ff', '#a55eea', '#e056fd', '#00d2d3', '#ff9f43'
    ];

    let ball, paddle, bricks, particles, score, lives, level, running, animId, keys;

    function initLevel() {
        const cols = Math.min(8 + Math.floor(level / 2), 12);
        const rows = Math.min(4 + level, 8);
        const bw = (W - 20) / cols - 4;
        const bh = 16;
        bricks = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                bricks.push({
                    x: c * (bw + 4) + 12,
                    y: r * (bh + 4) + 35,
                    w: bw, h: bh,
                    alive: true,
                    color: COLORS[r % COLORS.length],
                    hp: r < 2 && level > 2 ? 2 : 1
                });
            }
        }
    }

    function init() {
        score = 0; lives = 3; level = 1;
        scoreEl.textContent = 0; livesEl.textContent = '❤❤❤'; levelEl.textContent = 1;
        running = false; keys = {};
        particles = [];
        gameoverOverlay.classList.add('hidden');
        resetBall();
        initLevel();
        render();
        msgEl.textContent = 'Click or Tap to Start';
    }

    function resetBall() {
        paddle = { x: W / 2 - 45, y: H - 22, w: 90, h: 10 };
        const speed = 3 + level * 0.3;
        ball = { x: W / 2, y: H - 38, r: 6, dx: speed * (Math.random() > 0.5 ? 1 : -1), dy: -speed };
    }

    function spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 2.5;
            particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 15 + Math.random() * 15, color });
        }
    }

    function render() {
        const bgColor = isLight() ? 'rgba(230,235,240,.98)' : 'rgba(10,14,24,.98)';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, W, H);

        // Bricks
        bricks.forEach(b => {
            if (!b.alive) return;
            ctx.fillStyle = b.color;
            ctx.globalAlpha = b.hp > 1 ? 1 : 0.85;
            ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 3); ctx.fill();
            if (b.hp > 1) {
                ctx.strokeStyle = 'rgba(255,255,255,.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        });

        // Paddle
        const paddleColor = isLight() ? '#0056b3' : '#58a6ff';
        ctx.fillStyle = paddleColor;
        ctx.beginPath(); ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 5); ctx.fill();

        // Ball
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
        // Ball glow
        ctx.fillStyle = isLight() ? 'rgba(0,86,179,.2)' : 'rgba(88,166,255,.2)';
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r + 4, 0, Math.PI * 2); ctx.fill();

        // Particles
        particles.forEach(p => {
            ctx.globalAlpha = p.life / 30;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
        });
        ctx.globalAlpha = 1;
    }

    function update() {
        // Keyboard paddle
        const paddleSpeed = 7;
        if (keys['ArrowLeft'] || keys['a']) paddle.x -= paddleSpeed;
        if (keys['ArrowRight'] || keys['d']) paddle.x += paddleSpeed;
        paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));

        ball.x += ball.dx; ball.y += ball.dy;

        // Wall bounce
        if (ball.x - ball.r < 0) { ball.x = ball.r; ball.dx = Math.abs(ball.dx); }
        if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.dx = -Math.abs(ball.dx); }
        if (ball.y - ball.r < 0) { ball.y = ball.r; ball.dy = Math.abs(ball.dy); }

        // Lost ball
        if (ball.y + ball.r > H) {
            lives--;
            livesEl.textContent = '❤'.repeat(Math.max(0, lives));
            if (lives <= 0) {
                running = false;
                document.getElementById('go-icon').textContent = '💥';
                document.getElementById('go-title').textContent = 'Game Over';
                document.getElementById('final-score').textContent = score;
                document.getElementById('final-level').textContent = level;
                gameoverOverlay.classList.remove('hidden');
                return;
            }
            resetBall();
            running = false;
            msgEl.textContent = `${lives} lives left. Click to continue.`;
            render();
            return;
        }

        // Paddle collision
        if (ball.dy > 0 && ball.y + ball.r >= paddle.y && ball.y + ball.r <= paddle.y + paddle.h + 4 &&
            ball.x >= paddle.x - ball.r && ball.x <= paddle.x + paddle.w + ball.r) {
            ball.dy = -Math.abs(ball.dy);
            // Angle based on hit position
            const hitPos = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
            ball.dx = hitPos * (4 + level * 0.2);
            ball.y = paddle.y - ball.r;
        }

        // Brick collisions
        for (const b of bricks) {
            if (!b.alive) continue;
            if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
                ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
                b.hp--;
                if (b.hp <= 0) {
                    b.alive = false;
                    score += 10 * level;
                    scoreEl.textContent = score;
                    spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.color, 6);
                }

                // Determine bounce direction
                const overlapLeft = ball.x + ball.r - b.x;
                const overlapRight = b.x + b.w - (ball.x - ball.r);
                const overlapTop = ball.y + ball.r - b.y;
                const overlapBottom = b.y + b.h - (ball.y - ball.r);
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                if (minOverlap === overlapTop || minOverlap === overlapBottom) ball.dy = -ball.dy;
                else ball.dx = -ball.dx;
                break;
            }
        }

        // Particles
        particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; });
        particles = particles.filter(p => p.life > 0);

        // Level clear
        if (bricks.every(b => !b.alive)) {
            level++;
            levelEl.textContent = level;
            running = false;
            resetBall();
            initLevel();
            render();
            msgEl.textContent = `Level ${level}! Click to start.`;
            return;
        }

        render();
    }

    function loop() {
        if (!running) return;
        update();
        animId = requestAnimationFrame(loop);
    }

    // Mouse
    const canvasWrap = canvas.parentElement;
    canvasWrap.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        paddle.x = (e.clientX - rect.left) / rect.width * W - paddle.w / 2;
        paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
    });

    // Touch
    canvasWrap.addEventListener('touchmove', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        paddle.x = (e.touches[0].clientX - rect.left) / rect.width * W - paddle.w / 2;
        paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
    }, { passive: false });

    // Click to start
    canvasWrap.addEventListener('click', () => {
        if (!running && document.getElementById('gameover-overlay').classList.contains('hidden')) {
            running = true;
            msgEl.textContent = '';
            loop();
        }
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
        if (e.key === ' ' && !running && gameoverOverlay.classList.contains('hidden')) {
            running = true;
            msgEl.textContent = '';
            loop();
        }
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });

    // Buttons
    document.getElementById('play-again-btn').addEventListener('click', init);

    // Help
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

    // Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
    });

    init();
})();
