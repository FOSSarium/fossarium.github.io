const canvas=document.getElementById("wheel"),ctx=canvas.getContext("2d"),W=300,R=140;const colors=["#ff4757","#ffa502","#2ed573","#1e90ff","#a55eea","#ff6348","#eccc68","#ff6b81","#7bed9f","#70a1ff"];function draw(opts,angle){ctx.clearRect(0,0,W,W);const n=opts.length,arc=Math.PI*2/n;opts.forEach((o,i)=>{ctx.beginPath();ctx.moveTo(W/2,W/2);ctx.arc(W/2,W/2,R,angle+i*arc,angle+(i+1)*arc);ctx.fillStyle=colors[i%colors.length];ctx.fill();ctx.save();ctx.translate(W/2,W/2);ctx.rotate(angle+i*arc+arc/2);ctx.fillStyle="#fff";ctx.font="bold 12px Inter";ctx.fillText(o.slice(0,12),30,4);ctx.restore();});ctx.beginPath();ctx.moveTo(W/2-10,10);ctx.lineTo(W/2+10,10);ctx.lineTo(W/2,30);ctx.fillStyle="#fff";ctx.fill();}let spinning=false;document.getElementById("spin-btn").addEventListener("click",()=>{if(spinning)return;const opts=document.getElementById("options").value.trim().split("\n").filter(Boolean);if(opts.length<2)return;spinning=true;let angle=0,speed=0.3+Math.random()*0.2;const target=Math.random()*Math.PI*2;function animate(){angle+=speed;speed*=0.985;draw(opts,angle);if(speed>0.001){requestAnimationFrame(animate);}else{spinning=false;const idx=Math.floor((((-angle%(Math.PI*2))+(Math.PI*2))%(Math.PI*2))/(Math.PI*2/opts.length));document.getElementById("result").textContent="🎉 "+opts[idx%opts.length];}}animate();});const opts=document.getElementById("options").value.trim().split("\n").filter(Boolean);draw(opts,0);


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
