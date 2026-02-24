const grid = document.getElementById('grid');
const scoreElem = document.getElementById('score');
const bestScoreElem = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');
const retryBtn = document.getElementById('retry-btn');
const gameMessage = document.getElementById('game-message');
const messageText = document.getElementById('message-text');

let cells = [];
let score = 0;
let bestScore = localStorage.getItem('2048-best-score') || 0;
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

function updateBoard() {
    cells.forEach(cell => {
        const val = parseInt(cell.dataset.value);
        cell.className = 'grid-cell'; // reset classes
        cell.textContent = val > 0 ? val : '';
        if (val > 0) {
            cell.classList.add(`tile-${val}`);
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

    for (let i = 0; i < 4; i++) {
        let rowOrCol = [];
        for (let j = 0; j < 4; j++) {
            let index;
            if (direction === 'left') index = i * 4 + j;
            if (direction === 'right') index = i * 4 + (3 - j);
            if (direction === 'up') index = j * 4 + i;
            if (direction === 'down') index = (3 - j) * 4 + i;
            rowOrCol.push(cells[index]);
        }

        // Extract values
        let values = rowOrCol.map(c => parseInt(c.dataset.value)).filter(v => v > 0);

        // Merge
        for (let k = 0; k < values.length - 1; k++) {
            if (values[k] === values[k + 1]) {
                values[k] *= 2;
                newScore += values[k];
                values.splice(k + 1, 1);
            }
        }

        // Fill back zeros
        while (values.length < 4) {
            values.push(0);
        }

        // Update dataset
        for (let j = 0; j < 4; j++) {
            if (parseInt(rowOrCol[j].dataset.value) !== values[j]) {
                rowOrCol[j].dataset.value = values[j];
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
            localStorage.setItem('2048-best-score', bestScore);
        }
        generateTile();
        updateBoard();
        checkGameOver();
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

    messageText.textContent = "Game Over!";
    gameMessage.classList.remove('hidden');
}

// Touch support
let touchStartX = 0;
let touchStartY = 0;

grid.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

grid.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 30) { // threshold
            dx > 0 ? move('right') : move('left');
        }
    } else {
        if (Math.abs(dy) > 30) {
            dy > 0 ? move('down') : move('up');
        }
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); move('up'); }
    else if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); move('down'); }
    else if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); move('left'); }
    else if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); move('right'); }
});

restartBtn.addEventListener('click', initGame);
retryBtn.addEventListener('click', initGame);

initGame();
