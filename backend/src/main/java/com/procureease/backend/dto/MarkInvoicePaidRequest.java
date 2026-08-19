package com.procureease.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkInvoicePaidRequest {

    private String paymentMethod;

    private String transactionId;
}