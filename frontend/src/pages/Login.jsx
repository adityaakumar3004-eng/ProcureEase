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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4">

        <div className="w-full max-w-md">

          {/* Login Card */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 sm:p-10">

            {/* Logo */}

            <div className="text-center mb-8">

              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">

              <span className="text-white text-2xl font-bold">
                P
              </span>

              </div>

              <h1 className="text-3xl font-bold text-gray-800">

                <span>Procure</span>

                <span className="text-blue-600">
                Ease
              </span>

              </h1>

              <p className="text-gray-500 mt-2">
                Sign in to continue to your account
              </p>

            </div>

            {/* Error Message */}

            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              <span className="font-bold">
                !
              </span>

                  <span>
                {error}
              </span>

                </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Email */}

              <div className="mb-5">

                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">

                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12H8m8 0a4 4 0 100-8H8a4 4 0 000 8m8 0v4a4 4 0 01-4 4h0a4 4 0 01-4-4v-4"
                    />
                  </svg>

                </span>

                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Password */}

              <div className="mb-2">

                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">

                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm-6 9v-2a6 6 0 0112 0v2"
                    />
                  </svg>

                </span>

                  <input
                      type={
                        showPassword
                            ? "text"
                            : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-12 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                      type="button"
                      onClick={() =>
                          setShowPassword(
                              (prev) => !prev
                          )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showPassword
                        ? "Hide"
                        : "Show"}
                  </button>

                </div>

              </div>

              {/* Forgot Password */}

              <div className="flex justify-end mb-7">

                <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Login Button */}

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {loading
                    ? "Logging in..."
                    : "Login"}
              </button>

            </form>

            {/* Divider */}

            <div className="my-7 border-t border-gray-200" />

            {/* Register */}

            <p className="text-center text-sm text-gray-600">

              Don't have an account?{" "}

              <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Register
              </Link>

            </p>

          </div>

          {/* Footer */}



        </div>

      </div>
  );
}

export default Login;