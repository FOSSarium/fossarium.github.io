let habits=JSON.parse(localStorage.getItem("fossarium-habits")||"[]");const today=new Date().toISOString().slice(0,10);function save(){localStorage.setItem("fossarium-habits",JSON.stringify(habits));render();}function addHabit(){const name=document.getElementById("habit-input").value.trim();if(!name)return;habits.push({name,days:{}});document.getElementById("habit-input").value="";save();}function render(){const el=document.getElementById("habits");const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10));}el.innerHTML=habits.map((h,hi)=>{const streak=days.filter(d=>h.days[d]).length;return`<div class="habit-card"><div class="habit-top"><span class="habit-name">${h.name}</span><span class="habit-streak">🔥 ${streak}/7</span></div><div class="habit-days">${days.map(d=>`<div class="day-dot ${h.days[d]?"done":""}" onclick="toggle(${hi},'${d}')">${new Date(d).toLocaleDateString("en",{weekday:"narrow"})}</div>`).join("")}</div><div class="del-btn" onclick="habits.splice(${hi},1);save();">Remove</div></div>`;}).join("");}function toggle(hi,d){habits[hi].days[d]=!habits[hi].days[d];save();}render();


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
