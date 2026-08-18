package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InventoryDistributionResponse {

    private String category;

    private Long count;
}