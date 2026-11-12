
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
} from "lucide-react";

import { useAdminAuth } from "../../../context/adminauthcontext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logoutAdmin } = useAdminAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="w-20 sm:w-64 shrink-0 min-h-screen bg-[#30251E] text-white flex flex-col">

      {/* Logo */}
      <div className="px-3 sm:px-6 py-7 border-b border-[#766657] text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-serif tracking-widest text-[#C5A16A]">
          TIVARO
        </h1>

        <p className="hidden sm:block text-xs tracking-[3px] text-[#D9CBB7] mt-2">
          ADMIN PANEL
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 sm:px-4 py-6">

        <p className="hidden sm:block text-xs text-[#A99A87] uppercase tracking-widest mb-5 px-3">
          Menu
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin/dashboard"}
                title={item.name}
                className={({ isActive }) =>
                  `flex items-center justify-center sm:justify-start gap-3 px-3 sm:px-4 py-3 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-[#A17D49] text-white"
                      : "text-[#D9CBB7] hover:bg-[#4A3A2E]"
                  }`
                }
              >
                <Icon size={19} />
                <span className="hidden sm:inline">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-2 sm:p-4 border-t border-[#766657]">
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-full flex items-center justify-center sm:justify-start gap-3 px-3 sm:px-4 py-3 rounded-lg text-sm text-[#D9CBB7] hover:bg-[#4A3A2E] transition"
        >
          <LogOut size={19} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default AdminSidebar;
