const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let highScore = localStorage.getItem('snake-high-score') || 0;
highScoreElement.textContent = highScore;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let gameLoop = null;
let isRunning = false;

// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    generateFood();
    score = 0;
    scoreElement.textContent = score;
    nextDx = 1;
    nextDy = 0;
    dx = 1;
    dy = 0;
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(draw, 100);
    isRunning = true;
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Make sure food doesn't spawn on snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function draw() {
    // Update direction
    dx = nextDx;
    dy = nextDy;

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snake-high-score', highScore);
        }
        generateFood();
    } else {
        snake.pop();
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = '#ff416c';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff416c';
    ctx.beginPath();
    ctx.roundRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2, 4);
    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#00b09b'; // Head
        } else {
            ctx.fillStyle = '#38ef7d'; // Body
        }
        ctx.beginPath();
        ctx.roundRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2, 4);
        ctx.fill();
    });
}

function gameOver() {
    clearInterval(gameLoop);
    isRunning = false;
    ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '16px Inter, Arial';
    ctx.fillStyle = '#8b949e';
    ctx.fillText('Press Start / Restart to Try Again', canvas.width / 2, canvas.height / 2 + 40);
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy !== 1) { nextDx = 0; nextDy = -1; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy !== -1) { nextDx = 0; nextDy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx !== 1) { nextDx = -1; nextDy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx !== -1) { nextDx = 1; nextDy = 0; }
            break;
    }
});

// Touch / Swipe controls
canvas.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

canvas.addEventListener('touchmove', e => {
    e.preventDefault(); // Prevent scrolling while playing
}, { passive: false });

canvas.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Require a minimum swipe distance
    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && dx !== -1) {
            nextDx = 1; nextDy = 0; // Right
        } else if (diffX < 0 && dx !== 1) {
            nextDx = -1; nextDy = 0; // Left
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && dy !== -1) {
            nextDx = 0; nextDy = 1; // Down
        } else if (diffY < 0 && dy !== 1) {
            nextDx = 0; nextDy = -1; // Up
        }
    }
}

startBtn.addEventListener('click', () => {
    initGame();
});

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'var(--text-color)';
ctx.font = 'bold 20px Inter, Arial';
ctx.textAlign = 'center';
// Use a neutral gray if var fails on canvas without computed style
ctx.fillStyle = '#8b949e';
ctx.fillText('Click Start to Play', canvas.width / 2, canvas.height / 2);

window.addEventListener("keydown", function (e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, { passive: false });
