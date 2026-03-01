const units=["Bytes","KB","MB","GB","TB","PB"];function convert(){const v=parseFloat(document.getElementById("val").value);const u=parseInt(document.getElementById("unit").value);const bytes=v*Math.pow(1024,u);document.getElementById("result").innerHTML=units.map((name,i)=>`<div style="display:flex;justify-content:space-between;padding:4px 0"><span style="color:var(--text-muted)">${name}</span><span style="font-weight:700">${(bytes/Math.pow(1024,i)).toLocaleString(undefined,{maximumFractionDigits:4})}</span></div>`).join("");}document.querySelectorAll("input,select").forEach(e=>e.addEventListener("input",convert));convert();


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
