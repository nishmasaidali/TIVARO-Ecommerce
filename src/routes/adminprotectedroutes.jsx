
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/adminauthcontext";

const AdminProtectedRoutes = () => {
  const { isAdminLoggedIn } = useAdminAuth();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoutes;
