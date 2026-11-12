
import { Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "../components/scrolltotop";

// User pages
import Home from "../pages/home";
import Shop from "../pages/shop";
import ProductDetails from "../pages/productdetails";
import Cart from "../pages/cart";
import Wishlist from "../pages/wishlist";
import Checkout from "../pages/checkout";
import Orders from "../pages/orders";
import Profile from "../pages/profile";
import Login from "../pages/login";
import Register from "../pages/register";

// Admin pages
import AdminLogin from "../pages/admin/pages/adminlogin";
import AdminDashboard from "../pages/admin/pages/admindashboard";
import AdminProducts from "../pages/admin/pages/adminproducts";
import AdminUsers from "../pages/admin/pages/adminusers";
import AdminOrders from "../pages/admin/pages/adminorders";

// Admin layout and protection
import AdminLayout from "../pages/admin/layout/adminlayout";
import AdminProtectedRoutes from "./adminprotectedroutes";

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Default Admin Dashboard */}
            <Route
              index
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="products"
              element={<AdminProducts />}
            />

            <Route
              path="users"
              element={<AdminUsers />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />
          </Route>
        </Route>

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
