package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PurchaseSummaryResponse {

    private long totalPurchaseOrders;
}