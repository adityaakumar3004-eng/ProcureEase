package com.procureease.backend.repository;

import com.procureease.backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Integer> {

    // ============================================================
    // Get All Sales With Product
    // ============================================================

    @Query("""
            SELECT s
            FROM Sale s
            JOIN FETCH s.product
            ORDER BY s.createdAt DESC
            """)
    List<Sale> findAllSalesWithProduct();

    // ============================================================
    // Get Sale By ID With Product
    // ============================================================

    @Query("""
            SELECT s
            FROM Sale s
            JOIN FETCH s.product
            WHERE s.id = :id
            """)
    Optional<Sale> findSaleWithProductById(
            @Param("id") Integer id
    );

    // ============================================================
    // Dashboard - Recent Sales
    // ============================================================

    @Query("""
            SELECT s
            FROM Sale s
            JOIN FETCH s.product
            ORDER BY s.id DESC
            """)
    List<Sale> findRecentSalesWithProduct();

    // ============================================================
    // Dashboard - Monthly Sales
    // ============================================================

    @Query("""
            SELECT
                MONTH(s.createdAt),
                SUM(s.totalAmount)
            FROM Sale s
            GROUP BY MONTH(s.createdAt)
            ORDER BY MONTH(s.createdAt)
            """)
    List<Object[]> getMonthlySales();

    // ============================================================
    // Dashboard - Top Selling Products
    // ============================================================

    @Query("""
            SELECT
                s.product.name,
                SUM(s.quantity)
            FROM Sale s
            GROUP BY s.product.id, s.product.name
            ORDER BY SUM(s.quantity) DESC
            """)
    List<Object[]> getTopProducts();
}