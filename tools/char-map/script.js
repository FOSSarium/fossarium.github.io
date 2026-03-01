const ranges={arrows:[8592,8703],math:[8704,8959],currency:[36,36,162,165,8352,8399],box:[9472,9599],emoji:[9728,9983]};const grid=document.getElementById("grid"),cat=document.getElementById("category");function render(){const key=cat.value;let chars=[];const r=ranges[key];if(r.length===2){for(let i=r[0];i<=r[1];i++)chars.push(i);}else{for(let i=0;i<r.length;i+=2){const s=r[i],e=r[i+1]||r[i];for(let j=s;j<=e;j++)chars.push(j);}}grid.innerHTML=chars.slice(0,200).map(c=>`<div class="char-cell" onclick="navigator.clipboard.writeText(String.fromCodePoint(${c}))" title="U+${c.toString(16).toUpperCase().padStart(4,0)}">${String.fromCodePoint(c)}<div class="code">U+${c.toString(16).toUpperCase().padStart(4,"0")}</div></div>`).join("");}cat.addEventListener("change",render);render();


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
