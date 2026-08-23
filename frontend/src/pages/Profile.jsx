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
  });

  const [loading, setLoading] = useState(true);


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

      console.log("Profile Response:", response);

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
        !passwordData.newPassword
    ) {

      alert(
          "Please fill in both password fields."
      );

      return;
    }

    try {

      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert(
          response.data?.message ||
          "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

    } catch (error) {

      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to change password."
      );

    }
  };


  // ============================================================
  // Loading
  // ============================================================

  if (loading) {

    return (
        <h2 className="text-2xl font-bold">
          Loading Profile...
        </h2>
    );

  }


  return (

      <div>

        {/* Header */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold">
            Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your account information
          </p>

        </div>


        {/* Profile Information */}

        <form
            onSubmit={handleUpdateProfile}
            className="border rounded-xl p-6 max-w-3xl mb-6"
        >

          <h2 className="text-xl font-semibold mb-6">
            Profile Information
          </h2>


          {/* Full Name */}

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleProfileChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

          </div>


          {/* Email */}

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

          </div>


          {/* Role */}

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Role
            </label>

            <input
                type="text"
                value={profileData.role}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
            />

          </div>


          <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            Update Profile
          </button>

        </form>


        {/* Change Password */}

        <form
            onSubmit={handleChangePassword}
            className="border rounded-xl p-6 max-w-3xl"
        >

          <h2 className="text-xl font-semibold mb-6">
            Change Password
          </h2>


          {/* Current Password */}

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Current Password
            </label>

            <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

          </div>


          {/* New Password */}

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              New Password
            </label>

            <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

          </div>


          <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
          >
            Change Password
          </button>

        </form>

      </div>

  );
}

export default Profile;