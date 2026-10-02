import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data.content ?? data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const productName = product.name?.toLowerCase() ?? "";
    const productDescription =
      product.description?.toLowerCase() ?? "";

    const searchValue = search.toLowerCase();

    const matchesSearch =
      productName.includes(searchValue) ||
      productDescription.includes(searchValue);

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  function clearSearch() {
    setSearch("");
  }

  return (
    <main className="products-page">

      {/* Background decoration */}
      <div className="products-background">
        <div className="products-orb products-orb-one"></div>
        <div className="products-orb products-orb-two"></div>
      </div>

      {/* Hero */}
      <section className="products-hero">

        <div className="products-hero-content">

          <div className="products-label">
            <Sparkles size={14} />
            <span>THE SHOPSPHERE COLLECTION</span>
          </div>

          <h1>
            Find something
            <span> extraordinary.</span>
          </h1>

          <p>
            Explore our curated collection of products,
            designed to make everyday shopping feel effortless.
          </p>

        </div>

      </section>

      {/* Main content */}
      <section className="products-content">

        {/* Sidebar */}
        <aside className="products-sidebar">

          <div className="sidebar-header">
            <div>
              <span>DISCOVER</span>
              <h3>Categories</h3>
            </div>

            <SlidersHorizontal size={18} />
          </div>

          <div className="category-list">

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => setCategory(item)}
              >
                <span>{item}</span>

                {category === item && (
                  <span className="category-dot"></span>
                )}
              </button>
            ))}

          </div>

        </aside>

        {/* Products */}
        <div className="products-main">

          <div className="products-toolbar">

            <div className="products-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

            </div>

            <div className="products-count">
              <strong>{filteredProducts.length}</strong>
              <span>
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </span>
            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="products-loading">

              <div className="loading-ring"></div>

              <h3>Loading collection</h3>

              <p>
                Preparing something beautiful for you...
              </p>

            </div>
          ) : filteredProducts.length === 0 ? (

            /* Empty state */
            <div className="products-empty">

              <div className="empty-icon">
                <Search size={25} />
              </div>

              <h2>No products found</h2>

              <p>
                We couldn't find anything matching your
                current search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>

            </div>

          ) : (

            <div className="products-grid">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default Products;