import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function CMSLayout() {
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
