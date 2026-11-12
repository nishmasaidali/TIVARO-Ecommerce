
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosinstance";
import ProductModal from "../components/productmodal";

const AdminProducts = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Products per page
  const productsPerPage = 8;

  // Fetch products
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products");
      return response.data;
    },
  });

  // Add or update product
  const productMutation = useMutation({
    mutationFn: async (productData) => {
      if (selectedProduct) {
        return axiosInstance.patch(
          `/products/${selectedProduct.id}`,
          productData
        );
      }

      return axiosInstance.post("/products", productData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setSelectedProduct(null);
    },
  });

  // Delete product
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosInstance.delete(`/products/${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Add product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Save product
  const handleSaveProduct = (productData) => {
    productMutation.mutate(productData);
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {
      deleteMutation.mutate(id);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / productsPerPage);

  const displayedPage = Math.min(currentPage, Math.max(totalPages, 1));

  const lastIndex = displayedPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = products.slice(firstIndex, lastIndex);

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products.</p>;
  }

  return (
    <div>
      {/* Page Heading */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-[#30251E]">
            Product Management
          </h2>

          <p className="text-sm text-[#766657] mt-2">
            Manage all watches in your TIVARO store.
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="bg-[#30251E] text-white px-5 py-3 rounded-lg hover:bg-[#A17D49]"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#D9CBB7] overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F4EFE5]">
            <tr>
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Brand</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-[#766657]">
                  No products found.
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-[#E5D8C5] hover:bg-[#FAF8F4]"
                >
                  <td className="px-5 py-4">{product.id}</td>
                  <td className="px-5 py-4">{product.name}</td>
                  <td className="px-5 py-4">{product.brand}</td>
                  <td className="px-5 py-4">{product.category}</td>
                  <td className="px-5 py-4">₹{product.price}</td>
                  <td className="px-5 py-4">{product.stock}</td>

                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-[#A17D49] font-medium hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 font-medium hover:underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-5 mt-6">
          <button
            onClick={() => setCurrentPage(displayedPage - 1)}
            disabled={displayedPage === 1}
            className="px-4 py-2 border border-[#D9CBB7] rounded-lg text-[#30251E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4EFE5]"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-[#30251E]">
            Page {displayedPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(displayedPage + 1)}
            disabled={displayedPage === totalPages}
            className="px-4 py-2 border border-[#D9CBB7] rounded-lg text-[#30251E] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4EFE5]"
          >
            Next
          </button>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      {/* Status Messages */}
      {productMutation.isPending && (
        <p className="mt-3 text-sm text-[#766657]">
          Saving product...
        </p>
      )}

      {productMutation.isError && (
        <p className="mt-3 text-sm text-red-600">
          Failed to save product. Please try again.
        </p>
      )}

      {deleteMutation.isPending && (
        <p className="mt-3 text-sm text-[#766657]">
          Deleting product...
        </p>
      )}

      {deleteMutation.isError && (
        <p className="mt-3 text-sm text-red-600">
          Failed to delete product. Please try again.
        </p>
      )}
    </div>
  );
};

export default AdminProducts;
