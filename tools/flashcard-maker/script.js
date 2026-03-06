let cards = JSON.parse(localStorage.getItem("fossarium-flashcards") || "[]");
let currentIndex = 0;
let isFlipped = false;

const mainView = document.getElementById('main-view');
const studyView = document.getElementById('study-view');
const cardList = document.getElementById('card-list');
const deckCount = document.getElementById('deck-count');
const studyCard = document.getElementById('study-card');
const studyCardFront = document.getElementById('study-card-front');
const studyCardBack = document.getElementById('study-card-back');
const counter = document.getElementById('counter');

function save() {
    localStorage.setItem("fossarium-flashcards", JSON.stringify(cards));
    renderList();
}

function addCard() {
    const front = document.getElementById("front").value.trim();
    const back = document.getElementById("back").value.trim();
    if (!front || !back) return;
    cards.push({ front, back });
    document.getElementById("front").value = "";
    document.getElementById("back").value = "";
    save();
}

function deleteCard(index) {
    cards.splice(index, 1);
    save();
}

function renderList() {
    deckCount.textContent = cards.length;
    cardList.innerHTML = cards.map((c, i) => `
        <div class="card-item">
            <span>${c.front.substring(0, 30)}${c.front.length > 30 ? '...' : ''}</span>
            <div class="del" onclick="deleteCard(${i})"><ion-icon name="trash-outline"></ion-icon></div>
        </div>
    `).join("");
}

function startStudy() {
    if (cards.length === 0) return;
    currentIndex = 0;
    isFlipped = false;
    studyCard.classList.remove('flipped');
    mainView.classList.add('hidden');
    studyView.classList.remove('hidden');
    updateStudyCard();
}

function endStudy() {
    studyView.classList.add('hidden');
    mainView.classList.remove('hidden');
}

function updateStudyCard() {
    studyCardFront.textContent = cards[currentIndex].front;
    studyCardBack.textContent = cards[currentIndex].back;
    counter.textContent = `${currentIndex + 1} / ${cards.length}`;
}

function next() {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        isFlipped = false;
        studyCard.classList.remove('flipped');
        setTimeout(updateStudyCard, 150);
    }
}

function prev() {
    if (currentIndex > 0) {
        currentIndex--;
        isFlipped = false;
        studyCard.classList.remove('flipped');
        setTimeout(updateStudyCard, 150);
    }
}

studyCard.addEventListener('click', () => {
    isFlipped = !isFlipped;
    studyCard.classList.toggle('flipped', isFlipped);
});

document.getElementById('start-study').addEventListener('click', startStudy);

// Theme Logic
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
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
renderList();
window.deleteCard = deleteCard;
window.addCard = addCard;
window.next = next;
window.prev = prev;
window.endStudy = endStudy;
