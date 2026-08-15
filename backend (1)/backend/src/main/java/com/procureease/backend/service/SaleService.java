package com.procureease.backend.service;

import com.procureease.backend.dto.SaleRequest;
import com.procureease.backend.dto.SaleResponse;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;

    private final ProductRepository productRepository;

    private final ProductService productService;

    // ============================================================
    // Create Sale
    // ============================================================

    @Transactional
    public SaleResponse createSale(SaleRequest request) {

        // Find Product
        Product product = productRepository.findById(
                request.getProductId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Product not found"
                )
        );

        // Check Stock
        if (product.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException(
                    "Insufficient Stock"
            );
        }

        // Get current product price
        BigDecimal price = product.getPrice();

        // Calculate total amount
        BigDecimal totalAmount =
                price.multiply(
                        BigDecimal.valueOf(
                                request.getQuantity()
                        )
                );

        // Create Sale
        Sale sale = Sale.builder()
                .product(product)
                .quantity(request.getQuantity())
                .price(price)
                .totalAmount(totalAmount)
                .build();

        Sale savedSale =
                saleRepository.save(sale);

        // Calculate new stock
        int newStock =
                product.getStock()
                        - request.getQuantity();

        // Update Product Stock
        productService.updateProductStock(
                product.getId(),
                newStock
        );

        return mapToResponse(savedSale);
    }

    // ============================================================
    // Get All Sales
    // ============================================================

    @Transactional(readOnly = true)
    public List<SaleResponse> getAllSales() {

        return saleRepository
                .findAllSalesWithProduct()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================================================
    // Convert Entity → Response DTO
    // ============================================================

    private SaleResponse mapToResponse(
            Sale sale
    ) {

        return SaleResponse.builder()
                .id(sale.getId())
                .productId(
                        sale.getProduct().getId()
                )
                .productName(
                        sale.getProduct().getName()
                )
                .quantity(sale.getQuantity())
                .price(sale.getPrice())
                .totalAmount(sale.getTotalAmount())
                .createdAt(sale.getCreatedAt())
                .build();
    }
}