package com.procureease.backend.service;

import com.procureease.backend.dto.PaymentResponse;
import com.procureease.backend.entity.Invoice;
import com.procureease.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    // ============================================================
    // Get All Paid Invoices
    // ============================================================

    public List<PaymentResponse> getAllPayments() {

        return paymentRepository
                .findByPaymentStatus("Paid")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================================================
    // Invoice → PaymentResponse
    // ============================================================

    private PaymentResponse mapToResponse(
            Invoice invoice
    ) {

        return PaymentResponse.builder()

                .id(invoice.getId())

                .invoiceNumber(
                        invoice.getInvoiceNumber()
                )

                .vendorName(
                        invoice
                                .getPurchaseOrder()
                                .getVendor()
                                .getName()
                )

                .purchaseOrderId(
                        invoice
                                .getPurchaseOrder()
                                .getId()
                )

                .paymentMethod(
                        invoice.getPaymentMethod()
                )

                .transactionId(
                        invoice.getTransactionId()
                )

                .paymentDate(
                        invoice.getPaymentDate()
                )

                .paymentStatus(
                        invoice.getPaymentStatus()
                )

                .build();
    }
}