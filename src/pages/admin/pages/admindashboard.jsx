
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../../../api/axiosinstance";

const AdminDashboard = () => {
  // Fetch dashboard data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboard"],

    queryFn: async () => {
      const [products, users, orders] = await Promise.all([
        axiosInstance.get("/products"),
        axiosInstance.get("/users"),
        axiosInstance.get("/orders"),
      ]);

      return {
        products: products.data,
        users: users.data,
        orders: orders.data,
      };
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <p className="text-[#766657]">
        Loading dashboard...
      </p>
    );
  }

  // Error state
  if (isError) {
    return (
      <p className="text-red-600">
        Failed to load dashboard data.
      </p>
    );
  }

  // Statistics
  const stats = [
    {
      title: "Total Products",
      count: data.products.length,
    },
    {
      title: "Total Users",
      count: data.users.length,
    },
    {
      title: "Total Orders",
      count: data.orders.length,
    },
    {
      title: "Pending Orders",
      count: data.orders.filter(
        (order) => order.status === "Pending"
      ).length,
    },
  ];

  // Low stock products (5 or fewer)
  const lowStockProducts = data.products.filter(
    (product) => Number(product.stock) <= 5
  );

  // Recent 5 orders
  const recentOrders = [...data.orders]
    .sort(
      (a, b) =>
        new Date(b.orderDate || b.date || 0) -
        new Date(a.orderDate || a.date || 0)
    )
    .slice(0, 5);

  // Status colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-semibold text-[#30251E]">
          Welcome to TIVARO
        </h2>

        <p className="text-[#766657] mt-2">
          Here's an overview of your store.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 rounded-xl border border-[#D9CBB7] shadow-sm"
          >
            <p className="text-sm text-[#766657]">
              {item.title}
            </p>

            <h3 className="text-3xl font-semibold text-[#30251E] mt-3">
              {item.count}
            </h3>
          </div>
        ))}

      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#30251E] mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <Link
            to="/admin/products"
            className="bg-white border border-[#D9CBB7] text-[#30251E] p-5 rounded-xl shadow-sm hover:border-[#A17D49] hover:shadow-md transition"
          >
            <p className="font-semibold text-[#30251E]">
              Manage Products
            </p>

            <p className="text-sm text-[#766657] mt-2">
              Add, edit and delete products.
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white border border-[#D9CBB7] text-[#30251E] p-5 rounded-xl shadow-sm hover:border-[#A17D49] hover:shadow-md transition"
          >
            <p className="font-semibold text-[#30251E]">
              Manage Users
            </p>

            <p className="text-sm text-[#766657] mt-2">
              View and manage customers.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white border border-[#D9CBB7] text-[#30251E] p-5 rounded-xl shadow-sm hover:border-[#A17D49] hover:shadow-md transition"
          >
            <p className="font-semibold text-[#30251E]">
              Manage Orders
            </p>

            <p className="text-sm text-[#766657] mt-2">
              View and track customer orders.
            </p>
          </Link>

        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-white rounded-xl border border-[#D9CBB7] p-6 mb-8">

        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-[#30251E]">
            Low Stock Products
          </h3>

          <span className="text-sm text-[#A17D49]">
            {lowStockProducts.length} Products
          </span>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-[#766657]">
            All products have sufficient stock.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F4EFE5]">
                <tr>
                  <th className="p-3 text-sm text-[#30251E]">Product</th>
                  <th className="p-3 text-sm text-[#30251E]">Brand</th>
                  <th className="p-3 text-sm text-[#30251E]">Stock</th>
                  <th className="p-3 text-sm text-[#30251E]">Status</th>
                </tr>
              </thead>

              <tbody>
                {lowStockProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-[#E5D8C5]"
                  >
                    <td className="p-3 text-sm text-[#30251E]">
                      {product.name}
                    </td>

                    <td className="p-3 text-sm text-[#766657]">
                      {product.brand}
                    </td>

                    <td className="p-3 text-sm text-[#30251E]">
                      {product.stock}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          Number(product.stock) === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {Number(product.stock) === 0
                          ? "Out of Stock"
                          : "Low Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[#D9CBB7] p-6">

        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-[#30251E]">
            Recent Orders
          </h3>

          <Link
            to="/admin/orders"
            className="text-sm text-[#A17D49] hover:underline"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#766657]">
            No orders available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F4EFE5]">
                <tr>
                  <th className="p-3 text-sm text-[#30251E]">Order ID</th>
                  <th className="p-3 text-sm text-[#30251E]">Customer</th>
                  <th className="p-3 text-sm text-[#30251E]">Date</th>
                  <th className="p-3 text-sm text-[#30251E]">Amount</th>
                  <th className="p-3 text-sm text-[#30251E]">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#E5D8C5]"
                  >
                    <td className="p-3 text-sm text-[#30251E]">
                      {order.id}
                    </td>

                    <td className="p-3 text-sm text-[#30251E]">
                      {order.customer?.name || "Unknown"}
                    </td>

                    <td className="p-3 text-sm text-[#766657]">
                      {order.orderDate || order.date
                        ? new Date(
                            order.orderDate || order.date
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>

                    <td className="p-3 text-sm text-[#30251E]">
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
                          order.status || "Pending"
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;
