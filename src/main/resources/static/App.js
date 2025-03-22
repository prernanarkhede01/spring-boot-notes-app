// Wait until the page is fully loaded before running script
document.addEventListener("DOMContentLoaded", function () {
    fetchNotes(); // Fetch notes when the page loads

    // Handle form submission for adding a new note
    document.getElementById("note-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page refresh
        addNote();
    });
});

// 📝 Function to fetch all notes from the backend
async function fetchNotes() {
    const response = await fetch("http://localhost:8080/notes");
    const notes = await response.json();

    let notesList = document.getElementById("notes-list");
    notesList.innerHTML = ""; // Clear previous notes

    notes.forEach(note => {
        let noteItem = document.createElement("li");
        noteItem.innerHTML = `
            <strong>${note.title}</strong>: ${note.content}
            <button onclick="deleteNote(${note.id})">❌ Delete</button>
            <button onclick="editNote(${note.id}, '${note.title}', '${note.content}')">✏️ Edit</button>
        `;
        notesList.appendChild(noteItem);
    });
}

// ➕ Function to add a new note
async function addNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    const response = await fetch("http://localhost:8080/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    });

    if (response.ok) {
        alert("Note added successfully!");
        document.getElementById("note-form").reset(); // Clear the form
        fetchNotes(); // Refresh notes list
    } else {
        alert("Failed to add note!");
    }
}

// ❌ Function to delete a note
async function deleteNote(id) {
    const response = await fetch(`http://localhost:8080/notes/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Note deleted successfully!");
        fetchNotes(); // Refresh notes list
    } else {
        alert("Failed to delete note!");
    }
}

// ✏️ Function to update a note
async function editNote(id, oldTitle, oldContent) {
    const newTitle = prompt("Edit Title:", oldTitle);
    const newContent = prompt("Edit Content:", oldContent);

    if (newTitle !== null && newContent !== null) {
        const response = await fetch(`http://localhost:8080/notes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });

        if (response.ok) {
            alert("Note updated successfully!");
            fetchNotes(); // Refresh notes list
        } else {
            alert("Failed to update note!");
        }
    }
}
