const hist=[];document.getElementById("roll-btn").addEventListener("click",()=>{const sides=parseInt(document.getElementById("type").value),count=parseInt(document.getElementById("count").value);const rolls=[];for(let i=0;i<count;i++)rolls.push(Math.floor(Math.random()*sides)+1);document.getElementById("result").innerHTML=rolls.map(r=>`<div class="die">${r}</div>`).join("");const sum=rolls.reduce((a,b)=>a+b,0);document.getElementById("total").textContent="Total: "+sum;hist.unshift(`${count}d${sides}: [${rolls.join(", ")}] = ${sum}`);document.getElementById("history").textContent=hist.slice(0,10).join(" | ");});


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
