package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ExportProductResponse {

    private Integer id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stock;

    private String vendorName;
}