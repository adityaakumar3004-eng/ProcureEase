package com.procureease.backend.service;

import com.procureease.backend.dto.PurchaseOrderItemRequest;
import com.procureease.backend.dto.PurchaseOrderRequest;
import com.procureease.backend.dto.PurchaseOrderResponse;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.NotificationRepository;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.PurchaseOrderRepository;
import com.procureease.backend.repository.VendorRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderServiceTest {

    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private PurchaseOrderService purchaseOrderService;

    private Vendor vendor;
    private Product product;
    private PurchaseOrderRequest request;

    @BeforeEach
    void setUp() {

        vendor = Vendor.builder()
                .id(1)
                .name("ABC Suppliers")
                .email("abc@example.com")
                .phone("9876543210")
                .address("Delhi")
                .build();

        product = Product.builder()
                .id(1)
                .name("Laptop")
                .description("Gaming Laptop")
                .price(new BigDecimal("50000"))
                .stock(10)
                .vendor(vendor)
                .build();

        PurchaseOrderItemRequest itemRequest =
                new PurchaseOrderItemRequest();

        itemRequest.setProductId(1);
        itemRequest.setQuantity(2);

        request = new PurchaseOrderRequest();
        request.setVendorId(1);
        request.setItems(List.of(itemRequest));
    }

    // ============================================================
    // 1. Create Purchase Order Successfully
    // ============================================================

    @Test
    void createPurchaseOrder_ShouldCreateOrderAndReduceStock() {

        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        when(purchaseOrderRepository.save(any(PurchaseOrder.class)))
                .thenAnswer(invocation -> {

                    PurchaseOrder order =
                            invocation.getArgument(0);

                    order.setId(1);

                    return order;
                });

        PurchaseOrderResponse response =
                purchaseOrderService.createPurchaseOrder(request);

        assertNotNull(response);

        assertEquals(1, response.getId());

        assertEquals(
                new BigDecimal("100000"),
                response.getTotalAmount()
        );

        assertEquals(
                "Pending",
                response.getStatus()
        );

        assertEquals(
                8,
                product.getStock()
        );

        assertEquals(
                1,
                response.getItems().size()
        );

        verify(purchaseOrderRepository)
                .save(any(PurchaseOrder.class));

        verify(productRepository)
                .save(product);
    }

    // ============================================================
    // 2. Create Purchase Order - Vendor Not Found
    // ============================================================

    @Test
    void createPurchaseOrder_ShouldThrowException_WhenVendorNotFound() {

        when(vendorRepository.findById(1))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> purchaseOrderService
                                .createPurchaseOrder(request)
                );

        assertEquals(
                "Vendor not found",
                exception.getMessage()
        );

        verify(purchaseOrderRepository, never())
                .save(any());
    }

    // ============================================================
    // 3. Create Purchase Order - Product Not Found
    // ============================================================

    @Test
    void createPurchaseOrder_ShouldThrowException_WhenProductNotFound() {

        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));

        when(productRepository.findById(1))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> purchaseOrderService
                                .createPurchaseOrder(request)
                );

        assertEquals(
                "Product ID 1 not found",
                exception.getMessage()
        );

        verify(purchaseOrderRepository, never())
                .save(any());
    }

    // ============================================================
    // 4. Create Purchase Order - Insufficient Stock
    // ============================================================

    @Test
    void createPurchaseOrder_ShouldThrowException_WhenStockIsInsufficient() {

        product.setStock(1);

        when(vendorRepository.findById(1))
                .thenReturn(Optional.of(vendor));

        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> purchaseOrderService
                                .createPurchaseOrder(request)
                );

        assertEquals(
                "Laptop has only 1 items in stock",
                exception.getMessage()
        );

        verify(purchaseOrderRepository, never())
                .save(any());

        verify(productRepository, never())
                .save(any());
    }

    // ============================================================
    // 5. Get Purchase Order By ID Successfully
    // ============================================================

    @Test
    void getPurchaseOrderById_ShouldReturnOrder_WhenOrderExists() {

        PurchaseOrder order = PurchaseOrder.builder()
                .id(1)
                .vendor(vendor)
                .totalAmount(new BigDecimal("100000"))
                .status("Pending")
                .items(List.of())
                .build();

        when(purchaseOrderRepository.findByIdWithDetails(1))
                .thenReturn(Optional.of(order));

        PurchaseOrderResponse response =
                purchaseOrderService.getPurchaseOrderById(1);

        assertNotNull(response);

        assertEquals(1, response.getId());

        assertEquals(
                "ABC Suppliers",
                response.getVendorName()
        );

        assertEquals(
                "Pending",
                response.getStatus()
        );

        verify(purchaseOrderRepository)
                .findByIdWithDetails(1);
    }

    // ============================================================
    // 6. Update Purchase Order Status
    // ============================================================

    @Test
    void updatePurchaseOrderStatus_ShouldUpdateStatusAndCreateNotification() {

        PurchaseOrder order = PurchaseOrder.builder()
                .id(1)
                .vendor(vendor)
                .totalAmount(new BigDecimal("100000"))
                .status("Pending")
                .items(List.of())
                .build();

        when(purchaseOrderRepository.findById(1))
                .thenReturn(Optional.of(order));

        when(notificationRepository
                .findByTitleAndMessageAndTypeAndIsReadFalse(
                        anyString(),
                        anyString(),
                        anyString()
                ))
                .thenReturn(Optional.empty());

        purchaseOrderService.updatePurchaseOrderStatus(
                1,
                "Approved"
        );

        assertEquals(
                "Approved",
                order.getStatus()
        );

        verify(purchaseOrderRepository)
                .save(order);

        verify(notificationRepository)
                .save(any());
    }
}