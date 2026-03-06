let habits = JSON.parse(localStorage.getItem("fossarium-habits") || "[]");

function save() {
    localStorage.setItem("fossarium-habits", JSON.stringify(habits));
    render();
}

function addHabit() {
    const input = document.getElementById("habit-input");
    const name = input.value.trim();
    if (!name) return;
    habits.push({ name, days: {} });
    input.value = "";
    save();
}

function toggleDay(hi, d) {
    habits[hi].days[d] = !habits[hi].days[d];
    save();
}

function deleteHabit(hi) {
    if (confirm("Delete this habit?")) {
        habits.splice(hi, 1);
        save();
    }
}

function render() {
    const el = document.getElementById("habits-list");
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }

    el.innerHTML = habits.map((h, hi) => {
        const streak = last7Days.filter(d => h.days[d]).length;
        return `
            <div class="habit-card">
                <div class="habit-top">
                    <span class="habit-name">${h.name}</span>
                    <span class="habit-streak">🔥 ${streak}/7</span>
                </div>
                <div class="habit-days">
                    ${last7Days.map(d => {
                        const dateObj = new Date(d);
                        const label = dateObj.toLocaleDateString("en-US", { weekday: "narrow" });
                        const isDone = h.days[d];
                        return `<div class="day-dot ${isDone ? "done" : ""}" onclick="toggleDay(${hi}, '${d}')">${label}</div>`;
                    }).join("")}
                </div>
                <button class="del-btn" onclick="deleteHabit(${hi})">Remove Habit</button>
            </div>
        `;
    }).join("");
}

document.getElementById('add-habit-btn').addEventListener('click', addHabit);
document.getElementById('habit-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

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
render();
window.toggleDay = toggleDay;
window.deleteHabit = deleteHabit;
