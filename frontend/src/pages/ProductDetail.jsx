import { useParams } from "react-router-dom";
import products from "../data/products";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return <p>Product not found</p>;

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

      <img
        src={product.image}
        className="w-full h-96 object-cover rounded-xl"
      />

      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-500 capitalize">{product.category}</p>
        <p className="text-xl font-bold mt-2">₹{product.price}</p>

        {/* SIZE */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Select Size</h3>

          <div className="flex gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border px-4 py-2 rounded-full ${
                  selectedSize === size
                    ? "bg-pink-500 text-white"
                    : "hover:border-pink-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ADD */}
        <button
          onClick={() => {
            if (!selectedSize) {
              alert("Please select size");
              return;
            }

            addToCart({ ...product, size: selectedSize });
          }}
          className="mt-6 bg-pink-500 text-white px-6 py-3 rounded-lg w-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}