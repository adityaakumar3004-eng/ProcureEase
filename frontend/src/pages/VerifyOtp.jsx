import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function VerifyOtp() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email");

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/password-reset/verify-otp",
                {
                    email: email,
                    otp: otp,
                }
            );

            if (response.data.success) {
                navigate(
                    `/reset-password?email=${encodeURIComponent(email)}`
                );
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid or expired OTP."
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
                    Verify OTP
                </h2>

                <p className="text-center text-gray-500 mb-8">
                    Enter the OTP sent to your email.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-6">

                        <label className="block mb-2 font-medium">
                            OTP
                        </label>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            required
                            maxLength="6"
                            className="w-full border rounded-lg px-4 py-2 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default VerifyOtp;