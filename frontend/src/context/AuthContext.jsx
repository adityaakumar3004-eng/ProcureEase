import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // RBAC Helpers
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,

        isAuthenticated: !!user,

        isAdmin,
        isManager,
        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}