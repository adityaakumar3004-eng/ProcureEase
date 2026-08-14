package com.procureease.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    // ============================
    // Primary Key
    // ============================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ============================
    // Product Details
    // ============================

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock = 0;

    // ============================
    // Vendor Relationship
    // ============================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "vendor_id",
            nullable = false
    )
    private Vendor vendor;

    // ============================
    // Timestamps
    // ============================

    @Column(
            name = "created_at",
            insertable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            insertable = false,
            updatable = false
    )
    private LocalDateTime updatedAt;

    // ============================
    // Product Image
    // ============================

    @Column(length = 255)
    private String image;
}