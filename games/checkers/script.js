(() => {
    const boardEl = document.getElementById('board');
    const turnEl = document.getElementById('turn');
    const pCountEl = document.getElementById('p-count');
    const cCountEl = document.getElementById('c-count');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    const RED = 1, BLUE = 2, RED_K = 3, BLUE_K = 4;
    let board, selected, highlights, playerTurn, gameOver;

    function isRed(p) { return p === RED || p === RED_K; }
    function isBlue(p) { return p === BLUE || p === BLUE_K; }
    function isKing(p) { return p === RED_K || p === BLUE_K; }

    function initBoard() {
        board = Array.from({ length: 8 }, () => Array(8).fill(0));
        for (let r = 0; r < 3; r++)
            for (let c = 0; c < 8; c++)
                if ((r + c) % 2 === 1) board[r][c] = BLUE;
        for (let r = 5; r < 8; r++)
            for (let c = 0; c < 8; c++)
                if ((r + c) % 2 === 1) board[r][c] = RED;
    }

    function newGame() {
        initBoard(); selected = null; highlights = []; playerTurn = true; gameOver = false;
        gameoverOverlay.classList.add('hidden');
        render();
    }

    function getMoves(r, c) {
        const p = board[r][c];
        if (!p) return [];
        const dirs = [];
        if (isRed(p) || isKing(p)) dirs.push([-1, -1], [-1, 1]);
        if (isBlue(p) || isKing(p)) dirs.push([1, -1], [1, 1]);

        const jumps = [], steps = [];
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) continue;
            const target = board[nr][nc];
            if (target === 0) {
                steps.push({ r: nr, c: nc, jump: false });
            } else if ((isRed(p) && isBlue(target)) || (isBlue(p) && isRed(target))) {
                const jr = nr + dr, jc = nc + dc;
                if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && board[jr][jc] === 0) {
                    jumps.push({ r: jr, c: jc, jump: true, captR: nr, captC: nc });
                }
            }
        }
        return jumps.length > 0 ? jumps : steps;
    }

    function getAllMoves(isPlayerSide) {
        const test = isPlayerSide ? isRed : isBlue;
        let allJumps = [], allSteps = [];
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++)
                if (test(board[r][c])) {
                    const moves = getMoves(r, c);
                    moves.forEach(m => {
                        m.fromR = r; m.fromC = c;
                        m.jump ? allJumps.push(m) : allSteps.push(m);
                    });
                }
        return allJumps.length > 0 ? allJumps : allSteps;
    }

    function applyMove(m) {
        const piece = board[m.fromR][m.fromC];
        board[m.fromR][m.fromC] = 0;
        board[m.r][m.c] = piece;
        if (m.jump) board[m.captR][m.captC] = 0;
        // Promote
        if (isRed(piece) && m.r === 0) board[m.r][m.c] = RED_K;
        if (isBlue(piece) && m.r === 7) board[m.r][m.c] = BLUE_K;

        // Multi-jump
        if (m.jump) {
            const further = getMoves(m.r, m.c).filter(x => x.jump);
            if (further.length > 0) {
                selected = { r: m.r, c: m.c };
                highlights = further;
                render();
                return true; // More jumps
            }
        }
        return false;
    }

    function countPieces() {
        let red = 0, blue = 0;
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++) {
                if (isRed(board[r][c])) red++;
                if (isBlue(board[r][c])) blue++;
            }
        return { red, blue };
    }

    function checkEnd() {
        const { red, blue } = countPieces();
        pCountEl.textContent = red; cCountEl.textContent = blue;
        if (blue === 0 || getAllMoves(false).length === 0) {
            gameOver = true;
            document.getElementById('go-icon').textContent = '🎉';
            document.getElementById('go-title').textContent = 'You Win!';
            gameoverOverlay.classList.remove('hidden');
        } else if (red === 0 || getAllMoves(true).length === 0) {
            gameOver = true;
            document.getElementById('go-icon').textContent = '💀';
            document.getElementById('go-title').textContent = 'CPU Wins!';
            gameoverOverlay.classList.remove('hidden');
        }
    }

    function render() {
        boardEl.innerHTML = '';
        const { red, blue } = countPieces();
        pCountEl.textContent = red; cCountEl.textContent = blue;
        turnEl.textContent = playerTurn ? 'Your turn' : 'CPU...';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = document.createElement('div');
                sq.className = 'sq ' + ((r + c) % 2 === 1 ? 'dark' : 'light-sq');

                if (selected && selected.r === r && selected.c === c) sq.classList.add('selected');
                if (highlights.some(h => h.r === r && h.c === c)) sq.classList.add('highlight');

                const p = board[r][c];
                if (p) {
                    const piece = document.createElement('div');
                    piece.className = 'piece ' + (isRed(p) ? 'red' : 'blue');
                    if (isKing(p)) piece.classList.add('king');
                    sq.appendChild(piece);
                }

                sq.dataset.r = r; sq.dataset.c = c;
                sq.addEventListener('click', () => onCellClick(r, c));
                boardEl.appendChild(sq);
            }
        }
    }

    function onCellClick(r, c) {
        if (gameOver || !playerTurn) return;

        // Click on highlight = execute move
        const move = highlights.find(h => h.r === r && h.c === c);
        if (move) {
            const moreJumps = applyMove(move);
            if (!moreJumps) {
                selected = null; highlights = [];
                playerTurn = false;
                render(); checkEnd();
                if (!gameOver) setTimeout(cpuTurn, 600);
            }
            return;
        }

        // Click on own piece
        if (isRed(board[r][c])) {
            const allMoves = getAllMoves(true);
            const pieceMoves = allMoves.filter(m => m.fromR === r && m.fromC === c);
            if (pieceMoves.length > 0) {
                selected = { r, c };
                highlights = pieceMoves;
                render();
            }
        }
    }

    function cpuTurn() {
        if (gameOver) return;
        const moves = getAllMoves(false);
        if (moves.length === 0) { checkEnd(); return; }
        // Pick jump if available, else random
        const m = moves[Math.floor(Math.random() * moves.length)];
        const moreJumps = applyMove(m);
        if (moreJumps) {
            render();
            setTimeout(cpuTurn, 600);
        } else {
            playerTurn = true;
            selected = null; highlights = [];
            render(); checkEnd();
        }
    }

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

    newGame();
})();
