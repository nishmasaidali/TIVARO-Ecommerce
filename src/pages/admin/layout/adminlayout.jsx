
import { Outlet, useLocation } from "react-router-dom";

import AdminSidebar from "../components/adminsidebar";
import AdminHeader from "../components/adminheader";

const AdminLayout = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/admin/dashboard") {
      return "Dashboard";
    }

    if (location.pathname === "/admin/products") {
      return "Products";
    }

    if (location.pathname === "/admin/users") {
      return "Users";
    }

    if (location.pathname === "/admin/orders") {
      return "Orders";
    }

    return "Admin Panel";
  };

  return (
    <div className="min-h-screen bg-[#F4EFE5] flex">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header */}
        <AdminHeader title={getPageTitle()} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
