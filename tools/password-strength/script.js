const input = document.getElementById('pw-input'), fill = document.getElementById('strength-fill'), label = document.getElementById('strength-label'), details = document.getElementById('details');
input.addEventListener('input', () => {
    const pw = input.value;
    if (!pw) { fill.style.width = '0'; label.textContent = 'Type a password above'; label.style.color = 'var(--text-muted)'; details.innerHTML = ''; return; }
    let score = 0, checks = [];
    if (pw.length >= 8) { score += 20; checks.push('✓ At least 8 characters'); } else checks.push('✗ Less than 8 characters');
    if (pw.length >= 12) score += 10;
    if (/[a-z]/.test(pw)) { score += 15; checks.push('✓ Lowercase letter'); } else checks.push('✗ No lowercase');
    if (/[A-Z]/.test(pw)) { score += 15; checks.push('✓ Uppercase letter'); } else checks.push('✗ No uppercase');
    if (/[0-9]/.test(pw)) { score += 15; checks.push('✓ Number'); } else checks.push('✗ No number');
    if (/[^a-zA-Z0-9]/.test(pw)) { score += 20; checks.push('✓ Special character'); } else checks.push('✗ No special character');
    if (pw.length >= 16) score += 5;
    score = Math.min(score, 100);
    fill.style.width = score + '%';
    let txt, color;
    if (score < 30) { txt = 'Very Weak'; color = '#ff4757'; fill.style.background = color; }
    else if (score < 50) { txt = 'Weak'; color = '#f7b733'; fill.style.background = color; }
    else if (score < 70) { txt = 'Fair'; color = '#ffa502'; fill.style.background = color; }
    else if (score < 90) { txt = 'Strong'; color = '#2ed573'; fill.style.background = color; }
    else { txt = 'Very Strong'; color = '#00b894'; fill.style.background = color; }
    label.textContent = txt + ' (' + score + '/100)'; label.style.color = color;
    details.innerHTML = checks.join('<br>');
});


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
