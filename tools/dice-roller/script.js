const result = document.getElementById("result");
const totalEl = document.getElementById("total");
const historyEl = document.getElementById("history");
const rollBtn = document.getElementById("roll-btn");
const typeSelect = document.getElementById("type");
const countInput = document.getElementById("count");
const quickBtns = document.querySelectorAll(".quick-btn");

const hist = [];

function rollDice(sides = null, count = null) {
    const s = sides || parseInt(typeSelect.value);
    const c = count || parseInt(countInput.value);
    
    if (isNaN(c) || c < 1) return;
    
    rollBtn.disabled = true;
    
    // Initial "shaking" state
    result.innerHTML = Array(c).fill(0).map(() => `<div class="die rolling">?</div>`).join("");
    totalEl.textContent = "...";

    setTimeout(() => {
        const rolls = [];
        for (let i = 0; i < c; i++) {
            rolls.push(Math.floor(Math.random() * s) + 1);
        }

        // Update Display with pop animation
        result.innerHTML = rolls.map(r => `<div class="die pop">${r}</div>`).join("");
        
        const sum = rolls.reduce((a, b) => a + b, 0);
        totalEl.textContent = sum;

        // Update History
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        hist.unshift(`<span style="color: var(--accent-color)">${timestamp}</span>: ${c}d${s} → [${rolls.join(", ")}] = <strong>${sum}</strong>`);
        
        historyEl.innerHTML = hist.slice(0, 20).join("<br>");
        rollBtn.disabled = false;
    }, 600);
}

quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const sides = parseInt(btn.dataset.sides);
        typeSelect.value = sides;
        countInput.value = 1;
        rollDice(sides, 1);
    });
});

rollBtn.addEventListener("click", () => rollDice());

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    
    const setDarkMode = () => {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    };
    const setLightMode = () => {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    };

    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        setLightMode();
    } else {
        setDarkMode();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light-theme')) {
            setDarkMode();
            localStorage.setItem('fossarium-theme', 'dark');
        } else {
            setLightMode();
            localStorage.setItem('fossarium-theme', 'light');
        }
    });
}

initTheme();
totalEl.textContent = "0";
historyEl.textContent = "No rolls yet";
