package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class SalesReportItemResponse {

    private Integer id;

    private Integer productId;

    private String productName;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;
}