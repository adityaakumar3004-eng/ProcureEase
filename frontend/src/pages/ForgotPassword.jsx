import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/password-reset/send-otp",
                {
                    email: email,
                }
            );

            if (response.data.success) {
                navigate(
                    `/verify-otp?email=${encodeURIComponent(email)}`
                );
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to send OTP. Please try again."
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

                <h2 className="text-xl font-semibold text-center mb-2">
                    Forgot Password?
                </h2>

                <p className="text-center text-gray-500 mb-8">
                    Enter your registered email to receive an OTP.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-6">

                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                    >
                        {loading ? "Sending OTP..." : "Continue"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm">

                    Remember your password?{" "}

                    <Link
                        to="/"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;