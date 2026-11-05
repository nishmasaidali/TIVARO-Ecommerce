import axiosInstance from "../api/axiosinstance";

export const getProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};