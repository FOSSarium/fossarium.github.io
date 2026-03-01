document.getElementById('convert-btn').addEventListener('click', () => {
    const csv = document.getElementById('csv-input').value.trim();
    if (!csv) return;
    const lines = csv.split('\n').map(l => l.trim()).filter(l => l);
    const headers = lines[0].split(',').map(h => h.trim());
    const result = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = vals[i] || '');
        return obj;
    });
    document.getElementById('json-output').value = JSON.stringify(result, null, 2);
});
document.getElementById('copy-btn').addEventListener('click', () => {
    const t = document.getElementById('json-output').value;
    if (t) navigator.clipboard.writeText(t);
});
