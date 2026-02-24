const canvas = document.getElementById('tetris-board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-board');
const nextCtx = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('hold-board');
const holdCtx = holdCanvas.getContext('2d');

const scoreElem = document.getElementById('score');
const levelElem = document.getElementById('level');
const linesElem = document.getElementById('lines');
const gameMessage = document.getElementById('game-message');
const msgTitle = document.getElementById('msg-title');
const startBtn = document.getElementById('start-btn');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30; // 300 / 10

// Scale main canvas
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
// Scale mini canvases (4x4 grid max for preview, 80px canvas -> 20px block)
const MINI_BLOCK = 20;
nextCtx.scale(MINI_BLOCK, MINI_BLOCK);
holdCtx.scale(MINI_BLOCK, MINI_BLOCK);

// Colors matching the original game style
const COLORS = [
    null,
    '#00FFFF', // I - Cyan
    '#0000FF', // J - Blue
    '#FFA500', // L - Orange
    '#FFFF00', // O - Yellow
    '#00FF00', // S - Green
    '#800080', // T - Purple
    '#FF0000'  // Z - Red
];

// Hex codes for grid blocks outline to look nice in both themes
const GRID_COLOR = 'rgba(150, 150, 150, 0.2)';

const SHAPES = [
    [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]], // J
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]], // L
    [[4, 4], [4, 4]], // O
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]], // S
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]], // T
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]  // Z
];

let board = [];
let piece = null;
let nextPiece = null;
let holdPiece = null;
let canHold = true;

let score = 0;
let level = 1;
let lines = 0;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let requestID;
let isPlaying = false;
let isPaused = false;

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function collide(board, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function drawBlock(ctx, x, y, colorCode, isGhost = false) {
    ctx.fillStyle = COLORS[colorCode];
    if (isGhost) {
        ctx.globalAlpha = 0.2;
    } else {
        ctx.globalAlpha = 1.0;
    }

    ctx.fillRect(x, y, 1, 1);

    // borders
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeRect(x, y, 1, 1);

    // highlight top left
    if (!isGhost) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(x, y, 1, 0.1);
        ctx.fillRect(x, y, 0.1, 1);
        // shadow bottom right
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x, y + 0.9, 1, 0.1);
        ctx.fillRect(x + 0.9, y, 0.1, 1);
    }
    ctx.globalAlpha = 1.0;
}

function drawMatrix(matrix, offset, targetCtx = ctx) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(targetCtx, x + offset.x, y + offset.y, value);
            }
        });
    });
}

function getGhostPos() {
    const ghost = {
        matrix: piece.matrix,
        pos: { x: piece.pos.x, y: piece.pos.y }
    };
    while (!collide(board, ghost)) {
        ghost.pos.y++;
    }
    ghost.pos.y--;
    return ghost.pos;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = document.documentElement.classList.contains('light-theme') ? '#fff' : '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.lineWidth = 0.02;
    ctx.strokeStyle = GRID_COLOR;
    for (let r = 0; r < ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r);
        ctx.lineTo(COLS, r);
        ctx.stroke();
    }
    for (let c = 0; c < COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c, 0);
        ctx.lineTo(c, ROWS);
        ctx.stroke();
    }

    drawMatrix(board, { x: 0, y: 0 });

    if (piece) {
        const ghostY = getGhostPos().y;
        piece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    drawBlock(ctx, x + piece.pos.x, y + ghostY, value, true);
                }
            });
        });

        drawMatrix(piece.matrix, piece.pos);
    }
}

function drawMiniCanvas(context, canvasObj, pieceType) {
    context.clearRect(0, 0, canvasObj.width, canvasObj.height);
    if (!pieceType) return;

    const matrix = SHAPES[pieceType];
    // Center logic
    const yOffset = matrix.length === 2 ? 1 : (matrix.length === 4 ? 0 : 0.5);
    const xOffset = matrix[0].length === 2 ? 1 : (matrix[0].length === 4 ? 0 : 0.5);

    drawMatrix(matrix, { x: xOffset, y: yOffset }, context);
}

function getRandomPiece() {
    const types = [1, 2, 3, 4, 5, 6, 7];
    return types[Math.floor(Math.random() * types.length)];
}

function createPieceObj(type) {
    return {
        type: type,
        matrix: SHAPES[type],
        pos: { x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2), y: 0 }
    };
}

function playerReset() {
    if (!nextPiece) nextPiece = getRandomPiece();
    piece = createPieceObj(nextPiece);
    nextPiece = getRandomPiece();

    drawMiniCanvas(nextCtx, nextCanvas, nextPiece);
    canHold = true;

    if (collide(board, piece)) {
        gameOver();
    }
}

