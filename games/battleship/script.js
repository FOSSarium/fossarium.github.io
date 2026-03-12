(() => {
    const SIZE = 10;
    const SHIPS = [5, 4, 3, 3, 2];
    const statusEl = document.getElementById('status');
    const shotsEl = document.getElementById('shots');
    const hitsEl = document.getElementById('hits');
    const shipsLeftEl = document.getElementById('ships-left');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    let enemyBoard, playerBoard, shots, playerHits, enemySunk, playerSunk, gameOver;
    // AI state
    let aiHitStack, aiDirections;

    function createBoard() {
        const board = [];
        for (let r = 0; r < SIZE; r++) {
            board[r] = [];
            for (let c = 0; c < SIZE; c++) {
                board[r][c] = { ship: false, shipId: -1, shot: false };
            }
        }
        return board;
    }

    function placeShips(board) {
        SHIPS.forEach((len, id) => {
            for (let t = 0; t < 500; t++) {
                const horiz = Math.random() > 0.5;
                const r = Math.floor(Math.random() * (SIZE - (horiz ? 0 : len)));
                const c = Math.floor(Math.random() * (SIZE - (horiz ? len : 0)));
                let ok = true;
                for (let i = 0; i < len; i++) {
                    const nr = r + (horiz ? 0 : i), nc = c + (horiz ? i : 0);
                    if (board[nr][nc].ship) { ok = false; break; }
                }
                if (ok) {
                    for (let i = 0; i < len; i++) {
                        const nr = r + (horiz ? 0 : i), nc = c + (horiz ? i : 0);
                        board[nr][nc].ship = true;
                        board[nr][nc].shipId = id;
                    }
                    break;
                }
            }
        });
    }

    function isShipSunk(board, shipId) {
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (board[r][c].shipId === shipId && !board[r][c].shot) return false;
        return true;
    }

    function countSunk(board) {
        const sunkIds = new Set();
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (board[r][c].ship && isShipSunk(board, board[r][c].shipId))
                    sunkIds.add(board[r][c].shipId);
        return sunkIds.size;
    }

    function renderGrid(board, gridEl, showShips) {
        gridEl.innerHTML = '';
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const cell = board[r][c];
                const div = document.createElement('div');
                div.className = 'cell';
                if (cell.shot) {
                    if (cell.ship) {
                        div.classList.add(isShipSunk(board, cell.shipId) ? 'sunk' : 'hit');
                        div.textContent = '🔥';
                    } else {
                        div.classList.add('miss');
                        div.textContent = '💨';
                    }
                } else if (showShips && cell.ship) {
                    div.classList.add('ship');
                }
                div.dataset.r = r;
                div.dataset.c = c;
                gridEl.appendChild(div);
            }
        }
    }

    function render() {
        renderGrid(enemyBoard, document.getElementById('enemy-grid'), false);
        renderGrid(playerBoard, document.getElementById('player-grid'), true);
        shotsEl.textContent = shots;
        hitsEl.textContent = playerHits;
        shipsLeftEl.textContent = SHIPS.length - enemySunk;
    }

    function playerFire(r, c) {
        if (gameOver || enemyBoard[r][c].shot) return;
        enemyBoard[r][c].shot = true;
        shots++;
        if (enemyBoard[r][c].ship) {
            playerHits++;
            if (isShipSunk(enemyBoard, enemyBoard[r][c].shipId)) {
                enemySunk = countSunk(enemyBoard);
                statusEl.textContent = '💥 Ship sunk!';
            } else {
                statusEl.textContent = '🔥 Hit!';
            }
        } else {
            statusEl.textContent = '💨 Miss!';
        }

        render();

        if (enemySunk >= SHIPS.length) {
            gameOver = true;
            endGame(true);
            return;
        }

        // AI fires back
        setTimeout(aiFire, 400);
    }

    function aiFire() {
        let r, c;

        if (aiHitStack.length > 0) {
            // Smart targeting — try adjacent cells of last hit
            while (aiHitStack.length > 0) {
                const target = aiHitStack.pop();
                r = target.r; c = target.c;
                if (r >= 0 && r < SIZE && c >= 0 && c < SIZE && !playerBoard[r][c].shot) break;
                r = c = -1;
            }
        }

        if (r === undefined || r < 0 || c < 0) {
            // Random fire
            do {
                r = Math.floor(Math.random() * SIZE);
                c = Math.floor(Math.random() * SIZE);
            } while (playerBoard[r][c].shot);
        }

        playerBoard[r][c].shot = true;

        if (playerBoard[r][c].ship) {
            // Add adjacent cells for smart targeting
            [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !playerBoard[nr][nc].shot) {
                    aiHitStack.push({ r: nr, c: nc });
                }
            });
            playerSunk = countSunk(playerBoard);
        }

        render();

        if (playerSunk >= SHIPS.length) {
            gameOver = true;
            endGame(false);
        }
    }

    function endGame(won) {
        document.getElementById('go-icon').textContent = won ? '🎉' : '💀';
        document.getElementById('go-title').textContent = won ? 'You Win!' : 'You Lost!';
        document.getElementById('go-shots').textContent = shots;
        const acc = shots > 0 ? Math.round((playerHits / shots) * 100) : 0;
        document.getElementById('go-accuracy').textContent = acc + '%';
        gameoverOverlay.classList.remove('hidden');
    }

    function newGame() {
        enemyBoard = createBoard();
        playerBoard = createBoard();
        placeShips(enemyBoard);
        placeShips(playerBoard);
        shots = 0; playerHits = 0; enemySunk = 0; playerSunk = 0;
        gameOver = false;
        aiHitStack = [];
        statusEl.textContent = 'Click the enemy grid to fire!';
        gameoverOverlay.classList.add('hidden');
        render();
    }

    // Click handler — enemy grid
    document.getElementById('enemy-grid').addEventListener('click', e => {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        playerFire(parseInt(cell.dataset.r), parseInt(cell.dataset.c));
    });

    // Buttons
    document.getElementById('new-game-btn').addEventListener('click', newGame);
    document.getElementById('play-again-btn').addEventListener('click', newGame);

    // Help
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

    // Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
    });

    newGame();
})();
