package com.procureease.backend.service;

import com.procureease.backend.dto.PurchaseReportItemResponse;
import com.procureease.backend.dto.PurchaseReportResponse;
import com.procureease.backend.dto.PurchaseStatusSummaryResponse;
import com.procureease.backend.dto.PurchaseSummaryResponse;
import com.procureease.backend.dto.SalesReportItemResponse;
import com.procureease.backend.dto.SalesReportResponse;
import com.procureease.backend.dto.SalesSummaryResponse;
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

        // Get summary
        long totalSales =
                reportRepository.getTotalSales();

        BigDecimal totalRevenue =
                reportRepository.getTotalRevenue();

        SalesSummaryResponse summary =
                SalesSummaryResponse.builder()
                        .totalSales(totalSales)
                        .totalRevenue(totalRevenue)
                        .build();

        // Get sales
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

        // Get summary
        long totalPurchaseOrders =
                reportRepository.getTotalPurchaseOrders();

        PurchaseSummaryResponse summary =
                PurchaseSummaryResponse.builder()
                        .totalPurchaseOrders(
                                totalPurchaseOrders
                        )
                        .build();

        // Get status summary
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

        // Get all purchase orders
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
}