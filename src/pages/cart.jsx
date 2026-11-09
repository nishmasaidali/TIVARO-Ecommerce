
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
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-[#F4EFE5] px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#A17D49]">
          TIVARO · Your Collection
        </p>

        <h1 className="mt-4 font-serif text-4xl text-[#30251E]">
          Your Cart is Empty
        </h1>

        <p className="mt-3 max-w-md text-sm leading-7 text-[#766657]">
          Every timeless collection begins with a special choice.
          Discover a watch that deserves a place in yours.
        </p>

        <Link
          to="/products"
          className="mt-6 bg-[#30251E] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#A17D49]"
        >
          Explore the Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#F4EFE5] px-5 py-5 text-[#30251E] md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-5 flex items-end justify-between border-b border-[#E0D4C3] pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#A17D49]">
              TIVARO · Your Selection
            </p>

            <h1 className="mt-2 font-serif text-3xl md:text-4xl">
              Your Shopping Bag
            </h1>

            <p className="mt-1 text-xs text-[#766657]">
              Timeless pieces, thoughtfully selected.
            </p>
          </div>

          <span className="pb-1 text-xs text-[#8A745D]">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1fr_310px]">

          {/* Cart Products */}
          <section>
            <h2 className="mb-3 font-serif text-lg">
              Selected Timepieces
            </h2>

            <div className="max-h-[390px] space-y-3 overflow-y-auto pr-1">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 border border-[#E5D8C5] bg-[#FAF7F1] p-3"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${product.id}`}
                    className="flex h-24 w-24 shrink-0 items-center justify-center bg-[#EEE8DE] p-2"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#A17D49]">
                      {product.brand || "TIVARO"}
                    </p>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="mt-1 font-serif text-base text-[#30251E] hover:text-[#A17D49]">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-1 text-xs text-[#766657]">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-[#D8C9B5]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, "decrease")
                          }
                          className="px-2 py-1 text-sm hover:bg-[#E5D8C5]"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="min-w-7 text-center text-xs">
                          {product.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, "increase")
                          }
                          className="px-2 py-1 text-sm hover:bg-[#E5D8C5]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-[10px] uppercase tracking-wider text-[#9B6554] hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="shrink-0 text-right">
                    <p className="text-[9px] uppercase tracking-wider text-[#8A745D]">
                      Subtotal
                    </p>

                    <p className="mt-1 font-serif text-sm">
                      ₹{(
                        Number(product.price) * product.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="mt-4 inline-block text-[10px] uppercase tracking-[0.15em] text-[#8A745D] transition hover:text-[#A17D49]"
            >
              ← Continue Shopping
            </Link>
          </section>

          {/* Order Summary */}
          <aside className="border border-[#D8C9B5] bg-[#EEE8DE] p-5">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#A17D49]">
              TIVARO
            </p>

            <h2 className="mt-2 font-serif text-xl">
              Order Summary
            </h2>

            <div className="my-4 border-t border-[#D8C9B5]" />

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#766657]">Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#766657]">Subtotal</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-[#766657]">Shipping</span>
                <span className="text-right text-[#A17D49]">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-[#D8C9B5]" />

            <div className="flex items-center justify-between">
              <span className="font-serif text-base">Total</span>

              <span className="font-serif text-lg">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-5 w-full bg-[#30251E] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#F4EFE5] transition hover:bg-[#6B5037]"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-[#8A745D]">
              A timeless choice deserves a thoughtful experience.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;
