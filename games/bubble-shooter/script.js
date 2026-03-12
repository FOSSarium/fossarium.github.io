(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const remainingEl = document.getElementById('remaining');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const isLight = () => document.documentElement.classList.contains('light-theme');

    const COLS = 10, ROWS = 12, BUBBLE_COLORS = ['#ff4757','#2ed573','#1e90ff','#ffa502','#a55eea','#ff6b81'];
    let W, H, R, grid, shooter, moving, score, aimAngle, gameOver;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = Math.floor(rect.width); H = Math.floor(rect.width * 1.3);
        canvas.width = W; canvas.height = H;
        R = W / (COLS * 2);
    }

    function randColor() { return BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]; }

    function initGrid() {
        grid = [];
        for (let r = 0; r < 6; r++) {
            grid[r] = [];
            const cols = r % 2 === 0 ? COLS : COLS - 1;
            for (let c = 0; c < cols; c++) grid[r][c] = { color: randColor() };
        }
        for (let r = 6; r < ROWS; r++) {
            grid[r] = [];
            const cols = r % 2 === 0 ? COLS : COLS - 1;
            for (let c = 0; c < cols; c++) grid[r][c] = null;
        }
    }

    function getBubblePos(r, c) {
        const offset = r % 2 === 0 ? R : R * 2;
        return { x: offset + c * R * 2, y: R + r * R * 1.73 };
    }

    function countBubbles() {
        let count = 0;
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < (r % 2 === 0 ? COLS : COLS - 1); c++) if (grid[r] && grid[r][c]) count++;
        return count;
    }

    function newGame() {
        resize(); initGrid();
        score = 0; gameOver = false; moving = null;
        aimAngle = -Math.PI / 2;
        shooter = { color: randColor(), next: randColor() };
        gameoverOverlay.classList.add('hidden');
        updateUI(); render();
    }

    function updateUI() {
        scoreEl.textContent = score;
        remainingEl.textContent = countBubbles();
    }

    function drawBubble(x, y, color, radius) {
        ctx.beginPath(); ctx.arc(x, y, radius * 0.92, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        // Shine
        ctx.beginPath(); ctx.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill();
    }

    function render() {
        const bg = isLight() ? '#e8ecf2' : '#0a0e18';
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // Grid bubbles
        for (let r = 0; r < ROWS; r++) {
            const cols = r % 2 === 0 ? COLS : COLS - 1;
            for (let c = 0; c < cols; c++) {
                if (grid[r] && grid[r][c]) {
                    const { x, y } = getBubblePos(r, c);
                    drawBubble(x, y, grid[r][c].color, R);
                }
            }
        }

        // Aim line
        const shooterX = W / 2, shooterY = H - R * 2;
        ctx.strokeStyle = isLight() ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(shooterX, shooterY);
        ctx.lineTo(shooterX + Math.cos(aimAngle) * 120, shooterY + Math.sin(aimAngle) * 120);
        ctx.stroke(); ctx.setLineDash([]);

        // Moving bubble
        if (moving) drawBubble(moving.x, moving.y, moving.color, R);

        // Shooter
        drawBubble(shooterX, shooterY, shooter.color, R);
        drawBubble(shooterX + R * 2.5, shooterY, shooter.next, R * 0.65);
        ctx.fillStyle = var_muted(); ctx.font = `${R * 0.5}px Inter`; ctx.textAlign = 'left';
        ctx.fillText('next', shooterX + R * 2.5 - R * 0.6, shooterY + R * 1.3);
    }

    function var_muted() { return isLight() ? '#6c757d' : '#8b949e'; }

    function getGridPos(x, y) {
        let bestR = -1, bestC = -1, bestDist = Infinity;
        for (let r = 0; r < ROWS; r++) {
            const cols = r % 2 === 0 ? COLS : COLS - 1;
            for (let c = 0; c < cols; c++) {
                const p = getBubblePos(r, c);
                const d = Math.hypot(x - p.x, y - p.y);
                if (d < bestDist) { bestDist = d; bestR = r; bestC = c; }
            }
        }
        return { r: bestR, c: bestC };
    }

    function getNeighbors(r, c) {
        const n = [];
        const even = r % 2 === 0;
        const deltas = even
            ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
            : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
        for (const [dr, dc] of deltas) {
            const nr = r + dr, nc = c + dc;
            const cols = nr % 2 === 0 ? COLS : COLS - 1;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < cols) n.push({ r: nr, c: nc });
        }
        return n;
    }

    function findCluster(r, c, color) {
        const visited = new Set(), cluster = [];
        const stack = [{ r, c }];
        while (stack.length) {
            const { r: cr, c: cc } = stack.pop();
            const key = `${cr},${cc}`;
            if (visited.has(key)) continue;
            visited.add(key);
            if (!grid[cr] || !grid[cr][cc] || grid[cr][cc].color !== color) continue;
            cluster.push({ r: cr, c: cc });
            for (const n of getNeighbors(cr, cc)) stack.push(n);
        }
        return cluster;
    }

    function removeFloating() {
        const connected = new Set();
        // BFS from top row
        const stack = [];
        for (let c = 0; c < COLS; c++) {
            if (grid[0] && grid[0][c]) stack.push({ r: 0, c });
        }
        while (stack.length) {
            const { r, c } = stack.pop();
            const key = `${r},${c}`;
            if (connected.has(key)) continue;
            connected.add(key);
            for (const n of getNeighbors(r, c)) {
                if (grid[n.r] && grid[n.r][n.c]) stack.push(n);
            }
        }
        let removed = 0;
        for (let r = 0; r < ROWS; r++) {
            const cols = r % 2 === 0 ? COLS : COLS - 1;
            for (let c = 0; c < cols; c++) {
                if (grid[r] && grid[r][c] && !connected.has(`${r},${c}`)) {
                    grid[r][c] = null; removed++;
                }
            }
        }
        return removed;
    }

    function shoot() {
        if (moving || gameOver) return;
        const shooterX = W / 2, shooterY = H - R * 2;
        moving = {
            x: shooterX, y: shooterY,
            vx: Math.cos(aimAngle) * 10,
            vy: Math.sin(aimAngle) * 10,
            color: shooter.color
        };
        shooter.color = shooter.next;
        shooter.next = randColor();
    }

    function update() {
        if (!moving) return;
        moving.x += moving.vx; moving.y += moving.vy;
        // Wall bounce
        if (moving.x - R < 0) { moving.x = R; moving.vx = Math.abs(moving.vx); }
        if (moving.x + R > W) { moving.x = W - R; moving.vx = -Math.abs(moving.vx); }
        // Top ceiling
        if (moving.y - R < 0) { placeBubble(); return; }

        // Check collision with grid
        for (let r = 0; r < ROWS; r++) {
            const cols = r % 2 === 0 ? COLS : COLS - 1;
            for (let c = 0; c < cols; c++) {
                if (!grid[r] || !grid[r][c]) continue;
                const p = getBubblePos(r, c);
                if (Math.hypot(moving.x - p.x, moving.y - p.y) < R * 1.8) {
                    placeBubble(); return;
                }
            }
        }
    }

    function placeBubble() {
        const pos = getGridPos(moving.x, moving.y);
        if (!grid[pos.r]) grid[pos.r] = [];
        grid[pos.r][pos.c] = { color: moving.color };

        // Find cluster
        const cluster = findCluster(pos.r, pos.c, moving.color);
        if (cluster.length >= 3) {
            cluster.forEach(({ r, c }) => grid[r][c] = null);
            score += cluster.length * 10;
            const floaters = removeFloating();
            score += floaters * 15;
        }

        moving = null;
        updateUI();

        // Check game over / win
        if (countBubbles() === 0) {
            gameOver = true;
            document.getElementById('go-icon').textContent = '🎉';
            document.getElementById('go-title').textContent = 'You Win!';
            document.getElementById('final-score').textContent = score;
            gameoverOverlay.classList.remove('hidden');
        } else if (pos.r >= ROWS - 2) {
            gameOver = true;
            document.getElementById('go-icon').textContent = '💥';
            document.getElementById('go-title').textContent = 'Game Over';
            document.getElementById('final-score').textContent = score;
            gameoverOverlay.classList.remove('hidden');
        }
    }

    function loop() {
        update(); render();
        requestAnimationFrame(loop);
    }

    // Aim
    function updateAim(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width * W;
        const y = (clientY - rect.top) / rect.height * H;
        const shooterX = W / 2, shooterY = H - R * 2;
        aimAngle = Math.atan2(y - shooterY, x - shooterX);
        if (aimAngle > -0.1) aimAngle = -0.1;
        if (aimAngle < -Math.PI + 0.1) aimAngle = -Math.PI + 0.1;
    }

    canvas.addEventListener('mousemove', e => updateAim(e.clientX, e.clientY));
    canvas.addEventListener('click', e => { updateAim(e.clientX, e.clientY); shoot(); });
    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        updateAim(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        updateAim(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener('touchend', e => { e.preventDefault(); shoot(); }, { passive: false });

    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {}); else document.exitFullscreen();
    });

    window.addEventListener('resize', () => { resize(); render(); });
    newGame(); loop();
})();
