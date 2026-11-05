import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Shop from "../pages/shop";
import ProductDetails from "../pages/productdetails";
import Cart from "../pages/cart";
import Wishlist from "../pages/wishlist";
import Checkout from "../pages/checkout";
import Orders from "../pages/orders";
import Login from "../pages/login";
import Register from "../pages/register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Shop />} />

      <Route
        path="/products/:slug"
        element={<ProductDetails />}
      />

      <Route path="/cart" element={<Cart />} />

      <Route path="/wishlist" element={<Wishlist />} />

      {/* Checkout */}
      <Route path="/checkout" element={<Checkout />} />

      {/* Orders */}
      <Route path="/orders" element={<Orders />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;