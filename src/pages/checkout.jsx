import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useCart } from "../context/cartcontext";

function getCurrentUserKey() {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
      return String(user.id || user.email);
    }

    return "guest";
  } catch {
    return "guest";
  }
}

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, clearCart } = useCart();

  // Product received from the Buy Now button
  const buyNowItem = location.state?.buyNowItem;

  // Use the Buy Now product if available; otherwise use the cart
  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  const total = checkoutItems.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * (Number(item.quantity) || 1),
    0
  );

  const totalItems = checkoutItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (checkoutItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/products");
      return;
    }

    const userKey = getCurrentUserKey();

    const newOrder = {
      id: `TIV-${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: "Pending",
      items: checkoutItems.map((item) => ({ ...item })),
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
      paymentMethod: formData.paymentMethod,
      totalItems,
      total,
      estimatedDelivery: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem(`orders_${userKey}`) || "[]"
      );

      const orders = Array.isArray(savedOrders) ? savedOrders : [];

      localStorage.setItem(
        `orders_${userKey}`,
        JSON.stringify([newOrder, ...orders])
      );

      // Clear cart only for normal cart checkout
      // Do not clear it for Buy Now
      if (!buyNowItem) {
        clearCart();
      }

      alert("Your order has been placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Unable to place your order. Please try again.");
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F4EFE5] px-5 py-24 text-center text-[#30251E]">
        <h1 className="font-serif text-3xl">Your Cart Is Empty</h1>

        <p className="mt-4 text-sm text-[#766657]">
          Add a timepiece before proceeding to checkout.
        </p>

        <Link
          to="/products"
          className="mt-8 inline-block bg-[#30251E] px-8 py-4 text-xs uppercase tracking-widest text-white"
        >
          Explore Watches
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4EFE5] px-5 py-12 text-[#30251E] md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="border-b border-[#E0D4C3] pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A17D49]">
            TIVARO · Secure Checkout
          </p>

          <h1 className="mt-4 font-serif text-4xl md:text-5xl">
            Complete Your Order
          </h1>

          <p className="mt-3 text-sm text-[#766657]">
            Just a few details before your timepiece reaches you.
          </p>

          {buyNowItem && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#A17D49]">
              Direct Purchase · Buy Now
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-10 lg:grid-cols-3"
        >

          {/* Customer Details */}
          <div className="space-y-6 lg:col-span-2">
            <div className="border border-[#E0D4C3] bg-[#FAF7F1] p-6 md:p-8">
              <h2 className="font-serif text-2xl">
                Delivery Information
              </h2>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-[#766657]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="mt-2 w-full border border-[#D8C9B5] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A17D49]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#766657]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    className="mt-2 w-full border border-[#D8C9B5] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A17D49]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#766657]">
                    PIN Code
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    className="mt-2 w-full border border-[#D8C9B5] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A17D49]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-[#766657]">
                    Full Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House name, street, landmark..."
                    required
                    rows={3}
                    className="mt-2 w-full border border-[#D8C9B5] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A17D49]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-[#766657]">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    className="mt-2 w-full border border-[#D8C9B5] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#A17D49]"
                  />
                </div>

              </div>
            </div>

            {/* Payment */}
            <div className="border border-[#E0D4C3] bg-[#FAF7F1] p-6 md:p-8">
              <h2 className="font-serif text-2xl">
                Payment Method
              </h2>

              <label className="mt-6 flex cursor-pointer items-center gap-3 border border-[#D8C9B5] p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === "Cash on Delivery"}
                  onChange={handleChange}
                  className="accent-[#A17D49]"
                />

                <div>
                  <p className="text-sm font-medium">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-[#766657]">
                    Pay when your order arrives.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="border border-[#E0D4C3] bg-[#FAF7F1] p-6">
              <h2 className="font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-6 space-y-5">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#EEE8DE] p-2">
                      <img
                        src={item.image}
                        alt={item.name || "Watch"}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-sm">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[#766657]">
                        Qty: {Number(item.quantity) || 1}
                      </p>
                    </div>

                    <p className="text-sm">
                      ₹
                      {(
                        Number(item.price || 0) *
                        (Number(item.quantity) || 1)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-4 border-t border-[#E0D4C3] pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#766657]">
                    Total Items
                  </span>

                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#766657]">
                    Delivery
                  </span>

                  <span>Free</span>
                </div>

                <div className="flex justify-between border-t border-[#E0D4C3] pt-4">
                  <span className="font-medium">Grand Total</span>

                  <span className="font-serif text-xl">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 w-full bg-[#30251E] px-5 py-4 text-xs uppercase tracking-[0.2em] text-[#F4EFE5] transition hover:bg-[#A17D49]"
              >
                Place Order
              </button>

              <Link
                to="/cart"
                className="mt-5 block text-center text-xs uppercase tracking-wider text-[#766657] hover:text-[#A17D49]"
              >
                Return to Cart
              </Link>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}

export default Checkout;