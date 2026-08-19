package com.procureease.backend.repository;

import com.procureease.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository
        extends JpaRepository<Invoice, Integer> {

    // ============================================================
    // Get All Invoices With Purchase Order
    // ============================================================

    @Query("""
            SELECT i
            FROM Invoice i
            JOIN FETCH i.purchaseOrder
            ORDER BY i.createdAt DESC
            """)
    List<Invoice> findAllWithPurchaseOrder();

    // ============================================================
    // Get Invoice By ID With Purchase Order
    // ============================================================

    @Query("""
            SELECT i
            FROM Invoice i
            JOIN FETCH i.purchaseOrder
            WHERE i.id = :id
            """)
    Optional<Invoice> findByIdWithPurchaseOrder(
            Integer id
    );

    // ============================================================
    // Check Invoice Number Exists
    // ============================================================

    boolean existsByInvoiceNumber(String invoiceNumber);
}