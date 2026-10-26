
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

function ProtectedAdminRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAdminAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F9FA]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#2A9D8F]" />

          <p className="mt-4 text-sm font-medium text-[#17324D]">
            Verifying administrator session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
