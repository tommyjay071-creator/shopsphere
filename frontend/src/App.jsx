
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import { ThemeProvider } from "./context/ThemeContext";
import AIShoppingAssistant from "./components/ai-assistant/AIShoppingAssistant";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <AIShoppingAssistant />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
