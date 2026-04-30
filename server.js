const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const notes = new Map();

// Create note
app.post('/api/notes', (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    
    const id = uuidv4();
    notes.set(id, content);
    
    // Auto-delete after 24 hours if not read
    setTimeout(() => {
        if (notes.has(id)) notes.delete(id);
    }, 24 * 60 * 60 * 1000);

    res.json({ id });
});

// Get and delete note
app.get('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    if (notes.has(id)) {
        const content = notes.get(id);
        notes.delete(id); // Self-destruct
        res.json({ content });
    } else {
        res.status(404).json({ error: 'Note not found or already destroyed' });
    }
});

// Fallback to index.html for SPA routing (viewing notes)
app.get('/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Ecotron Whisper running at http://localhost:${port}`);
});
