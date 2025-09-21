import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid username or password");
        return;
      }

      const admin = querySnapshot.docs[0].data();

      // Check password
      if (admin.password === password) {
        // Save login state in localStorage
        localStorage.setItem("adminLoggedIn", "true");

        navigate("/admin"); // redirect to admin panel
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Error fetching admin:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Admin Login
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-b border-gray-400 focus:outline-none px-2 py-1"
            required
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-400 focus:outline-none px-2 py-1"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-7 text-gray-600 px-2 py-1"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
