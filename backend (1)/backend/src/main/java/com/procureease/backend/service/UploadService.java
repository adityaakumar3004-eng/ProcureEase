package com.procureease.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UploadService {

    private static final long MAX_FILE_SIZE =
            5 * 1024 * 1024;

    // ============================================================
    // Upload Product Image
    // ============================================================

    public UploadResult uploadProductImage(
            MultipartFile file
    ) throws IOException {

        validateProductImage(file);

        return saveFile(
                file,
                "uploads/products"
        );
    }

    // ============================================================
    // Upload Invoice
    // ============================================================

    public UploadResult uploadInvoice(
            MultipartFile file
    ) throws IOException {

        validateInvoice(file);

        return saveFile(
                file,
                "uploads/invoices"
        );
    }

    // ============================================================
    // Validate Product Image
    // ============================================================

    private void validateProductImage(
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "No image uploaded."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File size must not exceed 5 MB."
            );
        }

        String originalFilename =
                file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.contains(".")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed."
            );
        }

        String extension =
                originalFilename.substring(
                        originalFilename.lastIndexOf(".") + 1
                ).toLowerCase();

        boolean validExtension =
                extension.equals("jpg") ||
                        extension.equals("jpeg") ||
                        extension.equals("png") ||
                        extension.equals("webp");

        if (!validExtension) {
            throw new IllegalArgumentException(
                    "Only image files are allowed."
            );
        }
    }

    // ============================================================
    // Validate Invoice
    // ============================================================

    private void validateInvoice(
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "No invoice uploaded."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File size must not exceed 5 MB."
            );
        }

        String originalFilename =
                file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.toLowerCase().endsWith(".pdf")) {

            throw new IllegalArgumentException(
                    "Only PDF files are allowed."
            );
        }
    }

    // ============================================================
    // Save File
    // ============================================================

    private UploadResult saveFile(
            MultipartFile file,
            String directory
    ) throws IOException {

        Path uploadPath =
                Paths.get(directory)
                        .toAbsolutePath()
                        .normalize();

        Files.createDirectories(uploadPath);

        String originalFilename =
                file.getOriginalFilename();

        String extension = "";

        if (originalFilename != null &&
                originalFilename.contains(".")) {

            extension =
                    originalFilename.substring(
                            originalFilename.lastIndexOf(".")
                    );
        }

        String fileName =
                System.currentTimeMillis()
                        + "-"
                        + UUID.randomUUID()
                        + extension;

        Path filePath =
                uploadPath.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath
        );

        return new UploadResult(
                fileName,
                filePath.toString()
        );
    }

    // ============================================================
    // Upload Result
    // ============================================================

    public record UploadResult(
            String fileName,
            String path
    ) {
    }
}