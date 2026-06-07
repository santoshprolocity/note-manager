import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login, signup } from "../utils/api";

export default function Login({ onLogin }) {
  const { setToken } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "signup") {
        await signup(username, password);
        setMode("login");
        return;
      }
      const data = await login(username, password);
      setToken(data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
        <p style={styles.toggle}>
          {mode === "login" ? "No account? " : "Have an account? "}
          <span
            style={styles.link}
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" },
  card: { background: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", width: "320px" },
  form: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  input: { padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem" },
  btn: { padding: "0.7rem", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" },
  error: { color: "red", fontSize: "0.85rem" },
  toggle: { marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" },
  link: { color: "#4f46e5", cursor: "pointer", textDecoration: "underline" },
};
