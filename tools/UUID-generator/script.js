function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.getElementById('generate-btn').addEventListener('click', () => {
    const count = parseInt(document.getElementById('count').value) || 5;
    const uuids = Array.from({ length: Math.min(count, 100) }, () => generateUUID());
    document.getElementById('output').value = uuids.join('\n');
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const text = document.getElementById('output').value;
    if (!text) return;
    navigator.clipboard.writeText(text);
});

// Generate on load
document.getElementById('generate-btn').click();
