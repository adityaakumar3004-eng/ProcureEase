package com.procureease.backend.service;

import com.procureease.backend.dto.ProductRequest;
import com.procureease.backend.dto.ProductResponse;
import com.procureease.backend.entity.Notification;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.NotificationRepository;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    private final VendorRepository vendorRepository;

    private final NotificationRepository notificationRepository;

    private static final int LOW_STOCK_LIMIT = 10;

    // ============================================================
    // Create Product
    // ============================================================

    public ProductResponse createProduct(
            ProductRequest request,
            String image
    ) {

        // Find Vendor
        Vendor vendor = vendorRepository.findById(
                request.getVendorId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Vendor not found"
                )
        );

        // Create Product
        Product product = Product.builder()
                .name(request.getName().trim())
                .description(request.getDescription().trim())
                .price(request.getPrice())
                .stock(request.getStock())
                .vendor(vendor)
                .image(image)
                .build();

        // Save Product
        Product savedProduct =
                productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    // ============================================================
    // Get All Products
    // ============================================================

    public ProductPageResponse getAllProducts(
            String search,
            Integer vendorId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy,
            String order,
            int page,
            int limit
    ) {

        // Prevent invalid pagination values
        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        // Allowed sorting fields
        String sortField = switch (
                sortBy == null ? "" : sortBy
                ) {

            case "price" -> "price";

            case "stock" -> "stock";

            case "name" -> "name";

            default -> "name";
        };

        // Sorting direction
        Sort.Direction direction =
                "DESC".equalsIgnoreCase(order)
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page - 1,
                limit,
                Sort.by(direction, sortField)
        );

        // Fetch filtered products
        Page<Product> productPage =
                productRepository.searchProducts(
                        search,
                        vendorId,
                        minPrice,
                        maxPrice,
                        pageable
                );

        // Convert entities to DTOs
        List<ProductResponse> products =
                productPage.getContent()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new ProductPageResponse(
                products,
                page,
                limit,
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    // ============================================================
    // Get Product By ID
    // ============================================================

    public ProductResponse getProductById(Integer id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        return mapToResponse(product);
    }

    // ============================================================
    // Update Product
    // ============================================================

    public void updateProduct(
            Integer id,
            ProductRequest request,
            String image
    ) {

        // Find existing product
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        // Find vendor
        Vendor vendor = vendorRepository.findById(
                request.getVendorId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Vendor not found"
                )
        );

        // Update product details
        product.setName(request.getName().trim());
        product.setDescription(request.getDescription().trim());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setVendor(vendor);

        // Only replace image if a new image was uploaded
        if (image != null && !image.isBlank()) {
            product.setImage(image);
        }

        // Save changes
        productRepository.save(product);

        // Check low stock
        createLowStockNotification(
                product.getName(),
                product.getStock()
        );
    }

    // ============================================================
    // Update Product Stock
    // Used Later By Sales Module
    // ============================================================

    public void updateProductStock(
            Integer id,
            Integer newStock
    ) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        product.setStock(newStock);

        productRepository.save(product);

        // Check low stock
        createLowStockNotification(
                product.getName(),
                newStock
        );
    }

    // ============================================================
    // Delete Product
    // ============================================================

    public void deleteProduct(Integer id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        productRepository.delete(product);
    }

    // ============================================================
    // Create Low Stock Notification
    // ============================================================

    private void createLowStockNotification(
            String productName,
            Integer stock
    ) {

        // No notification if stock is above limit
        if (stock > LOW_STOCK_LIMIT) {
            return;
        }

        String title = "Low Stock Alert";

        String message =
                productName +
                        " stock is low (" +
                        stock +
                        " left).";

        String type = "Low Stock";

        // Check whether same unread notification already exists
        boolean alreadyExists =
                notificationRepository
                        .findByTitleAndMessageAndTypeAndIsReadFalse(
                                title,
                                message,
                                type
                        )
                        .isPresent();

        if (alreadyExists) {
            return;
        }

        // Create notification
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    // ============================================================
    // Convert Entity → Response DTO
    // ============================================================

    private ProductResponse mapToResponse(
            Product product
    ) {

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .vendorId(product.getVendor().getId())
                .vendorName(product.getVendor().getName())
                .image(product.getImage())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    // ============================================================
    // Pagination Response
    // ============================================================

    public record ProductPageResponse(
            List<ProductResponse> data,
            int page,
            int limit,
            long total,
            int totalPages
    ) {
    }
}