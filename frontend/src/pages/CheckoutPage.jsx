import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart } = useContext(CartContext);

  const [payment, setPayment] = useState("upi");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setOrderPlaced(true);
  };

  // 🎉 SUCCESS SCREEN
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-gray-600">Your order will be delivered soon 🚚</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 🔥 LEFT: ADDRESS + PAYMENT */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🏠 ADDRESS */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Delivery Address</h3>

            <input className="border p-2 w-full mb-2 rounded" placeholder="Full Name" />
            <input className="border p-2 w-full mb-2 rounded" placeholder="Phone Number" />
            <input className="border p-2 w-full mb-2 rounded" placeholder="Address" />
            <input className="border p-2 w-full mb-2 rounded" placeholder="City" />
            <input className="border p-2 w-full rounded" placeholder="Pincode" />
          </div>

          {/* 💳 PAYMENT */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Payment Method</h3>

            <div className="space-y-3">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={payment === "upi"}
                  onChange={() => setPayment("upi")}
                />
                UPI (Google Pay / PhonePe)
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                Credit / Debit Card
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                Cash on Delivery
              </label>
            </div>

            {/* 🔥 CONDITIONAL UI */}
            {payment === "upi" && (
              <input
                className="border p-2 w-full mt-3 rounded"
                placeholder="Enter UPI ID"
              />
            )}

            {payment === "card" && (
              <div className="space-y-2 mt-3">
                <input className="border p-2 w-full rounded" placeholder="Card Number" />
                <input className="border p-2 w-full rounded" placeholder="Expiry Date" />
                <input className="border p-2 w-full rounded" placeholder="CVV" />
              </div>
            )}
          </div>
        </div>

        {/* 🔥 RIGHT: ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">

          <h3 className="font-semibold mb-4">Order Summary</h3>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            onClick={handleOrder}
            className="w-full mt-6 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}