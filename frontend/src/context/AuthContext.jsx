import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // BUG #6: Token stored in localStorage — accessible to any JS on the page (XSS risk).
  // A secure alternative is an httpOnly cookie set by the server.
  const [token, setTokenState] = useState(localStorage.getItem("token"));

  function setToken(newToken) {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  }

  function clearToken() {
    localStorage.removeItem("token");
    setTokenState(null);
  }

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
