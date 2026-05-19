import { useEffect, useState } from "react";
import API from "../services/api";

export default function Cart({ userId }) {
  const [cart, setCart] = useState([]);

  // ✅ Fetch cart
  const fetchCart = async () => {
    try {
      const res = await API.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  // ✅ Remove item
  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // ✅ Update quantity (UI only)
  const updateQuantity = (id, type) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        let newQty =
          type === "inc" ? item.quantity + 1 : item.quantity - 1;

        if (newQty < 1) newQty = 1;

        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCart(updatedCart);
  };

  // ✅ Total price
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 grid grid-cols-3 gap-6">

      {/* 🛒 CART ITEMS */}
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-4">🛒 Your Cart ({cart.length})</h2>

        {cart.length === 0 && (
          <p className="text-gray-500">Your cart is empty</p>
        )}

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-4 mb-4 rounded-xl shadow hover:shadow-lg transition"
          >
            {/* 🔥 LEFT: IMAGE + DETAILS */}
            <div className="flex gap-4 items-center">

              {/* ✅ PRODUCT IMAGE */}
              <img
                src={item.image}
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded"
              />

              {/* ✅ PRODUCT DETAILS */}
              <div>
                <h3 className="font-semibold text-lg">
                  {item.product_name}
                </h3>

                <p className="text-gray-600">₹{item.price}</p>

                {/* 🔢 QUANTITY */}
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, "dec")}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>

                  <span className="mx-3">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, "inc")}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 🔥 RIGHT: PRICE + REMOVE */}
            <div className="text-right">
              <p className="font-bold text-lg">
                ₹{item.price * item.quantity}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💳 SUMMARY */}
      <div className="border p-5 rounded-xl shadow h-fit">
        <h2 className="text-xl font-bold mb-4">Price Details</h2>

        <div className="flex justify-between mb-2">
          <span>Total Items</span>
          <span>{cart.length}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Total Price</span>
          <span>₹{total}</span>
        </div>

        <hr className="my-3" />

        <button className="bg-pink-500 text-white w-full py-2 rounded-lg hover:bg-pink-600">
          Place Order
        </button>
      </div>
    </div>
  );
}