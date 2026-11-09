
import axiosInstance from "../api/axiosinstance";

export const cancelOrderApi = async (orderId, reason) => {
  const response = await axiosInstance.patch(`/orders/${orderId}`, {
    status: "Cancelled",
    cancelledAt: new Date().toISOString(),
    cancellationReason: reason,
  });

  return response.data;
};

