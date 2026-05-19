import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import products from "../data/products";

export default function Navbar() {
  const { cart } = useContext(CartContext);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef();
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const trending = ["shirt", "jeans", "shoes", "kids", "women"];

  const handleCategory = (cat) => {
    window.dispatchEvent(
      new CustomEvent("categoryChange", { detail: cat })
    );
  };

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  // 🔍 SEARCH
  const handleSearch = (value) => {
    setSearch(value);

    window.dispatchEvent(
      new CustomEvent("searchProducts", {
        detail: value.toLowerCase(),
      })
    );

    if (value) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  // 🎤 VOICE
  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      handleSearch(text);
    };
  };

  // CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">

      {/* LOGO */}
      <h1
        onClick={() => handleCategory("all")}
        className="text-2xl font-bold text-pink-600 cursor-pointer"
      >
        Myntra
      </h1>

      {/* NAV */}
      <div className="space-x-6 font-medium flex items-center">
        <Link to="/" onClick={() => handleCategory("men")}>Men</Link>
        <Link to="/" onClick={() => handleCategory("women")}>Women</Link>
        <Link to="/" onClick={() => handleCategory("kids")}>Kids</Link>

        <Link to="/wishlist">❤️ Wishlist</Link>

        <Link to="/cart" id="cart-icon" className="relative">
          🛒 Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs px-2 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        {/* 👤 USER + LOGOUT */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">👤 {user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {/* SEARCH */}
      <div className="relative w-80">

        <input
          ref={inputRef}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-pink-400"
          placeholder="Search for products..."
        />

        <button
          onClick={handleVoice}
          className="absolute right-2 top-2"
        >
          🎤
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-12 w-full bg-white shadow-xl rounded-lg p-3 z-50"
          >
            {!search && (
              <>
                <p className="text-sm text-gray-500 mb-2">Trending</p>
                <div className="flex flex-wrap gap-2">
                  {trending.map((item) => (
                    <span
                      key={item}
                      onClick={() => handleSearch(item)}
                      className="bg-gray-100 px-3 py-1 rounded cursor-pointer"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}

            {search && suggestions.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              >
                <img src={p.image} className="w-8 h-8" />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}