package com.procureease.backend.repository;

import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ReportRepository
        extends JpaRepository<Sale, Integer> {

    // ============================================================
    // Sales Report - Total Sales
    // ============================================================

    @Query("""
            SELECT COUNT(s)
            FROM Sale s
            """)
    long getTotalSales();

    // ============================================================
    // Sales Report - Total Revenue
    // ============================================================

    @Query("""
            SELECT COALESCE(SUM(s.totalAmount), 0)
            FROM Sale s
            """)
    BigDecimal getTotalRevenue();

    // ============================================================
    // Sales Report - All Sales
    // ============================================================

    @Query("""
            SELECT s
            FROM Sale s
            ORDER BY s.createdAt DESC
            """)
    List<Sale> getAllSalesForReport();

    // ============================================================
    // Purchase Report - Total Purchase Orders
    // ============================================================

    @Query("""
            SELECT COUNT(po)
            FROM PurchaseOrder po
            """)
    long getTotalPurchaseOrders();

    // ============================================================
    // Purchase Report - Status Summary
    // ============================================================

    @Query("""
            SELECT po.status, COUNT(po)
            FROM PurchaseOrder po
            GROUP BY po.status
            """)
    List<Object[]> getPurchaseStatusSummary();

    // ============================================================
    // Purchase Report - All Purchase Orders
    // ============================================================

    @Query("""
            SELECT po
            FROM PurchaseOrder po
            ORDER BY po.createdAt DESC
            """)
    List<PurchaseOrder> getAllPurchasesForReport();

    // ============================================================
    // Inventory Report - Inventory Value
    // ============================================================

    @Query("""
            SELECT COALESCE(
                SUM(p.price * p.stock),
                0
            )
            FROM Product p
            """)
    BigDecimal getInventoryValue();

    // ============================================================
    // Inventory Report - Low Stock Products
    // ============================================================

    @Query("""
            SELECT p
            FROM Product p
            WHERE p.stock < 10
            ORDER BY p.stock ASC
            """)
    List<Product> getLowStockProducts();

    // ============================================================
    // Inventory Report - All Products
    // ============================================================

    @Query("""
            SELECT p
            FROM Product p
            ORDER BY p.name ASC
            """)
    List<Product> getAllProductsForInventoryReport();
}