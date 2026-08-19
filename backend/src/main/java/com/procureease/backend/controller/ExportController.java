package com.procureease.backend.controller;

import com.procureease.backend.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;

    // ============================================================
    // Export Products as CSV
    // ============================================================

    @GetMapping("/products/csv")
    public ResponseEntity<byte[]> exportProductsCSV()
            throws Exception {

        byte[] file =
                exportService.exportProductsCSV();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=products.csv"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "text/csv"
                        )
                )
                .body(file);
    }

    // ============================================================
    // Export Products as Excel
    // ============================================================

    @GetMapping("/products/excel")
    public ResponseEntity<byte[]> exportProductsExcel()
            throws Exception {

        byte[] file =
                exportService.exportProductsExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=products.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(file);
    }

    // ============================================================
    // Export Products as PDF
    // ============================================================

    @GetMapping("/products/pdf")
    public ResponseEntity<byte[]> exportProductsPDF()
            throws Exception {

        byte[] file =
                exportService.exportProductsPDF();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=products.pdf"
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(file);
    }
}