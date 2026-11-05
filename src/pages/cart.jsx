
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartcontext";

function Cart() {
  const navigate = useNavigate();

  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (sum, product) =>
      sum + Number(product.price) * product.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#F4EFE5] px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#A17D49]">
          TIVARO · Your Collection
        </p>

        <h1 className="mt-5 font-serif text-4xl text-[#30251E]">
          Your Cart is Empty
        </h1>

        <p className="mt-4 max-w-md text-sm leading-7 text-[#766657]">
          Every timeless collection begins with a special choice.
          Discover a watch that deserves a place in yours.
        </p>

        <Link
          to="/products"
          className="mt-8 bg-[#30251E] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#A17D49]"
        >
          Explore the Collection
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
            TIVARO · Your Selection
          </p>

          <h1 className="mt-4 font-serif text-4xl md:text-5xl">
            Your Shopping Bag
          </h1>

          <p className="mt-3 text-sm text-[#766657]">
            Timeless pieces, thoughtfully selected.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">

          {/* Cart Products */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl">
                Selected Timepieces
              </h2>

              <span className="text-xs uppercase tracking-wider text-[#8A745D]">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="space-y-5">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-5 border border-[#E5D8C5] bg-[#FAF7F1] p-4 sm:flex-row sm:items-center sm:p-5"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${product.id}`}
                    className="flex h-36 w-full shrink-0 items-center justify-center bg-[#EEE8DE] p-3 sm:w-36"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#A17D49]">
                      {product.brand || "TIVARO"}
                    </p>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="mt-2 font-serif text-xl text-[#30251E] hover:text-[#A17D49]">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm text-[#766657]">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center border border-[#D8C9B5]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, "decrease")
                          }
                          className="px-3 py-2 text-[#49372A] hover:bg-[#E5D8C5]"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="min-w-9 text-center text-sm">
                          {product.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, "increase")
                          }
                          className="px-3 py-2 text-[#49372A] hover:bg-[#E5D8C5]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs uppercase tracking-wider text-[#9B6554] hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Product Subtotal */}
                  <div className="sm:text-right">
                    <p className="text-[10px] uppercase tracking-wider text-[#8A745D]">
                      Subtotal
                    </p>

                    <p className="mt-2 font-serif text-lg text-[#49372A]">
                      ₹
                      {(
                        Number(product.price) * product.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="mt-7 inline-block text-xs uppercase tracking-[0.15em] text-[#8A745D] transition hover:text-[#A17D49]"
            >
              ← Continue Shopping
            </Link>
          </section>

          {/* Order Summary */}
          <aside className="h-fit border border-[#D8C9B5] bg-[#EEE8DE] p-6 md:p-7">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A17D49]">
              TIVARO
            </p>

            <h2 className="mt-3 font-serif text-2xl text-[#30251E]">
              Order Summary
            </h2>

            <div className="my-7 border-t border-[#D8C9B5]" />

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[#766657]">
                  Items
                </span>

                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#766657]">
                  Subtotal
                </span>

                <span>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#766657]">
                  Shipping
                </span>

                <span className="text-[#A17D49]">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-[#D8C9B5]" />

            <div className="flex items-center justify-between">
              <span className="font-serif text-lg">
                Total
              </span>

              <span className="font-serif text-xl text-[#30251E]">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Checkout */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-7 w-full bg-[#30251E] px-5 py-4 text-xs uppercase tracking-[0.2em] text-[#F4EFE5] transition hover:bg-[#6B5037]"
            >
              Proceed to Checkout
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-[#8A745D]">
              A timeless choice deserves a thoughtful experience.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;
