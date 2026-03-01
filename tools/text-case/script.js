const input=document.getElementById("input"),result=document.getElementById("result"),btns=document.getElementById("btns");const cases=[["UPPERCASE",t=>t.toUpperCase()],["lowercase",t=>t.toLowerCase()],["Title Case",t=>t.replace(/\w\S*/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase())],["camelCase",t=>{const w=t.toLowerCase().split(/\s+/);return w[0]+w.slice(1).map(x=>x[0].toUpperCase()+x.slice(1)).join("");}],["snake_case",t=>t.toLowerCase().replace(/\s+/g,"_")],["kebab-case",t=>t.toLowerCase().replace(/\s+/g,"-")],["CONSTANT_CASE",t=>t.toUpperCase().replace(/\s+/g,"_")],["Sentence case",t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()],["aLtErNaTiNg",t=>t.split("").map((c,i)=>i%2?c.toUpperCase():c.toLowerCase()).join("")]];let active=0;cases.forEach(([name],i)=>{const b=document.createElement("button");b.className="case-btn"+(i===0?" active":"");b.textContent=name;b.addEventListener("click",()=>{active=i;btns.querySelectorAll(".case-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");convert();});btns.appendChild(b);});function convert(){result.textContent=cases[active][1](input.value);}input.addEventListener("input",convert);convert();


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
