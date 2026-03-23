(() => {
    const boardEl = document.getElementById('board');
    const blackScoreEl = document.getElementById('black-score');
    const whiteScoreEl = document.getElementById('white-score');
    const turnEl = document.getElementById('turn');
    const gameoverOverlay = document.getElementById('gameover-overlay');
    const helpOverlay = document.getElementById('help-overlay');
    const modeBotBtn = document.getElementById('mode-bot');
    const modePvpBtn = document.getElementById('mode-pvp');

    const SIZE = 9;
    let board = [], currentPlayer = 'black', gameMode = 'bot', passCount = 0, gameOver = false;
    let captures = { black: 0, white: 0 };

    function init() {
        board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
        currentPlayer = 'black';
        passCount = 0;
        gameOver = false;
        captures = { black: 0, white: 0 };
        gameoverOverlay.classList.add('hidden');
        render();
    }

    function setMode(mode) {
        gameMode = mode;
        modeBotBtn.classList.toggle('active', mode === 'bot');
        modePvpBtn.classList.toggle('active', mode === 'pvp');
        init();
    }

    function render() {
        boardEl.style.gridTemplateColumns = `repeat(${SIZE}, 32px)`;
        boardEl.style.gridTemplateRows = `repeat(${SIZE}, 32px)`;
        boardEl.innerHTML = '';

        let blackTerritory = 0, whiteTerritory = 0;

        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (board[row][col]) {
                    const stone = document.createElement('div');
                    stone.className = `stone ${board[row][col]}`;
                    cell.appendChild(stone);
                } else if (!gameOver) {
                    cell.addEventListener('click', () => placeStone(row, col));
                }

                boardEl.appendChild(cell);
            }
        }

        blackScoreEl.textContent = captures.black;
        whiteScoreEl.textContent = captures.white;
        turnEl.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    }

    function getGroup(row, col, color) {
        const group = [];
        const visited = new Set();
        const stack = [[row, col]];

        while (stack.length > 0) {
            const [r, c] = stack.pop();
            const key = `${r},${c}`;
            if (visited.has(key)) continue;
            visited.add(key);
            group.push([r, c]);

            [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr, dc]) => {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === color) {
                    stack.push([nr, nc]);
                }
            });
        }
        return group;
    }

    function getLiberties(group) {
        const liberties = new Set();
        group.forEach(([r, c]) => {
            [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr, dc]) => {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !board[nr][nc]) {
                    liberties.add(`${nr},${nc}`);
                }
            });
        });
        return liberties.size;
    }

    function placeStone(row, col) {
        if (board[row][col] || gameOver) return;
        if (gameMode === 'bot' && currentPlayer !== 'black') return;

        board[row][col] = currentPlayer;
        const opponent = currentPlayer === 'black' ? 'white' : 'black';
        let captured = 0;

        // Check for captures
        [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr, dc]) => {
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === opponent) {
                const group = getGroup(nr, nc, opponent);
                if (getLiberties(group) === 0) {
                    group.forEach(([gr, gc]) => { board[gr][gc] = null; });
                    captured += group.length;
                }
            }
        });

        // Check suicide rule
        const ownGroup = getGroup(row, col, currentPlayer);
        if (getLiberties(ownGroup) === 0 && captured === 0) {
            board[row][col] = null;
            return;
        }

        if (currentPlayer === 'black') captures.black += captured;
        else captures.white += captured;

        passCount = 0;
        currentPlayer = opponent;
        render();

        if (gameMode === 'bot' && currentPlayer === 'white') {
            setTimeout(botMove, 500);
        }
    }

    function botMove() {
        if (gameOver) return;

        // Simple bot: find valid moves and pick randomly
        const validMoves = [];
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (!board[row][col]) validMoves.push([row, col]);
            }
        }

        if (validMoves.length === 0) {
            pass();
            return;
        }

        const [row, col] = validMoves[Math.floor(Math.random() * validMoves.length)];
        placeStone(row, col);
    }

    function pass() {
        passCount++;
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        render();

        if (passCount >= 2) {
            endGame();
        } else if (gameMode === 'bot' && currentPlayer === 'white') {
            setTimeout(botMove, 500);
        }
    }

    function endGame() {
        gameOver = true;
        const blackTotal = captures.black;
        const whiteTotal = captures.white + 6.5; // Komi

        let icon = '🏆', title, msg;
        if (blackTotal > whiteTotal) {
            title = 'Black Wins!';
            msg = `Black: ${blackTotal} — White: ${whiteTotal.toFixed(1)}`;
        } else if (whiteTotal > blackTotal) {
            title = 'White Wins!';
            msg = `White: ${whiteTotal.toFixed(1)} — Black: ${blackTotal}`;
        } else {
            icon = '🤝';
            title = "It's a Draw!";
            msg = `Both: ${blackTotal}`;
        }

        document.getElementById('go-icon').textContent = icon;
        document.getElementById('go-title').textContent = title;
        document.getElementById('go-msg').textContent = msg;
        gameoverOverlay.classList.remove('hidden');
    }

    document.getElementById('new-btn').addEventListener('click', init);
    document.getElementById('pass-btn').addEventListener('click', pass);
    document.getElementById('play-again-btn').addEventListener('click', init);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    gameoverOverlay.addEventListener('click', e => { if (e.target === gameoverOverlay) gameoverOverlay.classList.add('hidden'); });

    modeBotBtn.addEventListener('click', () => setMode('bot'));
    modePvpBtn.addEventListener('click', () => setMode('pvp'));

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

    init();
})();
