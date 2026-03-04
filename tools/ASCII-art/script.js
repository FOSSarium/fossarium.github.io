const FONTS = {
    block: {
        height: 7,
        A: ["  ###  ", " #   # ", " #   # ", " ##### ", " #   # ", " #   # ", " #   # "],
        B: [" ####  ", " #   # ", " #   # ", " ####  ", " #   # ", " #   # ", " ####  "],
        C: ["  #### ", " #     ", " #     ", " #     ", " #     ", " #     ", "  #### "],
        D: [" ####  ", " #   # ", " #   # ", " #   # ", " #   # ", " #   # ", " ####  "],
        E: [" ##### ", " #     ", " #     ", " ####  ", " #     ", " #     ", " ##### "],
        F: [" ##### ", " #     ", " #     ", " ####  ", " #     ", " #     ", " #     "],
        G: ["  #### ", " #     ", " #     ", " #  ###", " #   # ", " #   # ", "  #### "],
        H: [" #   # ", " #   # ", " #   # ", " ##### ", " #   # ", " #   # ", " #   # "],
        I: [" ##### ", "   #   ", "   #   ", "   #   ", "   #   ", "   #   ", " ##### "],
        J: [" ##### ", "     # ", "     # ", "     # ", " #   # ", " #   # ", "  ###  "],
        K: [" #   # ", " #  #  ", " # #   ", " ##    ", " # #   ", " #  #  ", " #   # "],
        L: [" #     ", " #     ", " #     ", " #     ", " #     ", " #     ", " ##### "],
        M: [" #   # ", " ## ## ", " # # # ", " #   # ", " #   # ", " #   # ", " #   # "],
        N: [" #   # ", " ##  # ", " # # # ", " #  ## ", " #   # ", " #   # ", " #   # "],
        O: ["  ###  ", " #   # ", " #   # ", " #   # ", " #   # ", " #   # ", "  ###  "],
        P: [" ####  ", " #   # ", " #   # ", " ####  ", " #     ", " #     ", " #     "],
        Q: ["  ###  ", " #   # ", " #   # ", " #   # ", " # # # ", " #  #  ", "  ## # "],
        R: [" ####  ", " #   # ", " #   # ", " ####  ", " # #   ", " #  #  ", " #   # "],
        S: ["  #### ", " #     ", " #     ", "  ###  ", "     # ", "     # ", " ####  "],
        T: [" ##### ", "   #   ", "   #   ", "   #   ", "   #   ", "   #   ", "   #   "],
        U: [" #   # ", " #   # ", " #   # ", " #   # ", " #   # ", " #   # ", "  ###  "],
        V: [" #   # ", " #   # ", " #   # ", " #   # ", " #   # ", "  # #  ", "   #   "],
        W: [" #   # ", " #   # ", " #   # ", " # # # ", " # # # ", " ## ## ", " #   # "],
        X: [" #   # ", "  # #  ", "   #   ", "   #   ", "   #   ", "  # #  ", " #   # "],
        Y: [" #   # ", "  # #  ", "   #   ", "   #   ", "   #   ", "   #   ", "   #   "],
        Z: [" ##### ", "     # ", "    #  ", "   #   ", "  #    ", " #     ", " ##### "],
        "0": ["  ###  ", " #   # ", " #  ## ", " # # # ", " ##  # ", " #   # ", "  ###  "],
        "1": ["   #   ", "  ##   ", "   #   ", "   #   ", "   #   ", "   #   ", " ##### "],
        "2": ["  ###  ", " #   # ", "     # ", "   ##  ", "  #    ", " #     ", " ##### "],
        "3": [" ##### ", "     # ", "    #  ", "  ###  ", "     # ", "     # ", " ##### "],
        "4": [" #   # ", " #   # ", " #   # ", " ##### ", "     # ", "     # ", "     # "],
        "5": [" ##### ", " #     ", " ####  ", "     # ", "     # ", " #   # ", "  ###  "],
        "6": ["  #### ", " #     ", " ####  ", " #   # ", " #   # ", " #   # ", "  ###  "],
        "7": [" ##### ", "     # ", "    #  ", "   #   ", "  #    ", " #     ", " #     "],
        "8": ["  ###  ", " #   # ", " #   # ", "  ###  ", " #   # ", " #   # ", "  ###  "],
        "9": ["  ###  ", " #   # ", " #   # ", "  #### ", "     # ", "     # ", "  ###  "],
        " ": ["       ", "       ", "       ", "       ", "       ", "       ", "       "]
    },
    thin: {
        height: 5,
        A: [" /\\ ", "|--|", "|  |"],
        B: ["|-- ", "|--|", "|-- "],
        C: [" -- ", "|   ", " -- "],
        D: ["|-- ", "|  |", "|-- "],
        E: ["|-- ", "|-- ", "|-- "],
        F: ["|-- ", "|-- ", "|   "],
        G: [" -- ", "| -|", " -- "],
        H: ["|  |", "|--|", "|  |"],
        I: ["---", " | ", "---"],
        J: [" --", "  |", " --"],
        K: ["| /", "|- ", "| \\"],
        L: ["|  ", "|  ", "|--"],
        M: ["|\\/|", "|  |", "|  |"],
        N: ["|\\ |", "| \\|", "|  |"],
        O: [" -- ", "|  |", " -- "],
        P: ["|--|", "|-- ", "|   "],
        Q: [" -- ", "|  |", " --\\"],
        R: ["|--|", "|-  ", "| \\ "],
        S: [" -- ", " -  ", " -- "],
        T: ["---", " | ", " | "],
        U: ["|  |", "|  |", " -- "],
        V: ["|  |", " \\/ ", "    "],
        W: ["|  |", "|\\/|", "    "],
        X: ["\\  /", " \\/ ", "/  \\"],
        Y: ["\\ /", " | ", " | "],
        Z: ["---", " / ", "---"],
        "0": [" - ", "| |", " - "],
        "1": ["  |", "  |", "  |"],
        "2": [" - ", "  |", " - "],
        "3": [" - ", " -|", " - "],
        "4": ["| |", " -|", "  |"],
        "5": [" - ", "|- ", " - "],
        "6": [" - ", "|- ", " - "],
        "7": [" - ", "  |", "  |"],
        "8": [" - ", " - ", " - "],
        "9": [" - ", " -|", " - "],
        " ": ["    ", "    ", "    "]
    }
};

