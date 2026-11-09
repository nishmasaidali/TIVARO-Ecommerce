
import { Link } from "react-router-dom";
import { useWishlist } from "../context/wishlistcontext";
import { useCart } from "../context/cartcontext";

function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  // Check wishlist data in Console
  console.log("Wishlist after login:", wishlist);
  console.log("Wishlist product count:", wishlist.length);

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1,
    });
  };

  if (wishlist.length === 0) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#F4EFE5] px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#A17D49]">
          TIVARO · Your Favourites
        </p>

        <h1 className="mt-5 font-serif text-4xl text-[#30251E]">
          Your Wishlist is Empty
        </h1>

        <p className="mt-4 max-w-md text-sm leading-7 text-[#766657]">
          Some things are simply too beautiful to forget.
          Save your favourite timepieces and find them here whenever you return.
        </p>

        <Link
          to="/products"
          className="mt-8 bg-[#30251E] px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#F4EFE5] transition hover:bg-[#6B5037]"
        >
          Discover Watches
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4EFE5] px-5 py-12 text-[#30251E] md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-10 border-b border-[#E0D4C3] pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A17D49]">
            TIVARO · Your Collection
          </p>

          <h1 className="mt-4 font-serif text-4xl md:text-5xl">
            Your Wishlist
          </h1>

          <p className="mt-3 text-sm text-[#766657]">
            A collection of timepieces worth remembering.
          </p>
        </div>

        {/* Wishlist count */}
        <div className="mb-7 flex items-center justify-between">
          <h2 className="font-serif text-xl">
            Saved Timepieces
          </h2>

          <span className="text-xs uppercase tracking-wider text-[#8A745D]">
            {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Wishlist Products */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group border border-[#E5D8C5] bg-[#FAF7F1] p-4 transition duration-300 hover:border-[#B08D57]"
            >
              {/* Product Image */}
              <Link
                to={`/products/${product.id}`}
                className="flex h-64 items-center justify-center overflow-hidden bg-[#EEE8DE] p-5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Product Details */}
              <div className="pt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A17D49]">
                  {product.brand || "TIVARO"}
                </p>

                <Link to={`/products/${product.id}`}>
                  <h3 className="mt-2 font-serif text-lg text-[#30251E] hover:text-[#A17D49]">
                    {product.name}
                  </h3>
                </Link>

                <p className="mt-3 font-serif text-lg text-[#49372A]">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                {/* Buttons */}
                <div className="mt-5 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#30251E] px-4 py-3 text-xs uppercase tracking-[0.15em] text-[#F4EFE5] transition hover:bg-[#6B5037]"
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-full border border-[#D8C9B5] px-4 py-3 text-xs uppercase tracking-[0.15em] text-[#8A745D] transition hover:border-[#9B6554] hover:text-[#9B6554]"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 border-t border-[#E0D4C3] pt-7">
          <Link
            to="/products"
            className="text-xs uppercase tracking-[0.15em] text-[#8A745D] transition hover:text-[#A17D49]"
          >
            ← Continue Exploring
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Wishlist;
