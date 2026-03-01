let heads=0,tails=0,total=0;const coin=document.getElementById("coin"),stats=document.getElementById("stats");function flip(){coin.classList.add("flip");setTimeout(()=>{const r=Math.random()>.5;coin.textContent=r?"H":"T";coin.style.background=r?"var(--gradient-1)":"var(--gradient-7)";if(r)heads++;else tails++;total++;stats.textContent=`Heads: ${heads} (${(heads/total*100).toFixed(1)}%) | Tails: ${tails} (${(tails/total*100).toFixed(1)}%) | Total: ${total}`;coin.classList.remove("flip");},500);}document.getElementById("flip-btn").addEventListener("click",flip);coin.addEventListener("click",flip);


function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('ion-icon');

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');

        if (isLight) {
            localStorage.setItem('fossarium-theme', 'light');
            if (icon) icon.setAttribute('name', 'moon-outline');
        } else {
            localStorage.setItem('fossarium-theme', 'dark');
            if (icon) icon.setAttribute('name', 'sunny-outline');
        }
    });
}

initTheme();
