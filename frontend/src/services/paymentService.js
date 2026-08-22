import api from "./api";

// Get All Payments
export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};
