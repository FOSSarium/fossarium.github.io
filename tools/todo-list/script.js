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
