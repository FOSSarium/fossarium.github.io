function gen(){const w=parseInt(document.getElementById("w").value),h=parseInt(document.getElementById("h").value),bg=document.getElementById("bg").value,fg=document.getElementById("fg").value;const c=document.getElementById("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);ctx.fillStyle=fg;ctx.font="bold "+Math.min(w/8,48)+"px Inter";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(w+"×"+h,w/2,h/2);const img=document.createElement("img");img.src=c.toDataURL();img.style.maxWidth="100%";img.style.borderRadius="10px";img.style.border="1px solid var(--card-border)";document.getElementById("preview").innerHTML="";document.getElementById("preview").appendChild(img);}


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
