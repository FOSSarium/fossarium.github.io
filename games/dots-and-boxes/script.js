(() => {
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const p1ScoreEl = document.getElementById('p1-score');
    const p2ScoreEl = document.getElementById('p2-score');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const ROWS = 5, COLS = 5;
    let hLines, vLines, boxes, scores, playerTurn, gameOver;

    function newGame() {
        hLines = Array.from({ length: ROWS + 1 }, () => Array(COLS).fill(0));
        vLines = Array.from({ length: ROWS }, () => Array(COLS + 1).fill(0));
        boxes = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        scores = [0, 0]; playerTurn = true; gameOver = false;
        gameoverOverlay.classList.add('hidden');
        render();
    }

    function render() {
        p1ScoreEl.textContent = scores[0];
        p2ScoreEl.textContent = scores[1];
        turnEl.textContent = playerTurn ? 'Your turn' : 'CPU...';

        const gridCols = [];
        for (let c = 0; c <= COLS; c++) {
            gridCols.push('12px');
            if (c < COLS) gridCols.push('1fr');
        }
        boardEl.style.gridTemplateColumns = gridCols.join(' ');

        boardEl.innerHTML = '';
        for (let r = 0; r <= ROWS; r++) {
            // Dot + horizontal line row
            for (let c = 0; c <= COLS; c++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                boardEl.appendChild(dot);
                if (c < COLS) {
                    const line = document.createElement('div');
                    line.className = 'h-line' + (hLines[r][c] === 1 ? ' p1' : hLines[r][c] === 2 ? ' p2' : '');
                    if (!hLines[r][c]) line.addEventListener('click', () => placeLine('h', r, c));
                    boardEl.appendChild(line);
                }
            }
            // Vertical line + box row
            if (r < ROWS) {
                for (let c = 0; c <= COLS; c++) {
                    const line = document.createElement('div');
                    line.className = 'v-line' + (vLines[r][c] === 1 ? ' p1' : vLines[r][c] === 2 ? ' p2' : '');
                    if (!vLines[r][c]) line.addEventListener('click', () => placeLine('v', r, c));
                    boardEl.appendChild(line);
                    if (c < COLS) {
                        const box = document.createElement('div');
                        box.className = 'box' + (boxes[r][c] === 1 ? ' p1-box' : boxes[r][c] === 2 ? ' p2-box' : '');
                        if (boxes[r][c]) box.textContent = boxes[r][c] === 1 ? 'You' : 'CPU';
                        boardEl.appendChild(box);
                    }
                }
            }
        }
    }

    function placeLine(type, r, c) {
        if (gameOver || !playerTurn) return;
        const player = 1;
        if (type === 'h') { if (hLines[r][c]) return; hLines[r][c] = player; }
        else { if (vLines[r][c]) return; vLines[r][c] = player; }

        const completed = checkBoxes(player);
        render();
        if (isGameOver()) return endGame();
        if (!completed) {
            playerTurn = false;
            render();
            setTimeout(cpuTurn, 400);
        }
    }

    function checkBoxes(player) {
        let completed = false;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (boxes[r][c] === 0 && hLines[r][c] && hLines[r + 1][c] && vLines[r][c] && vLines[r][c + 1]) {
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
        for (let r = 0; r <= ROWS; r++) for (let c = 0; c < COLS; c++) if (!hLines[r][c]) lines.push({ type: 'h', r, c });
        for (let r = 0; r < ROWS; r++) for (let c = 0; c <= COLS; c++) if (!vLines[r][c]) lines.push({ type: 'v', r, c });
        return lines;
    }

    function countSides(r, c) {
        return (hLines[r][c] ? 1 : 0) + (hLines[r + 1][c] ? 1 : 0) + (vLines[r][c] ? 1 : 0) + (vLines[r][c + 1] ? 1 : 0);
    }

    function cpuTurn() {
        if (gameOver) return;
        const lines = getAvailableLines();
        if (lines.length === 0) return;

        // Strategy: 1) Complete a box, 2) Don't give away 3-sided boxes, 3) Random
        let best = null;

        // Try to complete a box
        for (const l of lines) {
            if (l.type === 'h') hLines[l.r][l.c] = 2; else vLines[l.r][l.c] = 2;
            let completes = false;
            for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
                if (boxes[r][c] === 0 && hLines[r][c] && hLines[r + 1][c] && vLines[r][c] && vLines[r][c + 1]) completes = true;
            if (l.type === 'h') hLines[l.r][l.c] = 0; else vLines[l.r][l.c] = 0;
            if (completes) { best = l; break; }
        }

        // Avoid giving 3-sided boxes
        if (!best) {
            const safe = lines.filter(l => {
                if (l.type === 'h') hLines[l.r][l.c] = 2; else vLines[l.r][l.c] = 2;
                let gives = false;
                for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
                    if (boxes[r][c] === 0 && countSides(r, c) === 3) gives = true;
                if (l.type === 'h') hLines[l.r][l.c] = 0; else vLines[l.r][l.c] = 0;
                return !gives;
            });
            best = safe.length > 0 ? safe[Math.floor(Math.random() * safe.length)] : lines[Math.floor(Math.random() * lines.length)];
        }

        if (best.type === 'h') hLines[best.r][best.c] = 2; else vLines[best.r][best.c] = 2;
        const completed = checkBoxes(2);
        render();
        if (isGameOver()) return endGame();
        if (completed) setTimeout(cpuTurn, 400);
        else playerTurn = true;
        render();
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
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {}); else document.exitFullscreen();
    });

    newGame();
})();
