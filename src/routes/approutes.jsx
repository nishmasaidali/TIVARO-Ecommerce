
import { Routes, Route } from "react-router-dom";

import ScrollToTop from "../components/scrolltotop";

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

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Shop />} />

        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
