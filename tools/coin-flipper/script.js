let heads = 0, tails = 0, total = 0;
const coin = document.getElementById("coin");
const stats = document.getElementById("stats");
const flipBtn = document.getElementById("flip-btn");

function flip() {
    if (coin.classList.contains("flip")) return;
    
    coin.classList.add("flip");
    flipBtn.disabled = true;
    
    setTimeout(() => {
        const isHeads = Math.random() > 0.5;
        coin.textContent = isHeads ? "H" : "T";
        
        // Use consistent theme colors for coin states
        coin.style.background = isHeads ? "var(--accent-color)" : "rgba(163, 113, 247, 0.8)";
        
        if (isHeads) heads++; else tails++;
        total++;
        
        stats.innerHTML = `
            <strong>Heads:</strong> ${heads} (${(heads / total * 100).toFixed(1)}%) <br>
            <strong>Tails:</strong> ${tails} (${(tails / total * 100).toFixed(1)}%) <br>
            <strong>Total Flips:</strong> ${total}
        `;
        
        coin.classList.remove("flip");
        flipBtn.disabled = false;
    }, 600);
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        if (icon) icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });
}

flipBtn.addEventListener("click", flip);
coin.addEventListener("click", flip);
initTheme();
