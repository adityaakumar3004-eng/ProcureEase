package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VendorReportItemResponse {

    private Integer id;

    private String name;

    private long totalProducts;

    private long totalPurchaseOrders;
}