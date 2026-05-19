import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ LOAD CART FROM DB
  const fetchCart = async () => {
    if (!user) return;

    try {
      const res = await API.get(`/cart/${user.id}`);
      setCart(res.data);
    } catch (err) {
      console.error("❌ Cart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // ✅ ADD TO CART (FIXED 🚀)
  const addToCart = async (product) => {
    if (!user || !product) return;

    try {
      await API.post("/cart/add", {
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        image: product.image || "",   // ✅ fallback safety
        quantity: 1,
        price: product.price,
      });

      console.log("✅ Added to DB");

      // 🔥 Refresh cart
      fetchCart();

    } catch (err) {
      console.error("❌ Add cart error:", err.response?.data || err.message);
    }
  };

  // ✅ REMOVE ITEM
  const removeFromCart = async (item_id) => {
    try {
      await API.delete(`/cart/${item_id}`);

      setCart((prev) => prev.filter((item) => item.id !== item_id));

    } catch (err) {
      console.error("❌ Remove error:", err);
    }
  };

  // ✅ CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};