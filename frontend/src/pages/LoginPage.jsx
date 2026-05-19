import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await API.post("/user/login/", {
        email,
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      // ✅ STORE USER
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Login successful 🎉");

      // ✅ NAVIGATE HOME
      navigate("/");

      // 🔥 FORCE UI UPDATE
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to Myntra
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-pink-500 text-white py-3 rounded-lg"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}