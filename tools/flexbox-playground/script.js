const props=["dir","jc","ai","wrap"];const cssProp={dir:"flex-direction",jc:"justify-content",ai:"align-items",wrap:"flex-wrap"};function update(){const c=document.getElementById("container");c.style.flexDirection=document.getElementById("dir").value;c.style.justifyContent=document.getElementById("jc").value;c.style.alignItems=document.getElementById("ai").value;c.style.flexWrap=document.getElementById("wrap").value;document.getElementById("code").textContent=props.map(p=>`${cssProp[p]}: ${document.getElementById(p).value};`).join("\n");}props.forEach(p=>document.getElementById(p).addEventListener("input",update));update();


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
