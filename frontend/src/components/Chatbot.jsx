import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import products from "../data/products";
import { CartContext } from "../context/CartContext";

export default function Chatbot({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();

  // 🎯 SMART FILTER CHIPS
  const quickFilters = [
    "shirts",
    "jeans",
    "shoes",
    "under 1000",
    "outfit ideas"
  ];

  const handleQuickFilter = (text) => {
    setInput(text);
    sendMessage(text); // 🚀 auto send
  };

  const sendMessage = async (customInput = null) => {
    const userText = customInput || input;
    if (!userText) return;

    setMessages((prev) => [
      ...prev,
      { user: userText, bot: null, typing: true, products: [] },
    ]);

    setInput("");

    try {
      const res = await API.post("/chat/", {
        user_id: userId,
        message: userText,
      });

      const data = res.data;

      let botMessage = {
        user: userText,
        bot: data.response || "🤖 No response",
        typing: false,
        products: [],
      };

      // 🔥 Attach products
      if (data.products && data.products.length > 0) {
        const matchedProducts = products.filter((p) =>
          data.products.includes(p.id)
        );
        botMessage.products = matchedProducts;
      }

      // 🔥 Confirm add
      if (data.action === "confirm_add") {
        const product = products.find(p => p.id === data.product_id);

        const confirmAdd = window.confirm(data.response);

        if (confirmAdd && product) {
          addToCart(product);
          botMessage.bot = "✅ Added to cart!";
        } else {
          botMessage.bot = "❌ Cancelled";
        }
      }

      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = botMessage;
          return updated;
        });
      }, 500);

    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          user: userText,
          bot: "❌ AI error",
          typing: false,
          products: [],
        };
        return updated;
      });
    }
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* 🤖 Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-110 transition"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-80 
        backdrop-blur-md bg-white/60 
        border border-white/40 
        shadow-xl rounded-2xl p-4">

          {/* 🎯 QUICK FILTERS */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickFilters.map((item, i) => (
              <button
                key={i}
                onClick={() => handleQuickFilter(item)}
                className="text-xs px-3 py-1 bg-white/80 border rounded-full hover:bg-pink-100 transition"
              >
                {item}
              </button>
            ))}
          </div>

          {/* 💬 CHAT */}
          <div className="h-60 overflow-y-auto space-y-3 mb-3">

            {messages.map((m, i) => (
              <div key={i}>

                {/* USER */}
                {m.user && (
                  <div className="flex justify-end">
                    <div className="bg-pink-500 text-white px-3 py-2 rounded-xl">
                      {m.user}
                    </div>
                  </div>
                )}

                {/* AI */}
                <div className="flex justify-start mt-1">
                  <div className="bg-white px-3 py-2 rounded-xl shadow-sm">
                    {m.typing ? "..." : m.bot}
                  </div>
                </div>

                {/* PRODUCTS */}
                {m.products && m.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.products.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 border p-2 rounded">

                        <img src={p.image} className="w-12 h-12 rounded" />

                        <div className="flex-1">
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-xs">₹{p.price}</p>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(p);

                            setMessages((prev) => [
                              ...prev,
                              {
                                user: null,
                                bot: `✅ ${p.name} added to cart`,
                                products: [],
                              },
                            ]);
                          }}
                          className="bg-pink-500 text-white px-2 py-1 text-xs rounded"
                        >
                          Add
                        </button>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* 🛍️ MINI CART */}
          {cart.length > 0 && (
            <div className="bg-white/80 p-3 rounded-xl shadow mb-3">
              <h3 className="text-sm font-semibold mb-2">🛍️ Your Cart</h3>

              <div className="space-y-1 text-xs max-h-24 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.product_name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-2 font-bold text-sm">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/checkout");
                }}
                className="mt-2 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                🛍️ Checkout
              </button>
            </div>
          )}

          {/* INPUT */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 rounded border"
            placeholder="Search products..."
          />

          {/* SEND */}
          <button
            onClick={() => sendMessage()}
            className="mt-2 w-full py-2 bg-pink-500 text-white rounded"
          >
            Send 🚀
          </button>
        </div>
      )}
    </>
  );
}