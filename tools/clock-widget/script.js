const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
const W = 300, C = W / 2, R = 120;

function getThemeColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function drawClock() {
    ctx.clearRect(0, 0, W, W);
    
    const textColor = getThemeColor('--text-color');
    const accentColor = getThemeColor('--accent-color');
    const borderColor = getThemeColor('--card-border');

    // Outer Circle
    ctx.beginPath();
    ctx.arc(C, C, R, 0, Math.PI * 2);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Ticks
    for (let i = 0; i < 60; i++) {
        const a = i * Math.PI / 30;
        const isHour = i % 5 === 0;
        const tickLen = isHour ? 15 : 8;
        
        const x1 = C + Math.cos(a) * (R - tickLen);
        const y1 = C + Math.sin(a) * (R - tickLen);
        const x2 = C + Math.cos(a) * R;
        const y2 = C + Math.sin(a) * R;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isHour ? textColor : getThemeColor('--text-muted');
        ctx.lineWidth = isHour ? 3 : 1;
        ctx.stroke();
    }

    const now = new Date();
    const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds();

    // Hour Hand
    const ha = (h + m / 60) * Math.PI / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(C, C);
    ctx.lineTo(C + Math.cos(ha) * 60, C + Math.sin(ha) * 60);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.stroke();

    // Minute Hand
    const ma = (m + s / 60) * Math.PI / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(C, C);
    ctx.lineTo(C + Math.cos(ma) * 90, C + Math.sin(ma) * 90);
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();

    // Second Hand
    const sa = s * Math.PI / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(C, C);
    ctx.lineTo(C + Math.cos(sa) * 105, C + Math.sin(sa) * 105);
    ctx.strokeStyle = "#ff4757";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center Dot
    ctx.beginPath();
    ctx.arc(C, C, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ff4757";
    ctx.fill();

    // Digital update
    document.getElementById("digital").textContent = [now.getHours(), now.getMinutes(), now.getSeconds()].map(v => String(v).padStart(2, "0")).join(":");
    document.getElementById("date").textContent = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        if (icon) icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
        drawClock(); // Redraw immediately on theme change
    });
}

setInterval(drawClock, 1000);
initTheme();
drawClock();
