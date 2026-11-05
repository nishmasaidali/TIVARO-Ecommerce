import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

function getSavedOrders(userKey) {
  try {
    const savedOrders = localStorage.getItem(`orders_${userKey}`);
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];

    return Array.isArray(parsedOrders) ? parsedOrders : [];
  } catch {
    return [];
  }
}

function Orders() {
  const { addToCart } = useCart();

  const [userKey, setUserKey] = useState(getCurrentUserKey);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [cancelReason, setCancelReason] = useState({});
  const [openCancel, setOpenCancel] = useState(null);

  // Update orders when user logs in or logs out
  useEffect(() => {
    function handleUserChange() {
      setUserKey(getCurrentUserKey());
      setOpenCancel(null);
    }

    window.addEventListener("authChanged", handleUserChange);

    return () => {
      window.removeEventListener("authChanged", handleUserChange);
    };
  }, []);

  // Load current user's orders
  useEffect(() => {
    setOrders(getSavedOrders(userKey));
    setSelectedStatus("All");
  }, [userKey]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (selectedStatus === "All") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === selectedStatus
    );
  }, [orders, selectedStatus]);

  // Save orders
  function saveOrders(updatedOrders) {
    setOrders(updatedOrders);

    localStorage.setItem(
      `orders_${userKey}`,
      JSON.stringify(updatedOrders)
    );
  }

  // Cancel order
  function cancelOrder(orderId) {
    const reason = cancelReason[orderId];

    if (!reason || !reason.trim()) {
      alert("Please enter a cancellation reason.");
      return;
    }

    const orderToCancel = orders.find(
      (order) => order.id === orderId
    );

    if (
      !orderToCancel ||
      orderToCancel.status === "Delivered" ||
      orderToCancel.status === "Cancelled"
    ) {
      alert("This order cannot be cancelled.");
      return;
    }

    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: "Cancelled",
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason.trim(),
          }
        : order
    );

    saveOrders(updatedOrders);

    setOpenCancel(null);

    setCancelReason((previous) => ({
      ...previous,
      [orderId]: "",
    }));
  }

  // Reorder products
  function reorder(order) {
    if (!Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((product) => {
      addToCart(product);
    });

    alert("Products have been added to your cart.");
  }

  // Format date
  function formatDate(date) {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Status style
  function getStatusClass(status) {
    switch (status) {
      case "Pending":
        return "bg-[#E8DDC7] text-[#7A5C2E]";

      case "Confirmed":
        return "bg-[#DCE8D8] text-[#48653B]";

      case "Shipped":
        return "bg-[#DCE4EE] text-[#3F5F7A]";

      case "Delivered":
        return "bg-[#D8E8DF] text-[#35634B]";

      case "Cancelled":
        return "bg-[#F0D9D4] text-[#8B4A3B]";

      default:
        return "bg-[#E5D8C5] text-[#6B5A4B]";
    }
  }

  return (
    <main className="min-h-screen bg-[#F4EFE5] px-5 py-12 text-[#30251E] md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">

        <div className="border-b border-[#E0D4C3] pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#A17D49]">
            TIVARO · Your History
          </p>

          <h1 className="mt-4 font-serif text-4xl md:text-5xl">
            Your Orders
          </h1>

          <p className="mt-3 text-sm text-[#766657]">
            Follow every timeless piece from selection to delivery.
          </p>
        </div>

        {orders.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "All",
              "Pending",
              "Confirmed",
              "Shipped",
              "Delivered",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`border px-4 py-2 text-xs uppercase tracking-wider transition ${
                  selectedStatus === status
                    ? "border-[#30251E] bg-[#30251E] text-[#F4EFE5]"
                    : "border-[#D8C9B5] text-[#6B5A4B] hover:border-[#A17D49]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {orders.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A17D49]">
              Your TIVARO Story Begins Here
            </p>

            <h2 className="mt-5 font-serif text-3xl">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#766657]">
              Your selected timepieces will appear here once you place an order.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block bg-[#30251E] px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#F4EFE5] transition hover:bg-[#A17D49]"
            >
              Explore Watches
            </Link>
          </div>
        )}

        {orders.length > 0 && filteredOrders.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-[#766657]">
              No orders found with this status.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-8">
          {filteredOrders.map((order, index) => {
            const items = Array.isArray(order.items)
              ? order.items
              : [];

            const canCancel =
              order.status !== "Delivered" &&
              order.status !== "Cancelled";

            return (
              <article
                key={order.id || index}
                className="border border-[#E0D4C3] bg-[#FAF7F1]"
              >
                <div className="flex flex-col gap-4 border-b border-[#E5D8C5] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A745D]">
                      Order
                    </p>

                    <h2 className="mt-1 font-serif text-lg">
                      {order.id || "Order"}
                    </h2>

                    <p className="mt-1 text-xs text-[#766657]">
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>

                  <span
                    className={`w-fit px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="divide-y divide-[#E5D8C5]">
                  {items.map((product, productIndex) => (
                    <div
                      key={product.id || productIndex}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center md:px-7"
                    >
                      <div className="flex h-24 w-full shrink-0 items-center justify-center bg-[#EEE8DE] p-3 sm:w-24">
                        <img
                          src={product.image}
                          alt={product.name || "Watch"}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#A17D49]">
                          {product.brand || "TIVARO"}
                        </p>

                        <h3 className="mt-1 font-serif text-lg">
                          {product.name || "Watch"}
                        </h3>

                        <p className="mt-2 text-xs text-[#766657]">
                          Quantity: {Number(product.quantity) || 1}
                        </p>
                      </div>

                      <p className="font-serif text-base">
                        ₹
                        {(
                          Number(product.price) *
                          (Number(product.quantity) || 1)
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E5D8C5] bg-[#F4EFE5] p-5 md:px-7">
                  <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#8A745D]">
                        Payment
                      </p>
                      <p className="mt-1">
                        {order.paymentMethod || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#8A745D]">
                        Total
                      </p>
                      <p className="mt-1 font-medium">
                        ₹{Number(order.total || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {order.status !== "Cancelled" && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8A745D]">
                          Estimated Delivery
                        </p>
                        <p className="mt-1">
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setOpenCancel(order.id)}
                        className="border border-[#9B6554] px-5 py-3 text-xs uppercase tracking-wider text-[#9B6554] transition hover:bg-[#9B6554] hover:text-white"
                      >
                        Cancel Order
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => reorder(order)}
                      className="border border-[#A17D49] px-5 py-3 text-xs uppercase tracking-wider text-[#6B5A4B] transition hover:bg-[#A17D49] hover:text-white"
                    >
                      Reorder
                    </button>
                  </div>

                  {openCancel === order.id && canCancel && (
                    <div className="mt-6 border-t border-[#E0D4C3] pt-5">
                      <label className="text-xs uppercase tracking-wider text-[#766657]">
                        Why are you cancelling this order?
                      </label>

                      <textarea
                        value={cancelReason[order.id] || ""}
                        onChange={(event) =>
                          setCancelReason((previous) => ({
                            ...previous,
                            [order.id]: event.target.value,
                          }))
                        }
                        className="mt-3 min-h-24 w-full border border-[#D8C9B5] bg-[#FAF7F1] p-3 text-sm outline-none"
                        placeholder="Enter your reason..."
                      />

                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => cancelOrder(order.id)}
                          className="bg-[#9B6554] px-5 py-3 text-xs uppercase tracking-wider text-white"
                        >
                          Confirm Cancellation
                        </button>

                        <button
                          type="button"
                          onClick={() => setOpenCancel(null)}
                          className="border border-[#D8C9B5] px-5 py-3 text-xs uppercase tracking-wider"
                        >
                          Keep Order
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Orders;