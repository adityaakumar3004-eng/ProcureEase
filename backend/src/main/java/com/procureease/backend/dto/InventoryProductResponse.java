package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class InventoryProductResponse {

    private Integer id;

    private String name;

    private Integer vendorId;

    private String vendorName;

    private Integer stock;

    private BigDecimal price;

    private BigDecimal totalValue;
}