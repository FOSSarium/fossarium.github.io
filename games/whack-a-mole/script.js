const grid = document.getElementById('grid'), scoreEl = document.getElementById('score'), timeEl = document.getElementById('time'), startBtn = document.getElementById('start-btn');
let score = 0, timeLeft = 30, timer = null, moleTimer = null, activeHole = -1;

// Create 9 holes
for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.className = 'hole'; hole.textContent = '🕳️';
    hole.addEventListener('click', () => whack(i));
    grid.appendChild(hole);
}

function whack(i) {
    if (i !== activeHole || !timer) return;
    score++; scoreEl.textContent = score;
    const holes = grid.children;
    holes[i].classList.remove('active'); holes[i].classList.add('hit'); holes[i].textContent = '💥';
    setTimeout(() => { holes[i].classList.remove('hit'); holes[i].textContent = '🕳️'; }, 200);
    activeHole = -1; showMole();
}

function showMole() {
    const holes = grid.children;
    if (activeHole >= 0) { holes[activeHole].classList.remove('active'); holes[activeHole].textContent = '🕳️'; }
    activeHole = Math.floor(Math.random() * 9);
    holes[activeHole].classList.add('active'); holes[activeHole].textContent = '🐹';
    const delay = Math.max(400, 1000 - score * 20);
    moleTimer = setTimeout(() => { if (activeHole >= 0) { holes[activeHole].classList.remove('active'); holes[activeHole].textContent = '🕳️'; activeHole = -1; showMole(); } }, delay);
}

startBtn.addEventListener('click', () => {
    score = 0; timeLeft = 30; scoreEl.textContent = 0; timeEl.textContent = 30;
    startBtn.style.display = 'none';
    showMole();
    timer = setInterval(() => {
        timeLeft--; timeEl.textContent = timeLeft;
        if (timeLeft <= 0) { clearInterval(timer); clearTimeout(moleTimer); timer = null; const holes = grid.children; if (activeHole >= 0) { holes[activeHole].classList.remove('active'); holes[activeHole].textContent = '🕳️'; } activeHole = -1; startBtn.style.display = ''; startBtn.textContent = `Game Over! Score: ${score}. Play Again`; }
    }, 1000);
});
