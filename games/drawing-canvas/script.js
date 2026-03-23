(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const paletteEl = document.getElementById('palette');
    const helpOverlay = document.getElementById('help-overlay');

    const COLORS = ['#111111', '#ff4757', '#ff6b81', '#ffa502', '#ffdd59', '#2ed573', '#1e90ff', '#a55eea', '#e056fd', '#00d2d3', '#5f27cd', '#01a3a4', '#f8b500', '#ee5a24', '#ffffff'];
    let currentColor = COLORS[0], brushSize = 4, tool = 'pen';
    let isDrawing = false, lastPos = null;
    let history = [], startX, startY, snapshot;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const w = Math.floor(rect.width);
        const h = Math.floor(w * 3 / 4);
        if (canvas.width !== w || canvas.height !== h) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            if (canvas.width > 0) {
                tempCtx.drawImage(canvas, 0, 0);
            }
            canvas.width = w;
            canvas.height = h;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, w, h);
            if (tempCanvas.width > 0) {
                ctx.drawImage(tempCanvas, 0, 0);
            }
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
                currentColor = color;
                tool = 'pen';
                updateTools();
                paletteEl.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                div.classList.add('active');
            });
            paletteEl.appendChild(div);
        });
    }

    function updateTools() {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        const toolMap = { pen: 'pen-tool', eraser: 'eraser-tool', line: 'line-tool', rect: 'rect-tool', circle: 'circle-tool', fill: 'fill-tool' };
        document.getElementById(toolMap[tool])?.classList.add('active');
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
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        lastPos = getPos(e);
        startX = lastPos.x;
        startY = lastPos.y;
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        if (tool === 'fill') {
            floodFill(Math.floor(lastPos.x), Math.floor(lastPos.y), hexToRgb(currentColor));
            saveState();
            isDrawing = false;
        } else if (tool === 'pen' || tool === 'eraser') {
            saveState();
            drawLine(lastPos, lastPos);
        }
    }

    function moveDraw(e) {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getPos(e);
        
        if (tool === 'pen' || tool === 'eraser') {
            drawLine(lastPos, pos);
            lastPos = pos;
        } else if (tool === 'line' || tool === 'rect' || tool === 'circle') {
            ctx.putImageData(snapshot, 0, 0);
            if (tool === 'line') {
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = brushSize;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            } else if (tool === 'rect') {
                ctx.fillStyle = currentColor;
                ctx.fillRect(startX, startY, pos.x - startX, pos.y - startY);
            } else if (tool === 'circle') {
                ctx.fillStyle = currentColor;
                ctx.beginPath();
                const radiusX = Math.abs(pos.x - startX) / 2;
                const radiusY = Math.abs(pos.y - startY) / 2;
                const centerX = startX + (pos.x - startX) / 2;
                const centerY = startY + (pos.y - startY) / 2;
                ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function endDraw() {
        if (isDrawing && tool !== 'fill') {
            saveState();
        }
        isDrawing = false;
        lastPos = null;
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    function floodFill(startX, startY, fillColor) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        const startPos = (startY * width + startX) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];
        const startA = data[startPos + 3];
        
        if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b) return;
        
        const stack = [[startX, startY]];
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const pos = (y * width + x) * 4;
            
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            if (data[pos] !== startR || data[pos + 1] !== startG || data[pos + 2] !== startB || data[pos + 3] !== startA) continue;
            
            data[pos] = fillColor.r;
            data[pos + 1] = fillColor.g;
            data[pos + 2] = fillColor.b;
            data[pos + 3] = 255;
            
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

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
    document.getElementById('line-tool').addEventListener('click', () => { tool = 'line'; updateTools(); });
    document.getElementById('rect-tool').addEventListener('click', () => { tool = 'rect'; updateTools(); });
    document.getElementById('circle-tool').addEventListener('click', () => { tool = 'circle'; updateTools(); });
    document.getElementById('fill-tool').addEventListener('click', () => { tool = 'fill'; updateTools(); });

    document.getElementById('undo-btn').addEventListener('click', () => {
        if (history.length === 0) return;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history.pop();
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        saveState();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('export-btn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // Help overlay
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

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

    window.addEventListener('resize', resize);
    resize();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    buildPalette();
    updateTools();
})();
