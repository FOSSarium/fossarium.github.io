(() => {
    const boardEl = document.getElementById('board');
    const colorBtnsEl = document.getElementById('color-btns');
    const movesEl = document.getElementById('moves');
    const limitEl = document.getElementById('limit');
    const filledEl = document.getElementById('filled');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const COLORS = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#a55eea', '#ff6b81'];
    let size = 14, grid = [], moves = 0, maxMoves = 25, gameOver = false;

    function getLimit(s) { return s <= 10 ? 20 : s <= 14 ? 25 : 30; }

    function initGrid() {
        grid = [];
        for (let r = 0; r < size; r++) {
            grid[r] = [];
            for (let c = 0; c < size; c++) {
                grid[r][c] = Math.floor(Math.random() * COLORS.length);
            }
        }
    }

    function buildColorBtns() {
        colorBtnsEl.innerHTML = '';
        COLORS.forEach((color, i) => {
            const btn = document.createElement('div');
            btn.className = 'color-btn';
            btn.style.background = color;
            btn.addEventListener('click', () => flood(i));
            colorBtnsEl.appendChild(btn);
        });
    }

    function render() {
        boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        boardEl.innerHTML = '';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.background = COLORS[grid[r][c]];
                boardEl.appendChild(cell);
            }
        }
    }

    function getFloodRegion() {
        const color = grid[0][0];
        const visited = new Set();
        const stack = [{ r: 0, c: 0 }];
        while (stack.length) {
            const { r, c } = stack.pop();
            const key = `${r},${c}`;
            if (visited.has(key)) continue;
            if (r < 0 || r >= size || c < 0 || c >= size) continue;
            if (grid[r][c] !== color) continue;
            visited.add(key);
            stack.push({ r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 });
        }
        return visited;
    }

    function flood(colorIdx) {
        if (gameOver) return;
        if (grid[0][0] === colorIdx) return; // Same color, no-op

        const region = getFloodRegion();
        region.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            grid[r][c] = colorIdx;
        });

        moves++;
        movesEl.textContent = moves;

        // Re-check flood region after color change
        const newRegion = getFloodRegion();
        const total = size * size;
        const pct = Math.round((newRegion.size / total) * 100);
        filledEl.textContent = pct + '%';

        render();

        if (newRegion.size === total) {
            gameOver = true;
            document.getElementById('go-icon').textContent = '🎉';
            document.getElementById('go-title').textContent = 'You Win!';
            document.getElementById('go-moves').textContent = moves;
            document.getElementById('go-msg').innerHTML = `Completed in <strong>${moves}</strong> moves!`;
            gameoverOverlay.classList.remove('hidden');
        } else if (moves >= maxMoves) {
            gameOver = true;
            document.getElementById('go-icon').textContent = '💥';
            document.getElementById('go-title').textContent = 'Out of Moves!';
            document.getElementById('go-moves').textContent = moves;
            document.getElementById('go-msg').innerHTML = `Filled <strong>${pct}%</strong> of the board.`;
            gameoverOverlay.classList.remove('hidden');
        }
    }

    function newGame() {
        size = parseInt(document.getElementById('board-size').value);
        maxMoves = getLimit(size);
        moves = 0; gameOver = false;
        movesEl.textContent = 0; limitEl.textContent = maxMoves; filledEl.textContent = '0%';
        gameoverOverlay.classList.add('hidden');
        initGrid();
        // Calculate initial flood
        const region = getFloodRegion();
        filledEl.textContent = Math.round((region.size / (size * size)) * 100) + '%';
        render();
    }

    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);
    document.getElementById('board-size').addEventListener('change', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    
    const fsBtn = document.getElementById('fullscreen-btn');
    const exitFsBtn = document.getElementById('exit-fs-btn');
    const gameRoot = document.getElementById('game-root');
    
    fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            gameRoot.requestFullscreen().catch(() => {});
        }
    });
    
    exitFsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
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
        const isLightMode = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLightMode ? 'light' : 'dark');
        updateThemeIcon();
    });

    buildColorBtns();
    newGame();
})();
