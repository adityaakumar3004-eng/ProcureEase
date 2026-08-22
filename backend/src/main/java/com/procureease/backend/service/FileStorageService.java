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

    private final Path productUploadDirectory;

    public FileStorageService() {

        productUploadDirectory =
                Paths.get(
                        System.getProperty("user.dir"),
                        "uploads",
                        "products"
                ).toAbsolutePath().normalize();

        try {
            Files.createDirectories(productUploadDirectory);

            System.out.println(
                    "Product upload directory: "
                            + productUploadDirectory
            );

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

        String originalFilename =
                file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.contains(".")) {

            throw new IllegalArgumentException(
                    "Invalid image file."
            );
        }

        String extension =
                originalFilename
                        .substring(
                                originalFilename.lastIndexOf(".") + 1
                        )
                        .toLowerCase(Locale.ROOT);

        if (!(extension.equals("jpg")
                || extension.equals("jpeg")
                || extension.equals("png")
                || extension.equals("webp"))) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
            );
        }

        if (file.getSize() > 5 * 1024 * 1024) {

            throw new IllegalArgumentException(
                    "Image size must not exceed 5 MB."
            );
        }

        String filename =
                UUID.randomUUID() + "." + extension;

        try {

            Path targetPath =
                    productUploadDirectory
                            .resolve(filename)
                            .normalize();

            file.transferTo(
                    targetPath.toFile()
            );

            System.out.println(
                    "Image saved successfully: "
                            + targetPath
            );

            return filename;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store product image",
                    e
            );
        }
    }
}