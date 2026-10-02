import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-orb hero-orb-one"></div>
        <div className="hero-orb hero-orb-two"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>THE FUTURE OF ONLINE SHOPPING</span>
        </div>

        <h1>
          Everything you want.
          <span> One place.</span>
        </h1>

        <p className="hero-description">
          Discover electronics, fashion, gaming, home essentials and more —
          all brought together in one seamless shopping experience.
        </p>

        <div className="hero-actions">
          <Link to="/products" className="hero-primary">
            Shop Now
            <ArrowRight size={18} />
          </Link>

          <Link to="/products" className="hero-secondary">
            Explore Collection
          </Link>
        </div>

        <div className="hero-trust">
          <div>
            <strong>10K+</strong>
            <span>Products</span>
          </div>

          <div className="hero-divider"></div>

          <div>
            <strong>5K+</strong>
            <span>Customers</span>
          </div>

          <div className="hero-divider"></div>

          <div>
            <strong>24/7</strong>
            <span>Support</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-glow"></div>

        <div className="hero-main-card">
          <div className="hero-card-top">
            <div className="hero-card-icon">
              <Sparkles size={22} />
            </div>

            <span>SHOPSPHERE</span>
          </div>

          <div className="hero-card-content">
            <small>YOUR SHOPPING UNIVERSE</small>

            <h2>
              Smart shopping.
              <br />
              <span>Simply better.</span>
            </h2>

            <p>
              Everything you need, beautifully organized in one place.
            </p>
          </div>

          <div className="hero-card-bottom">
            <div>
              <Zap size={15} />
              <span>Fast</span>
            </div>

            <div>
              <ShieldCheck size={15} />
              <span>Secure</span>
            </div>
          </div>
        </div>

        <div className="hero-floating-card card-one">
          <div className="floating-icon">⚡</div>

          <div>
            <strong>Fast Delivery</strong>
            <span>Right to your door</span>
          </div>
        </div>

        <div className="hero-floating-card card-two">
          <div className="floating-icon">🛒</div>

          <div>
            <strong>Easy Checkout</strong>
            <span>Simple & secure</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;