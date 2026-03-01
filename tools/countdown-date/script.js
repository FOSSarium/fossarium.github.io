const target=document.getElementById("target"),result=document.getElementById("result");const d=new Date();d.setMonth(d.getMonth()+1);target.value=d.toISOString().slice(0,16);function update(){const t=new Date(target.value)-new Date();if(t<=0){result.textContent="🎉 Date has passed!";return;}const days=Math.floor(t/86400000),hrs=Math.floor(t%86400000/3600000),mins=Math.floor(t%3600000/60000),secs=Math.floor(t%60000/1000);result.textContent=days+"d "+hrs+"h "+mins+"m "+secs+"s";}target.addEventListener("input",update);setInterval(update,1000);update();


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
