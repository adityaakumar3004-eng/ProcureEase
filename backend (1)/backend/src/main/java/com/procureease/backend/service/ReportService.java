package com.procureease.backend.service;

import com.procureease.backend.dto.*;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    // ============================================================
    // Sales Report
    // ============================================================

    public SalesReportResponse getSalesReport() {

        long totalSales =
                reportRepository.getTotalSales();

        BigDecimal totalRevenue =
                reportRepository.getTotalRevenue();

        SalesSummaryResponse summary =
                SalesSummaryResponse.builder()
                        .totalSales(totalSales)
                        .totalRevenue(totalRevenue)
                        .build();

        List<SalesReportItemResponse> sales =
                reportRepository
                        .getAllSalesForReport()
                        .stream()
                        .map(this::mapSaleToResponse)
                        .toList();

        return SalesReportResponse.builder()
                .summary(summary)
                .sales(sales)
                .build();
    }

    // ============================================================
    // Purchase Report
    // ============================================================

    public PurchaseReportResponse getPurchaseReport() {

        long totalPurchaseOrders =
                reportRepository.getTotalPurchaseOrders();

        PurchaseSummaryResponse summary =
                PurchaseSummaryResponse.builder()
                        .totalPurchaseOrders(
                                totalPurchaseOrders
                        )
                        .build();

        List<PurchaseStatusSummaryResponse> statusSummary =
                reportRepository
                        .getPurchaseStatusSummary()
                        .stream()
                        .map(row ->
                                PurchaseStatusSummaryResponse
                                        .builder()
                                        .status(
                                                (String) row[0]
                                        )
                                        .count(
                                                ((Number) row[1])
                                                        .longValue()
                                        )
                                        .build()
                        )
                        .toList();

        List<PurchaseReportItemResponse> purchases =
                reportRepository
                        .getAllPurchasesForReport()
                        .stream()
                        .map(this::mapPurchaseToResponse)
                        .toList();

        return PurchaseReportResponse.builder()
                .summary(summary)
                .statusSummary(statusSummary)
                .purchases(purchases)
                .build();
    }

    // ============================================================
    // Inventory Report
    // ============================================================

    public InventoryReportResponse getInventoryReport() {

        // Get total inventory value
        BigDecimal inventoryValue =
                reportRepository.getInventoryValue();

        InventoryValueResponse inventoryValueResponse =
                InventoryValueResponse.builder()
                        .inventoryValue(inventoryValue)
                        .build();

        // Get low stock products
        List<LowStockProductResponse> lowStock =
                reportRepository
                        .getLowStockProducts()
                        .stream()
                        .map(this::mapLowStockProductToResponse)
                        .toList();

        // Get all products
        List<InventoryProductResponse> products =
                reportRepository
                        .getAllProductsForInventoryReport()
                        .stream()
                        .map(this::mapInventoryProductToResponse)
                        .toList();

        return InventoryReportResponse.builder()
                .inventoryValue(inventoryValueResponse)
                .lowStock(lowStock)
                .products(products)
                .build();
    }

    // ============================================================
    // Convert Sale → Report Response
    // ============================================================

    private SalesReportItemResponse mapSaleToResponse(
            Sale sale
    ) {

        return SalesReportItemResponse.builder()
                .id(sale.getId())
                .productId(
                        sale.getProduct().getId()
                )
                .quantity(sale.getQuantity())
                .price(sale.getPrice())
                .totalAmount(sale.getTotalAmount())
                .createdAt(sale.getCreatedAt())
                .build();
    }

    // ============================================================
    // Convert Purchase Order → Report Response
    // ============================================================

    private PurchaseReportItemResponse mapPurchaseToResponse(
            PurchaseOrder purchaseOrder
    ) {

        return PurchaseReportItemResponse.builder()
                .id(purchaseOrder.getId())
                .vendorId(
                        purchaseOrder.getVendor().getId()
                )
                .totalAmount(
                        purchaseOrder.getTotalAmount()
                )
                .status(
                        purchaseOrder.getStatus()
                )
                .createdAt(
                        purchaseOrder.getCreatedAt()
                )
                .build();
    }

    // ============================================================
    // Convert Product → Low Stock Response
    // ============================================================

    private LowStockProductResponse mapLowStockProductToResponse(
            Product product
    ) {

        return LowStockProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .stock(product.getStock())
                .build();
    }

    // ============================================================
    // Convert Product → Inventory Response
    // ============================================================

    private InventoryProductResponse mapInventoryProductToResponse(
            Product product
    ) {

        return InventoryProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .stock(product.getStock())
                .price(product.getPrice())
                .build();
    }
}