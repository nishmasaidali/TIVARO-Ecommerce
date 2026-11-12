
import axiosInstance from "../api/axiosinstance";

export const cancelOrderApi = async (orderId, reason) => {
  // Get the selected order
  const orderResponse = await axiosInstance.get(
    `/orders/${orderId}`
  );

  const order = orderResponse.data;

  // Prevent restoring stock more than once
  if (order.status === "Cancelled") {
    return order;
  }

  // Restore stock for every product in the order
  for (const item of order.items) {
    const productResponse = await axiosInstance.get(
      `/products/${item.id}`
    );

    const product = productResponse.data;

    const currentStock = Number(product.stock ?? 0);
    const orderedQuantity = Number(item.quantity ?? 0);

    if (orderedQuantity <= 0) {
      throw new Error("Invalid product quantity.");
    }

    await axiosInstance.patch(`/products/${item.id}`, {
      stock: currentStock + orderedQuantity,
    });
  }

  // Update order status after restoring stock
  const response = await axiosInstance.patch(
    `/orders/${orderId}`,
    {
      status: "Cancelled",
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
      stockRestored: true,
    }
  );

  return response.data;
};
