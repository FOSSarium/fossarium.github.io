const STORAGE_KEY = 'fossarium-todos';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all';
const input = document.getElementById('todo-input'), list = document.getElementById('todo-list'), countEl = document.getElementById('count');

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }

function render() {
    const filtered = todos.filter(t => filter === 'all' || (filter === 'active' && !t.done) || (filter === 'done' && t.done));
    list.innerHTML = filtered.map(t => `
        <div class="todo-item${t.done ? ' done' : ''}" data-id="${t.id}">
            <button class="todo-check" data-action="toggle">${t.done ? '✓' : ''}</button>
            <span class="todo-text">${esc(t.text)}</span>
            <button class="todo-del" data-action="delete"><ion-icon name="close-outline"></ion-icon></button>
        </div>`).join('');
    const active = todos.filter(t => !t.done).length;
    countEl.textContent = `${active} item${active !== 1 ? 's' : ''} left`;
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    todos.unshift({ id: Date.now(), text, done: false });
    input.value = ''; save(); render();
}

list.addEventListener('click', e => {
    const item = e.target.closest('[data-action]');
    if (!item) return;
    const id = parseInt(e.target.closest('.todo-item').dataset.id);
    if (item.dataset.action === 'toggle') {
        const t = todos.find(x => x.id === id);
        if (t) t.done = !t.done;
    } else if (item.dataset.action === 'delete') {
        todos = todos.filter(x => x.id !== id);
    }
    save(); render();
});

document.getElementById('add-btn').addEventListener('click', addTodo);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });

document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); filter = b.dataset.filter; render();
}));

document.getElementById('clear-done').addEventListener('click', () => { todos = todos.filter(t => !t.done); save(); render(); });

render();

(function() {
    const b = document.getElementById('theme-toggle'), icon = b.querySelector('ion-icon');
    const u = t => icon.setAttribute('name', t === 'light' ? 'moon-outline' : 'sunny-outline');
    const sv = localStorage.getItem('fossarium-theme');
    if (sv) u(sv); else if (matchMedia('(prefers-color-scheme:light)').matches) u('light');
    b.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const l = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', l ? 'light' : 'dark'); u(l ? 'light' : 'dark');
    });
})();
