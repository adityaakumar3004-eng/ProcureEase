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
    // Get All Notifications
    // ============================================================

    @GetMapping
    public ResponseEntity<Map<String, Object>>
    getAllNotifications() {

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
    // Get Unread Notifications
    // ============================================================

    @GetMapping("/unread")
    public ResponseEntity<Map<String, Object>>
    getUnreadNotifications() {

        List<NotificationResponse> notifications =
                notificationService.getUnreadNotifications();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("count", notifications.size());
        response.put("data", notifications);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Get Unread Notification Count
    // ============================================================

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>>
    getUnreadNotificationCount() {

        long count =
                notificationService
                        .getUnreadNotificationCount();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put("count", count);

        return ResponseEntity.ok(response);
    }

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
    // Generate Payment Due Notifications
    // ============================================================

    @PostMapping("/payment-due")
    public ResponseEntity<Map<String, Object>>
    generatePaymentDueNotifications() {

        int notificationsCreated =
                notificationService
                        .generatePaymentDueNotifications();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                notificationsCreated +
                        " payment due notification(s) created."
        );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    // ============================================================
    // Mark Notification As Read
    // ============================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>>
    markNotificationAsRead(
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
    // Mark All Notifications As Read
    // ============================================================

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>>
    markAllNotificationsAsRead() {

        notificationService
                .markAllNotificationsAsRead();

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);

        response.put(
                "message",
                "All notifications marked as read."
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // Delete Notification
    // ============================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>>
    deleteNotification(
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

        return ResponseEntity
                .status(201)
                .body(response);
    }
}