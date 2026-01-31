import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  Globe,
  BookOpen,
  ClipboardList,
  BarChart3,
  X
} from "lucide-react";
import { useAuthStore } from "../utils/useAuthStore";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Home", path: "/admin/home", icon: Home },
  { name: "Faculty", path: "/admin/faculty", icon: Users },
  { name: "Website", path: "/admin/website", icon: Globe },
  { name: "Academic", path: "/admin/academic", icon: BookOpen },
  { name: "Admission", path: "/admin/admissions", icon: ClipboardList },
  { name: "Reports & Analysis", path: "/admin/reports", icon: BarChart3 },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {


  const { authUser } = useAuthStore();

  return (
    <aside
      className={`fixed lg:static z-40 h-full w-72 bg-white
      shadow-[4px_0_20px_rgba(0,0,0,0.05)]
      transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
    >
      {/* Header */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-xl font-bold text-blue-700">
          {`${authUser.firstName} ${authUser.lastName}`}
        </h1>
        <p className="text-xs text-gray-500">
          OneMed Admin Panel
        </p>
      </div>

      {/* Close (mobile) */}
      <button
        className="absolute top-5 right-4 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      >
        <X />
      </button>

      {/* Menu */}
      <nav className="px-4 py-6 space-y-2">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
               transition-all
              ${isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-[#E8F0FE] hover:text-blue-700"
              }`
            }
          >
            <Icon size={18} strokeWidth={1.7} />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
