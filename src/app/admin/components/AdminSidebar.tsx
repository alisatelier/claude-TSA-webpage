import { signOut } from "@/lib/auth";
import AdminNavLinks from "./AdminNavLinks";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-lg font-semibold">THE SPIIT ATELIE </h1>
        <p className="text-sm text-slate-400">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4">
        <AdminNavLinks />
      </nav>
      <div className="p-4 border-t border-slate-700">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