FONTS.rounded = JSON.parse(JSON.stringify(FONTS.block));
FONTS.digital = JSON.parse(JSON.stringify(FONTS.thin));

const input = document.getElementById('text-input'),
    fontSelect = document.getElementById('font-select'),
    output = document.getElementById('output'),
    charBtns = document.querySelectorAll('.char-btn'),
    copyBtn = document.getElementById('copy-btn');

let currentChar = '#';

function render() {
    const text = input.value; // Remove toUpperCase to see if it fixes number mapping
    const fontName = fontSelect.value;
    const font = FONTS[fontName] || FONTS.block;
    
    if (!text) {
        output.textContent = '';
        return;
    }

    const height = font.height || font.A.length;
    const lines = Array(height).fill('');

    for (let ch of text) {
        ch = ch.toUpperCase(); // Normalize for lookup
        const glyph = font[ch] || font[' '];
        for (let i = 0; i < height; i++) {
            let line = glyph[i] || "";
            if (fontName === 'block' || fontName === 'rounded') {
                line = line.replace(/#/g, currentChar);
            }
            lines[i] += line + ' ';
        }
    }
    output.textContent = lines.join('\n');
}

input.addEventListener('input', render);
fontSelect.addEventListener('change', render);

charBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        charBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChar = btn.dataset.char;
        render();
    });
});

copyBtn.addEventListener('click', () => {
    if (!output.textContent) return;
    navigator.clipboard.writeText(output.textContent);
    
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> Copied!';
    copyBtn.style.background = 'var(--success)';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
    }, 1500);
});

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const savedTheme = localStorage.getItem('fossarium-theme');
    
    const setDarkMode = () => {
        document.documentElement.classList.remove('light-theme');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    };
    const setLightMode = () => {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    };

    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        setLightMode();
    } else {
        setDarkMode();
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light-theme')) {
            setDarkMode();
            localStorage.setItem('fossarium-theme', 'dark');
        } else {
            setLightMode();
            localStorage.setItem('fossarium-theme', 'light');
        }
    });
}

initTheme();
render();
