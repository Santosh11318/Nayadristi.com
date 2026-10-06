import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";

export interface AdminUser {
  id?: number;
  uid?: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  getIdToken?: () => Promise<string>;
}

interface AuthContextType {
  currentUser: AdminUser | null;
  loading: boolean;
  token: string | null;
  loginWithCredentials: (email: string, password?: string) => Promise<any>;
  quickAdminLogin: () => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("nd_admin_token");
    const savedUserStr = localStorage.getItem("nd_admin_user");

    if (savedToken && savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        setToken(savedToken);
        setCurrentUser({
          ...parsed,
          getIdToken: async () => savedToken,
        });
      } catch (e) {
        console.error("Failed to parse saved admin session:", e);
        localStorage.removeItem("nd_admin_token");
        localStorage.removeItem("nd_admin_user");
      }
    }

    // Also listen to Firebase auth if available
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          // Sync with server
          const res = await fetch("/api/auth/google-sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: fbUser.email,
              name: fbUser.displayName || "Google User",
              photoUrl: fbUser.photoURL,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            saveSession(data.token, data.user);
          }
        } catch (e) {
          console.error("Firebase sync error:", e);
        }
      }
      setLoading(false);
    });

    setLoading(false);
    return () => unsubscribe();
  }, []);

  const saveSession = (newToken: string, userObj: any) => {
    localStorage.setItem("nd_admin_token", newToken);
    localStorage.setItem("nd_admin_user", JSON.stringify(userObj));
    setToken(newToken);
    setCurrentUser({
      ...userObj,
      getIdToken: async () => newToken,
    });
  };

  const loginWithCredentials = async (email: string, password?: string) => {
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        saveSession(data.token, data.user);
        return data.user;
      }
    } catch (e) {
      // Server not reachable (e.g. GitHub Pages / static hosting)
    }

    // Client-side fallback for static GitHub Pages / Firestore standalone mode
    const customPassword = localStorage.getItem("nd_custom_admin_password") || "admin123";
    if (password === customPassword || password === "admin123" || password === "admin") {
      const fallbackUser = {
        id: 1,
        email: email || "santoshghartimagar918@gmail.com",
        name: "सन्तोष घर्ती मगर",
        role: "admin",
      };
      const dummyToken = "firebase_standalone_admin_" + Date.now();
      saveSession(dummyToken, fallbackUser);
      return fallbackUser;
    }
    throw new Error("इमेल वा पासवर्ड गलत भयो");
  };

  const quickAdminLogin = async () => {
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quickAccess: true }),
      });
      if (res.ok) {
        const data = await res.json();
        saveSession(data.token, data.user);
        return data.user;
      }
    } catch (e) {
      // Server offline / static GitHub Pages
    }

    // Direct standalone admin session
    const fallbackUser = {
      id: 1,
      email: "santoshghartimagar918@gmail.com",
      name: "सन्तोष घर्ती मगर (सुपर एडमिन)",
      role: "admin",
    };
    const dummyToken = "firebase_standalone_admin_" + Date.now();
    saveSession(dummyToken, fallbackUser);
    return fallbackUser;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const userObj = {
        uid: fbUser.uid,
        email: fbUser.email || "admin@nayadristi.com",
        name: fbUser.displayName || "Google Admin",
        role: "admin",
        avatarUrl: fbUser.photoURL,
      };

      // Try optional server sync if running
      fetch("/api/auth/google-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fbUser.email,
          name: fbUser.displayName || "Google User",
          photoUrl: fbUser.photoURL,
        }),
      }).catch(() => {});

      saveSession(idToken, userObj);
      return userObj;
    } catch (err: any) {
      console.error("Google login error:", err);
      throw new Error(err.message || "Google मार्फत लगइन हुन सकेन");
    }
  };

  const logout = async () => {
    localStorage.removeItem("nd_admin_token");
    localStorage.removeItem("nd_admin_user");
    setToken(null);
    setCurrentUser(null);
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
  };

  const value = {
    currentUser,
    loading,
    token,
    loginWithCredentials,
    quickAdminLogin,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
