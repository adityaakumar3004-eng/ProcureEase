package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResponse {

    private Integer id;

    private String invoiceNumber;

    private String vendorName;

    private Integer purchaseOrderId;

    private String paymentMethod;

    private String transactionId;

    private LocalDateTime paymentDate;

    private String paymentStatus;
}