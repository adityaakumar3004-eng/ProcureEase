package com.procureease.backend.controller;

import com.procureease.backend.dto.InventoryReportResponse;
import com.procureease.backend.dto.PurchaseReportResponse;
import com.procureease.backend.dto.SalesReportResponse;
import com.procureease.backend.dto.VendorReportItemResponse;
import com.procureease.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // ============================================================
    // Sales Report
    // ============================================================

    @GetMapping("/sales")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getSalesReport() {

        SalesReportResponse report =
                reportService.getSalesReport();

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("data", report);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Purchase Report
    // ============================================================

    @GetMapping("/purchases")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getPurchaseReport() {

        PurchaseReportResponse report =
                reportService.getPurchaseReport();

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("data", report);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Inventory Report
    // ============================================================

    @GetMapping("/inventory")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getInventoryReport() {

        InventoryReportResponse report =
                reportService.getInventoryReport();

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("data", report);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Vendor Report
    // ============================================================

    @GetMapping("/vendors")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> getVendorReport() {

        List<VendorReportItemResponse> report =
                reportService.getVendorReport();

        Map<String, Object> response = new HashMap<>();

        response.put("success", true);
        response.put("data", report);

        return ResponseEntity.ok(response);
    }
}