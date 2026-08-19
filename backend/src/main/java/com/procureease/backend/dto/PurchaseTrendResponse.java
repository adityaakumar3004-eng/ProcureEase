package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PurchaseTrendResponse {

    private Integer monthNumber;

    private String month;

    private Long purchases;
}