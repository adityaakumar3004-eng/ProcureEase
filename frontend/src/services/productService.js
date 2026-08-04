import api from "./api";

// Get Products
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

// Create Product
export const createProduct = async (formData) => {
  const response = await api.post(
    "/products",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Update Product
export const updateProduct = async (
  id,
  formData
) => {
  const response = await api.put(
    `/products/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};