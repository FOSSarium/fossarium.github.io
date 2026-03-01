const hex=document.getElementById("hex"),r=document.getElementById("r"),g=document.getElementById("g"),b=document.getElementById("b"),preview=document.getElementById("preview");hex.addEventListener("input",()=>{const v=hex.value.replace("#","");if(v.length===6){r.value=parseInt(v.slice(0,2),16);g.value=parseInt(v.slice(2,4),16);b.value=parseInt(v.slice(4,6),16);preview.style.background=hex.value;}});function rgbToHex(){const rv=parseInt(r.value),gv=parseInt(g.value),bv=parseInt(b.value);hex.value="#"+[rv,gv,bv].map(v=>v.toString(16).padStart(2,"0")).join("");preview.style.background=hex.value;}[r,g,b].forEach(e=>e.addEventListener("input",rgbToHex));


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
