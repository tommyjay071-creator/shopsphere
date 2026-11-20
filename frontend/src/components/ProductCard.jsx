import { Check, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productImages } from "../data/productImages";

import {
  addToCart,
  getMyCart,
  createCart,
} from "../services/api";

import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [liked, setLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  function openProductDetails() {
    navigate(`/products/${product.id}`);
  }

  function handleCardKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductDetails();
    }
  }

  async function handleAddToCart(event) {
    event.stopPropagation();

    try {
      setAdding(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      let cartId = localStorage.getItem("cartId");

      try {
        if (cartId) {
          await addToCart(token, cartId, product.id, 1);
        } else {
          throw new Error("No cart ID");
        }

        setMessage("Added to cart!");
        return;
      } catch (error) {
        console.log("Stored cart is invalid. Getting a new cart...");
      }

      try {
        const cart = await getMyCart(token);
        cartId = cart.id;
      } catch (error) {
        const cart = await createCart(token);
        cartId = cart.id;
      }

      localStorage.setItem("cartId", cartId);

      await addToCart(token, cartId, product.id, 1);

      setMessage("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage(error.message || "Could not add to cart.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <article
      className="product-card"
      role="link"
      tabIndex={0}
      onClick={openProductDetails}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-image">
        {product.imageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="product-image-loading">
                <div className="image-loading-spinner"></div>
              </div>
            )}

            <img
              src={productImages[product.name] || product.imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              width="700"
              height="525"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
          </>
        ) : (
          <div className="product-image-placeholder">
            <ShoppingCart size={28} />
            <span>Image unavailable</span>
          </div>
        )}

        <button
          type="button"
          className={`wishlist-button ${liked ? "liked" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            setLiked((previous) => !previous);
          }}
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>

        <span className="product-badge">Featured</span>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <p className="product-description">{product.description}</p>

        <div className="product-bottom">
          <strong>
            ₦{Number(product.price).toLocaleString()}
          </strong>

          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? (
              <>
                <span className="button-spinner"></span>
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>

        {message && (
          <p
            className={`cart-message ${
              message === "Added to cart!" ? "success" : "error"
            }`}
          >
            {message === "Added to cart!" && <Check size={14} />}
            {message}
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;