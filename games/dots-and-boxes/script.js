(() => {
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const p1ScoreEl = document.getElementById('p1-score');
    const p2ScoreEl = document.getElementById('p2-score');
    const p1LabelEl = document.getElementById('p1-label');
    const p2LabelEl = document.getElementById('p2-label');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const modeBotBtn = document.getElementById('mode-bot');
    const modePvpBtn = document.getElementById('mode-pvp');

    const ROWS = 4, COLS = 4;
    let hLines, vLines, boxes, scores, currentPlayer, gameOver, gameMode;
    
    // Drag state
    let isDragging = false;
    let selectedDot = null;

    function initArrays() {
        hLines = Array.from({ length: ROWS + 1 }, () => Array(COLS).fill(0));
        vLines = Array.from({ length: ROWS }, () => Array(COLS + 1).fill(0));
        boxes = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function newGame() {
        initArrays();
        scores = [0, 0];
        currentPlayer = 1;
        gameOver = false;
        isDragging = false;
        selectedDot = null;
        gameoverOverlay.classList.add('hidden');
        render();
    }

    function setMode(mode) {
        gameMode = mode;
        if (mode === 'bot') {
            p1LabelEl.textContent = 'You';
            p2LabelEl.textContent = 'CPU';
            modeBotBtn.classList.add('active');
            modePvpBtn.classList.remove('active');
        } else {
            p1LabelEl.textContent = 'Player 1';
            p2LabelEl.textContent = 'Player 2';
            modeBotBtn.classList.remove('active');
            modePvpBtn.classList.add('active');
        }
        newGame();
    }

    function render() {
        p1ScoreEl.textContent = scores[0];
        p2ScoreEl.textContent = scores[1];

        const p1Name = gameMode === 'bot' ? 'You' : 'Player 1';
        const p2Name = gameMode === 'bot' ? 'CPU' : 'Player 2';
        const turnName = currentPlayer === 1 ? p1Name : p2Name;
        turnEl.textContent = `${turnName}'s turn`;

        const gridRows = 2 * ROWS + 1;
        const gridCols = 2 * COLS + 1;
        boardEl.style.gridTemplateRows = `repeat(${gridRows}, auto)`;
        boardEl.style.gridTemplateColumns = `repeat(${gridCols}, auto)`;

        boardEl.innerHTML = '';
        
        for (let gridRow = 0; gridRow < gridRows; gridRow++) {
            for (let gridCol = 0; gridCol < gridCols; gridCol++) {
                if (gridRow % 2 === 0 && gridCol % 2 === 0) {
                    const row = gridRow / 2;
                    const col = gridCol / 2;
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.dataset.row = row;
                    dot.dataset.col = col;
                    dot.addEventListener('mousedown', handleDotDown);
                    dot.addEventListener('touchstart', handleDotDown, { passive: false });
                    boardEl.appendChild(dot);
                } else if (gridRow % 2 === 0 && gridCol % 2 === 1) {
                    const row = gridRow / 2;
                    const col = (gridCol - 1) / 2;
                    const hLine = document.createElement('div');
                    hLine.className = 'h-line';
                    if (hLines[row][col] === 1) hLine.classList.add('p1');
                    if (hLines[row][col] === 2) hLine.classList.add('p2');
                    if (!hLines[row][col] && !gameOver) {
                        hLine.addEventListener('click', () => placeLine('h', row, col));
                    }
                    boardEl.appendChild(hLine);
                } else if (gridRow % 2 === 1 && gridCol % 2 === 0) {
                    const row = (gridRow - 1) / 2;
                    const col = gridCol / 2;
                    const vLine = document.createElement('div');
                    vLine.className = 'v-line';
                    if (vLines[row][col] === 1) vLine.classList.add('p1');
                    if (vLines[row][col] === 2) vLine.classList.add('p2');
                    if (!vLines[row][col] && !gameOver) {
                        vLine.addEventListener('click', () => placeLine('v', row, col));
                    }
                    boardEl.appendChild(vLine);
                } else {
                    const row = (gridRow - 1) / 2;
                    const col = (gridCol - 1) / 2;
                    const box = document.createElement('div');
                    box.className = 'box';
                    if (boxes[row][col] === 1) {
                        box.classList.add('p1-box');
                        box.textContent = 'P1';
                    } else if (boxes[row][col] === 2) {
                        box.classList.add('p2-box');
                        box.textContent = 'P2';
                    }
                    boardEl.appendChild(box);
                }
            }
        }
    }

    function placeLine(type, r, c) {
        if (gameOver) return;
        if (gameMode === 'bot' && currentPlayer !== 1) return;
        
        const player = currentPlayer;
        if (type === 'h') {
            if (hLines[r][c]) return;
            hLines[r][c] = player;
        } else {
            if (vLines[r][c]) return;
            vLines[r][c] = player;
        }

        const completed = checkBoxes(player);
        render();
        
        if (isGameOver()) {
            endGame();
            return;
        }
        
        if (!completed) {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            render();
            if (gameMode === 'bot' && currentPlayer === 2) {
                setTimeout(cpuTurn, 500);
            }
        }
    }

    function checkBoxes(player) {
        let completed = false;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (boxes[r][c] === 0 &&
                    hLines[r][c] && hLines[r + 1][c] &&
                    vLines[r][c] && vLines[r][c + 1]) {
                    boxes[r][c] = player;
                    scores[player - 1]++;
                    completed = true;
                }
            }
        }
        return completed;
    }

    function getAvailableLines() {
        const lines = [];
        for (let r = 0; r <= ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (!hLines[r][c]) lines.push({ type: 'h', r, c });
            }
        }
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c <= COLS; c++) {
                if (!vLines[r][c]) lines.push({ type: 'v', r, c });
            }
        }
        return lines;
    }

    function countSides(r, c) {
        return (hLines[r][c] ? 1 : 0) + (hLines[r + 1][c] ? 1 : 0) +
               (vLines[r][c] ? 1 : 0) + (vLines[r][c + 1] ? 1 : 0);
    }

    function cpuTurn() {
        if (gameOver || gameMode !== 'bot') return;
        
        const lines = getAvailableLines();
        if (lines.length === 0) return;

        let best = null;

        // Try to complete a box
        for (const l of lines) {
            if (l.type === 'h') hLines[l.r][l.c] = 2;
            else vLines[l.r][l.c] = 2;
            
            let completes = false;
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (boxes[r][c] === 0 && hLines[r][c] && hLines[r + 1][c] &&
                        vLines[r][c] && vLines[r][c + 1]) {
                        completes = true;
                        break;
                    }
                }
                if (completes) break;
            }
            
            if (l.type === 'h') hLines[l.r][l.c] = 0;
            else vLines[l.r][l.c] = 0;
            
            if (completes) { best = l; break; }
        }

        // Avoid giving 3-sided boxes
        if (!best) {
            const safe = lines.filter(l => {
                if (l.type === 'h') hLines[l.r][l.c] = 2;
                else vLines[l.r][l.c] = 2;
                
                let gives = false;
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        if (boxes[r][c] === 0 && countSides(r, c) === 3) {
                            gives = true;
                            break;
                        }
                    }
                    if (gives) break;
                }
                
                if (l.type === 'h') hLines[l.r][l.c] = 0;
                else vLines[l.r][l.c] = 0;
                return !gives;
            });
            
            if (safe.length > 0) {
                best = safe[Math.floor(Math.random() * safe.length)];
            }
        }

        // Random move
        if (!best) {
            best = lines[Math.floor(Math.random() * lines.length)];
        }

        if (best.type === 'h') hLines[best.r][best.c] = 2;
        else vLines[best.r][best.c] = 2;
        
        const completed = checkBoxes(2);
        render();
        
        if (isGameOver()) {
            endGame();
            return;
        }
        
        if (completed) {
            setTimeout(cpuTurn, 500);
        } else {
            currentPlayer = 1;
            render();
        }
    }

    function isGameOver() {
        return scores[0] + scores[1] === ROWS * COLS;
    }

    function endGame() {
        gameOver = true;
        const p1Name = gameMode === 'bot' ? 'You' : 'Player 1';
        const p2Name = gameMode === 'bot' ? 'CPU' : 'Player 2';
        
        const icon = document.getElementById('go-icon');
        const title = document.getElementById('go-title');
        const msg = document.getElementById('go-msg');
        
        if (scores[0] > scores[1]) {
            icon.textContent = '🎉';
            title.textContent = `${p1Name} Win!`;
        } else if (scores[1] > scores[0]) {
            icon.textContent = '🏆';
            title.textContent = `${p2Name} Win!`;
        } else {
            icon.textContent = '🤝';
            title.textContent = "It's a Draw!";
        }
        msg.textContent = `${p1Name}: ${scores[0]} — ${p2Name}: ${scores[1]}`;
        gameoverOverlay.classList.remove('hidden');
    }

    // Drag handlers
    function handleDotDown(e) {
        if (gameOver) return;
        if (gameMode === 'bot' && currentPlayer !== 1) return;
        
        e.preventDefault();
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        selectedDot = { row, col, el: e.target };
        isDragging = true;
        e.target.style.transform = 'scale(1.3)';
        e.target.style.boxShadow = '0 0 16px rgba(88, 166, 255, 0.8)';
    }

    function handleDotUp(e) {
        if (!isDragging || !selectedDot) return;
        
        isDragging = false;
        selectedDot.el.style.transform = '';
        selectedDot.el.style.boxShadow = '';
        
        let targetDot = null;
        if (e.type === 'touchend') {
            const touch = e.changedTouches[0];
            const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
            targetDot = elements.find(el => el.classList.contains('dot') && el !== selectedDot.el);
        } else {
            if (e.target.classList.contains('dot')) {
                targetDot = e.target;
            }
        }
        
        if (targetDot && targetDot !== selectedDot.el) {
            const targetRow = parseInt(targetDot.dataset.row);
            const targetCol = parseInt(targetDot.dataset.col);
            const rowDiff = Math.abs(targetRow - selectedDot.row);
            const colDiff = Math.abs(targetCol - selectedDot.col);
            
            if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                if (rowDiff === 1) {
                    const lineRow = Math.min(selectedDot.row, targetRow);
                    if (vLines[lineRow][selectedDot.col] === 0) {
                        placeLine('v', lineRow, selectedDot.col);
                    }
                } else {
                    const lineCol = Math.min(selectedDot.col, targetCol);
                    if (hLines[selectedDot.row][lineCol] === 0) {
                        placeLine('h', selectedDot.row, lineCol);
                    }
                }
            }
        }
        
        selectedDot = null;
    }

    // Event listeners
    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    
    // Mode selector
    modeBotBtn.addEventListener('click', () => setMode('bot'));
    modePvpBtn.addEventListener('click', () => setMode('pvp'));
    
    // Global drag handlers
    document.addEventListener('mouseup', handleDotUp);
    document.addEventListener('touchend', handleDotUp);
    
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
    
    // Start game
    setMode('bot');
})();
