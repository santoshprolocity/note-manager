import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotesManager from "./pages/NotesManager";
import QuotesPage from "./pages/QuotesPage";

function AppInner() {
  const { token } = useAuth();
  const [page, setPage] = useState("dashboard");

  if (!token) {
    return <Login onLogin={() => setPage("dashboard")} />;
  }

  if (page === "notes") return <NotesManager onNavigate={setPage} />;
  if (page === "quotes") return <QuotesPage onNavigate={setPage} />;
  return <Dashboard onNavigate={setPage} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
