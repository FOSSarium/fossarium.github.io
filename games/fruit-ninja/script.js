(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const livesEl = document.getElementById('lives');
    const msgEl = document.getElementById('msg');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const W = 480, H = 360;
    canvas.width = W;
    canvas.height = H;
    const FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍑', '🥝', '🍌', '🫐'];
    
    let best = parseInt(localStorage.getItem('fossarium-fruitninja-best') || '0');
    bestEl.textContent = best;
    let items = [], slashTrail = [], particles = [];
    let score = 0, lives = 3, frame = 0;
    let running = false, started = false;

    function isLight() {
        return document.documentElement.classList.contains('light-theme');
    }

    function init() {
        items = [];
        slashTrail = [];
        particles = [];
        score = 0;
        lives = 3;
        frame = 0;
        running = false;
        started = false;
        gameoverOverlay.classList.add('hidden');
        scoreEl.textContent = 0;
        livesEl.textContent = '❤❤❤';
        msgEl.textContent = 'Click or Swipe to Start';
        render();
    }

    function spawnItem() {
        const isBomb = Math.random() < 0.08; // 8% bombs
        const x = 100 + Math.random() * (W - 200); // Center spawn zone
        items.push({
            emoji: isBomb ? '💣' : FRUITS[Math.floor(Math.random() * FRUITS.length)],
            bomb: isBomb,
            x: x,
            y: H + 30,
            vx: (Math.random() - 0.5) * 1.5, // Minimal horizontal movement
            vy: -(7 + Math.random() * 2), // Consistent upward speed
            r: 25,
            sliced: false,
            marked: false // Track if already counted
        });
    }

    function render() {
        const bg = isLight() ? '#e8ecf2' : '#0a0e18';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Slash trail
        if (slashTrail.length > 1) {
            ctx.strokeStyle = isLight() ? 'rgba(0,86,179,.4)' : 'rgba(88,166,255,.4)';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(slashTrail[0].x, slashTrail[0].y);
            for (let i = 1; i < slashTrail.length; i++) {
                ctx.lineTo(slashTrail[i].x, slashTrail[i].y);
            }
            ctx.stroke();
        }

        // Items
        items.forEach(item => {
            if (item.sliced) return;
            ctx.font = `${item.r * 2}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.emoji, item.x, item.y);
        });

        // Particles
        particles.forEach(p => {
            ctx.globalAlpha = p.life / 20;
            ctx.font = `${p.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.emoji, p.x, p.y);
        });
        ctx.globalAlpha = 1;
    }

    function update() {
        frame++;

        // Spawn items
        if (frame % 45 === 0) spawnItem();

        // Move items
        items.forEach(item => {
            if (item.sliced) return;
            item.x += item.vx;
            item.y += item.vy;
            item.vy += 0.12; // Light gravity
        });

        // Check missed - ONLY if fruit goes below visible area significantly
        items.forEach(item => {
            if (item.sliced || item.bomb || item.marked) return;
            if (item.y > H + 80) {
                item.marked = true;
                lives--;
                livesEl.textContent = '❤'.repeat(Math.max(0, lives));
                if (lives <= 0) {
                    gameOver();
                }
            }
        });

        // Clean up - remove sliced and off-screen items
        items = items.filter(i => !i.sliced && i.y < H + 100 && i.x > -100 && i.x < W + 100);

        // Particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.life--;
        });
        particles = particles.filter(p => p.life > 0);

        // Trail
        if (slashTrail.length > 6) slashTrail.shift();

        render();
    }

    function sliceAt(x, y) {
        items.forEach(item => {
            if (item.sliced || item.marked) return;
            
            const dist = Math.hypot(x - item.x, y - item.y);
            if (dist < 40) { // Very generous hit radius
                item.sliced = true;
                
                if (item.bomb) {
                    lives = 0;
                    livesEl.textContent = '';
                    for (let i = 0; i < 8; i++) {
                        particles.push({
                            emoji: '💥',
                            x: item.x,
                            y: item.y,
                            vx: (Math.random() - 0.5) * 6,
                            vy: (Math.random() - 0.5) * 6,
                            life: 20,
                            size: 20
                        });
                    }
                    gameOver();
                } else {
                    score++;
                    scoreEl.textContent = score;
                    for (let i = 0; i < 4; i++) {
                        particles.push({
                            emoji: '✨',
                            x: item.x,
                            y: item.y,
                            vx: (Math.random() - 0.5) * 4,
                            vy: (Math.random() - 0.5) * 4,
                            life: 15,
                            size: 12
                        });
                    }
                }
            }
        });
    }

    function gameOver() {
        running = false;
        if (score > best) {
            best = score;
            localStorage.setItem('fossarium-fruitninja-best', best);
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

    function startGame() {
        if (started) return;
        started = true;
        running = true;
        msgEl.textContent = '';
        loop();
    }

    function getCanvasPos(e) {
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX || (e.touches && e.touches[0].clientX);
        const cy = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (cx - rect.left) / rect.width * W,
            y: (cy - rect.top) / rect.height * H
        };
    }

    // Mouse controls
    canvas.addEventListener('mousedown', e => {
        startGame();
        const p = getCanvasPos(e);
        slashTrail = [p];
        sliceAt(p.x, p.y);
    });
    
    canvas.addEventListener('mousemove', e => {
        const p = getCanvasPos(e);
        slashTrail.push(p);
        sliceAt(p.x, p.y);
    });
    
    canvas.addEventListener('mouseup', () => {
        slashTrail = [];
    });

    // Touch controls
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        startGame();
        const p = getCanvasPos(e);
        slashTrail = [p];
        sliceAt(p.x, p.y);
    }, { passive: false });
    
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const p = getCanvasPos(e);
        slashTrail.push(p);
        sliceAt(p.x, p.y);
    }, { passive: false });
    
    canvas.addEventListener('touchend', () => {
        slashTrail = [];
    });

    // UI buttons
    document.getElementById('play-again-btn').addEventListener('click', init);
    
    document.getElementById('help-btn').addEventListener('click', () => {
        helpOverlay.classList.remove('hidden');
    });
    document.getElementById('close-help-btn').addEventListener('click', () => {
        helpOverlay.classList.add('hidden');
    });
    helpOverlay.addEventListener('click', e => {
        if (e.target === helpOverlay) helpOverlay.classList.add('hidden');
    });
    gameoverOverlay.addEventListener('click', e => {
        if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden');
    });

    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');

    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        themeIcon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        themeIcon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });

    init();
})();
