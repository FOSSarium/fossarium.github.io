const content = document.getElementById("content");
const code = document.getElementById("code");
const copyBtn = document.getElementById("copy-btn");

function update() {
    const m = document.getElementById("m").value;
    const b = document.getElementById("b").value;
    const p = document.getElementById("p").value;
    const w = document.getElementById("w").value;
    const h = document.getElementById("h").value;

    document.querySelector(".margin-box").style.padding = m + "px";
    document.querySelector(".border-box").style.padding = b + "px";
    document.querySelector(".padding-box").style.padding = p + "px";
    
    content.style.width = w + "px";
    content.style.height = h + "px";
    content.textContent = `${w} x ${h}`;

    code.textContent = `margin: ${m}px;\nborder: ${b}px solid;\npadding: ${p}px;\nwidth: ${w}px;\nheight: ${h}px;`;
}

document.querySelectorAll(".controls input").forEach(e => e.addEventListener("input", update));

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(code.textContent);
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
    copyBtn.style.color = 'var(--accent-color)';
    setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.style.color = '';
    }, 2000);
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
update();
