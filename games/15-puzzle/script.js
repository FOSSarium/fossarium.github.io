(() => {
    const boardEl = document.getElementById('board');
    const movesEl = document.getElementById('moves');
    const timerEl = document.getElementById('timer');
    const bestEl = document.getElementById('best');
    const winOverlay = document.getElementById('win-overlay');
    const winMoves = document.getElementById('win-moves');
    const winTime = document.getElementById('win-time');
    const helpOverlay = document.getElementById('help-overlay');

    let tiles, emptyIndex, moves, timerInterval, seconds, solved;

    const bestData = JSON.parse(localStorage.getItem('fossarium-15puzzle-best') || 'null');
    if (bestData) bestEl.textContent = `${bestData.moves}m`;

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        stopTimer();
        seconds = 0;
        timerEl.textContent = '0:00';
        timerInterval = setInterval(() => {
            seconds++;
            timerEl.textContent = formatTime(seconds);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function init() {
        tiles = [...Array(15).keys()].map(i => i + 1);
        tiles.push(0);
        emptyIndex = 15;
        moves = 0;
        solved = false;
        movesEl.textContent = 0;
        stopTimer();
        timerEl.textContent = '0:00';
    }

    function shuffle() {
        init();
        for (let i = 0; i < 300; i++) {
            const neighbors = getNeighbors(emptyIndex);
            const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
            [tiles[emptyIndex], tiles[pick]] = [tiles[pick], tiles[emptyIndex]];
            emptyIndex = pick;
        }
        moves = 0;
        movesEl.textContent = 0;
        winOverlay.classList.add('hidden');
        startTimer();
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
            div.className = 'tile';
            if (t === 0) {
                div.classList.add('empty');
            } else {
                div.textContent = t;
                // Check if tile is in correct position
                if (t === i + 1) div.classList.add('correct');
            }
            div.addEventListener('click', () => clickTile(i));
            boardEl.appendChild(div);
        });
    }

    function clickTile(i) {
        if (solved) return;
        if (!getNeighbors(i).includes(emptyIndex)) return;

        [tiles[emptyIndex], tiles[i]] = [tiles[i], tiles[emptyIndex]];
        emptyIndex = i;
        moves++;
        movesEl.textContent = moves;
        render();

        if (tiles.every((t, idx) => t === (idx === 15 ? 0 : idx + 1))) {
            solved = true;
            stopTimer();
            winMoves.textContent = moves;
            winTime.textContent = formatTime(seconds);

            // Check best
            const prev = JSON.parse(localStorage.getItem('fossarium-15puzzle-best') || 'null');
            if (!prev || moves < prev.moves) {
                localStorage.setItem('fossarium-15puzzle-best', JSON.stringify({ moves, time: seconds }));
                bestEl.textContent = `${moves}m`;
            }

            setTimeout(() => winOverlay.classList.remove('hidden'), 300);
        }
    }

    // Event listeners
    document.getElementById('shuffle-btn').addEventListener('click', shuffle);
    document.getElementById('play-again-btn').addEventListener('click', shuffle);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', (e) => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    winOverlay.addEventListener('click', (e) => { if (e.target === winOverlay) winOverlay.classList.add('hidden'); });

    // Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        const el = document.getElementById('game-root');
        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (solved) return;
        let targetIdx = -1;
        if (e.key === 'ArrowUp' && emptyIndex + 4 < 16) targetIdx = emptyIndex + 4;
        if (e.key === 'ArrowDown' && emptyIndex - 4 >= 0) targetIdx = emptyIndex - 4;
        if (e.key === 'ArrowLeft' && emptyIndex % 4 < 3) targetIdx = emptyIndex + 1;
        if (e.key === 'ArrowRight' && emptyIndex % 4 > 0) targetIdx = emptyIndex - 1;
        if (targetIdx >= 0) {
            e.preventDefault();
            clickTile(targetIdx);
        }
    });

    shuffle();
})();
