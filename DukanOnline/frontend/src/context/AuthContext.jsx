import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("dukan_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data) => {
    localStorage.setItem("dukan_token", data.token);
    localStorage.setItem("dukan_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("dukan_token");
    localStorage.removeItem("dukan_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);