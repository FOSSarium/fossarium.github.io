document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const itemCards = document.querySelectorAll('.item-card');

    if (!searchInput) return;

    // Focus search on 'Ctrl+K' or '/'
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        itemCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(query) || description.includes(query)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});