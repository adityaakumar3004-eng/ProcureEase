package com.procureease.backend.controller;

import com.procureease.backend.dto.ProductRequest;
import com.procureease.backend.dto.ProductResponse;
import com.procureease.backend.service.FileStorageService;
import com.procureease.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    private final FileStorageService fileStorageService;

    // ============================================================
    // Create Product
    // ============================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> createProduct(

            @Valid @ModelAttribute ProductRequest request,

            @RequestParam(
                    value = "productImage",
                    required = false
            )
            MultipartFile productImage
    ) {

        String image =
                fileStorageService.storeProductImage(
                        productImage
                );

        ProductResponse product =
                productService.createProduct(
                        request,
                        image
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Product created successfully"
        );
        response.put("data", product);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ============================================================
    // Get All Products
    // ============================================================

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')"
    )
    public ResponseEntity<Map<String, Object>> getAllProducts(

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            Integer vendorId,

            @RequestParam(required = false)
            BigDecimal minPrice,

            @RequestParam(required = false)
            BigDecimal maxPrice,

            @RequestParam(required = false)
            String sortBy,

            @RequestParam(required = false)
            String order,

            @RequestParam(defaultValue = "1")
            int page,

            @RequestParam(defaultValue = "10")
            int limit
    ) {

        ProductService.ProductPageResponse result =
                productService.getAllProducts(
                        search,
                        vendorId,
                        minPrice,
                        maxPrice,
                        sortBy,
                        order,
                        page,
                        limit
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("page", result.page());
        response.put("limit", result.limit());
        response.put("total", result.total());
        response.put(
                "totalPages",
                result.totalPages()
        );
        response.put("data", result.data());

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Get Product By ID
    // ============================================================

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')"
    )
    public ResponseEntity<Map<String, Object>> getProductById(
            @PathVariable Integer id
    ) {

        ProductResponse product =
                productService.getProductById(id);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("data", product);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Update Product
    // ============================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> updateProduct(

            @PathVariable Integer id,

            @Valid @ModelAttribute ProductRequest request,

            @RequestParam(
                    value = "productImage",
                    required = false
            )
            MultipartFile productImage
    ) {

        String image =
                fileStorageService.storeProductImage(
                        productImage
                );

        productService.updateProduct(
                id,
                request,
                image
        );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Product updated successfully"
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Delete Product
    // ============================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteProduct(
            @PathVariable Integer id
    ) {

        productService.deleteProduct(id);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Product deleted successfully"
        );

        return ResponseEntity.ok(response);
    }
}