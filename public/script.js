const createView = document.getElementById('create-view');
const successView = document.getElementById('success-view');
const readView = document.getElementById('read-view');
const errorView = document.getElementById('error-view');

// Check if we are viewing a note
const noteId = window.location.pathname.substring(1);

if (noteId && noteId.length > 5) {
    fetchNote(noteId);
}

async function createNote() {
    const content = document.getElementById('note-input').value;
    if (!content) return;

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        const data = await response.json();
        
        document.getElementById('share-link').value = window.location.origin + '/' + data.id;
        createView.classList.add('hidden');
        successView.classList.remove('hidden');
    } catch (e) {
        alert('Failed to create note.');
    }
}

async function fetchNote(id) {
    createView.classList.add('hidden');
    try {
        const response = await fetch('/api/notes/' + id);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('note-content').textContent = data.content;
            readView.classList.remove('hidden');
        } else {
            errorView.classList.remove('hidden');
        }
    } catch (e) {
        errorView.classList.remove('hidden');
    }
}

function copyLink() {
    const el = document.getElementById('share-link');
    el.select();
    document.execCommand('copy');
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
}

function resetUI() {
    window.location.href = '/';
}
