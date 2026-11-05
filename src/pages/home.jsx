
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useproducts";
import { useWishlist } from "../context/wishlistcontext";

function Home() {
  const { data, isLoading, isError } = useProducts();

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  function toggleWishlist(product) {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  const products = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : [];

  const newArrivals = products
    .filter((product) => product.newArrival === true)
    .slice(0, 4);

  const collections = [
    {
      name: "The Gentleman's Collection",
      description:
        "Classic gold cases, patinated dials and fine leather straps.",
      image:
        "https://www.analogshift.com/cdn/shop/files/AS11416_40992781_VACHERONCONSTANTIN_BULLHORNLUGSJUMBO--8.jpg?v=1763558867&width=1500",
      category: "Men",
      label: "01 / FOR HIM",
    },
    {
      name: "The Ladies' Collection",
      description:
        "18K gold, delicate pearls and brilliant diamond details.",
      image:
        "https://imgix-prod.ebth.com/2026/05/14/14/32/09/Attachment-d70e4ecf-4bbf-4153-b595-c7eaaedd4650.jpg?auto=format&crop=&fit=crop&h=880&ixlib=rb-3.1.0&w=880",
      category: "Women",
      label: "02 / FOR HER",
    },
    {
      name: "The Evening Edit",
      description:
        "Exquisite pearl cocktail watches and jewellery-inspired timepieces.",
      image:
        "https://www.analogshift.com/cdn/shop/files/AS11641_40992883_LONGINES_PEARL-5.jpg?v=1769378348",
      category: "All",
      label: "03 / PARTY & EVENING",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4EFE5] text-[#30251E]">

      {/* HERO SECTION */}
      <section className="bg-[#F4EFE5]">
        <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:gap-16">

          <div className="order-2 md:order-1">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#A17D49]">
              TIVARO — THE VINTAGE COLLECTION
            </p>

            <h1 className="font-serif text-5xl leading-[1.12] text-[#30251E] sm:text-6xl lg:text-7xl">
              Time has<br />
              a story.<br />
              <span className="italic text-[#A17D49]">
                Wear yours.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-8 text-[#766657] sm:text-base">
              Discover the art of timeless watchmaking.
              Explore antique gold finishes, elegant leather
              straps, delicate pearls and exquisite gemstone
              timepieces inspired by another era.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
  to="/products"
  className="inline-flex items-center gap-4 border-2 border-[#C5A16A] bg-[#30251E] px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white opacity-100 shadow-md transition duration-300 hover:bg-[#C5A16A] hover:text-[#30251E]"
>
  <span className="text-white">Explore Collection</span>
  <span className="text-white">→</span>
</Link>

              <span className="text-xs tracking-widest text-[#766657]">
                TIMELESS BY DESIGN
              </span>
            </div>

            <div className="mt-14 flex gap-10 border-t border-[#D9CBB7] pt-6">
              <div>
                <p className="font-serif text-2xl text-[#30251E]">
                  25
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-[#766657]">
                  Curated Styles
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl text-[#30251E]">
                  01
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-[#766657]">
                  Timeless Identity
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl text-[#30251E]">
                  ∞
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-[#766657]">
                  Endless Elegance
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 relative md:order-2">
            <div className="absolute -inset-3 border border-[#B08D57]/40"></div>

            <img
              src="https://hips.hearstapps.com/hmg-prod/images/collagest-66d9819b06e21.jpg?crop=0.496xw%3A0.990xh%3B0.504xw%2C0&resize=1120%3A%2A"
              alt="Vintage gold watch with ivory dial and brown leather strap"
              className="relative h-[420px] w-full object-cover sm:h-[550px] md:h-[680px]"
            />

            <div className="absolute bottom-5 left-5 bg-[#F4EFE5] px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A17D49]">
                THE ART OF TIME
              </p>
              <p className="mt-1 font-serif text-lg text-[#30251E]">
                Timeless Elegance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION STRIP */}
      <section className="border-y border-[#D9CBB7] bg-[#E5D8C5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5B4635] sm:text-xs">
          <span>Vintage Inspired</span>
          <span>✦</span>
          <span>Antique Gold</span>
          <span>✦</span>
          <span>Precious Stones</span>
          <span>✦</span>
          <span>Timeless Style</span>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A17D49]">
              DISCOVER TIVARO
            </p>

            <h2 className="font-serif text-4xl text-[#30251E] sm:text-5xl">
              Collections with character.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#766657]">
              Every collection has its own personality.
              Discover timepieces inspired by the elegance
              and craftsmanship of another era.
            </p>
          </div>

          <Link
            to="/products"
            className="border-b border-[#A17D49] pb-2 text-xs font-semibold uppercase tracking-widest text-[#6B5037]"
          >
            View All Watches →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              to={
                collection.category === "All"
                  ? "/products"
                  : `/products?category=${collection.category}`
              }
              className="group"
            >
              <div className="relative overflow-hidden bg-[#E5D8C5]">
                <img
                  src={collection.image}
                  alt={collection.name}
                  loading="lazy"
                  className="h-[400px] w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#21170F]/70 via-transparent to-transparent"></div>

                <p className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
                  {collection.label}
                </p>
              </div>

              <div className="border-b border-[#D9CBB7] py-5">
                <h3 className="font-serif text-2xl text-[#30251E] transition group-hover:text-[#A17D49]">
                  {collection.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#766657]">
                  {collection.description}
                </p>

                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-[#A17D49]">
                  Discover Collection →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* EDITORIAL SECTION */}
      <section className="bg-[#30251E] text-[#F4EFE5]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-24">

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A16A]">
              BEYOND TRENDS
            </p>

            <h2 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Some things<br />
              never go<br />
              <span className="italic text-[#C5A16A]">
                out of time.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-8 text-[#D3C4B1]">
              Inspired by the artistry of vintage jewellery,
              TIVARO brings together intricate details,
              precious stones, delicate pearls and timeless
              watchmaking.
            </p>

            <Link
  to="/products"
  className="mt-8 inline-flex items-center gap-4 border-2 border-[#C5A16A] bg-[#30251E] px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white opacity-100 shadow-md transition duration-300 hover:bg-[#C5A16A] hover:text-[#30251E]"
>
  <span className="text-white">Discover Our Story</span>
  <span className="text-white">→</span>
</Link>
          </div>

          <div className="relative">
            <img
              src="https://windsorjewelers.com/hs-fs/hubfs/Imported_Blog_Media/WAPD-117619F.webp?name=WAPD-117619F.webp&width=2000"
              alt="Vintage Cartier diamond and pearl wristwatch"
              loading="lazy"
              className="h-[350px] w-full object-cover sm:h-[480px]"
            />

            <div className="absolute -bottom-5 -left-5 hidden border border-[#C5A16A]/50 bg-[#30251E] px-6 py-5 sm:block">
              <p className="font-serif text-xl italic text-[#C5A16A]">
                A timeless choice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A17D49]">
              THE LATEST SELECTION
            </p>

            <h2 className="font-serif text-4xl text-[#30251E] sm:text-5xl">
              Recently discovered.
            </h2>
          </div>

          <Link
            to="/products"
            className="border-b border-[#A17D49] pb-2 text-xs font-semibold uppercase tracking-widest text-[#6B5037]"
          >
            Shop All Watches →
          </Link>
        </div>

        {isLoading && (
          <p className="py-10 text-center text-[#766657]">
            Discovering our collection...
          </p>
        )}

        {isError && (
          <p className="py-10 text-center text-red-700">
            Unable to load watches. Please check whether your JSON Server is running.
          </p>
        )}

        {!isLoading && !isError && newArrivals.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => {
              const saved = isInWishlist(product.id);

              return (
                <div key={product.id} className="group">
                  <div className="relative overflow-hidden border border-[#E5D8C5] bg-[#EAE1D4] p-5">
                    <Link to={`/products/${product.id}`}>
                      {product.newArrival && (
                        <span className="absolute left-3 top-3 z-10 bg-[#30251E] px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-[#F4EFE5]">
                          New Arrival
                        </span>
                      )}

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-64 w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label={
                        saved ? "Remove from wishlist" : "Add to wishlist"
                      }
                      className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#E5D8C5] bg-[#FAF7F1] shadow-sm transition hover:scale-110"
                    >
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill={saved ? "#A17D49" : "none"}
                        stroke={saved ? "#A17D49" : "#6B5A4B"}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                      </svg>
                    </button>
                  </div>

                  <Link to={`/products/${product.id}`}>
                    <div className="border-b border-[#D9CBB7] py-5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#A17D49]">
                        {product.brand || "TIVARO"}
                      </p>

                      <h3 className="mt-2 font-serif text-xl text-[#30251E] transition group-hover:text-[#A17D49]">
                        {product.name}
                      </h3>

                      <p className="mt-3 text-sm font-semibold text-[#6B5037]">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-[#A17D49]">
                        View Timepiece →
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && newArrivals.length === 0 && (
          <p className="py-10 text-center text-[#766657]">
            New arrivals will be added soon.
          </p>
        )}
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="border-y border-[#D9CBB7] bg-[#E5D8C5] px-6 py-20 text-center md:py-24">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A17D49]">
          THE TIVARO EXPERIENCE
        </p>

        <h2 className="font-serif text-4xl text-[#30251E] sm:text-5xl">
          Make every second timeless.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#766657]">
          Explore our curated selection of vintage-inspired watches,
          from everyday classics to elegant statement pieces.
        </p>

        <Link
  to="/products"
  className="inline-flex items-center gap-4 border-2 border-[#C5A16A] bg-[#30251E] px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white opacity-100 shadow-md transition duration-300 hover:bg-[#C5A16A] hover:text-[#30251E]"
>
  <span className="text-white">Explore All Watches</span>
  <span className="text-white">→</span>
</Link>
      </section>
    </main>
  );
}

export default Home;
