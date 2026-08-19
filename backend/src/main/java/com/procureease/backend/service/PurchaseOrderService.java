package com.procureease.backend.service;

import com.procureease.backend.dto.PurchaseOrderItemRequest;
import com.procureease.backend.dto.PurchaseOrderItemResponse;
import com.procureease.backend.dto.PurchaseOrderRequest;
import com.procureease.backend.dto.PurchaseOrderResponse;
import com.procureease.backend.entity.Notification;
import com.procureease.backend.entity.Product;
import com.procureease.backend.entity.PurchaseOrder;
import com.procureease.backend.entity.PurchaseOrderItem;
import com.procureease.backend.entity.Vendor;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.NotificationRepository;
import com.procureease.backend.repository.ProductRepository;
import com.procureease.backend.repository.PurchaseOrderRepository;
import com.procureease.backend.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    private final VendorRepository vendorRepository;

    private final ProductRepository productRepository;

    private final NotificationRepository notificationRepository;

    // ============================================================
    // Create Purchase Order
    // ============================================================

    @Transactional
    public PurchaseOrderResponse createPurchaseOrder(
            PurchaseOrderRequest request
    ) {

        // Find Vendor
        Vendor vendor = vendorRepository.findById(
                request.getVendorId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Vendor not found"
                )
        );

        BigDecimal totalAmount = BigDecimal.ZERO;

        List<PurchaseOrderItem> orderItems =
                new ArrayList<>();

        // Validate Products + Calculate Total
        for (PurchaseOrderItemRequest itemRequest :
                request.getItems()) {

            Product product = productRepository.findById(
                    itemRequest.getProductId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Product ID " +
                                    itemRequest.getProductId() +
                                    " not found"
                    )
            );

            // Check Stock
            if (product.getStock() <
                    itemRequest.getQuantity()) {

                throw new IllegalArgumentException(
                        product.getName() +
                                " has only " +
                                product.getStock() +
                                " items in stock"
                );
            }

            // Calculate item total
            BigDecimal itemTotal =
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            itemRequest.getQuantity()
                                    )
                            );

            totalAmount =
                    totalAmount.add(itemTotal);

            // Create Purchase Order Item
            PurchaseOrderItem orderItem =
                    PurchaseOrderItem.builder()
                            .product(product)
                            .price(product.getPrice())
                            .quantity(
                                    itemRequest.getQuantity()
                            )
                            .build();

            orderItems.add(orderItem);
        }

        // Create Purchase Order
        PurchaseOrder purchaseOrder =
                PurchaseOrder.builder()
                        .vendor(vendor)
                        .totalAmount(totalAmount)
                        .status("Pending")
                        .build();

        // Connect items to Purchase Order
        for (PurchaseOrderItem item : orderItems) {
            item.setPurchaseOrder(purchaseOrder);
        }

        purchaseOrder.setItems(orderItems);

        // Save Purchase Order + Items
        PurchaseOrder savedOrder =
                purchaseOrderRepository.save(
                        purchaseOrder
                );

        // Reduce Product Stock
        for (PurchaseOrderItem item : orderItems) {

            Product product = item.getProduct();

            int newStock =
                    product.getStock()
                            - item.getQuantity();

            product.setStock(newStock);

            productRepository.save(product);
        }

        return mapToResponse(savedOrder);
    }

    // ============================================================
    // Get All Purchase Orders
    // ============================================================

    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAllPurchaseOrders() {

        return purchaseOrderRepository
                .findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================================================
    // Get Purchase Order By ID
    // ============================================================

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getPurchaseOrderById(
            Integer id
    ) {

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository
                        .findByIdWithDetails(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase Order not found"
                                )
                        );

        return mapToResponse(purchaseOrder);
    }

    // ============================================================
    // Update Purchase Order Status
    // ============================================================

    @Transactional
    public void updatePurchaseOrderStatus(
            Integer id,
            String status
    ) {

        PurchaseOrder purchaseOrder =
                purchaseOrderRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase Order not found"
                                )
                        );

        purchaseOrder.setStatus(status);

        purchaseOrderRepository.save(
                purchaseOrder
        );

        // Create Purchase Update Notification
        createPurchaseUpdateNotification(
                id,
                status
        );
    }

    // ============================================================
    // Purchase Update Notification
    // ============================================================

    private void createPurchaseUpdateNotification(
            Integer id,
            String status
    ) {

        String title =
                "Purchase Order Updated";

        String message =
                "Purchase Order #" +
                        id +
                        " has been " +
                        status +
                        ".";

        String type =
                "Purchase Update";

        // Check duplicate unread notification
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
        Notification notification =
                Notification.builder()
                        .title(title)
                        .message(message)
                        .type(type)
                        .isRead(false)
                        .build();

        notificationRepository.save(
                notification
        );
    }

    // ============================================================
    // Convert Entity → Response DTO
    // ============================================================

    private PurchaseOrderResponse mapToResponse(
            PurchaseOrder purchaseOrder
    ) {

        List<PurchaseOrderItemResponse> items =
                purchaseOrder.getItems()
                        .stream()
                        .map(this::mapItemToResponse)
                        .toList();

        return PurchaseOrderResponse.builder()
                .id(purchaseOrder.getId())
                .vendorId(
                        purchaseOrder.getVendor().getId()
                )
                .vendorName(
                        purchaseOrder.getVendor().getName()
                )
                .totalAmount(
                        purchaseOrder.getTotalAmount()
                )
                .status(
                        purchaseOrder.getStatus()
                )
                .createdAt(
                        purchaseOrder.getCreatedAt()
                )
                .updatedAt(
                        purchaseOrder.getUpdatedAt()
                )
                .items(items)
                .build();
    }

    // ============================================================
    // Convert Item → Response DTO
    // ============================================================

    private PurchaseOrderItemResponse mapItemToResponse(
            PurchaseOrderItem item
    ) {

        BigDecimal subtotal =
                item.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        item.getQuantity()
                                )
                        );

        return PurchaseOrderItemResponse.builder()
                .id(item.getId())
                .productId(
                        item.getProduct().getId()
                )
                .productName(
                        item.getProduct().getName()
                )
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(subtotal)
                .build();
    }
}