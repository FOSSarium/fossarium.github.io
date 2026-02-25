const emoji = { rock: '🪨', paper: '📄', scissors: '✂️' };
const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
let pScore = 0, cScore = 0;
document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const player = btn.dataset.c;
        const choices = Object.keys(emoji);
        const cpu = choices[Math.floor(Math.random() * 3)];
        document.getElementById('player-pick').textContent = emoji[player];
        document.getElementById('cpu-pick').textContent = emoji[cpu];
        const res = document.getElementById('result');
        if (player === cpu) { res.textContent = "It's a tie!"; res.style.color = 'var(--text-muted)'; }
        else if (beats[player] === cpu) { pScore++; document.getElementById('p-score').textContent = pScore; res.textContent = 'You win! 🎉'; res.style.color = '#2ed573'; }
        else { cScore++; document.getElementById('c-score').textContent = cScore; res.textContent = 'CPU wins! 😢'; res.style.color = '#ff4757'; }
    });
});
