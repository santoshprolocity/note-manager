const BASE_URL = "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export const getQuote = () => apiFetch("/quote");
export const signup = (username, password) =>
  apiFetch("/signup", { method: "POST", body: JSON.stringify({ username, password }) });
export const login = (username, password) =>
  apiFetch("/login", { method: "POST", body: JSON.stringify({ username, password }) });
export const getNotes = () => apiFetch("/notes");
export const createNote = (title, content) =>
  apiFetch("/notes", { method: "POST", body: JSON.stringify({ title, content }) });
export const updateNote = (id, title, content) =>
  apiFetch(`/notes/${id}`, { method: "PUT", body: JSON.stringify({ title, content }) });
export const deleteNote = (id) =>
  apiFetch(`/notes/${id}`, { method: "DELETE" });

// Task 5 — Quote voting
export const getQuotes = () => apiFetch("/quotes");
export const getTopQuotes = () => apiFetch("/quotes/top");
export const voteOnQuote = (quoteId, voteType) =>
  apiFetch(`/quotes/${quoteId}/vote`, {
    method: "POST",
    body: JSON.stringify({ vote_type: voteType }),
  });
