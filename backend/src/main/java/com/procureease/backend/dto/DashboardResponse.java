package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class DashboardResponse {

    private long vendors;

    private long products;

    private long purchaseOrders;

    private long sales;

    private BigDecimal inventoryValue;

    private List<LowStockProductResponse> lowStockProducts;

    private List<RecentSaleResponse> recentSales;

    private List<RecentPurchaseOrderResponse> recentPurchaseOrders;
}