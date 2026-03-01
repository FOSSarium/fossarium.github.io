const fonts=["Inter","Roboto","Open Sans","Lato","Montserrat","Poppins","Playfair Display","Oswald","Raleway","Merriweather","Source Code Pro","JetBrains Mono","Fira Sans","Nunito","Ubuntu"];const text=document.getElementById("text"),size=document.getElementById("size"),list=document.getElementById("list");const link=document.createElement("link");link.rel="stylesheet";link.href="https://fonts.googleapis.com/css2?family="+fonts.map(f=>f.replace(/ /g,"+")).join("&family=")+"&display=swap";document.head.appendChild(link);function render(){const s=size.value;document.getElementById("sizeVal").textContent=s+"px";list.innerHTML=fonts.map(f=>`<div class="font-item" onclick="navigator.clipboard.writeText('font-family: ${f}')"><div class="font-name">${f}</div><div class="font-sample" style="font-family:'${f}';font-size:${s}px">${text.value}</div></div>`).join("");}text.addEventListener("input",render);size.addEventListener("input",render);render();


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
