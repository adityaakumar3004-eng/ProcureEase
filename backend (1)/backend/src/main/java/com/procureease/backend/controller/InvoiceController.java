package com.procureease.backend.controller;

import com.procureease.backend.dto.CreateInvoiceRequest;
import com.procureease.backend.dto.InvoiceResponse;
import com.procureease.backend.dto.MarkInvoicePaidRequest;
import com.procureease.backend.dto.UpdateInvoiceRequest;
import com.procureease.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    // ============================================================
    // Create Invoice
    // ============================================================

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> createInvoice(
            @ModelAttribute CreateInvoiceRequest request,
            @RequestParam("invoice") MultipartFile file
    ) throws IOException {

        InvoiceResponse invoice =
                invoiceService.createInvoice(
                        request,
                        file
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Invoice created successfully"
        );
        response.put("data", invoice);

        return ResponseEntity
                .status(201)
                .body(response);
    }

    // ============================================================
    // Get All Invoices
    // ============================================================

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllInvoices() {

        List<InvoiceResponse> invoices =
                invoiceService.getAllInvoices();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("count", invoices.size());
        response.put("data", invoices);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Get Invoice By ID
    // ============================================================

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getInvoiceById(
            @PathVariable Integer id
    ) {

        InvoiceResponse invoice =
                invoiceService.getInvoiceById(id);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("data", invoice);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Update Invoice
    // ============================================================

    @PutMapping(
            value = "/{id}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<Map<String, Object>> updateInvoice(
            @PathVariable Integer id,
            @ModelAttribute UpdateInvoiceRequest request,
            @RequestParam(
                    value = "invoice",
                    required = false
            )
            MultipartFile file
    ) throws IOException {

        InvoiceResponse invoice =
                invoiceService.updateInvoice(
                        id,
                        request,
                        file
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Invoice updated successfully"
        );
        response.put("data", invoice);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Mark Invoice As Paid
    // ============================================================

    @PutMapping("/{id}/pay")
    public ResponseEntity<Map<String, Object>> markInvoiceAsPaid(
            @PathVariable Integer id,
            @RequestBody MarkInvoicePaidRequest request
    ) {

        invoiceService.markInvoiceAsPaid(
                id,
                request
        );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Invoice marked as paid successfully"
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Delete Invoice
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteInvoice(
            @PathVariable Integer id
    ) {

        invoiceService.deleteInvoice(id);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Invoice deleted successfully"
        );

        return ResponseEntity.ok(response);
    }
}