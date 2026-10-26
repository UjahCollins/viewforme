
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  ClipboardList,
  FileImage,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  LogIn,
  X,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Viewers",
    path: "/admin/viewers",
    icon: Users,
  },
  {
    label: "Viewer Applications",
    path: "/admin/viewer-applications",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: FileImage,
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Enquiries",
    path: "/admin/enquiries",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar({
  isOpen,
  onClose,
  isAuthenticated = false,
  onLogout,
}) {
  const handleLogout = () => {
    onClose?.();
    onLogout?.();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#17324D] text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h2 className="text-xl font-extrabold">
              ViewForMe
            </h2>

            <p className="text-xs text-[#78D6C9]">
              Admin Portal
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav
          aria-label="Admin navigation"
          className="flex-1 space-y-1 overflow-y-auto px-3 py-6"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#2A9D8F] text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* ACCOUNT SECTION */}

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 rounded-xl bg-white/10 p-3">
            <p className="text-sm font-semibold">
              {isAuthenticated
                ? "Administrator"
                : "Guest"}
            </p>

            <p className="text-xs text-slate-300">
              {isAuthenticated
                ? "ViewForMe Management"
                : "Sign in to manage ViewForMe"}
            </p>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut size={19} />
              Logout
            </button>
          ) : (
            <NavLink
              to="/admin/login"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LogIn size={19} />
              Sign In
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
