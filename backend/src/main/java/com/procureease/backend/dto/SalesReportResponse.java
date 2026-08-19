package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SalesReportResponse {

    private SalesSummaryResponse summary;

    private List<SalesReportItemResponse> sales;
}