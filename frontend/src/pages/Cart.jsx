import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  getMyCart,
  createCart,
  removeCartItem,
  checkoutCart,
} from "../services/api";

import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadCart() {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your cart.");
      return;
    }

    let data;

    try {
      data = await getMyCart(token);
    } catch (error) {
      console.log("No cart found. Creating a new cart...");

      data = await createCart(token);
    }

    setCart(data);

    localStorage.setItem("cartId", data.id);
  } catch (error) {
    console.error("Cart loading error:", error);

    setError(
      error.message || "Could not load your cart."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadCart();
  }, []);

  async function handleRemove(itemId) {
    try {
      const token = localStorage.getItem("token");

      const updatedCart = await removeCartItem(
        token,
        cart.id,
        itemId
      );

      setCart(updatedCart);
    } catch (error) {
      console.error(error);
      setError("Could not remove item.");
    }
  }

  async function handleCheckout() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to checkout.");
        return;
      }

      setCheckoutLoading(true);
      setError("");

      const order = await checkoutCart(
        token,
        cart.id
      );

      setCart({
        ...cart,
        items: [],
      });

      alert(
        `Order #${order.id} placed successfully!`
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Checkout failed."
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-status">
          <div className="cart-loading-ring"></div>
          <h2>Loading your cart</h2>
          <p>Getting everything ready...</p>
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="cart-page">
        <div className="cart-status cart-error">
          <div className="cart-status-icon">
            <ShoppingBag size={24} />
          </div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadCart}
            className="cart-retry-button"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const items = cart?.items ?? [];

  const total = items.reduce(
    (sum, item) =>
      sum +
      Number(item.product.price) * item.quantity,
    0
  );

  return (
    <main className="cart-page">

      {/* Header */}
      <section className="cart-header">

        <div className="cart-header-glow"></div>

        <div className="cart-header-content">

          <div className="cart-label">
            <ShoppingBag size={14} />
            <span>YOUR SHOPPING BAG</span>
          </div>

          <h1>
            Almost
            <span> yours.</span>
          </h1>

          <p>
            Review your selected items and complete your
            order when you're ready.
          </p>

        </div>

      </section>

      {/* Content */}
      <section className="cart-content">

        {error && cart && (
          <div className="cart-inline-error">
            {error}
          </div>
        )}

        {items.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              <ShoppingBag size={30} />
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added anything yet.
              Start exploring the ShopSphere collection.
            </p>

            <a href="/products" className="empty-cart-button">
              Explore Products
              <ArrowRight size={16} />
            </a>

          </div>

        ) : (

          <>

            {/* Items */}
            <div className="cart-items-section">

              <div className="cart-items-header">
                <div>
                  <span>YOUR ITEMS</span>
                  <h2>
                    {items.length}{" "}
                    {items.length === 1
                      ? "item"
                      : "items"}
                  </h2>
                </div>
              </div>

              <div className="cart-items">

                {items.map((item) => (

                  <article
                    className="cart-item"
                    key={item.id}
                  >

                    <div className="cart-product-image">

                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      ) : (
                        <ShoppingBag size={26} />
                      )}

                    </div>

                    <div className="cart-item-info">

                      <p>
                        {item.product.category}
                      </p>

                      <h3>
                        {item.product.name}
                      </h3>

                      <strong>
                        ₦
                        {Number(
                          item.product.price
                        ).toLocaleString()}
                      </strong>

                    </div>

                    <div className="cart-quantity">

                      <button
                        type="button"
                        disabled
                        title="Quantity updates coming soon"
                      >
                        <Minus size={14} />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled
                        title="Quantity updates coming soon"
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                    <div className="cart-item-total">
                      <span>Total</span>

                      <strong>
                        ₦
                        {(
                          Number(item.product.price) *
                          item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() =>
                        handleRemove(item.id)
                      }
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 size={17} />
                    </button>

                  </article>

                ))}

              </div>

              {/* Trust strip */}
              <div className="cart-trust-strip">

                <div>
                  <ShieldCheck size={18} />

                  <span>
                    Secure checkout
                  </span>
                </div>

                <div>
                  <Truck size={18} />

                  <span>
                    Reliable delivery
                  </span>
                </div>

              </div>

            </div>

            {/* Summary */}
            <aside className="cart-summary">

              <div className="summary-heading">
                <span>CHECKOUT</span>
                <h2>Order Summary</h2>
              </div>

              <div className="summary-details">

                <div className="summary-row">
                  <span>Subtotal</span>

                  <strong>
                    ₦{total.toLocaleString()}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>

                  <strong className="free-label">
                    Free
                  </strong>
                </div>

              </div>

              <div className="summary-total">

                <div>
                  <span>Total</span>
                  <small>Including delivery</small>
                </div>

                <strong>
                  ₦{total.toLocaleString()}
                </strong>

              </div>

              <button
                type="button"
                className="checkout-button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <>
                    <span className="checkout-spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="checkout-note">
                Your order will be securely processed
                through ShopSphere.
              </p>

            </aside>

          </>

        )}

      </section>

    </main>
  );
}

export default Cart;