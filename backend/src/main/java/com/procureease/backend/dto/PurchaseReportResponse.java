package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PurchaseReportResponse {

    private PurchaseSummaryResponse summary;

    private List<PurchaseStatusSummaryResponse> statusSummary;

    private List<PurchaseReportItemResponse> purchases;
}