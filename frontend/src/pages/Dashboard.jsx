import { useEffect, useState } from "react";
import { getQuote } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ onNavigate }) {
  const { clearToken } = useAuth();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    getQuote().then((d) => setQuote(d.quote)).catch(() => {});
  }, []);

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>NoteApp</h1>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => onNavigate("quotes")}>Quotes</button>
          <button style={styles.navBtn} onClick={() => onNavigate("notes")}>My Notes</button>
          <button style={styles.navBtn} onClick={clearToken}>Logout</button>
        </div>
      </nav>
      <main style={styles.main}>
        <div style={styles.quoteCard}>
          <p style={styles.quoteLabel}>Quote of the day</p>
          <p style={styles.quoteText}>"{quote}"</p>
        </div>
        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={() => onNavigate("quotes")}>
            Vote on Quotes →
          </button>
          <button style={{ ...styles.primaryBtn, background: "#6b7280", marginLeft: "1rem" }} onClick={() => onNavigate("notes")}>
            My Notes →
          </button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f2f5" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  logo: { margin: 0, color: "#4f46e5" },
  navLinks: { display: "flex", gap: "1rem" },
  navBtn: { background: "none", border: "none", cursor: "pointer", color: "#4f46e5", fontSize: "1rem" },
  main: { maxWidth: "700px", margin: "3rem auto", padding: "0 1rem" },
  quoteCard: { background: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "2rem" },
  quoteLabel: { color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.5rem" },
  quoteText: { fontSize: "1.2rem", fontStyle: "italic", color: "#1f2937" },
  actions: { textAlign: "center" },
  primaryBtn: { padding: "0.8rem 2rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem" },
};
