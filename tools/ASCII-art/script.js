// Simple block letter ASCII art font
const FONT = { A: ["  ##  ", "  ##  ", " #  # ", " #  # ", "######", "#    #", "#    #"], B: ["##### ", "#    #", "#    #", "##### ", "#    #", "#    #", "##### "], C: [" #### ", "#    #", "#     ", "#     ", "#     ", "#    #", " #### "], D: ["#### ", "#   #", "#    #", "#    #", "#    #", "#   #", "#### "], E: ["######", "#     ", "#     ", "##### ", "#     ", "#     ", "######"], F: ["######", "#     ", "#     ", "##### ", "#     ", "#     ", "#     "], G: [" #### ", "#    #", "#     ", "#  ###", "#    #", "#    #", " #### "], H: ["#    #", "#    #", "#    #", "######", "#    #", "#    #", "#    #"], I: ["###", " # ", " # ", " # ", " # ", " # ", "###"], J: ["    #", "    #", "    #", "    #", "#   #", "#   #", " ## "], K: ["#   #", "#  # ", "# #  ", "##   ", "# #  ", "#  # ", "#   #"], L: ["#     ", "#     ", "#     ", "#     ", "#     ", "#     ", "######"], M: ["#    #", "##  ##", "# ## #", "# ## #", "#    #", "#    #", "#    #"], N: ["#    #", "##   #", "# #  #", "#  # #", "#   ##", "#    #", "#    #"], O: [" #### ", "#    #", "#    #", "#    #", "#    #", "#    #", " #### "], P: ["##### ", "#    #", "#    #", "##### ", "#     ", "#     ", "#     "], Q: [" #### ", "#    #", "#    #", "#    #", "#  # #", "#   # ", " ### #"], R: ["##### ", "#    #", "#    #", "##### ", "# #   ", "#  #  ", "#   # "], S: [" #### ", "#    #", "#     ", " #### ", "     #", "#    #", " #### "], T: ["######", "  ##  ", "  ##  ", "  ##  ", "  ##  ", "  ##  ", "  ##  "], U: ["#    #", "#    #", "#    #", "#    #", "#    #", "#    #", " #### "], V: ["#    #", "#    #", "#    #", " #  # ", " #  # ", "  ##  ", "  ##  "], W: ["#    #", "#    #", "#    #", "# ## #", "# ## #", "##  ##", "#    #"], X: ["#    #", " #  # ", "  ##  ", "  ##  ", "  ##  ", " #  # ", "#    #"], Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "], Z: ["######", "    # ", "   #  ", "  #   ", " #    ", "#     ", "######"], " ": ["   ", "   ", "   ", "   ", "   ", "   ", "   "] };

const input = document.getElementById('text-input'), output = document.getElementById('output');
function render() {
    const text = input.value.toUpperCase();
    if (!text) { output.textContent = ''; return; }
    const lines = Array(7).fill('');
    for (const ch of text) {
        const glyph = FONT[ch] || FONT[' '];
        for (let i = 0; i < 7; i++) lines[i] += (glyph[i] || '') + '  ';
    }
    output.textContent = lines.join('\n');
}
input.addEventListener('input', render);
document.getElementById('copy-btn').addEventListener('click', () => { if (output.textContent) navigator.clipboard.writeText(output.textContent); });

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
render();
