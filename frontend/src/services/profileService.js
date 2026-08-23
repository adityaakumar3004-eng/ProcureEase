import api from "./api";

// ============================================================
// Get Profile
// ============================================================

export const getProfile = async () => {
    return await api.get("/profile");
};


// ============================================================
// Update Profile
// ============================================================

export const updateProfile = async (data) => {
    return await api.put("/profile", data);
};


// ============================================================
// Change Password
// ============================================================

export const changePassword = async (data) => {
    return await api.put(
        "/profile/change-password",
        data
    );
};