package com.procureease.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurchaseOrderStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "Pending|Approved|Rejected|Completed",
            message = "Status must be Pending, Approved, Rejected or Completed"
    )
    private String status;
}