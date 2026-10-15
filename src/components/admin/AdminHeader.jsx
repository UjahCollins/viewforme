
import {
  Menu,
  Bell,
  UserRound,
} from "lucide-react";

function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open admin menu"
          className="rounded-lg p-2 text-[#17324D] hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#17324D] sm:text-xl">
            Admin Dashboard
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your ViewForMe operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          aria-label="Notifications will be available after integration"
          className="relative text-slate-600"
        >
          <Bell size={21} />
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F6F3] text-[#2A9D8F]">
          <UserRound size={21} />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
