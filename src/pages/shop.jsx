
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useProducts } from "../hooks/useproducts";
import ProductCard from "../components/productcard";

function Shop() {
  const { data, isLoading, isError } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const products = Array.isArray(data)
    ? data
    : data?.products || [];

  const selectedCategory = searchParams.get("category") || "All";
  const selectedCollection = searchParams.get("collection") || "All";

  const productsPerPage = 8;

  // Get unique brands dynamically
  const brands = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.brand?.trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Category filter
  const changeCategory = (category) => {
    const params = new URLSearchParams(searchParams);

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    setSearchParams(params);
    setCurrentPage(1);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // Filter by collection
    if (selectedCollection !== "All") {
      result = result.filter(
        (product) =>
          product.collection?.toLowerCase() ===
          selectedCollection.toLowerCase()
      );
    }

    // Filter by search
    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((product) =>
        [
          product.name,
          product.brand,
          product.category,
          product.type,
          product.description,
          product.collection,
          product.occasion,
          product.style,
          product.strap,
          product.dial,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(searchText)
          )
      );
    }

    // Filter by brand
    if (sortBy.startsWith("brand-")) {
      const selectedBrand = sortBy.replace("brand-", "");

      result = result.filter(
        (product) =>
          product.brand?.toLowerCase() ===
          selectedBrand.toLowerCase()
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedCollection,
    search,
    sortBy,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCollection, search, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Previous and Next
  const changePage = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSortBy("default");
    setSearchParams({});
    setCurrentPage(1);
  };

  // Check active filters
  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedCollection !== "All" ||
    search.trim() !== "" ||
    sortBy !== "default";

  return (
    <div className="min-h-screen bg-[#F4EFE5] px-5 py-12 md:px-12">

      {/* Page Heading */}
      <div className="mb-10 text-center">
        <p className="mb-3 text-sm tracking-[0.3em] text-[#A17D49]">
          TIVARO COLLECTION
        </p>

        <h1 className="font-serif text-4xl text-[#30251E] md:text-5xl">
          Explore Our Watches
        </h1>

        <p className="mt-4 text-sm text-[#766657]">
          Discover timeless watches crafted for every moment.
        </p>
      </div>

      {/* Category Buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {["All", "Men", "Women"].map((category) => (
          <button
            key={category}
            onClick={() => changeCategory(category)}
            className={`rounded-full border px-6 py-2 text-sm transition ${
              selectedCategory === category
                ? "border-[#30251E] bg-[#30251E] text-white"
                : "border-[#D9CBB7] bg-transparent text-[#30251E] hover:bg-[#E5D8C5]"
            }`}
          >
            {category === "All" ? "All Watches" : category}
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search watches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#D9CBB7] bg-white px-4 py-3 text-sm text-[#30251E] outline-none focus:border-[#A17D49] md:max-w-sm"
        />

        <div className="flex flex-wrap items-center gap-4">

          <p className="text-sm text-[#766657]">
            {filteredProducts.length} watches found
          </p>

          {/* Combined Sort and Brand Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-[#D9CBB7] bg-white px-4 py-3 text-sm text-[#30251E] outline-none focus:border-[#A17D49]"
          >
            <option value="default">Sort By</option>

            <optgroup label="Sort By Price">
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </optgroup>

            <optgroup label="Sort By Name">
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </optgroup>

            <optgroup label="Other Sorting">
              <option value="newest">Newest First</option>
            </optgroup>

            <optgroup label="Filter By Brand">
              {brands.map((brand) => (
                <option
                  key={brand}
                  value={`brand-${brand}`}
                >
                  {brand}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#A17D49] underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="py-16 text-center text-[#766657]">
          Loading watches...
        </p>
      )}

      {/* Error */}
      {isError && (
        <p className="py-16 text-center text-red-600">
          Something went wrong while loading watches.
        </p>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && (
        <>
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <h2 className="font-serif text-2xl text-[#30251E]">
                No Watches Found
              </h2>

              <p className="mt-3 text-sm text-[#766657]">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#30251E] px-6 py-3 text-sm text-white"
              >
                View All Watches
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-6">

              <button
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
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full border border-[#D9CBB7] px-7 py-3 text-sm text-[#30251E] transition hover:bg-[#30251E] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>

            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Shop;
