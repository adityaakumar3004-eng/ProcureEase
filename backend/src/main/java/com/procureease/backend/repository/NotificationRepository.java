package com.procureease.backend.repository;

import com.procureease.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationRepository
        extends JpaRepository<Notification, Integer> {

    // Find an unread notification with the same details
    Optional<Notification> findByTitleAndMessageAndTypeAndIsReadFalse(
            String title,
            String message,
            String type
    );
}