const colors = [{ name: 'RED', hex: '#ff4757' }, { name: 'BLUE', hex: '#1e90ff' }, { name: 'GREEN', hex: '#2ed573' }, { name: 'YELLOW', hex: '#ffa502' }, { name: 'PURPLE', hex: '#a55eea' }, { name: 'ORANGE', hex: '#ff6348' }];
const wordEl = document.getElementById('word'), scoreEl = document.getElementById('score'), timeEl = document.getElementById('time'), startBtn = document.getElementById('start-btn');
let score = 0, timeLeft = 30, timer = null, currentMatch = false;

function nextRound() {
    const wordColor = colors[Math.floor(Math.random() * colors.length)];
    const displayColor = Math.random() > 0.5 ? wordColor : colors[Math.floor(Math.random() * colors.length)];
    currentMatch = wordColor.name === displayColor.name;
    wordEl.textContent = wordColor.name;
    wordEl.style.color = displayColor.hex;
}

function answer(isYes) {
    if (!timer) return;
    if (isYes === currentMatch) score++;
    else score = Math.max(0, score - 1);
    scoreEl.textContent = score;
    nextRound();
}

document.getElementById('yes-btn').addEventListener('click', () => answer(true));
document.getElementById('no-btn').addEventListener('click', () => answer(false));

startBtn.addEventListener('click', () => {
    score = 0; timeLeft = 30; scoreEl.textContent = 0; timeEl.textContent = 30;
    startBtn.style.display = 'none';
    nextRound();
    timer = setInterval(() => {
        timeLeft--; timeEl.textContent = timeLeft;
        if (timeLeft <= 0) { clearInterval(timer); timer = null; startBtn.style.display = ''; startBtn.textContent = `Score: ${score}! Play Again`; }
    }, 1000);
});
