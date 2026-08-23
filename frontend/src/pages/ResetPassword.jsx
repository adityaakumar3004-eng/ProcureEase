import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (newPassword !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }

        if (newPassword.length < 6) {

            setError("Password must be at least 6 characters.");

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/password-reset/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email,
                        newPassword: newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message || "Failed to reset password."
                );

                return;
            }

            alert("Password reset successfully!");

            navigate("/");

        } catch (error) {

            setError(
                "Something went wrong. Please try again."
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
                    Reset Password
                </h2>

                <p className="text-center text-gray-500 mb-8">
                    Create a new password for your account.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">

                        <label className="block mb-2 font-medium">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div className="mb-6">

                        <label className="block mb-2 font-medium">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm new password"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading
                            ? "Resetting Password..."
                            : "Reset Password"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ResetPassword;