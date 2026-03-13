(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const paletteEl = document.getElementById('palette');
    const helpOverlay = document.getElementById('help-overlay');

    const COLORS = ['#111111','#ff4757','#ff6b81','#ffa502','#ffdd59','#2ed573','#1e90ff','#a55eea','#e056fd','#00d2d3','#5f27cd','#01a3a4','#f8b500','#ee5a24','#ffffff'];
    let currentColor = COLORS[0], brushSize = 4, tool = 'pen', drawing = false;
    let history = [], lastPos = null;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const w = Math.floor(rect.width);
        const h = Math.floor(w * 3 / 4);
        if (canvas.width !== w || canvas.height !== h) {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width = w; canvas.height = h;
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
            ctx.putImageData(imgData, 0, 0);
        }
    }

    function buildPalette() {
        paletteEl.innerHTML = '';
        COLORS.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-swatch' + (color === currentColor ? ' active' : '');
            div.style.background = color;
            if (color === '#ffffff') div.style.border = '2px solid rgba(0,0,0,0.15)';
            div.addEventListener('click', () => {
                currentColor = color; tool = 'pen'; updateTools();
                paletteEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                div.classList.add('active');
            });
            paletteEl.appendChild(div);
        });
    }

    function updateTools() {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tool === 'pen' ? 'pen-tool' : 'eraser-tool').classList.add('active');
    }

    function saveState() {
        history.push(canvas.toDataURL());
        if (history.length > 30) history.shift();
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: (clientX - rect.left) / rect.width * canvas.width,
            y: (clientY - rect.top) / rect.height * canvas.height
        };
    }

    function drawLine(from, to) {
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : currentColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    function startDraw(e) {
        e.preventDefault();
        drawing = true;
        saveState();
        lastPos = getPos(e);
        drawLine(lastPos, lastPos);
    }

    function moveDraw(e) {
        e.preventDefault();
        if (!drawing) return;
        const pos = getPos(e);
        drawLine(lastPos, pos);
        lastPos = pos;
    }

    function endDraw() { drawing = false; lastPos = null; }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    document.getElementById('brush-size').addEventListener('input', e => brushSize = parseInt(e.target.value));
    document.getElementById('pen-tool').addEventListener('click', () => { tool = 'pen'; updateTools(); });
    document.getElementById('eraser-tool').addEventListener('click', () => { tool = 'eraser'; updateTools(); });

    document.getElementById('undo-btn').addEventListener('click', () => {
        if (history.length === 0) return;
        const img = new Image();
        img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); };
        img.src = history.pop();
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        saveState();
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('export-btn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {}); else document.exitFullscreen();
    });

    window.addEventListener('resize', resize);
    resize();
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    buildPalette();
})();
