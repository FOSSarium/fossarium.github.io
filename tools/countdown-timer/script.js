let total=0,remaining=0,timer=null,running=false;const display=document.getElementById("display");function fmt(s){const h=Math.floor(s/3600),m=Math.floor(s%3600/60),ss=s%60;return[h,m,ss].map(v=>String(v).padStart(2,"0")).join(":");}document.getElementById("start-btn").addEventListener("click",()=>{if(running){clearInterval(timer);running=false;document.getElementById("start-btn").textContent="Resume";return;}if(remaining<=0){remaining=parseInt(document.getElementById("hrs").value||0)*3600+parseInt(document.getElementById("mins").value||0)*60+parseInt(document.getElementById("secs").value||0);}if(remaining<=0)return;running=true;document.getElementById("start-btn").textContent="Pause";timer=setInterval(()=>{remaining--;display.textContent=fmt(remaining);if(remaining<=0){clearInterval(timer);running=false;display.textContent="00:00:00";document.getElementById("start-btn").textContent="Start";}},1000);display.textContent=fmt(remaining);});document.getElementById("reset-btn").addEventListener("click",()=>{clearInterval(timer);running=false;remaining=0;display.textContent="00:00:00";document.getElementById("start-btn").textContent="Start";});


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
