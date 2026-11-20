
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Sun,
  Moon,
  Menu,
  X,
  Home,
  ShieldCheck,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [customer, setCustomer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    window.addEventListener("authChanged", loadCustomer);

    return () => {
      window.removeEventListener("storage", loadCustomer);
      window.removeEventListener("authChanged", loadCustomer);
    };
  }, []);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    localStorage.removeItem("cartId");

    setCustomer(null);
    setMenuOpen(false);
    setMobileMenuOpen(false);

    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  }

  const isAdmin = customer?.role === "ADMIN";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img
            src="/shopsphere-logo.svg"
            alt=""
            className="navbar-logo-image"
          />

          <span className="navbar-logo-text">
            <span className="logo-shop">Shop</span>
            <span className="logo-sphere">Sphere</span>
          </span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            Home
          </NavLink>

          <NavLink to="/products" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            Products
          </NavLink>

          <NavLink to="/orders" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            Orders
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }>
              Admin
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          <button type="button" className="navbar-action" aria-label="Search">
            <Search size={18} />
            <span>Search</span>
          </button>

          <Link to="/cart" className="navbar-action" aria-label="Shopping cart">
            <ShoppingCart size={18} />
            <span>Cart</span>
          </Link>

          <button
            type="button"
            className={`theme-switch ${theme === "light" ? "light" : ""}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-switch-track">
              <span className="theme-switch-icon">
                {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              </span>
            </span>
          </button>

          {customer ? (
            <div className="navbar-account">
              <button
                type="button"
                className="navbar-account-button"
                onClick={() => setMenuOpen((previous) => !previous)}
                aria-expanded={menuOpen}
                aria-label="Open account menu"
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
                      <span>{customer.email}</span>
                      {isAdmin && <span>Administrator</span>}
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

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="account-menu-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ShieldCheck size={17} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

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
            <Link to="/login" className="navbar-login-button" onClick={closeMobileMenu}>
              <User size={17} />
              <span>Login</span>
            </Link>
          )}

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <NavLink to="/" className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          } onClick={closeMobileMenu}>
            <Home size={18} />
            Home
          </NavLink>

          <NavLink to="/products" className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          } onClick={closeMobileMenu}>
            <ShoppingCart size={18} />
            Products
          </NavLink>

          <NavLink to="/orders" className={({ isActive }) =>
            isActive ? "mobile-nav-link active" : "mobile-nav-link"
          } onClick={closeMobileMenu}>
            <Package size={18} />
            My Orders
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) =>
              isActive ? "mobile-nav-link active" : "mobile-nav-link"
            } onClick={closeMobileMenu}>
              <ShieldCheck size={18} />
              Admin Dashboard
            </NavLink>
          )}

          <Link to="/cart" className="mobile-nav-link" onClick={closeMobileMenu}>
            <ShoppingCart size={18} />
            My Cart
          </Link>

          <div className="mobile-nav-divider"></div>

          {customer ? (
            <>
              <div className="mobile-nav-customer">
                <span className="navbar-avatar">
                  {customer.firstName?.charAt(0).toUpperCase()}
                </span>

                <span>
                  Signed in as <strong>{customer.firstName}</strong>
                </span>
              </div>

              <button
                type="button"
                className="mobile-nav-link mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>
              <User size={18} />
              Login
            </Link>
          )}
        </div>
      )}

      <div className="navbar-glow"></div>
    </nav>
  );
}

export default Navbar;
