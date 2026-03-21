(() => {
    const gridEl = document.getElementById('grid');
    const acrossCluesEl = document.getElementById('across-clues');
    const downCluesEl = document.getElementById('down-clues');
    const winOverlay = document.getElementById('win-overlay');
    const helpOverlay = document.getElementById('help-overlay');

    // Puzzle data sets
    const PUZZLES = [
        {
            size: 9,
            words: [
                { word: 'PYTHON', r: 0, c: 0, dir: 'across', clue: 'Popular programming language named after a snake' },
                { word: 'LINUX', r: 0, c: 0, dir: 'down', clue: 'Open-source operating system kernel' },
                { word: 'OPEN', r: 2, c: 2, dir: 'across', clue: '___ source software' },
                { word: 'NODE', r: 0, c: 4, dir: 'down', clue: 'JavaScript runtime environment' },
                { word: 'CODE', r: 2, c: 4, dir: 'down', clue: 'What programmers write' },
                { word: 'GIT', r: 4, c: 0, dir: 'across', clue: 'Version control system by Linus Torvalds' },
                { word: 'RUST', r: 6, c: 1, dir: 'across', clue: 'Memory-safe systems language by Mozilla' },
                { word: 'WEB', r: 0, c: 2, dir: 'down', clue: 'World Wide ___' },
                { word: 'API', r: 6, c: 5, dir: 'across', clue: 'Application Programming Interface' },
                { word: 'DATA', r: 4, c: 2, dir: 'down', clue: 'Information stored digitally' },
            ]
        },
        {
            size: 9,
            words: [
                { word: 'JAVA', r: 0, c: 0, dir: 'across', clue: 'Language that runs on a virtual machine' },
                { word: 'JSON', r: 0, c: 0, dir: 'down', clue: 'Lightweight data interchange format' },
                { word: 'HTML', r: 2, c: 1, dir: 'across', clue: 'Markup language for web pages' },
                { word: 'CSS', r: 0, c: 2, dir: 'down', clue: 'Cascading Style Sheets' },
                { word: 'SQL', r: 4, c: 0, dir: 'across', clue: 'Database query language' },
                { word: 'REACT', r: 4, c: 4, dir: 'down', clue: 'Facebook-created UI library' },
                { word: 'BASH', r: 6, c: 0, dir: 'across', clue: 'Unix shell and command language' },
                { word: 'VIM', r: 6, c: 4, dir: 'across', clue: 'Modal text editor' },
                { word: 'HEAP', r: 2, c: 3, dir: 'down', clue: 'Memory region for dynamic allocation' },
                { word: 'BUG', r: 4, c: 0, dir: 'down', clue: 'A software defect' },
            ]
        },
        {
            size: 9,
            words: [
                { word: 'DOCKER', r: 0, c: 0, dir: 'across', clue: 'Container platform for deploying apps' },
                { word: 'DEBUG', r: 0, c: 0, dir: 'down', clue: 'Find and fix errors in code' },
                { word: 'ARRAY', r: 2, c: 2, dir: 'across', clue: 'Ordered collection of elements' },
                { word: 'STACK', r: 0, c: 4, dir: 'down', clue: 'LIFO data structure' },
                { word: 'FORK', r: 4, c: 1, dir: 'across', clue: 'Create a copy of a repository' },
                { word: 'MERGE', r: 6, c: 0, dir: 'across', clue: 'Combine branches in Git' },
                { word: 'CLOUD', r: 4, c: 5, dir: 'down', clue: 'Remote computing infrastructure' },
                { word: 'REPO', r: 2, c: 5, dir: 'down', clue: 'Short for repository' },
                { word: 'TYPE', r: 0, c: 2, dir: 'down', clue: '___ Script, a JavaScript superset' },
                { word: 'LOG', r: 6, c: 6, dir: 'down', clue: 'Record of events or errors' },
            ]
        }
    ];

    let puzzle, board, userBoard, cells, selectedCell, selectedWord, wordMap;

    function pickPuzzle() {
        return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    }

    function newGame() {
        puzzle = pickPuzzle();
        const S = puzzle.size;
        board = Array.from({ length: S }, () => Array(S).fill(null));
        userBoard = Array.from({ length: S }, () => Array(S).fill(''));
        wordMap = {};
        selectedCell = null; selectedWord = null;
        winOverlay.classList.add('hidden');

        // Place words
        puzzle.words.forEach((w, idx) => {
            w.num = idx + 1;
            for (let i = 0; i < w.word.length; i++) {
                const r = w.dir === 'across' ? w.r : w.r + i;
                const c = w.dir === 'across' ? w.c + i : w.c;
                board[r][c] = w.word[i];
                const key = `${r},${c}`;
                if (!wordMap[key]) wordMap[key] = [];
                wordMap[key].push(w);
            }
        });

        render();
        renderClues();
    }

    function getWordCells(w) {
        const cells = [];
        for (let i = 0; i < w.word.length; i++) {
            const r = w.dir === 'across' ? w.r : w.r + i;
            const c = w.dir === 'across' ? w.c + i : w.c;
            cells.push({ r, c });
        }
        return cells;
    }

    function render() {
        const S = puzzle.size;
        gridEl.style.gridTemplateColumns = `repeat(${S}, 1fr)`;
        gridEl.innerHTML = '';
        cells = {};

        // Find which cells need numbers
        const numMap = {};
        puzzle.words.forEach(w => { numMap[`${w.r},${w.c}`] = w.num; });

        for (let r = 0; r < S; r++) {
            for (let c = 0; c < S; c++) {
                const div = document.createElement('div');
                const key = `${r},${c}`;
                div.className = 'gcell ' + (board[r][c] ? 'active' : 'blocked');
                div.dataset.r = r; div.dataset.c = c;

                if (board[r][c]) {
                    if (numMap[key]) {
                        const num = document.createElement('span');
                        num.className = 'num';
                        num.textContent = numMap[key];
                        div.appendChild(num);
                    }

                    const input = document.createElement('input');
                    input.maxLength = 1;
                    input.value = userBoard[r][c];
                    input.addEventListener('input', e => onInput(r, c, e));
                    input.addEventListener('focus', () => selectCell(r, c));
                    input.addEventListener('keydown', e => onKeyDown(r, c, e));
                    div.appendChild(input);
                    cells[key] = { div, input };
                }

                gridEl.appendChild(div);
            }
        }
        updateHighlights();
    }

    function selectCell(r, c) {
        const key = `${r},${c}`;
        selectedCell = { r, c };
        const words = wordMap[key] || [];
        if (words.length > 0) {
            if (selectedWord && words.includes(selectedWord)) {
                // Toggle direction
                const idx = words.indexOf(selectedWord);
                selectedWord = words[(idx + 1) % words.length];
            } else {
                selectedWord = words[0];
            }
        }
        updateHighlights();
    }

    function updateHighlights() {
        Object.values(cells).forEach(({ div }) => {
            div.classList.remove('selected', 'highlight');
        });
        document.querySelectorAll('.clue').forEach(el => el.classList.remove('active-clue'));

        if (selectedWord) {
            const wCells = getWordCells(selectedWord);
            wCells.forEach(({ r, c }) => {
                const k = `${r},${c}`;
                if (cells[k]) cells[k].div.classList.add('highlight');
            });

            const clueEl = document.getElementById(`clue-${selectedWord.num}-${selectedWord.dir}`);
            if (clueEl) clueEl.classList.add('active-clue');
        }
        if (selectedCell) {
            const k = `${selectedCell.r},${selectedCell.c}`;
            if (cells[k]) cells[k].div.classList.add('selected');
        }
    }

    function onInput(r, c, e) {
        const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        e.target.value = val;
        userBoard[r][c] = val;
        if (val) moveToNext(r, c);
        checkWin();
    }

    function onKeyDown(r, c, e) {
        if (e.key === 'Backspace' && !userBoard[r][c]) {
            moveToPrev(r, c);
            e.preventDefault();
        } else if (e.key === 'ArrowRight') { moveDir(r, c, 0, 1); e.preventDefault(); }
        else if (e.key === 'ArrowLeft') { moveDir(r, c, 0, -1); e.preventDefault(); }
        else if (e.key === 'ArrowDown') { moveDir(r, c, 1, 0); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { moveDir(r, c, -1, 0); e.preventDefault(); }
    }

    function moveToNext(r, c) {
        if (!selectedWord) return;
        const dr = selectedWord.dir === 'across' ? 0 : 1;
        const dc = selectedWord.dir === 'across' ? 1 : 0;
        focusCell(r + dr, c + dc);
    }

    function moveToPrev(r, c) {
        if (!selectedWord) return;
        const dr = selectedWord.dir === 'across' ? 0 : 1;
        const dc = selectedWord.dir === 'across' ? 1 : 0;
        focusCell(r - dr, c - dc);
    }

    function moveDir(r, c, dr, dc) {
        focusCell(r + dr, c + dc);
    }

    function focusCell(r, c) {
        const k = `${r},${c}`;
        if (cells[k]) {
            cells[k].input.focus();
        }
    }

    function renderClues() {
        acrossCluesEl.innerHTML = '';
        downCluesEl.innerHTML = '';
        puzzle.words.forEach(w => {
            const div = document.createElement('div');
            div.className = 'clue';
            div.id = `clue-${w.num}-${w.dir}`;
            div.innerHTML = `<span class="clue-num">${w.num}.</span> ${w.clue}`;
            div.addEventListener('click', () => {
                selectedWord = w;
                selectedCell = { r: w.r, c: w.c };
                updateHighlights();
                focusCell(w.r, w.c);
            });
            (w.dir === 'across' ? acrossCluesEl : downCluesEl).appendChild(div);
        });
    }

    function checkWin() {
        const S = puzzle.size;
        for (let r = 0; r < S; r++)
            for (let c = 0; c < S; c++)
                if (board[r][c] && userBoard[r][c] !== board[r][c]) return;
        winOverlay.classList.remove('hidden');
    }

    document.getElementById('check-btn').addEventListener('click', () => {
        const S = puzzle.size;
        for (let r = 0; r < S; r++)
            for (let c = 0; c < S; c++) {
                const k = `${r},${c}`;
                if (cells[k]) {
                    cells[k].div.classList.remove('wrong');
                    if (userBoard[r][c] && userBoard[r][c] !== board[r][c]) {
                        cells[k].div.classList.add('wrong');
                    }
                }
            }
    });

    document.getElementById('reveal-btn').addEventListener('click', () => {
        const S = puzzle.size;
        for (let r = 0; r < S; r++)
            for (let c = 0; c < S; c++)
                if (board[r][c]) {
                    userBoard[r][c] = board[r][c];
                    const k = `${r},${c}`;
                    if (cells[k]) { cells[k].input.value = board[r][c]; cells[k].div.classList.remove('wrong'); }
                }
    });

    document.getElementById('new-btn').addEventListener('click', newGame);
    document.getElementById('win-new-btn').addEventListener('click', newGame);
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });
    winOverlay.addEventListener('click', e => { if (e.target === winOverlay) winOverlay.classList.add('hidden'); });
    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        themeIcon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        themeIcon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        themeIcon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });

    // Fullscreen
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const exitFsBtn = document.getElementById('exit-fs-btn');
    const gameRoot = document.getElementById('game-root');

    function updateFullscreenButtons() {
        const isFs = !!document.fullscreenElement;
        fullscreenBtn.style.display = isFs ? 'none' : 'flex';
        exitFsBtn.style.display = isFs ? 'flex' : 'none';
    }

    fullscreenBtn.addEventListener('click', () => {
        gameRoot.requestFullscreen().catch(() => { });
    });

    exitFsBtn.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
    });

    document.addEventListener('fullscreenchange', updateFullscreenButtons);
    updateFullscreenButtons();

    newGame();
})();
