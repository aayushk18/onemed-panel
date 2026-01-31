import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutPanelTop,
  FileText,
  BookOpen,
  Info
} from "lucide-react";

const tabs = [
  { name: "Panel", path: "/website/panel", icon: LayoutPanelTop },
  { name: "Resources", path: "/website/resources", icon: FileText },
  { name: "Blogs", path: "/website/blogs", icon: BookOpen },
  { name: "About", path: "/website/about", icon: Info },
];

export default function WebsiteLayout() {
  return (
    <div className="space-y-6">
      {/* Secondary Topbar */}
      <div
        className="bg-white rounded-2xl px-6 py-4
        shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex flex-wrap gap-3">
          {tabs.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl
                text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-[#E8F0FE] hover:text-blue-700"
                }`
              }
            >
              <Icon size={16} />
              {name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Sub Page Content */}
      <Outlet />
    </div>
  );
}
