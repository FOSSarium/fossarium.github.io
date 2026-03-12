const textInput = document.getElementById('text-input');
const wordsEl = document.getElementById('words');
const charsEl = document.getElementById('chars');
const sentencesEl = document.getElementById('sentences');
const paragraphsEl = document.getElementById('paragraphs');
const readingTimeEl = document.getElementById('reading-time');
const readingLevelEl = document.getElementById('reading-level');
const clearBtn = document.getElementById('clear-btn');
const densitySection = document.getElementById('density-section');
const densityBars = document.getElementById('density-bars');

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','it','as','was','are','be','this','that','have','has','had','not','no','do','does','did','will','would','can','could','may','might','shall','should','i','you','he','she','we','they','me','him','her','us','them','my','your','his','its','our','their','if','so','than','then','too','very','just','about','up','out','into','over','after','also']);

function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    let count = 0;
    const vowels = 'aeiouy';
    let prevVowel = false;
    for (const ch of word) {
        const isVowel = vowels.includes(ch);
        if (isVowel && !prevVowel) count++;
        prevVowel = isVowel;
    }
    if (word.endsWith('e') && count > 1) count--;
    return Math.max(count, 1);
}

function analyze() {
    const text = textInput.value;

    // Characters
    const charCount = text.length;
    charsEl.textContent = charCount;

    // Words
    const wordArray = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = text.trim() ? wordArray.length : 0;
    wordsEl.textContent = wordCount;

    // Sentences
    const sentenceCount = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || (wordCount > 0 ? 1 : 0) : 0;
    sentencesEl.textContent = sentenceCount;

    // Paragraphs
    const paraCount = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    paragraphsEl.textContent = paraCount;

    // Reading time (avg 200 wpm)
    const readMin = Math.ceil(wordCount / 200);
    readingTimeEl.textContent = readMin;

    // Reading level (Flesch-Kincaid Grade)
    if (wordCount > 0 && sentenceCount > 0) {
        let totalSyllables = 0;
        wordArray.forEach(w => totalSyllables += countSyllables(w));
        const grade = 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59;
        const clamped = Math.max(1, Math.min(Math.round(grade), 16));
        readingLevelEl.textContent = clamped;
    } else {
        readingLevelEl.textContent = '—';
    }

    // Keyword density
    if (wordCount >= 5) {
        const freq = {};
        wordArray.forEach(w => {
            const lw = w.toLowerCase().replace(/[^a-z0-9'-]/g, '');
            if (lw && lw.length > 1 && !STOP_WORDS.has(lw)) {
                freq[lw] = (freq[lw] || 0) + 1;
            }
        });

        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
        if (sorted.length > 0) {
            const max = sorted[0][1];
            densityBars.innerHTML = sorted.map(([word, count]) => `
                <div class="density-item">
                    <span class="density-word">${word}</span>
                    <div class="density-bar-bg">
                        <div class="density-bar-fill" style="width: ${(count / max * 100).toFixed(1)}%"></div>
                    </div>
                    <span class="density-count">${count}×</span>
                </div>
            `).join('');
            densitySection.classList.remove('hidden');
        } else {
            densitySection.classList.add('hidden');
        }
    } else {
        densitySection.classList.add('hidden');
    }
}

textInput.addEventListener('input', analyze);

clearBtn.addEventListener('click', () => {
    textInput.value = '';
    analyze();
    textInput.focus();
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
analyze();
