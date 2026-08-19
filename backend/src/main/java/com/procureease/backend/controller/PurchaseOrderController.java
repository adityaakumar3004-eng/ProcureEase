package com.procureease.backend.controller;

import com.procureease.backend.dto.PurchaseOrderRequest;
import com.procureease.backend.dto.PurchaseOrderResponse;
import com.procureease.backend.dto.PurchaseOrderStatusRequest;
import com.procureease.backend.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    // ============================================================
    // Create Purchase Order
    // ============================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> createPurchaseOrder(

            @Valid @RequestBody
            PurchaseOrderRequest request
    ) {

        PurchaseOrderResponse order =
                purchaseOrderService.createPurchaseOrder(
                        request
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Purchase Order created successfully"
        );
        response.put("data", order);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ============================================================
    // Get All Purchase Orders
    // ============================================================

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')"
    )
    public ResponseEntity<Map<String, Object>>
    getAllPurchaseOrders() {

        List<PurchaseOrderResponse> orders =
                purchaseOrderService.getAllPurchaseOrders();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("data", orders);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Get Purchase Order By ID
    // ============================================================

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')"
    )
    public ResponseEntity<Map<String, Object>>
    getPurchaseOrderById(
            @PathVariable Integer id
    ) {

        PurchaseOrderResponse order =
                purchaseOrderService.getPurchaseOrderById(
                        id
                );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("data", order);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Update Purchase Order Status
    // ============================================================

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>>
    updatePurchaseOrderStatus(

            @PathVariable Integer id,

            @Valid @RequestBody
            PurchaseOrderStatusRequest request
    ) {

        purchaseOrderService.updatePurchaseOrderStatus(
                id,
                request.getStatus()
        );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Purchase Order status updated successfully"
        );

        return ResponseEntity.ok(response);
    }
}