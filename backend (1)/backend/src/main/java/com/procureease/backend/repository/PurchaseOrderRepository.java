package com.procureease.backend.repository;

import com.procureease.backend.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository
        extends JpaRepository<PurchaseOrder, Integer> {

    // Get all purchase orders with vendor loaded
    @Query("""
            SELECT DISTINCT po
            FROM PurchaseOrder po
            JOIN FETCH po.vendor
            ORDER BY po.id DESC
            """)
    List<PurchaseOrder> findAllWithVendor();

    // Get purchase order with vendor and items loaded
    @Query("""
            SELECT DISTINCT po
            FROM PurchaseOrder po
            JOIN FETCH po.vendor
            LEFT JOIN FETCH po.items items
            LEFT JOIN FETCH items.product
            WHERE po.id = :id
            """)
    Optional<PurchaseOrder> findByIdWithDetails(Integer id);
}