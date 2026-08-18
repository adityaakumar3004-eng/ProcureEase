package com.procureease.backend.repository;

import com.procureease.backend.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository
        extends JpaRepository<PurchaseOrder, Integer> {

    // ============================================================
    // Get All Purchase Orders With Details
    // ============================================================

    @Query("""
            SELECT DISTINCT po
            FROM PurchaseOrder po
            JOIN FETCH po.vendor
            LEFT JOIN FETCH po.items items
            LEFT JOIN FETCH items.product
            ORDER BY po.id DESC
            """)
    List<PurchaseOrder> findAllWithDetails();

    // ============================================================
    // Get Purchase Order By ID With Details
    // ============================================================

    @Query("""
            SELECT DISTINCT po
            FROM PurchaseOrder po
            JOIN FETCH po.vendor
            LEFT JOIN FETCH po.items items
            LEFT JOIN FETCH items.product
            WHERE po.id = :id
            """)
    Optional<PurchaseOrder> findByIdWithDetails(
            Integer id
    );

    // ============================================================
    // Dashboard - Recent Purchase Orders
    // ============================================================

    @Query("""
            SELECT po
            FROM PurchaseOrder po
            JOIN FETCH po.vendor
            ORDER BY po.id DESC
            """)
    List<PurchaseOrder> findRecentPurchaseOrdersWithVendor();

    // ============================================================
    // Dashboard - Purchase Trends
    // ============================================================

    @Query("""
            SELECT
                MONTH(po.createdAt),
                COUNT(po)
            FROM PurchaseOrder po
            GROUP BY MONTH(po.createdAt)
            ORDER BY MONTH(po.createdAt)
            """)
    List<Object[]> getPurchaseTrends();
}