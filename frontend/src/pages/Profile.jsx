import { useEffect, useState } from "react";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/profileService";

function Profile() {
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  const [updatingProfile, setUpdatingProfile] =
      useState(false);

  const [changingPassword, setChangingPassword] =
      useState(false);

  // ============================================================
  // Fetch Profile
  // ============================================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();

      const profile = response.data.data;

      setProfileData({
        fullName: profile?.fullName || "",
        email: profile?.email || "",
        role: profile?.role || "",
      });
    } catch (error) {
      console.error(
          "Error fetching profile:",
          error
      );

      alert(
          error.response?.data?.message ||
          "Failed to fetch profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Handle Profile Input
  // ============================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // Update Profile
  // ============================================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setUpdatingProfile(true);

      const response = await updateProfile({
        fullName: profileData.fullName,
        email: profileData.email,
      });

      alert(
          response.data?.message ||
          "Profile updated successfully."
      );

      await fetchProfile();
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setUpdatingProfile(false);
    }
  };

  // ============================================================
  // Handle Password Input
  // ============================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // Change Password
  // ============================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (
        passwordData.newPassword !==
        passwordData.confirmPassword
    ) {
      alert(
          "New password and confirm password do not match."
      );

      return;
    }

    try {
      setChangingPassword(true);

      const response = await changePassword({
        currentPassword:
        passwordData.currentPassword,

        newPassword:
        passwordData.newPassword,
      });

      alert(
          response.data?.message ||
          "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
        <div>
          <h2 className="text-xl font-semibold">
            Loading Profile...
          </h2>
        </div>
    );
  }

  return (
      <div className="max-w-5xl">

        {/* ====================================================== */}
        {/* Profile Information */}
        {/* ====================================================== */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-gray-800">
              Profile Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update your personal account information.
            </p>

          </div>

          <form onSubmit={handleUpdateProfile}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Name */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>

                <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

              </div>

              {/* Email */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>

                <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

              </div>

              {/* Role */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Role
                </label>

                <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                />

              </div>

            </div>

            {/* Button */}

            <div className="flex justify-end mt-6 pt-5 border-t">

              <button
                  type="submit"
                  disabled={updatingProfile}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                {updatingProfile
                    ? "Updating..."
                    : "Update Profile"}
              </button>

            </div>

          </form>

        </div>

        {/* ====================================================== */}
        {/* Change Password */}
        {/* ====================================================== */}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-gray-800">
              Change Password
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Choose a strong password to keep your account secure.
            </p>

          </div>

          <form onSubmit={handleChangePassword}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Current Password */}

              <div className="md:col-span-2">

                <label className="block mb-2 font-medium text-gray-700">
                  Current Password
                </label>

                <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

              </div>

              {/* New Password */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  New Password
                </label>

                <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

              </div>

              {/* Confirm Password */}

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Confirm New Password
                </label>

                <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

              </div>

            </div>

            {/* Button */}

            <div className="flex justify-end mt-6 pt-5 border-t">

              <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
              </button>

            </div>

          </form>

        </div>

      </div>
  );
}

export default Profile;