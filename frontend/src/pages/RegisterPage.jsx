import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/user/register/", {
        username: name,
        email: email,
        password: password,
      });

      alert("Account created 🎉");

      // ✅ GO TO LOGIN
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <input
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
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
          onClick={handleRegister}
          className="w-full bg-pink-500 text-white py-3 rounded-lg"
        >
          REGISTER
        </button>
      </div>
    </div>
  );
}