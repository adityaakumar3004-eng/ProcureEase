package com.procureease.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateInvoiceRequest {

    private Integer purchaseOrderId;

    private String invoiceNumber;

    private LocalDate invoiceDate;

    private String status;
}