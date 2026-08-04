import api from "./api";

// Get All Invoices
export const getInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

// Get Invoice By ID
export const getInvoiceById = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

// Create Invoice
export const createInvoice = async (formData) => {
  const response = await api.post(
    "/invoices",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Update Invoice
export const updateInvoice = async (
  id,
  formData
) => {
  const response = await api.put(
    `/invoices/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Mark Invoice as Paid
export const markInvoiceAsPaid = async (
  id,
  paymentData
) => {
  const response = await api.put(
    `/invoices/${id}/pay`,
    paymentData
  );

  return response.data;
};

// Delete Invoice
export const deleteInvoice = async (id) => {
  const response = await api.delete(
    `/invoices/${id}`
  );

  return response.data;
};