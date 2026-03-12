// ===== DOM =====
const priceInput = document.getElementById('price');
const downInput = document.getElementById('down');
const rateInput = document.getElementById('rate');
const priceSlider = document.getElementById('price-slider');
const downSlider = document.getElementById('down-slider');
const rateSlider = document.getElementById('rate-slider');
const amortBody = document.getElementById('amort-body');

let term = 30;

// ===== Format Currency =====
function formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('en-US');
}

// ===== Calculate Mortgage =====
function calculate() {
    const price = parseFloat(priceInput.value) || 0;
    const down = parseFloat(downInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;

    const principal = Math.max(0, price - down);
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = term * 12;

    let monthly = 0;
    let totalInterest = 0;
    let totalCost = 0;

    if (principal > 0 && monthlyRate > 0 && numPayments > 0) {
        monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                  (Math.pow(1 + monthlyRate, numPayments) - 1);
        totalCost = monthly * numPayments;
        totalInterest = totalCost - principal;
    } else if (principal > 0 && numPayments > 0) {
        // 0% interest
        monthly = principal / numPayments;
        totalCost = principal;
        totalInterest = 0;
    }

    // Update results
    document.getElementById('monthly').textContent = formatCurrency(monthly);
    document.getElementById('loan-amount').textContent = formatCurrency(principal);
    document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('total-cost').textContent = formatCurrency(totalCost);
    document.getElementById('down-pct').textContent = price > 0 ? Math.round((down / price) * 100) + '%' : '0%';

    // Cost bar
    const totalPayments = principal + totalInterest;
    if (totalPayments > 0) {
        const principalPct = (principal / totalPayments) * 100;
        document.getElementById('bar-principal').style.width = principalPct + '%';
        document.getElementById('bar-interest').style.width = (100 - principalPct) + '%';
    } else {
        document.getElementById('bar-principal').style.width = '50%';
        document.getElementById('bar-interest').style.width = '50%';
    }

    // Amortization schedule (yearly)
    generateAmortization(principal, monthlyRate, numPayments, monthly);
}

// ===== Amortization Schedule =====
function generateAmortization(principal, monthlyRate, numPayments, monthly) {
    amortBody.innerHTML = '';
    if (principal <= 0 || numPayments <= 0) return;

    let balance = principal;
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let i = 1; i <= numPayments; i++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthly - interest;
        balance -= principalPaid;
        yearPrincipal += principalPaid;
        yearInterest += interest;

        if (i % 12 === 0 || i === numPayments) {
            const year = Math.ceil(i / 12);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${year}</td>
                <td>${formatCurrency(yearPrincipal)}</td>
                <td>${formatCurrency(yearInterest)}</td>
                <td>${formatCurrency(Math.max(0, balance))}</td>
            `;
            amortBody.appendChild(row);
            yearPrincipal = 0;
            yearInterest = 0;
        }
    }
}

// ===== Sync sliders and inputs =====
function syncSliders() {
    priceSlider.value = priceInput.value;
    downSlider.value = downInput.value;
    rateSlider.value = rateInput.value;
}

priceInput.addEventListener('input', () => { syncSliders(); calculate(); });
downInput.addEventListener('input', () => { syncSliders(); calculate(); });
rateInput.addEventListener('input', () => { syncSliders(); calculate(); });

priceSlider.addEventListener('input', () => { priceInput.value = priceSlider.value; calculate(); });
downSlider.addEventListener('input', () => { downInput.value = downSlider.value; calculate(); });
rateSlider.addEventListener('input', () => { rateInput.value = rateSlider.value; calculate(); });

// ===== Term Buttons =====
document.querySelectorAll('.term-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.term-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        term = parseInt(btn.dataset.term);
        calculate();
    });
});

// ===== Toggle Amortization =====
const amortTable = document.getElementById('amort-table');
const amortIcon = document.getElementById('amort-icon');
document.getElementById('toggle-amort').addEventListener('click', () => {
    const isHidden = amortTable.classList.toggle('hidden');
    amortIcon.setAttribute('name', isHidden ? 'chevron-down-outline' : 'chevron-up-outline');
    document.getElementById('toggle-amort').querySelector('ion-icon + text') ;
});

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');

    function updateIcon(theme) {
        icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
    }

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('fossarium-theme', newTheme);
        updateIcon(newTheme);
    });
}

// ===== Init =====
initTheme();
calculate();
