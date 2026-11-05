
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#30251E] text-[#F4EFE5]">

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">

        {/* Brand */}
        <div>
          <Link
            to="/"
            className="inline-block font-serif text-3xl font-bold tracking-[0.2em] transition hover:text-[#C5A16A]"
          >
            TIVARO
          </Link>

          <p className="mt-3 text-[10px] tracking-[0.3em] text-[#C5A16A]">
            TIMELESS ELEGANCE
          </p>

          <p className="mt-5 max-w-xs text-sm leading-7 text-[#C8B9A7]">
            Discover timepieces inspired by timeless design,
            vintage craftsmanship and enduring elegance.
            Every watch carries a story of its own.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-6 font-serif text-xl">
            Explore
          </h3>

          <div className="flex flex-col gap-4 text-sm text-[#C8B9A7]">
            <Link
              to="/"
              className="transition hover:translate-x-1 hover:text-[#C5A16A]"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="transition hover:translate-x-1 hover:text-[#C5A16A]"
            >
              Shop All
            </Link>

            <Link
              to="/products?category=Men"
              className="transition hover:translate-x-1 hover:text-[#C5A16A]"
            >
              Men's Watches
            </Link>

            <Link
              to="/products?category=Women"
              className="transition hover:translate-x-1 hover:text-[#C5A16A]"
            >
              Women's Watches
            </Link>
          </div>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="mb-6 font-serif text-xl">
            Your Collection
          </h3>

          <div className="flex flex-col gap-4 text-sm text-[#C8B9A7]">
            <Link
              to="/wishlist"
              className="transition hover:translate-x-1 hover:text-[#C5A16A]"
            >
              My Wishlist
            </Link>

            <Link
              to="/cart"
              className="transition hover:translate-x-1 hover:text-[#C5A16A]"
            >
              Shopping Cart
            </Link>

            <Link
              to="/products"
              className="transition hover:translate-x-1 hover:text-[#C5A16A]"
            >
              Discover Collections
            </Link>
          </div>
        </div>

        {/* Brand Story */}
        <div>
          <h3 className="mb-6 font-serif text-xl">
            The TIVARO Story
          </h3>

          <p className="text-sm leading-7 text-[#C8B9A7]">
            More than a way to tell time. A reflection of
            personal style, treasured moments and timeless taste.
            Inspired by the beauty of classic watchmaking.
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#C5A16A]">
            Every second tells a story.
          </p>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#594638] px-6 py-7 text-center">
        <p className="text-xs tracking-wider text-[#C8B9A7]">
          © {new Date().getFullYear()} TIVARO. All rights reserved.
        </p>

        <p className="mt-2 text-[10px] tracking-[0.2em] text-[#A17D49]">
          CRAFTED FOR TIMELESS STYLE
        </p>
      </div>

    </footer>
  );
}

export default Footer;
