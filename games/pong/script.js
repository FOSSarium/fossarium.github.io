const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const playerScoreElem = document.getElementById('player-score');
const aiScoreElem = document.getElementById('ai-score');
const gameMessage = document.getElementById('game-message');
const messageText = document.getElementById('message-text');

let isPlaying = false;
let animationId;

const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 10;
const playerColor = '#58a6ff';
const aiColor = '#ff5858';
const ballColor = '#ffffff';

const player = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    dy: 0,
    speed: 8
};

const ai = {
    x: canvas.width - 20 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    speed: 5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: 5,
    dy: 5,
    speed: 7
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 1, i, 2, 15, 'rgba(255,255,255,0.3)');
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ball.dx > 0 ? -ball.speed : ball.speed;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

function update() {
    if (!isPlaying) return;

    // Move AI simple logic
    const distanceToBall = ball.y - (ai.y + ai.height / 2);
    if (Math.abs(distanceToBall) > ai.speed) {
        ai.y += distanceToBall > 0 ? ai.speed : -ai.speed;
    }

    // AI constraints
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
    }

    // Paddle collision
    let paddle = ball.x < canvas.width / 2 ? player : ai;

    // Check hit
    if (ball.x - ball.size < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y + ball.size > paddle.y &&
        ball.y - ball.size < paddle.y + paddle.height) {

        let collidePoint = ball.y - (paddle.y + paddle.height / 2);
        collidePoint = collidePoint / (paddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = ball.x < canvas.width / 2 ? 1 : -1;

        // Increase speed slightly
        ball.speed += 0.2;

        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
    }

    // Score update
    if (ball.x - ball.size < 0) {
        ai.score++;
        aiScoreElem.textContent = ai.score;
        checkWin();
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        player.score++;
        playerScoreElem.textContent = player.score;
        checkWin();
        resetBall();
    }
}

function checkWin() {
    if (player.score >= 5 || ai.score >= 5) {
        isPlaying = false;
        gameMessage.classList.remove('hidden');
        messageText.textContent = player.score >= 5 ? "YOU WIN!" : "AI WINS!";
        messageText.innerHTML += "<br><span style='font-size:0.7em'>Click or tap to play again</span>";
        player.score = 0;
        ai.score = 0;
    }
}

function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    drawNet();

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, playerColor);
    drawRect(ai.x, ai.y, ai.width, ai.height, aiColor);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.size, ballColor);
}

function gameLoop() {
    update();
    render();
    animationId = requestAnimationFrame(gameLoop);
}

// Controls
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    return (e.clientY - rect.top) * scaleY;
}

function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    return (e.touches[0].clientY - rect.top) * scaleY;
}

canvas.addEventListener('mousemove', e => {
    if (!isPlaying) return;
    let y = getMousePos(e) - player.height / 2;
    if (y < 0) y = 0;
    if (y + player.height > canvas.height) y = canvas.height - player.height;
    player.y = y;
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!isPlaying) return;
    let y = getTouchPos(e) - player.height / 2;
    if (y < 0) y = 0;
    if (y + player.height > canvas.height) y = canvas.height - player.height;
    player.y = y;
}, { passive: false });

function startGame() {
    if (!isPlaying) {
        playerScoreElem.textContent = player.score;
        aiScoreElem.textContent = ai.score;
        ball.speed = 7;
        isPlaying = true;
        gameMessage.classList.add('hidden');
        resetBall();
    }
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') startGame();
});

gameMessage.addEventListener('click', startGame);
gameMessage.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startGame();
});

// Initial render
render();
gameLoop(); /* Start loop early to show initial render, update() will early-out if not playing */
