import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart ({totalItems})</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <div className="flex flex-col justify-between flex-1">

                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>

                    <p className="text-gray-500 text-sm capitalize">
                      {item.category} • {item.type}
                    </p>

                    {/* 🧵 SIZE */}
                    {item.size && (
                      <p className="text-sm text-gray-500">
                        Size: {item.size}
                      </p>
                    )}

                    <p className="font-bold mt-1">₹{item.price}</p>
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center justify-between mt-3">

                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>

                      <span className="px-4">{item.quantity}</span>

                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, true)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">

          <h3 className="text-lg font-semibold mb-4">Price Details</h3>

          <div className="space-y-2 text-gray-600">

            <div className="flex justify-between">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Price</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ₹0</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>

          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition transform hover:scale-105"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}