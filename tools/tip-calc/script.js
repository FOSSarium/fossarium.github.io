let tipPct = 15, people = 1;
const bill = document.getElementById('bill'), customTip = document.getElementById('custom-tip');
const peopleCount = document.getElementById('people-count');

function calc() {
    const b = parseFloat(bill.value) || 0;
    const tip = b * (tipPct / 100);
    const total = b + tip;
    const pp = people > 0 ? total / people : total;
    document.getElementById('tip-amount').textContent = '$' + tip.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
    document.getElementById('per-person').textContent = '$' + pp.toFixed(2);
}

document.querySelectorAll('.tip-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tip-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    tipPct = parseInt(b.dataset.tip);
    customTip.value = '';
    calc();
}));

customTip.addEventListener('input', () => {
    const v = parseFloat(customTip.value);
    if (!isNaN(v)) { tipPct = v; document.querySelectorAll('.tip-btn').forEach(x => x.classList.remove('active')); }
    calc();
});

bill.addEventListener('input', calc);
document.getElementById('inc-people').addEventListener('click', () => { people++; peopleCount.textContent = people; calc(); });
document.getElementById('dec-people').addEventListener('click', () => { if (people > 1) { people--; peopleCount.textContent = people; calc(); } });
document.getElementById('reset-btn').addEventListener('click', () => {
    bill.value = ''; customTip.value = ''; tipPct = 15; people = 1; peopleCount.textContent = '1';
    document.querySelectorAll('.tip-btn').forEach(x => x.classList.remove('active'));
    document.querySelector('[data-tip="15"]').classList.add('active');
    calc();
});

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
