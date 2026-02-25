const words = ['SPECTRUM', 'JAVASCRIPT', 'DEVELOPER', 'KEYBOARD', 'ALGORITHM', 'FUNCTION', 'VARIABLE', 'TERMINAL', 'BROWSER', 'NETWORK', 'PROTOCOL', 'COMPILER', 'DATABASE', 'ANIMATION', 'GRADIENT', 'INTERFACE'];
let word, guessed, lives, gameOver;
const wordEl = document.getElementById('word'), livesEl = document.getElementById('lives'), kbEl = document.getElementById('keyboard'), msgEl = document.getElementById('msg');

function init() {
    word = words[Math.floor(Math.random() * words.length)];
    guessed = new Set(); lives = 6; gameOver = false;
    livesEl.textContent = lives; msgEl.textContent = '';
    renderWord(); renderKeyboard();
}

function renderWord() {
    wordEl.textContent = word.split('').map(c => guessed.has(c) ? c : '_').join(' ');
}

function renderKeyboard() {
    kbEl.innerHTML = '';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(l => {
        const btn = document.createElement('button');
        btn.className = 'key' + (guessed.has(l) ? (word.includes(l) ? ' used correct' : ' used wrong') : '');
        btn.textContent = l;
        btn.addEventListener('click', () => guess(l));
        kbEl.appendChild(btn);
    });
}

function guess(l) {
    if (gameOver || guessed.has(l)) return;
    guessed.add(l);
    if (!word.includes(l)) { lives--; livesEl.textContent = lives; }
    renderWord(); renderKeyboard();
    if (word.split('').every(c => guessed.has(c))) { msgEl.textContent = '🎉 You won!'; msgEl.style.color = '#2ed573'; gameOver = true; }
    else if (lives <= 0) { msgEl.textContent = `💀 The word was: ${word}`; msgEl.style.color = '#ff4757'; gameOver = true; }
}

document.addEventListener('keydown', e => { const k = e.key.toUpperCase(); if (k.length === 1 && k >= 'A' && k <= 'Z') guess(k); });
document.getElementById('new-btn').addEventListener('click', init);
init();
