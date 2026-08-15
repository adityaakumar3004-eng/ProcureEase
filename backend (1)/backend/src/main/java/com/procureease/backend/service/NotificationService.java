package com.procureease.backend.service;

import com.procureease.backend.dto.NotificationResponse;
import com.procureease.backend.entity.Notification;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private static final int LOW_STOCK_LIMIT = 10;

    // ============================================================
    // Create Notification
    // ============================================================

    public NotificationResponse createNotification(
            String title,
            String message,
            String type
    ) {

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        Notification savedNotification =
                notificationRepository.save(notification);

        return mapToResponse(savedNotification);
    }

    // ============================================================
    // Get All Notifications
    // ============================================================

    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============================================================
    // Mark Notification As Read
    // ============================================================

    public void markNotificationAsRead(Integer id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found"
                                )
                        );

        notification.setIsRead(true);

        notificationRepository.save(notification);
    }

    // ============================================================
    // Delete Notification
    // ============================================================

    public void deleteNotification(Integer id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found"
                                )
                        );

        notificationRepository.delete(notification);
    }

    // ============================================================
    // Create Notification If Not Exists
    // ============================================================

    public boolean createNotificationIfNotExists(
            String title,
            String message,
            String type
    ) {

        boolean exists =
                notificationRepository
                        .findByTitleAndMessageAndTypeAndIsReadFalse(
                                title,
                                message,
                                type
                        )
                        .isPresent();

        if (exists) {
            return false;
        }

        createNotification(
                title,
                message,
                type
        );

        return true;
    }

    // ============================================================
    // Create Low Stock Notification
    // ============================================================

    public boolean createLowStockNotification(
            String productName,
            Integer stock
    ) {

        if (stock > LOW_STOCK_LIMIT) {
            return false;
        }

        String title = "Low Stock Alert";

        String message =
                productName +
                        " stock is low (" +
                        stock +
                        " left).";

        return createNotificationIfNotExists(
                title,
                message,
                "Low Stock"
        );
    }

    // ============================================================
    // Convert Entity → Response DTO
    // ============================================================

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}