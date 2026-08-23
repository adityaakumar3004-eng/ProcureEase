package com.procureease.backend.controller;

import com.procureease.backend.service.ExportService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;


    // ============================================================
    // PRODUCTS
    // ============================================================

    @GetMapping("/products/csv")
    public ResponseEntity<byte[]>
    exportProductsCSV()
            throws IOException {

        byte[] data =
                exportService.exportProductsCSV();

        return createResponse(
                data,
                "products.csv",
                "text/csv"
        );
    }


    @GetMapping("/products/excel")
    public ResponseEntity<byte[]>
    exportProductsExcel()
            throws IOException {

        byte[] data =
                exportService.exportProductsExcel();

        return createResponse(
                data,
                "products.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    }


    @GetMapping("/products/pdf")
    public ResponseEntity<byte[]>
    exportProductsPDF()
            throws IOException {

        byte[] data =
                exportService.exportProductsPDF();

        return createResponse(
                data,
                "products.pdf",
                "application/pdf"
        );
    }


    // ============================================================
    // SALES
    // ============================================================

    @GetMapping("/sales/csv")
    public ResponseEntity<byte[]>
    exportSalesCSV()
            throws IOException {

        byte[] data =
                exportService.exportSalesCSV();

        return createResponse(
                data,
                "sales.csv",
                "text/csv"
        );
    }


    @GetMapping("/sales/excel")
    public ResponseEntity<byte[]>
    exportSalesExcel()
            throws IOException {

        byte[] data =
                exportService.exportSalesExcel();

        return createResponse(
                data,
                "sales.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    }


    @GetMapping("/sales/pdf")
    public ResponseEntity<byte[]>
    exportSalesPDF()
            throws IOException {

        byte[] data =
                exportService.exportSalesPDF();

        return createResponse(
                data,
                "sales.pdf",
                "application/pdf"
        );
    }


    // ============================================================
    // PURCHASE ORDERS
    // ============================================================

    @GetMapping("/purchase-orders/csv")
    public ResponseEntity<byte[]>
    exportPurchaseOrdersCSV()
            throws IOException {

        byte[] data =
                exportService
                        .exportPurchaseOrdersCSV();

        return createResponse(
                data,
                "purchase-orders.csv",
                "text/csv"
        );
    }


    @GetMapping("/purchase-orders/excel")
    public ResponseEntity<byte[]>
    exportPurchaseOrdersExcel()
            throws IOException {

        byte[] data =
                exportService
                        .exportPurchaseOrdersExcel();

        return createResponse(
                data,
                "purchase-orders.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    }


    @GetMapping("/purchase-orders/pdf")
    public ResponseEntity<byte[]>
    exportPurchaseOrdersPDF()
            throws IOException {

        byte[] data =
                exportService
                        .exportPurchaseOrdersPDF();

        return createResponse(
                data,
                "purchase-orders.pdf",
                "application/pdf"
        );
    }


    // ============================================================
    // INVOICES
    // ============================================================

    @GetMapping("/invoices/csv")
    public ResponseEntity<byte[]>
    exportInvoicesCSV()
            throws IOException {

        byte[] data =
                exportService.exportInvoicesCSV();

        return createResponse(
                data,
                "invoices.csv",
                "text/csv"
        );
    }


    @GetMapping("/invoices/excel")
    public ResponseEntity<byte[]>
    exportInvoicesExcel()
            throws IOException {

        byte[] data =
                exportService.exportInvoicesExcel();

        return createResponse(
                data,
                "invoices.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    }


    @GetMapping("/invoices/pdf")
    public ResponseEntity<byte[]>
    exportInvoicesPDF()
            throws IOException {

        byte[] data =
                exportService.exportInvoicesPDF();

        return createResponse(
                data,
                "invoices.pdf",
                "application/pdf"
        );
    }


    // ============================================================
    // PAYMENTS
    // ============================================================

    @GetMapping("/payments/csv")
    public ResponseEntity<byte[]>
    exportPaymentsCSV()
            throws IOException {

        byte[] data =
                exportService.exportPaymentsCSV();

        return createResponse(
                data,
                "payments.csv",
                "text/csv"
        );
    }


    @GetMapping("/payments/excel")
    public ResponseEntity<byte[]>
    exportPaymentsExcel()
            throws IOException {

        byte[] data =
                exportService.exportPaymentsExcel();

        return createResponse(
                data,
                "payments.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
    }


    @GetMapping("/payments/pdf")
    public ResponseEntity<byte[]>
    exportPaymentsPDF()
            throws IOException {

        byte[] data =
                exportService.exportPaymentsPDF();

        return createResponse(
                data,
                "payments.pdf",
                "application/pdf"
        );
    }


    // ============================================================
    // COMMON RESPONSE METHOD
    // ============================================================

    private ResponseEntity<byte[]> createResponse(
            byte[] data,
            String fileName,
            String contentType
    ) {

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" +
                                fileName
                )
                .contentType(
                        MediaType.parseMediaType(
                                contentType
                        )
                )
                .body(data);
    }
}