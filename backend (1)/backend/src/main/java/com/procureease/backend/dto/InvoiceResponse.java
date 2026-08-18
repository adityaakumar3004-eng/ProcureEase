package com.procureease.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class InvoiceResponse {

    private Integer id;

    private Integer purchaseOrderId;

    private String invoiceNumber;

    private String invoiceFile;

    private LocalDate invoiceDate;

    private String status;

    private String paymentStatus;

    private LocalDateTime paymentDate;

    private String paymentMethod;

    private String transactionId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}