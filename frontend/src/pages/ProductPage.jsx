import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/products";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

export default function ProductPage() {
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const navigate = useNavigate();

  // 🎬 Animation
  const flyToCart = (imgElement) => {
    const cart = document.getElementById("cart-icon");
    if (!cart || !imgElement) return;

    const imgRect = imgElement.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const clone = imgElement.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.top = imgRect.top + "px";
    clone.style.left = imgRect.left + "px";
    clone.style.width = imgRect.width + "px";
    clone.style.height = imgRect.height + "px";
    clone.style.zIndex = "9999";
    clone.style.transition = "all 0.8s ease-in-out";

    document.body.appendChild(clone);

    setTimeout(() => {
      clone.style.top = cartRect.top + "px";
      clone.style.left = cartRect.left + "px";
      clone.style.width = "40px";
      clone.style.height = "40px";
      clone.style.opacity = "0.5";
    }, 10);

    setTimeout(() => clone.remove(), 800);
  };

  const shakeCart = () => {
    const cart = document.getElementById("cart-icon");
    if (!cart) return;

    cart.classList.add("animate-bounce");
    setTimeout(() => cart.classList.remove("animate-bounce"), 500);
  };

  // 🔥 CATEGORY
  useEffect(() => {
    const handleCategory = (e) => setCategory(e.detail);
    window.addEventListener("categoryChange", handleCategory);
    return () => window.removeEventListener("categoryChange", handleCategory);
  }, []);

  // 🔥 TYPE FILTER
  useEffect(() => {
    const handleFilter = (e) => setType(e.detail);
    window.addEventListener("filterProducts", handleFilter);
    return () => window.removeEventListener("filterProducts", handleFilter);
  }, []);

  // 🔥 SEARCH
  useEffect(() => {
    const handleSearch = (e) => setSearch(e.detail.toLowerCase());
    window.addEventListener("searchProducts", handleSearch);
    return () => window.removeEventListener("searchProducts", handleSearch);
  }, []);

  // 🔥 AI RECOMMEND
  useEffect(() => {
    const handleRecommend = (e) => {
      const ids = e.detail;

      const recommended = productsData.filter(p =>
        ids.includes(p.id)
      );

      if (recommended.length > 0) {
        setFilteredProducts(recommended);
      }
    };

    window.addEventListener("aiRecommendProducts", handleRecommend);

    return () =>
      window.removeEventListener("aiRecommendProducts", handleRecommend);
  }, []);

  // 🔥 AI ADD TO CART (FIXED ✅)
  useEffect(() => {
    const handleAIAdd = (e) => {
      let product = null;

      // ✅ Support BOTH formats (object OR id)
      if (typeof e.detail === "object") {
        product = e.detail;
      } else {
        product = productsData.find(p => p.id === e.detail);
      }

      if (product) {
        const img = document.getElementById(`product-img-${product.id}`);

        flyToCart(img);
        addToCart(product);
        shakeCart();

        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    };

    window.addEventListener("aiAddToCart", handleAIAdd);

    return () => window.removeEventListener("aiAddToCart", handleAIAdd);
  }, [addToCart]);

  // 🔥 FINAL FILTER
  useEffect(() => {
    let result = productsData;

    if (category !== "all") {
      result = result.filter(p => p.category === category);
    }

    if (type !== "all") {
      result = result.filter(p => p.type === type);
    }

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.type.toLowerCase().includes(search)
      );
    }

    setFilteredProducts(result);
  }, [category, type, search]);

  return (
    <div className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const isWishlisted = wishlist.some((item) => item.id === p.id);

          return (
            <div key={p.id} className="relative border p-4 rounded shadow hover:shadow-lg">

              {/* ❤️ Wishlist */}
              <button
                onClick={() => toggleWishlist(p)}
                className="absolute top-2 right-2 text-xl"
              >
                {isWishlisted ? "❤️" : "🤍"}
              </button>

              <img
                src={p.image}
                alt={p.name}
                id={`product-img-${p.id}`}
                onClick={() => navigate(`/product/${p.id}`)}
                className="w-full h-40 object-cover rounded cursor-pointer"
              />

              <h2 className="font-bold mt-2">{p.name}</h2>
              <p>₹{p.price}</p>

              <button
                onClick={() => {
                  const img = document.getElementById(`product-img-${p.id}`);

                  flyToCart(img);
                  addToCart(p);
                  shakeCart();

                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
                className="bg-pink-500 text-white px-4 py-2 mt-2 w-full rounded hover:bg-pink-600"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded animate-bounce">
          ✅ Item added to cart!
        </div>
      )}
    </div>
  );
}