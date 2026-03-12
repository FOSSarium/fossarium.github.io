// ===== DOM Elements =====
const jwtInput = document.getElementById('jwt-input');
const headerOutput = document.getElementById('header-output').querySelector('code');
const payloadOutput = document.getElementById('payload-output').querySelector('code');
const signatureOutput = document.getElementById('signature-output');
const tokenInfo = document.getElementById('token-info');
const status = document.getElementById('status');
const claimsSection = document.getElementById('claims-section');
const claimsGrid = document.getElementById('claims-grid');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImlzcyI6IkZPU1Nhcml1bSIsImF1ZCI6Imh0dHBzOi8vZm9zc2FyaXVtLmRldiJ9.4Q8ZI3v5VfYkTGnVvq9L1Jz3dX5b1Z3kR8sAi2mN0Uo';

// ===== Registered JWT Claims =====
const CLAIM_LABELS = {
    iss: 'Issuer',
    sub: 'Subject',
    aud: 'Audience',
    exp: 'Expiration',
    nbf: 'Not Before',
    iat: 'Issued At',
    jti: 'JWT ID'
};

// ===== Base64 URL Decode =====
function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);
    return atob(base64);
}

// ===== Decode JWT =====
function decode() {
    const token = jwtInput.value.trim();
    if (!token) {
        headerOutput.textContent = '{}';
        payloadOutput.textContent = '{}';
        signatureOutput.textContent = '—';
        tokenInfo.classList.add('hidden');
        status.classList.add('hidden');
        claimsSection.classList.add('hidden');
        return;
    }

    try {
        const parts = token.split('.');
        if (parts.length < 2 || parts.length > 3) throw new Error('Invalid JWT format — expected 2 or 3 parts');

        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));

        headerOutput.textContent = JSON.stringify(header, null, 2);
        payloadOutput.textContent = JSON.stringify(payload, null, 2);
        signatureOutput.textContent = parts[2] || '(none)';

        // Token info chips
        tokenInfo.classList.remove('hidden');
        document.getElementById('alg-value').textContent = header.alg || '—';
        document.getElementById('type-value').textContent = header.typ || '—';

        // Expiry check
        const chipExp = document.getElementById('chip-exp');
        chipExp.classList.remove('expired', 'valid');
        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            const isExpired = expDate < now;
            document.getElementById('exp-value').textContent = isExpired ? 'Expired' : 'Valid';
            chipExp.classList.add(isExpired ? 'expired' : 'valid');
        } else {
            document.getElementById('exp-value').textContent = 'No expiry';
        }

        // Registered claims
        renderClaims(payload);

        status.classList.add('hidden');
    } catch (e) {
        status.textContent = '✗ ' + e.message;
        status.className = 'status-bar error';
        tokenInfo.classList.add('hidden');
        claimsSection.classList.add('hidden');
    }
}

// ===== Render Registered Claims =====
function renderClaims(payload) {
    const claimKeys = Object.keys(CLAIM_LABELS).filter(k => payload[k] !== undefined);
    if (claimKeys.length === 0) {
        claimsSection.classList.add('hidden');
        return;
    }

    claimsSection.classList.remove('hidden');
    claimsGrid.innerHTML = claimKeys.map(key => {
        let value = payload[key];
        let sub = '';
        if (key === 'exp' || key === 'nbf' || key === 'iat') {
            const date = new Date(value * 1000);
            sub = date.toLocaleString();
            value = value.toString();
        }
        return `
            <div class="claim-card">
                <div class="claim-label">${CLAIM_LABELS[key]}</div>
                <div class="claim-value">${escapeHtml(String(value))}</div>
                ${sub ? `<div class="claim-sub">${sub}</div>` : ''}
            </div>
        `;
    }).join('');
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Toast =====
function showToast(message) {
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

// ===== Event Listeners =====
jwtInput.addEventListener('input', () => {
    decode();
    localStorage.setItem('fossarium-jwt-input', jwtInput.value);
});

document.getElementById('sample-btn').addEventListener('click', () => {
    jwtInput.value = SAMPLE_JWT;
    jwtInput.dispatchEvent(new Event('input'));
});

document.getElementById('copy-btn').addEventListener('click', () => {
    if (!jwtInput.value.trim()) return;
    navigator.clipboard.writeText(jwtInput.value.trim()).then(() => showToast('Token copied!'));
});

document.getElementById('clear-btn').addEventListener('click', () => {
    jwtInput.value = '';
    decode();
    localStorage.removeItem('fossarium-jwt-input');
});

// Section copy buttons
document.querySelectorAll('.copy-section-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.textContent || target.querySelector('code')?.textContent;
        if (!text || text === '{}') return;
        navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
    });
});

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

const savedInput = localStorage.getItem('fossarium-jwt-input');
if (savedInput) {
    jwtInput.value = savedInput;
}
decode();
