import React, { createContext, useContext, useState, useEffect } from "react";
import { getItem, setItem, removeItem } from "../utils/storage";
import { findAdminByUsername } from "../utils/adminAccounts";

export interface AuthContextType {
  role: "admin" | "guest" | null;
  isAdmin: boolean;
  adminRole: string | null; // "main", "X.1", "X.2", etc.
  login: (username: string, password: string) => boolean;
  loginAsGuest: () => void;
  logout: () => void;
  canEditClass: (subclass: string) => boolean;
  canEditMainSettings: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<"admin" | "guest" | null>(null);
  const [adminRole, setAdminRoleState] = useState<string | null>(null);

  useEffect(() => {
    const session = getItem("auth_session");
    if (session && (session.role === "admin" || session.role === "guest")) {
      setRole(session.role);
      setAdminRoleState(session.adminRole || null);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const account = findAdminByUsername(username);
    if (account && account.password === password) {
      setRole("admin");
      setAdminRoleState(acc => account.role);
      setItem("auth_session", { role: "admin", adminRole: account.role, timestamp: Date.now() });
      return true;
    }
    return false;
  };

  const loginAsGuest = (): void => {
    setRole("guest");
    setAdminRoleState(null);
    setItem("auth_session", { role: "guest", adminRole: null, timestamp: Date.now() });
  };

  const logout = (): void => {
    setRole(null);
    setAdminRoleState(null);
    removeItem("auth_session");
  };

  const isAdmin = role === "admin";

  const canEditClass = (subclass: string): boolean => {
    if (!isAdmin) return false;
    if (adminRole === "main") return true;
    // standardize checks e.g. "X.1" === "X.1"
    return adminRole === subclass;
  };

  const canEditMainSettings = (): boolean => {
    if (!isAdmin) return false;
    return adminRole === "main";
  };

  return (
    <AuthContext.Provider value={{ role, isAdmin, adminRole, login, loginAsGuest, logout, canEditClass, canEditMainSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
