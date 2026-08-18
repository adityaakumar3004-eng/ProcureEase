package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class RecentPurchaseOrderResponse {

    private Integer id;

    private Integer vendorId;

    private BigDecimal totalAmount;

    private String status;

    private LocalDateTime createdAt;
}