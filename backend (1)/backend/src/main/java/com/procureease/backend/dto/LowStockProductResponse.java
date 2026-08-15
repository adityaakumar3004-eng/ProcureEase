package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LowStockProductResponse {

    private Integer id;

    private String name;

    private Integer stock;
}