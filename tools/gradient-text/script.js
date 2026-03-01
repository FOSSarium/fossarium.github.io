const text=document.getElementById("text"),c1=document.getElementById("c1"),c2=document.getElementById("c2"),c3=document.getElementById("c3"),preview=document.getElementById("preview"),code=document.getElementById("code");function update(){const g="linear-gradient(90deg, "+c1.value+", "+c2.value+", "+c3.value+")";preview.textContent=text.value;preview.style.background=g;preview.style.webkitBackgroundClip="text";preview.style.webkitTextFillColor="transparent";preview.style.backgroundClip="text";code.textContent="background: "+g+"; -webkit-background-clip: text; -webkit-text-fill-color: transparent;";}[text,c1,c2,c3].forEach(e=>e.addEventListener("input",update));


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
