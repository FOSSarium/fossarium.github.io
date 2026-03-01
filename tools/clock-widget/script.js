const canvas=document.getElementById("clock"),ctx=canvas.getContext("2d"),W=300,C=W/2,R=130;function drawClock(){ctx.clearRect(0,0,W,W);ctx.beginPath();ctx.arc(C,C,R,0,Math.PI*2);ctx.strokeStyle="var(--card-border,#333)";ctx.lineWidth=3;ctx.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;const x1=C+Math.cos(a)*(R-15),y1=C+Math.sin(a)*(R-15);const x2=C+Math.cos(a)*(R-5),y2=C+Math.sin(a)*(R-5);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle="var(--text-color,#fff)";ctx.lineWidth=i%3===0?3:1;ctx.stroke();}const now=new Date();const h=now.getHours()%12,m=now.getMinutes(),s=now.getSeconds();const ha=(h+m/60)*Math.PI/6-Math.PI/2;ctx.beginPath();ctx.moveTo(C,C);ctx.lineTo(C+Math.cos(ha)*70,C+Math.sin(ha)*70);ctx.strokeStyle="var(--text-color,#fff)";ctx.lineWidth=4;ctx.lineCap="round";ctx.stroke();const ma=(m+s/60)*Math.PI/30-Math.PI/2;ctx.beginPath();ctx.moveTo(C,C);ctx.lineTo(C+Math.cos(ma)*100,C+Math.sin(ma)*100);ctx.strokeStyle="var(--text-color,#fff)";ctx.lineWidth=2;ctx.stroke();const sa=s*Math.PI/30-Math.PI/2;ctx.beginPath();ctx.moveTo(C,C);ctx.lineTo(C+Math.cos(sa)*110,C+Math.sin(sa)*110);ctx.strokeStyle="#ff4757";ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(C,C,4,0,Math.PI*2);ctx.fillStyle="#ff4757";ctx.fill();document.getElementById("digital").textContent=[now.getHours(),now.getMinutes(),now.getSeconds()].map(v=>String(v).padStart(2,"0")).join(":");document.getElementById("date").textContent=now.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});}setInterval(drawClock,1000);drawClock();


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
