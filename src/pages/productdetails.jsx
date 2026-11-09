
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../context/cartcontext";
import { useWishlist } from "../context/wishlistcontext";
import { getProductById } from "../services/productservice";

function ProductDetails() {
  const { slug } = useParams();

  const id = slug.split("-").pop();

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  // Scroll to top when opening a product
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [slug]);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4EFE5]">
        <p className="font-serif text-xl italic text-[#A17D49]">
          Discovering your timepiece...
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4EFE5] px-6 text-center">
        <h2 className="font-serif text-4xl text-[#30251E]">
          Watch not found
        </h2>

        <Link
          to="/products"
          className="mt-6 bg-[#30251E] px-8 py-3 text-xs uppercase tracking-widest text-[#F4EFE5]"
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  const saved = isInWishlist(product.id);

  const stock = Number(product.stock ?? 0);
  const isOutOfStock = stock <= 0;

  function handleWishlist() {
    if (saved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  function handleAddToCart() {
    if (isOutOfStock || quantity > stock) {
      return;
    }

    addToCart({
      ...product,
      quantity,
    });
  }

  const specifications = [
    ["Brand", product.brand || "TIVARO"],
    ["Collection", product.collection || "Timeless Collection"],
    product.category && ["Category", product.category],
    product.type && ["Style", product.type],
    product.strap && ["Strap", product.strap],
    product.dial && ["Dial", product.dial],
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#F4EFE5] text-[#30251E]">

      {/* BREADCRUMB */}
      <div className="mx-auto max-w-7xl px-5 pt-2 md:px-10">
        <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#8A745D]">
          <Link to="/" className="hover:text-[#A17D49]">
            Home
          </Link>

          <span>/</span>

          <Link to="/products" className="hover:text-[#A17D49]">
            Collection
          </Link>

          <span>/</span>

          <span className="text-[#30251E]">
            {product.name}
          </span>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <section className="mx-auto grid max-w-7xl items-center gap-5 px-5 py-2 md:grid-cols-2 md:gap-8 md:px-10 md:py-2">

        {/* PRODUCT IMAGE */}
        <div>
          <div className="relative flex h-[240px] items-center justify-center border border-[#E5D8C5] bg-[#EAE1D4] p-4 sm:h-[300px] md:h-[340px]">

            {product.newArrival && (
              <span className="absolute left-4 top-4 bg-[#30251E] px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-[#F4EFE5]">
                New Arrival
              </span>
            )}

            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition duration-500 hover:scale-105"
            />

            <div className="absolute bottom-2 left-0 right-0 text-center">
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#8A745D]">
                TIVARO · TIMELESS COLLECTION
              </p>
            </div>
          </div>

          <div className="mt-2 flex justify-between border-b border-[#D9CBB7] pb-2">
            <p className="text-[9px] uppercase tracking-widest text-[#8A745D]">
              A TIMEPIECE TO REMEMBER
            </p>

            <p className="font-serif text-xs italic text-[#A17D49]">
              Timeless by Design
            </p>
          </div>
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="flex flex-col justify-center">

          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A17D49]">
            {product.brand || "TIVARO"}
          </p>

          <h1 className="mt-2 font-serif text-3xl leading-tight text-[#30251E] sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-2 font-serif text-2xl text-[#6B5037]">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          {/* STOCK STATUS */}
          <p className={`mt-2 text-sm font-semibold ${
            isOutOfStock ? "text-red-600" : "text-green-700"
          }`}>
            {isOutOfStock
              ? "Out of Stock"
              : `In Stock: ${stock}`}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#8A745D]">
            A timeless design for those who appreciate
            classic elegance and distinctive style.
          </p>

          {/* DESCRIPTION */}
          <div className="mt-2 border-t border-[#D9CBB7] pt-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A17D49]">
              ABOUT THIS TIMEPIECE
            </p>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#766657]">
              {product.description ||
                "Inspired by timeless watchmaking, this elegant timepiece brings together classic design and everyday sophistication."}
            </p>
          </div>

          {/* SPECIFICATIONS */}
          <div className="mt-2 border-y border-[#D9CBB7] py-2">

            <h2 className="mb-2 font-serif text-lg">
              Specifications
            </h2>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-xs">

              {specifications.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5"
                >
                  <span className="text-[9px] uppercase tracking-wider text-[#A17D49]">
                    {label}
                  </span>

                  <span className="text-[#49372A]">
                    {value}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* QUANTITY */}
          <div className="mt-2 flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#766657]">
              Quantity
            </span>

            <div className="flex items-center border border-[#D8C9B5]">

              <button
                type="button"
                disabled={isOutOfStock || quantity <= 1}
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                className="px-4 py-1.5 text-lg hover:bg-[#E5D8C5] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="min-w-10 text-center text-sm">
                {quantity}
              </span>

              <button
                type="button"
                disabled={isOutOfStock || quantity >= stock}
                onClick={() =>
                  setQuantity((current) => Math.min(stock, current + 1))
                }
                className="px-4 py-1.5 text-lg hover:bg-[#E5D8C5] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>
          </div>

          {/* ADD TO CART */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`mt-2 w-full px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
              isOutOfStock
                ? "cursor-not-allowed bg-[#D9CBB7] text-[#766657]"
                : "bg-[#30251E] text-[#F4EFE5] hover:bg-[#A17D49]"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : `Add to Cart — ₹${(
                  Number(product.price) * quantity
                ).toLocaleString("en-IN")}`}
          </button>

          {/* ADD TO WISHLIST */}
          <button
            type="button"
            onClick={handleWishlist}
            className="mt-2 flex w-full items-center justify-center gap-2 border border-[#B08D57] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#49372A] transition hover:bg-[#E5D8C5]"
          >
            <span className="text-base">
              {saved ? "♥" : "♡"}
            </span>

            {saved ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          {/* CONTINUE SHOPPING */}
          <Link
            to="/products"
            className="mt-2 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A745D] transition hover:text-[#A17D49]"
          >
            ← Continue Exploring
          </Link>

        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
