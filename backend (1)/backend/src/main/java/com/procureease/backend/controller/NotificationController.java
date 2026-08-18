package com.procureease.backend.controller;

import com.procureease.backend.dto.NotificationResponse;
import com.procureease.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ============================================================
    // Generate Low Stock Notifications
    // ============================================================

    @PostMapping("/low-stock")
    public ResponseEntity<Map<String, Object>>
    generateLowStockNotifications() {

        int notificationsCreated =
                notificationService
                        .generateLowStockNotifications();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                notificationsCreated +
                        " low stock notification(s) created."
        );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    // ============================================================
    // Get All Notifications
    // ============================================================

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNotifications() {

        List<NotificationResponse> notifications =
                notificationService.getAllNotifications();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("count", notifications.size());
        response.put("data", notifications);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Mark Notification As Read
    // ============================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(
            @PathVariable Integer id
    ) {

        notificationService.markNotificationAsRead(id);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                "Notification marked as read."
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Delete Notification
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(
            @PathVariable Integer id
    ) {

        notificationService.deleteNotification(id);

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                "Notification deleted successfully."
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Create Purchase Update Notification
    // ============================================================

    @PostMapping("/purchase-update")
    public ResponseEntity<Map<String, Object>>
    createPurchaseUpdateNotification(
            @RequestParam Integer purchaseOrderId,
            @RequestParam String status
    ) {

        notificationService.createNotification(
                "Purchase Order Updated",
                "Purchase Order #" +
                        purchaseOrderId +
                        " has been " +
                        status +
                        ".",
                "Purchase Update"
        );

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                "Purchase update notification created successfully."
        );

        return ResponseEntity.status(201).body(response);
    }
}