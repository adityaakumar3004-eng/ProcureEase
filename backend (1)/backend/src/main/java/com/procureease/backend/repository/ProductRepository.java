package com.procureease.backend.repository;

import com.procureease.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {

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
}