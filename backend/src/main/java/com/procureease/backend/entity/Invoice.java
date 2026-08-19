package com.procureease.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    // ============================================================
    // Primary Key
    // ============================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ============================================================
    // Purchase Order
    // ============================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "purchase_order_id",
            nullable = false
    )
    private PurchaseOrder purchaseOrder;

    // ============================================================
    // Invoice Number
    // ============================================================

    @Column(
            name = "invoice_number",
            nullable = false,
            unique = true,
            length = 100
    )
    private String invoiceNumber;

    // ============================================================
    // Invoice File
    // ============================================================

    @Column(
            name = "invoice_file",
            nullable = false
    )
    private String invoiceFile;

    // ============================================================
    // Invoice Date
    // ============================================================

    @Column(
            name = "invoice_date",
            nullable = false
    )
    private LocalDate invoiceDate;

    // ============================================================
    // Invoice Status
    // ============================================================

    @Column(
            nullable = false,
            length = 20
    )
    @Builder.Default
    private String status = "Pending";

    // ============================================================
    // Payment Status
    // ============================================================

    @Column(
            name = "payment_status",
            nullable = false,
            length = 20
    )
    @Builder.Default
    private String paymentStatus = "Pending";

    // ============================================================
    // Payment Date
    // ============================================================

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    // ============================================================
    // Payment Method
    // ============================================================

    @Column(
            name = "payment_method",
            length = 100
    )
    private String paymentMethod;

    // ============================================================
    // Transaction ID
    // ============================================================

    @Column(
            name = "transaction_id",
            length = 255
    )
    private String transactionId;

    // ============================================================
    // Created At
    // ============================================================

    @CreationTimestamp
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    // ============================================================
    // Updated At
    // ============================================================

    @UpdateTimestamp
    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;
}