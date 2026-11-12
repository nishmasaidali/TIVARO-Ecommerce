
import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authcontext";
import axiosInstance from "../api/axiosinstance";
import { cancelOrderApi } from "../services/orderservice";

function showToast(message, type = "success", title = "Notification") {
  window.dispatchEvent(
    new CustomEvent("tivaro-toast", {
      detail: { message, type, title },
    })
  );
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
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const userKey = String(
    currentUser?.id ?? currentUser?.email ?? "guest"
  );

  const userEmail = currentUser?.email?.toLowerCase();

  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [cancelReason, setCancelReason] = useState({});
  const [openCancel, setOpenCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Reference to the scrollable orders section
  const ordersContainerRef = useRef(null);

  // Fetch orders from JSON Server
  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      setIsLoading(true);

      try {
        const response = await axiosInstance.get("/orders");

        const allOrders = Array.isArray(response.data)
          ? response.data
          : [];

        // Show only the current customer's orders
        const userOrders = allOrders.filter((order) => {
          const belongsToUser =
            String(order.userId || "") === userKey;

          const belongsToEmail =
            userEmail &&
            order.customer?.email?.toLowerCase() === userEmail;

          return belongsToUser || belongsToEmail;
        });

        // Latest orders first
        userOrders.sort((a, b) => {
          const dateA = new Date(
            a.orderDate || a.date || 0
          ).getTime();

          const dateB = new Date(
            b.orderDate || b.date || 0
          ).getTime();

          return dateB - dateA;
        });

        if (isMounted) {
          setOrders(userOrders);

          // Keep localStorage synchronized with JSON Server
          localStorage.setItem(
            `orders_${userKey}`,
            JSON.stringify(userOrders)
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);

        // Use localStorage if JSON Server is unavailable
        if (isMounted) {
          setOrders(getSavedOrders(userKey));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrders();
    setSelectedStatus("All");
    setCurrentPage(1);
    setOpenCancel(null);

    return () => {
      isMounted = false;
    };
  }, [userKey, userEmail]);

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (selectedStatus === "All") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === selectedStatus
    );
  }, [orders, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
  );

  const startIndex = (currentPage - 1) * ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  // Keep the current page valid when filtered orders decrease
  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    } else if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Change page
  function changePage(page) {
    setCurrentPage(page);

    ordersContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Update React state and localStorage
  function saveOrders(updatedOrders) {
    setOrders(updatedOrders);

    localStorage.setItem(
      `orders_${userKey}`,
      JSON.stringify(updatedOrders)
    );
  }

  // Cancel order in JSON Server
  async function cancelOrder(orderId) {
    const reason = cancelReason[orderId];

    if (!reason || !reason.trim()) {
      showToast(
        "Please enter a cancellation reason.",
        "error",
        "Missing Reason"
      );
      return;
    }

    const orderToCancel = orders.find(
      (order) => String(order.id) === String(orderId)
    );

    if (
      !orderToCancel ||
      orderToCancel.status === "Delivered" ||
      orderToCancel.status === "Cancelled"
    ) {
      showToast(
        "This order cannot be cancelled.",
        "error",
        "Cancellation Error"
      );
      return;
    }

    if (isCancelling) return;

    setIsCancelling(true);

    try {
      // Update order and restore product stock in db.json
      const updatedOrder = await cancelOrderApi(
        orderId,
        reason.trim()
      );

      // Refresh product data to show restored stock
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      // Update the displayed orders
      const updatedOrders = orders.map((order) =>
        String(order.id) === String(orderId)
          ? {
              ...order,
              ...updatedOrder,
            }
          : order
      );

      // Save the updated orders locally
      saveOrders(updatedOrders);

      setOpenCancel(null);

      setCancelReason((previous) => ({
        ...previous,
        [orderId]: "",
      }));

      showToast(
        "Your order has been cancelled successfully.",
        "success",
        "Order Cancelled"
      );
    } catch (error) {
      console.error("Cancellation error:", error);

      showToast(
        error.response?.status === 404
          ? "Order not found in db.json."
          : "Unable to cancel order. Please try again.",
        "error",
        "Cancellation Failed"
      );
    } finally {
      setIsCancelling(false);
    }
  }

  // Add previous order products to cart
  function reorder(order) {
    if (!Array.isArray(order.items)) {
      return;
    }

    order.items.forEach((product) => {
      addToCart(product);
    });

    showToast(
      "Products have been added to your cart.",
      "success",
      "Reorder"
    );
  }

  function formatDate(date) {
    if (!date) return "Not available";

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

  const statuses = [
    "All",
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <main className="flex h-[calc(100dvh-72px)] flex-col overflow-hidden bg-[#F4EFE5] px-4 py-5 text-[#30251E] sm:px-7 md:px-10 md:py-6">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col">

        {/* Heading */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E0D4C3] pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A17D49]">
              TIVARO · Your History
            </p>

            <h1 className="mt-1 font-serif text-3xl md:text-4xl">
              Your Orders
            </h1>

            <p className="mt-1 text-xs text-[#766657]">
              Follow every timeless piece from selection to delivery.
            </p>
          </div>

          <p className="hidden text-xs text-[#766657] sm:block">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </p>
        </div>

        {/* Status filters */}
        {orders.length > 0 && !isLoading && (
          <div className="mt-4 flex shrink-0 flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setSelectedStatus(status);
                  setCurrentPage(1);
                }}
                className={`border px-3 py-2 text-[10px] uppercase tracking-wider transition ${
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

        {/* Orders area */}
        <div
          ref={ordersContainerRef}
          className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1"
        >

          {/* Loading */}
          {isLoading && (
            <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-[#766657]">
              Loading your orders...
            </div>
          )}

          {/* No orders */}
          {!isLoading && orders.length === 0 && (
            <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A17D49]">
                Your TIVARO Story Begins Here
              </p>

              <h2 className="mt-3 font-serif text-3xl">
                No Orders Yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-[#766657]">
                Your selected timepieces will appear here once you place an order.
              </p>

              <Link
                to="/products"
                className="mt-5 bg-[#30251E] px-7 py-3 text-[10px] uppercase tracking-[0.2em] text-[#F4EFE5] transition hover:bg-[#A17D49]"
              >
                Explore Watches
              </Link>
            </div>
          )}

          {/* No matching orders */}
          {!isLoading &&
            orders.length > 0 &&
            filteredOrders.length === 0 && (
              <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-[#766657]">
                No orders found with this status.
              </div>
            )}

          {/* Order cards */}
          {!isLoading && filteredOrders.length > 0 && (
            <div className="space-y-4 pb-3">
              {currentOrders.map((order, index) => {
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
                    {/* Order heading */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5D8C5] px-4 py-3 md:px-5">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[#8A745D]">
                          Order ID
                        </p>

                        <h2 className="font-serif text-base">
                          {order.id || "Order"}
                        </h2>

                        <p className="text-[10px] text-[#766657]">
                          Placed on{" "}
                          {formatDate(
                            order.orderDate || order.date
                          )}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1.5 text-[9px] font-medium uppercase tracking-wider ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    {/* Products */}
                    <div className="divide-y divide-[#E5D8C5]">
                      {items.map((product, productIndex) => (
                        <div
                          key={product.id || productIndex}
                          className="flex items-center gap-3 px-4 py-3 md:px-5"
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#EEE8DE] p-2">
                            <img
                              src={product.image}
                              alt={product.name || "Watch"}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] uppercase tracking-wider text-[#A17D49]">
                              {product.brand || "TIVARO"}
                            </p>

                            <h3 className="truncate font-serif text-sm">
                              {product.name || "Watch"}
                            </h3>

                            <p className="mt-1 text-[10px] text-[#766657]">
                              Quantity: {Number(product.quantity) || 1}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-medium">
                            ₹
                            {(
                              Number(product.price) *
                              (Number(product.quantity) || 1)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order information */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5D8C5] bg-[#F4EFE5] px-4 py-3 md:px-5">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-[#8A745D]">
                            Payment
                          </p>

                          <p className="text-xs">
                            {order.paymentMethod || "Not available"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-[#8A745D]">
                            Total
                          </p>

                          <p className="text-xs font-semibold">
                            ₹
                            {Number(order.total || 0).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        {order.status !== "Cancelled" && (
                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-[#8A745D]">
                              Estimated Delivery
                            </p>

                            <p className="text-xs">
                              {formatDate(order.estimatedDelivery)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {canCancel && (
                          <button
                            type="button"
                            disabled={isCancelling}
                            onClick={() =>
                              setOpenCancel(
                                openCancel === order.id
                                  ? null
                                  : order.id
                              )
                            }
                            className="border border-[#9B6554] px-3 py-2 text-[9px] uppercase tracking-wider text-[#9B6554] transition hover:bg-[#9B6554] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel Order
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => reorder(order)}
                          className="border border-[#A17D49] px-3 py-2 text-[9px] uppercase tracking-wider text-[#6B5A4B] transition hover:bg-[#A17D49] hover:text-white"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>

                    {/* Cancellation form */}
                    {openCancel === order.id && canCancel && (
                      <div className="border-t border-[#E0D4C3] p-4">
                        <label className="text-[10px] uppercase tracking-wider text-[#766657]">
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
                          disabled={isCancelling}
                          className="mt-2 min-h-16 w-full border border-[#D8C9B5] bg-[#FAF7F1] p-2 text-sm outline-none focus:border-[#A17D49]"
                          placeholder="Enter your reason..."
                        />

                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isCancelling}
                            onClick={() => cancelOrder(order.id)}
                            className="bg-[#9B6554] px-4 py-2 text-[9px] uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isCancelling
                              ? "Cancelling..."
                              : "Confirm Cancellation"}
                          </button>

                          <button
                            type="button"
                            disabled={isCancelling}
                            onClick={() => setOpenCancel(null)}
                            className="border border-[#D8C9B5] px-4 py-2 text-[9px] uppercase tracking-wider"
                          >
                            Keep Order
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-6 pb-4">
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full border border-[#D9CBB7] px-7 py-3 text-sm text-[#30251E] transition hover:bg-[#30251E] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-sm text-[#766657]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full border border-[#D9CBB7] px-7 py-3 text-sm text-[#30251E] transition hover:bg-[#30251E] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Orders;
