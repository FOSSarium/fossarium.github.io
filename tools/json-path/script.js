function findPaths(obj,prefix=""){const paths=[];if(typeof obj==="object"&&obj!==null){Object.keys(obj).forEach(k=>{const p=prefix?prefix+"."+k:k;paths.push({path:p,value:obj[k]});paths.push(...findPaths(obj[k],p));});}return paths;}function update(){try{const obj=JSON.parse(document.getElementById("input").value);const search=document.getElementById("search").value.toLowerCase();const paths=findPaths(obj);const filtered=search?paths.filter(p=>String(p.value).toLowerCase().includes(search)||p.path.toLowerCase().includes(search)):paths;document.getElementById("result").innerHTML=filtered.slice(0,50).map(p=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--card-border)"><span style="color:var(--accent-color);font-size:.85rem">${p.path}</span><span style="color:var(--text-muted);font-size:.85rem">${typeof p.value==="object"?JSON.stringify(p.value):p.value}</span></div>`).join("");}catch(e){document.getElementById("result").textContent="Invalid JSON";}}document.getElementById("input").addEventListener("input",update);document.getElementById("search").addEventListener("input",update);update();


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
