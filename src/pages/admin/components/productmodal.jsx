
import { useEffect, useState } from "react";

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    category: "Men",
    type: "",
    image: "",
    description: "",
    collection: "",
    occasion: "",
    style: "",
    strap: "",
    dial: "",
    featured: false,
    newArrival: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...formData,
        ...product,
      });
    } else {
      setFormData({
        name: "",
        brand: "",
        price: "",
        stock: "",
        category: "Men",
        type: "",
        image: "",
        description: "",
        collection: "",
        occasion: "",
        style: "",
        strap: "",
        dial: "",
        featured: false,
        newArrival: false,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-semibold text-[#30251E]">
            {product ? "Edit Product" : "Add New Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#766657] hover:text-red-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm">Product Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Brand</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Enter brand"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border p-3"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border p-3"
                placeholder="Enter stock"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">Type</label>
              <input
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Classic, Vintage, etc."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Collection</label>
              <input
                name="collection"
                value={formData.collection}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Enter collection"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Occasion</label>
              <input
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Enter occasion"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Style</label>
              <input
                name="style"
                value={formData.style}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Enter style"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Strap</label>
              <input
                name="strap"
                value={formData.strap}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Enter strap type"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Dial</label>
              <input
                name="dial"
                value={formData.dial}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Enter dial type"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm">Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
                placeholder="Enter image URL"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-lg border p-3"
                placeholder="Enter product description"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Product
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
              />
              New Arrival
            </label>

          </div>

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-3 text-[#766657]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#30251E] px-5 py-3 text-white hover:bg-[#A17D49]"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
