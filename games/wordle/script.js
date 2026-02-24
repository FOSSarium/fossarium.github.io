const boardElem = document.getElementById('wordle-board');
const keyboard = document.getElementById('keyboard');
const toast = document.getElementById('toast');
const restartBtn = document.getElementById('restart-btn');

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

let targetWord = "";
let currentGuess = [];
let guesses = []; // array of word strings
let isGameOver = false;

// Create UI Grid
function createBoard() {
    boardElem.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        // Initial state
        tile.dataset.state = 'empty';
        tile.id = `tile-${i}`;
        boardElem.appendChild(tile);
    }
}

function getActiveRow() {
    return guesses.length;
}

function initGame() {
    // pick random word
    targetWord = window.WORDS[Math.floor(Math.random() * window.WORDS.length)].toLowerCase();
    console.log("Target:", targetWord); // For testing

    currentGuess = [];
    guesses = [];
    isGameOver = false;

    createBoard();
    resetKeyboard();
}

function resetKeyboard() {
    const keys = keyboard.querySelectorAll('button');
    keys.forEach(key => {
        key.removeAttribute('data-state');
    });
}

function showToast(msg, duration = 2000) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function updateGrid() {
    const row = getActiveRow();
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tileIndex = row * WORD_LENGTH + i;
        const tile = document.getElementById(`tile-${tileIndex}`);

        if (currentGuess[i]) {
            tile.textContent = currentGuess[i];
            tile.dataset.state = 'tbd'; // To apply pop animation
        } else {
            tile.textContent = "";
            tile.dataset.state = 'empty';
        }
    }
}

function pressKey(key) {
    if (isGameOver) return;

    if (key === 'Enter') {
        submitGuess();
        return;
    }

    if (key === 'Backspace') {
        currentGuess.pop();
        updateGrid();
        return;
    }

    if (key.match(/^[a-z]$/) && currentGuess.length < WORD_LENGTH) {
        currentGuess.push(key);
        updateGrid();
    }
}

function submitGuess() {
    if (currentGuess.length !== WORD_LENGTH) {
        showToast("Not enough letters");
        shakeCurrentRow();
        return;
    }

    const guessStr = currentGuess.join("");
    // In a real app we'd validate against a 10,000+ word dictionary
    // For this clone, if it's 5 letters, we might just accept it or check window.VALID_WORDS
    // Allowing any 5 letters for simplicity unless it's a strict clone

    // Exact match check
    if (guessStr === targetWord) {
        flipRow(guessStr, true);
        return;
    }

    flipRow(guessStr, false);
}

function shakeCurrentRow() {
    const row = getActiveRow();
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = document.getElementById(`tile-${row * WORD_LENGTH + i}`);
        tile.classList.add('shake');
        // We'd need to add .shake to css, keeping simple for now
    }
}

function flipRow(guessStr, isWin) {
    const row = getActiveRow();
    const guessArray = currentGuess;

    // Determine states
    const states = new Array(WORD_LENGTH).fill('absent');
    const targetArray = targetWord.split('');

    // First pass: find correct letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArray[i] === targetArray[i]) {
            states[i] = 'correct';
            targetArray[i] = null; // consume letter
        }
    }

    // Second pass: find present letters (yellow)
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (states[i] === 'correct') continue;

        const targetIndex = targetArray.indexOf(guessArray[i]);
        if (targetIndex !== -1) {
            states[i] = 'present';
            targetArray[targetIndex] = null; // consume
        }
    }

    // Apply animations
    let animationTime = 0;
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = document.getElementById(`tile-${row * WORD_LENGTH + i}`);
        const letter = guessArray[i];

        setTimeout(() => {
            tile.classList.add('flip');
            setTimeout(() => {
                tile.dataset.state = states[i];
                updateKeyboard(letter, states[i]);
            }, FLIP_ANIMATION_DURATION / 2); // Change color mid-flip

            // Cleanup class
            setTimeout(() => {
                tile.classList.remove('flip');
            }, FLIP_ANIMATION_DURATION);

        }, i * 250); // Stagger
    }

    // Post flip
    setTimeout(() => {
        guesses.push(guessStr);
        currentGuess = [];

        if (isWin) {
            showToast("Genius!", 5000);
            isGameOver = true;
        } else if (guesses.length === 6) {
            showToast(targetWord.toUpperCase(), 5000);
            isGameOver = true;
        }
    }, WORD_LENGTH * 250 + FLIP_ANIMATION_DURATION);
}

function updateKeyboard(letter, state) {
    const btn = document.querySelector(`button[data-key="${letter}"]`);
    if (!btn) return;

    const currentState = btn.dataset.state;
    // State precedence: correct > present > absent
    if (currentState === 'correct') return;
    if (currentState === 'present' && state === 'absent') return;

    btn.dataset.state = state;
}

// Event Listeners
document.addEventListener('keydown', e => {
    let key = e.key;
    if (key === 'Enter' || key === 'Backspace') {
        pressKey(key);
    } else if (key.match(/^[a-zA-Z]$/)) {
        pressKey(key.toLowerCase());
    }
});

keyboard.addEventListener('click', e => {
    // Traverse up to find button if clicked inside ion-icon
    let el = e.target;
    while (el && el.tagName !== 'BUTTON' && el !== keyboard) {
        el = el.parentElement;
    }
    if (el && el.tagName === 'BUTTON') {
        pressKey(el.dataset.key);
    }
});

restartBtn.addEventListener('click', () => {
    document.activeElement.blur(); // Remove focus
    initGame();
});

// Start game
initGame();
