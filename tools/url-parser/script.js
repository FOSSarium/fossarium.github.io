const urlInput = document.getElementById('url-input');
const partsGrid = document.getElementById('parts-grid');
const paramsSection = document.getElementById('params-section');
const paramsBody = document.getElementById('params-body');
const clearBtn = document.getElementById('clear-btn');

const PARTS = [
    { key: 'protocol', label: 'Protocol' },
    { key: 'hostname', label: 'Hostname' },
    { key: 'port', label: 'Port' },
    { key: 'pathname', label: 'Path' },
    { key: 'search', label: 'Query String' },
    { key: 'hash', label: 'Hash / Fragment' },
    { key: 'origin', label: 'Origin' },
    { key: 'host', label: 'Host (with port)' }
];

function copyText(text, btn) {
    navigator.clipboard.writeText(text);
    const icon = btn.querySelector('ion-icon');
    if (icon) {
        icon.setAttribute('name', 'checkmark-outline');
        btn.style.color = 'var(--success)';
        setTimeout(() => {
            icon.setAttribute('name', 'copy-outline');
            btn.style.color = '';
        }, 1200);
    }
}

function parse() {
    const raw = urlInput.value.trim();
    if (!raw) {
        partsGrid.innerHTML = '';
        paramsSection.classList.add('hidden');
        return;
    }

    let url;
    try {
        url = new URL(raw);
    } catch {
        try {
            url = new URL('https://' + raw);
        } catch {
            partsGrid.innerHTML = '<div class="part-card"><span class="part-name">Error</span><span class="part-value">Invalid URL</span></div>';
            paramsSection.classList.add('hidden');
            return;
        }
    }

    let html = '';
    PARTS.forEach(part => {
        const val = url[part.key] || '';
        html += `
            <div class="part-card">
                <div class="part-card-header">
                    <span class="part-name">${part.label}</span>
                    ${val ? `<button class="part-copy" onclick="copyText('${val.replace(/'/g, "\\'")}', this)" title="Copy"><ion-icon name="copy-outline"></ion-icon></button>` : ''}
                </div>
                <span class="part-value ${val ? '' : 'empty'}">${val || '—'}</span>
            </div>`;
    });
    partsGrid.innerHTML = html;

    // Query params
    const params = url.searchParams;
    if ([...params].length > 0) {
        let tbody = '';
        params.forEach((value, key) => {
            tbody += `
                <tr>
                    <td><code>${key}</code></td>
                    <td><code>${value}</code></td>
                    <td><button class="part-copy" onclick="copyText('${value.replace(/'/g, "\\'")}', this)" title="Copy value"><ion-icon name="copy-outline"></ion-icon></button></td>
                </tr>`;
        });
        paramsBody.innerHTML = tbody;
        paramsSection.classList.remove('hidden');
    } else {
        paramsSection.classList.add('hidden');
    }
}

// Make copyText globally accessible
window.copyText = copyText;

urlInput.addEventListener('input', parse);

clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    parse();
    urlInput.focus();
});

// Theme
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('ion-icon');
    const saved = localStorage.getItem('fossarium-theme');
    if (saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light-theme');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('fossarium-theme', isLight ? 'light' : 'dark');
        if (icon) icon.setAttribute('name', isLight ? 'moon-outline' : 'sunny-outline');
    });
}

initTheme();
parse();
