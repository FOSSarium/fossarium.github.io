(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const isLight = () => document.documentElement.classList.contains('light-theme');

    let W, H;
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = H = Math.floor(rect.width);
        canvas.width = W;
        canvas.height = H;
    }
    resize();
    window.addEventListener('resize', resize);

    const nest = { x: 0, y: 0 };
    function updateNest() { nest.x = W / 2; nest.y = H / 2; }
    updateNest();

    let ants = [], foodSources = [], obstacles = [], pheromoneGrid = [];
    let foodCollected = 0, paused = false, speed = 1;
    let antCount = 50;
    const GRID_RES = 4;

    function initPheromones() {
        const cols = Math.ceil(W / GRID_RES), rows = Math.ceil(H / GRID_RES);
        pheromoneGrid = new Float32Array(cols * rows);
    }

    function setPheromone(x, y, val) {
        const col = Math.floor(x / GRID_RES), row = Math.floor(y / GRID_RES);
        const cols = Math.ceil(W / GRID_RES);
        if (col >= 0 && col < cols && row >= 0 && row < Math.ceil(H / GRID_RES)) {
            const idx = row * cols + col;
            pheromoneGrid[idx] = Math.min(pheromoneGrid[idx] + val, 1);
        }
    }

    function getPheromone(x, y) {
        const col = Math.floor(x / GRID_RES), row = Math.floor(y / GRID_RES);
        const cols = Math.ceil(W / GRID_RES);
        if (col >= 0 && col < cols && row >= 0 && row < Math.ceil(H / GRID_RES)) {
            return pheromoneGrid[row * cols + col];
        }
        return 0;
    }

    function createAnts(count) {
        updateNest();
        ants = [];
        for (let i = 0; i < count; i++) {
            ants.push({
                x: nest.x, y: nest.y,
                angle: Math.random() * Math.PI * 2,
                hasFood: false,
                speed: 1.2 + Math.random() * 0.8
            });
        }
    }

    function spawnInitialFood() {
        foodSources = [];
        const pad = W * 0.15;
        for (let i = 0; i < 3; i++) {
            foodSources.push({
                x: pad + Math.random() * (W - 2 * pad),
                y: pad + Math.random() * (H - 2 * pad),
                amount: 40 + Math.floor(Math.random() * 30)
            });
        }
    }

    function isObstacle(x, y) {
        for (const o of obstacles) {
            const dx = x - o.x, dy = y - o.y;
            if (dx * dx + dy * dy < o.r * o.r) return true;
        }
        return false;
    }

    function initSim() {
        resize(); updateNest(); initPheromones();
        foodCollected = 0;
        obstacles = [];
        createAnts(antCount);
        spawnInitialFood();
        updateUI();
    }

    function updateUI() {
        document.getElementById('food-collected').textContent = foodCollected;
        document.getElementById('ant-count').textContent = ants.length;
        document.getElementById('food-sources').textContent = foodSources.filter(f => f.amount > 0).length;
    }

    function tick() {
        if (paused) { requestAnimationFrame(tick); return; }

        const bgColor = isLight() ? '#f0f4f9' : '#050510';
        ctx.fillStyle = bgColor;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;

        // Draw pheromones
        const cols = Math.ceil(W / GRID_RES);
        const rows = Math.ceil(H / GRID_RES);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const val = pheromoneGrid[r * cols + c];
                if (val > 0.02) {
                    ctx.fillStyle = isLight()
                        ? `rgba(49, 130, 206, ${val * 0.4})`
                        : `rgba(88, 166, 255, ${val * 0.5})`;
                    ctx.fillRect(c * GRID_RES, r * GRID_RES, GRID_RES, GRID_RES);
                }
            }
        }

        // Decay pheromones
        for (let i = 0; i < pheromoneGrid.length; i++) {
            pheromoneGrid[i] *= 0.997;
        }

        // Draw nest
        ctx.fillStyle = isLight() ? '#8B6914' : '#b8860b';
        ctx.beginPath(); ctx.arc(nest.x, nest.y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isLight() ? 'rgba(139,105,20,.15)' : 'rgba(184,134,11,.15)';
        ctx.beginPath(); ctx.arc(nest.x, nest.y, 28, 0, Math.PI * 2); ctx.fill();

        // Draw food
        foodSources.forEach(f => {
            if (f.amount <= 0) return;
            ctx.fillStyle = '#2ed573';
            ctx.beginPath(); ctx.arc(f.x, f.y, 4 + f.amount / 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(46,213,115,.2)';
            ctx.beginPath(); ctx.arc(f.x, f.y, 8 + f.amount / 8, 0, Math.PI * 2); ctx.fill();
        });

        // Draw obstacles
        ctx.fillStyle = isLight() ? 'rgba(49, 130, 206, .25)' : 'rgba(88, 166, 255, .25)';
        obstacles.forEach(o => { ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill(); });

        // Update ants
        for (let s = 0; s < speed; s++) {
            ants.forEach(a => {
                a.angle += (Math.random() - 0.5) * 0.5;

                if (a.hasFood) {
                    // Head home
                    const dx = nest.x - a.x, dy = nest.y - a.y, d = Math.hypot(dx, dy);
                    a.angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.2;
                    setPheromone(a.x, a.y, 0.15);
                    if (d < 16) {
                        a.hasFood = false;
                        foodCollected++;
                    }
                } else {
                    // Search for food — follow pheromones or wander
                    let closest = null, minD = W * 0.15;
                    foodSources.forEach(f => {
                        if (f.amount <= 0) return;
                        const d = Math.hypot(f.x - a.x, f.y - a.y);
                        if (d < minD) { minD = d; closest = f; }
                    });

                    if (closest) {
                        a.angle = Math.atan2(closest.y - a.y, closest.x - a.x) + (Math.random() - 0.5) * 0.25;
                        if (minD < 8) { a.hasFood = true; closest.amount--; }
                    } else {
                        // Follow pheromone
                        let bestAngle = a.angle, bestPhero = 0;
                        for (let k = -2; k <= 2; k++) {
                            const testAngle = a.angle + k * 0.4;
                            const tx = a.x + Math.cos(testAngle) * 12;
                            const ty = a.y + Math.sin(testAngle) * 12;
                            const p = getPheromone(tx, ty);
                            if (p > bestPhero) { bestPhero = p; bestAngle = testAngle; }
                        }
                        if (bestPhero > 0.05) a.angle = bestAngle + (Math.random() - 0.5) * 0.3;
                    }
                }

                const nx = a.x + Math.cos(a.angle) * a.speed;
                const ny = a.y + Math.sin(a.angle) * a.speed;

                if (!isObstacle(nx, ny)) {
                    a.x = nx; a.y = ny;
                } else {
                    a.angle += Math.PI * 0.5 + Math.random() * Math.PI;
                }

                // Bounce off walls
                if (a.x < 2 || a.x > W - 2) a.angle = Math.PI - a.angle;
                if (a.y < 2 || a.y > H - 2) a.angle = -a.angle;
                a.x = Math.max(2, Math.min(W - 2, a.x));
                a.y = Math.max(2, Math.min(H - 2, a.y));
            });
        }

        // Draw ants
        ants.forEach(a => {
            ctx.fillStyle = a.hasFood ? '#2ed573' : (isLight() ? '#3182ce' : '#58a6ff');
            ctx.fillRect(a.x - 1.5, a.y - 1.5, 3, 3);
        });

        updateUI();
        requestAnimationFrame(tick);
    }

    // Canvas interactions
    canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width, scaleY = H / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        foodSources.push({ x, y, amount: 40 + Math.floor(Math.random() * 20) });
    });

    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width, scaleY = H / rect.height;
        obstacles.push({
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            r: 12
        });
    });

    let rightDrag = false;
    canvas.addEventListener('mousedown', e => { if (e.button === 2) rightDrag = true; });
    canvas.addEventListener('mouseup', e => { if (e.button === 2) rightDrag = false; });
    canvas.addEventListener('mousemove', e => {
        if (!rightDrag) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width, scaleY = H / rect.height;
        obstacles.push({
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            r: 8
        });
    });

    // Sliders
    const antSlider = document.getElementById('ant-slider');
    const speedSlider = document.getElementById('speed-slider');
    antSlider.addEventListener('input', () => {
        antCount = parseInt(antSlider.value);
        document.getElementById('ant-slider-val').textContent = antCount;
        createAnts(antCount);
    });
    speedSlider.addEventListener('input', () => {
        speed = parseFloat(speedSlider.value);
        document.getElementById('speed-slider-val').textContent = speed.toFixed(1);
    });

    // Buttons
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.addEventListener('click', () => {
        paused = !paused;
        pauseBtn.textContent = paused ? '▶ Play' : '⏸ Pause';
    });
    document.getElementById('reset-btn').addEventListener('click', initSim);

    // Help
    const helpOverlay = document.getElementById('help-overlay');
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

    // Fullscreen
    const fsBtn = document.getElementById('fullscreen-btn');
    const exitFsBtn = document.getElementById('exit-fs-btn');
    const gameRoot = document.getElementById('game-root');

    fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            gameRoot.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    });

    exitFsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fsBtn.classList.add('hidden');
            resize(); // Force resize on FS entry
        } else {
            fsBtn.classList.remove('hidden');
            resize(); // Force resize on FS exit
        }
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');
    
    function updateThemeIcon() {
        if (document.documentElement.classList.contains('light-theme')) {
            themeIcon.setAttribute('name', 'moon-outline');
        } else {
            themeIcon.setAttribute('name', 'sunny-outline');
        }
    }

    updateThemeIcon();

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        updateThemeIcon();
    });

    initSim();
    tick();
})();
