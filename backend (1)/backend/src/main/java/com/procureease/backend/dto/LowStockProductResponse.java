package com.procureease.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LowStockProductResponse {

    private Integer id;

    private String name;

    private Integer stock;
}