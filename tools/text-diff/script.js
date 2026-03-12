const textA = document.getElementById('text-a'), textB = document.getElementById('text-b');
const diffOutput = document.getElementById('diff-output'), diffStats = document.getElementById('diff-stats');

function lcs(a, b) {
    const m = a.length, n = b.length, dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);
    const result = []; let i = m, j = n;
    while (i > 0 && j > 0) {
        if (a[i-1] === b[j-1]) { result.unshift({type:'same',val:a[i-1]}); i--; j--; }
        else if (dp[i-1][j] > dp[i][j-1]) { result.unshift({type:'removed',val:a[i-1]}); i--; }
        else { result.unshift({type:'added',val:b[j-1]}); j--; }
    }
    while (i > 0) { result.unshift({type:'removed',val:a[--i]}); }
    while (j > 0) { result.unshift({type:'added',val:b[--j]}); }
    return result;
}

function compare() {
    const a = textA.value.split('\n'), b = textB.value.split('\n');
    const diff = lcs(a, b);
    let added = 0, removed = 0, unchanged = 0, ln = 0;
    diffOutput.innerHTML = diff.map(d => {
        ln++;
        if (d.type === 'added') { added++; return `<div class="diff-line added"><span class="ln">+</span><span>${esc(d.val)}</span></div>`; }
        if (d.type === 'removed') { removed++; return `<div class="diff-line removed"><span class="ln">-</span><span>${esc(d.val)}</span></div>`; }
        unchanged++; return `<div class="diff-line unchanged"><span class="ln">${ln}</span><span>${esc(d.val)}</span></div>`;
    }).join('');
    document.getElementById('added-count').textContent = added;
    document.getElementById('removed-count').textContent = removed;
    document.getElementById('unchanged-count').textContent = unchanged;
    diffStats.classList.remove('hidden'); diffOutput.classList.remove('hidden');
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('compare-btn').addEventListener('click', compare);
document.getElementById('clear-a').addEventListener('click', () => { textA.value = ''; });
document.getElementById('clear-b').addEventListener('click', () => { textB.value = ''; });

(function() {
    const b = document.getElementById('theme-toggle'), icon = b.querySelector('ion-icon');
    const u = t => icon.setAttribute('name', t === 'light' ? 'moon-outline' : 'sunny-outline');
    const sv = localStorage.getItem('fossarium-theme');
    if (sv) u(sv); else if (matchMedia('(prefers-color-scheme:light)').matches) u('light');
    b.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const l = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', l ? 'light' : 'dark'); u(l ? 'light' : 'dark');
    });
})();
