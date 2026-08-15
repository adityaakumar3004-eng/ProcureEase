package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class InventoryReportResponse {

    private InventoryValueResponse inventoryValue;

    private List<LowStockProductResponse> lowStock;

    private List<InventoryProductResponse> products;
}