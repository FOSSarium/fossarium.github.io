(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const msgEl = document.getElementById('msg');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const W = 600, H = 300;
    canvas.width = W * 2;
    canvas.height = H * 2;
    ctx.scale(2, 2);

    let helicopter, caves, score, best, running, thrusting, frame, gems;
    best = parseInt(localStorage.getItem('fossarium-helicopter-best') || '0');
    bestEl.textContent = best;

    function init() {
        helicopter = { x: 80, y: H / 2, vy: 0, width: 40, height: 20 };
        caves = [];
        gems = [];
        score = 0;
        running = false;
        thrusting = false;
        frame = 0;
        gameoverOverlay.classList.add('hidden');
        msgEl.textContent = 'Hold Click or Space to Fly';
        scoreEl.textContent = 0;
        // Pre-generate caves with x positions
        for (let i = 0; i < 10; i++) {
            caves.push({
                x: i * 100,
                top: 40 + Math.random() * 50,
                bottom: H - 50 - Math.random() * 50
            });
        }
        draw();
    }

    function thrust() {
        helicopter.vy -= 0.4;
    }

    function spawnCave() {
        const last = caves[caves.length - 1];
        const gapChange = (Math.random() - 0.5) * 30;
        const newTop = Math.max(20, Math.min(H - 100, last.top + gapChange));
        const newBottom = Math.max(newTop + 100, Math.min(H - 20, last.bottom + gapChange));
        const caveX = last.x + 100;
        caves.push({ x: caveX, top: newTop, bottom: newBottom });
        
        if (Math.random() < 0.3) {
            gems.push({ 
                x: caveX + 50, 
                y: newTop + (newBottom - newTop) / 2, 
                collected: false 
            });
        }
    }

    function draw() {
        const isLight = document.documentElement.classList.contains('light-theme');
        
        // Background
        ctx.fillStyle = isLight ? '#1a1a2e' : '#0a0e18';
        ctx.fillRect(0, 0, W, H);

        // Caves - scroll left based on frame
        ctx.fillStyle = isLight ? '#2d3436' : '#1a1a2e';
        caves.forEach(cave => {
            const drawX = cave.x - frame * 3;
            ctx.fillRect(drawX, 0, 102, cave.top);
            ctx.fillRect(drawX, cave.bottom, 102, H - cave.bottom);
        });

        // Gems - scroll with caves
        gems.forEach(gem => {
            if (gem.collected) return;
            const drawX = gem.x - frame * 3;
            if (drawX < -20) return;
            ctx.fillStyle = '#2ed573';
            ctx.beginPath();
            ctx.arc(drawX, gem.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#7bed9f';
            ctx.beginPath();
            ctx.arc(drawX - 2, gem.y - 2, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Helicopter
        const hx = helicopter.x;
        const hy = helicopter.y;
        
        // Body
        ctx.fillStyle = '#ff6b81';
        ctx.fillRect(hx, hy, helicopter.width, helicopter.height);
        
        // Tail
        ctx.fillRect(hx - 20, hy + 5, 20, 8);
        
        // Rotor
        ctx.fillStyle = '#a55eea';
        const rotorOffset = Math.sin(frame * 0.5) * 10;
        ctx.fillRect(hx + 10 - rotorOffset, hy - 8, 20 + rotorOffset * 2, 4);
        
        // Cockpit
        ctx.fillStyle = isLight ? '#dfe6e9' : '#636e72';
        ctx.beginPath();
        ctx.arc(hx + 30, hy + 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // Flame
        if (thrusting && running) {
            ctx.fillStyle = '#ffa502';
            ctx.beginPath();
            ctx.moveTo(hx - 20, hy + 9);
            ctx.lineTo(hx - 35 - Math.random() * 10, hy + 13);
            ctx.lineTo(hx - 20, hy + 17);
            ctx.fill();
        }
    }

    function update() {
        frame++;
        
        if (thrusting) thrust();
        
        helicopter.vy += 0.2; // Gravity
        helicopter.y += helicopter.vy;

        // Spawn caves
        if (frame % 30 === 0) spawnCave();

        // Check collisions - helicopter is at x:80, check against cave at that position
        const heliScreenX = helicopter.x;
        caves.forEach(cave => {
            const caveScreenX = cave.x - frame * 3;
            // Check if helicopter is within this cave's horizontal area
            if (heliScreenX + 20 > caveScreenX && heliScreenX - 20 < caveScreenX + 102) {
                if (helicopter.y < cave.top || helicopter.y + helicopter.height > cave.bottom) {
                    gameOver();
                }
            }
        });

        if (helicopter.y < 0 || helicopter.y + helicopter.height > H) {
            gameOver();
            return;
        }

        // Collect gems
        gems.forEach(gem => {
            if (gem.collected) return;
            const gemScreenX = gem.x - frame * 3;
            const dist = Math.hypot(gemScreenX - helicopter.x - 20, gem.y - helicopter.y - 10);
            if (dist < 25) {
                gem.collected = true;
                score += 5;
                scoreEl.textContent = score;
            }
        });

        // Remove off-screen caves and gems
        caves = caves.filter(c => c.x - frame * 3 < W + 150);
        gems = gems.filter(g => !g.collected && g.x - frame * 3 > -50);

        // Score based on distance traveled (frames survived)
        const distanceScore = Math.floor(frame / 10);
        if (distanceScore > score) {
            score = distanceScore;
            scoreEl.textContent = score;
        }

        draw();
    }

    function gameOver() {
        running = false;
        if (score > best) {
            best = score;
            localStorage.setItem('fossarium-helicopter-best', best);
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
        if (running) return;
        running = true;
        msgEl.textContent = '';
        loop();
    }

    // Controls
    canvas.addEventListener('mousedown', () => { thrusting = true; startGame(); });
    canvas.addEventListener('mouseup', () => { thrusting = false; });
    canvas.addEventListener('mouseleave', () => { thrusting = false; });
    
    canvas.addEventListener('touchstart', e => { e.preventDefault(); thrusting = true; startGame(); }, { passive: false });
    canvas.addEventListener('touchend', e => { e.preventDefault(); thrusting = false; });

    document.addEventListener('keydown', e => {
        if (e.code === 'Space') { e.preventDefault(); thrusting = true; startGame(); }
    });
    document.addEventListener('keyup', e => {
        if (e.code === 'Space') { e.preventDefault(); thrusting = false; }
    });

    document.getElementById('play-again-btn').addEventListener('click', init);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

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
