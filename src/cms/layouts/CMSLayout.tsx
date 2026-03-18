// src/cms/layouts/CMSLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTokenRefresh } from "../../hooks/useTokenRefresh";

export default function CMSLayout() {
  useTokenRefresh(); // ✅ cukup 1 baris, aktif selama user di CMS

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
