
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  function login(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);

    window.dispatchEvent(new Event("authChanged"));
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);

    window.dispatchEvent(new Event("authChanged"));
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
