package com.procureease.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrder {

    // ============================
    // Primary Key
    // ============================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ============================
    // Vendor
    // ============================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "vendor_id",
            nullable = false
    )
    private Vendor vendor;

    // ============================
    // Total Amount
    // ============================

    @Column(
            name = "total_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal totalAmount;

    // ============================
    // Status
    // ============================

    @Column(
            nullable = false,
            length = 20
    )
    private String status;

    // ============================
    // Purchase Order Items
    // ============================

    @OneToMany(
            mappedBy = "purchaseOrder",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<PurchaseOrderItem> items =
            new ArrayList<>();

    // ============================
    // Created At
    // ============================

    @CreationTimestamp
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    // ============================
    // Updated At
    // ============================

    @UpdateTimestamp
    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;
}