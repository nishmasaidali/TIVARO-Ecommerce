import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import { useWishlist } from "../context/wishlistcontext";
import { useAuth } from "../context/authcontext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { currentUser, logout } = useAuth();

  const cartCount = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const wishlistCount = wishlist.length;

  const linkClass = ({ isActive }) =>
    `text-xs font-medium uppercase tracking-[0.15em] transition duration-300 ${
      isActive
        ? "text-[#A17D49]"
        : "text-[#6B5A4B] hover:text-[#A17D49]"
    }`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  function handleLogout() {
    logout();
    closeMenu();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5D8C5] bg-[#F4EFE5]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

        {/* Brand */}
        <Link to="/" onClick={closeMenu} className="flex flex-col">
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#30251E] md:text-3xl">
            TIVARO
          </span>

          <span className="mt-1 text-[8px] tracking-[0.32em] text-[#A17D49]">
            TIMELESS ELEGANCE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={linkClass}>
            Shop
          </NavLink>

          <NavLink to="/products?category=Men" className={linkClass}>
            Men
          </NavLink>

          <NavLink to="/products?category=Women" className={linkClass}>
            Women
          </NavLink>

          {/* Orders */}
          {currentUser && (
            <NavLink to="/orders" className={linkClass}>
              Orders
            </NavLink>
          )}
        </nav>

        {/* Desktop Wishlist, Cart and Account */}
        <div className="hidden items-center gap-6 md:flex">

          {/* Wishlist */}
          <NavLink
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className={({ isActive }) =>
              `relative transition ${
                isActive
                  ? "text-[#A17D49]"
                  : "text-[#6B5A4B] hover:text-[#A17D49]"
              }`
            }
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>

            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A17D49] px-1 text-[9px] text-white">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* Cart */}
          <NavLink
            to="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            className={({ isActive }) =>
              `relative transition ${
                isActive
                  ? "text-[#A17D49]"
                  : "text-[#6B5A4B] hover:text-[#A17D49]"
              }`
            }
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="10" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A17D49] px-1 text-[9px] text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Account */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[100px] truncate text-xs text-[#6B5A4B]">
                Hi, {currentUser.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-medium uppercase tracking-wider text-[#6B5A4B] transition hover:text-[#A17D49]"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              aria-label="Login"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-[#A17D49]"
                    : "text-[#6B5A4B] hover:text-[#A17D49]"
                }`
              }
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="rounded-md p-2 text-[#30251E] md:hidden"
        >
          {menuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#E5D8C5] bg-[#F4EFE5] px-6 py-6 md:hidden"
        >
          <nav className="flex flex-col gap-6">

            <NavLink
              to="/"
              end
              className={linkClass}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={linkClass}
              onClick={closeMenu}
            >
              Shop All
            </NavLink>

            <NavLink
              to="/products?category=Men"
              className={linkClass}
              onClick={closeMenu}
            >
              Men
            </NavLink>

            <NavLink
              to="/products?category=Women"
              className={linkClass}
              onClick={closeMenu}
            >
              Women
            </NavLink>

            {/* Orders */}
            {currentUser && (
              <NavLink
                to="/orders"
                className={linkClass}
                onClick={closeMenu}
              >
                My Orders
              </NavLink>
            )}

            <div className="border-t border-[#E5D8C5] pt-5">

              {/* Wishlist */}
              <NavLink
                to="/wishlist"
                onClick={closeMenu}
                className="flex items-center justify-between text-sm text-[#6B5A4B]"
              >
                Wishlist
                <span>{wishlistCount}</span>
              </NavLink>

              {/* Cart */}
              <NavLink
                to="/cart"
                onClick={closeMenu}
                className="mt-5 flex items-center justify-between text-sm text-[#6B5A4B]"
              >
                Shopping Cart
                <span>{cartCount}</span>
              </NavLink>

              {/* Mobile Account */}
              {currentUser ? (
                <>
                  <div className="mt-5 flex items-center justify-between text-sm text-[#6B5A4B]">
                    <span>
                      Hi, {currentUser.name}
                    </span>

                    <span className="text-[#A17D49]">✓</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-5 w-full border border-[#A17D49] py-3 text-xs font-semibold uppercase tracking-widest text-[#6B5A4B] transition hover:bg-[#A17D49] hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="mt-5 flex items-center justify-between text-sm text-[#6B5A4B]"
                >
                  My Account
                  <span>→</span>
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;