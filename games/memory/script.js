const board = document.getElementById('memory-board');
const movesElem = document.getElementById('moves');
const timeElem = document.getElementById('time');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const gameMessage = document.getElementById('game-message');
const finalMovesElem = document.getElementById('final-moves');
const finalTimeElem = document.getElementById('final-time');

// 8 pairs of icons
const icons = [
    'american-football-outline', 'basket-outline', 'rocket-outline', 'planet-outline',
    'bug-outline', 'camera-outline', 'diamond-outline', 'game-controller-outline',
    'american-football-outline', 'basket-outline', 'rocket-outline', 'planet-outline',
    'bug-outline', 'camera-outline', 'diamond-outline', 'game-controller-outline'
];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matches = 0;
let time = 0;
let timer;

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        time++;
        timeElem.textContent = `${time}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function initGame() {
    board.innerHTML = '';
    shuffle(icons);
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    matches = 0;
    time = 0;
    movesElem.textContent = moves;
    timeElem.textContent = '0s';
    gameMessage.classList.add('hidden');

    stopTimer();

    icons.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = icon;

        card.innerHTML = `
            <div class="front-face">
                <ion-icon name="${icon}"></ion-icon>
            </div>
            <div class="back-face"></div>
        `;

        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    if (moves === 0 && !hasFlippedCard) {
        startTimer();
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesElem.textContent = moves;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matches++;
    if (matches === icons.length / 2) {
        setTimeout(gameWon, 500);
    } else {
        resetBoard();
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function gameWon() {
    stopTimer();
    finalMovesElem.textContent = moves;
    finalTimeElem.textContent = time;
    gameMessage.classList.remove('hidden');
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

initGame();
