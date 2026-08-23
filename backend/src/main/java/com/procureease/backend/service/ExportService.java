package com.procureease.backend.service;

import com.procureease.backend.entity.Invoice;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.repository.InvoiceRepository;
import com.procureease.backend.repository.PaymentRepository;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.PurchaseOrderRepository;
import com.procureease.backend.repository.SaleRepository;

import lombok.RequiredArgsConstructor;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExportService {

    private final ProductRepository productRepository;

    private final SaleRepository saleRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final InvoiceRepository invoiceRepository;

    private final PaymentRepository paymentRepository;


    // ============================================================
    // PRODUCTS - CSV
    // ============================================================

    public byte[] exportProductsCSV()
            throws IOException {

        List<Product> products =
                productRepository.findAll();

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream();

                OutputStreamWriter writer =
                        new OutputStreamWriter(
                                outputStream,
                                StandardCharsets.UTF_8
                        );

                CSVPrinter csvPrinter =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT.builder()
                                        .setHeader(
                                                "ID",
                                                "Product Name",
                                                "Vendor",
                                                "Price",
                                                "Stock"
                                        )
                                        .get()
                        )
        ) {

            for (Product product : products) {

                csvPrinter.printRecord(
                        product.getId(),
                        product.getName(),
                        product.getVendor().getName(),
                        product.getPrice(),
                        product.getStock()
                );
            }

            csvPrinter.flush();

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // PRODUCTS - EXCEL
    // ============================================================

    public byte[] exportProductsExcel()
            throws IOException {

        List<Product> products =
                productRepository.findAll();

        try (
                XSSFWorkbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            XSSFSheet sheet =
                    workbook.createSheet("Products");

            String[] headers = {
                    "ID",
                    "Product Name",
                    "Vendor",
                    "Price",
                    "Stock"
            };

            Row headerRow =
                    sheet.createRow(0);

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                headerRow
                        .createCell(i)
                        .setCellValue(headers[i]);
            }

            int rowNum = 1;

            for (Product product : products) {

                Row row =
                        sheet.createRow(rowNum++);

                row.createCell(0)
                        .setCellValue(
                                product.getId()
                        );

                row.createCell(1)
                        .setCellValue(
                                product.getName()
                        );

                row.createCell(2)
                        .setCellValue(
                                product.getVendor()
                                        .getName()
                        );

                row.createCell(3)
                        .setCellValue(
                                product.getPrice()
                                        .doubleValue()
                        );

                row.createCell(4)
                        .setCellValue(
                                product.getStock()
                        );
            }

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // PRODUCTS - PDF
    // ============================================================

    public byte[] exportProductsPDF()
            throws IOException {

        List<Product> products =
                productRepository.findAll();

        return createSimplePDF(
                "Products Report",
                new String[]{
                        "ID",
                        "Name",
                        "Vendor",
                        "Price",
                        "Stock"
                },
                products.stream()
                        .map(product ->
                                new String[]{
                                        String.valueOf(
                                                product.getId()
                                        ),
                                        product.getName(),
                                        product.getVendor()
                                                .getName(),
                                        product.getPrice()
                                                .toString(),
                                        String.valueOf(
                                                product.getStock()
                                        )
                                }
                        )
                        .toList()
        );
    }


    // ============================================================
    // SALES - CSV
    // ============================================================

    public byte[] exportSalesCSV()
            throws IOException {

        List<Sale> sales =
                saleRepository.findAll();

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream();

                OutputStreamWriter writer =
                        new OutputStreamWriter(
                                outputStream,
                                StandardCharsets.UTF_8
                        );

                CSVPrinter csvPrinter =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT.builder()
                                        .setHeader(
                                                "ID",
                                                "Product",
                                                "Quantity",
                                                "Total Amount",
                                                "Sale Date"
                                        )
                                        .get()
                        )
        ) {

            for (Sale sale : sales) {

                csvPrinter.printRecord(
                        sale.getId(),
                        sale.getProduct().getName(),
                        sale.getQuantity(),
                        sale.getTotalAmount(),
                        sale.getCreatedAt()
                );
            }

            csvPrinter.flush();

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // SALES - EXCEL
    // ============================================================

    public byte[] exportSalesExcel()
            throws IOException {

        List<Sale> sales =
                saleRepository.findAll();

        try (
                XSSFWorkbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            XSSFSheet sheet =
                    workbook.createSheet("Sales");

            String[] headers = {
                    "ID",
                    "Product",
                    "Quantity",
                    "Total Amount",
                    "Sale Date"
            };

            Row headerRow =
                    sheet.createRow(0);

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                headerRow
                        .createCell(i)
                        .setCellValue(headers[i]);
            }

            int rowNum = 1;

            for (Sale sale : sales) {

                Row row =
                        sheet.createRow(rowNum++);

                row.createCell(0)
                        .setCellValue(
                                sale.getId()
                        );

                row.createCell(1)
                        .setCellValue(
                                sale.getProduct()
                                        .getName()
                        );

                row.createCell(2)
                        .setCellValue(
                                sale.getQuantity()
                        );

                row.createCell(3)
                        .setCellValue(
                                sale.getTotalAmount()
                                        .doubleValue()
                        );

                row.createCell(4)
                        .setCellValue(
                                sale.getCreatedAt()
                                        .toString()
                        );
            }

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // SALES - PDF
    // ============================================================

    public byte[] exportSalesPDF()
            throws IOException {

        List<Sale> sales =
                saleRepository.findAll();

        return createSimplePDF(
                "Sales Report",
                new String[]{
                        "ID",
                        "Product",
                        "Quantity",
                        "Amount",
                        "Date"
                },
                sales.stream()
                        .map(sale ->
                                new String[]{
                                        String.valueOf(
                                                sale.getId()
                                        ),
                                        sale.getProduct()
                                                .getName(),
                                        String.valueOf(
                                                sale.getQuantity()
                                        ),
                                        sale.getTotalAmount()
                                                .toString(),
                                        sale.getCreatedAt()
                                                .toString()
                                }
                        )
                        .toList()
        );
    }


    // ============================================================
    // PURCHASE ORDERS - CSV
    // ============================================================

    public byte[] exportPurchaseOrdersCSV()
            throws IOException {

        List<PurchaseOrder> purchaseOrders =
                purchaseOrderRepository
                        .findAllWithDetails();

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream();

                OutputStreamWriter writer =
                        new OutputStreamWriter(
                                outputStream,
                                StandardCharsets.UTF_8
                        );

                CSVPrinter csvPrinter =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT.builder()
                                        .setHeader(
                                                "ID",
                                                "Vendor",
                                                "Total Amount",
                                                "Status",
                                                "Created At"
                                        )
                                        .get()
                        )
        ) {

            for (
                    PurchaseOrder purchaseOrder :
                    purchaseOrders
            ) {

                csvPrinter.printRecord(
                        purchaseOrder.getId(),
                        purchaseOrder.getVendor()
                                .getName(),
                        purchaseOrder.getTotalAmount(),
                        purchaseOrder.getStatus(),
                        purchaseOrder.getCreatedAt()
                );
            }

            csvPrinter.flush();

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // PURCHASE ORDERS - EXCEL
    // ============================================================

    public byte[] exportPurchaseOrdersExcel()
            throws IOException {

        List<PurchaseOrder> purchaseOrders =
                purchaseOrderRepository
                        .findAllWithDetails();

        try (
                XSSFWorkbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            XSSFSheet sheet =
                    workbook.createSheet(
                            "Purchase Orders"
                    );

            String[] headers = {
                    "ID",
                    "Vendor",
                    "Total Amount",
                    "Status",
                    "Created At"
            };

            Row headerRow =
                    sheet.createRow(0);

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                headerRow
                        .createCell(i)
                        .setCellValue(headers[i]);
            }

            int rowNum = 1;

            for (
                    PurchaseOrder purchaseOrder :
                    purchaseOrders
            ) {

                Row row =
                        sheet.createRow(rowNum++);

                row.createCell(0)
                        .setCellValue(
                                purchaseOrder.getId()
                        );

                row.createCell(1)
                        .setCellValue(
                                purchaseOrder.getVendor()
                                        .getName()
                        );

                row.createCell(2)
                        .setCellValue(
                                purchaseOrder
                                        .getTotalAmount()
                                        .doubleValue()
                        );

                row.createCell(3)
                        .setCellValue(
                                purchaseOrder.getStatus()
                        );

                row.createCell(4)
                        .setCellValue(
                                purchaseOrder
                                        .getCreatedAt()
                                        .toString()
                        );
            }

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // PURCHASE ORDERS - PDF
    // ============================================================

    public byte[] exportPurchaseOrdersPDF()
            throws IOException {

        List<PurchaseOrder> purchaseOrders =
                purchaseOrderRepository
                        .findAllWithDetails();

        return createSimplePDF(
                "Purchase Orders Report",
                new String[]{
                        "ID",
                        "Vendor",
                        "Amount",
                        "Status",
                        "Created At"
                },
                purchaseOrders.stream()
                        .map(purchaseOrder ->
                                new String[]{
                                        String.valueOf(
                                                purchaseOrder.getId()
                                        ),
                                        purchaseOrder.getVendor()
                                                .getName(),
                                        purchaseOrder
                                                .getTotalAmount()
                                                .toString(),
                                        purchaseOrder.getStatus(),
                                        purchaseOrder
                                                .getCreatedAt()
                                                .toString()
                                }
                        )
                        .toList()
        );
    }


    // ============================================================
    // INVOICES - CSV
    // ============================================================

    public byte[] exportInvoicesCSV()
            throws IOException {

        List<Invoice> invoices =
                invoiceRepository
                        .findAllWithPurchaseOrder();

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream();

                OutputStreamWriter writer =
                        new OutputStreamWriter(
                                outputStream,
                                StandardCharsets.UTF_8
                        );

                CSVPrinter csvPrinter =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT.builder()
                                        .setHeader(
                                                "ID",
                                                "Invoice Number",
                                                "Purchase Order ID",
                                                "Invoice Date",
                                                "Status",
                                                "Payment Status"
                                        )
                                        .get()
                        )
        ) {

            for (Invoice invoice : invoices) {

                csvPrinter.printRecord(
                        invoice.getId(),
                        invoice.getInvoiceNumber(),
                        invoice.getPurchaseOrder()
                                .getId(),
                        invoice.getInvoiceDate(),
                        invoice.getStatus(),
                        invoice.getPaymentStatus()
                );
            }

            csvPrinter.flush();

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // INVOICES - EXCEL
    // ============================================================

    public byte[] exportInvoicesExcel()
            throws IOException {

        List<Invoice> invoices =
                invoiceRepository
                        .findAllWithPurchaseOrder();

        try (
                XSSFWorkbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            XSSFSheet sheet =
                    workbook.createSheet("Invoices");

            String[] headers = {
                    "ID",
                    "Invoice Number",
                    "Purchase Order ID",
                    "Invoice Date",
                    "Status",
                    "Payment Status"
            };

            Row headerRow =
                    sheet.createRow(0);

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                headerRow
                        .createCell(i)
                        .setCellValue(headers[i]);
            }

            int rowNum = 1;

            for (Invoice invoice : invoices) {

                Row row =
                        sheet.createRow(rowNum++);

                row.createCell(0)
                        .setCellValue(
                                invoice.getId()
                        );

                row.createCell(1)
                        .setCellValue(
                                invoice.getInvoiceNumber()
                        );

                row.createCell(2)
                        .setCellValue(
                                invoice.getPurchaseOrder()
                                        .getId()
                        );

                row.createCell(3)
                        .setCellValue(
                                invoice.getInvoiceDate()
                                        .toString()
                        );

                row.createCell(4)
                        .setCellValue(
                                invoice.getStatus()
                        );

                row.createCell(5)
                        .setCellValue(
                                invoice.getPaymentStatus()
                        );
            }

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // INVOICES - PDF
    // ============================================================

    public byte[] exportInvoicesPDF()
            throws IOException {

        List<Invoice> invoices =
                invoiceRepository
                        .findAllWithPurchaseOrder();

        return createSimplePDF(
                "Invoices Report",
                new String[]{
                        "ID",
                        "Invoice Number",
                        "PO ID",
                        "Invoice Date",
                        "Status",
                        "Payment"
                },
                invoices.stream()
                        .map(invoice ->
                                new String[]{
                                        String.valueOf(
                                                invoice.getId()
                                        ),
                                        invoice.getInvoiceNumber(),
                                        String.valueOf(
                                                invoice
                                                        .getPurchaseOrder()
                                                        .getId()
                                        ),
                                        invoice.getInvoiceDate()
                                                .toString(),
                                        invoice.getStatus(),
                                        invoice.getPaymentStatus()
                                }
                        )
                        .toList()
        );
    }


    // ============================================================
    // PAYMENTS - CSV
    // ============================================================

    public byte[] exportPaymentsCSV()
            throws IOException {

        List<Invoice> payments =
                paymentRepository.findByPaymentStatus(
                        "Paid"
                );

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream();

                OutputStreamWriter writer =
                        new OutputStreamWriter(
                                outputStream,
                                StandardCharsets.UTF_8
                        );

                CSVPrinter csvPrinter =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT.builder()
                                        .setHeader(
                                                "Invoice Number",
                                                "Vendor",
                                                "Amount",
                                                "Payment Method",
                                                "Transaction ID",
                                                "Payment Date"
                                        )
                                        .get()
                        )
        ) {

            for (Invoice payment : payments) {

                csvPrinter.printRecord(
                        payment.getInvoiceNumber(),
                        payment.getPurchaseOrder()
                                .getVendor()
                                .getName(),
                        payment.getPurchaseOrder()
                                .getTotalAmount(),
                        payment.getPaymentMethod(),
                        payment.getTransactionId(),
                        payment.getPaymentDate()
                );
            }

            csvPrinter.flush();

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // PAYMENTS - EXCEL
    // ============================================================

    public byte[] exportPaymentsExcel()
            throws IOException {

        List<Invoice> payments =
                paymentRepository.findByPaymentStatus(
                        "Paid"
                );

        try (
                XSSFWorkbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            XSSFSheet sheet =
                    workbook.createSheet("Payments");

            String[] headers = {
                    "Invoice Number",
                    "Vendor",
                    "Amount",
                    "Payment Method",
                    "Transaction ID",
                    "Payment Date"
            };

            Row headerRow =
                    sheet.createRow(0);

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                headerRow
                        .createCell(i)
                        .setCellValue(headers[i]);
            }

            int rowNum = 1;

            for (Invoice payment : payments) {

                Row row =
                        sheet.createRow(rowNum++);

                row.createCell(0)
                        .setCellValue(
                                payment.getInvoiceNumber()
                        );

                row.createCell(1)
                        .setCellValue(
                                payment.getPurchaseOrder()
                                        .getVendor()
                                        .getName()
                        );

                row.createCell(2)
                        .setCellValue(
                                payment.getPurchaseOrder()
                                        .getTotalAmount()
                                        .doubleValue()
                        );

                row.createCell(3)
                        .setCellValue(
                                payment.getPaymentMethod()
                        );

                row.createCell(4)
                        .setCellValue(
                                payment.getTransactionId()
                        );

                row.createCell(5)
                        .setCellValue(
                                payment.getPaymentDate()
                                        .toString()
                        );
            }

            for (
                    int i = 0;
                    i < headers.length;
                    i++
            ) {

                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // PAYMENTS - PDF
    // ============================================================

    public byte[] exportPaymentsPDF()
            throws IOException {

        List<Invoice> payments =
                paymentRepository.findByPaymentStatus(
                        "Paid"
                );

        return createSimplePDF(
                "Payments Report",
                new String[]{
                        "Invoice",
                        "Vendor",
                        "Amount",
                        "Method",
                        "Transaction ID",
                        "Payment Date"
                },
                payments.stream()
                        .map(payment ->
                                new String[]{
                                        payment.getInvoiceNumber(),
                                        payment.getPurchaseOrder()
                                                .getVendor()
                                                .getName(),
                                        payment.getPurchaseOrder()
                                                .getTotalAmount()
                                                .toString(),
                                        payment.getPaymentMethod(),
                                        payment.getTransactionId(),
                                        payment.getPaymentDate()
                                                .toString()
                                }
                        )
                        .toList()
        );
    }


    // ============================================================
    // COMMON PDF METHOD
    // ============================================================

    private byte[] createSimplePDF(
            String title,
            String[] headers,
            List<String[]> data
    ) throws IOException {

        try (
                PDDocument document =
                        new PDDocument();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            PDPage page =
                    new PDPage(
                            PDRectangle.A4
                    );

            document.addPage(page);

            PDType1Font font =
                    new PDType1Font(
                            Standard14Fonts.FontName.HELVETICA
                    );

            PDType1Font boldFont =
                    new PDType1Font(
                            Standard14Fonts.FontName.HELVETICA_BOLD
                    );

            try (
                    PDPageContentStream contentStream =
                            new PDPageContentStream(
                                    document,
                                    page
                            )
            ) {

                float margin = 40;
                float yPosition =
                        page.getMediaBox()
                                .getHeight()
                                - margin;

                contentStream.beginText();

                contentStream.setFont(
                        boldFont,
                        16
                );

                contentStream.newLineAtOffset(
                        margin,
                        yPosition
                );

                contentStream.showText(title);

                contentStream.endText();

                yPosition -= 40;

                float tableWidth =
                        page.getMediaBox()
                                .getWidth()
                                - (2 * margin);

                float columnWidth =
                        tableWidth / headers.length;

                // Headers
                for (
                        int i = 0;
                        i < headers.length;
                        i++
                ) {

                    contentStream.beginText();

                    contentStream.setFont(
                            boldFont,
                            8
                    );

                    contentStream.newLineAtOffset(
                            margin + (
                                    i * columnWidth
                            ),
                            yPosition
                    );

                    contentStream.showText(
                            truncate(
                                    headers[i],
                                    18
                            )
                    );

                    contentStream.endText();
                }

                yPosition -= 20;

                // Data
                for (String[] row : data) {

                    if (yPosition < 40) {
                        break;
                    }

                    for (
                            int i = 0;
                            i < row.length;
                            i++
                    ) {

                        contentStream.beginText();

                        contentStream.setFont(
                                font,
                                7
                        );

                        contentStream.newLineAtOffset(
                                margin + (
                                        i * columnWidth
                                ),
                                yPosition
                        );

                        contentStream.showText(
                                truncate(
                                        row[i] == null
                                                ? ""
                                                : row[i],
                                        18
                                )
                        );

                        contentStream.endText();
                    }

                    yPosition -= 15;
                }
            }

            document.save(outputStream);

            return outputStream.toByteArray();
        }
    }


    // ============================================================
    // TRUNCATE TEXT FOR PDF
    // ============================================================

    private String truncate(
            String value,
            int maxLength
    ) {

        if (value == null) {
            return "";
        }

        if (value.length() <= maxLength) {
            return value;
        }

        return value.substring(
                0,
                maxLength - 3
        ) + "...";
    }
}