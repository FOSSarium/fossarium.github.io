function update(){const m=document.getElementById("m").value,b=document.getElementById("b").value,p=document.getElementById("p").value,w=document.getElementById("w").value,h=document.getElementById("h").value;document.querySelector(".margin-box").style.padding=m+"px";document.querySelector(".border-box").style.padding=b+"px";document.querySelector(".padding-box").style.padding=p+"px";document.getElementById("content").style.width=w+"px";document.getElementById("content").style.height=h+"px";document.getElementById("code").textContent=`margin: ${m}px;\nborder: ${b}px solid;\npadding: ${p}px;\nwidth: ${w}px;\nheight: ${h}px;`;}document.querySelectorAll(".controls input").forEach(e=>e.addEventListener("input",update));


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
