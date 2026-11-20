
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";

import { getProductById, addToCart, getMyCart, createCart } from "../services/api";
import { productImages } from "../data/productImages";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setImageError(false);
        setQuantity(1);

        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("We couldn't load this product. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleAddToCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      setAdding(true);
      setMessage("");

      let cartId = localStorage.getItem("cartId");

      if (cartId) {
        try {
          await addToCart(token, cartId, product.id, quantity);
          setMessage("Added to cart!");
          return;
        } catch (error) {
          console.log("Stored cart is invalid. Getting a new cart...");
        }
      }

      try {
        const cart = await getMyCart(token);
        cartId = cart.id;
      } catch (error) {
        const cart = await createCart(token);
        cartId = cart.id;
      }

      localStorage.setItem("cartId", cartId);

      await addToCart(token, cartId, product.id, quantity);

      setMessage("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage(error.message || "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="details-loading">
          <div className="loading-ring"></div>
          <h3>Loading product details...</h3>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="details-error">
          <h2>Product unavailable</h2>
          <p>{error || "This product could not be found."}</p>
          <button onClick={() => navigate("/products")}>
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const image = productImages[product.name] || product.imageUrl;
  const inStock = Number(product.stock) > 0;

  return (
    <main className="product-details-page">
      <div className="details-container">
        <button
          type="button"
          className="details-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="product-details-card">
          <div className="details-image-section">
            {image && !imageError ? (
              <img
                src={image}
                alt={product.name}
                className="details-product-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="details-image-placeholder">
                <ShoppingCart size={42} />
                <span>Image unavailable</span>
              </div>
            )}
          </div>

          <div className="details-info-section">
            <span className="details-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <div className="details-price">
              ₦{Number(product.price).toLocaleString("en-NG")}
            </div>

            <div className={`details-stock ${inStock ? "available" : "unavailable"}`}>
              <PackageCheck size={17} />
              {inStock
                ? `${product.stock} items available`
                : "Currently out of stock"}
            </div>

            <div className="details-divider"></div>

            <h3>Product Description</h3>

            <p className="details-description">
              {product.description || "No description available for this product."}
            </p>

            {inStock && (
              <div className="details-quantity">
                <span>Quantity</span>

                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => setQuantity((previous) => Math.max(1, previous - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <strong>{quantity}</strong>

                  <button
                    type="button"
                    onClick={() => setQuantity((previous) => Math.min(Number(product.stock), previous + 1))}
                    disabled={quantity >= Number(product.stock)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className="details-add-cart"
              onClick={handleAddToCart}
              disabled={adding || !inStock}
            >
              {adding ? (
                "Adding to Cart..."
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </button>

            {message && (
              <p className={`details-message ${message === "Added to cart!" ? "success" : "error"}`}>
                {message === "Added to cart!" && <Check size={15} />}
                {message}
                {message === "Please login first." && (
                  <> <Link to="/login">Sign in</Link></>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
