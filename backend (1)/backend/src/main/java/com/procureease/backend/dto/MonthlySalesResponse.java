package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class MonthlySalesResponse {

    private Integer monthNumber;

    private String month;

    private BigDecimal sales;
}