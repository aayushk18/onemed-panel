import { Menu, ChevronDown, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../utils/useAuthStore";

export default function Topbar({ setSidebarOpen }) {
  const [open, setOpen] = useState(false);

  const { logout } = useAuthStore();

  return (
    <header className="bg-white px-6 lg:px-8 py-4
      shadow-[0_4px_20px_rgba(0,0,0,0.04)]
      flex justify-between items-center"
    >
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          OneMed Panel
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-[#F4F8FC]
            px-4 py-2 rounded-xl hover:bg-[#E8F0FE]"
        >
          <UserCircle className="text-blue-600" />
          <span className="hidden sm:block text-sm font-medium">
            Admin
          </span>
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl
            shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden"
          >
            <button className="w-full px-5 py-3 text-left text-sm hover:bg-gray-50">
              Manage Account
            </button>
            <button onClick={logout} className="w-full px-5 py-3 text-left text-sm text-red-600 hover:bg-red-50">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
