(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const paletteEl = document.getElementById('palette');
    const helpOverlay = document.getElementById('help-overlay');
    const isLight = () => document.documentElement.classList.contains('light-theme');

    const COLORS = ['#ff4757', '#ff6b81', '#ffa502', '#ffdd59', '#2ed573', '#1e90ff', '#a55eea', '#e056fd', '#00d2d3', '#ff9f43', '#5f27cd', '#01a3a4', '#f8b500', '#ee5a24', '#2c3e50', '#ecf0f1'];
    let gridSize = 16, currentColor = COLORS[0], tool = 'paint', showGrid = true;
    let grid = [];
    let W, H;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        W = H = Math.floor(rect.width);
        canvas.width = W; canvas.height = H;
    }

    function initGrid() {
        grid = [];
        for (let r = 0; r < gridSize; r++) {
            grid[r] = [];
            for (let c = 0; c < gridSize; c++) grid[r][c] = null;
        }
    }

    function buildPalette() {
        paletteEl.innerHTML = '';
        COLORS.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-swatch' + (color === currentColor ? ' active' : '');
            div.style.background = color;
            div.addEventListener('click', () => {
                currentColor = color;
                tool = 'paint';
                updateTools();
                paletteEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                div.classList.add('active');
            });
            paletteEl.appendChild(div);
        });
    }

    function updateTools() {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tool + '-tool').classList.add('active');
    }

    function render() {
        resize();
        const cellW = W / gridSize, cellH = H / gridSize;
        const bg = isLight() ? '#e8ecf2' : '#0a0e18';
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c]) {
                    ctx.fillStyle = grid[r][c];
                    ctx.fillRect(c * cellW + 0.5, r * cellH + 0.5, cellW - 1, cellH - 1);
                    // Highlight
                    ctx.fillStyle = 'rgba(255,255,255,0.15)';
                    ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, 3);
                }
            }
        }

        if (showGrid) {
            ctx.strokeStyle = isLight() ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= gridSize; i++) {
                ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, H); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i * cellH); ctx.lineTo(W, i * cellH); ctx.stroke();
            }
        }
    }

    function getCell(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const cellW = rect.width / gridSize, cellH = rect.height / gridSize;
        return { r: Math.floor(y / cellH), c: Math.floor(x / cellW) };
    }

    function floodFill(r, c, targetColor, fillColor) {
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;
        if (grid[r][c] !== targetColor || grid[r][c] === fillColor) return;
        grid[r][c] = fillColor;
        floodFill(r - 1, c, targetColor, fillColor);
        floodFill(r + 1, c, targetColor, fillColor);
        floodFill(r, c - 1, targetColor, fillColor);
        floodFill(r, c + 1, targetColor, fillColor);
    }

    function applyTool(r, c) {
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return;
        if (tool === 'paint') grid[r][c] = currentColor;
        else if (tool === 'erase') grid[r][c] = null;
        else if (tool === 'fill') floodFill(r, c, grid[r][c], currentColor);
        render();
    }

    let painting = false;
    canvas.addEventListener('mousedown', e => { painting = true; const { r, c } = getCell(e); applyTool(r, c); });
    canvas.addEventListener('mousemove', e => { if (painting && tool !== 'fill') { const { r, c } = getCell(e); applyTool(r, c); } });
    canvas.addEventListener('mouseup', () => painting = false);
    canvas.addEventListener('mouseleave', () => painting = false);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); painting = true; const { r, c } = getCell(e); applyTool(r, c); }, { passive: false });
    canvas.addEventListener('touchmove', e => { e.preventDefault(); if (painting && tool !== 'fill') { const { r, c } = getCell(e); applyTool(r, c); } }, { passive: false });
    canvas.addEventListener('touchend', () => painting = false);

    document.getElementById('paint-tool').addEventListener('click', () => { tool = 'paint'; updateTools(); });
    document.getElementById('erase-tool').addEventListener('click', () => { tool = 'erase'; updateTools(); });
    document.getElementById('fill-tool').addEventListener('click', () => { tool = 'fill'; updateTools(); });
    document.getElementById('clear-btn').addEventListener('click', () => { initGrid(); render(); });

    document.getElementById('grid-size').addEventListener('change', e => {
        gridSize = parseInt(e.target.value);
        initGrid(); render();
    });
    document.getElementById('show-grid').addEventListener('change', e => { showGrid = e.target.checked; render(); });

    document.getElementById('export-btn').addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = tempCanvas.height = 512;
        const tCtx = tempCanvas.getContext('2d');
        const cellW = 512 / gridSize;
        tCtx.fillStyle = isLight() ? '#e8ecf2' : '#0a0e18';
        tCtx.fillRect(0, 0, 512, 512);
        for (let r = 0; r < gridSize; r++)
            for (let c = 0; c < gridSize; c++)
                if (grid[r][c]) { tCtx.fillStyle = grid[r][c]; tCtx.fillRect(c * cellW, r * cellW, cellW, cellW); }
        const link = document.createElement('a');
        link.download = 'brick-builder.png';
        link.href = tempCanvas.toDataURL();
        link.click();
    });

    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

    // Fullscreen logic
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
            exitFsBtn.style.display = 'flex';
        } else {
            fsBtn.classList.remove('hidden');
            exitFsBtn.style.display = 'none';
        }
        render(); // Re-render on fullscreen change to ensure correct canvas sizing
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
        render(); // Re-render canvas for theme colors
    });

    window.addEventListener('resize', render);
    buildPalette(); initGrid(); render();
})();
