const wordPool = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "pack", "my",
    "box", "with", "five", "dozen", "liquor", "jugs", "how", "vexingly", "daft", "zebras",
    "jump", "sphinx", "black", "quartz", "judge", "vow", "two", "driven", "jocks", "help",
    "fax", "big", "quiz", "bright", "warm", "summer", "day", "brings", "joy", "when",
    "walking", "through", "colorful", "garden", "paths", "lined", "with", "flowers", "trees",
    "birds", "sing", "sweet", "songs", "while", "clouds", "drift", "across", "blue", "sky",
    "morning", "light", "fills", "room", "gentle", "breeze", "flows", "open", "window",
    "fresh", "coffee", "steams", "ceramic", "mug", "sitting", "wooden", "table", "beside",
    "stack", "books", "waiting", "read", "today", "perfect", "start", "new", "adventure",
    "explore", "world", "around", "you", "discover", "hidden", "treasures", "every", "corner",
    "life", "full", "amazing", "moments", "capture", "them", "heart", "mind", "soul",
    "create", "something", "beautiful", "share", "others", "inspire", "change", "make",
    "difference", "small", "acts", "kindness", "ripple", "outward", "touching", "lives",
    "beyond", "imagination", "never", "stop", "learning", "growing", "reaching", "stars",
    "dream", "believe", "achieve", "greatness", "within", "reach", "just", "take", "first",
    "step", "forward", "embrace", "journey", "ahead", "trust", "process", "enjoy", "ride",
    "powerful", "keyboard", "typing", "practice", "speed", "accuracy", "improve", "daily",
    "code", "design", "build", "launch", "deploy", "server", "database", "network", "system",
    "program", "function", "variable", "string", "number", "array", "object", "class", "method"
];

const sampleEl = document.getElementById('sample');
const inputEl = document.getElementById('input');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timeEl = document.getElementById('time-display');
const charsEl = document.getElementById('chars-typed');

const modalOverlay = document.getElementById('modal-overlay');
const modalOk = document.getElementById('modal-ok');

let text = '';
let timer = null;
let timeLeft = 30;
let duration = 30;
let started = false;
let correctCount = 0;

function generateText() {
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    text = shuffled.slice(0, 80).join(' ');
    sampleEl.textContent = text;
}

function resetUI() {
    wpmEl.textContent = '0';
    accuracyEl.textContent = '100';
    timeEl.textContent = duration;
    charsEl.textContent = '0';
    timeLeft = duration;
    correctCount = 0;
}

function startTest() {
    generateText();
    inputEl.value = '';
    inputEl.disabled = false;
    inputEl.focus();
    resetUI();
    started = true;
    startBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
    sampleEl.classList.add('active');

    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    clearInterval(timer);
    timer = null;
    inputEl.disabled = true;
    started = false;
    sampleEl.classList.remove('active');

    const typed = inputEl.value;
    const words = typed.trim().split(/\s+/).filter(w => w).length;
    const elapsed = duration - timeLeft || duration;
    const wpm = Math.round(words / (elapsed / 60));

    let correct = 0;
    for (let i = 0; i < typed.length && i < text.length; i++) {
        if (typed[i] === text[i]) correct++;
    }
    const acc = typed.length ? Math.round(correct / typed.length * 100) : 100;

    document.getElementById('result-wpm').textContent = wpm;
    document.getElementById('result-accuracy').textContent = acc + '%';
    document.getElementById('result-chars').textContent = typed.length;
    document.getElementById('result-correct').textContent = correct;

    modalOverlay.style.display = 'flex';
    setTimeout(() => modalOverlay.classList.remove('hidden'), 10);
}

function hideModal() {
    modalOverlay.classList.add('hidden');
    setTimeout(() => { modalOverlay.style.display = 'none'; }, 300);
}

startBtn.addEventListener('click', startTest);
restartBtn.addEventListener('click', () => {
    if (timer) clearInterval(timer);
    startTest();
});
modalOk.addEventListener('click', () => {
    hideModal();
    startTest();
});

inputEl.addEventListener('input', () => {
    if (!started) return;
    const typed = inputEl.value;
    let html = '';
    let correct = 0;

    for (let i = 0; i < text.length; i++) {
        if (i < typed.length) {
            if (typed[i] === text[i]) {
                html += `<span class="correct">${text[i]}</span>`;
                correct++;
            } else {
                html += `<span class="wrong">${text[i]}</span>`;
            }
        } else if (i === typed.length) {
            html += `<span class="current">${text[i]}</span>`;
        } else {
            html += text[i];
        }
    }
    sampleEl.innerHTML = html;

    charsEl.textContent = typed.length;
    const elapsed = duration - timeLeft || 1;
    const words = typed.trim().split(/\s+/).filter(w => w).length;
    wpmEl.textContent = Math.round(words / (elapsed / 60));
    accuracyEl.textContent = typed.length ? Math.round(correct / typed.length * 100) : 100;
});

// Duration pills
document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
        if (started) return;
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        duration = parseInt(pill.dataset.time);
        timeLeft = duration;
        timeEl.textContent = duration;
    });
});

// Theme
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const saved = localStorage.getItem('fossarium-theme');
    if (saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches)) {
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
generateText();
