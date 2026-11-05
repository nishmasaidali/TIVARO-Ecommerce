
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useproducts";
import ProductCard from "../components/productcard";

function Shop() {
  const { data, isLoading, isError } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCategory = searchParams.get("category") || "All";

  const products = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : [];

  // Explore by Style labels
  const types = [
    "All",
    "Vintage",
    "Classic",
    "Leather",
    "Gold & Rose Gold",
    "Chronograph",
    "Art Deco",
    "Pearl & Crystal",
  ];

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filtering
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Style filtering
    if (selectedType !== "All") {
      result = result.filter((product) => {
        const type = (product.type || "").toLowerCase();
        const style = (product.style || "").toLowerCase();
        const strap = (product.strap || "").toLowerCase();
        const dial = (product.dial || "").toLowerCase();

        const details = `${type} ${style} ${strap} ${dial}`;

        switch (selectedType) {
          case "Vintage":
            return (
              type.includes("vintage") ||
              type.includes("antique") ||
              type.includes("retro") ||
              style.includes("vintage") ||
              style.includes("antique") ||
              style.includes("retro") ||
              style.includes("heritage")
            );

          case "Classic":
            return (
              details.includes("classic") ||
              details.includes("heritage") ||
              details.includes("roman")
            );

          case "Leather":
            return details.includes("leather");

          case "Gold & Rose Gold":
            return details.includes("gold");

          case "Chronograph":
            return details.includes("chronograph");

          case "Art Deco":
            return details.includes("art deco");

          case "Pearl & Crystal":
            return (
              details.includes("pearl") ||
              details.includes("crystal")
            );

          default:
            return true;
        }
      });
    }

    // Search filtering
    if (search.trim()) {
      result = result.filter((product) =>
        `${product.name} ${product.brand} ${product.category} ${product.type} ${product.description}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "newest") {
      result.sort((a, b) => {
        if (a.newArrival && !b.newArrival) return 1;
        if (!a.newArrival && b.newArrival) return -1;

        return Number(b.id) - Number(a.id);
      });
    }

    return result;
  }, [products, selectedCategory, selectedType, search, sortBy]);

  // Pagination
  const productsPerPage = 5;
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType, search, sortBy]);

  // Change category
  function changeCategory(category) {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  // Clear filters
  function clearFilters() {
    setSearch("");
    setSelectedType("All");
    setSortBy("default");
    setSearchParams({});
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-[#F4EFE5] text-[#30251E]">

      {/* Page heading */}
      <section className="border-b border-[#E5D8C5] bg-[#EEE6D9] px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#A17D49]">
            The TIVARO Collection
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#30251E] sm:text-5xl md:text-6xl">
            A Legacy of Elegance.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#766657] md:text-base">
            Discover timeless designs inspired by the golden age of
            watchmaking. From everyday classics to exquisite evening pieces,
            find a watch that tells your story.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.2em] text-[#8A745D]">
            <span>Vintage Inspired</span>
            <span>·</span>
            <span>Timeless Design</span>
            <span>·</span>
            <span>Classic Craftsmanship</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">

        {/* Search and sorting */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center border border-[#D8C9B5] bg-[#FAF7F1] px-4 py-3 md:max-w-md">
            <span className="mr-3 text-xl text-[#A17D49]">⌕</span>

            <input
              type="text"
              placeholder="Search watches, styles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm text-[#30251E] outline-none placeholder:text-[#A39484]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="ml-2 text-xs text-[#8A745D] hover:text-[#A17D49]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="border border-[#D8C9B5] bg-[#FAF7F1] px-4 py-3 text-sm text-[#49372A] outline-none focus:border-[#A17D49]"
          >
            <option value="default">Sort: Recommended</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* Category filters */}
        <div className="mt-9 flex flex-wrap gap-3">
          {["All", "Men", "Women"].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => changeCategory(category)}
              className={`border px-6 py-2.5 text-xs uppercase tracking-[0.15em] transition ${
                selectedCategory.toLowerCase() === category.toLowerCase()
                  ? "border-[#30251E] bg-[#30251E] text-[#F4EFE5]"
                  : "border-[#D8C9B5] bg-transparent text-[#6B5A4B] hover:border-[#A17D49] hover:text-[#A17D49]"
              }`}
            >
              {category === "All" ? "All Watches" : category}
            </button>
          ))}
        </div>

        {/* Style filters */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8A745D]">
            Explore by Style
          </p>

          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`border px-4 py-2 text-xs transition ${
                  selectedType === type
                    ? "border-[#B08D57] bg-[#E5D8C5] text-[#49372A]"
                    : "border-[#E0D4C3] text-[#766657] hover:border-[#B08D57]"
                }`}
              >
                {type === "All" ? "All Styles" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-9 flex flex-col gap-2 border-b border-[#E0D4C3] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.15em] text-[#766657]">
            Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}–
            {Math.min(
              startIndex + productsPerPage,
              filteredProducts.length
            )}{" "}
            of {filteredProducts.length} watches
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="w-fit text-xs uppercase tracking-wider text-[#A17D49] hover:text-[#30251E]"
          >
            Clear all filters
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <p className="py-20 text-center text-[#766657]">
            Discovering your watches...
          </p>
        )}

        {/* Error */}
        {isError && (
          <p className="py-20 text-center text-red-700">
            Could not load products. Please check that JSON Server is running.
          </p>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="font-serif text-3xl text-[#30251E]">
              No watches found
            </h2>

            <p className="mt-3 text-sm text-[#766657]">
              Try another search or explore a different collection.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 bg-[#30251E] px-7 py-3 text-xs uppercase tracking-widest text-[#F4EFE5] transition hover:bg-[#6B5037]"
            >
              Explore All Watches
            </button>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !isError && currentProducts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="border border-[#D8C9B5] px-4 py-2 text-xs text-[#49372A] transition hover:bg-[#E5D8C5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 border text-xs transition ${
                  currentPage === page
                    ? "border-[#30251E] bg-[#30251E] text-white"
                    : "border-[#D8C9B5] text-[#49372A] hover:bg-[#E5D8C5]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="border border-[#D8C9B5] px-4 py-2 text-xs text-[#49372A] transition hover:bg-[#E5D8C5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

      </section>
    </main>
  );
}

export default Shop;
