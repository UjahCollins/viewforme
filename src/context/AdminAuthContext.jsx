
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentAdmin,
  logoutAdmin,
} from "../services/adminAuthApi.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await getCurrentAdmin();

      // Supports both an API helper returning JSON
      // and a standard Axios response.
      const result =
        response?.data?.success !== undefined
          ? response.data
          : response;

      if (!result?.success) {
        setAdmin(null);
        return null;
      }

      const adminData =
        result.data?.admin ??
        result.data?.user ??
        result.data;

      if (!adminData || typeof adminData !== "object") {
        setAdmin(null);
        return null;
      }

      setAdmin(adminData);
      return adminData;
    } catch (error) {
      setAdmin(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async () => {
    setLoading(true);
    return checkAuth();
  };

  const signOut = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: Boolean(admin),
        signIn,
        signOut,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used within AdminAuthProvider"
    );
  }

  return context;
}
