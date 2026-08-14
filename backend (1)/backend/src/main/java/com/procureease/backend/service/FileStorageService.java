package com.procureease.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path productUploadDirectory =
            Paths.get("uploads/products");

    public FileStorageService() {

        try {
            Files.createDirectories(productUploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create upload directory",
                    e
            );
        }
    }

    // ============================================================
    // Store Product Image
    // ============================================================

    public String storeProductImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.contains(".")) {

            throw new IllegalArgumentException(
                    "Invalid image file."
            );
        }

        // Get file extension
        String extension =
                originalFilename
                        .substring(
                                originalFilename.lastIndexOf(".") + 1
                        )
                        .toLowerCase(Locale.ROOT);

        // Check extension
        if (!(extension.equals("jpg")
                || extension.equals("jpeg")
                || extension.equals("png")
                || extension.equals("webp"))) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
            );
        }

        // Check file size
        if (file.getSize() > 5 * 1024 * 1024) {

            throw new IllegalArgumentException(
                    "Image size must not exceed 5 MB."
            );
        }

        // Generate unique filename
        String filename =
                UUID.randomUUID() + "." + extension;

        try {

            Path targetPath =
                    productUploadDirectory.resolve(filename);

            file.transferTo(targetPath);

            return filename;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store product image",
                    e
            );
        }
    }
}