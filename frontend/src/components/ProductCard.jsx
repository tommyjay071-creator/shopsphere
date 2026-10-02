import { Check, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

import {
  addToCart,
  getMyCart,
  createCart,
} from "../services/api";

import "./ProductCard.css";

function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [liked, setLiked] = useState(false);

  async function handleAddToCart() {
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
      // If we have a stored cart, make sure it actually belongs
      // to the currently logged-in customer.
      if (cartId) {
        await addToCart(
          token,
          cartId,
          product.id,
          1
        );
      } else {
        throw new Error("No cart ID");
      }

      setMessage("Added to cart!");
      return;
    } catch (error) {
      console.log("Stored cart is invalid. Getting a new cart...");
    }

    // Stored cart failed, so get the customer's actual cart.
    try {
      const cart = await getMyCart(token);

      cartId = cart.id;
    } catch (error) {
      // Customer doesn't have a cart yet.
      const cart = await createCart(token);

      cartId = cart.id;
    }

    localStorage.setItem("cartId", cartId);

    await addToCart(
      token,
      cartId,
      product.id,
      1
    );

    setMessage("Added to cart!");
  } catch (error) {
    console.error("Add to cart error:", error);

    setMessage(
      error.message || "Could not add to cart."
    );
  } finally {
    setAdding(false);
  }
}

  return (
    <article className="product-card">

      <div className="product-image">

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
          />
        ) : (
          <div className="product-image-placeholder">
            <ShoppingCart size={28} />
          </div>
        )}

        <button
          type="button"
          className={`wishlist-button ${
            liked ? "liked" : ""
          }`}
          onClick={() =>
            setLiked((previous) => !previous)
          }
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          <Heart
            size={17}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />
        </button>

        <span className="product-badge">
          Featured
        </span>

      </div>

      <div className="product-info">

        <p className="product-category">
          {product.category}
        </p>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">

          <strong>
            ₦
            {Number(product.price).toLocaleString()}
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
              message === "Added to cart!"
                ? "success"
                : "error"
            }`}
          >
            {message === "Added to cart!" && (
              <Check size={14} />
            )}

            {message}
          </p>
        )}

      </div>

    </article>
  );
}

export default ProductCard;