
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axiosInstance from "../../../api/axiosinstance";

const AdminOrders = () => {
  const queryClient = useQueryClient();

  // States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 8;

  // Fetch orders
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const response = await axiosInstance.get("/orders");
      return response.data;
    },
  });

  // Update order status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return axiosInstance.patch(`/orders/${id}`, { status });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminOrders"],
      });
    },
  });

  // Handle status change
  const handleStatusChange = (id, status) => {
    statusMutation.mutate({ id, status });
  };

  // Search and filter orders
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      String(order.id).toLowerCase().includes(search) ||
      (order.customer?.name || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      (order.status || "Pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort orders by date
  const sortedOrders = [...filteredOrders].sort(
    (a, b) =>
      new Date(b.orderDate || b.date || 0) -
      new Date(a.orderDate || a.date || 0)
  );

  // Pagination
  const totalPages = Math.ceil(
    sortedOrders.length / ordersPerPage
  );

  const displayedPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const firstIndex = (displayedPage - 1) * ordersPerPage;
  const lastIndex = firstIndex + ordersPerPage;

  const currentOrders = sortedOrders.slice(
    firstIndex,
    lastIndex
  );

  // Loading state
  if (isLoading) {
    return (
      <p className="text-[#766657]">
        Loading orders...
      </p>
    );
  }

  // Error state
  if (isError) {
    return (
      <p className="text-red-600">
        Failed to load orders.
      </p>
    );
  }

  return (
    <div>
      {/* Page Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-semibold text-[#30251E]">
          Order Management
        </h2>

        <p className="text-sm text-[#766657] mt-2">
          View and manage all customer orders.
        </p>
      </div>

      {/* Search and Status Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by order ID or customer name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-3 border border-[#D9CBB7] rounded-lg outline-none focus:border-[#A17D49]"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 border border-[#D9CBB7] rounded-lg outline-none focus:border-[#A17D49]"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#D9CBB7] overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F4EFE5]">
            <tr>
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Items</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-[#766657]"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[#E5D8C5] hover:bg-[#FAF8F4]"
                >
                  <td className="px-5 py-4">
                    {order.id}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-[#30251E]">
                      {order.customer?.name || "Unknown"}
                    </p>

                    <p className="text-xs text-[#766657]">
                      {order.customer?.email || "No email"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {order.orderDate || order.date
                      ? new Date(
                          order.orderDate || order.date
                        ).toLocaleDateString("en-IN")
                      : "N/A"}
                  </td>

                  <td className="px-5 py-4">
                    {order.totalItems || 0}
                  </td>

                  <td className="px-5 py-4">
                    ₹
                    {Number(order.total || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value
                        )
                      }
                      disabled={statusMutation.isPending}
                      className="border border-[#D9CBB7] rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#A17D49] font-medium hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Search Result Count */}
      <p className="text-sm text-[#766657] mt-4">
        Showing {currentOrders.length} of {sortedOrders.length} orders
      </p>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-5 mt-6">
          <button
            onClick={() =>
              setCurrentPage(displayedPage - 1)
            }
            disabled={displayedPage === 1}
            className="px-4 py-2 border border-[#D9CBB7] rounded-lg text-[#30251E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4EFE5]"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-[#30251E]">
            Page {displayedPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage(displayedPage + 1)
            }
            disabled={displayedPage === totalPages}
            className="px-4 py-2 border border-[#D9CBB7] rounded-lg text-[#30251E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4EFE5]"
          >
            Next
          </button>
        </div>
      )}

      {/* Mutation Messages */}
      {statusMutation.isPending && (
        <p className="mt-3 text-sm text-[#766657]">
          Updating order status...
        </p>
      )}

      {statusMutation.isError && (
        <p className="mt-3 text-sm text-red-600">
          Failed to update order status.
        </p>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

            {/* Modal Heading */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-semibold text-[#30251E]">
                Order Details
              </h3>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl text-[#766657] hover:text-[#30251E]"
              >
                &times;
              </button>
            </div>

            {/* Order Information */}
            <div className="mb-6">
              <h4 className="font-semibold text-[#30251E] mb-3">
                Order Information
              </h4>

              <p className="text-sm text-[#766657] mb-2">
                Order ID: {selectedOrder.id}
              </p>

              <p className="text-sm text-[#766657] mb-2">
                Date:{" "}
                {selectedOrder.orderDate || selectedOrder.date
                  ? new Date(
                      selectedOrder.orderDate || selectedOrder.date
                    ).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>

              <p className="text-sm text-[#766657] mb-2">
                Payment Method: {selectedOrder.paymentMethod || "N/A"}
              </p>

              <p className="text-sm text-[#766657]">
                Status: {selectedOrder.status || "Pending"}
              </p>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h4 className="font-semibold text-[#30251E] mb-3">
                Customer Information
              </h4>

              <p className="text-sm text-[#766657] mb-2">
                Name: {selectedOrder.customer?.name || "Unknown"}
              </p>

              <p className="text-sm text-[#766657] mb-2">
                Email: {selectedOrder.customer?.email || "N/A"}
              </p>

              <p className="text-sm text-[#766657] mb-2">
                Phone: {selectedOrder.customer?.phone || "N/A"}
              </p>

              <p className="text-sm text-[#766657]">
                Address:{" "}
                {[
                  selectedOrder.customer?.address,
                  selectedOrder.customer?.city,
                  selectedOrder.customer?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </p>
            </div>

            {/* Ordered Products */}
            <div className="mb-6">
              <h4 className="font-semibold text-[#30251E] mb-3">
                Ordered Products
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#F4EFE5]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(selectedOrder.items || []).map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-t border-[#E5D8C5]"
                      >
                        <td className="p-3">
                          {item.name || "Product"}
                        </td>

                        <td className="p-3">
                          ₹
                          {Number(item.price || 0).toLocaleString("en-IN")}
                        </td>

                        <td className="p-3">
                          {item.quantity || 0}
                        </td>

                        <td className="p-3">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t border-[#D9CBB7] pt-4 flex justify-between">
              <span className="font-semibold text-[#30251E]">
                Total Amount
              </span>

              <span className="font-semibold text-[#A17D49]">
                ₹
                {Number(selectedOrder.total || 0).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full bg-[#30251E] text-white py-3 rounded-lg hover:bg-[#4A392E]"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
