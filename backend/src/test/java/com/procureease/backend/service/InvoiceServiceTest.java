package com.procureease.backend.service;

import com.procureease.backend.dto.CreateInvoiceRequest;
import com.procureease.backend.dto.InvoiceResponse;
import com.procureease.backend.dto.MarkInvoicePaidRequest;
import com.procureease.backend.dto.UpdateInvoiceRequest;
import com.procureease.backend.entity.Invoice;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.InvoiceRepository;
import com.procureease.backend.repository.PurchaseOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    @Mock
    private UploadService uploadService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private MultipartFile file;

    @InjectMocks
    private InvoiceService invoiceService;

    private PurchaseOrder purchaseOrder;
    private Invoice invoice;
    private CreateInvoiceRequest createRequest;

    @BeforeEach
    void setUp() {

        purchaseOrder = PurchaseOrder.builder()
                .id(1)
                .build();

        createRequest = new CreateInvoiceRequest();
        createRequest.setPurchaseOrderId(1);
        createRequest.setInvoiceNumber("INV-001");
        createRequest.setInvoiceDate(LocalDate.of(2026, 1, 15));
        createRequest.setStatus("Pending");

        invoice = Invoice.builder()
                .id(1)
                .purchaseOrder(purchaseOrder)
                .invoiceNumber("INV-001")
                .invoiceFile("invoice.pdf")
                .invoiceDate(LocalDate.of(2026, 1, 15))
                .status("Pending")
                .paymentStatus("Pending")
                .build();
    }

    // ============================================================
    // Test 1: Create Invoice Successfully
    // ============================================================

    @Test
    void createInvoice_ShouldCreateInvoiceSuccessfully()
            throws IOException {

        when(file.isEmpty()).thenReturn(false);

        when(purchaseOrderRepository.findById(1))
                .thenReturn(Optional.of(purchaseOrder));

        when(invoiceRepository.existsByInvoiceNumber("INV-001"))
                .thenReturn(false);

        when(uploadService.uploadInvoice(file))
                .thenReturn(
                        new UploadService.UploadResult(
                                "invoice.pdf",
                                "invoice.pdf"
                        )
                );

        when(invoiceRepository.save(any(Invoice.class)))
                .thenReturn(invoice);

        InvoiceResponse response =
                invoiceService.createInvoice(
                        createRequest,
                        file
                );

        assertNotNull(response);
        assertEquals(1, response.getId());
        assertEquals("INV-001", response.getInvoiceNumber());
        assertEquals("invoice.pdf", response.getInvoiceFile());
        assertEquals("Pending", response.getStatus());
        assertEquals("Pending", response.getPaymentStatus());

        verify(invoiceRepository)
                .save(any(Invoice.class));

        verify(notificationService)
                .createNotificationIfNotExists(
                        eq("Payment Due"),
                        contains("INV-001"),
                        eq("Payment Due")
                );
    }

    // ============================================================
    // Test 2: Invoice File Missing
    // ============================================================

    @Test
    void createInvoice_ShouldThrowException_WhenFileIsMissing() {

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> invoiceService.createInvoice(
                                createRequest,
                                null
                        )
                );

        assertEquals(
                "Invoice file is required",
                exception.getMessage()
        );

        verifyNoInteractions(
                purchaseOrderRepository,
                invoiceRepository,
                uploadService
        );
    }

    // ============================================================
    // Test 3: Empty Invoice File
    // ============================================================

    @Test
    void createInvoice_ShouldThrowException_WhenFileIsEmpty() {

        when(file.isEmpty()).thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> invoiceService.createInvoice(
                                createRequest,
                                file
                        )
                );

        assertEquals(
                "Invoice file is required",
                exception.getMessage()
        );

        verifyNoInteractions(
                purchaseOrderRepository,
                invoiceRepository,
                uploadService
        );
    }

    // ============================================================
    // Test 4: Purchase Order Not Found
    // ============================================================

    @Test
    void createInvoice_ShouldThrowException_WhenPurchaseOrderNotFound()
            throws IOException {

        when(file.isEmpty()).thenReturn(false);

        when(purchaseOrderRepository.findById(1))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> invoiceService.createInvoice(
                                createRequest,
                                file
                        )
                );

        assertEquals(
                "Purchase order not found",
                exception.getMessage()
        );

        verify(uploadService, never())
                .uploadInvoice(any());
    }

    // ============================================================
    // Test 5: Duplicate Invoice Number
    // ============================================================

    @Test
    void createInvoice_ShouldThrowException_WhenInvoiceNumberExists()
            throws IOException {

        when(file.isEmpty()).thenReturn(false);

        when(purchaseOrderRepository.findById(1))
                .thenReturn(Optional.of(purchaseOrder));

        when(invoiceRepository.existsByInvoiceNumber("INV-001"))
                .thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> invoiceService.createInvoice(
                                createRequest,
                                file
                        )
                );

        assertEquals(
                "Invoice number already exists",
                exception.getMessage()
        );

        verify(uploadService, never())
                .uploadInvoice(any());

        verify(invoiceRepository, never())
                .save(any());
    }

    // ============================================================
    // Test 6: Default Status Should Be Pending
    // ============================================================

    @Test
    void createInvoice_ShouldSetDefaultStatus_WhenStatusIsBlank()
            throws IOException {

        createRequest.setStatus("");

        when(file.isEmpty()).thenReturn(false);

        when(purchaseOrderRepository.findById(1))
                .thenReturn(Optional.of(purchaseOrder));

        when(invoiceRepository.existsByInvoiceNumber("INV-001"))
                .thenReturn(false);

        when(uploadService.uploadInvoice(file))
                .thenReturn(
                        new UploadService.UploadResult(
                                "invoice.pdf",
                                "invoice.pdf"
                        )
                );

        when(invoiceRepository.save(any(Invoice.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        ArgumentCaptor<Invoice> invoiceCaptor =
                ArgumentCaptor.forClass(Invoice.class);

        invoiceService.createInvoice(
                createRequest,
                file
        );

        verify(invoiceRepository)
                .save(invoiceCaptor.capture());

        Invoice savedInvoice =
                invoiceCaptor.getValue();

        assertEquals(
                "Pending",
                savedInvoice.getStatus()
        );

        assertEquals(
                "Pending",
                savedInvoice.getPaymentStatus()
        );
    }

    // ============================================================
    // Test 7: Get All Invoices
    // ============================================================

    @Test
    void getAllInvoices_ShouldReturnAllInvoices() {

        when(invoiceRepository.findAllWithPurchaseOrder())
                .thenReturn(List.of(invoice));

        List<InvoiceResponse> responses =
                invoiceService.getAllInvoices();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(
                "INV-001",
                responses.get(0).getInvoiceNumber()
        );

        verify(invoiceRepository)
                .findAllWithPurchaseOrder();
    }

    // ============================================================
    // Test 8: Mark Approved Invoice As Paid
    // ============================================================

    @Test
    void markInvoiceAsPaid_ShouldMarkInvoiceSuccessfully() {

        invoice.setStatus("Approved");
        invoice.setPaymentStatus("Pending");

        MarkInvoicePaidRequest request =
                new MarkInvoicePaidRequest();

        request.setPaymentMethod("UPI");
        request.setTransactionId("TXN123");

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));

        invoiceService.markInvoiceAsPaid(
                1,
                request
        );

        assertEquals(
                "Paid",
                invoice.getPaymentStatus()
        );

        assertNotNull(
                invoice.getPaymentDate()
        );

        assertEquals(
                "UPI",
                invoice.getPaymentMethod()
        );

        assertEquals(
                "TXN123",
                invoice.getTransactionId()
        );

        verify(invoiceRepository)
                .save(invoice);
    }

    // ============================================================
    // Test 9: Cannot Pay Unapproved Invoice
    // ============================================================

    @Test
    void markInvoiceAsPaid_ShouldThrowException_WhenInvoiceNotApproved() {

        invoice.setStatus("Pending");

        MarkInvoicePaidRequest request =
                new MarkInvoicePaidRequest();

        request.setPaymentMethod("UPI");

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> invoiceService.markInvoiceAsPaid(
                                1,
                                request
                        )
                );

        assertEquals(
                "Only approved invoices can be marked as paid.",
                exception.getMessage()
        );

        verify(invoiceRepository, never())
                .save(any());
    }

    // ============================================================
    // Test 10: Cannot Pay Already Paid Invoice
    // ============================================================

    @Test
    void markInvoiceAsPaid_ShouldThrowException_WhenAlreadyPaid() {

        invoice.setStatus("Approved");
        invoice.setPaymentStatus("Paid");

        MarkInvoicePaidRequest request =
                new MarkInvoicePaidRequest();

        request.setPaymentMethod("UPI");

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> invoiceService.markInvoiceAsPaid(
                                1,
                                request
                        )
                );

        assertEquals(
                "Invoice is already marked as paid.",
                exception.getMessage()
        );

        verify(invoiceRepository, never())
                .save(any());
    }
}