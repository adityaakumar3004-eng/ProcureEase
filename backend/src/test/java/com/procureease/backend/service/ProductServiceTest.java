package com.procureease.backend.service;

import com.procureease.backend.dto.ProductRequest;
import com.procureease.backend.dto.ProductResponse;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.NotificationRepository;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.VendorRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private ProductService productService;

    private Vendor vendor;
    private Product product;
    private ProductRequest productRequest;

    @BeforeEach
    void setUp() {

        vendor = Vendor.builder()
                .id(1)
                .name("Tech Supplier")
                .email("tech@example.com")
                .phone("9876543210")
                .address("Delhi")
                .build();

        product = Product.builder()
                .id(1)
                .name("Laptop")
                .description("Gaming Laptop")
                .price(new BigDecimal("50000"))
                .stock(20)
                .vendor(vendor)
                .image("laptop.jpg")
                .build();

        productRequest = ProductRequest.builder()
                .name("Laptop")
                .description("Gaming Laptop")
                .price(new BigDecimal("50000"))
                .stock(20)
                .vendorId(1)
                .build();
    }

    // ============================================================
    // 1. Create Product Successfully
    // ============================================================

    @Test
    void createProduct_ShouldCreateProduct_WhenVendorExists() {

        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));

        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> {

                    Product savedProduct =
                            invocation.getArgument(0);

                    savedProduct.setId(1);

                    return savedProduct;
                });

        ProductResponse response =
                productService.createProduct(
                        productRequest,
                        "laptop.jpg"
                );

        assertNotNull(response);

        assertEquals(1, response.getId());

        assertEquals(
                "Laptop",
                response.getName()
        );

        assertEquals(
                new BigDecimal("50000"),
                response.getPrice()
        );

        assertEquals(
                "Tech Supplier",
                response.getVendorName()
        );

        verify(vendorRepository)
                .findById(1);

        verify(productRepository)
                .save(any(Product.class));
    }

    // ============================================================
    // 2. Create Product - Vendor Not Found
    // ============================================================

    @Test
    void createProduct_ShouldThrowException_WhenVendorNotFound() {

        when(vendorRepository.findById(1))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> productService.createProduct(
                                productRequest,
                                "laptop.jpg"
                        )
                );

        assertEquals(
                "Vendor not found",
                exception.getMessage()
        );

        verify(productRepository, never())
                .save(any(Product.class));
    }

    // ============================================================
    // 3. Get Product By ID Successfully
    // ============================================================

    @Test
    void getProductById_ShouldReturnProduct_WhenProductExists() {

        when(productRepository.findProductWithVendorById(1))
                .thenReturn(Optional.of(product));

        ProductResponse response =
                productService.getProductById(1);

        assertNotNull(response);

        assertEquals(
                1,
                response.getId()
        );

        assertEquals(
                "Laptop",
                response.getName()
        );

        assertEquals(
                "Tech Supplier",
                response.getVendorName()
        );

        verify(productRepository)
                .findProductWithVendorById(1);
    }

    // ============================================================
    // 4. Get Product - Not Found
    // ============================================================

    @Test
    void getProductById_ShouldThrowException_WhenProductNotFound() {

        when(productRepository.findProductWithVendorById(1))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> productService.getProductById(1)
                );

        assertEquals(
                "Product not found",
                exception.getMessage()
        );
    }

    // ============================================================
    // 5. Update Stock - Create Low Stock Notification
    // ============================================================

    @Test
    void updateProductStock_ShouldCreateNotification_WhenStockIsLow() {

        product.setStock(20);

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        when(notificationRepository
                .findByTitleAndMessageAndTypeAndIsReadFalse(
                        anyString(),
                        anyString(),
                        anyString()
                ))
                .thenReturn(Optional.empty());

        productService.updateProductStock(
                1,
                5
        );

        assertEquals(
                5,
                product.getStock()
        );

        verify(productRepository)
                .save(product);

        verify(notificationRepository)
                .save(any());
    }

    // ============================================================
    // 6. Delete Product Successfully
    // ============================================================

    @Test
    void deleteProduct_ShouldDeleteProduct_WhenProductExists() {

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        productService.deleteProduct(1);

        verify(productRepository)
                .findById(1);

        verify(productRepository)
                .delete(product);
    }
}