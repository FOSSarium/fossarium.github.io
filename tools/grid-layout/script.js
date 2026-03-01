function update(){const cols=parseInt(document.getElementById("cols").value),rows=parseInt(document.getElementById("rows").value),gap=parseInt(document.getElementById("gap").value);const c=document.getElementById("container");c.style.gridTemplateColumns=`repeat(${cols}, 1fr)`;c.style.gridTemplateRows=`repeat(${rows}, 1fr)`;c.style.gap=gap+"px";c.innerHTML="";for(let i=0;i<cols*rows;i++){const d=document.createElement("div");d.className="grid-cell";d.textContent=i+1;c.appendChild(d);}document.getElementById("code").textContent=`display: grid;\ngrid-template-columns: repeat(${cols}, 1fr);\ngrid-template-rows: repeat(${rows}, 1fr);\ngap: ${gap}px;`;}document.querySelectorAll("input").forEach(e=>e.addEventListener("input",update));update();


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
