const toMs={kmh:v=>v/3.6,mph:v=>v*0.44704,ms:v=>v,knots:v=>v*0.514444,fps:v=>v*0.3048};const fromMs={kmh:v=>v*3.6,mph:v=>v/0.44704,ms:v=>v,knots:v=>v/0.514444,fps:v=>v/0.3048};function convert(){const v=parseFloat(document.getElementById("val").value),fr=document.getElementById("from").value,to=document.getElementById("to").value;const ms=toMs[fr](v);document.getElementById("result").textContent=fromMs[to](ms).toFixed(4)+" "+to;}document.querySelectorAll("input,select").forEach(e=>e.addEventListener("input",convert));convert();


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
