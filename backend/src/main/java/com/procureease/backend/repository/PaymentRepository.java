package com.procureease.backend.repository;

import com.procureease.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentRepository
        extends JpaRepository<Invoice, Integer> {

    @Query("""
            SELECT i
            FROM Invoice i
            JOIN FETCH i.purchaseOrder po
            JOIN FETCH po.vendor
            WHERE i.paymentStatus = :paymentStatus
            ORDER BY i.paymentDate DESC
            """)
    List<Invoice> findByPaymentStatus(
            String paymentStatus
    );
}