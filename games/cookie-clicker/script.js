(() => {
    const cookieEl = document.getElementById('cookie');
    const cookiesEl = document.getElementById('cookies');
    const cpcEl = document.getElementById('cpc');
    const cpsEl = document.getElementById('cps');
    const upgradesEl = document.getElementById('upgrades');
    const floatingEl = document.getElementById('floating-nums');
    const helpOverlay = document.getElementById('help-overlay');

    const UPGRADES = [
        { id: 'cursor',    icon: '👆', name: 'Auto Cursor',    desc: '+1 cookie/sec',       baseCost: 15,    cps: 1,   cpc: 0 },
        { id: 'grandma',   icon: '👵', name: 'Grandma',        desc: '+5 cookies/sec',      baseCost: 100,   cps: 5,   cpc: 0 },
        { id: 'farm',      icon: '🌾', name: 'Cookie Farm',    desc: '+20 cookies/sec',     baseCost: 500,   cps: 20,  cpc: 0 },
        { id: 'clicker',   icon: '🖱️', name: 'Better Click',  desc: '+1 per click',        baseCost: 50,    cps: 0,   cpc: 1 },
        { id: 'factory',   icon: '🏭', name: 'Factory',        desc: '+50 cookies/sec',     baseCost: 2000,  cps: 50,  cpc: 0 },
        { id: 'double',    icon: '✨', name: 'Double Click',   desc: '+5 per click',        baseCost: 500,   cps: 0,   cpc: 5 },
        { id: 'mine',      icon: '⛏️', name: 'Cookie Mine',   desc: '+150 cookies/sec',    baseCost: 10000, cps: 150, cpc: 0 },
        { id: 'mega',      icon: '💎', name: 'Mega Click',     desc: '+25 per click',       baseCost: 5000,  cps: 0,   cpc: 25 },
    ];

    let cookies = 0, cpc = 1, cps = 0, owned = {};

    function loadGame() {
        const save = JSON.parse(localStorage.getItem('fossarium-cookie-save') || 'null');
        if (save) {
            cookies = save.cookies || 0;
            cpc = save.cpc || 1;
            cps = save.cps || 0;
            owned = save.owned || {};
        }
    }

    function saveGame() {
        localStorage.setItem('fossarium-cookie-save', JSON.stringify({ cookies, cpc, cps, owned }));
    }

    function formatNum(n) {
        if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
        if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
        return Math.floor(n).toString();
    }

    function getCost(upgrade) {
        const count = owned[upgrade.id] || 0;
        return Math.floor(upgrade.baseCost * Math.pow(1.15, count));
    }

    function updateUI() {
        cookiesEl.textContent = formatNum(cookies);
        cpcEl.textContent = formatNum(cpc);
        cpsEl.textContent = formatNum(cps);
    }

    function renderUpgrades() {
        upgradesEl.innerHTML = '';
        UPGRADES.forEach(u => {
            const cost = getCost(u);
            const count = owned[u.id] || 0;
            const canAfford = cookies >= cost;

            const card = document.createElement('div');
            card.className = 'upgrade-card' + (canAfford ? '' : ' locked');
            card.innerHTML = `
                <div class="upgrade-icon">${u.icon}</div>
                <div class="upgrade-info">
                    <div class="upgrade-name">${u.name}</div>
                    <div class="upgrade-desc">${u.desc}</div>
                </div>
                <div style="text-align:right">
                    <div class="upgrade-cost">🍪 ${formatNum(cost)}</div>
                    <div class="upgrade-owned">Owned: ${count}</div>
                </div>
            `;
            if (canAfford) {
                card.addEventListener('click', () => buyUpgrade(u));
            }
            upgradesEl.appendChild(card);
        });
    }

    function buyUpgrade(u) {
        const cost = getCost(u);
        if (cookies < cost) return;
        cookies -= cost;
        owned[u.id] = (owned[u.id] || 0) + 1;
        cpc += u.cpc;
        cps += u.cps;
        updateUI();
        renderUpgrades();
        saveGame();
    }

    function clickCookie(e) {
        cookies += cpc;
        updateUI();
        renderUpgrades();

        // Floating number
        const num = document.createElement('div');
        num.className = 'float-num';
        num.textContent = '+' + formatNum(cpc);
        const rect = cookieEl.getBoundingClientRect();
        const areaRect = floatingEl.getBoundingClientRect();
        num.style.left = (rect.left - areaRect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
        num.style.top = (rect.top - areaRect.top + 20) + 'px';
        floatingEl.appendChild(num);
        setTimeout(() => num.remove(), 800);
    }

    cookieEl.addEventListener('click', clickCookie);

    // Auto CPS - only update UI every 100ms, don't re-render upgrades
    setInterval(() => {
        if (cps > 0) {
            cookies += cps / 10;
            cookiesEl.textContent = formatNum(cookies);
        }
    }, 100);

    // Update upgrade buttons state less frequently
    setInterval(() => {
        updateUI();
        renderUpgrades();
    }, 300);

    // Auto save
    setInterval(saveGame, 5000);

    // Reset
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('Reset all progress?')) {
            cookies = 0; cpc = 1; cps = 0; owned = {};
            localStorage.removeItem('fossarium-cookie-save');
            updateUI(); renderUpgrades();
        }
    });

    // Help
    document.getElementById('help-btn').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
    document.getElementById('close-help-btn').addEventListener('click', () => helpOverlay.classList.add('hidden'));
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.classList.add('hidden'); });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('ion-icon');

    function updateThemeIcon() {
        if (document.documentElement.classList.contains('light-theme')) {
            themeIcon.setAttribute('name', 'moon-outline');
        } else {
            themeIcon.setAttribute('name', 'sunny-outline');
        }
    }

    updateThemeIcon();

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLightMode = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLightMode ? 'light' : 'dark');
        updateThemeIcon();
    });

    loadGame(); updateUI(); renderUpgrades();
})();
