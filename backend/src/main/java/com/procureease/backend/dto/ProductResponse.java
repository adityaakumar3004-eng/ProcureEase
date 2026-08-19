package com.procureease.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Integer id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stock;

    private Integer vendorId;

    private String vendorName;

    private String image;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}