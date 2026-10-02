import { useEffect, useState } from "react";
import { Package, ShoppingBag } from "lucide-react";

import { getMyOrders } from "../services/api";

import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your orders.");
          return;
        }

        const data = await getMyOrders(token);

        setOrders(data);
      } catch (error) {
        console.error(error);
        setError("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="orders-page">
        <p className="orders-status">
          Loading your orders...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <p className="orders-status orders-error">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="orders-header">
        <p>SHOPSPHERE</p>

        <h1>My Orders</h1>

        <span>
          Track and review your ShopSphere purchases.
        </span>
      </section>

      <section className="orders-content">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <ShoppingBag size={48} />

            <h2>No orders yet</h2>

            <p>
              Your completed purchases will appear here.
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article
                className="order-card"
                key={order.id}
              >
                <div className="order-card-header">
                  <div>
                    <span className="order-label">
                      ORDER
                    </span>

                    <h2>
                      #{order.id}
                    </h2>
                  </div>

                  <span
                    className={`order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div
                      className="order-item"
                      key={item.id}
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                      />

                      <div className="order-item-info">
                        <h3>
                          {item.product.name}
                        </h3>

                        <p>
                          {item.product.category}
                        </p>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>

                      <strong>
                        ₦
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span>
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "item"
                      : "items"}
                  </span>

                  <div>
                    <span>Total</span>

                    <strong>
                      ₦
                      {Number(
                        order.totalAmount
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Orders;