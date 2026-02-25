const SIZE = 4;
const targetGrid = document.getElementById('target-grid'), playerGrid = document.getElementById('player-grid');
const scoreEl = document.getElementById('score'), levelEl = document.getElementById('level'), msgEl = document.getElementById('msg');
let target, player, score = 0, level = 1;

function generate() {
    const count = 3 + level;
    target = Array(SIZE * SIZE).fill(false);
    const indices = [...Array(SIZE * SIZE).keys()].sort(() => Math.random() - 0.5).slice(0, Math.min(count, SIZE * SIZE));
    indices.forEach(i => target[i] = true);
    player = Array(SIZE * SIZE).fill(false);
    msgEl.textContent = '';
    renderTarget(); renderPlayer();
}

function renderTarget() {
    targetGrid.innerHTML = '';
    target.forEach(on => {
        const cell = document.createElement('div');
        cell.className = 'cell ' + (on ? 'on' : 'off');
        targetGrid.appendChild(cell);
    });
}

function renderPlayer() {
    playerGrid.innerHTML = '';
    player.forEach((on, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell ' + (on ? 'on' : 'off');
        cell.addEventListener('click', () => { player[i] = !player[i]; renderPlayer(); });
        playerGrid.appendChild(cell);
    });
}

document.getElementById('check-btn').addEventListener('click', () => {
    const correct = target.every((v, i) => v === player[i]);
    if (correct) { score += level * 10; level++; scoreEl.textContent = score; levelEl.textContent = level; msgEl.textContent = '✓ Correct! Next level...'; msgEl.style.color = '#2ed573'; setTimeout(generate, 800); }
    else { msgEl.textContent = '✗ Not quite. Try again!'; msgEl.style.color = '#ff4757'; }
});

document.getElementById('new-btn').addEventListener('click', () => { level = 1; score = 0; scoreEl.textContent = 0; levelEl.textContent = 1; generate(); });
generate();
