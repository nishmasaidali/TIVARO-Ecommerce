
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authcontext";
import axiosInstance from "../api/axiosinstance";

function showToast(message, type = "success", title = "Notification") {
  window.dispatchEvent(
    new CustomEvent("tivaro-toast", {
      detail: { message, type, title },
    })
  );
}

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();

  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = Boolean(buyNowItem);

  const checkoutItems = isBuyNow ? [buyNowItem] : cart;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Cash on Delivery",
  });

  // Fetch the latest user profile from JSON Server
  const { data: profile } = useQuery({
    queryKey: ["user", currentUser?.id],

    queryFn: async () => {
      const response = await axiosInstance.get(
        `/users/${currentUser.id}`
      );

      return response.data;
    },

    enabled: Boolean(currentUser?.id),
    staleTime: 5 * 60 * 1000,
  });

  // Fill checkout form using the latest saved profile
  useEffect(() => {
    const userDetails = profile || currentUser;

    if (!userDetails) return;

    setFormData((previous) => ({
      ...previous,
      name: userDetails.name || "",
      email: userDetails.email || "",
      phone: userDetails.phone || "",
      address: userDetails.address || "",
      city: userDetails.city || "",
      pincode: userDetails.pincode || "",
    }));
  }, [profile, currentUser]);

  // Redirect if there are no products
  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate("/products", { replace: true });
    }
  }, [checkoutItems.length, navigate]);

  const totalItems = checkoutItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const total = checkoutItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!checkoutItems.length) {
      showToast("Your cart is empty.", "error", "Checkout Error");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      showToast(
        "Please fill in all delivery details.",
        "error",
        "Missing Details"
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      showToast(
        "Enter a valid 10-digit phone number.",
        "error",
        "Invalid Phone Number"
      );
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      showToast(
        "Enter a valid 6-digit PIN code.",
        "error",
        "Invalid PIN Code"
      );
      return;
    }

    setIsSubmitting(true);

    const updatedProducts = [];
    let orderCreated = false;

    try {
      // Combine duplicate products
      const combinedItems = checkoutItems.reduce((result, item) => {
        const existing = result.find(
          (product) => String(product.id) === String(item.id)
        );

        if (existing) {
          existing.quantity += Number(item.quantity || 1);
        } else {
          result.push({
            ...item,
            quantity: Number(item.quantity || 1),
          });
        }

        return result;
      }, []);

      // Verify the latest stock from JSON Server
      const verifiedItems = [];

      for (const item of combinedItems) {
        const response = await axiosInstance.get(
          `/products/${item.id}`
        );

        const latestProduct = response.data;
        const availableStock = Number(latestProduct.stock ?? 0);

        if (
          !Number.isFinite(availableStock) ||
          availableStock <= 0
        ) {
          throw new Error(
            `${item.name} is currently out of stock.`
          );
        }

        if (item.quantity > availableStock) {
          throw new Error(
            `Only ${availableStock} units of ${item.name} are available.`
          );
        }

        verifiedItems.push({
          ...latestProduct,
          quantity: item.quantity,
        });
      }

      // Deduct stock
      for (const item of verifiedItems) {
        const oldStock = Number(item.stock);

        await axiosInstance.patch(
          `/products/${item.id}`,
          {
            stock: oldStock - item.quantity,
          }
        );

        updatedProducts.push({
          id: item.id,
          oldStock,
        });
      }

      // Calculate order total
      const orderTotal = verifiedItems.reduce(
        (sum, item) =>
          sum + Number(item.price) * item.quantity,
        0
      );

      // Create order
      const order = {
        id: `TIV-${Date.now()}`,

        // Identify the customer
        userId: String(
          currentUser?.id ?? currentUser?.email ?? "guest"
        ),

        orderDate: new Date().toISOString(),

        status: "Pending",

        items: verifiedItems,

        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },

        paymentMethod: formData.paymentMethod,

        totalItems: verifiedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),

        total: orderTotal,

        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      // Save order to JSON Server
      const response = await axiosInstance.post(
        "/orders",
        order
      );

      // Get the saved order
      const savedOrder = response.data;

      // Order successfully created
      orderCreated = true;

      // Save a local copy for the Orders page
      const userKey = String(
        currentUser?.id ?? currentUser?.email ?? "guest"
      );

      const storageKey = `orders_${userKey}`;

      try {
        const existingOrders = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );

        localStorage.setItem(
          storageKey,
          JSON.stringify([savedOrder, ...existingOrders])
        );
      } catch {
        // The order is already saved in JSON Server
      }

      // Clear cart only for normal checkout
      if (!isBuyNow) {
        clearCart();
      }

      showToast(
        "Your order has been placed successfully!",
        "success",
        "Order Placed"
      );

      navigate("/orders");
    } catch (error) {
      // Restore stock only if order was not created
      if (!orderCreated) {
        for (const product of updatedProducts.reverse()) {
          try {
            await axiosInstance.patch(
              `/products/${product.id}`,
              {
                stock: product.oldStock,
              }
            );
          } catch {
            // Stock restoration may require manual attention
          }
        }
      }

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Unable to place your order. Please try again.",
        "error",
        "Order Failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!checkoutItems.length) {
    return null;
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#F4EFE5] px-4 py-3 text-[#30251E]">
      <div className="mx-auto flex min-h-[calc(100svh-104px)] max-w-6xl flex-col">

        {/* HEADER */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A17D49]">
              TIVARO · THE VINTAGE COLLECTION
            </p>

            <h1 className="mt-1 font-serif text-2xl sm:text-3xl">
              Checkout
            </h1>
          </div>

          <Link
            to="/products"
            className="text-[10px] font-semibold uppercase tracking-widest text-[#8A745D] transition hover:text-[#A17D49]"
          >
            Continue Shopping
          </Link>
        </div>

        {/* CHECKOUT CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="grid flex-1 gap-4 lg:grid-cols-[1.5fr_1fr]"
        >

          {/* DELIVERY DETAILS */}
          <section className="border border-[#D9CBB7] bg-[#F8F4EC] p-4 sm:p-5">

            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl">
                Delivery Details
              </h2>

              <span className="text-[9px] uppercase tracking-widest text-[#A17D49]">
                Step 01
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-3">

              {/* NAME */}
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-[#766657]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="h-10 w-full border border-[#D9CBB7] bg-[#F4EFE5] px-3 text-xs outline-none transition focus:border-[#A17D49]"
                />
              </div>

              {/* EMAIL */}
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-[#766657]">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="h-10 w-full border border-[#D9CBB7] bg-[#F4EFE5] px-3 text-xs outline-none transition focus:border-[#A17D49]"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-[#766657]">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  className="h-10 w-full border border-[#D9CBB7] bg-[#F4EFE5] px-3 text-xs outline-none transition focus:border-[#A17D49]"
                />
              </div>

              {/* PINCODE */}
              <div>
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-[#766657]">
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="6-digit PIN"
                  className="h-10 w-full border border-[#D9CBB7] bg-[#F4EFE5] px-3 text-xs outline-none transition focus:border-[#A17D49]"
                />
              </div>

              {/* ADDRESS */}
              <div className="col-span-2">
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-[#766657]">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="House name, street and landmark"
                  className="w-full resize-none border border-[#D9CBB7] bg-[#F4EFE5] px-3 py-2 text-xs outline-none transition focus:border-[#A17D49]"
                />
              </div>

              {/* CITY */}
              <div className="col-span-2">
                <label className="mb-1 block text-[9px] font-semibold uppercase tracking-widest text-[#766657]">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  className="h-10 w-full border border-[#D9CBB7] bg-[#F4EFE5] px-3 text-xs outline-none transition focus:border-[#A17D49]"
                />
              </div>

            </div>

            {/* PAYMENT */}
            <div className="mt-4 border-t border-[#D9CBB7] pt-3">
              <h3 className="mb-2 font-serif text-lg">
                Payment Method
              </h3>

              <label className="flex cursor-pointer items-center gap-3 border border-[#A17D49] bg-[#F4EFE5] p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    formData.paymentMethod === "Cash on Delivery"
                  }
                  onChange={handleChange}
                  className="accent-[#A17D49]"
                />

                <div>
                  <p className="text-xs font-semibold text-[#30251E]">
                    Cash on Delivery
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#766657]">
                    Pay when your order arrives.
                  </p>
                </div>
              </label>
            </div>

          </section>

          {/* ORDER SUMMARY */}
          <section className="flex flex-col border border-[#D9CBB7] bg-[#F8F4EC] p-4 sm:p-5">

            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl">
                Order Summary
              </h2>

              <span className="text-[9px] uppercase tracking-widest text-[#A17D49]">
                Step 02
              </span>
            </div>

            {/* PRODUCTS */}
            <div className="max-h-[220px] flex-1 space-y-3 overflow-y-auto pr-1">

              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b border-[#E5D8C5] pb-3"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#EEE8DE] p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-sm">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-[#766657]">
                      Quantity: {item.quantity || 1}
                    </p>

                    <p className="mt-1 text-xs font-medium">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <p className="shrink-0 text-xs font-semibold">
                    ₹{(
                      Number(item.price) *
                      Number(item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}

            </div>

            {/* TOTALS */}
            <div className="mt-3 space-y-2 border-t border-[#D9CBB7] pt-3">

              <div className="flex justify-between text-xs text-[#766657]">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-xs text-[#766657]">
                <span>Delivery</span>
                <span className="text-green-700">Free</span>
              </div>

              <div className="flex items-center justify-between border-t border-[#D9CBB7] pt-3">
                <span className="font-serif text-lg">
                  Total Amount
                </span>

                <span className="font-serif text-xl text-[#A17D49]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            {/* PLACE ORDER */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-[#30251E] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F4EFE5] transition hover:bg-[#A17D49] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Processing Order..."
                : "Place Order"}
            </button>

            <p className="mt-2 text-center text-[9px] text-[#8A745D]">
              Your timepiece will be delivered with care.
            </p>

          </section>

        </form>
      </div>
    </main>
  );
}

export default Checkout;
