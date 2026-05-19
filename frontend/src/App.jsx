import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import Chatbot from "./components/Chatbot";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetail from "./pages/ProductDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>

          {/* ✅ Navbar only after login */}
          {user && <Navbar />}

          <Routes>

            {/* 🔥 ROOT ROUTE WITH REPLACE FIX */}
            <Route
              path="/"
              element={
                user ? <ProductPage /> : <Navigate to="/register" replace />
              }
            />

            {/* 🔐 PROTECTED ROUTES */}
            <Route
              path="/cart"
              element={
                user ? <CartPage /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/checkout"
              element={
                user ? <CheckoutPage /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/product/:id"
              element={
                user ? <ProductDetail /> : <Navigate to="/login" replace />
              }
            />

            {/* 🔓 AUTH ROUTES */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

          </Routes>

          {/* 🤖 Chatbot only after login */}
          {user && <Chatbot userId={user?.id || 1} />}

        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;