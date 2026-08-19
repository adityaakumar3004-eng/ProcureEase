package com.procureease.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PurchaseOrderRequest {

    @NotNull(message = "Vendor is required")
    @Positive(message = "Vendor ID must be a positive integer")
    private Integer vendorId;

    @NotEmpty(message = "At least one product is required")
    @Valid
    private List<PurchaseOrderItemRequest> items;
}