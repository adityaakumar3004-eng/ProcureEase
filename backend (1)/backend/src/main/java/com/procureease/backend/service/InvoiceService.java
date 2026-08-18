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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final UploadService uploadService;

    private final NotificationService notificationService;

    // ============================================================
    // Create Invoice
    // ============================================================

    public InvoiceResponse createInvoice(
            CreateInvoiceRequest request,
            MultipartFile file
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Invoice file is required"
            );
        }

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository
                        .findById(request.getPurchaseOrderId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase order not found"
                                )
                        );

        if (invoiceRepository.existsByInvoiceNumber(
                request.getInvoiceNumber()
        )) {
            throw new IllegalArgumentException(
                    "Invoice number already exists"
            );
        }

        UploadService.UploadResult uploadResult =
                uploadService.uploadInvoice(file);

        String status =
                request.getStatus() == null ||
                        request.getStatus().isBlank()
                        ? "Pending"
                        : request.getStatus();

        Invoice invoice =
                Invoice.builder()
                        .purchaseOrder(purchaseOrder)
                        .invoiceNumber(
                                request.getInvoiceNumber()
                        )
                        .invoiceFile(
                                uploadResult.fileName()
                        )
                        .invoiceDate(
                                request.getInvoiceDate()
                        )
                        .status(status)
                        .paymentStatus("Pending")
                        .build();

        Invoice savedInvoice =
                invoiceRepository.save(invoice);

        // Create payment due notification
        if (!"Paid".equalsIgnoreCase(
                savedInvoice.getPaymentStatus()
        )) {

            notificationService
                    .createNotificationIfNotExists(
                            "Payment Due",
                            "Invoice " +
                                    savedInvoice
                                            .getInvoiceNumber() +
                                    " payment is pending.",
                            "Payment Due"
                    );
        }

        return mapToResponse(savedInvoice);
    }

    // ============================================================
    // Get All Invoices
    // ============================================================

    public List<InvoiceResponse> getAllInvoices() {

        return invoiceRepository
                .findAllWithPurchaseOrder()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================================================
    // Get Invoice By ID
    // ============================================================

    public InvoiceResponse getInvoiceById(
            Integer id
    ) {

        Invoice invoice =
                invoiceRepository
                        .findByIdWithPurchaseOrder(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invoice not found"
                                )
                        );

        return mapToResponse(invoice);
    }

    // ============================================================
    // Update Invoice
    // ============================================================

    public InvoiceResponse updateInvoice(
            Integer id,
            UpdateInvoiceRequest request,
            MultipartFile file
    ) throws IOException {

        Invoice invoice =
                invoiceRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invoice not found"
                                )
                        );

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository
                        .findById(request.getPurchaseOrderId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase order not found"
                                )
                        );

        if (!invoice.getInvoiceNumber()
                .equals(request.getInvoiceNumber())
                &&
                invoiceRepository.existsByInvoiceNumber(
                        request.getInvoiceNumber()
                )) {

            throw new IllegalArgumentException(
                    "Invoice number already exists"
            );
        }

        invoice.setPurchaseOrder(purchaseOrder);
        invoice.setInvoiceNumber(
                request.getInvoiceNumber()
        );
        invoice.setInvoiceDate(
                request.getInvoiceDate()
        );
        invoice.setStatus(
                request.getStatus()
        );

        // Replace invoice file only if a new file is uploaded
        if (file != null && !file.isEmpty()) {

            UploadService.UploadResult uploadResult =
                    uploadService.uploadInvoice(file);

            invoice.setInvoiceFile(
                    uploadResult.fileName()
            );
        }

        Invoice updatedInvoice =
                invoiceRepository.save(invoice);

        return mapToResponse(updatedInvoice);
    }

    // ============================================================
    // Mark Invoice As Paid
    // ============================================================

    public void markInvoiceAsPaid(
            Integer id,
            MarkInvoicePaidRequest request
    ) {

        Invoice invoice =
                invoiceRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invoice not found"
                                )
                        );

        if (!"Approved".equalsIgnoreCase(
                invoice.getStatus()
        )) {

            throw new IllegalArgumentException(
                    "Only approved invoices can be marked as paid."
            );
        }

        if ("Paid".equalsIgnoreCase(
                invoice.getPaymentStatus()
        )) {

            throw new IllegalArgumentException(
                    "Invoice is already marked as paid."
            );
        }

        if (request.getPaymentMethod() == null ||
                request.getPaymentMethod().isBlank()) {

            throw new IllegalArgumentException(
                    "Payment method is required"
            );
        }

        invoice.setPaymentStatus("Paid");
        invoice.setPaymentDate(
                LocalDateTime.now()
        );
        invoice.setPaymentMethod(
                request.getPaymentMethod()
        );
        invoice.setTransactionId(
                request.getTransactionId()
        );

        invoiceRepository.save(invoice);
    }

    // ============================================================
    // Delete Invoice
    // ============================================================

    public void deleteInvoice(
            Integer id
    ) {

        Invoice invoice =
                invoiceRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invoice not found"
                                )
                        );

        invoiceRepository.delete(invoice);
    }

    // ============================================================
    // Entity → Response DTO
    // ============================================================

    private InvoiceResponse mapToResponse(
            Invoice invoice
    ) {

        return InvoiceResponse.builder()
                .id(invoice.getId())
                .purchaseOrderId(
                        invoice
                                .getPurchaseOrder()
                                .getId()
                )
                .invoiceNumber(
                        invoice.getInvoiceNumber()
                )
                .invoiceFile(
                        invoice.getInvoiceFile()
                )
                .invoiceDate(
                        invoice.getInvoiceDate()
                )
                .status(
                        invoice.getStatus()
                )
                .paymentStatus(
                        invoice.getPaymentStatus()
                )
                .paymentDate(
                        invoice.getPaymentDate()
                )
                .paymentMethod(
                        invoice.getPaymentMethod()
                )
                .transactionId(
                        invoice.getTransactionId()
                )
                .createdAt(
                        invoice.getCreatedAt()
                )
                .updatedAt(
                        invoice.getUpdatedAt()
                )
                .build();
    }
}