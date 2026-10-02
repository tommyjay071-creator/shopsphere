import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginCustomer } from "../services/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginCustomer(formData.email, formData.password);

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "customer",
        JSON.stringify({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        })
      );

      navigate("/products");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <span className="login-badge">SHOPSPHERE</span>

```
      <h1>Welcome back</h1>

      <p>
        Sign in to continue shopping with ShopSphere.
      </p>
      </div>

    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && (
        <p className="login-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      </form>

    <p className="login-footer">
      Don't have an account?{" "}
      <Link to="/register">
        Create one
      </Link>
    </p>
      </section>
    </main>

);
}

export default Login;
