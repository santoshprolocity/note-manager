import { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../utils/api";

export default function NotesManager({ onNavigate }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await getNotes();
      setNotes(data.notes);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    try {
      if (editing) {
        await updateNote(editing.id, title, content);
      } else {
        await createNote(title, content);
      }
      setTitle(""); setContent(""); setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(note) {
    setEditing(note);
    setTitle(note.title);
    setContent(note.content);
  }

  async function handleDelete(id) {
    await deleteNote(id);
    load();
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>NoteApp</h1>
        <button style={styles.navBtn} onClick={() => onNavigate("dashboard")}>← Dashboard</button>
      </nav>

      <main style={styles.main}>
        <div style={styles.form}>
          <h2>{editing ? "Edit Note" : "New Note"}</h2>
          <input style={styles.input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea style={styles.textarea} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
          {error && <p style={styles.error}>{error}</p>}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button style={styles.btn} onClick={handleSave}>{editing ? "Update" : "Create"}</button>
            {editing && <button style={styles.cancelBtn} onClick={() => { setEditing(null); setTitle(""); setContent(""); }}>Cancel</button>}
          </div>
        </div>

        <div style={styles.notesList}>
          <h2>Your Notes</h2>
          {notes.length === 0 && <p style={{ color: "#6b7280" }}>No notes yet.</p>}
          {notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              <h3 style={styles.noteTitle}>{note.title}</h3>
              {/* BUG #5: dangerouslySetInnerHTML renders unsanitized user content — XSS risk. */}
              <div dangerouslySetInnerHTML={{ __html: note.content }} style={styles.noteContent} />
              <div style={styles.noteActions}>
                <button style={styles.editBtn} onClick={() => handleEdit(note)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f2f5" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  logo: { margin: 0, color: "#4f46e5" },
  navBtn: { background: "none", border: "none", cursor: "pointer", color: "#4f46e5", fontSize: "1rem" },
  main: { maxWidth: "700px", margin: "2rem auto", padding: "0 1rem", display: "flex", flexDirection: "column", gap: "2rem" },
  form: { background: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "0.75rem" },
  input: { padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem" },
  textarea: { padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem", resize: "vertical" },
  btn: { padding: "0.6rem 1.2rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  cancelBtn: { padding: "0.6rem 1.2rem", background: "#e5e7eb", color: "#374151", border: "none", borderRadius: "4px", cursor: "pointer" },
  error: { color: "red", fontSize: "0.85rem" },
  notesList: { display: "flex", flexDirection: "column", gap: "1rem" },
  noteCard: { background: "#fff", padding: "1.25rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  noteTitle: { margin: "0 0 0.5rem", color: "#1f2937" },
  noteContent: { color: "#374151", marginBottom: "1rem", lineHeight: 1.6 },
  noteActions: { display: "flex", gap: "0.5rem" },
  editBtn: { padding: "0.4rem 0.8rem", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  deleteBtn: { padding: "0.4rem 0.8rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
};
