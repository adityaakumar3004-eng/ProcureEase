package com.procureease.backend.service;

import com.procureease.backend.dto.SaleRequest;
import com.procureease.backend.dto.SaleResponse;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.Sale;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.SaleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private SaleService saleService;

    private Product product;

    private SaleRequest saleRequest;

    private Sale sale;

    @BeforeEach
    void setUp() {

        // Create test product
        product = Product.builder()
                .id(1)
                .name("Laptop")
                .description("Test Laptop")
                .price(new BigDecimal("50000.00"))
                .stock(10)
                .build();

        // Create sale request
        saleRequest = new SaleRequest();
        saleRequest.setProductId(1);
        saleRequest.setQuantity(2);

        // Create test sale
        sale = Sale.builder()
                .id(1)
                .product(product)
                .quantity(2)
                .price(new BigDecimal("50000.00"))
                .totalAmount(new BigDecimal("100000.00"))
                .createdAt(LocalDateTime.now())
                .build();
    }

    // ============================================================
    // Test 1: Create Sale Successfully
    // ============================================================

    @Test
    void createSale_ShouldCreateSaleSuccessfully() {

        // Arrange
        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        when(saleRepository.save(any(Sale.class)))
                .thenReturn(sale);

        // Act
        SaleResponse response =
                saleService.createSale(saleRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("Laptop", response.getProductName());
        assertEquals(2, response.getQuantity());
        assertEquals(
                new BigDecimal("50000.00"),
                response.getPrice()
        );
        assertEquals(
                new BigDecimal("100000.00"),
                response.getTotalAmount()
        );

        verify(productRepository)
                .findById(1);

        verify(saleRepository)
                .save(any(Sale.class));

        verify(productService)
                .updateProductStock(1, 8);
    }

    // ============================================================
    // Test 2: Product Not Found
    // ============================================================

    @Test
    void createSale_ShouldThrowException_WhenProductNotFound() {

        // Arrange
        when(productRepository.findById(1))
                .thenReturn(Optional.empty());

        // Act + Assert
        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> saleService.createSale(saleRequest)
                );

        assertEquals(
                "Product not found",
                exception.getMessage()
        );

        verify(productRepository)
                .findById(1);

        verify(saleRepository, never())
                .save(any());

        verify(productService, never())
                .updateProductStock(anyInt(), anyInt());
    }

    // ============================================================
    // Test 3: Insufficient Stock
    // ============================================================

    @Test
    void createSale_ShouldThrowException_WhenStockIsInsufficient() {

        // Arrange
        product.setStock(1);

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        // Act + Assert
        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> saleService.createSale(saleRequest)
                );

        assertEquals(
                "Insufficient Stock",
                exception.getMessage()
        );

        verify(productRepository)
                .findById(1);

        verify(saleRepository, never())
                .save(any());

        verify(productService, never())
                .updateProductStock(anyInt(), anyInt());
    }

    // ============================================================
    // Test 4: Correct Sale Details Saved
    // ============================================================

    @Test
    void createSale_ShouldCalculateCorrectTotalAmount() {

        // Arrange
        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        when(saleRepository.save(any(Sale.class)))
                .thenReturn(sale);

        ArgumentCaptor<Sale> saleCaptor =
                ArgumentCaptor.forClass(Sale.class);

        // Act
        saleService.createSale(saleRequest);

        // Assert
        verify(saleRepository)
                .save(saleCaptor.capture());

        Sale capturedSale =
                saleCaptor.getValue();

        assertEquals(product, capturedSale.getProduct());
        assertEquals(2, capturedSale.getQuantity());
        assertEquals(
                new BigDecimal("50000.00"),
                capturedSale.getPrice()
        );
        assertEquals(
                new BigDecimal("100000.00"),
                capturedSale.getTotalAmount()
        );
    }

    // ============================================================
    // Test 5: Update Product Stock After Sale
    // ============================================================

    @Test
    void createSale_ShouldUpdateProductStock() {

        // Arrange
        product.setStock(10);

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        when(saleRepository.save(any(Sale.class)))
                .thenReturn(sale);

        // Act
        saleService.createSale(saleRequest);

        // Assert
        verify(productService)
                .updateProductStock(
                        product.getId(),
                        8
                );
    }

    // ============================================================
    // Test 6: Get All Sales Successfully
    // ============================================================

    @Test
    void getAllSales_ShouldReturnAllSales() {

        // Arrange
        when(saleRepository.findAllSalesWithProduct())
                .thenReturn(List.of(sale));

        // Act
        List<SaleResponse> responses =
                saleService.getAllSales();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());

        SaleResponse response =
                responses.get(0);

        assertEquals(1, response.getId());
        assertEquals(1, response.getProductId());
        assertEquals("Laptop", response.getProductName());
        assertEquals(2, response.getQuantity());
        assertEquals(
                new BigDecimal("50000.00"),
                response.getPrice()
        );
        assertEquals(
                new BigDecimal("100000.00"),
                response.getTotalAmount()
        );

        verify(saleRepository)
                .findAllSalesWithProduct();
    }
}