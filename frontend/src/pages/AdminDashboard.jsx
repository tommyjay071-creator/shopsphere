
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { RefreshCw, ShieldCheck, Package, Clock, Truck, CheckCircle } from "lucide-react";

import "./AdminDashboard.css";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function AdminDashboard() {
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Could not load orders (${response.status})`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, status) {
    setUpdatingId(orderId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/orders/${orderId}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Could not update order (${response.status})`);
      }

      const updatedOrder = await response.json();

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      setError(err.message || "Could not update order.");
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (!customer || !token || customer.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  const countStatus = (status) =>
    orders.filter((order) => order.status === status).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((total, order) => total + Number(order.totalAmount || 0), 0);

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span className="admin-eyebrow">
            <ShieldCheck size={16} /> SHOPSPHERE ADMINISTRATION
          </span>
          <h1>Admin Dashboard</h1>
          <p>Manage customer orders and monitor order activity.</p>
        </div>

        <button
          className="admin-refresh"
          onClick={loadOrders}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </section>

      {error && <div className="admin-error">{error}</div>}

      <section className="admin-stats">
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><Package /></span>
          <div>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon"><Clock /></span>
          <div>
            <p>Pending Orders</p>
            <h2>{countStatus("PENDING")}</h2>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon"><Truck /></span>
          <div>
            <p>Shipped Orders</p>
            <h2>{countStatus("SHIPPED")}</h2>
          </div>
        </article>

        <article className="admin-stat-card">
          <span className="admin-stat-icon"><CheckCircle /></span>
          <div>
            <p>Delivered Orders</p>
            <h2>{countStatus("DELIVERED")}</h2>
          </div>
        </article>
      </section>

      <section className="admin-revenue">
        <div>
          <p>Order Value (excluding cancelled orders)</p>
          <h2>₦{totalRevenue.toLocaleString("en-NG")}</h2>
        </div>
      </section>

      <section className="admin-orders-section">
        <div className="admin-section-heading">
          <div>
            <h2>Order Management</h2>
            <p>View orders and update their progress.</p>
          </div>
          <span>{orders.length} orders</span>
        </div>

        {loading ? (
          <div className="admin-empty">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">No orders have been placed yet.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      {order.customer?.firstName || ""}{" "}
                      {order.customer?.lastName || ""}
                      <small>{order.customer?.email || "Customer"}</small>
                    </td>
                    <td>{order.items?.length || 0}</td>
                    <td>
                      ₦{Number(order.totalAmount || 0).toLocaleString("en-NG")}
                    </td>
                    <td>
                      <span className={`admin-status status-${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(event) =>
                          updateStatus(order.id, event.target.value)
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingId === order.id && <small>Updating...</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
