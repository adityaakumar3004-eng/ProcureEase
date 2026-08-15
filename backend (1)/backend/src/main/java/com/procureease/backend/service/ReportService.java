package com.procureease.backend.service;

import com.procureease.backend.dto.SalesReportItemResponse;
import com.procureease.backend.dto.SalesReportResponse;
import com.procureease.backend.dto.SalesSummaryResponse;
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
}