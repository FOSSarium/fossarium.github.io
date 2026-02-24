const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// Configure marked.js to sanitize and format output
marked.setOptions({
    breaks: true, // Convert \n to <br>
    gfm: true, // GitHub Flavored Markdown
});

function updatePreview() {
    const markdownText = editor.value;
    const htmlText = marked.parse(markdownText);
    preview.innerHTML = htmlText;
}

// Event listener for typing
editor.addEventListener('input', updatePreview);

// Handle tab key to insert spaces instead of changing focus
editor.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;

        // Insert 2 spaces
        this.value = this.value.substring(0, start) +
            "  " + this.value.substring(end);

        // Put caret at right position again
        this.selectionStart = this.selectionEnd = start + 2;
    }
});

// Initial render
updatePreview();
