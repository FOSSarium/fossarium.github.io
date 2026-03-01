const icons=["add","alarm","alert","analytics","apps","archive","arrow-back","arrow-forward","at","attach","barcode","basket","battery-full","bluetooth","book","bookmark","briefcase","brush","bug","build","bulb","bus","cafe","calculator","calendar","call","camera","car","card","cart","chatbox","checkbox","checkmark","clipboard","close","cloud","code","cog","color-fill","compass","construct","copy","create","cube","cut","desktop","diamond","document","download","earth","easel","egg","ellipsis-horizontal","eye","film","filter","finger-print","flag","flash","flask","flower","folder","football","game-controller","gift","globe","grid","hammer","hand-left","happy","headset","heart","help","home","hourglass","ice-cream","image","infinite","information","key","laptop","layers","leaf","library","link","list","location","lock-closed","log-in","log-out","mail","map","medal","megaphone","menu","mic","moon","musical-notes","navigate","newspaper","notifications","nuclear","nutrition","open","options","paper-plane","partly-sunny","pause","pencil","people","person","phone-portrait","pie-chart","pin","planet","play","power","pricetag","print","pulse","push","qr-code","radio","rainy","reader","receipt","recording","refresh","reload","remove","repeat","resize","restaurant","rocket","rose","sad","save","scan","school","search","send","server","settings","shapes","share","shield","shirt","shuffle","skull","snow","speedometer","star","stats-chart","stop","stopwatch","subway","sunny","swap-horizontal","sync","tablet-portrait","tennisball","terminal","text","thermometer","thumbs-up","time","timer","today","toggle","trail-sign","train","trash","trending-up","trophy","tv","umbrella","unlink","videocam","volume-high","walk","wallet","warning","watch","water","wifi"];const grid=document.getElementById("grid"),search=document.getElementById("search");function render(f=""){grid.innerHTML=icons.filter(i=>!f||i.includes(f.toLowerCase())).map(i=>`<div class="icon-card" onclick="navigator.clipboard.writeText('${i}-outline')"><ion-icon name="${i}-outline"></ion-icon><div class="name">${i}</div></div>`).join("");}search.addEventListener("input",()=>render(search.value));render();const s=document.createElement("script");s.type="module";s.src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";document.head.appendChild(s);


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
