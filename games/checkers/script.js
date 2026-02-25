const boardEl = document.getElementById('board'), turnEl = document.getElementById('turn');
let board, turn, selected, validMoves;

function init() {
    board = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) board[r][c] = { color: 'black', king: false };
    for (let r = 5; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) board[r][c] = { color: 'red', king: false };
    turn = 'red'; selected = null; validMoves = [];
    turnEl.textContent = 'Red'; turnEl.style.color = '#ff4757';
    render();
}

function getMoves(r, c) {
    const p = board[r][c]; if (!p) return [];
    const moves = [], dirs = p.king ? [-1, 1] : p.color === 'red' ? [-1] : [1];
    for (const dr of dirs) for (const dc of [-1, 1]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            if (!board[nr][nc]) moves.push({ r: nr, c: nc, jump: false });
            else if (board[nr][nc].color !== p.color) {
                const jr = nr + dr, jc = nc + dc;
                if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !board[jr][jc]) moves.push({ r: jr, c: jc, jump: true, mr: nr, mc: nc });
            }
        }
    }
    return moves;
}

function render() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        sq.className = 'sq ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
        if (selected && selected.r === r && selected.c === c) sq.classList.add('selected');
        if (validMoves.some(m => m.r === r && m.c === c)) sq.classList.add('highlight');
        if (board[r][c]) {
            const piece = document.createElement('div');
            piece.className = 'piece ' + board[r][c].color + (board[r][c].king ? ' king' : '');
            sq.appendChild(piece);
        }
        sq.addEventListener('click', () => clickSquare(r, c));
        boardEl.appendChild(sq);
    }
}

function clickSquare(r, c) {
    const move = validMoves.find(m => m.r === r && m.c === c);
    if (move) {
        board[r][c] = board[selected.r][selected.c]; board[selected.r][selected.c] = null;
        if (move.jump) board[move.mr][move.mc] = null;
        if ((r === 0 && board[r][c].color === 'red') || (r === 7 && board[r][c].color === 'black')) board[r][c].king = true;
        turn = turn === 'red' ? 'black' : 'red';
        turnEl.textContent = turn.charAt(0).toUpperCase() + turn.slice(1);
        turnEl.style.color = turn === 'red' ? '#ff4757' : '#a55eea';
        selected = null; validMoves = [];
    } else if (board[r][c] && board[r][c].color === turn) {
        selected = { r, c }; validMoves = getMoves(r, c);
    } else { selected = null; validMoves = []; }
    render();
}

document.getElementById('reset-btn').addEventListener('click', init);
init();
