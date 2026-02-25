const box = document.getElementById('box'), bestEl = document.getElementById('best');
let state = 'idle', timer = null, startTime = 0, best = Infinity;
box.addEventListener('click', () => {
    if (state === 'idle') { state = 'waiting'; box.textContent = 'Wait for green...'; box.className = 'box waiting'; timer = setTimeout(() => { state = 'go'; box.textContent = 'CLICK NOW!'; box.className = 'box go'; startTime = Date.now(); }, 1000 + Math.random() * 3000); }
    else if (state === 'waiting') { clearTimeout(timer); state = 'idle'; box.textContent = 'Too early! Click to try again.'; box.className = 'box'; }
    else if (state === 'go') { const ms = Date.now() - startTime; state = 'idle'; box.className = 'box result'; box.textContent = ms + 'ms — Click to try again'; if (ms < best) { best = ms; bestEl.textContent = ms; } }
});
