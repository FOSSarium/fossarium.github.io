(() => {
    const grid = document.getElementById('grid');
    const scoreElem = document.getElementById('score');
    const bestScoreElem = document.getElementById('best-score');
    const restartBtn = document.getElementById('restart-btn');
    const retryBtn = document.getElementById('retry-btn');
    const gameMessage = document.getElementById('game-message');
    const messageText = document.getElementById('message-text');
    const helpOverlay = document.getElementById('help-overlay');
    const boardContainer = document.getElementById('board-container');

    let cells = [];
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('fossarium-2048-best') || '0');
    let hasWon = false;
    bestScoreElem.textContent = bestScore;

    function createBoard() {
        grid.innerHTML = '';
        cells = [];
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.value = 0;
            grid.appendChild(cell);
            cells.push(cell);
        }
    }

    function updateBoard(mergedIndices = []) {
        cells.forEach((cell, idx) => {
            const val = parseInt(cell.dataset.value);
            cell.className = 'grid-cell';
            cell.textContent = val > 0 ? val : '';
            if (val > 0) {
                cell.classList.add(`tile-${Math.min(val, 2048)}`);
                if (mergedIndices.includes(idx)) cell.classList.add('pop');
            }
        });
    }

    function generateTile() {
        const emptyCells = cells.filter(c => parseInt(c.dataset.value) === 0);
        if (emptyCells.length === 0) return;
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.dataset.value = Math.random() < 0.9 ? 2 : 4;
    }

    function initGame() {
        score = 0;
        hasWon = false;
        scoreElem.textContent = score;
        gameMessage.classList.add('hidden');
        createBoard();
        generateTile();
        generateTile();
        updateBoard();
    }

    function move(direction) {
        let hasChanged = false;
        let newScore = 0;
        const mergedIndices = [];

        for (let i = 0; i < 4; i++) {
            let rowOrCol = [];
            for (let j = 0; j < 4; j++) {
                let index;
                if (direction === 'left') index = i * 4 + j;
                if (direction === 'right') index = i * 4 + (3 - j);
                if (direction === 'up') index = j * 4 + i;
                if (direction === 'down') index = (3 - j) * 4 + i;
                rowOrCol.push({ cell: cells[index], index });
            }

            let values = rowOrCol.map(c => parseInt(c.cell.dataset.value)).filter(v => v > 0);

            // Merge
            for (let k = 0; k < values.length - 1; k++) {
                if (values[k] === values[k + 1]) {
                    values[k] *= 2;
                    newScore += values[k];
                    values.splice(k + 1, 1);
                    // Track which position in the output gets the merged tile
                    mergedIndices.push(rowOrCol[k].index);
                }
            }

            while (values.length < 4) values.push(0);

            for (let j = 0; j < 4; j++) {
                if (parseInt(rowOrCol[j].cell.dataset.value) !== values[j]) {
                    rowOrCol[j].cell.dataset.value = values[j];
                    hasChanged = true;
                }
            }
        }

        if (hasChanged) {
            score += newScore;
            scoreElem.textContent = score;
            if (score > bestScore) {
                bestScore = score;
                bestScoreElem.textContent = bestScore;
                localStorage.setItem('fossarium-2048-best', bestScore);
            }
            generateTile();
            updateBoard(mergedIndices);

            // Win check
            if (!hasWon && cells.some(c => parseInt(c.dataset.value) >= 2048)) {
                hasWon = true;
                messageText.textContent = '🎉 You Win!';
                gameMessage.classList.remove('hidden');
            } else {
                checkGameOver();
            }
        }
    }

    function checkGameOver() {
        const emptyCells = cells.filter(c => parseInt(c.dataset.value) === 0);
        if (emptyCells.length > 0) return;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = parseInt(cells[i * 4 + j].dataset.value);
                if (j < 3 && current === parseInt(cells[i * 4 + j + 1].dataset.value)) return;
                if (i < 3 && current === parseInt(cells[(i + 1) * 4 + j].dataset.value)) return;
            }
        }

        messageText.textContent = 'Game Over!';
        gameMessage.classList.remove('hidden');
    }

    // Touch support
    let touchStartX = 0, touchStartY = 0;
    boardContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    boardContainer.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > 30) dx > 0 ? move('right') : move('left');
        } else {
            if (Math.abs(dy) > 30) dy > 0 ? move('down') : move('up');
        }
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        const key = e.key;
        if (key === 'ArrowUp' || key === 'w') { e.preventDefault(); move('up'); }
        else if (key === 'ArrowDown' || key === 's') { e.preventDefault(); move('down'); }
        else if (key === 'ArrowLeft' || key === 'a') { e.preventDefault(); move('left'); }
        else if (key === 'ArrowRight' || key === 'd') { e.preventDefault(); move('right'); }
    });

    // Prevent default scroll on arrow keys
    window.addEventListener('keydown', e => {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
    }, { passive: false });

    // Buttons
    restartBtn.addEventListener('click', initGame);
    retryBtn.addEventListener('click', initGame);

    // Help
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

    // Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
    });

    initGame();
})();
