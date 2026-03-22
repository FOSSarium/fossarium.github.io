(() => {
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const p1ScoreEl = document.getElementById('p1-score');
    const p2ScoreEl = document.getElementById('p2-score');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const ROWS = 4, COLS = 4;
    let hLines, vLines, boxes, scores, playerTurn, gameOver;

    function newGame() {
        hLines = Array.from({ length: ROWS + 1 }, () => Array(COLS).fill(0));
        vLines = Array.from({ length: ROWS }, () => Array(COLS + 1).fill(0));
        boxes = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        scores = [0, 0];
        playerTurn = true;
        gameOver = false;
        gameoverOverlay.classList.add('hidden');
        render();
    }

    function render() {
        p1ScoreEl.textContent = scores[0];
        p2ScoreEl.textContent = scores[1];
        turnEl.textContent = playerTurn ? 'Your turn' : 'CPU...';

        const gridRows = 2 * ROWS + 1;
        const gridCols = 2 * COLS + 1;
        boardEl.style.gridTemplateRows = `repeat(${gridRows}, auto)`;
        boardEl.style.gridTemplateColumns = `repeat(${gridCols}, auto)`;

        boardEl.innerHTML = '';
        
        for (let gridRow = 0; gridRow < gridRows; gridRow++) {
            for (let gridCol = 0; gridCol < gridCols; gridCol++) {
                if (gridRow % 2 === 0 && gridCol % 2 === 0) {
                    // Dot position
                    const row = gridRow / 2;
                    const col = gridCol / 2;
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    boardEl.appendChild(dot);
                } else if (gridRow % 2 === 0 && gridCol % 2 === 1) {
                    // Horizontal line
                    const row = gridRow / 2;
                    const col = (gridCol - 1) / 2;
                    const hLine = document.createElement('div');
                    hLine.className = 'h-line';
                    if (hLines[row][col] === 1) hLine.classList.add('p1');
                    if (hLines[row][col] === 2) hLine.classList.add('p2');
                    if (!hLines[row][col] && playerTurn && !gameOver) {
                        hLine.addEventListener('click', () => placeLine('h', row, col));
                    }
                    boardEl.appendChild(hLine);
                } else if (gridRow % 2 === 1 && gridCol % 2 === 0) {
                    // Vertical line
                    const row = (gridRow - 1) / 2;
                    const col = gridCol / 2;
                    const vLine = document.createElement('div');
                    vLine.className = 'v-line';
                    if (vLines[row][col] === 1) vLine.classList.add('p1');
                    if (vLines[row][col] === 2) vLine.classList.add('p2');
                    if (!vLines[row][col] && playerTurn && !gameOver) {
                        vLine.addEventListener('click', () => placeLine('v', row, col));
                    }
                    boardEl.appendChild(vLine);
                } else {
                    // Box
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
        if (gameOver || !playerTurn) return;
        
        const player = 1;
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
            playerTurn = false;
            render();
            setTimeout(cpuTurn, 500);
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
        if (gameOver) return;
        
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
            playerTurn = true;
            render();
        }
    }

    function isGameOver() {
        return scores[0] + scores[1] === ROWS * COLS;
    }

    function endGame() {
        gameOver = true;
        if (scores[0] > scores[1]) {
            document.getElementById('go-icon').textContent = '🎉';
            document.getElementById('go-title').textContent = 'You Win!';
        } else if (scores[1] > scores[0]) {
            document.getElementById('go-icon').textContent = '💀';
            document.getElementById('go-title').textContent = 'CPU Wins!';
        } else {
            document.getElementById('go-icon').textContent = '🤝';
            document.getElementById('go-title').textContent = 'Draw!';
        }
        document.getElementById('go-msg').textContent = `You: ${scores[0]} — CPU: ${scores[1]}`;
        gameoverOverlay.classList.remove('hidden');
    }

    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
    });

    newGame();
})();