function hold() {
    if (!canHold) return;

    if (holdPiece === null) {
        holdPiece = piece.type;
        playerReset();
    } else {
        const temp = piece.type;
        piece = createPieceObj(holdPiece);
        holdPiece = temp;
        // reset pos
        piece.pos.y = 0;
        piece.pos.x = Math.floor(COLS / 2) - Math.floor(piece.matrix[0].length / 2);
    }

    drawMiniCanvas(holdCtx, holdCanvas, holdPiece);
    canHold = false;
    dropCounter = 0;
}

function playerDrop() {
    piece.pos.y++;
    if (collide(board, piece)) {
        piece.pos.y--;
        merge(board, piece);
        playerReset();
        sweep();
    }
    dropCounter = 0;
}

function playerHardDrop() {
    while (!collide(board, piece)) {
        piece.pos.y++;
    }
    piece.pos.y--;
    merge(board, piece);
    playerReset();
    sweep();
    dropCounter = 0;
}

function playerMove(dir) {
    piece.pos.x += dir;
    if (collide(board, piece)) {
        piece.pos.x -= dir;
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerRotate(dir) {
    const pos = piece.pos.x;
    let offset = 1;
    rotate(piece.matrix, dir);

    // Wall kick simple logic
    while (collide(board, piece)) {
        piece.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > piece.matrix[0].length) {
            rotate(piece.matrix, -dir);
            piece.pos.x = pos;
            return;
        }
    }
}

function sweep() {
    let rowCount = 0;
    outer: for (let y = board.length - 1; y >= 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        // Found full row
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y; // check same index again
        rowCount++;
    }

    if (rowCount > 0) {
        lines += rowCount;

        // Classic scoring
        let points = 0;
        if (rowCount === 1) points = 40;
        if (rowCount === 2) points = 100;
        if (rowCount === 3) points = 300;
        if (rowCount === 4) points = 1200;
        score += points * level;

        level = Math.floor(lines / 10) + 1;
        // Decrease interval (faster)
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);

        scoreElem.textContent = score;
        linesElem.textContent = lines;
        levelElem.textContent = level;
    }
}

function update(time = 0) {
    if (!isPlaying) return;
    if (isPaused) {
        requestID = requestAnimationFrame(update);
        return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestID = requestAnimationFrame(update);
}

function gameOver() {
    isPlaying = false;
    cancelAnimationFrame(requestID);
    gameMessage.classList.remove('hidden');
    msgTitle.textContent = "GAME OVER";
    startBtn.textContent = "Play Again";
}

function startGame() {
    board = createMatrix(COLS, ROWS);
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    scoreElem.textContent = score;
    linesElem.textContent = lines;
    levelElem.textContent = level;

    holdPiece = null;
    drawMiniCanvas(holdCtx, holdCanvas, null);

    gameMessage.classList.add('hidden');
    isPlaying = true;
    isPaused = false;

    nextPiece = getRandomPiece();
    playerReset();

    lastTime = performance.now();
    update();
}

function togglePause() {
    if (!isPlaying) return;
    isPaused = !isPaused;
    if (isPaused) {
        gameMessage.classList.remove('hidden');
        msgTitle.textContent = "PAUSED";
        startBtn.textContent = "Resume";
    } else {
        gameMessage.classList.add('hidden');
        lastTime = performance.now();
    }
}

document.addEventListener('keydown', event => {
    if (!isPlaying || isPaused) {
        if (event.key === 'p' || event.key === 'P') togglePause();
        return;
    }

    if (event.key === 'ArrowLeft') {
        playerMove(-1);
        draw();
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
        draw();
    } else if (event.key === 'ArrowDown') {
        playerDrop();
        draw();
    } else if (event.key === 'ArrowUp') {
        playerRotate(1);
        draw();
    } else if (event.key === ' ') {
        event.preventDefault(); // stop scrolling
        playerHardDrop();
        draw();
    } else if (event.key === 'c' || event.key === 'C') {
        hold();
        draw();
    } else if (event.key === 'p' || event.key === 'P') {
        togglePause();
    }
});

// Mobile Controls
document.getElementById('btn-left').addEventListener('click', () => { if (isPlaying && !isPaused) { playerMove(-1); draw(); } });
document.getElementById('btn-right').addEventListener('click', () => { if (isPlaying && !isPaused) { playerMove(1); draw(); } });
document.getElementById('btn-down').addEventListener('click', () => { if (isPlaying && !isPaused) { playerDrop(); draw(); } });
document.getElementById('btn-rotate').addEventListener('click', () => { if (isPlaying && !isPaused) { playerRotate(1); draw(); } });
document.getElementById('btn-drop').addEventListener('click', () => { if (isPlaying && !isPaused) { playerHardDrop(); draw(); } });
document.getElementById('btn-hold').addEventListener('click', () => { if (isPlaying && !isPaused) { hold(); draw(); } });

startBtn.addEventListener('click', () => {
    if (isPaused) {
        togglePause();
    } else {
        startGame();
    }
});

// Initial draw of empty board
draw();

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, { passive: false });
