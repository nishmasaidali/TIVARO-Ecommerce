
import { useAdminAuth } from "../../../context/adminauthcontext";
import { ShieldCheck } from "lucide-react";

const AdminHeader = ({ title }) => {
  const { admin } = useAdminAuth();

  const adminName = admin?.name || "Administrator";

  return (
    <header className="w-full bg-white border-b border-[#D9CBB7] px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">

      {/* Page Title */}
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-serif font-semibold text-[#30251E]">
          {title}
        </h1>

        <p className="text-xs text-[#766657] mt-1">
          TIVARO Admin Panel
        </p>
      </div>

      {/* Admin Information */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-[#30251E]">
            Welcome, {adminName}
          </p>

          <p className="text-xs text-[#766657] flex items-center justify-end gap-1 mt-1">
            <ShieldCheck size={13} />
            Administrator
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#A17D49] text-white flex items-center justify-center font-semibold">
          {adminName.charAt(0).toUpperCase()}
        </div>

      </div>

    </header>
  );
};

export default AdminHeader;
