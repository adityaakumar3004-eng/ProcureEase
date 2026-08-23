package com.procureease.backend.repository;

import com.procureease.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, Integer> {

    // ============================================================
    // Search + Filter + Pagination
    // ============================================================

    @Query("""
            SELECT p
            FROM Product p
            JOIN FETCH p.vendor
            WHERE
                (:search IS NULL
                 OR :search = ''
                 OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
            AND
                (:vendorId IS NULL
                 OR p.vendor.id = :vendorId)
            AND
                (:minPrice IS NULL
                 OR p.price >= :minPrice)
            AND
                (:maxPrice IS NULL
                 OR p.price <= :maxPrice)
            """)
    Page<Product> searchProducts(
            @Param("search") String search,
            @Param("vendorId") Integer vendorId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    // ============================================================
    // Get Product By ID With Vendor
    // ============================================================

    @Query("""
            SELECT p
            FROM Product p
            JOIN FETCH p.vendor
            WHERE p.id = :id
            """)
    Optional<Product> findProductWithVendorById(
            @Param("id") Integer id
    );

    // ============================================================
    // Get All Products With Vendor
    // Export Feature
    // ============================================================

    @Query("""
            SELECT p
            FROM Product p
            JOIN FETCH p.vendor
            ORDER BY p.id ASC
            """)
    List<Product> findAllWithVendor();

    // ============================================================
    // Dashboard - Inventory Value
    // ============================================================

    @Query("""
            SELECT COALESCE(SUM(p.price * p.stock), 0)
            FROM Product p
            """)
    BigDecimal getInventoryValue();

    // ============================================================
    // Dashboard - Low Stock Products
    // ============================================================

    List<Product> findByStockLessThanOrderByStockAsc(Integer stock);

    // ============================================================
    // Dashboard - Inventory Distribution
    // ============================================================

    @Query("""
            SELECT
                CASE
                    WHEN p.stock < 10 THEN 'Low Stock'
                    ELSE 'Healthy Stock'
                END,
                COUNT(p)
            FROM Product p
            GROUP BY
                CASE
                    WHEN p.stock < 10 THEN 'Low Stock'
                    ELSE 'Healthy Stock'
                END
            """)
    List<Object[]> getInventoryDistribution();
}