package com.procureease.backend.repository;

import com.procureease.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository
        extends JpaRepository<Notification, Integer> {

    // ============================================================
    // Find Duplicate Unread Notification
    // ============================================================

    Optional<Notification> findByTitleAndMessageAndTypeAndIsReadFalse(
            String title,
            String message,
            String type
    );

    // ============================================================
    // Get All Notifications - Newest First
    // ============================================================

    List<Notification> findAllByOrderByCreatedAtDesc();

    // ============================================================
    // Count Unread Notifications
    // ============================================================

    long countByIsReadFalse();

    // ============================================================
    // Get All Unread Notifications
    // ============================================================

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();
}