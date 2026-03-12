// ===== Prime Logic =====
function isPrime(n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

function primeFactorization(n) {
    const factors = {};
    let d = 2;
    while (d * d <= n) {
        while (n % d === 0) {
            factors[d] = (factors[d] || 0) + 1;
            n /= d;
        }
        d++;
    }
    if (n > 1) factors[n] = (factors[n] || 0) + 1;
    return factors;
}

function getNearbyPrimes(n, range = 10) {
    const primes = [];
    for (let i = Math.max(2, n - range); i <= n + range; i++) {
        if (isPrime(i)) primes.push(i);
    }
    return primes;
}

function getNthPrimePosition(n) {
    if (!isPrime(n)) return null;
    let count = 0;
    for (let i = 2; i <= n; i++) {
        if (isPrime(i)) count++;
    }
    return count;
}

// ===== DOM =====
const numInput = document.getElementById('num-input');
const checkBtn = document.getElementById('check-btn');
const resultCard = document.getElementById('result-card');
const resultBadge = document.getElementById('result-badge');
const resultIcon = document.getElementById('result-icon');
const resultText = document.getElementById('result-text');
const resultDetail = document.getElementById('result-detail');
const factorizationSection = document.getElementById('factorization-section');
const factorChips = document.getElementById('factor-chips');
const nearbySection = document.getElementById('nearby-section');
const nearbyGrid = document.getElementById('nearby-grid');

// ===== Check =====
function check() {
    const val = numInput.value.trim();
    if (!val) return;
    const n = parseInt(val);
    if (isNaN(n) || n < 0 || n > 999999999) {
        resultCard.classList.remove('hidden');
        resultBadge.className = 'result-badge not-prime';
        resultIcon.setAttribute('name', 'alert-circle-outline');
        resultText.textContent = 'Enter a valid number (0 – 999,999,999)';
        resultDetail.textContent = '';
        factorizationSection.classList.add('hidden');
        nearbySection.classList.add('hidden');
        return;
    }

    const prime = isPrime(n);
    resultCard.classList.remove('hidden');

    if (prime) {
        resultBadge.className = 'result-badge prime';
        resultIcon.setAttribute('name', 'checkmark-circle');
        resultText.textContent = `${n.toLocaleString()} is PRIME`;
        const pos = getNthPrimePosition(n);
        resultDetail.textContent = pos ? `It's the ${ordinal(pos)} prime number` : '';
        factorizationSection.classList.add('hidden');
    } else {
        resultBadge.className = 'result-badge not-prime';
        resultIcon.setAttribute('name', 'close-circle');
        resultText.textContent = `${n.toLocaleString()} is NOT prime`;

        if (n < 2) {
            resultDetail.textContent = 'Numbers less than 2 are not prime';
            factorizationSection.classList.add('hidden');
        } else {
            // Find smallest factor
            let smallest = 2;
            while (n % smallest !== 0) smallest++;
            resultDetail.textContent = `Divisible by ${smallest}`;

            // Show factorization
            const factors = primeFactorization(n);
            factorChips.innerHTML = Object.entries(factors).map(([base, exp], i, arr) => {
                let html = `<span class="factor-chip">${base}`;
                if (exp > 1) html += `<sup>${exp}</sup>`;
                html += `</span>`;
                if (i < arr.length - 1) html += `<span class="factor-chip"><span class="times">×</span></span>`;
                return html;
            }).join('');
            factorizationSection.classList.remove('hidden');
        }
    }

    // Nearby primes
    const nearby = getNearbyPrimes(n, 15);
    nearbyGrid.innerHTML = nearby.map(p =>
        `<div class="nearby-num${p === n ? ' current' : ''} is-prime">${p}</div>`
    ).join('');
    nearbySection.classList.remove('hidden');
}

function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ===== Events =====
checkBtn.addEventListener('click', check);
numInput.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });

document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        numInput.value = btn.dataset.val;
        check();
    });
});

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');
    function updateIcon(theme) { icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline'); }
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        updateIcon(isLight ? 'light' : 'dark');
    });
}

initTheme();
