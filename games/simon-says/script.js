const btns = document.querySelectorAll('.simon-btn'), roundEl = document.getElementById('round'), msgEl = document.getElementById('msg'), startBtn = document.getElementById('start-btn');
let sequence = [], playerIndex = 0, playing = false;

function flash(i, dur = 400) {
    return new Promise(res => { btns[i].classList.add('lit'); setTimeout(() => { btns[i].classList.remove('lit'); setTimeout(res, 100); }, dur); });
}

async function playSequence() {
    playing = false; msgEl.textContent = 'Watch...';
    for (const i of sequence) await flash(i);
    playing = true; playerIndex = 0; msgEl.textContent = 'Your turn!';
}

function nextRound() {
    sequence.push(Math.floor(Math.random() * 4));
    roundEl.textContent = sequence.length;
    playSequence();
}

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!playing) return;
        const i = parseInt(btn.dataset.i);
        flash(i, 200);
        if (i !== sequence[playerIndex]) { playing = false; msgEl.textContent = `Game Over! You reached round ${sequence.length}.`; startBtn.textContent = 'Play Again'; startBtn.style.display = ''; return; }
        playerIndex++;
        if (playerIndex === sequence.length) { playing = false; msgEl.textContent = 'Correct! Next round...'; setTimeout(nextRound, 800); }
    });
});

startBtn.addEventListener('click', () => { sequence = []; startBtn.style.display = 'none'; nextRound(); });
