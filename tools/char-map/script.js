const ranges = {
    all: [32, 1023],
    latin: [32, 255],
    latin_ext: [256, 591],
    greek: [880, 1023],
    cyrillic: [1024, 1279],
    hebrew: [1488, 1514],
    arabic: [1548, 1791],
    currency: [8352, 8399],
    math: [8704, 8959],
    arrows: [8592, 8703],
    box: [9472, 9599],
    geometric: [9632, 9727],
    misc_sym: [9728, 9983],
    dingbats: [9984, 10175],
    braille: [10240, 10495],
    emojis: [128512, 128591]
};

const grid = document.getElementById("grid");
const cat = document.getElementById("category");
const searchInput = document.getElementById("search");

let currentOffset = 0;
const chunkSize = 300;
let isSearchMode = false;

function render(reset = true) {
    if (reset) {
        grid.innerHTML = "";
        currentOffset = 0;
        isSearchMode = false;
    }

    const key = cat.value;
    const r = ranges[key];
    const chars = [];
    
    const start = r[0] + currentOffset;
    const end = Math.min(r[1], start + chunkSize);

    for (let i = start; i <= end; i++) {
        chars.push(i);
    }

    renderChars(chars);

    currentOffset += chunkSize + 1;

    // Show "Load More" if needed
    const existingButton = document.getElementById("load-more");
    if (existingButton) existingButton.remove();

    if (currentOffset + r[0] <= r[1]) {
        const loadMore = document.createElement("button");
        loadMore.id = "load-more";
        loadMore.className = "load-more-btn";
        loadMore.textContent = "Load More Characters";
        loadMore.onclick = () => render(false);
        grid.appendChild(loadMore);
    }
}

function renderChars(charCodes) {
    const fragment = document.createDocumentFragment();
    charCodes.forEach(c => {
        const cell = document.createElement("div");
        cell.className = "char-cell";
        cell.title = `U+${c.toString(16).toUpperCase().padStart(4, '0')}`;
        
        try {
            const charStr = String.fromCodePoint(c);
            cell.innerHTML = `
                ${charStr}
                <div class="code">U+${c.toString(16).toUpperCase().padStart(4, "0")}</div>
            `;
            cell.onclick = () => copyChar(charStr, cell);
            fragment.appendChild(cell);
        } catch(e) {}
    });
    grid.appendChild(fragment);
}

function handleSearch() {
    const val = searchInput.value.trim().toUpperCase();
    if (!val) {
        render(true);
        return;
    }

    isSearchMode = true;
    grid.innerHTML = "";
    const existingButton = document.getElementById("load-more");
    if (existingButton) existingButton.remove();

    // Support formats: U+0041, 0041, 41
    const hex = val.replace("U+", "");
    const code = parseInt(hex, 16);

    if (!isNaN(code)) {
        renderChars([code]);
    } else {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">Invalid hex code. Use format U+XXXX</div>`;
    }
}

function copyChar(char, el) {
    navigator.clipboard.writeText(char);
    const originalContent = el.innerHTML;
    el.innerHTML = `<ion-icon name="checkmark-outline" style="color: var(--success)"></ion-icon><div class="code">Copied!</div>`;
    el.style.borderColor = 'var(--success)';
    
    setTimeout(() => {
        el.innerHTML = originalContent;
        el.style.borderColor = '';
    }, 1000);
}

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

cat.addEventListener("change", () => {
    searchInput.value = "";
    render(true);
});

searchInput.addEventListener("input", handleSearch);

initTheme();
render();
window.copyChar = copyChar;
