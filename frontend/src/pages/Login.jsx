import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);

      login(response.token, response.user);

      navigate("/dashboard");
    } catch (err) {
      setError(
          err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
            ProcureEase
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Login to your account
          </p>

          {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}

            <div className="mb-2">
              <label className="block mb-2 font-medium">
                Password
              </label>

              <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Forgot Password */}

            <div className="text-right mb-6">
              <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
                to="/register"
                className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
  );
}

export default Login;