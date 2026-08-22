import api from "./api";

const downloadFile = async (url, fileName) => {
    try {
        const response = await api.get(url, {
            responseType: "blob",
        });

        const blob = new Blob(
            [response.data],
            {
                type:
                    response.headers[
                        "content-type"
                        ],
            }
        );

        const downloadUrl =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = downloadUrl;

        link.setAttribute(
            "download",
            fileName
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
            downloadUrl
        );

    } catch (error) {

        console.error(
            "Export failed:",
            error
        );

        throw error;
    }
};


// ============================================================
// PRODUCTS
// ============================================================

export const exportProductsCSV = async () => {
    await downloadFile(
        "/export/products/csv",
        "products.csv"
    );
};

export const exportProductsExcel = async () => {
    await downloadFile(
        "/export/products/excel",
        "products.xlsx"
    );
};

export const exportProductsPDF = async () => {
    await downloadFile(
        "/export/products/pdf",
        "products.pdf"
    );
};


// ============================================================
// SALES
// ============================================================

export const exportSalesCSV = async () => {
    await downloadFile(
        "/export/sales/csv",
        "sales.csv"
    );
};

export const exportSalesExcel = async () => {
    await downloadFile(
        "/export/sales/excel",
        "sales.xlsx"
    );
};

export const exportSalesPDF = async () => {
    await downloadFile(
        "/export/sales/pdf",
        "sales.pdf"
    );
};


// ============================================================
// PURCHASE ORDERS
// ============================================================

export const exportPurchaseOrdersCSV =
    async () => {
        await downloadFile(
            "/export/purchase-orders/csv",
            "purchase-orders.csv"
        );
    };

export const exportPurchaseOrdersExcel =
    async () => {
        await downloadFile(
            "/export/purchase-orders/excel",
            "purchase-orders.xlsx"
        );
    };

export const exportPurchaseOrdersPDF =
    async () => {
        await downloadFile(
            "/export/purchase-orders/pdf",
            "purchase-orders.pdf"
        );
    };


// ============================================================
// INVOICES
// ============================================================

export const exportInvoicesCSV = async () => {
    await downloadFile(
        "/export/invoices/csv",
        "invoices.csv"
    );
};

export const exportInvoicesExcel = async () => {
    await downloadFile(
        "/export/invoices/excel",
        "invoices.xlsx"
    );
};

export const exportInvoicesPDF = async () => {
    await downloadFile(
        "/export/invoices/pdf",
        "invoices.pdf"
    );
};


// ============================================================
// PAYMENTS
// ============================================================

export const exportPaymentsCSV = async () => {
    await downloadFile(
        "/export/payments/csv",
        "payments.csv"
    );
};

export const exportPaymentsExcel = async () => {
    await downloadFile(
        "/export/payments/excel",
        "payments.xlsx"
    );
};

export const exportPaymentsPDF = async () => {
    await downloadFile(
        "/export/payments/pdf",
        "payments.pdf"
    );
};