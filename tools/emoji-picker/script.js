const emojis=["😀","😂","🤣","😊","😍","🥰","😎","🤔","😴","🤯","😱","🥳","🫡","🤗","😈","👻","💀","🤖","👽","🎃","❤️","🧡","💛","💚","💙","💜","🖤","🤍","💯","🔥","⭐","✨","🌈","🌞","🌙","⚡","🎉","🎊","🎵","🎶","🏆","⚽","🏀","🎯","🎮","🕹️","🧩","♟️","🎨","🖌️","📝","📌","📎","✂️","🔑","��","🔓","💡","🔔","📢","🚀","✈️","🚗","🚲","⛵","🏠","🏢","🌍","🌎","🌏","🍕","🍔","🍟","🍩","🍪","☕","🍺","🍷","🥤","🍿","👍","👎","👏","🤝","✌️","🤞","👋","🖐️","✋","💪","🧠","👀","👁️","👂","👃","👄","🦷","🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐸","🦁","🐯","🐮","🐷","🐵","🐔","🐧","🐦","🦅","🦆","🦉","🐴","🦄","🐝","🐛","🦋","🐢","🐍","🦎","🐙","🦀","🐠","🐳","🐬","🌸","🌺","🌻","🌹","🌷","🌵","🎄","🎋","🍀","🍁","🍂","🍃","🌾"];const grid=document.getElementById("grid"),search=document.getElementById("search");function render(filter=""){grid.innerHTML=emojis.filter(e=>!filter||e.includes(filter)).map(e=>`<button class="emoji-btn" title="Click to copy">${e}</button>`).join("");}grid.addEventListener("click",e=>{if(e.target.classList.contains("emoji-btn")){navigator.clipboard.writeText(e.target.textContent);e.target.style.transform="scale(1.5)";setTimeout(()=>e.target.style.transform="",200);}});search.addEventListener("input",()=>render(search.value));render();


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
