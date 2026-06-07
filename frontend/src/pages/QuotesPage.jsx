import { useEffect, useState, useMemo } from "react";
import { getQuotes, getTopQuotes, voteOnQuote } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "random", label: "Random" },
];

export default function QuotesPage({ onNavigate }) {
  const { token } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [sort, setSort] = useState("popular");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(sortMode) {
    setLoading(true);
    setError("");
    try {
      // Use /quotes/top for popular, /quotes for the rest (sort client-side).
      const data = sortMode === "popular" ? await getTopQuotes() : await getQuotes();
      setQuotes(data.quotes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(sort); }, [sort]);

  const displayedQuotes = useMemo(() => {
    if (sort === "newest") return [...quotes].sort((a, b) => b.id - a.id);
    if (sort === "random") return [...quotes].sort(() => Math.random() - 0.5);
    return quotes; // already sorted by backend for "popular"
  }, [quotes, sort]);

  async function handleVote(quoteId, voteType) {
    if (!token) {
      setError("Please log in to vote.");
      return;
    }
    try {
      const updated = await voteOnQuote(quoteId, voteType);
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, ...updated } : q))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>NoteApp</h1>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => onNavigate("dashboard")}>← Dashboard</button>
          <button style={styles.navBtn} onClick={() => onNavigate("notes")}>My Notes</button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Quotes</h2>
          <div style={styles.sortRow}>
            <label style={styles.sortLabel}>Sort by:</label>
            <select
              style={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {loading && <p style={styles.muted}>Loading…</p>}

        {!loading && displayedQuotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            loggedIn={!!token}
            onVote={handleVote}
          />
        ))}
      </main>
    </div>
  );
}

function QuoteCard({ quote, loggedIn, onVote }) {
  const isLiked = quote.user_vote === 1;
  const isDisliked = quote.user_vote === -1;

  function handleClick(voteType) {
    if (!loggedIn) return;
    onVote(quote.id, voteType);
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardBody}>
        <p style={styles.quoteText}>"{quote.text}"</p>
        <p style={styles.author}>— {quote.author}</p>
      </div>
      <div style={styles.voteRow}>
        <button
          style={{ ...styles.voteBtn, ...(isLiked ? styles.liked : {}) }}
          onClick={() => handleClick(1)}
          title={loggedIn ? "Like" : "Log in to vote"}
          disabled={!loggedIn}
        >
          👍
        </button>
        <span style={styles.voteCount}>{quote.total_votes}</span>
        <button
          style={{ ...styles.voteBtn, ...(isDisliked ? styles.disliked : {}) }}
          onClick={() => handleClick(-1)}
          title={loggedIn ? "Dislike" : "Log in to vote"}
          disabled={!loggedIn}
        >
          👎
        </button>
        {!loggedIn && (
          <span style={styles.loginHint}>Log in to vote</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f2f5" },
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1rem 2rem", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  logo: { margin: 0, color: "#4f46e5" },
  navLinks: { display: "flex", gap: "1rem" },
  navBtn: { background: "none", border: "none", cursor: "pointer", color: "#4f46e5", fontSize: "1rem" },
  main: { maxWidth: "700px", margin: "2rem auto", padding: "0 1rem", display: "flex", flexDirection: "column", gap: "1rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sortRow: { display: "flex", alignItems: "center", gap: "0.5rem" },
  sortLabel: { fontSize: "0.9rem", color: "#6b7280" },
  select: { padding: "0.4rem 0.6rem", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.9rem", cursor: "pointer" },
  error: { color: "#ef4444", fontSize: "0.85rem", margin: 0 },
  muted: { color: "#6b7280" },
  card: {
    background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem",
  },
  cardBody: {},
  quoteText: { fontSize: "1.1rem", fontStyle: "italic", color: "#1f2937", margin: "0 0 0.25rem" },
  author: { color: "#6b7280", fontSize: "0.9rem", margin: 0 },
  voteRow: { display: "flex", alignItems: "center", gap: "0.5rem" },
  voteBtn: {
    background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "6px",
    padding: "0.3rem 0.7rem", fontSize: "1.1rem", cursor: "pointer",
    transition: "background 0.15s",
  },
  liked: { background: "#d1fae5", borderColor: "#6ee7b7" },
  disliked: { background: "#fee2e2", borderColor: "#fca5a5" },
  voteCount: { fontWeight: 600, fontSize: "1rem", color: "#374151", minWidth: "2rem", textAlign: "center" },
  loginHint: { fontSize: "0.8rem", color: "#9ca3af", marginLeft: "0.5rem" },
};
