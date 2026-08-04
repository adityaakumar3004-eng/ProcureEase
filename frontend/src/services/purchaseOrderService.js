import api from "./api";

// Get All Purchase Orders
export const getPurchaseOrders = async () => {
  const response = await api.get("/purchase-orders");
  return response.data;
};

// Get Purchase Order By ID
export const getPurchaseOrderById = async (id) => {
  const response = await api.get(`/purchase-orders/${id}`);
  return response.data;
};

// Create Purchase Order
export const createPurchaseOrder = async (purchaseOrderData) => {
  const response = await api.post(
    "/purchase-orders",
    purchaseOrderData
  );

  return response.data;
};

// Update Purchase Order Status
export const updatePurchaseOrderStatus = async (
  id,
  status
) => {
  const response = await api.put(
    `/purchase-orders/${id}/status`,
    { status }
  );

  return response.data;
};