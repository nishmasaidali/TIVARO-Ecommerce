
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Heart,
  ShoppingBag,
  LogOut,
  UserRound,
  Package,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { useCart } from "../context/cartcontext";
import { useWishlist } from "../context/wishlistcontext";
import { useAuth } from "../context/authcontext";

const collections = [
  "Vintage Essentials",
  "Heritage Collection",
  "Signature Luxury",
  "Party & Evening",
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { cart, clearCart } = useCart();
  const { wishlist } = useWishlist();
  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const closeMenu = () => {
    setMenuOpen(false);
    setCollectionsOpen(false);
    setProfileOpen(false);
  };

  // Home and Shop styling
  const linkClass = ({ isActive }) =>
    `text-xs font-normal tracking-[0.18em] transition-colors ${
      isActive
        ? "text-[#A17D49]"
        : "text-[#30251E] hover:text-[#A17D49]"
    }`;

  const userInitial =
    currentUser?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    window.dispatchEvent(
      new CustomEvent("tivaro-toast", {
        detail: {
          type: "confirm",
          title: "Confirm Logout",
          message: "Are you sure you want to logout?",
          onConfirm: () => {
            clearCart();
            logout();
            closeMenu();
            navigate("/");
          },
        },
      })
    );
  };

  const actionIconClass =
    "relative flex items-center justify-center text-[#30251E] transition hover:text-[#A17D49]";

  const badgeClass =
    "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A17D49] px-1 text-[9px] font-medium text-white";

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9CBB7] bg-[#F4EFE5]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="font-serif text-2xl tracking-[0.25em] text-[#30251E]"
        >
          TIVARO
          <span className="mt-1 block text-[9px] tracking-[0.35em] text-[#A17D49]">
            THE VINTAGE COLLECTION
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={linkClass}>
            Shop
          </NavLink>

          {/* Collections Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button
              type="button"
              onClick={() =>
                setCollectionsOpen((previous) => !previous)
              }
              className="text-[11px] font-normal tracking-[0.18em] text-[#30251E] transition-colors hover:text-[#A17D49]"
            >
              <span className="flex items-center gap-2">
                Collections

                <ChevronDown
                  size={12}
                  className={`transition-transform ${
                    collectionsOpen ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>

            {collectionsOpen && (
              <div className="absolute left-0 top-full z-50 w-64 border border-[#D9CBB7] bg-[#F4EFE5] py-3 shadow-xl">
                {collections.map((collection) => (
                  <Link
                    key={collection}
                    to={`/products?collection=${encodeURIComponent(collection)}`}
                    onClick={closeMenu}
                    className="block px-5 py-3 text-xs tracking-wider text-[#6B5A4B] transition hover:bg-[#E5D8C5] hover:text-[#A17D49]"
                  >
                    {collection}
                  </Link>
                ))}

                <div className="my-2 border-t border-[#D9CBB7]" />

                <Link
                  to="/products"
                  onClick={closeMenu}
                  className="block px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#A17D49] hover:bg-[#E5D8C5]"
                >
                  View All Collections
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-7 lg:flex">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className={actionIconClass}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={21} strokeWidth={1.6} />
            {currentUser && wishlistCount > 0 && (
              <span className={badgeClass}>{wishlistCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className={actionIconClass}
            aria-label="Cart"
            title="Cart"
          >
            <ShoppingBag size={21} strokeWidth={1.6} />
            {currentUser && cartCount > 0 && (
              <span className={badgeClass}>{cartCount}</span>
            )}
          </Link>

          {/* Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((previous) => !previous)
                }
                className="flex items-center gap-2"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#A17D49] bg-[#E5D8C5] font-serif text-sm text-[#30251E]">
                  {userInitial}
                </div>

                <ChevronDown
                  size={14}
                  className={`text-[#766657] transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 border border-[#D9CBB7] bg-[#F4EFE5] shadow-xl">

                  {/* Profile Header */}
                  <div className="flex items-center gap-3 border-b border-[#D9CBB7] px-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A17D49] bg-[#E5D8C5] font-serif text-lg text-[#30251E]">
                      {userInitial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#30251E]">
                        {currentUser.name || "My Account"}
                      </p>

                      <p className="truncate text-[10px] text-[#766657]">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Links */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-5 py-3 text-xs text-[#30251E] transition hover:bg-[#E5D8C5] hover:text-[#A17D49]"
                    >
                      <UserRound size={17} strokeWidth={1.6} />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-5 py-3 text-xs text-[#30251E] transition hover:bg-[#E5D8C5] hover:text-[#A17D49]"
                    >
                      <Package size={17} strokeWidth={1.6} />
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={closeMenu}
                      className="flex items-center justify-between px-5 py-3 text-xs text-[#30251E] transition hover:bg-[#E5D8C5] hover:text-[#A17D49]"
                    >
                      <span className="flex items-center gap-3">
                        <Heart size={17} strokeWidth={1.6} />
                        My Wishlist
                      </span>

                      {wishlistCount > 0 && (
                        <span className="text-[10px] text-[#A17D49]">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[#D9CBB7] py-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-5 py-3 text-xs text-[#30251E] transition hover:bg-[#E5D8C5] hover:text-[#A17D49]"
                    >
                      <LogOut size={17} strokeWidth={1.6} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs tracking-wider text-[#30251E] transition hover:text-[#A17D49]"
            >
              Account
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-5 lg:hidden">
          <Link
            to="/wishlist"
            onClick={closeMenu}
            className={actionIconClass}
            aria-label="Wishlist"
          >
            <Heart size={21} strokeWidth={1.6} />
            {currentUser && wishlistCount > 0 && (
              <span className={badgeClass}>{wishlistCount}</span>
            )}
          </Link>

          <Link
            to="/cart"
            onClick={closeMenu}
            className={actionIconClass}
            aria-label="Cart"
          >
            <ShoppingBag size={21} strokeWidth={1.6} />
            {currentUser && cartCount > 0 && (
              <span className={badgeClass}>{cartCount}</span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="text-[#30251E]"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-[#D9CBB7] bg-[#F4EFE5] px-5 py-4 lg:hidden">

          {/* Mobile Profile Header */}
          {currentUser && (
            <div className="flex items-center gap-3 border-b border-[#D9CBB7] py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A17D49] bg-[#E5D8C5] font-serif text-lg text-[#30251E]">
                {userInitial}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#30251E]">
                  {currentUser.name || "My Account"}
                </p>

                <p className="truncate text-[10px] text-[#766657]">
                  {currentUser.email}
                </p>
              </div>
            </div>
          )}

          {/* Mobile Home */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block border-b border-[#D9CBB7] py-4 text-xs tracking-widest ${
                isActive ? "text-[#A17D49]" : "text-[#30251E]"
              }`
            }
          >
            Home
          </NavLink>

          {/* Mobile Shop */}
          <NavLink
            to="/products"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block border-b border-[#D9CBB7] py-4 text-xs tracking-widest ${
                isActive ? "text-[#A17D49]" : "text-[#30251E]"
              }`
            }
          >
            Shop
          </NavLink>

          {/* Mobile Collections */}
          <div className="border-b border-[#D9CBB7] py-3">
            <button
              type="button"
              onClick={() =>
                setCollectionsOpen((previous) => !previous)
              }
              className="flex w-full items-center justify-between py-2 text-[11px] tracking-widest text-[#30251E]"
            >
              Collections

              <ChevronDown
                size={12}
                className={`transition-transform ${
                  collectionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {collectionsOpen && (
              <div className="border-l border-[#D9CBB7] pl-4">
                {collections.map((collection) => (
                  <Link
                    key={collection}
                    to={`/products?collection=${encodeURIComponent(collection)}`}
                    onClick={closeMenu}
                    className="block py-3 text-xs text-[#6B5A4B] transition hover:text-[#A17D49]"
                  >
                    {collection}
                  </Link>
                ))}

                <Link
                  to="/products"
                  onClick={closeMenu}
                  className="block py-3 text-xs font-semibold text-[#A17D49]"
                >
                  View All Collections
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Profile Options */}
          {currentUser ? (
            <>
              <div className="border-b border-[#D9CBB7] py-3">
                <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[#A17D49]">
                  My Account
                </p>

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-3 text-xs text-[#30251E] hover:text-[#A17D49]"
                >
                  <UserRound size={17} />
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-3 text-xs text-[#30251E] hover:text-[#A17D49]"
                >
                  <Package size={17} />
                  My Orders
                </Link>

                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="flex items-center gap-3 py-3 text-xs text-[#30251E] hover:text-[#A17D49]"
                >
                  <Heart size={17} />
                  My Wishlist
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 py-4 text-xs tracking-widest text-[#30251E] transition hover:text-[#A17D49]"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="block py-4 text-xs tracking-widest text-[#30251E]"
            >
              Account / Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
