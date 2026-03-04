const canvas = document.getElementById("wheel"),
    ctx = canvas.getContext("2d"),
    W = 320,
    R = 150;

let currentColors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#a55eea", "#ff6348", "#eccc68", "#ff6b81", "#7bed9f", "#70a1ff"];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function draw(opts, angle) {
    ctx.clearRect(0, 0, W, W);
    const n = opts.length,
        arc = Math.PI * 2 / n;
    
    // Set resolution
    const ratio = window.devicePixelRatio || 1;
    canvas.width = W * ratio;
    canvas.height = W * ratio;
    canvas.style.width = W + "px";
    canvas.style.height = W + "px";
    ctx.scale(ratio, ratio);

    opts.forEach((o, i) => {
        ctx.beginPath();
        ctx.moveTo(W / 2, W / 2);
        ctx.arc(W / 2, W / 2, R, angle + i * arc, angle + (i + 1) * arc);
        ctx.fillStyle = currentColors[i % currentColors.length];
        ctx.fill();
        
        ctx.save();
        ctx.translate(W / 2, W / 2);
        ctx.rotate(angle + i * arc + arc / 2);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Inter";
        ctx.textAlign = "right";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.fillText(o.slice(0, 15), R - 20, 5);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(W/2, W/2, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.stroke();
}

let spinning = false;
const spinBtn = document.getElementById("spin-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result");
const optionsInput = document.getElementById("options");

function getOptions() {
    return optionsInput.value.trim().split("\n").filter(Boolean);
}

spinBtn.addEventListener("click", () => {
    if (spinning) return;
    const opts = getOptions();
    if (opts.length < 2) {
        alert("Please enter at least 2 options.");
        return;
    }
    
    spinning = true;
    spinBtn.disabled = true;
    resultBox.style.display = "none";
    
    let angle = Math.random() * Math.PI * 2,
        speed = 0.8 + Math.random() * 0.4;
    
    function animate() {
        angle += speed;
        speed *= 0.975;
        draw(opts, angle);
        if (speed > 0.005) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            spinBtn.disabled = false;
            
            // Pointer is at the top (1.5 * PI)
            const sliceSize = Math.PI * 2 / opts.length;
            const normalizedAngle = ((1.5 * Math.PI - angle) % (Math.PI * 2) + (Math.PI * 2)) % (Math.PI * 2);
            const idx = Math.floor(normalizedAngle / sliceSize);
            
            resultText.textContent = opts[idx % opts.length];
            resultBox.style.display = "block";
            resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    animate();
});

shuffleBtn.addEventListener("click", () => {
    shuffleArray(currentColors);
    draw(getOptions(), 0);
});

optionsInput.addEventListener("input", () => {
    draw(getOptions(), 0);
});

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
    });
}

initTheme();
draw(getOptions(), 0);
