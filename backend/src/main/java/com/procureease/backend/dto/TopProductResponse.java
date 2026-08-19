package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TopProductResponse {

    private String product;

    private Long quantity;
}