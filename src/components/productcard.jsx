
import { Link } from "react-router-dom";
import { useCart } from "../context/cartcontext";
import { useWishlist } from "../context/wishlistcontext";

function getProductUrl(product) {
  const productSlug = product.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `/products/${productSlug}-${product.id}`;
}

function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const saved = isInWishlist(product.id);
  const added = isInCart(product.id);
  const productUrl = getProductUrl(product);

  function toggleWishlist() {
    if (saved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  return (
    <div className="group">

      {/* Product image */}
      <div className="relative overflow-hidden border border-[#E5D8C5] bg-[#EEE8DE] p-5">

        <Link to={productUrl}>
          {product.newArrival && (
            <span className="absolute left-3 top-3 z-10 bg-[#A17D49] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white">
              New Arrival
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-64 w-full object-contain transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D8C5] bg-[#FAF7F1] shadow-sm transition hover:scale-110"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill={saved ? "#A17D49" : "none"}
            stroke={saved ? "#A17D49" : "#6B5A4B"}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </button>
      </div>

      {/* Product information */}
      <div className="px-1 pt-4">
        <Link to={productUrl}>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#A17D49]">
            {product.brand || "TIVARO"}
          </p>

          <h2 className="mt-2 font-serif text-lg text-[#30251E] transition group-hover:text-[#A17D49]">
            {product.name}
          </h2>

          <p className="mt-2 text-sm font-medium text-[#49372A]">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between border-t border-[#E5D8C5] pt-3">
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#766657]">
            {product.type || "Classic Collection"}
          </span>

          <Link
            to={productUrl}
            className="text-xs text-[#A17D49] transition hover:translate-x-1"
          >
            View Details →
          </Link>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          disabled={added}
          onClick={() => addToCart(product)}
          className={`mt-4 w-full border py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
            added
              ? "cursor-not-allowed border-[#A17D49] bg-[#E5D8C5] text-[#766657]"
              : "border-[#30251E] bg-[#30251E] text-[#F4EFE5] hover:bg-[#A17D49] hover:border-[#A17D49]"
          }`}
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
