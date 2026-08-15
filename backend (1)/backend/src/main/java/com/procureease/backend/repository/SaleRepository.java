package com.procureease.backend.repository;

import com.procureease.backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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
    java.util.Optional<Sale> findSaleWithProductById(
            @Param("id") Integer id
    );
}