let year=new Date().getFullYear(),month=new Date().getMonth();const title=document.getElementById("month-title"),grid=document.getElementById("cal-grid");const months=["January","February","March","April","May","June","July","August","September","October","November","December"];function render(){title.textContent=months[month]+" "+year;const first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate(),prevDays=new Date(year,month,0).getDate();const today=new Date();let html=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>`<div class="cal-cell hdr">${d}</div>`).join("");for(let i=0;i<first;i++)html+=`<div class="cal-cell day other">${prevDays-first+1+i}</div>`;for(let d=1;d<=days;d++){const isToday=d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();html+=`<div class="cal-cell day ${isToday?"today":""}">${d}</div>`;}const rem=42-(first+days);for(let i=1;i<=rem;i++)html+=`<div class="cal-cell day other">${i}</div>`;grid.innerHTML=html;}document.getElementById("prev-btn").addEventListener("click",()=>{month--;if(month<0){month=11;year--;}render();});document.getElementById("next-btn").addEventListener("click",()=>{month++;if(month>11){month=0;year++;}render();});render();


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
