import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../services/api";
import ProductCard from "./ProductCard";

import "./FeaturedProducts.css";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data.content ?? data);
      } catch (error) {
        console.error(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-products">
        <div className="section-heading">
          <div>
            <p>EXPLORE OUR COLLECTION</p>
            <h2>Featured Products</h2>
          </div>
        </div>

        <div className="featured-loading">
          <div className="loading-orb"></div>
          <p>Loading your collection...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-products">
        <div className="featured-error">
          <Sparkles size={22} />
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products">
      <div className="section-heading">
        <div>
          <div className="section-label">
            <Sparkles size={13} />
            <span>EXPLORE OUR COLLECTION</span>
          </div>

          <h2>Featured Products</h2>

          <p className="section-description">
            Handpicked products waiting to find their new home.
          </p>
        </div>

        <Link to="/products" className="view-all-link">
          View all
          <ArrowRight size={17} />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="featured-empty">
          <h3>No products available yet.</h3>
          <p>Check back soon for something new.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;