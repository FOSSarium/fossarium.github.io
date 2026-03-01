const input = document.getElementById('task-input'), list = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('fossarium-todos') || '[]');
function save() { localStorage.setItem('fossarium-todos', JSON.stringify(tasks)); }
function render() {
    list.innerHTML = '';
    tasks.forEach((t, i) => {
        const li = document.createElement('li');
        if (t.done) li.classList.add('done');
        li.innerHTML = `<input type="checkbox" ${t.done ? 'checked' : ''}><span>${t.text}</span><button>✕</button>`;
        li.querySelector('input').addEventListener('change', () => { tasks[i].done = !tasks[i].done; save(); render(); });
        li.querySelector('button').addEventListener('click', () => { tasks.splice(i, 1); save(); render(); });
        list.appendChild(li);
    });
}
function addTask() { const text = input.value.trim(); if (!text) return; tasks.push({ text, done: false }); input.value = ''; save(); render(); }
document.getElementById('add-btn').addEventListener('click', addTask);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
render();


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
