"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface EditContextType {
  isAuthenticated: boolean;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export function EditProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/verify");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (!data.authenticated) {
        setIsEditMode(false);
      }
    } catch {
      setIsAuthenticated(false);
      setIsEditMode(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setIsEditMode(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Keyboard shortcut to toggle edit mode (Cmd/Ctrl + E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        if (isAuthenticated) {
          setIsEditMode((prev) => !prev);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated]);

  return (
    <EditContext.Provider
      value={{
        isAuthenticated,
        isEditMode,
        setIsEditMode,
        checkAuth,
        logout,
      }}
    >
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  const context = useContext(EditContext);
  if (context === undefined) {
    throw new Error("useEdit must be used within an EditProvider");
  }
  return context;
}
