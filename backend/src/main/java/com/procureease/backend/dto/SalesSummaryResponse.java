package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class SalesSummaryResponse {

    private long totalSales;

    private BigDecimal totalRevenue;
}