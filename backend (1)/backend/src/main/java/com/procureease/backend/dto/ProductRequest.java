package com.procureease.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    // ============================
    // Product Name
    // ============================

    @NotBlank(message = "Product name is required")
    private String name;

    // ============================
    // Description
    // ============================

    @NotBlank(message = "Description is required")
    private String description;

    // ============================
    // Price
    // ============================

    @NotNull(message = "Price is required")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Price must be greater than 0"
    )
    private BigDecimal price;

    // ============================
    // Stock
    // ============================

    @NotNull(message = "Stock is required")
    @Min(
            value = 0,
            message = "Stock cannot be negative"
    )
    private Integer stock;

    // ============================
    // Vendor ID
    // ============================

    @NotNull(message = "Vendor ID is required")
    @Min(
            value = 1,
            message = "Vendor ID must be a valid integer"
    )
    private Integer vendorId;
}