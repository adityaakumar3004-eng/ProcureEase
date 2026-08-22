package com.procureease.backend.service;

import com.procureease.backend.dto.*;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    // ============================================================
    // Sales Report
    // ============================================================

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public InventoryReportResponse getInventoryReport() {

        BigDecimal inventoryValue =
                reportRepository.getInventoryValue();

        InventoryValueResponse inventoryValueResponse =
                InventoryValueResponse.builder()
                        .inventoryValue(
                                inventoryValue != null
                                        ? inventoryValue
                                        : BigDecimal.ZERO
                        )
                        .build();

        List<LowStockProductResponse> lowStock =
                reportRepository
                        .getLowStockProducts()
                        .stream()
                        .map(this::mapLowStockProductToResponse)
                        .toList();

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
    // Vendor Report
    // ============================================================

    @Transactional(readOnly = true)
    public List<VendorReportItemResponse> getVendorReport() {

        return reportRepository
                .getVendorReport()
                .stream()
                .map(row ->
                        VendorReportItemResponse.builder()
                                .id(
                                        ((Number) row[0])
                                                .intValue()
                                )
                                .name(
                                        (String) row[1]
                                )
                                .totalProducts(
                                        ((Number) row[2])
                                                .longValue()
                                )
                                .totalPurchaseOrders(
                                        ((Number) row[3])
                                                .longValue()
                                )
                                .build()
                )
                .toList();
    }

    // ============================================================
    // Convert Sale → Report Response
    // ============================================================

    private SalesReportItemResponse mapSaleToResponse(
            Sale sale
    ) {

        return SalesReportItemResponse.builder()
                .id(
                        sale.getId()
                )
                .productId(
                        sale.getProduct().getId()
                )
                .productName(
                        sale.getProduct().getName()
                )
                .quantity(
                        sale.getQuantity()
                )
                .price(
                        sale.getPrice()
                )
                .totalAmount(
                        sale.getTotalAmount()
                )
                .createdAt(
                        sale.getCreatedAt()
                )
                .build();
    }

    // ============================================================
    // Convert Purchase Order → Report Response
    // ============================================================

    private PurchaseReportItemResponse mapPurchaseToResponse(
            PurchaseOrder purchaseOrder
    ) {

        return PurchaseReportItemResponse.builder()
                .id(
                        purchaseOrder.getId()
                )
                .vendorId(
                        purchaseOrder
                                .getVendor()
                                .getId()
                )
                .vendorName(
                        purchaseOrder
                                .getVendor()
                                .getName()
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
                .id(
                        product.getId()
                )
                .name(
                        product.getName()
                )
                .stock(
                        product.getStock()
                )
                .build();
    }

    // ============================================================
    // Convert Product → Inventory Response
    // ============================================================

    private InventoryProductResponse mapInventoryProductToResponse(
            Product product
    ) {

        return InventoryProductResponse.builder()
                .id(
                        product.getId()
                )
                .name(
                        product.getName()
                )
                .stock(
                        product.getStock()
                )
                .price(
                        product.getPrice()
                )
                .build();
    }
}