package com.procureease.backend.controller;

import com.procureease.backend.dto.SaleRequest;
import com.procureease.backend.dto.SaleResponse;
import com.procureease.backend.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    // ============================================================
    // Create Sale
    // ============================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> createSale(
            @Valid @RequestBody SaleRequest request
    ) {

        SaleResponse sale =
                saleService.createSale(request);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Sale recorded successfully"
        );
        response.put("data", sale);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ============================================================
    // Get All Sales
    // ============================================================

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')"
    )
    public ResponseEntity<Map<String, Object>> getAllSales() {

        List<SaleResponse> sales =
                saleService.getAllSales();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("data", sales);

        return ResponseEntity.ok(response);
    }
}