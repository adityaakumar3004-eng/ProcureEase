package com.procureease.backend.controller;

import com.procureease.backend.dto.DashboardResponse;
import com.procureease.backend.dto.InventoryDistributionResponse;
import com.procureease.backend.dto.MonthlySalesResponse;
import com.procureease.backend.dto.PurchaseTrendResponse;
import com.procureease.backend.dto.TopProductResponse;
import com.procureease.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // ============================================================
    // Dashboard Summary
    // GET /api/dashboard
    // ============================================================

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboard()
        );
    }

    // ============================================================
    // Monthly Sales
    // GET /api/dashboard/monthly-sales
    // ============================================================

    @GetMapping("/monthly-sales")
    public ResponseEntity<List<MonthlySalesResponse>> getMonthlySales() {

        return ResponseEntity.ok(
                dashboardService.getMonthlySales()
        );
    }

    // ============================================================
    // Purchase Trends
    // GET /api/dashboard/purchase-trends
    // ============================================================

    @GetMapping("/purchase-trends")
    public ResponseEntity<List<PurchaseTrendResponse>> getPurchaseTrends() {

        return ResponseEntity.ok(
                dashboardService.getPurchaseTrends()
        );
    }

    // ============================================================
    // Top Products
    // GET /api/dashboard/top-products
    // ============================================================

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts() {

        return ResponseEntity.ok(
                dashboardService.getTopProducts()
        );
    }

    // ============================================================
    // Inventory Distribution
    // GET /api/dashboard/inventory-distribution
    // ============================================================

    @GetMapping("/inventory-distribution")
    public ResponseEntity<List<InventoryDistributionResponse>>
    getInventoryDistribution() {

        return ResponseEntity.ok(
                dashboardService.getInventoryDistribution()
        );
    }
}