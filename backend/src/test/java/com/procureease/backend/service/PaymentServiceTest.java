package com.procureease.backend.service;

import com.procureease.backend.dto.PaymentResponse;
import com.procureease.backend.entity.Invoice;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaymentService paymentService;

    private Invoice invoice;

    @BeforeEach
    void setUp() {

        // Create Vendor
        Vendor vendor = Vendor.builder()
                .id(1)
                .name("ABC Suppliers")
                .email("abc@test.com")
                .phone("9876543210")
                .address("Mumbai")
                .build();

        // Create Purchase Order
        PurchaseOrder purchaseOrder = PurchaseOrder.builder()
                .id(1)
                .vendor(vendor)
                .build();

        // Create Paid Invoice
        invoice = Invoice.builder()
                .id(1)
                .purchaseOrder(purchaseOrder)
                .invoiceNumber("INV-001")
                .paymentMethod("UPI")
                .transactionId("TXN123")
                .paymentDate(LocalDateTime.now())
                .paymentStatus("Paid")
                .build();
    }

    // ============================================================
    // Test 1: Get All Payments Successfully
    // ============================================================

    @Test
    void getAllPayments_ShouldReturnPaidInvoices() {

        // Arrange
        when(paymentRepository.findByPaymentStatus("Paid"))
                .thenReturn(List.of(invoice));

        // Act
        List<PaymentResponse> responses =
                paymentService.getAllPayments();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());

        verify(paymentRepository)
                .findByPaymentStatus("Paid");
    }

    // ============================================================
    // Test 2: Correctly Map Payment Details
    // ============================================================

    @Test
    void getAllPayments_ShouldMapPaymentDetailsCorrectly() {

        // Arrange
        when(paymentRepository.findByPaymentStatus("Paid"))
                .thenReturn(List.of(invoice));

        // Act
        List<PaymentResponse> responses =
                paymentService.getAllPayments();

        // Assert
        PaymentResponse response = responses.get(0);

        assertEquals(1, response.getId());
        assertEquals("INV-001", response.getInvoiceNumber());
        assertEquals("ABC Suppliers", response.getVendorName());
        assertEquals(1, response.getPurchaseOrderId());
        assertEquals("UPI", response.getPaymentMethod());
        assertEquals("TXN123", response.getTransactionId());
        assertEquals("Paid", response.getPaymentStatus());
        assertNotNull(response.getPaymentDate());
    }

    // ============================================================
    // Test 3: Return Empty List When No Payments Exist
    // ============================================================

    @Test
    void getAllPayments_ShouldReturnEmptyList_WhenNoPaymentsExist() {

        // Arrange
        when(paymentRepository.findByPaymentStatus("Paid"))
                .thenReturn(List.of());

        // Act
        List<PaymentResponse> responses =
                paymentService.getAllPayments();

        // Assert
        assertNotNull(responses);
        assertTrue(responses.isEmpty());

        verify(paymentRepository)
                .findByPaymentStatus("Paid");
    }
}