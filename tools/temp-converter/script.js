const c=document.getElementById("c"),f=document.getElementById("f"),k=document.getElementById("k");c.addEventListener("input",()=>{const v=parseFloat(c.value);f.value=(v*9/5+32).toFixed(2);k.value=(v+273.15).toFixed(2);});f.addEventListener("input",()=>{const v=parseFloat(f.value);c.value=((v-32)*5/9).toFixed(2);k.value=((v-32)*5/9+273.15).toFixed(2);});k.addEventListener("input",()=>{const v=parseFloat(k.value);c.value=(v-273.15).toFixed(2);f.value=((v-273.15)*9/5+32).toFixed(2);});


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
