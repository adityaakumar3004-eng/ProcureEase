import api from "./api";

// Get All Sales
export const getSales = async () => {
    const response = await api.get("/sales");

    return response.data;
};

// Create Sale
export const createSale = async (saleData) => {
    const response = await api.post(
        "/sales",
        saleData
    );

    return response.data;
};