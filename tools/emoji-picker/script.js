const emojiData = [
    { char: "😀", name: "grinning face", cat: "smileys" },
    { char: "😃", name: "grinning face with big eyes", cat: "smileys" },
    { char: "😄", name: "grinning face with smiling eyes", cat: "smileys" },
    { char: "😁", name: "beaming face with smiling eyes", cat: "smileys" },
    { char: "😆", name: "grinning squinting face", cat: "smileys" },
    { char: "😅", name: "grinning face with sweat", cat: "smileys" },
    { char: "🤣", name: "rolling on the floor laughing", cat: "smileys" },
    { char: "😂", name: "face with tears of joy", cat: "smileys" },
    { char: "🙂", name: "slightly smiling face", cat: "smileys" },
    { char: "🙃", name: "upside-down face", cat: "smileys" },
    { char: "😉", name: "winking face", cat: "smileys" },
    { char: "😊", name: "smiling face with smiling eyes", cat: "smileys" },
    { char: "😇", name: "smiling face with halo", cat: "smileys" },
    { char: "🥰", name: "smiling face with hearts", cat: "smileys" },
    { char: "😍", name: "smiling face with heart-eyes", cat: "smileys" },
    { char: "🤩", name: "star-struck", cat: "smileys" },
    { char: "😘", name: "face blowing a kiss", cat: "smileys" },
    { char: "😗", name: "kissing face", cat: "smileys" },
    { char: "😚", name: "kissing face with closed eyes", cat: "smileys" },
    { char: "😋", name: "face savoring food", cat: "smileys" },
    { char: "😛", name: "face with tongue", cat: "smileys" },
    { char: "😜", name: "winking face with tongue", cat: "smileys" },
    { char: "🤪", name: "zany face", cat: "smileys" },
    { char: "😝", name: "squinting face with tongue", cat: "smileys" },
    { char: "🤑", name: "money-mouth face", cat: "smileys" },
    { char: "🤗", name: "hugging face", cat: "smileys" },
    { char: "🤭", name: "face with hand over mouth", cat: "smileys" },
    { char: "🤫", name: "shushing face", cat: "smileys" },
    { char: "🤔", name: "thinking face", cat: "smileys" },
    { char: "🤐", name: "zipper-mouth face", cat: "smileys" },
    { char: "🤨", name: "face with raised eyebrow", cat: "smileys" },
    { char: "😐", name: "neutral face", cat: "smileys" },
    { char: "😑", name: "expressionless face", cat: "smileys" },
    { char: "😶", name: "face without mouth", cat: "smileys" },
    { char: "😏", name: "smirking face", cat: "smileys" },
    { char: "😒", name: "unamused face", cat: "smileys" },
    { char: "🙄", name: "face with rolling eyes", cat: "smileys" },
    { char: "😬", name: "grimacing face", cat: "smileys" },
    { char: "🤥", name: "lying face", cat: "smileys" },
    { char: "😌", name: "relieved face", cat: "smileys" },
    { char: "😔", name: "pensive face", cat: "smileys" },
    { char: "😪", name: "sleepy face", cat: "smileys" },
    { char: "🤤", name: "drooling face", cat: "smileys" },
    { char: "😴", name: "sleeping face", cat: "smileys" },
    { char: "😷", name: "face with medical mask", cat: "smileys" },
    { char: "🤒", name: "face with thermometer", cat: "smileys" },
    { char: "🤕", name: "face with head-bandage", cat: "smileys" },
    { char: "🤢", name: "nauseated face", cat: "smileys" },
    { char: "🤮", name: "face vomiting", cat: "smileys" },
    { char: "🤧", name: "sneezing face", cat: "smileys" },
    { char: "🥵", name: "hot face", cat: "smileys" },
    { char: "🥶", name: "cold face", cat: "smileys" },
    { char: "🥴", name: "woozy face", cat: "smileys" },
    { char: "😵", name: "knocked-out face", cat: "smileys" },
    { char: "🤯", name: "exploding head", cat: "smileys" },
    { char: "🤠", name: "cowboy hat face", cat: "smileys" },
    { char: "🥳", name: "partying face", cat: "smileys" },
    { char: "😎", name: "smiling face with sunglasses", cat: "smileys" },
    { char: "🤓", name: "nerd face", cat: "smileys" },
    { char: "🧐", name: "face with monocle", cat: "smileys" },
    { char: "😕", name: "slightly frowning face", cat: "smileys" },
    { char: "😟", name: "worried face", cat: "smileys" },
    { char: "🙁", name: "frowning face", cat: "smileys" },
    { char: "😮", name: "face with open mouth", cat: "smileys" },
    { char: "😯", name: "hushed face", cat: "smileys" },
    { char: "😲", name: "astonished face", cat: "smileys" },
    { char: "😳", name: "flushed face", cat: "smileys" },
    { char: "🥺", name: "pleading face", cat: "smileys" },
    { char: "😦", name: "frowning face with open mouth", cat: "smileys" },
    { char: "😧", name: "anguished face", cat: "smileys" },
    { char: "😨", name: "fearful face", cat: "smileys" },
    { char: "😰", name: "face with sweat", cat: "smileys" },
    { char: "😥", name: "sad but relieved face", cat: "smileys" },
    { char: "😢", name: "crying face", cat: "smileys" },
    { char: "😭", name: "loudly crying face", cat: "smileys" },
    { char: "😱", name: "face screaming in fear", cat: "smileys" },
    { char: "😖", name: "confounded face", cat: "smileys" },
    { char: "😣", name: "persevering face", cat: "smileys" },
    { char: "😞", name: "disappointed face", cat: "smileys" },
    { char: "😓", name: "downcast face with sweat", cat: "smileys" },
    { char: "😩", name: "weary face", cat: "smileys" },
    { char: "😫", name: "tired face", cat: "smileys" },
    { char: "🥱", name: "yawning face", cat: "smileys" },
    { char: "😤", name: "face with steam from nose", cat: "smileys" },
    { char: "😡", name: "pouting face", cat: "smileys" },
    { char: "😠", name: "angry face", cat: "smileys" },
    { char: "🤬", name: "face with symbols on mouth", cat: "smileys" },
    { char: "😈", name: "smiling face with horns", cat: "smileys" },
    { char: "👿", name: "angry face with horns", cat: "smileys" },
    { char: "💀", name: "skull", cat: "smileys" },
    { char: "☠️", name: "skull and crossbones", cat: "smileys" },
    { char: "💩", name: "pile of poo", cat: "smileys" },
    { char: "🤡", name: "clown face", cat: "smileys" },
    { char: "👹", name: "ogre", cat: "smileys" },
    { char: "👺", name: "goblin", cat: "smileys" },
    { char: "👻", name: "ghost", cat: "smileys" },
    { char: "👽", name: "alien", cat: "smileys" },
    { char: "👾", name: "alien monster", cat: "smileys" },
    { char: "🤖", name: "robot", cat: "smileys" },
    { char: "😺", name: "grinning cat", cat: "smileys" },
    { char: "😸", name: "grinning cat with smiling eyes", cat: "smileys" },
    { char: "😻", name: "smiling cat with heart-eyes", cat: "smileys" },
    { char: "😼", name: "cat with wry smile", cat: "smileys" },
    { char: "😽", name: "kissing cat", cat: "smileys" },
    { char: "🙀", name: "weary cat", cat: "smileys" },
    { char: "😿", name: "crying cat", cat: "smileys" },
    { char: "😾", name: "pouting cat", cat: "smileys" },
    { char: "🙈", name: "see-no-evil monkey", cat: "smileys" },
    { char: "🙉", name: "hear-no-evil monkey", cat: "smileys" },
    { char: "🙊", name: "speak-no-evil monkey", cat: "smileys" },
    { char: "💋", name: "kiss mark", cat: "smileys" },
    { char: "💌", name: "love letter", cat: "smileys" },
    { char: "💘", name: "heart with arrow", cat: "smileys" },
    { char: "💝", name: "heart with ribbon", cat: "smileys" },
    { char: "💖", name: "sparkling heart", cat: "smileys" },
    { char: "💗", name: "growing heart", cat: "smileys" },
    { char: "💓", name: "beating heart", cat: "smileys" },
    { char: "💞", name: "revolving hearts", cat: "smileys" },
    { char: "💕", name: "two hearts", cat: "smileys" },
    { char: "💟", name: "heart decoration", cat: "smileys" },
    { char: "❣️", name: "heart exclamation", cat: "smileys" },
    { char: "💔", name: "broken heart", cat: "smileys" },
    { char: "❤️", name: "red heart", cat: "smileys" },
    { char: "🧡", name: "orange heart", cat: "smileys" },
    { char: "💛", name: "yellow heart", cat: "smileys" },
    { char: "💚", name: "green heart", cat: "smileys" },
    { char: "💙", name: "blue heart", cat: "smileys" },
    { char: "💜", name: "purple heart", cat: "smileys" },
    { char: "🤎", name: "brown heart", cat: "smileys" },
    { char: "🖤", name: "black heart", cat: "smileys" },
    { char: "🤍", name: "white heart", cat: "smileys" },
    { char: "💯", name: "hundred points", cat: "symbols" },
    { char: "💢", name: "anger symbol", cat: "symbols" },
    { char: "💥", name: "collision", cat: "symbols" },
    { char: "💫", name: "dizzy", cat: "symbols" },
    { char: "💦", name: "sweat droplets", cat: "symbols" },
    { char: "💨", name: "dashing away", cat: "symbols" },
    { char: "🕳️", name: "hole", cat: "objects" },
    { char: "💣", name: "bomb", cat: "objects" },
    { char: "💬", name: "speech balloon", cat: "symbols" },
    { char: "👁️‍🗨️", name: "eye in speech bubble", cat: "symbols" },
    { char: "🗨️", name: "left speech bubble", cat: "symbols" },
    { char: "🗯️", name: "right anger bubble", cat: "symbols" },
    { char: "💭", name: "thought balloon", cat: "symbols" },
    { char: "💤", name: "zzz", cat: "symbols" },
    { char: "👋", name: "waving hand", cat: "smileys" },
    { char: "🤚", name: "raised back of hand", cat: "smileys" },
    { char: "🖐️", name: "hand with fingers splayed", cat: "smileys" },
    { char: "✋", name: "raised hand", cat: "smileys" },
    { char: "🖖", name: "vulcan salute", cat: "smileys" },
    { char: "👌", name: "ok hand", cat: "smileys" },
    { char: "🤏", name: "pinching hand", cat: "smileys" },
    { char: "✌️", name: "victory hand", cat: "smileys" },
    { char: "🤞", name: "crossed fingers", cat: "smileys" },
    { char: "🤟", name: "love-you gesture", cat: "smileys" },
    { char: "🤘", name: "sign of the horns", cat: "smileys" },
    { char: "🤙", name: "call me hand", cat: "smileys" },
    { char: "👈", name: "backhand index pointing left", cat: "smileys" },
    { char: "👉", name: "backhand index pointing right", cat: "smileys" },
    { char: "👆", name: "backhand index pointing up", cat: "smileys" },
    { char: "👇", name: "backhand index pointing down", cat: "smileys" },
    { char: "☝️", name: "index pointing up", cat: "smileys" },
    { char: "👍", name: "thumbs up", cat: "smileys" },
    { char: "👎", name: "thumbs down", cat: "smileys" },
    { char: "✊", name: "raised fist", cat: "smileys" },
    { char: "👊", name: "oncoming fist", cat: "smileys" },
    { char: "🤛", name: "left-facing fist", cat: "smileys" },
    { char: "🤜", name: "right-facing fist", cat: "smileys" },
    { char: "👏", name: "clapping hands", cat: "smileys" },
    { char: "🙌", name: "raising hands", cat: "smileys" },
    { char: "👐", name: "open hands", cat: "smileys" },
    { char: "🤲", name: "palms up together", cat: "smileys" },
    { char: "🤝", name: "handshake", cat: "smileys" },
    { char: "🙏", name: "folded hands", cat: "smileys" },
    { char: "✍️", name: "writing hand", cat: "smileys" },
    { char: "💅", name: "nail polish", cat: "smileys" },
    { char: "🤳", name: "selfie", cat: "smileys" },
    { char: "💪", name: "flexed biceps", cat: "smileys" },
    { char: "🦾", name: "mechanical arm", cat: "smileys" },
    { char: "🦿", name: "mechanical leg", cat: "smileys" },
    { char: "🦵", name: "leg", cat: "smileys" },
    { char: "🦶", name: "foot", cat: "smileys" },
    { char: "👂", name: "ear", cat: "smileys" },
    { char: "🦻", name: "ear with hearing aid", cat: "smileys" },
    { char: "👃", name: "nose", cat: "smileys" },
    { char: "🧠", name: "brain", cat: "smileys" },
    { char: "🦷", name: "tooth", cat: "smileys" },
    { char: "🦴", name: "bone", cat: "smileys" },
    { char: "👀", name: "eyes", cat: "smileys" },
    { char: "👁️", name: "eye", cat: "smileys" },
    { char: "👅", name: "tongue", cat: "smileys" },
    { char: "👄", name: "mouth", cat: "smileys" },
    { char: "🐶", name: "dog face", cat: "animals" },
    { char: "🐱", name: "cat face", cat: "animals" },
    { char: "🐭", name: "mouse face", cat: "animals" },
    { char: "🐹", name: "hamster face", cat: "animals" },
    { char: "🐰", name: "rabbit face", cat: "animals" },
    { char: "🦊", name: "fox", cat: "animals" },
    { char: "🐻", name: "bear", cat: "animals" },
    { char: "🐼", name: "panda", cat: "animals" },
    { char: "🐨", name: "koala", cat: "animals" },
    { char: "🐯", name: "tiger face", cat: "animals" },
    { char: "🦁", name: "lion", cat: "animals" },
    { char: "🐮", name: "cow face", cat: "animals" },
    { char: "🐷", name: "pig face", cat: "animals" },
    { char: "🐸", name: "frog", cat: "animals" },
    { char: "🐵", name: "monkey face", cat: "animals" },
    { char: "🍕", name: "pizza", cat: "food" },
    { char: "🍔", name: "hamburger", cat: "food" },
    { char: "🍟", name: "french fries", cat: "food" },
    { char: "🌭", name: "hot dog", cat: "food" },
    { char: "🍿", name: "popcorn", cat: "food" },
    { char: "🍩", name: "doughnut", cat: "food" },
    { char: "🍪", name: "cookie", cat: "food" },
    { char: "🍰", name: "shortcake", cat: "food" },
    { char: "🧁", name: "cupcake", cat: "food" },
    { char: "🍦", name: "soft serve", cat: "food" },
    { char: "🍨", name: "ice cream", cat: "food" },
    { char: "🍧", name: "shaved ice", cat: "food" },
    { char: "🍫", name: "chocolate bar", cat: "food" },
    { char: "🍬", name: "candy", cat: "food" },
    { char: "🍭", name: "lollipop", cat: "food" },
    { char: "🍮", name: "custard", cat: "food" },
    { char: "🍯", name: "honey pot", cat: "food" },
    { char: "⚽", name: "soccer ball", cat: "activities" },
    { char: "🏀", name: "basketball", cat: "activities" },
    { char: "🏈", name: "american football", cat: "activities" },
    { char: "⚾", name: "baseball", cat: "activities" },
    { char: "🥎", name: "softball", cat: "activities" },
    { char: "🎾", name: "tennis", cat: "activities" },
    { char: "🏐", name: "volleyball", cat: "activities" },
    { char: "🏉", name: "rugby football", cat: "activities" },
    { char: "🎱", name: "pool 8 ball", cat: "activities" },
    { char: "🏓", name: "ping pong", cat: "activities" },
    { char: "🏸", name: "badminton", cat: "activities" },
    { char: "🥅", name: "goal net", cat: "activities" },
    { char: "🏒", name: "ice hockey", cat: "activities" },
    { char: "🏑", name: "field hockey", cat: "activities" },
    { char: "🏏", name: "cricket game", cat: "activities" },
    { char: "🎯", name: "direct hit", cat: "activities" },
    { char: "🎮", name: "video game", cat: "activities" },
    { char: "🕹️", name: "joystick", cat: "activities" },
    { char: "🎰", name: "slot machine", cat: "activities" },
    { char: "🎲", name: "die", cat: "activities" },
    { char: "🧩", name: "puzzle piece", cat: "activities" },
    { char: "🧸", name: "teddy bear", cat: "activities" },
    { char: "♠️", name: "spade suit", cat: "activities" },
    { char: "♥️", name: "heart suit", cat: "activities" },
    { char: "♦️", name: "diamond suit", cat: "activities" },
    { char: "♣️", name: "club suit", cat: "activities" },
    { char: "♟️", name: "chess pawn", cat: "activities" },
    { char: "🃏", name: "joker", cat: "activities" },
    { char: "🀄", name: "mahjong red dragon", cat: "activities" },
    { char: "🎴", name: "flower playing cards", cat: "activities" },
    { char: "🎭", name: "performing arts", cat: "activities" },
    { char: "🎨", name: "artist palette", cat: "activities" },
    { char: "🧵", name: "thread", cat: "activities" },
    { char: "🧶", name: "yarn", cat: "activities" },
    { char: "💡", name: "light bulb", cat: "objects" },
    { char: "🔦", name: "flashlight", cat: "objects" },
    { char: "🏮", name: "red paper lantern", cat: "objects" },
    { char: "🧱", name: "brick", cat: "objects" },
    { char: "🧭", name: "compass", cat: "objects" },
    { char: "⚖️", name: "balance scale", cat: "objects" },
    { char: "🔋", name: "battery", cat: "objects" },
    { char: "🔌", name: "electric plug", cat: "objects" },
    { char: "💻", name: "laptop", cat: "objects" },
    { char: "🖥️", name: "desktop computer", cat: "objects" },
    { char: "🖨️", name: "printer", cat: "objects" },
    { char: "⌨️", name: "keyboard", cat: "objects" },
    { char: "🖱️", name: "computer mouse", cat: "objects" },
    { char: "trackball", name: "trackball", cat: "objects" },
    { char: "💽", name: "computer disk", cat: "objects" },
    { char: "💾", name: "floppy disk", cat: "objects" },
    { char: "💿", name: "optical disk", cat: "objects" },
    { char: "📀", name: "dvd", cat: "objects" },
    { char: "🧮", name: "abacus", cat: "objects" }
];

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const categoryTabs = document.getElementById("category-tabs");
const badge = document.getElementById("copied-badge");

let currentCategory = "all";

function render() {
    const query = search.value.toLowerCase().trim();
    grid.innerHTML = "";
    
    const filtered = emojiData.filter(e => {
        const matchesQuery = e.name.includes(query) || e.char.includes(query);
        const matchesCat = currentCategory === "all" || e.cat === currentCategory;
        return matchesQuery && matchesCat;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No emojis found matching "${query}"</div>`;
        return;
    }

    filtered.forEach(e => {
        const btn = document.createElement("button");
        btn.className = "emoji-btn";
        btn.title = e.name;
        btn.textContent = e.char;
        btn.addEventListener("click", () => copyEmoji(e.char));
        grid.appendChild(btn);
    });
}

function copyEmoji(char) {
    navigator.clipboard.writeText(char);
    
    // Show badge
    badge.classList.add("show");
    setTimeout(() => badge.classList.remove("show"), 2000);
}

search.addEventListener("input", render);

categoryTabs.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
        document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        currentCategory = e.target.dataset.category;
        render();
    }
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
