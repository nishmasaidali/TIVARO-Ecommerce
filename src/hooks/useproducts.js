import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productservice";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}