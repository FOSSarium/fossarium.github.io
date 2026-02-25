const boardEl = document.getElementById('board'), movesEl = document.getElementById('moves');
let tiles, emptyIndex, moves;

function init() {
    tiles = [...Array(15).keys()].map(i => i + 1);
    tiles.push(0);
    emptyIndex = 15; moves = 0; movesEl.textContent = 0;
}

function shuffle() {
    init();
    for (let i = 0; i < 200; i++) {
        const neighbors = getNeighbors(emptyIndex);
        const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        [tiles[emptyIndex], tiles[pick]] = [tiles[pick], tiles[emptyIndex]];
        emptyIndex = pick;
    }
    moves = 0; movesEl.textContent = 0;
    render();
}

function getNeighbors(idx) {
    const n = [], r = Math.floor(idx / 4), c = idx % 4;
    if (r > 0) n.push(idx - 4);
    if (r < 3) n.push(idx + 4);
    if (c > 0) n.push(idx - 1);
    if (c < 3) n.push(idx + 1);
    return n;
}

function render() {
    boardEl.innerHTML = '';
    tiles.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'tile' + (t === 0 ? ' empty' : '');
        div.textContent = t === 0 ? '' : t;
        div.addEventListener('click', () => clickTile(i));
        boardEl.appendChild(div);
    });
}

function clickTile(i) {
    if (!getNeighbors(i).includes(emptyIndex)) return;
    [tiles[emptyIndex], tiles[i]] = [tiles[i], tiles[emptyIndex]];
    emptyIndex = i;
    moves++; movesEl.textContent = moves;
    render();
    if (tiles.every((t, idx) => t === (idx === 15 ? 0 : idx + 1))) {
        setTimeout(() => alert(`🎉 Solved in ${moves} moves!`), 100);
    }
}

document.getElementById('shuffle-btn').addEventListener('click', shuffle);
shuffle();
