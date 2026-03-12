// ===== Default Data =====
const DEFAULT_DATA = {
    todo: [
        { id: 1, text: 'Plan project roadmap', label: 'blue' },
        { id: 2, text: 'Research FOSS tools', label: 'purple' },
        { id: 3, text: 'Write documentation', label: 'blue' }
    ],
    doing: [
        { id: 4, text: 'Build Kanban UI', label: 'orange' },
        { id: 5, text: 'Implement drag & drop', label: 'orange' }
    ],
    done: [
        { id: 6, text: 'Setup repository', label: 'green' },
        { id: 7, text: 'Configure CI/CD', label: 'green' }
    ]
};

const COLUMNS = [
    { key: 'todo', title: 'To Do', cssClass: 'col-todo' },
    { key: 'doing', title: 'In Progress', cssClass: 'col-doing' },
    { key: 'done', title: 'Done', cssClass: 'col-done' }
];

const LABELS = ['blue', 'orange', 'green', 'purple', 'red'];

let data = loadData();
let nextId = getMaxId() + 1;
let draggedCard = null;
let draggedCol = null;

// ===== Persistence =====
function loadData() {
    try {
        const saved = localStorage.getItem('fossarium-kanban');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migrate old format (arrays of strings) to new format (arrays of objects)
            const result = {};
            COLUMNS.forEach(col => {
                const items = parsed[col.key] || [];
                result[col.key] = items.map((item, i) => {
                    if (typeof item === 'string') {
                        return { id: Date.now() + i, text: item, label: 'blue' };
                    }
                    return item;
                });
            });
            return result;
        }
    } catch { }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData() {
    localStorage.setItem('fossarium-kanban', JSON.stringify(data));
}

function getMaxId() {
    let max = 0;
    COLUMNS.forEach(col => {
        (data[col.key] || []).forEach(item => {
            if (item.id > max) max = item.id;
        });
    });
    return max;
}

// ===== Render =====
function render() {
    const board = document.getElementById('board');
    board.innerHTML = COLUMNS.map(col => {
        const tasks = data[col.key] || [];
        return `
            <div class="column ${col.cssClass}" data-col="${col.key}">
                <div class="column-header">
                    <div class="column-title">
                        <div class="column-dot"></div>
                        ${col.title}
                    </div>
                    <span class="task-count">${tasks.length}</span>
                </div>
                <div class="cards" data-col="${col.key}">
                    ${tasks.map(task => renderCard(task, col.key)).join('')}
                </div>
                <div class="add-task-wrapper">
                    <input type="text" class="add-task-input" data-col="${col.key}" placeholder="Add a task..." />
                    <button class="add-task-btn" data-col="${col.key}" title="Add task">
                        <ion-icon name="add-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    bindEvents();
}

function renderCard(task, colKey) {
    return `
        <div class="task-card" draggable="true" data-id="${task.id}" data-col="${colKey}">
            <div class="task-label label-${task.label || 'blue'}"></div>
            <div class="task-content">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="task-action-btn edit-btn" data-id="${task.id}" data-col="${colKey}" title="Edit">
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button class="task-action-btn delete delete-btn" data-id="${task.id}" data-col="${colKey}" title="Delete">
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== Event Binding =====
function bindEvents() {
    // Drag & Drop
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    document.querySelectorAll('.cards').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    // Columns also accept drops
    document.querySelectorAll('.column').forEach(col => {
        col.addEventListener('dragover', handleDragOver);
        col.addEventListener('dragleave', handleDragLeave);
        col.addEventListener('drop', handleDrop);
    });

    // Add task
    document.querySelectorAll('.add-task-input').forEach(input => {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && input.value.trim()) {
                addTask(input.dataset.col, input.value.trim());
                input.value = '';
            }
        });
    });

    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const col = btn.dataset.col;
            const input = document.querySelector(`.add-task-input[data-col="${col}"]`);
            if (input.value.trim()) {
                addTask(col, input.value.trim());
                input.value = '';
            }
        });
    });

    // Delete task
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            deleteTask(btn.dataset.col, parseInt(btn.dataset.id));
        });
    });

    // Edit task
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            editTask(btn.dataset.col, parseInt(btn.dataset.id));
        });
    });
}

// ===== Drag & Drop Handlers =====
function handleDragStart(e) {
    draggedCard = e.target.closest('.task-card');
    draggedCol = draggedCard.dataset.col;
    draggedCard.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedCard.dataset.id);
}

function handleDragEnd() {
    if (draggedCard) draggedCard.classList.remove('dragging');
    document.querySelectorAll('.column').forEach(col => col.classList.remove('drag-over'));
    draggedCard = null;
    draggedCol = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const column = e.target.closest('.column');
    if (column) column.classList.add('drag-over');
}

function handleDragLeave(e) {
    const column = e.target.closest('.column');
    if (column && !column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    if (!column || !draggedCard) return;

    column.classList.remove('drag-over');
    const targetCol = column.dataset.col;
    const taskId = parseInt(draggedCard.dataset.id);

    if (draggedCol === targetCol) return;

    // Move task
    const taskIndex = data[draggedCol].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = data[draggedCol].splice(taskIndex, 1);
    data[targetCol].push(task);

    saveData();
    render();
    showToast('Task moved!');
}

// ===== CRUD Operations =====
function addTask(colKey, text) {
    const labelIndex = COLUMNS.findIndex(c => c.key === colKey);
    const label = LABELS[labelIndex] || 'blue';
    data[colKey].push({ id: nextId++, text, label });
    saveData();
    render();
}

function deleteTask(colKey, taskId) {
    data[colKey] = data[colKey].filter(t => t.id !== taskId);
    saveData();
    render();
}

function editTask(colKey, taskId) {
    const task = data[colKey].find(t => t.id === taskId);
    if (!task) return;

    const card = document.querySelector(`.task-card[data-id="${taskId}"]`);
    const textEl = card.querySelector('.task-text');
    const currentText = task.text;

    // Replace text with inline input
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'add-task-input';
    input.style.cssText = 'padding: 4px 8px; font-size: 0.9rem; margin: 0;';
    textEl.replaceWith(input);
    input.focus();
    input.select();

    const save = () => {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            task.text = newText;
            saveData();
        }
        render();
    };

    input.addEventListener('blur', save);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') save();
        if (e.key === 'Escape') render();
    });
}

// ===== Clear All =====
document.getElementById('clear-all-btn').addEventListener('click', () => {
    if (confirm('Clear all tasks from all columns?')) {
        data = { todo: [], doing: [], done: [] };
        saveData();
        render();
        showToast('Board cleared!');
    }
});

// ===== Toast =====
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}

// ===== Theme Toggle =====
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const icon = themeToggleBtn.querySelector('ion-icon');

    function updateIcon(theme) {
        icon.setAttribute('name', theme === 'light' ? 'moon-outline' : 'sunny-outline');
    }

    const savedTheme = localStorage.getItem('fossarium-theme');
    if (savedTheme) updateIcon(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) updateIcon('light');

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('fossarium-theme', newTheme);
        updateIcon(newTheme);
    });
}

// ===== Init =====
initTheme();
render();
