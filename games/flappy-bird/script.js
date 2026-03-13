(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const msgEl = document.getElementById('msg');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const isLight = () => document.documentElement.classList.contains('light-theme');

    const W = 320, H = 480;
    canvas.width = W; canvas.height = H;
    const PIPE_W = 45, GAP = 130, GRAVITY = 0.4, FLAP = -7, PIPE_SPEED = 2.5;
    let best = parseInt(localStorage.getItem('fossarium-flappy-best') || '0');
    bestEl.textContent = best;

    let bird, pipes, score, running, started, frame;

    function init() {
        bird = { x: 60, y: H / 2, vy: 0, r: 14 };
        pipes = []; score = 0; running = false; started = false; frame = 0;
        gameoverOverlay.classList.add('hidden');
        msgEl.textContent = 'Click or Space to Flap';
        scoreEl.textContent = 0;
        render();
    }

    function flap() {
        if (!started) { started = true; running = true; loop(); }
        if (running) bird.vy = FLAP;
        msgEl.textContent = '';
    }

    function spawnPipe() {
        const minY = 80, maxY = H - GAP - 80;
        const topH = minY + Math.random() * (maxY - minY);
        pipes.push({ x: W + 10, topH, scored: false });
    }

    function render() {
        // Sky gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        if (isLight()) {
            grad.addColorStop(0, '#87CEEB'); grad.addColorStop(1, '#e8ecf2');
        } else {
            grad.addColorStop(0, '#0a0e28'); grad.addColorStop(1, '#1a1040');
        }
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

        // Ground
        ctx.fillStyle = isLight() ? '#8B7355' : '#2a1a4a';
        ctx.fillRect(0, H - 20, W, 20);
        ctx.fillStyle = isLight() ? '#90EE90' : '#2ed573';
        ctx.fillRect(0, H - 22, W, 4);

        // Pipes
        pipes.forEach(p => {
            const pipeColor = isLight() ? '#2ed573' : '#00b894';
            const pipeEdge = isLight() ? '#27ae60' : '#00a885';
            // Top pipe
            ctx.fillStyle = pipeColor;
            ctx.fillRect(p.x, 0, PIPE_W, p.topH);
            ctx.fillStyle = pipeEdge;
            ctx.fillRect(p.x - 3, p.topH - 18, PIPE_W + 6, 18);
            // Bottom pipe
            const botY = p.topH + GAP;
            ctx.fillStyle = pipeColor;
            ctx.fillRect(p.x, botY, PIPE_W, H - botY - 20);
            ctx.fillStyle = pipeEdge;
            ctx.fillRect(p.x - 3, botY, PIPE_W + 6, 18);
        });

        // Bird
        ctx.save();
        ctx.translate(bird.x, bird.y);
        const angle = Math.min(Math.max(bird.vy * 3, -30), 90) * Math.PI / 180;
        ctx.rotate(angle);
        // Body
        ctx.fillStyle = '#ffa502';
        ctx.beginPath(); ctx.arc(0, 0, bird.r, 0, Math.PI * 2); ctx.fill();
        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(6, -4, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(7, -4, 2.5, 0, Math.PI * 2); ctx.fill();
        // Beak
        ctx.fillStyle = '#ff4757';
        ctx.beginPath(); ctx.moveTo(bird.r, -2); ctx.lineTo(bird.r + 8, 2); ctx.lineTo(bird.r, 5); ctx.fill();
        // Wing
        ctx.fillStyle = '#ffdd59';
        ctx.beginPath(); ctx.ellipse(-4, 4, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    function update() {
        frame++;
        bird.vy += GRAVITY;
        bird.y += bird.vy;

        // Spawn pipes
        if (frame % 90 === 0) spawnPipe();

        // Move pipes
        pipes.forEach(p => {
            p.x -= PIPE_SPEED;
            // Score
            if (!p.scored && p.x + PIPE_W < bird.x) {
                p.scored = true; score++;
                scoreEl.textContent = score;
            }
        });
        pipes = pipes.filter(p => p.x + PIPE_W > -10);

        // Collision
        if (bird.y + bird.r > H - 22 || bird.y - bird.r < 0) { gameOver(); return; }
        for (const p of pipes) {
            if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_W) {
                if (bird.y - bird.r < p.topH || bird.y + bird.r > p.topH + GAP) {
                    gameOver(); return;
                }
            }
        }

        render();
    }

    function gameOver() {
        running = false;
        if (score > best) {
            best = score;
            localStorage.setItem('fossarium-flappy-best', best);
            bestEl.textContent = best;
        }
        document.getElementById('final-score').textContent = score;
        gameoverOverlay.classList.remove('hidden');
    }

    function loop() {
        if (!running) return;
        update();
        requestAnimationFrame(loop);
    }

    canvas.parentElement.addEventListener('click', flap);
    document.addEventListener('keydown', e => {
        if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
    });

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
