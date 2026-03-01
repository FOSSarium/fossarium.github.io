const input=document.getElementById("input"),canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d");function genBarcode(text){canvas.width=text.length*11+40;canvas.height=80;ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#000";let x=10;ctx.fillRect(x,5,2,60);x+=3;ctx.fillRect(x,5,1,60);x+=2;ctx.fillRect(x,5,2,60);x+=5;for(let i=0;i<text.length;i++){const code=text.charCodeAt(i);const bits=code.toString(2).padStart(8,"0");for(let b=0;b<8;b++){if(bits[b]==="1")ctx.fillRect(x,5,1,60);x++;}ctx.fillRect(x,5,1,60);x+=2;}ctx.fillRect(x,5,2,60);x+=3;ctx.fillRect(x,5,1,60);x+=2;ctx.fillRect(x,5,2,60);ctx.fillStyle="#000";ctx.font="12px JetBrains Mono";ctx.textAlign="center";ctx.fillText(text,canvas.width/2,75);}input.addEventListener("input",()=>genBarcode(input.value));genBarcode(input.value);


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
