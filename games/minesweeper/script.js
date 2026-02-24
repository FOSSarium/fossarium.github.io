const boardElem = document.getElementById('minesweeper-board');
const minesCountElem = document.getElementById('mines-count');
const timerElem = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const levelBtn = document.getElementById('level-btn');
const gameMessage = document.getElementById('game-message');
const endTitle = document.getElementById('end-title');
const playAgainBtn = document.getElementById('play-again-btn');

const LEVELS = [
    { name: "Easy (9x9)", rows: 9, cols: 9, mines: 10 },
    { name: "Medium (16x16)", rows: 16, cols: 16, mines: 40 },
    { name: "Hard (16x30)", rows: 16, cols: 30, mines: 99 }
];

let currentLevelIdx = 1;
let rows, cols, totalMines;
let board = [];
let flagsPlaced = 0;
let isGameOver = false;
let isFirstClick = true;
let timerInterval;
let secondsTime = 0;
let cellsRevealed = 0;

function initLevel() {
    const lvl = LEVELS[currentLevelIdx];
    rows = lvl.rows;
    cols = lvl.cols;
    totalMines = lvl.mines;
    levelBtn.textContent = lvl.name;

    // Update CSS Grid
    boardElem.style.gridTemplateColumns = `repeat(${cols}, 25px)`;
    boardElem.style.gridTemplateRows = `repeat(${rows}, 25px)`;

    initGame();
}

function initGame() {
    boardElem.innerHTML = '';
    board = [];
    flagsPlaced = 0;
    minesCountElem.textContent = String(totalMines).padStart(3, '0');
    isGameOver = false;
    isFirstClick = true;
    cellsRevealed = 0;

    clearInterval(timerInterval);
    secondsTime = 0;
    timerElem.textContent = '000';

    gameMessage.classList.add('hidden');
    gameMessage.classList.remove('win', 'lose');

    for (let r = 0; r < rows; r++) {
        let rowArray = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('ms-cell');
            cell.dataset.r = r;
            cell.dataset.c = c;

            // events
            cell.addEventListener('mousedown', handleCellClick);
            // prevent context menu on right click
            cell.addEventListener('contextmenu', e => e.preventDefault());

            boardElem.appendChild(cell);

            rowArray.push({
                element: cell,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            });
        }
        board.push(rowArray);
    }
}

function handleCellClick(e) {
    if (isGameOver) return;

    const r = parseInt(e.target.dataset.r);
    const c = parseInt(e.target.dataset.c);
    const cellObj = board[r][c];

    // Right click (Flag)
    if (e.button === 2) {
        if (!cellObj.isRevealed) {
            cellObj.isFlagged = !cellObj.isFlagged;
            cellObj.element.classList.toggle('flagged');
            flagsPlaced += cellObj.isFlagged ? 1 : -1;
            minesCountElem.textContent = String(Math.max(0, totalMines - flagsPlaced)).padStart(3, '0');
        }
        return;
    }

    // Left click (Reveal)
    if (e.button === 0) {
        if (cellObj.isFlagged || cellObj.isRevealed) return;

        if (isFirstClick) {
            placeMines(r, c);
            startTimer();
            isFirstClick = false;
        }

        revealCell(r, c);
        checkWin();
    }
}

function placeMines(firstRow, firstCol) {
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        // Don't place mine on first click or if already a mine
        if (!board[r][c].isMine && (r !== firstRow || c !== firstCol)) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate numbers
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].isMine) {
                let count = 0;
                // Check 8 neighbors
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
                            if (board[r + i][c + j].isMine) count++;
                        }
                    }
                }
                board[r][c].neighborMines = count;
            }
        }
    }
}

function revealCell(r, c) {
    const cellObj = board[r][c];
    if (cellObj.isRevealed || cellObj.isFlagged) return;

    cellObj.isRevealed = true;
    cellObj.element.classList.add('revealed');
    cellsRevealed++;

    if (cellObj.isMine) {
        cellObj.element.classList.add('mine');
        gameOver(false);
        return;
    }

    if (cellObj.neighborMines > 0) {
        cellObj.element.textContent = cellObj.neighborMines;
        cellObj.element.classList.add(`val-${cellObj.neighborMines}`);
    } else {
        // Flood fill empty cells
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols) {
                    revealCell(r + i, c + j);
                }
            }
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        secondsTime++;
        if (secondsTime <= 999) {
            timerElem.textContent = String(secondsTime).padStart(3, '0');
        }
    }, 1000);
}

function checkWin() {
    const nonMineCells = (rows * cols) - totalMines;
    if (cellsRevealed === nonMineCells) {
        gameOver(true);
    }
}

function gameOver(win) {
    isGameOver = true;
    clearInterval(timerInterval);

    // Reveal all mines safely
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellObj = board[r][c];
            if (cellObj.isMine && !cellObj.isFlagged) {
                cellObj.element.classList.add('revealed', 'mine');
            } else if (!cellObj.isMine && cellObj.isFlagged) {
                // Wrong flag
                cellObj.element.classList.add('revealed');
                cellObj.element.style.background = '#ffc107'; // Indicate error
                cellObj.element.textContent = 'X';
            }
        }
    }

    setTimeout(() => {
        gameMessage.classList.remove('hidden');
        if (win) {
            gameMessage.classList.add('win');
            endTitle.textContent = "You Win!";
        } else {
            gameMessage.classList.add('lose');
            endTitle.textContent = "Game Over!";
        }
    }, 800);
}

levelBtn.addEventListener('click', () => {
    currentLevelIdx = (currentLevelIdx + 1) % LEVELS.length;
    initLevel();
});

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start game
initLevel();
