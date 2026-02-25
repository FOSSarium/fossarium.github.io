let target, attempts, guesses;
const input = document.getElementById('guess-input'), hint = document.getElementById('hint'), attEl = document.getElementById('attempts'), histEl = document.getElementById('history');
function init() { target = Math.floor(Math.random() * 100) + 1; attempts = 0; guesses = []; attEl.textContent = 0; hint.textContent = ''; hint.style.color = ''; histEl.innerHTML = ''; input.value = ''; input.disabled = false; }
function guess() {
    const v = parseInt(input.value); if (isNaN(v) || v < 1 || v > 100) return;
    attempts++; attEl.textContent = attempts; guesses.push(v);
    histEl.innerHTML = guesses.map(g => `<span>${g}</span>`).join('');
    input.value = '';
    if (v === target) { hint.textContent = `🎉 Got it in ${attempts} tries!`; hint.style.color = '#2ed573'; input.disabled = true; }
    else if (v < target) { hint.textContent = '📈 Too low!'; hint.style.color = '#ffa502'; }
    else { hint.textContent = '📉 Too high!'; hint.style.color = '#ff4757'; }
}
document.getElementById('guess-btn').addEventListener('click', guess);
input.addEventListener('keydown', e => { if (e.key === 'Enter') guess(); });
document.getElementById('new-btn').addEventListener('click', init);
init();
