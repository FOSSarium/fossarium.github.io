(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const turnEl = document.getElementById('turn');
    const movesEl = document.getElementById('moves');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const isLight = () => document.documentElement.classList.contains('light-theme');

    let W, H, cellR;
    const RED = 1, BLUE = 2;

    const rowConfig = [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1];
    let positions = [];
    let posMap = {};
    let board = {};

    function buildBoard() {
        positions = [];
        posMap = {};
        board = {};
        for (let r = 0; r < 17; r++) {
            const count = rowConfig[r];
            const maxWidth = 13;
            const startC = Math.floor((maxWidth - count) / 2);
            for (let i = 0; i < count; i++) {
                const c = startC + i;
                const key = `${r},${c}`;
                positions.push({ r, c, key });
                posMap[key] = { r, c };
                board[key] = 0;
            }
        }
    }

    function getTriangle(which) {
        const keys = [];
        if (which === 'top') {
            for (let r = 0; r < 4; r++) {
                const count = rowConfig[r];
                const start = Math.floor((13 - count) / 2);
                for (let i = 0; i < count; i++) keys.push(`${r},${start + i}`);
            }
        } else {
            for (let r = 13; r < 17; r++) {
                const count = rowConfig[r];
                const start = Math.floor((13 - count) / 2);
                for (let i = 0; i < count; i++) keys.push(`${r},${start + i}`);
            }
        }
        return keys;
    }

    let selected = null, highlights = [], totalMoves = 0, currentPlayer = RED, gameOver = false;

    function placeInitial() {
        getTriangle('top').forEach(k => board[k] = BLUE);
        getTriangle('bottom').forEach(k => board[k] = RED);
    }

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = H = Math.floor(rect.width);
        canvas.width = W; canvas.height = H;
        cellR = W / 30;
    }

    function getPos(r, c) {
        const x = W / 2 + (c - 6) * cellR * 2.1;
        const y = 20 + r * (H - 40) / 16;
        return { x, y };
    }

    function getNeighborKeys(r, c) {
        const n = [];
        const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]];
        for (const [dr, dc] of dirs) {
            const key = `${r + dr},${c + dc}`;
            if (posMap[key]) n.push({ r: r + dr, c: c + dc, key });
        }
        return n;
    }

    function getMoves(r, c) {
        const moves = [];
        const neighbors = getNeighborKeys(r, c);

        for (const n of neighbors) {
            if (board[n.key] === 0) moves.push({ ...n, jump: false });
        }

        const visited = new Set([`${r},${c}`]);
        const stack = [{ r, c }];
        while (stack.length) {
            const cur = stack.pop();
            const nbrs = getNeighborKeys(cur.r, cur.c);
            for (const n of nbrs) {
                if (board[n.key] !== 0) {
                    const hopR = n.r + (n.r - cur.r);
                    const hopC = n.c + (n.c - cur.c);
                    const hopKey = `${hopR},${hopC}`;
                    if (posMap[hopKey] && board[hopKey] === 0 && !visited.has(hopKey)) {
                        visited.add(hopKey);
                        moves.push({ r: hopR, c: hopC, key: hopKey, jump: true });
                        stack.push({ r: hopR, c: hopC });
                    }
                }
            }
        }
        return moves;
    }

    function checkWin() {
        const topTri = getTriangle('top');
        const botTri = getTriangle('bottom');
        if (topTri.every(k => board[k] === RED)) return RED;
        if (botTri.every(k => board[k] === BLUE)) return BLUE;
        return 0;
    }

    function render() {
        const bg = isLight() ? '#f8f9fa' : '#0a0e18';
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = isLight() ? 'rgba(88, 166, 255, 0.1)' : 'rgba(88, 166, 255, 0.05)';
        ctx.lineWidth = 1;
        for (const p of positions) {
            const pos = getPos(p.r, p.c);
            const nbrs = getNeighborKeys(p.r, p.c);
            for (const n of nbrs) {
                const npos = getPos(n.r, n.c);
                ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(npos.x, npos.y); ctx.stroke();
            }
        }

        for (const p of positions) {
            const pos = getPos(p.r, p.c);
            const isHighlight = highlights.some(h => h.key === p.key);
            const isSelected = selected && selected.key === p.key;

            ctx.beginPath(); ctx.arc(pos.x, pos.y, cellR * 0.55, 0, Math.PI * 2);
            if (isHighlight) ctx.fillStyle = 'rgba(46,213,115,.45)';
            else if (isSelected) ctx.fillStyle = 'rgba(255,165,0,.45)';
            else ctx.fillStyle = isLight() ? 'rgba(88, 166, 255, 0.08)' : 'rgba(88, 166, 255, 0.06)';
            ctx.fill();

            const val = board[p.key];
            if (val === RED) {
                ctx.beginPath(); ctx.arc(pos.x, pos.y, cellR * 0.5, 0, Math.PI * 2);
                const g = ctx.createRadialGradient(pos.x - 2, pos.y - 2, 1, pos.x, pos.y, cellR * 0.5);
                g.addColorStop(0, '#ff6b81'); g.addColorStop(1, '#e74c3c');
                ctx.fillStyle = g; ctx.fill();
            } else if (val === BLUE) {
                ctx.beginPath(); ctx.arc(pos.x, pos.y, cellR * 0.5, 0, Math.PI * 2);
                const g = ctx.createRadialGradient(pos.x - 2, pos.y - 2, 1, pos.x, pos.y, cellR * 0.5);
                g.addColorStop(0, '#74b9ff'); g.addColorStop(1, '#2980b9');
                ctx.fillStyle = g; ctx.fill();
            }
        }
    }

    function handleClick(e) {
        if (gameOver) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width * W;
        const my = (e.clientY - rect.top) / rect.height * H;

        let closest = null, minD = Infinity;
        for (const p of positions) {
            const pos = getPos(p.r, p.c);
            const d = Math.hypot(mx - pos.x, my - pos.y);
            if (d < cellR * 1.2 && d < minD) { minD = d; closest = p; }
        }
        if (!closest) return;

        const move = highlights.find(h => h.key === closest.key);
        if (move && selected) {
            board[move.key] = board[selected.key];
            board[selected.key] = 0;
            selected = null; highlights = [];
            totalMoves++;
            movesEl.textContent = totalMoves;

            const winner = checkWin();
            if (winner) {
                gameOver = true;
                document.getElementById('go-title').textContent = winner === RED ? 'Red Wins!' : 'Blue Wins!';
                document.getElementById('go-moves').textContent = totalMoves;
                render();
                gameoverOverlay.classList.remove('hidden');
                return;
            }

            currentPlayer = currentPlayer === RED ? BLUE : RED;
            turnEl.textContent = currentPlayer === RED ? '🔴 Red' : '🔵 Blue';
            render();
            return;
        }

        if (board[closest.key] === currentPlayer) {
            selected = closest;
            highlights = getMoves(closest.r, closest.c);
            render();
        }
    }

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); handleClick({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }); }, { passive: false });

    function newGame() {
        buildBoard(); placeInitial();
        selected = null; highlights = []; totalMoves = 0; currentPlayer = RED; gameOver = false;
        turnEl.textContent = '🔴 Red'; movesEl.textContent = 0;
        gameoverOverlay.classList.add('hidden');
        resize(); render();
    }

    window.addEventListener('resize', () => { resize(); render(); });
    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    
    // Fullscreen
    const fsBtn = document.getElementById('fullscreen-btn');
    const exitFsBtn = document.getElementById('exit-fs-btn');
    const gameRoot = document.getElementById('game-root');

    fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            gameRoot.requestFullscreen().catch(err => console.warn(err));
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
            exitFsBtn.style.display = 'flex';
        } else {
            fsBtn.classList.remove('hidden');
            exitFsBtn.style.display = 'none';
        }
        resize(); render();
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
        const isLightMode = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLightMode ? 'light' : 'dark');
        updateThemeIcon();
        render();
    });

    newGame();
})();
