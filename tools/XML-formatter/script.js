document.getElementById('format-btn').addEventListener('click', () => {
    const xml = document.getElementById('input').value;
    if (!xml.trim()) return;
    let formatted = '', indent = '';
    const pad = '    ';
    xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean).forEach(node => {
        if (node.match(/^<\/\w/)) indent = indent.substring(pad.length);
        formatted += indent + node + '\n';
        if (node.match(/^<\w[^>]*[^\/]>$/)) indent += pad;
    });
    document.getElementById('output').value = formatted.trim();
});
document.getElementById('copy-btn').addEventListener('click', () => { const t = document.getElementById('output').value; if (t) navigator.clipboard.writeText(t); });
