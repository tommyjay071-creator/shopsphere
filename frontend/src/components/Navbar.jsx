import { Search, ShoppingCart, User, LogOut, Package } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function loadCustomer() {
      const storedCustomer = localStorage.getItem("customer");

      if (storedCustomer) {
        try {
          setCustomer(JSON.parse(storedCustomer));
        } catch (error) {
          console.error("Could not read customer data:", error);
          setCustomer(null);
        }
      } else {
        setCustomer(null);
      }
    }

    loadCustomer();

    window.addEventListener("storage", loadCustomer);

    return () => {
      window.removeEventListener("storage", loadCustomer);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    localStorage.removeItem("cartId");

    setCustomer(null);
    setMenuOpen(false);

    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <Link to="/" className="navbar-logo">
          <span>Shop</span>Sphere
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Orders
          </NavLink>
        </div>

        <div className="navbar-actions">

          <button
            type="button"
            className="navbar-action"
            aria-label="Search"
          >
            <Search size={18} />
            <span>Search</span>
          </button>

          <Link
            to="/cart"
            className="navbar-action"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
          </Link>

          {customer ? (
            <div className="navbar-account">
              <button
                type="button"
                className="navbar-account-button"
                onClick={() =>
                  setMenuOpen((previous) => !previous)
                }
              >
                <span className="navbar-avatar">
                  {customer.firstName?.charAt(0).toUpperCase()}
                </span>

                <span className="navbar-account-name">
                  {customer.firstName}
                </span>
              </button>

              {menuOpen && (
                <div className="navbar-account-menu">

                  <div className="account-menu-header">
                    <span className="account-menu-avatar">
                      {customer.firstName?.charAt(0).toUpperCase()}
                    </span>

                    <div>
                      <strong>
                        {customer.firstName} {customer.lastName}
                      </strong>

                      <span>
                        {customer.email}
                      </span>
                    </div>
                  </div>

                  <div className="account-menu-divider"></div>

                  <Link
                    to="/orders"
                    className="account-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Package size={17} />
                    <span>My Orders</span>
                  </Link>

                  <button
                    type="button"
                    className="account-menu-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>

                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="navbar-login-button"
            >
              <User size={17} />
              <span>Login</span>
            </Link>
          )}

        </div>

      </div>

      <div className="navbar-glow"></div>
    </nav>
  );
}

export default Navbar;