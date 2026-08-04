import api from "./api";

// Get All Vendors
export const getVendors = async () => {
  const response = await api.get("/vendors");
  return response.data;
};

// Create Vendor
export const createVendor = async (vendorData) => {
  const response = await api.post("/vendors", vendorData);
  return response.data;
};

// Update Vendor
export const updateVendor = async (id, vendorData) => {
  const response = await api.put(`/vendors/${id}`, vendorData);
  return response.data;
};

// Delete Vendor
export const deleteVendor = async (id) => {
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
};