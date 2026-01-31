import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
    return (
      <div className="flex h-screen bg-[#F4F8FC] overflow-hidden">
        {/* overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
  
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  
        <div className="flex flex-col flex-1">
          <Topbar setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
  